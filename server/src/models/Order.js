const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // Buyer who placed the order
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Products in the order
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },

        // Farmer is stored separately so we can
        // easily find orders belonging to a farmer
        farmer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        },

        // Price at the time of purchase
        price: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],

    // Delivery information
    shippingAddress: {
      name: {
        type: String,
        required: true
      },

      addressLine: {
        type: String,
        required: true
      },

      city: {
        type: String,
        required: true
      },

      state: {
        type: String,
        required: true
      },

      pincode: {
        type: String,
        required: true
      },

      phone: {
        type: String,
        required: true
      }
    },

    // Currently only COD is supported
    paymentMethod: {
      type: String,
      enum: ['COD'],
      default: 'COD'
    },

    // Total order amount
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    // Order status
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'shipped',
        'delivered',
        'cancelled'
      ],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);