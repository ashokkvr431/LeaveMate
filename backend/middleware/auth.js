const jwt = require("jsonwebtoken");

// Verify JWT Token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Format: "Bearer <token>"
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, empId, role, name, email, iat, exp }
    next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Role-based access check
exports.requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.log(`Access denied. User role: ${req.user?.role}, Required: ${roles}`);
      return res.status(403).json({ message: "Forbidden - role mismatch" });
    }
    next();
  };
};


// const jwt = require("jsonwebtoken");

// // Verify JWT Token
// exports.verifyToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"] || req.headers["Authorization"];
//   if (!authHeader) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   // Format: "Bearer <token>"
//   const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

//   if (!token) {
//     return res.status(401).json({ message: "Token missing" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // decoded should look like: { id, empId, role, name, email, iat, exp }
//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.error(" Invalid token:", err.message);
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// //  Role-based access check
// exports.requireRole = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       console.log(`Access denied. User role: ${req.user?.role}, Required: ${roles}`);
//       return res.status(403).json({ message: "Forbidden - role mismatch" });
//     }
//     next();
//   };
// };



// const jwt = require("jsonwebtoken");

// // Verify JWT token
// exports.verifyToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) return res.status(403).json({ message: "No token provided" });

//   const token = authHeader.split(" ")[1];
//   if (!token) return res.status(403).json({ message: "Token missing" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // { id, empId, role, name, email }
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// // Role-based access
// exports.requireRole = (...roles) => {
//   return (req, res, next) => {
//     console.log("🔎 User from token:", req.user);
//     console.log("🔎 Allowed roles:", roles);

//     if (!req.user || !roles.includes(req.user.role)) {
//       return res.status(403).json({ message: "Forbidden - role mismatch" });
//     }
//     next();
//   };
// };



// const jwt = require('jsonwebtoken');

// exports.verifyToken = (req, res, next) => {
//   const auth = req.headers.authorization || '';
//   const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

//   if (!token) {
//     console.error('No token provided in Authorization header');
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('oken decoded:', payload);
//     req.user = payload; // { id, role, name, email }
//     next();
//   } catch (err) {
//     console.error('Invalid token:', err.message);
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// exports.requireRole = (...roles) => (req, res, next) => {
//   if (!req.user || !roles.includes(req.user.role)) {
//     console.error('Forbidden: role mismatch', { user: req.user, roles });
//     return res.status(403).json({ message: 'Forbidden' });
//   }
//   next();
// };




// const { verify } = require('../utils/jwt');

// async function authMiddleware(req, res, next) {
//   const authHeader = req.headers['authorization'] || req.headers['Authorization'];
//   if (!authHeader) return res.status(401).json({ status: 'error', message: 'No token provided' });

//   const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
//   if (!token) return res.status(401).json({ status: 'error', message: 'Invalid token' });

//   try {
//     const decoded = verify(token);
//     req.user = decoded; // should contain id, email, role
//     next();
//   } catch (err) {
//     return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
//   }
// }

// function roleCheck(role) {
//   return (req, res, next) => {
//     if (!req.user) return res.status(401).json({ status: 'error', message: 'Not authenticated' });
//     if (req.user.role !== role) return res.status(403).json({ status: 'error', message: 'Forbidden' });
//     next();
//   };
// }

// module.exports = { authMiddleware, roleCheck };

