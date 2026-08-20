const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');

// Load environment variables FIRST
dotenv.config();

const app = express();

// ======================================
// DATABASE
// ======================================

connectDB()
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ======================================
// MIDDLEWARE
// ======================================

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);

// Parse JSON
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// ======================================
// REQUEST LOGGER
// ======================================

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );

  if (req.headers.authorization) {
    console.log('Auth token present');
  } else {
    console.log('No auth token');
  }

  next();
});

// ======================================
// STATIC FILES
// ======================================

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// ======================================
// API ROUTES
// ======================================

app.use(
  '/api/v1/auth',
  require('./src/routes/authRoutes')
);

app.use(
  '/api/v1/users',
  require('./src/routes/userRoutes')
);

app.use(
  '/api/v1/products',
  require('./src/routes/productRoutes')
);

app.use(
  '/api/v1/orders',
  require('./src/routes/orderRoutes')
);

app.use(
  '/api/v1/admin',
  require('./src/routes/adminRoutes')
);

app.use(
  '/api/v1/cart',
  require('./src/routes/cartRoutes')
);

// ======================================
// ROOT ROUTE
// ======================================

app.get('/', (req, res) => {
  res.json({
    status: true,
    message: 'Farm2Home API is running',
    version: 'v1'
  });
});

// ======================================
// HEALTH CHECK
// ======================================

app.get('/api/v1/health', (req, res) => {
  res.json({
    status: true,
    message: 'Farm2Home API is running',
    timestamp: new Date().toISOString()
  });
});

// ======================================
// 404 HANDLER
// ======================================

app.use((req, res) => {
  console.error(
    `[404] ${req.method} ${req.originalUrl}`
  );

  res.status(404).json({
    status: false,
    message: 'Route not found',
    method: req.method,
    path: req.originalUrl
  });
});

// ======================================
// ERROR HANDLER
// ======================================

app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  res.status(err.status || 500).json({
    status: false,
    message: err.message || 'Server Error'
  });
});

// ======================================
// EXPORT APP
// ======================================

module.exports = app;

// ======================================
// START SERVER
// ======================================

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}