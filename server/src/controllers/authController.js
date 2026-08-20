const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      farmName,
      farmAddress,
      cropTypes
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        status: false,
        message: 'Name, email, password, and role are required'
      });
    }

    // Validate role
    const allowedRoles = ['buyer', 'farmer'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid role'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: 'Email already exists'
      });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const userData = {
      name,
      email,
      password: hash,
      role
    };

    // Farmer-specific information
    if (role === 'farmer') {
      userData.farmName = farmName;
      userData.farmAddress = farmAddress;
      userData.cropTypes = cropTypes;
      userData.isVerified = false;
    }

    const user = new User(userData);

    await user.save();

    res.status(201).json({
      status: true,
      message: 'Registration successful, please login.'
    });

  } catch (err) {
    console.error('Registration error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'Invalid credentials'
      });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        status: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    );

    // Send response
    res.json({
      status: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });

  } catch (err) {
    console.error('Login error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Create Admin User
// Use this only for initial admin setup
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: 'Email already exists'
      });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create admin
    const user = new User({
      name,
      email,
      password: hash,
      role: 'admin',
      isVerified: true
    });

    await user.save();

    res.status(201).json({
      status: true,
      message: 'Admin created',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Create admin error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};