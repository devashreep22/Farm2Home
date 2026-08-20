const express = require('express');

const router = express.Router();

const orderController = require('../controllers/orderController');
const orderDetailsController = require('../controllers/orderDetailsController');

const {
  protect,
  farmerOnly,
  adminOnly
} = require('../middleware/auth');


// ===============================
// BUYER
// ===============================

// Place order
router.post(
  '/',
  protect,
  orderController.placeOrder
);

// Get logged-in buyer's orders
router.get(
  '/my',
  protect,
  orderController.getMyOrders
);


// ===============================
// FARMER
// ===============================

// Get orders containing farmer's products
router.get(
  '/farmer',
  protect,
  farmerOnly,
  orderController.getFarmerOrders
);


// ===============================
// ADMIN
// ===============================

// Get all orders
router.get(
  '/all',
  protect,
  adminOnly,
  orderController.getAllOrders
);


// ===============================
// ORDER DETAILS
// ===============================

// Buyer / farmer / admin can view appropriate orders
router.get(
  '/:id',
  protect,
  orderDetailsController.getOrderById
);


// ===============================
// ORDER STATUS
// ===============================

// Admin can update order status
router.patch(
  '/:id/status',
  protect,
  adminOnly,
  orderController.updateOrderStatus
);


module.exports = router;