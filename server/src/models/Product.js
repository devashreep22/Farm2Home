const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // Farmer who owns the product
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // Product information
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Vegetables',
        'Fruits',
        'Grains',
        'Dairy',
        'Meat',
        'Herbs',
        'Flowers',
        'Other'
      ],
      index: true
    },

    imageUrl: {
      type: String,
      default: null
    },

    // Available inventory
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 1
    },

    // Product approval status
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },

    // Reason if admin rejects the product
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null
    },

    // URL-friendly identifier
    slug: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },

    // Whether the farmer has made the product active
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    // Search/filter tags
    tags: [
      {
        type: String,
        trim: true
      }
    ],

    // Selling unit
    unit: {
      type: String,
      enum: [
        'kg',
        'g',
        'lb',
        'piece',
        'bunch',
        'dozen',
        'pack'
      ],
      default: 'kg'
    },

    // Analytics
    views: {
      type: Number,
      default: 0,
      min: 0
    },

    salesCount: {
      type: Number,
      default: 0,
      min: 0
    },

    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },

      count: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  },
  {
    timestamps: true
  }
);


// Text search
productSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text'
});


// Query performance indexes
productSchema.index({
  farmer: 1,
  status: 1
});

productSchema.index({
  category: 1,
  status: 1
});

productSchema.index({
  status: 1,
  createdAt: -1
});

productSchema.index({
  isActive: 1,
  status: 1
});


// Generate slug before saving
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.generateSlug();
  }

  next();
});


// Generate URL-friendly slug
productSchema.methods.generateSlug = function () {
  const baseSlug = this.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${baseSlug}-${Date.now()}`;
};


// Formatted price
productSchema.virtual('formattedPrice').get(function () {
  return `₹${this.price.toFixed(2)}`;
});


// Product display name
productSchema.virtual('displayName').get(function () {
  return `${this.name} (per ${this.unit})`;
});


// Find active products
productSchema.statics.findActive = function () {
  return this.find({
    isActive: true,
    status: 'approved'
  });
};


// Find products by category
productSchema.statics.findByCategory = function (category) {
  return this.find({
    category,
    isActive: true,
    status: 'approved'
  });
};


// Update stock
productSchema.methods.updateStock = function (quantity) {
  const newStock = this.stock + quantity;

  if (newStock < 0) {
    throw new Error('Insufficient stock');
  }

  this.stock = newStock;

  return this.save();
};


// Approve product
productSchema.methods.approve = function () {
  this.status = 'approved';
  this.rejectionReason = null;

  return this.save();
};


// Reject product
productSchema.methods.reject = function (reason) {
  this.status = 'rejected';
  this.rejectionReason = reason || null;

  return this.save();
};


// Update rating
productSchema.methods.updateRating = function (newRating) {
  if (newRating < 1 || newRating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  const totalRating =
    this.rating.average * this.rating.count + newRating;

  this.rating.count += 1;

  this.rating.average =
    totalRating / this.rating.count;

  return this.save();
};


// Include virtual fields in JSON
productSchema.set('toJSON', {
  virtuals: true
});

productSchema.set('toObject', {
  virtuals: true
});


module.exports = mongoose.model('Product', productSchema);