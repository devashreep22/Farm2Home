const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Basic user information
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    // User role
    role: {
      type: String,
      enum: ['buyer', 'farmer', 'admin'],
      default: 'buyer',
      index: true
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true
    },

    // Farmer-specific information
    farmName: {
      type: String,
      trim: true
    },

    farmAddress: {
      type: String,
      trim: true
    },

    cropTypes: [
      {
        type: String,
        trim: true
      }
    ],

    // Admin verification for farmers
    isVerified: {
      type: Boolean,
      default: false
    },

    // Buyer shipping addresses
    addresses: [
      {
        label: {
          type: String,
          trim: true
        },

        addressLine: {
          type: String,
          trim: true
        },

        city: {
          type: String,
          trim: true
        },

        state: {
          type: String,
          trim: true
        },

        pincode: {
          type: String,
          trim: true
        },

        phone: {
          type: String,
          trim: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);