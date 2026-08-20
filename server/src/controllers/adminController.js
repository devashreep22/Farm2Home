const Product = require('../models/Product');
const User = require('../models/User');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.json({
      status: true,
      message: 'Users fetched',
      data: { users }
    });
  } catch (err) {
    console.error('Error fetching users:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Toggle user active/inactive status
exports.toggleActive = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      status: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      data: { user }
    });

  } catch (err) {
    console.error('Error toggling user status:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Get all pending products
exports.getPendingProducts = async (req, res) => {
  try {
    console.log('Fetching pending products...');

    const products = await Product.find({ status: 'pending' })
      .populate('farmer', 'name farmName email')
      .sort({ createdAt: -1 });

    console.log(`Found ${products.length} pending products`);

    res.json({
      status: true,
      message: 'Pending products fetched',
      data: { products }
    });

  } catch (err) {
    console.error('Error fetching pending products:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Approve or reject a product
exports.approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`Updating product ${id} with status: ${status}`);

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid status. Use "approved" or "rejected"'
      });
    }

    // Find product
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Product not found'
      });
    }

    // Update status
    product.status = status;
    await product.save();

    console.log(`Product ${id} status updated to ${status}`);

    res.json({
      status: true,
      message: `Product ${status} successfully`,
      data: { product }
    });

  } catch (err) {
    console.error('Error updating product:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Verify farmer
exports.verifyFarmer = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user || user.role !== 'farmer') {
      return res.status(404).json({
        status: false,
        message: 'Farmer not found'
      });
    }

    user.isVerified = true;
    await user.save();

    res.json({
      status: true,
      message: 'Farmer verified',
      data: { user }
    });

  } catch (err) {
    console.error('Error verifying farmer:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};