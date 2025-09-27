const db = require("../config/db");

// Get all announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM announcements ORDER BY date DESC");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new announcement
exports.addAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required" });
    }

    const [result] = await db.query(
      "INSERT INTO announcements (title, message, date) VALUES (?, ?, NOW())",
      [title, message]
    );

    res.json({
      id: result.insertId,
      title,
      message,
      date: new Date()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM announcements WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
