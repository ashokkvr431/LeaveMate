const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../middleware/auth');
const db = require('../config/db');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `photo_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// GET /api/profile/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/profile/me
router.put('/me', verifyToken, upload.single('photo'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.photo = `http://10.70.9.8:3000/uploads/${req.file.filename}`;
    }


    await db.query('UPDATE users SET ? WHERE id = ?', [updates, req.user.id]);

    // ✅ Always return updated user
    const [rows] = await db.query(
      'SELECT id, name, email, phone, gender, role, department, photo FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
});


module.exports = router;
