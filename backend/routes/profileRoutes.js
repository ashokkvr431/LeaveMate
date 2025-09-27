const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { verifyToken } = require("../middleware/auth");
const profileController = require("../controllers/profileController");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `photo_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Routes
router.get("/me", verifyToken, profileController.me);
router.put("/me", verifyToken, upload.single("photo"), profileController.updateMe);

module.exports = router;
