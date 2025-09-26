const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password, gender } = req.body;

  if (!name || !email || !password || !gender) {
    return res.status(400).json({ status: 'error', message: 'All fields are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ status: 'error', message: 'Database error' });

    if (result.length > 0) {
      return res.status(409).json({ status: 'error', message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query( 
      'INSERT INTO users (name, email, password, gender) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, gender],
      (err) => {
        if (err) return res.status(500).json({ status: 'error', message: 'Database insert error' });
        res.status(201).json({ status: 'success', message: 'User registered successfully' });
      }
    );
  });
});


router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ status: 'error', message: 'Database error' });

    if (result.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    res.status(200).json({ status: 'success', message: 'Login successful', user });
  });
});

module.exports = router;  