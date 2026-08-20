const express = require('express');

const router = express.Router();

const adminController = require('../controllers/adminController');

const {
  protect,
  adminOnly
} = require('../middleware/auth');


// ===============================
// PRODUCT MANAGEMENT
// ===============================

// Get all pending products
router.get(
  '/pending-products',
  protect,
  adminOnly,
  adminController.getPendingProducts
);

// Approve / reject product
router.patch(
  '/products/:id/approve',
  protect,
  adminOnly,
  adminController.approveProduct
);


// ===============================
// FARMER MANAGEMENT
// ===============================

// Verify farmer
router.patch(
  '/verify-farmer/:id',
  protect,
  adminOnly,
  adminController.verifyFarmer
);


// ===============================
// USER MANAGEMENT
// ===============================

// Get all users
router.get(
  '/get-users',
  protect,
  adminOnly,
  adminController.getUsers
);

// Activate / deactivate user
router.patch(
  '/toggle-active/:id',
  protect,
  adminOnly,
  adminController.toggleActive
);


module.exports = router;