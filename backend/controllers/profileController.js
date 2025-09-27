const db = require("../config/db");

// Helper: get frontend URL with fallback
const getFrontendUrl = () => process.env.FRONTEND_URL || "http://10.70.9.8:4200";

// GET /api/profile/me
exports.me = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, empId, name, email, phone, gender, role, department, photo FROM users WHERE id=?",
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    let user = rows[0];

    // If user has uploaded photo → show it
    if (user.photo) {
      user.photo = `${req.protocol}://${req.get("host")}/uploads/${user.photo}`;
    } else {
      // Serve default image from frontend
      user.photo = `${getFrontendUrl()}/assets/default-profile.png`;
    }

    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/profile/me
exports.updateMe = async (req, res) => {
  try {
    const { name, phone, gender, department } = req.body;
    let photoFile;

    if (req.file) {
      // new file uploaded
      photoFile = req.file.filename;
    } else {
      // keep old photo if exists, else null (frontend will show default)
      const [rows] = await db.query("SELECT photo FROM users WHERE id=?", [
        req.user.id,
      ]);
      photoFile = rows[0]?.photo || null;
    }

    await db.query(
      "UPDATE users SET name=?, phone=?, gender=?, department=?, photo=? WHERE id=?",
      [
        name || null,
        phone || null,
        gender || null,
        department || null,
        photoFile,
        req.user.id,
      ]
    );

    res.json({
      message: "Profile updated",
      photo: photoFile
        ? `${req.protocol}://${req.get("host")}/uploads/${photoFile}`
        : `${getFrontendUrl()}/assets/default-profile.png`,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
