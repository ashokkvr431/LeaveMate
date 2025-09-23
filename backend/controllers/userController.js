const db = require('../config/db');

exports.list = async (_req, res) => {
  const [rows] = await db.query('SELECT id, name, email, role, department FROM users ORDER BY id DESC');
  res.json(rows);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, department } = req.body;
  await db.query('UPDATE users SET name=?, email=?, role=?, department=? WHERE id=?',
    [name, email, role, department, id]);
  res.json({ message: 'User updated' });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM users WHERE id=?', [id]);
  res.json({ message: 'User deleted' });
};
