const db = require("../config/db");

// Insert new QR attendance
exports.insertQRLog = async ({ empId, qrToken, logDate, loginTime, scannedData }) => {
  await db.query(
    `INSERT INTO attendance (empId, qrToken, log_date, login_time, scannedData) 
     VALUES (?, ?, ?, ?, ?)`,
    [empId, qrToken, logDate, loginTime, scannedData]
  );
};

// Check if QR token already exists (to avoid duplicates)
exports.existsQRToken = async (qrToken) => {
  const [rows] = await db.query(
    "SELECT * FROM attendance WHERE qrToken = ?",
    [qrToken]
  );
  return rows.length > 0;
};

// Get all attendance (admin view)
exports.allAttendance = async () => {
  const [rows] = await db.query(
    `SELECT a.*, u.name, u.empId, u.email 
     FROM attendance a 
     JOIN users u ON u.empId = a.empId 
     ORDER BY a.login_time DESC`
  );
  return rows;
};

