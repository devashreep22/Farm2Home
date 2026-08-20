const Order = require('../models/Order');

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('buyer', 'name email')
      .populate('items.product')
      .populate('items.farmer', 'name farmName');

    // Order not found
    if (!order) {
      return res.status(404).json({
        status: false,
        message: 'Order not found'
      });
    }

    // Admin can view any order
    if (req.user.role === 'admin') {
      return res.json({
        status: true,
        data: order
      });
    }

    // Buyer authorization
    if (req.user.role === 'buyer') {
      if (!order.buyer || order.buyer._id.toString() !== req.user.id) {
        return res.status(403).json({
          status: false,
          message: 'Not authorized'
        });
      }
    }

    // Farmer authorization
    if (req.user.role === 'farmer') {
      const isInvolvedFarmer = order.items.some(
        item =>
          item.farmer &&
          item.farmer._id.toString() === req.user.id
      );

      if (!isInvolvedFarmer) {
        return res.status(403).json({
          status: false,
          message: 'Not authorized'
        });
      }
    }

    res.json({
      status: true,
      data: order
    });

  } catch (err) {
    console.error('Get order error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};