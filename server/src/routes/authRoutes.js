const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const { protect } = require('../middleware/auth');


// ===============================
// AUTHENTICATION
// ===============================

// Register buyer / farmer
router.post(
  '/register',
  authController.register
);


// Login
router.post(
  '/login',
  authController.login
);


// ===============================
// USER PROFILE
// ===============================

// Get logged-in user's profile
router.get(
  '/me',
  protect,
  userController.getProfile
);


// ===============================
// ADMIN CREATION
// ===============================

// ONLY use this during initial setup.
// Remove or disable after creating the first admin.
router.post(
  '/create-admin',
  authController.createAdmin
);


module.exports = router;