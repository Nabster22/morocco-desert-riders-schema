/**
 * ==============================================
 * Authentication Routes
 * ==============================================
 * 
 * Handles user registration, login, and authentication-related
 * endpoints. All routes are prefixed with /api/v1/auth
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { generateToken, authenticate } = require('../middleware/auth.middleware');
const { asyncHandler, ApiError } = require('../middleware/error.middleware');
const { 
  validateUserRegister, 
  validateUserLogin, 
  validateRequest 
} = require('../middleware/validation.middleware');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 * 
 * @body    {name, email, password, phone?}
 * @returns {user, token}
 */
router.post('/register', 
  validateUserRegister,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    // Check if email already exists
    const existingUsers = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (existingUsers.length > 0) {
      throw new ApiError(409, 'Email already registered');
    }

    // Hash password with bcrypt
    // Salt rounds of 12 provides good security without excessive CPU usage
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user with 'client' role (default for public registration)
    const result = await db.query(
      `INSERT INTO users (name, email, password, phone, role, created_at) 
       VALUES (?, ?, ?, ?, 'client', NOW())`,
      [name, email.toLowerCase(), hashedPassword, phone || null]
    );

    // Get the newly created user (without password)
    const newUser = await db.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    // Generate JWT token
    const token = generateToken(newUser[0]);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: newUser[0],
        token
      }
    });
  })
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 * 
 * @body    {email, password}
 * @returns {user, token}
 */
router.post('/login',
  validateUserLogin,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email (include password for comparison)
    const users = await db.query(
      'SELECT id, name, email, password, phone, role, created_at FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (users.length === 0) {
      // Use generic message to prevent email enumeration attacks
      throw new ApiError(401, 'Invalid email or password');
    }

    const user = users[0];

    // Compare provided password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken(user);

    // Remove password from response
    delete user.password;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  })
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 * 
 * @returns {user}
 */
router.get('/me',
  authenticate,
  asyncHandler(async (req, res) => {
    // req.user is set by authenticate middleware
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  })
);

/**
 * @route   PUT /api/v1/auth/password
 * @desc    Change user password
 * @access  Private
 * 
 * @body    {currentPassword, newPassword}
 * @returns {message}
 */
router.put('/password',
  authenticate,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      throw new ApiError(400, 'Current password and new password are required');
    }

    if (newPassword.length < 8) {
      throw new ApiError(400, 'New password must be at least 8 characters');
    }

    // Get user with password
    const users = await db.query(
      'SELECT id, password FROM users WHERE id = ?',
      [req.user.id]
    );

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await db.query(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  })
);

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Update current user profile
 * @access  Private
 * 
 * @body    {name?, email?, phone?}
 * @returns {user}
 */
router.put('/profile',
  authenticate,
  asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    const updates = [];
    const values = [];

    // Build dynamic update query
    if (name) {
      updates.push('name = ?');
      values.push(name);
    }

    if (email) {
      // Check if email is taken by another user
      const existingUsers = await db.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email.toLowerCase(), req.user.id]
      );

      if (existingUsers.length > 0) {
        throw new ApiError(409, 'Email already in use');
      }

      updates.push('email = ?');
      values.push(email.toLowerCase());
    }

    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone || null);
    }

    if (updates.length === 0) {
      throw new ApiError(400, 'No fields to update');
    }

    updates.push('updated_at = NOW()');
    values.push(req.user.id);

    // Execute update
    await db.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated user
    const updatedUser = await db.query(
      'SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser[0]
      }
    });
  })
);

module.exports = router;
