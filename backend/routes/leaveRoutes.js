const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { verifyToken, requireRole } = require("../middleware/auth");
const leaveController = require("../controllers/leaveController");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// User routes
router.post("/apply", verifyToken, requireRole("user", "admin"), upload.single("file"), leaveController.apply);
router.get("/my", verifyToken, requireRole("user", "admin"), leaveController.my);

// Admin routes
router.get("/pending", verifyToken, requireRole("admin"), leaveController.pending);
router.put("/:id/status", verifyToken, requireRole("admin"), leaveController.setStatus);

// Admin routes
router.get("/approved", verifyToken, requireRole("admin"), leaveController.approved);
router.get("/rejected", verifyToken, requireRole("admin"), leaveController.rejected);

module.exports = router;

