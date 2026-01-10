/**
 * ==============================================
 * City Routes
 * ==============================================
 * 
 * Handles city management operations.
 * Public routes for listing, admin routes for CRUD.
 * All routes are prefixed with /api/v1/cities
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, adminOnly } = require('../middleware/auth.middleware');
const { asyncHandler, NotFoundError } = require('../middleware/error.middleware');
const { 
  validateCity,
  validateIdParam,
  validateRequest 
} = require('../middleware/validation.middleware');

/**
 * @route   GET /api/v1/cities
 * @desc    Get all cities
 * @access  Public
 * 
 * @returns {cities[]}
 */
router.get('/',
  asyncHandler(async (req, res) => {
    // Get cities with tour counts
    const cities = await db.query(
      `SELECT 
        c.*,
        COUNT(DISTINCT t.id) as tour_count,
        MIN(t.price_standard) as min_price
       FROM cities c
       LEFT JOIN tours t ON c.id = t.city_id AND t.is_active = 1
       GROUP BY c.id
       ORDER BY tour_count DESC, c.name ASC`
    );

    res.json({
      success: true,
      data: { cities }
    });
  })
);

/**
 * @route   GET /api/v1/cities/:id
 * @desc    Get city by ID with its tours
 * @access  Public
 * 
 * @param   {id} - City ID
 * @returns {city, tours[]}
 */
router.get('/:id',
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const cities = await db.query(
      `SELECT c.*, COUNT(DISTINCT t.id) as tour_count
       FROM cities c
       LEFT JOIN tours t ON c.id = t.city_id AND t.is_active = 1
       WHERE c.id = ?
       GROUP BY c.id`,
      [id]
    );

    if (cities.length === 0) {
      throw new NotFoundError('City');
    }

    // Get tours in this city
    const tours = await db.query(
      `SELECT 
        t.*,
        cat.name as category_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.id) as review_count
       FROM tours t
       LEFT JOIN categories cat ON t.category_id = cat.id
       LEFT JOIN reviews r ON t.id = r.tour_id AND r.is_published = 1
       WHERE t.city_id = ? AND t.is_active = 1
       GROUP BY t.id
       ORDER BY t.created_at DESC`,
      [id]
    );

    const parsedTours = tours.map(tour => ({
      ...tour,
      images: tour.images ? JSON.parse(tour.images) : [],
      avg_rating: parseFloat(tour.avg_rating).toFixed(1)
    }));

    res.json({
      success: true,
      data: {
        city: cities[0],
        tours: parsedTours
      }
    });
  })
);

/**
 * @route   POST /api/v1/cities
 * @desc    Create a new city
 * @access  Admin only
 * 
 * @body    {name, description?, image_url?}
 * @returns {city}
 */
router.post('/',
  authenticate,
  adminOnly,
  validateCity,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { name, description, image_url } = req.body;

    const result = await db.query(
      `INSERT INTO cities (name, description, image_url, created_at) 
       VALUES (?, ?, ?, NOW())`,
      [name, description || null, image_url || null]
    );

    const newCity = await db.query(
      'SELECT * FROM cities WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'City created successfully',
      data: { city: newCity[0] }
    });
  })
);

/**
 * @route   PUT /api/v1/cities/:id
 * @desc    Update a city
 * @access  Admin only
 * 
 * @param   {id} - City ID
 * @body    {name?, description?, image_url?}
 * @returns {city}
 */
router.put('/:id',
  authenticate,
  adminOnly,
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, image_url } = req.body;

    // Check if city exists
    const existingCities = await db.query('SELECT id FROM cities WHERE id = ?', [id]);
    if (existingCities.length === 0) {
      throw new NotFoundError('City');
    }

    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }

    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description || null);
    }

    if (image_url !== undefined) {
      updates.push('image_url = ?');
      values.push(image_url || null);
    }

    if (updates.length > 0) {
      updates.push('updated_at = NOW()');
      values.push(id);

      await db.query(
        `UPDATE cities SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    const updatedCity = await db.query('SELECT * FROM cities WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'City updated successfully',
      data: { city: updatedCity[0] }
    });
  })
);

/**
 * @route   DELETE /api/v1/cities/:id
 * @desc    Delete a city
 * @access  Admin only
 * 
 * @param   {id} - City ID
 * @returns {message}
 */
router.delete('/:id',
  authenticate,
  adminOnly,
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if city exists
    const existingCities = await db.query('SELECT id FROM cities WHERE id = ?', [id]);
    if (existingCities.length === 0) {
      throw new NotFoundError('City');
    }

    // Check for existing tours
    const tours = await db.query(
      'SELECT COUNT(*) as count FROM tours WHERE city_id = ?',
      [id]
    );

    if (tours[0].count > 0) {
      throw new Error('Cannot delete city with existing tours. Delete or reassign tours first.');
    }

    await db.query('DELETE FROM cities WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'City deleted successfully'
    });
  })
);

module.exports = router;
