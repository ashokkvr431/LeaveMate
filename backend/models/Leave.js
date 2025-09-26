const db = require("../config/db");

exports.createRequest = (empId, leave_type_id, start_date, end_date, days, reason) =>
  db.query(
    "INSERT INTO leave_requests (empId, leave_type_id, start_date, end_date, days, reason) VALUES (?,?,?,?,?,?)",
    [empId, leave_type_id, start_date, end_date, days, reason]
  );

exports.forUser = (empId) =>
  db.query(
    `SELECT lr.*, lt.name as leave_type
     FROM leave_requests lr
     JOIN leave_types lt ON lt.id=lr.leave_type_id
     WHERE lr.empId=? 
     ORDER BY lr.created_at DESC`,
    [empId]
  );

exports.pending = () =>
  db.query(
    `SELECT lr.*, u.empId, u.name as user_name, lt.name as leave_type
     FROM leave_requests lr
     JOIN users u ON u.empId=lr.empId
     JOIN leave_types lt ON lt.id=lr.leave_type_id
     WHERE lr.status='pending'
     ORDER BY lr.created_at DESC`
  );

exports.updateStatus = (id, status, manager_comment = null) =>
  db.query(
    "UPDATE leave_requests SET status=?, manager_comment=?, updated_at=NOW() WHERE id=?",
    [status, manager_comment, id]
  );


  