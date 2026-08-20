const Cart = require('../models/Cart');
const Product = require('../models/Product');


// Get user's cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product');

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }

    res.json({
      status: true,
      data: cart
    });

  } catch (err) {
    console.error('Get cart error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        status: false,
        message: 'Product ID and valid quantity are required'
      });
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product || product.status !== 'approved') {
      return res.status(400).json({
        status: false,
        message: 'Invalid or unavailable product'
      });
    }

    // Check stock
    if (product.quantity < quantity) {
      return res.status(400).json({
        status: false,
        message: `Only ${product.quantity} items available`
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({
      user: req.user.id
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }

    // Check if product already exists
    const idx = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (idx > -1) {
      // Update existing quantity
      const newQuantity = cart.items[idx].quantity + Number(quantity);

      if (newQuantity > product.quantity) {
        return res.status(400).json({
          status: false,
          message: `Only ${product.quantity} items available`
        });
      }

      cart.items[idx].quantity = newQuantity;

    } else {
      // Add new product
      cart.items.push({
        product: productId,
        quantity: Number(quantity)
      });
    }

    await cart.save();

    await cart.populate('items.product');

    res.json({
      status: true,
      message: 'Product added to cart',
      data: cart
    });

  } catch (err) {
    console.error('Add to cart error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        status: false,
        message: 'Product ID and valid quantity are required'
      });
    }

    const cart = await Cart.findOne({
      user: req.user.id
    });

    if (!cart) {
      return res.status(404).json({
        status: false,
        message: 'Cart not found'
      });
    }

    const idx = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (idx === -1) {
      return res.status(404).json({
        status: false,
        message: 'Product not in cart'
      });
    }

    // Check product availability
    const product = await Product.findById(productId);

    if (!product || product.status !== 'approved') {
      return res.status(400).json({
        status: false,
        message: 'Product is no longer available'
      });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({
        status: false,
        message: `Only ${product.quantity} items available`
      });
    }

    cart.items[idx].quantity = Number(quantity);

    await cart.save();

    await cart.populate('items.product');

    res.json({
      status: true,
      message: 'Cart updated',
      data: cart
    });

  } catch (err) {
    console.error('Update cart error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Remove product from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user.id
    });

    if (!cart) {
      return res.status(404).json({
        status: false,
        message: 'Cart not found'
      });
    }

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({
        status: false,
        message: 'Product not in cart'
      });
    }

    await cart.save();

    await cart.populate('items.product');

    res.json({
      status: true,
      message: 'Product removed from cart',
      data: cart
    });

  } catch (err) {
    console.error('Remove from cart error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id
    });

    if (!cart) {
      return res.status(404).json({
        status: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];

    await cart.save();

    res.json({
      status: true,
      message: 'Cart cleared',
      data: cart
    });

  } catch (err) {
    console.error('Clear cart error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};