/**
 * ==============================================
 * Review Routes
 * ==============================================
 * 
 * Handles review management operations.
 * Clients can create reviews, admins can moderate.
 * All routes are prefixed with /api/v1/reviews
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, adminOnly, optionalAuth } = require('../middleware/auth.middleware');
const { asyncHandler, ApiError, NotFoundError } = require('../middleware/error.middleware');
const { 
  validateReviewCreate,
  validateIdParam,
  validatePagination,
  validateRequest 
} = require('../middleware/validation.middleware');

/**
 * @route   GET /api/v1/reviews
 * @desc    Get all reviews (with filters)
 * @access  Public (published only) / Admin (all)
 * 
 * @query   {page?, limit?, tour_id?, rating?, is_published?}
 * @returns {reviews[], pagination}
 */
router.get('/',
  optionalAuth,
  validatePagination,
  validateRequest,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { tour_id, rating, is_published } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];

    // Non-admin users can only see published reviews
    if (!req.user || req.user.role !== 'admin') {
      whereClause += ' AND r.is_published = 1';
    } else if (is_published !== undefined) {
      whereClause += ' AND r.is_published = ?';
      params.push(is_published === 'true' ? 1 : 0);
    }

    if (tour_id) {
      whereClause += ' AND r.tour_id = ?';
      params.push(parseInt(tour_id));
    }

    if (rating) {
      whereClause += ' AND r.rating = ?';
      params.push(parseInt(rating));
    }

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM reviews r ${whereClause}`,
      params
    );

    // Get reviews with user and tour info
    const reviews = await db.query(
      `SELECT 
        r.*,
        u.name as user_name,
        t.name as tour_name,
        c.name as city_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       JOIN tours t ON r.tour_id = t.id
       JOIN cities c ON t.city_id = c.id
       ${whereClause}
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
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

/**
 * @route   GET /api/v1/reviews/my
 * @desc    Get current user's reviews
 * @access  Private
 * 
 * @returns {reviews[]}
 */
router.get('/my',
  authenticate,
  asyncHandler(async (req, res) => {
    const reviews = await db.query(
      `SELECT 
        r.*,
        t.name as tour_name,
        t.images as tour_images,
        c.name as city_name
       FROM reviews r
       JOIN tours t ON r.tour_id = t.id
       JOIN cities c ON t.city_id = c.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );

    const parsedReviews = reviews.map(review => ({
      ...review,
      tour_images: review.tour_images ? JSON.parse(review.tour_images) : []
    }));

    res.json({
      success: true,
      data: { reviews: parsedReviews }
    });
  })
);

/**
 * @route   GET /api/v1/reviews/:id
 * @desc    Get review by ID
 * @access  Public (published) / Admin (all)
 * 
 * @param   {id} - Review ID
 * @returns {review}
 */
router.get('/:id',
  optionalAuth,
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    let whereClause = 'WHERE r.id = ?';
    
    // Non-admin users can only see published reviews
    if (!req.user || req.user.role !== 'admin') {
      whereClause += ' AND r.is_published = 1';
    }

    const reviews = await db.query(
      `SELECT 
        r.*,
        u.name as user_name,
        t.name as tour_name,
        t.images as tour_images,
        c.name as city_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       JOIN tours t ON r.tour_id = t.id
       JOIN cities c ON t.city_id = c.id
       ${whereClause}`,
      [id]
    );

    if (reviews.length === 0) {
      throw new NotFoundError('Review');
    }

    res.json({
      success: true,
      data: {
        review: {
          ...reviews[0],
          tour_images: reviews[0].tour_images ? JSON.parse(reviews[0].tour_images) : []
        }
      }
    });
  })
);

/**
 * @route   POST /api/v1/reviews
 * @desc    Create a new review
 * @access  Private (authenticated users who completed the tour)
 * 
 * @body    {tour_id, rating, comment?}
 * @returns {review}
 */
router.post('/',
  authenticate,
  validateReviewCreate,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { tour_id, rating, comment } = req.body;

    // Check if tour exists
    const tours = await db.query('SELECT id FROM tours WHERE id = ?', [tour_id]);
    if (tours.length === 0) {
      throw new ApiError(400, 'Tour not found');
    }

    // Check if user has completed a booking for this tour
    const bookings = await db.query(
      `SELECT id FROM bookings 
       WHERE user_id = ? AND tour_id = ? AND status = 'completed'`,
      [req.user.id, tour_id]
    );

    // Optional: Require completed booking to review
    // Uncomment to enforce this rule
    // if (bookings.length === 0) {
    //   throw new ApiError(400, 'You can only review tours you have completed');
    // }

    // Check if user already reviewed this tour
    const existingReviews = await db.query(
      'SELECT id FROM reviews WHERE user_id = ? AND tour_id = ?',
      [req.user.id, tour_id]
    );

    if (existingReviews.length > 0) {
      throw new ApiError(400, 'You have already reviewed this tour');
    }

    // Create review (auto-publish or require moderation based on settings)
    const result = await db.query(
      `INSERT INTO reviews 
       (user_id, tour_id, rating, comment, is_verified, is_published, created_at)
       VALUES (?, ?, ?, ?, ?, 1, NOW())`,
      [req.user.id, tour_id, rating, comment || null, bookings.length > 0 ? 1 : 0]
    );

    // Get created review
    const newReview = await db.query(
      `SELECT r.*, u.name as user_name, t.name as tour_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       JOIN tours t ON r.tour_id = t.id
       WHERE r.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review: newReview[0] }
    });
  })
);

/**
 * @route   PUT /api/v1/reviews/:id
 * @desc    Update a review
 * @access  Private (owner can edit content, admin can moderate)
 * 
 * @param   {id} - Review ID
 * @body    {rating?, comment?, is_published?}
 * @returns {review}
 */
router.put('/:id',
  authenticate,
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rating, comment, is_published } = req.body;

    // Get existing review
    const reviews = await db.query('SELECT * FROM reviews WHERE id = ?', [id]);

    if (reviews.length === 0) {
      throw new NotFoundError('Review');
    }

    const review = reviews[0];

    // Check permissions
    if (req.user.role !== 'admin' && review.user_id !== req.user.id) {
      throw new ApiError(403, 'Access denied');
    }

    const updates = [];
    const values = [];

    // Owner can update rating and comment
    if (review.user_id === req.user.id || req.user.role === 'admin') {
      if (rating !== undefined) {
        if (rating < 1 || rating > 5) {
          throw new ApiError(400, 'Rating must be between 1 and 5');
        }
        updates.push('rating = ?');
        values.push(rating);
      }

      if (comment !== undefined) {
        updates.push('comment = ?');
        values.push(comment || null);
      }
    }

    // Only admin can change publish status
    if (req.user.role === 'admin' && is_published !== undefined) {
      updates.push('is_published = ?');
      values.push(is_published ? 1 : 0);
    }

    if (updates.length === 0) {
      throw new ApiError(400, 'No fields to update');
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    await db.query(
      `UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated review
    const updatedReview = await db.query(
      `SELECT r.*, u.name as user_name, t.name as tour_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       JOIN tours t ON r.tour_id = t.id
       WHERE r.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review: updatedReview[0] }
    });
  })
);

/**
 * @route   DELETE /api/v1/reviews/:id
 * @desc    Delete a review
 * @access  Private (owner or admin)
 * 
 * @param   {id} - Review ID
 * @returns {message}
 */
router.delete('/:id',
  authenticate,
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const reviews = await db.query('SELECT * FROM reviews WHERE id = ?', [id]);

    if (reviews.length === 0) {
      throw new NotFoundError('Review');
    }

    const review = reviews[0];

    // Check permissions
    if (req.user.role !== 'admin' && review.user_id !== req.user.id) {
      throw new ApiError(403, 'Access denied');
    }

    await db.query('DELETE FROM reviews WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  })
);

module.exports = router;
