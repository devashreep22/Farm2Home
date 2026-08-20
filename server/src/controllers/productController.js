const Product = require('../models/Product');


// Create Product
exports.createProduct = async (req, res) => {
  try {
    // Only verified farmers can create products
    if (req.user.role !== 'farmer') {
      return res.status(403).json({
        status: false,
        message: 'Only farmers can create products'
      });
    }

    if (!req.user.isVerified) {
      return res.status(403).json({
        status: false,
        message: 'Farmer not verified'
      });
    }

    const {
      name,
      description,
      price,
      category,
      stock
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || stock === undefined) {
      return res.status(400).json({
        status: false,
        message: 'Name, description, price, category and stock are required'
      });
    }

    if (Number(price) <= 0 || Number(stock) < 0) {
      return res.status(400).json({
        status: false,
        message: 'Price must be greater than 0 and stock cannot be negative'
      });
    }

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : undefined;

    const product = new Product({
      farmer: req.user.id,
      name,
      description,
      price: Number(price),
      category,
      imageUrl,
      stock: Number(stock),
      status: 'pending'
    });

    await product.save();

    res.status(201).json({
      status: true,
      message: 'Product created and sent for approval',
      data: product
    });

  } catch (err) {
    console.error('Create product error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      farmer: req.user.id
    });

    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Product not found'
      });
    }

    const {
      name,
      description,
      price,
      category,
      stock
    } = req.body;

    // Update only fields that were actually provided
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) {
      if (Number(price) <= 0) {
        return res.status(400).json({
          status: false,
          message: 'Price must be greater than 0'
        });
      }

      product.price = Number(price);
    }

    if (category !== undefined) product.category = category;

    if (stock !== undefined) {
      if (Number(stock) < 0) {
        return res.status(400).json({
          status: false,
          message: 'Stock cannot be negative'
        });
      }

      product.stock = Number(stock);
    }

    if (req.file) {
      product.imageUrl = `/uploads/${req.file.filename}`;
    }

    // Updated product needs admin approval again
    product.status = 'pending';

    await product.save();

    res.json({
      status: true,
      message: 'Product updated and sent for re-approval',
      data: product
    });

  } catch (err) {
    console.error('Update product error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user.id
    });

    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Product not found'
      });
    }

    res.json({
      status: true,
      message: 'Product deleted successfully'
    });

  } catch (err) {
    console.error('Delete product error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Get Approved Products
exports.getProducts = async (req, res) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      sort
    } = req.query;

    const filter = {
      status: 'approved'
    };

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Search
    if (q) {
      filter.$text = {
        $search: q
      };
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    let query = Product.find(filter)
      .populate('farmer', 'name farmName');

    // Sorting
    if (sort) {
      const allowedSortFields = [
        'price',
        'createdAt',
        'name',
        'stock'
      ];

      const field = sort.startsWith('-')
        ? sort.substring(1)
        : sort;

      if (allowedSortFields.includes(field)) {
        const direction = sort.startsWith('-') ? -1 : 1;

        query = query.sort({
          [field]: direction
        });
      }
    }

    const products = await query;

    res.json({
      status: true,
      data: products
    });

  } catch (err) {
    console.error('Get products error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Get Product By ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'name farmName');

    if (!product || product.status !== 'approved') {
      return res.status(404).json({
        status: false,
        message: 'Product not found'
      });
    }

    res.json({
      status: true,
      data: product
    });

  } catch (err) {
    console.error('Get product error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Approve / Reject Product
exports.approveProduct = async (req, res) => {
  try {
    const { status } = req.body;

    // Only approved/rejected are allowed
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        status: false,
        message: 'Status must be approved or rejected'
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Product not found'
      });
    }

    product.status = status;

    await product.save();

    res.json({
      status: true,
      message: `Product ${status}`,
      data: product
    });

  } catch (err) {
    console.error('Approve product error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};


// Get Farmer's Products
exports.getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      farmer: req.user.id
    }).sort({
      createdAt: -1
    });

    res.json({
      status: true,
      data: products
    });

  } catch (err) {
    console.error('Get farmer products error:', err);

    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message
    });
  }
};