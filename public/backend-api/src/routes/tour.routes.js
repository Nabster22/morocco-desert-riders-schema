/**
 * ==============================================
 * Tour Routes
 * ==============================================
 * 
 * Handles all tour-related operations.
 * Public routes for listing/viewing, admin routes for CRUD.
 * All routes are prefixed with /api/v1/tours
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, adminOnly, optionalAuth } = require('../middleware/auth.middleware');
const { asyncHandler, ApiError, NotFoundError } = require('../middleware/error.middleware');
const { 
  validateTourCreate,
  validateTourUpdate,
  validateIdParam,
  validatePagination,
  validateRequest 
} = require('../middleware/validation.middleware');

/**
 * @route   GET /api/v1/tours
 * @desc    Get all tours with filters and pagination
 * @access  Public
 * 
 * @query   {page?, limit?, city_id?, category_id?, min_price?, max_price?, duration?, search?, sort?}
 * @returns {tours[], pagination}
 */
router.get('/',
  validatePagination,
  validateRequest,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Extract filter parameters
    const { city_id, category_id, min_price, max_price, duration, search, sort } = req.query;

    // Build WHERE clause dynamically
    let whereClause = 'WHERE t.is_active = 1';
    const params = [];

    // Filter by city
    if (city_id) {
      whereClause += ' AND t.city_id = ?';
      params.push(parseInt(city_id));
    }

    // Filter by category
    if (category_id) {
      whereClause += ' AND t.category_id = ?';
      params.push(parseInt(category_id));
    }

    // Filter by price range
    if (min_price) {
      whereClause += ' AND t.price_standard >= ?';
      params.push(parseFloat(min_price));
    }

    if (max_price) {
      whereClause += ' AND t.price_standard <= ?';
      params.push(parseFloat(max_price));
    }

    // Filter by duration
    if (duration) {
      whereClause += ' AND t.duration_days = ?';
      params.push(parseInt(duration));
    }

    // Search by name or description
    if (search) {
      whereClause += ' AND (t.name LIKE ? OR t.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Determine sort order
    let orderClause = 'ORDER BY t.created_at DESC';
    if (sort) {
      switch (sort) {
        case 'price_asc':
          orderClause = 'ORDER BY t.price_standard ASC';
          break;
        case 'price_desc':
          orderClause = 'ORDER BY t.price_standard DESC';
          break;
        case 'duration_asc':
          orderClause = 'ORDER BY t.duration_days ASC';
          break;
        case 'duration_desc':
          orderClause = 'ORDER BY t.duration_days DESC';
          break;
        case 'rating':
          orderClause = 'ORDER BY avg_rating DESC';
          break;
        case 'popular':
          orderClause = 'ORDER BY booking_count DESC';
          break;
        case 'newest':
        default:
          orderClause = 'ORDER BY t.created_at DESC';
      }
    }

    // Get total count for pagination
    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM tours t ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get tours with city, category, and aggregate data
    const tours = await db.query(
      `SELECT 
        t.*,
        c.name as city_name,
        cat.name as category_name,
        cat.icon as category_icon,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.id) as review_count,
        COUNT(DISTINCT b.id) as booking_count
       FROM tours t
       LEFT JOIN cities c ON t.city_id = c.id
       LEFT JOIN categories cat ON t.category_id = cat.id
       LEFT JOIN reviews r ON t.id = r.tour_id AND r.is_published = 1
       LEFT JOIN bookings b ON t.id = b.tour_id
       ${whereClause}
       GROUP BY t.id
       ${orderClause}
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Parse JSON images field
    const parsedTours = tours.map(tour => ({
      ...tour,
      images: tour.images ? JSON.parse(tour.images) : [],
      avg_rating: parseFloat(tour.avg_rating).toFixed(1)
    }));

    res.json({
      success: true,
      data: {
        tours: parsedTours,
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
 * @route   GET /api/v1/tours/featured
 * @desc    Get featured/popular tours
 * @access  Public
 * 
 * @query   {limit?}
 * @returns {tours[]}
 */
router.get('/featured',
  asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 6;

    const tours = await db.query(
      `SELECT 
        t.*,
        c.name as city_name,
        cat.name as category_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT b.id) as booking_count
       FROM tours t
       LEFT JOIN cities c ON t.city_id = c.id
       LEFT JOIN categories cat ON t.category_id = cat.id
       LEFT JOIN reviews r ON t.id = r.tour_id AND r.is_published = 1
       LEFT JOIN bookings b ON t.id = b.tour_id
       WHERE t.is_active = 1
       GROUP BY t.id
       ORDER BY booking_count DESC, avg_rating DESC
       LIMIT ?`,
      [limit]
    );

    const parsedTours = tours.map(tour => ({
      ...tour,
      images: tour.images ? JSON.parse(tour.images) : [],
      avg_rating: parseFloat(tour.avg_rating).toFixed(1)
    }));

    res.json({
      success: true,
      data: { tours: parsedTours }
    });
  })
);

/**
 * @route   GET /api/v1/tours/:id
 * @desc    Get single tour by ID
 * @access  Public
 * 
 * @param   {id} - Tour ID
 * @returns {tour}
 */
router.get('/:id',
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const tours = await db.query(
      `SELECT 
        t.*,
        c.name as city_name,
        c.description as city_description,
        cat.name as category_name,
        cat.icon as category_icon,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.id) as review_count
       FROM tours t
       LEFT JOIN cities c ON t.city_id = c.id
       LEFT JOIN categories cat ON t.category_id = cat.id
       LEFT JOIN reviews r ON t.id = r.tour_id AND r.is_published = 1
       WHERE t.id = ?
       GROUP BY t.id`,
      [id]
    );

    if (tours.length === 0) {
      throw new NotFoundError('Tour');
    }

    // Get recent reviews for this tour
    const reviews = await db.query(
      `SELECT r.*, u.name as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.tour_id = ? AND r.is_published = 1
       ORDER BY r.created_at DESC
       LIMIT 5`,
      [id]
    );

    const tour = {
      ...tours[0],
      images: tours[0].images ? JSON.parse(tours[0].images) : [],
      avg_rating: parseFloat(tours[0].avg_rating).toFixed(1),
      recent_reviews: reviews
    };

    res.json({
      success: true,
      data: { tour }
    });
  })
);

/**
 * @route   POST /api/v1/tours
 * @desc    Create a new tour
 * @access  Admin only
 * 
 * @body    {name, city_id, category_id, description?, duration_days, price_standard, price_premium?, images?, max_guests?, is_active?}
 * @returns {tour}
 */
router.post('/',
  authenticate,
  adminOnly,
  validateTourCreate,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { 
      name, city_id, category_id, description, duration_days,
      price_standard, price_premium, images, max_guests, is_active 
    } = req.body;

    // Verify city exists
    const cities = await db.query('SELECT id FROM cities WHERE id = ?', [city_id]);
    if (cities.length === 0) {
      throw new ApiError(400, 'Invalid city ID');
    }

    // Verify category exists
    const categories = await db.query('SELECT id FROM categories WHERE id = ?', [category_id]);
    if (categories.length === 0) {
      throw new ApiError(400, 'Invalid category ID');
    }

    // Calculate end_date based on duration (for reference)
    const imagesJson = images ? JSON.stringify(images) : null;

    const result = await db.query(
      `INSERT INTO tours 
       (name, city_id, category_id, description, duration_days, 
        price_standard, price_premium, images, max_guests, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        name, city_id, category_id, description || null, duration_days,
        price_standard, price_premium || null, imagesJson, 
        max_guests || 10, is_active !== undefined ? is_active : true
      ]
    );

    // Get created tour with relations
    const newTour = await db.query(
      `SELECT t.*, c.name as city_name, cat.name as category_name
       FROM tours t
       LEFT JOIN cities c ON t.city_id = c.id
       LEFT JOIN categories cat ON t.category_id = cat.id
       WHERE t.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Tour created successfully',
      data: {
        tour: {
          ...newTour[0],
          images: newTour[0].images ? JSON.parse(newTour[0].images) : []
        }
      }
    });
  })
);

/**
 * @route   PUT /api/v1/tours/:id
 * @desc    Update a tour
 * @access  Admin only
 * 
 * @param   {id} - Tour ID
 * @body    {name?, city_id?, category_id?, description?, duration_days?, price_standard?, price_premium?, images?, max_guests?, is_active?}
 * @returns {tour}
 */
router.put('/:id',
  authenticate,
  adminOnly,
  validateIdParam,
  validateTourUpdate,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if tour exists
    const existingTours = await db.query('SELECT id FROM tours WHERE id = ?', [id]);
    if (existingTours.length === 0) {
      throw new NotFoundError('Tour');
    }

    const allowedFields = [
      'name', 'city_id', 'category_id', 'description', 'duration_days',
      'price_standard', 'price_premium', 'images', 'max_guests', 'is_active'
    ];

    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        
        if (field === 'images') {
          values.push(JSON.stringify(req.body[field]));
        } else {
          values.push(req.body[field]);
        }
      }
    }

    if (updates.length === 0) {
      throw new ApiError(400, 'No fields to update');
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    await db.query(
      `UPDATE tours SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated tour
    const updatedTour = await db.query(
      `SELECT t.*, c.name as city_name, cat.name as category_name
       FROM tours t
       LEFT JOIN cities c ON t.city_id = c.id
       LEFT JOIN categories cat ON t.category_id = cat.id
       WHERE t.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Tour updated successfully',
      data: {
        tour: {
          ...updatedTour[0],
          images: updatedTour[0].images ? JSON.parse(updatedTour[0].images) : []
        }
      }
    });
  })
);

/**
 * @route   DELETE /api/v1/tours/:id
 * @desc    Delete a tour
 * @access  Admin only
 * 
 * @param   {id} - Tour ID
 * @returns {message}
 */
router.delete('/:id',
  authenticate,
  adminOnly,
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if tour exists
    const existingTours = await db.query('SELECT id FROM tours WHERE id = ?', [id]);
    if (existingTours.length === 0) {
      throw new NotFoundError('Tour');
    }

    // Check for existing bookings
    const bookings = await db.query(
      'SELECT COUNT(*) as count FROM bookings WHERE tour_id = ? AND status != "cancelled"',
      [id]
    );

    if (bookings[0].count > 0) {
      throw new ApiError(400, 'Cannot delete tour with active bookings. Cancel bookings first or deactivate the tour.');
    }

    // Delete tour (reviews will cascade delete based on schema)
    await db.query('DELETE FROM tours WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Tour deleted successfully'
    });
  })
);

/**
 * @route   GET /api/v1/tours/:id/reviews
 * @desc    Get all reviews for a tour
 * @access  Public
 * 
 * @param   {id} - Tour ID
 * @returns {reviews[]}
 */
router.get('/:id/reviews',
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Check if tour exists
    const tours = await db.query('SELECT id FROM tours WHERE id = ?', [id]);
    if (tours.length === 0) {
      throw new NotFoundError('Tour');
    }

    // Get total count
    const countResult = await db.query(
      'SELECT COUNT(*) as total FROM reviews WHERE tour_id = ? AND is_published = 1',
      [id]
    );

    // Get reviews with user info
    const reviews = await db.query(
      `SELECT r.*, u.name as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.tour_id = ? AND r.is_published = 1
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [id, limit, offset]
    );

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });
  })
);

module.exports = router;
