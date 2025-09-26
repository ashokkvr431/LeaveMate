const db = require("../config/db");

// Apply for leave
exports.apply = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const { leave_type_id, start_date, end_date, days, duration, reason, notes } = req.body;
    if (!leave_type_id || !start_date || !end_date || !days) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [user] = await db.query("SELECT empId, name FROM users WHERE id=?", [req.user.id]);
    if (!user.length) return res.status(404).json({ message: "User not found" });

    const empId = user[0].empId;

    const [lt] = await db.query("SELECT * FROM leave_types WHERE id=?", [leave_type_id]);
    if (!lt.length) return res.status(400).json({ message: "Invalid leave type" });

    let file_url = null;
    if (req.file) file_url = `/uploads/${req.file.filename}`;

    await db.query(
      `INSERT INTO leave_requests 
       (empId, leave_type_id, start_date, end_date, days, duration, reason, notes, file_url, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [empId, leave_type_id, start_date, end_date, parseFloat(days), duration, reason || null, notes || null, file_url]
    );

    res.status(201).json({ message: "Leave request submitted successfully" });
  } catch (err) {
    console.error("Apply Leave Error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// Get my leaves
exports.my = async (req, res) => {
  try {
    const [user] = await db.query("SELECT empId FROM users WHERE id=?", [req.user.id]);
    if (!user.length) return res.status(404).json({ message: "User not found" });

    const empId = user[0].empId;
    const [rows] = await db.query(
      `SELECT lr.*, lt.name as leave_type
       FROM leave_requests lr
       JOIN leave_types lt ON lt.id=lr.leave_type_id
       WHERE lr.empId=? 
       ORDER BY lr.created_at DESC`,
      [empId]
    );

    res.json(rows);
  } catch (err) {
    console.error("My Leaves Error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// Admin pending approvals
exports.pending = async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
         lr.id,
         lr.empId,
         u.name AS emp_name,
         u.empId AS emp_id,
         lt.name AS leave_type_name,
         lr.leave_type_id,
         lr.start_date,
         lr.end_date,
         lr.days,
         lr.reason,
         lr.status,
         lr.file_url,
         lr.created_at
       FROM leave_requests lr
       JOIN users u ON u.empId = lr.empId
       JOIN leave_types lt ON lt.id = lr.leave_type_id
       WHERE lr.status='pending'
       ORDER BY lr.created_at DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error("Pending Leaves Error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};



// Approve / Reject
exports.setStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, manager_comment } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await db.query(
      "UPDATE leave_requests SET status=?, manager_comment=?, updated_at=NOW() WHERE id=?",
      [status, manager_comment || null, id]
    );

    res.json({ message: `Leave ${status}` });
  } catch (err) {
    console.error("Set Status Error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// Admin approved leaves
exports.approved = async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
         lr.id,
         lr.empId,
         u.name AS emp_name,
         u.empId AS emp_id,
         lt.name AS leave_type_name,
         lr.leave_type_id,
         lr.start_date,
         lr.end_date,
         lr.days,
         lr.reason,
         lr.status,
         lr.file_url,
         lr.created_at
       FROM leave_requests lr
       JOIN users u ON u.empId = lr.empId
       JOIN leave_types lt ON lt.id = lr.leave_type_id
       WHERE lr.status='approved'
       ORDER BY lr.updated_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Approved Leaves Error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// Admin rejected leaves
exports.rejected = async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
         lr.id,
         lr.empId,
         u.name AS emp_name,
         u.empId AS emp_id,
         lt.name AS leave_type_name,
         lr.leave_type_id,
         lr.start_date,
         lr.end_date,
         lr.days,
         lr.reason,
         lr.status,
         lr.file_url,
         lr.created_at
       FROM leave_requests lr
       JOIN users u ON u.empId = lr.empId
       JOIN leave_types lt ON lt.id = lr.leave_type_id
       WHERE lr.status='rejected'
       ORDER BY lr.updated_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Rejected Leaves Error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};
