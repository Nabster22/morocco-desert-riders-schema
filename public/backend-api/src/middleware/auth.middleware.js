/**
 * ==============================================
 * Authentication Middleware
 * ==============================================
 * 
 * This module provides JWT-based authentication and
 * role-based authorization middleware for protecting routes.
 */

const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * JWT Secret Key
 * Used for signing and verifying tokens
 * IMPORTANT: Keep this secret in production!
 */
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

/**
 * Authenticate User Middleware
 * 
 * Verifies the JWT token from the Authorization header
 * and attaches the user object to the request.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @example
 * // Protected route
 * router.get('/profile', authenticate, (req, res) => {
 *   res.json({ user: req.user });
 * });
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Remove 'Bearer ' prefix to get the token
    const token = authHeader.substring(7);

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch user from database to ensure they still exist
    // and haven't been deleted/disabled
    const users = await db.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token may be invalid.'
      });
    }

    // Attach user to request object for use in route handlers
    req.user = users[0];
    req.userId = users[0].id;

    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

/**
 * Optional Authentication Middleware
 * 
 * Similar to authenticate, but doesn't require authentication.
 * If a valid token is provided, user is attached to request.
 * If no token or invalid token, request continues without user.
 * 
 * Useful for routes that behave differently for logged-in users.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // No token, continue without user
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const users = await db.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length > 0) {
      req.user = users[0];
      req.userId = users[0].id;
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
};

/**
 * Authorize Roles Middleware Factory
 * 
 * Creates middleware that restricts access to specific roles.
 * Must be used AFTER authenticate middleware.
 * 
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'client')
 * @returns {Function} Express middleware function
 * 
 * @example
 * // Admin-only route
 * router.delete('/users/:id', 
 *   authenticate, 
 *   authorize('admin'), 
 *   deleteUser
 * );
 * 
 * // Admin or moderator route
 * router.put('/tours/:id', 
 *   authenticate, 
 *   authorize('admin', 'moderator'), 
 *   updateTour
 * );
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Ensure authenticate middleware ran first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}.`
      });
    }

    next();
  };
};

/**
 * Admin Only Middleware
 * 
 * Shorthand for authorize('admin')
 * Use for routes that only admins can access.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required.'
    });
  }

  next();
};

/**
 * Generate JWT Token
 * 
 * Creates a signed JWT token for a user.
 * Token includes user ID and role.
 * 
 * @param {Object} user - User object with id and role
 * @returns {string} Signed JWT token
 * 
 * @example
 * const token = generateToken({ id: 1, role: 'client' });
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Verify Token (utility function)
 * 
 * Verifies a JWT token and returns the decoded payload.
 * 
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  adminOnly,
  generateToken,
  verifyToken
};
