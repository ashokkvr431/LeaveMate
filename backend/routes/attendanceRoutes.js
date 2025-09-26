const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

// Employee login/logout
router.post("/login", attendanceController.login);
router.post("/logout", attendanceController.logout);

// Attendance list
router.get("/list", attendanceController.list); // all attendance (today or date range)
router.get("/list/:empId", attendanceController.listByEmp); // by employee

// Export reports
router.get("/export/excel", attendanceController.exportExcel);
router.get("/export/pdf", attendanceController.exportPdf);

module.exports = router;
