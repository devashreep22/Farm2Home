const User = require('../models/User');


// Get Logged-in User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    res.json({
      status: true,
      data: user
    });

  } catch (err) {
    console.error('Get profile error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Verify Farmer
exports.verifyFarmer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

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
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });

  } catch (err) {
    console.error('Verify farmer error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};