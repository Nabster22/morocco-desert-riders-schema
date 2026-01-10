/**
 * ==============================================
 * Category Routes
 * ==============================================
 * 
 * Handles tour category management operations.
 * Public routes for listing, admin routes for CRUD.
 * All routes are prefixed with /api/v1/categories
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, adminOnly } = require('../middleware/auth.middleware');
const { asyncHandler, NotFoundError } = require('../middleware/error.middleware');
const { 
  validateCategory,
  validateIdParam,
  validateRequest 
} = require('../middleware/validation.middleware');

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories
 * @access  Public
 * 
 * @returns {categories[]}
 */
router.get('/',
  asyncHandler(async (req, res) => {
    // Get categories with tour counts
    const categories = await db.query(
      `SELECT 
        cat.*,
        COUNT(DISTINCT t.id) as tour_count
       FROM categories cat
       LEFT JOIN tours t ON cat.id = t.category_id AND t.is_active = 1
       GROUP BY cat.id
       ORDER BY tour_count DESC, cat.name ASC`
    );

    res.json({
      success: true,
      data: { categories }
    });
  })
);

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get category by ID with its tours
 * @access  Public
 * 
 * @param   {id} - Category ID
 * @returns {category, tours[]}
 */
router.get('/:id',
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const categories = await db.query(
      `SELECT cat.*, COUNT(DISTINCT t.id) as tour_count
       FROM categories cat
       LEFT JOIN tours t ON cat.id = t.category_id AND t.is_active = 1
       WHERE cat.id = ?
       GROUP BY cat.id`,
      [id]
    );

    if (categories.length === 0) {
      throw new NotFoundError('Category');
    }

    // Get tours in this category
    const tours = await db.query(
      `SELECT 
        t.*,
        c.name as city_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.id) as review_count
       FROM tours t
       LEFT JOIN cities c ON t.city_id = c.id
       LEFT JOIN reviews r ON t.id = r.tour_id AND r.is_published = 1
       WHERE t.category_id = ? AND t.is_active = 1
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
        category: categories[0],
        tours: parsedTours
      }
    });
  })
);

/**
 * @route   POST /api/v1/categories
 * @desc    Create a new category
 * @access  Admin only
 * 
 * @body    {name, icon?}
 * @returns {category}
 */
router.post('/',
  authenticate,
  adminOnly,
  validateCategory,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { name, icon } = req.body;

    const result = await db.query(
      `INSERT INTO categories (name, icon, created_at) 
       VALUES (?, ?, NOW())`,
      [name, icon || null]
    );

    const newCategory = await db.query(
      'SELECT * FROM categories WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category: newCategory[0] }
    });
  })
);

/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Update a category
 * @access  Admin only
 * 
 * @param   {id} - Category ID
 * @body    {name?, icon?}
 * @returns {category}
 */
router.put('/:id',
  authenticate,
  adminOnly,
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, icon } = req.body;

    // Check if category exists
    const existingCategories = await db.query('SELECT id FROM categories WHERE id = ?', [id]);
    if (existingCategories.length === 0) {
      throw new NotFoundError('Category');
    }

    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }

    if (icon !== undefined) {
      updates.push('icon = ?');
      values.push(icon || null);
    }

    if (updates.length > 0) {
      updates.push('updated_at = NOW()');
      values.push(id);

      await db.query(
        `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    const updatedCategory = await db.query('SELECT * FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category: updatedCategory[0] }
    });
  })
);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete a category
 * @access  Admin only
 * 
 * @param   {id} - Category ID
 * @returns {message}
 */
router.delete('/:id',
  authenticate,
  adminOnly,
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if category exists
    const existingCategories = await db.query('SELECT id FROM categories WHERE id = ?', [id]);
    if (existingCategories.length === 0) {
      throw new NotFoundError('Category');
    }

    // Check for existing tours
    const tours = await db.query(
      'SELECT COUNT(*) as count FROM tours WHERE category_id = ?',
      [id]
    );

    if (tours[0].count > 0) {
      throw new Error('Cannot delete category with existing tours. Delete or reassign tours first.');
    }

    await db.query('DELETE FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  })
);

module.exports = router;
