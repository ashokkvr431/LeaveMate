const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, gender, role = "user", department = null } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Check if user already exists
    const [exists] = await db.query("SELECT id FROM users WHERE email=?", [email]);
    if (exists.length) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // First user = admin
    const [countRows] = await db.query("SELECT COUNT(*) as c FROM users");
    const isBootstrap = countRows[0].c === 0;
    const finalRole = isBootstrap ? "admin" : role || "user";

    // Generate empId BEFORE insert
    const [maxRow] = await db.query("SELECT MAX(id) as maxId FROM users");
    const nextId = (maxRow[0].maxId || 0) + 1;
    const empId = `EMP${String(nextId).padStart(4, "0")}`;

    // Insert user with empId directly
    const [result] = await db.query(
      "INSERT INTO users (name, email, phone, password, gender, role, department, empId) VALUES (?,?,?,?,?,?,?,?)",
      [name, email, phone || null, hashed, gender || null, finalRole, department, empId]
    );

    res.status(201).json({
      message: isBootstrap ? "Admin bootstrapped" : "User created",
      empId,
      role: finalRole,
    });
  } catch (e) {
    console.error("Register Error:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
};


// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email=?", [email]);
    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const u = rows[0];
    const ok = await bcrypt.compare(password, u.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Ensure role is valid
    const safeRole = u.role || "user";

    const token = jwt.sign(
      {
        id: u.id,
        empId: u.empId,
        role: safeRole,
        name: u.name,
        email: u.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: u.id,
        empId: u.empId,
        name: u.name,
        email: u.email,
        role: safeRole,
        department: u.department,
      },
    });
  } catch (e) {
    console.error("Login Error:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
};
