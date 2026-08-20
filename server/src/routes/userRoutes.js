const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

const {
  protect,
  adminOnly
} = require('../middleware/auth');


// ======================================
// CURRENT USER
// ======================================

// Get logged-in user's profile
router.get(
  '/me',
  protect,
  userController.getProfile
);


// ======================================
// ADMIN
// ======================================

// Verify farmer
router.patch(
  '/verify/:id',
  protect,
  adminOnly,
  userController.verifyFarmer
);


module.exports = router;