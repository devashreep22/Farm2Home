const Order = require('../models/Order');
const Product = require('../models/Product');


// Place Order
exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: false,
        message: 'Order must contain at least one product'
      });
    }

    // Validate shipping address
    if (!shippingAddress) {
      return res.status(400).json({
        status: false,
        message: 'Shipping address is required'
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {

      // Validate item
      if (!item.product || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          status: false,
          message: 'Invalid order item'
        });
      }

      const product = await Product.findById(item.product);

      // Check product
      if (!product || product.status !== 'approved') {
        return res.status(400).json({
          status: false,
          message: 'Invalid or unavailable product'
        });
      }

      // Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          status: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      // Reduce stock
      product.stock -= Number(item.quantity);

      await product.save();

      // Add item to order
      orderItems.push({
        product: product._id,
        farmer: product.farmer,
        quantity: Number(item.quantity),
        price: product.price
      });

      // Calculate total
      totalAmount += product.price * Number(item.quantity);
    }

    // Create order
    const order = new Order({
      buyer: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod: 'COD',
      totalAmount
    });

    await order.save();

    res.status(201).json({
      status: true,
      message: 'Order placed successfully',
      data: order
    });

  } catch (err) {
    console.error('Place order error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Get Buyer's Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      buyer: req.user.id
    })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      data: orders
    });

  } catch (err) {
    console.error('Get my orders error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Get Farmer's Orders
exports.getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      'items.farmer': req.user.id
    })
      .populate('buyer', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      data: orders
    });

  } catch (err) {
    console.error('Get farmer orders error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('buyer', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      data: orders
    });

  } catch (err) {
    console.error('Get all orders error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Allowed order statuses
    const allowedStatuses = [
      'pending',
      'confirmed',
      'shipped',
      'delivered',
      'cancelled'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid order status'
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        status: false,
        message: 'Order not found'
      });
    }

    order.status = status;

    await order.save();

    res.json({
      status: true,
      message: 'Order status updated',
      data: order
    });

  } catch (err) {
    console.error('Update order status error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};