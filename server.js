// server.js (or index.js)

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const customerSayRoutes = require('./routes/customerSayRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// --- Small helper logger (avoid noisy logs in production) ---
const log = (...args) => {
  if (process.env.NODE_ENV !== 'production') console.log(...args);
};

// Connect Database (make sure connectDB connects once and reuses pool)
connectDB();

// --- Middlewares ---
// CORS: restrict in production (recommended)
const allowedOrigins = [
  process.env.FRONTEND_URL, // e.g. https://full-ecomerce-gamma.vercel.app
].filter(Boolean).flatMap(url => url.split(',').map(u => u.trim()));

app.use(
  cors({
    origin: (origin, cb) => {
      // allow server-to-server / postman / curl (no origin)
      if (!origin) return cb(null, true);

      // in dev, allow all
      if (process.env.NODE_ENV !== 'production') return cb(null, true);

      // in prod, allow only listed origins
      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);

// Body limits to reduce memory / prevent huge payloads
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true, limit: '200kb' }));

// ✅ Home Route
app.get('/', (req, res) => {
  res.send('Backend is running successfully 🚀');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/customer-say', customerSayRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler (optional but nice)
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  res.status(500).json({
    success: false,
    message: 'Server Error',
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please free the port or use a different one.`);
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
});

// Graceful shutdown (helps on deployments/restarts)
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});