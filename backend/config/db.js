const mysql = require("mysql2/promise");

// Create connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "leave_attendance",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection()
  .then(() => console.log("MySQL connected"))
  .catch(err => console.error("MySQL connection failed:", err));

module.exports = db;





// const mysql = require('mysql2');
// require('dotenv').config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || '127.0.0.1',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASS || '',
//   database: process.env.DB_NAME || 'leave_attendance',
//   waitForConnections: true,
//   connectionLimit: 10
// });

// module.exports = pool.promise();