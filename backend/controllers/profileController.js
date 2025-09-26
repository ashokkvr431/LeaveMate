const db = require("../config/db");  //  FIX: import db

// GET /api/profile/me
exports.me = async (req, res) => {
  try {
    console.log(" req.user:", req.user);

    const [rows] = await db.query(
      "SELECT id, name, email, phone, gender, role, department, photo FROM users WHERE id=?",
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Not found" });
    }

    let user = rows[0];

    if (user.photo) {
      user.photo = `${req.protocol}://${req.get("host")}/uploads/${user.photo}`;
    }

    res.json(user);
  } catch (err) {
    console.error(" Profile fetch error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/profile/me
exports.updateMe = async (req, res) => {
  try {
    const { name, phone, gender, department } = req.body;
    let photoFile = null;

    if (req.file) {
      photoFile = req.file.filename;
    }

    await db.query(
      "UPDATE users SET name=?, phone=?, gender=?, department=?, photo=? WHERE id=?",
      [
        name || null,
        phone || null,
        gender || null,
        department || null,
        photoFile || null,
        req.user.id,
      ]
    );

    res.json({
      message: "Profile updated",
      photo: photoFile
        ? `${req.protocol}://${req.get("host")}/uploads/${photoFile}`
        : null,
    });
  } catch (err) {
    console.error(" Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
