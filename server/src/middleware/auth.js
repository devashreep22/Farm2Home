const jwt = require('jsonwebtoken');
const User = require('../models/User');


// Protect routes - user must be logged in
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // No token
    if (!token) {
      return res.status(401).json({
        status: false,
        message: 'Not authorized, no token'
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user
    const user = await User.findById(decoded.id)
      .select('-password');

    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'User not found'
      });
    }

    // Attach user to request
    req.user = user;

    next();

  } catch (err) {
    console.error('Authentication error:', err.message);

    return res.status(401).json({
      status: false,
      message: 'Not authorized, token failed'
    });
  }
};


// Farmer-only routes
exports.farmerOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: false,
      message: 'Not authorized'
    });
  }

  if (req.user.role !== 'farmer') {
    return res.status(403).json({
      status: false,
      message: 'Farmer access only'
    });
  }

  next();
};


// Admin-only routes
exports.adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: false,
      message: 'Not authorized'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: false,
      message: 'Admin access only'
    });
  }

  next();
};