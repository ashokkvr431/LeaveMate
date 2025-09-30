const db = require("../config/db");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

// employee login
exports.login = async (req, res) => {
  try {
    const { empId, latitude, longitude } = req.body;

    // Already logged in check
    const [existing] = await db.query(
      "SELECT * FROM attendance WHERE empId = ? AND date = CURDATE()",
      [empId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Already logged in today",
      });
    }

    // Current time
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    let status = "Absent";

    // Morning Session
    if ((hour >= 6 && hour < 9) || (hour === 9 && minute <= 5)) {
      status = "Present";
    } else if (hour === 9 && minute > 5 && minute < 60) {
      status = "Late";
    } else if (hour >= 10 && hour < 13) {
      status = "Absent";
    }

    await db.query(
      "INSERT INTO attendance (empId, date, login_time, status, latitude, longitude) VALUES (?, CURDATE(), CURTIME(), ?, ?, ?)",
      [empId, status, latitude, longitude]
    );

    res.json({ success: true, message: `Login marked as ${status}` });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Failed to mark login" });
  }
};

// employee logout
exports.logout = async (req, res) => {
  try {
    const { empId, latitude, longitude } = req.body;

    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    let statusUpdate = null;

    // Afternoon Session
    if ((hour === 13 && minute >= 0) || (hour === 14 && minute <= 5)) {
      statusUpdate = "Present"; // 1:00 PM - 2:05 PM
    } else if (hour > 14 && hour < 17) {
      statusUpdate = "Absent"; // 2:06 PM - 4:59 PM
    } else if (hour >= 17 && hour < 18) {
      statusUpdate = "Early Logout"; // 5:00 PM - 5:59 PM
    } else if (hour >= 18) {
      statusUpdate = "Normal Logout"; // 6:00 PM onwards
    }

    const [result] = await db.query(
      "UPDATE attendance SET logout_time = CURTIME(), status = ?, latitude = ?, longitude = ? WHERE empId = ? AND date = CURDATE()",
      [statusUpdate, latitude, longitude, empId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "No login found for today to mark logout",
      });
    }

    res.json({
      success: true,
      message: `Logout marked successfully (${statusUpdate})`,
    });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ error: "Failed to mark logout" });
  }
};


/**
 * List attendance
 */
exports.list = async (req, res) => {
  try {
    const { start_date, end_date, search } = req.query;

    let query = `
      SELECT a.date, a.empId, u.name, u.department,
             a.login_time, a.logout_time, a.status,
             a.latitude, a.longitude
      FROM attendance a
      JOIN users u ON u.empId = a.empId
    `;
    let params = [];
    let conditions = [];

    if (start_date && end_date) {
      conditions.push("a.date BETWEEN ? AND ?");
      params.push(start_date, end_date);
    } else {
      conditions.push("a.date = CURDATE()");
    }

    if (search) {
      conditions.push("(u.empId LIKE ? OR u.name LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY a.date DESC, a.empId ASC";

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("List Attendance Error:", err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
};

// helper for export
const getAttendanceRows = async (start_date, end_date, search) => {
  let query = `
    SELECT a.date, a.empId, u.name, u.department,
           a.login_time, a.logout_time, a.status,
           a.latitude, a.longitude
    FROM attendance a
    JOIN users u ON u.empId = a.empId
  `;
  let params = [];
  let conditions = [];

  if (start_date && end_date) {
    conditions.push("a.date BETWEEN ? AND ?");
    params.push(start_date, end_date);
  } else {
    conditions.push("a.date = CURDATE()");
  }

  if (search) {
    conditions.push("(u.empId LIKE ? OR u.name LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (conditions.length) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY a.date DESC, a.empId ASC";

  const [rows] = await db.query(query, params);
  return rows;
};

exports.exportExcel = async (req, res) => {
  try {
    const rows = await getAttendanceRows(
      req.query.start_date,
      req.query.end_date,
      req.query.search
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance");

    sheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "EmpId", key: "empId", width: 15 },
      { header: "Name", key: "name", width: 25 },
      { header: "Department", key: "department", width: 20 },
      { header: "Login Time", key: "login_time", width: 15 },
      { header: "Logout Time", key: "logout_time", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Latitude", key: "latitude", width: 12 },
      { header: "Longitude", key: "longitude", width: 12 },
    ];

    rows.forEach((row) => {
      sheet.addRow({
        date: new Date(row.date).toLocaleDateString("en-GB"),
        empId: row.empId,
        name: row.name,
        department: row.department,
        login_time: row.login_time || "-",
        logout_time: row.logout_time || "-",
        status: row.status,
        latitude: row.latitude || "-",
        longitude: row.longitude || "-",
      });
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=attendance.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to export Excel" });
  }
};

exports.exportPdf = async (req, res) => {
  try {
    const rows = await getAttendanceRows(
      req.query.start_date,
      req.query.end_date,
      req.query.search
    );

    res.setHeader("Content-Disposition", "attachment; filename=attendance.pdf");
    res.setHeader("Content-Type", "application/pdf");

    const doc = new PDFDocument({ margin: 30, size: "A4" });
    doc.pipe(res);

    doc.fontSize(16).text("Attendance Report", { align: "center" }).moveDown(1);

    const tableTop = 80;
    const itemX = {
      date: 30,
      empId: 90,
      name: 140,
      dept: 270,
      login: 370,
      logout: 430,
      status: 500,
      // lat: 570,
      // lng: 630,
    };

    doc.fontSize(10).text("Date", itemX.date, tableTop);
    doc.text("EmpId", itemX.empId, tableTop);
    doc.text("Name", itemX.name, tableTop);
    doc.text("Department", itemX.dept, tableTop);
    doc.text("Login", itemX.login, tableTop);
    doc.text("Logout", itemX.logout, tableTop);
    doc.text("Status", itemX.status, tableTop);
    // doc.text("Lat", itemX.lat, tableTop);
    // doc.text("Lng", itemX.lng, tableTop);

    let y = tableTop + 20;

    rows.forEach((r) => {
      doc.fontSize(10).text(new Date(r.date).toLocaleDateString("en-GB"), itemX.date, y);
      doc.text(r.empId, itemX.empId, y);
      doc.text(r.name, itemX.name, y);
      doc.text(r.department, itemX.dept, y);
      doc.text(r.login_time || "-", itemX.login, y);
      doc.text(r.logout_time || "-", itemX.logout, y);
      doc.text(r.status, itemX.status, y);
      // doc.text(r.latitude?.toString() || "-", itemX.lat, y);
      // doc.text(r.longitude?.toString() || "-", itemX.lng, y);
      y += 20;
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to export PDF" });
  }
};

/**
 * List attendance by specific employee
 */
exports.listByEmp = async (req, res) => {
  try {
    const { empId } = req.params;
    const { start_date, end_date } = req.query;

    let query = `
      SELECT a.date, a.empId, u.name, u.department,
             a.login_time, a.logout_time, a.status,
             a.latitude, a.longitude
      FROM attendance a
      JOIN users u ON u.empId = a.empId
      WHERE a.empId = ?
    `;
    let params = [empId];

    if (start_date && end_date) {
      query += " AND a.date BETWEEN ? AND ?";
      params.push(start_date, end_date);
    } else {
      query += " AND a.date = CURDATE()";
    }

    query += " ORDER BY a.date DESC";

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("ListByEmp Error:", err);
    res.status(500).json({ error: "Failed to fetch employee attendance" });
  }
};

// attendance summary
exports.summary = async (req, res) => {
  try {
    // total employees
    const [total] = await db.query("SELECT COUNT(*) AS total FROM users");

    // present / late / early logout count for today
    const [present] = await db.query(
      "SELECT COUNT(*) AS present FROM attendance WHERE date = CURDATE() AND status IN ('Present', 'Late', 'Early Logout', 'Normal Logout')"
    );

    const totalEmployees = total[0].total || 0;
    const presentCount = present[0].present || 0;
    const absentCount = totalEmployees - presentCount;

    const percentage = totalEmployees
      ? Math.round((presentCount / totalEmployees) * 100)
      : 0;

    res.json({
      total: totalEmployees,
      present: presentCount,
      absent: absentCount,
      percentage: percentage,
    });
  } catch (err) {
    console.error("Attendance Summary Error:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};
exports.listToday = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.date, a.empId, u.name, u.department,
             a.login_time, a.logout_time, a.status
      FROM attendance a
      JOIN users u ON u.empId = a.empId
      WHERE a.date = CURDATE()
      ORDER BY a.empId ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("List Today Error:", err);
    res.status(500).json({ error: "Failed to fetch today's attendance" });
  }
};
