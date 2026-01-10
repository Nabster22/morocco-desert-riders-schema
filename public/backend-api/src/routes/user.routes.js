/**
 * ==============================================
 * User Management Routes
 * ==============================================
 * 
 * Admin-only routes for managing users.
 * All routes are prefixed with /api/v1/users
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { authenticate, adminOnly } = require('../middleware/auth.middleware');
const { asyncHandler, ApiError, NotFoundError } = require('../middleware/error.middleware');
const { 
  validateUserUpdate, 
  validateIdParam,
  validatePagination,
  validateRequest 
} = require('../middleware/validation.middleware');

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (paginated)
 * @access  Admin only
 * 
 * @query   {page?, limit?, search?, role?}
 * @returns {users[], pagination}
 */
router.get('/',
  authenticate,
  adminOnly,
  validatePagination,
  validateRequest,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const role = req.query.role || '';

    // Build WHERE clause for filtering
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (role && ['client', 'admin'].includes(role)) {
      whereClause += ' AND role = ?';
      params.push(role);
    }

    // Get total count for pagination
    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get users (excluding passwords)
    const users = await db.query(
      `SELECT id, name, email, phone, role, created_at, updated_at 
       FROM users 
       ${whereClause}
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  })
);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Admin only
 * 
 * @param   {id} - User ID
 * @returns {user}
 */
router.get('/:id',
  authenticate,
  adminOnly,
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const users = await db.query(
      `SELECT id, name, email, phone, role, created_at, updated_at 
       FROM users WHERE id = ?`,
      [id]
    );

    if (users.length === 0) {
      throw new NotFoundError('User');
    }

    // Get user's booking count
    const bookingCount = await db.query(
      'SELECT COUNT(*) as count FROM bookings WHERE user_id = ?',
      [id]
    );

    // Get user's review count
    const reviewCount = await db.query(
      'SELECT COUNT(*) as count FROM reviews WHERE user_id = ?',
      [id]
    );

    res.json({
      success: true,
      data: {
        user: {
          ...users[0],
          bookings_count: bookingCount[0].count,
          reviews_count: reviewCount[0].count
        }
      }
    });
  })
);

/**
 * @route   POST /api/v1/users
 * @desc    Create a new user (admin can create admins)
 * @access  Admin only
 * 
 * @body    {name, email, password, phone?, role?}
 * @returns {user}
 */
router.post('/',
  authenticate,
  adminOnly,
  asyncHandler(async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      throw new ApiError(400, 'Name, email, and password are required');
    }

    // Check if email exists
    const existingUsers = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (existingUsers.length > 0) {
      throw new ApiError(409, 'Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user (admin can set role)
    const result = await db.query(
      `INSERT INTO users (name, email, password, phone, role, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, email.toLowerCase(), hashedPassword, phone || null, role || 'client']
    );

    // Get created user
    const newUser = await db.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: newUser[0]
      }
    });
  })
);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update a user
 * @access  Admin only
 * 
 * @param   {id} - User ID
 * @body    {name?, email?, phone?, role?}
 * @returns {user}
 */
router.put('/:id',
  authenticate,
  adminOnly,
  validateIdParam,
  validateUserUpdate,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;

    // Check if user exists
    const existingUsers = await db.query(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (existingUsers.length === 0) {
      throw new NotFoundError('User');
    }

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }

    if (email) {
      // Check if email is taken by another user
      const emailCheck = await db.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email.toLowerCase(), id]
      );

      if (emailCheck.length > 0) {
        throw new ApiError(409, 'Email already in use');
      }

      updates.push('email = ?');
      values.push(email.toLowerCase());
    }

    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone || null);
    }

    if (role && ['client', 'admin'].includes(role)) {
      updates.push('role = ?');
      values.push(role);
    }

    if (updates.length === 0) {
      throw new ApiError(400, 'No fields to update');
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    // Execute update
    await db.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated user
    const updatedUser = await db.query(
      'SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: updatedUser[0]
      }
    });
  })
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete a user
 * @access  Admin only
 * 
 * @param   {id} - User ID
 * @returns {message}
 */
router.delete('/:id',
  authenticate,
  adminOnly,
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      throw new ApiError(400, 'Cannot delete your own account');
    }

    // Check if user exists
    const existingUsers = await db.query(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (existingUsers.length === 0) {
      throw new NotFoundError('User');
    }

    // Delete user (bookings and reviews will cascade delete based on schema)
    await db.query('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  })
);

/**
 * @route   GET /api/v1/users/:id/bookings
 * @desc    Get all bookings for a specific user
 * @access  Admin only
 * 
 * @param   {id} - User ID
 * @returns {bookings[]}
 */
router.get('/:id/bookings',
  authenticate,
  adminOnly,
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if user exists
    const users = await db.query('SELECT id FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      throw new NotFoundError('User');
    }

    // Get user's bookings with tour details
    const bookings = await db.query(
      `SELECT b.*, t.name as tour_name, t.duration_days, c.name as city_name
       FROM bookings b
       JOIN tours t ON b.tour_id = t.id
       JOIN cities c ON t.city_id = c.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      data: { bookings }
    });
  })
);

module.exports = router;
