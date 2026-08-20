const express = require('express');

const router = express.Router();

const productController = require('../controllers/productController');

const {
  protect,
  farmerOnly,
  adminOnly
} = require('../middleware/auth');

const multer = require('multer');
const path = require('path');


// ======================================
// MULTER IMAGE UPLOAD
// ======================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },

  filename: function (req, file, cb) {
    const uniqueName =
      `${Date.now()}-${file.originalname}`;

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage
});


// ======================================
// FARMER ROUTES
// ======================================

// Create product
router.post(
  '/',
  protect,
  farmerOnly,
  upload.single('image'),
  productController.createProduct
);


// Update product
router.put(
  '/:id',
  protect,
  farmerOnly,
  upload.single('image'),
  productController.updateProduct
);


// Delete product
router.delete(
  '/:id',
  protect,
  farmerOnly,
  productController.deleteProduct
);


// Get farmer's products
// IMPORTANT: must come BEFORE /:id
router.get(
  '/farmer/my-products',
  protect,
  farmerOnly,
  productController.getFarmerProducts
);


// ======================================
// ADMIN ROUTES
// ======================================

// Approve / reject product
// IMPORTANT: must come BEFORE /:id
router.patch(
  '/approve/:id',
  protect,
  adminOnly,
  productController.approveProduct
);


// ======================================
// PUBLIC ROUTES
// ======================================

// Get all approved products
router.get(
  '/',
  productController.getProducts
);


// Get single approved product
// Keep this LAST
router.get(
  '/:id',
  productController.getProductById
);


module.exports = router;