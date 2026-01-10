/**
 * ==============================================
 * Morocco Desert Riders API - Main Server Entry Point
 * ==============================================
 * 
 * This file initializes and configures the Express server with all
 * middleware, routes, and error handling for the tours application.
 * 
 * @author Morocco Desert Riders Team
 * @version 1.0.0
 */

// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import database connection
const db = require('./config/database');

// Import route modules
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const tourRoutes = require('./routes/tour.routes');
const cityRoutes = require('./routes/city.routes');
const categoryRoutes = require('./routes/category.routes');
const bookingRoutes = require('./routes/booking.routes');
const reviewRoutes = require('./routes/review.routes');
const exportRoutes = require('./routes/export.routes');

// Import error handling middleware
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

// Initialize Express application
const app = express();

// ==============================================
// SECURITY MIDDLEWARE
// ==============================================

/**
 * Helmet adds various HTTP headers for security
 * - Prevents clickjacking
 * - Hides X-Powered-By header
 * - Adds XSS protection
 */
app.use(helmet());

/**
 * CORS Configuration
 * Allows cross-origin requests from specified origins
 */
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Rate Limiting
 * Prevents abuse by limiting requests per IP
 */
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});
app.use('/api', limiter);

// ==============================================
// PARSING MIDDLEWARE
// ==============================================

/**
 * Parse JSON request bodies
 * Limit size to prevent large payload attacks
 */
app.use(express.json({ limit: '10mb' }));

/**
 * Parse URL-encoded request bodies
 * Used for form submissions
 */
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==============================================
// LOGGING MIDDLEWARE
// ==============================================

/**
 * Morgan HTTP request logger
 * 'dev' format shows method, url, status, response time
 */
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ==============================================
// STATIC FILE SERVING
// ==============================================

/**
 * Serve uploaded files (images, documents)
 * Files are accessible at /uploads/filename
 */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ==============================================
// API ROUTES
// ==============================================

/**
 * Health check endpoint
 * Used for monitoring and load balancer health checks
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Morocco Desert Riders API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

/**
 * API Version 1 Routes
 * All routes are prefixed with /api/v1
 */
app.use('/api/v1/auth', authRoutes);        // Authentication (login, register)
app.use('/api/v1/users', userRoutes);       // User management (admin only)
app.use('/api/v1/tours', tourRoutes);       // Tour CRUD operations
app.use('/api/v1/cities', cityRoutes);      // City management
app.use('/api/v1/categories', categoryRoutes); // Category management
app.use('/api/v1/bookings', bookingRoutes); // Booking management
app.use('/api/v1/reviews', reviewRoutes);   // Review management
app.use('/api/v1/export', exportRoutes);    // Export (PDF, CSV, Excel)

// ==============================================
// ERROR HANDLING
// ==============================================

/**
 * 404 Handler
 * Catches requests to undefined routes
 */
app.use(notFoundHandler);

/**
 * Global Error Handler
 * Catches all errors and returns consistent error response
 */
app.use(errorHandler);

// ==============================================
// SERVER STARTUP
// ==============================================

const PORT = process.env.PORT || 3000;

/**
 * Start the server
 * First verify database connection, then listen on port
 */
const startServer = async () => {
  try {
    // Test database connection
    await db.testConnection();
    console.log('✅ Database connection established successfully');

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   🏜️  Morocco Desert Riders API                  ║
║                                                  ║
║   Server running on port ${PORT}                   ║
║   Environment: ${process.env.NODE_ENV || 'development'}                    ║
║                                                  ║
║   API Base URL: http://localhost:${PORT}/api/v1    ║
║                                                  ║
╚══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

// Export app for testing
module.exports = app;
