/**
 * ==============================================
 * Validation Middleware
 * ==============================================
 * 
 * Request validation using express-validator.
 * Provides reusable validation rules and middleware
 * for common input validation scenarios.
 */

const { body, param, query, validationResult } = require('express-validator');
const { ValidationError } = require('./error.middleware');

/**
 * Validate Request Middleware
 * 
 * Checks validation results and returns errors if any.
 * Use after validation rules in route definitions.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @example
 * router.post('/users',
 *   validateUserCreate,
 *   validateRequest,
 *   createUser
 * );
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  
  next();
};

// ==============================================
// USER VALIDATION RULES
// ==============================================

/**
 * Validation rules for user registration
 */
const validateUserRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/\d/).withMessage('Password must contain a number')
    .matches(/[a-zA-Z]/).withMessage('Password must contain a letter'),
  
  body('phone')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Invalid phone number')
];

/**
 * Validation rules for user login
 */
const validateUserLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

/**
 * Validation rules for user update
 */
const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Invalid phone number'),
  
  body('role')
    .optional()
    .isIn(['client', 'admin']).withMessage('Role must be client or admin')
];

// ==============================================
// TOUR VALIDATION RULES
// ==============================================

/**
 * Validation rules for tour creation
 */
const validateTourCreate = [
  body('name')
    .trim()
    .notEmpty().withMessage('Tour name is required')
    .isLength({ min: 3, max: 255 }).withMessage('Tour name must be 3-255 characters'),
  
  body('city_id')
    .notEmpty().withMessage('City is required')
    .isInt({ min: 1 }).withMessage('Invalid city ID'),
  
  body('category_id')
    .notEmpty().withMessage('Category is required')
    .isInt({ min: 1 }).withMessage('Invalid category ID'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description must be less than 5000 characters'),
  
  body('duration_days')
    .notEmpty().withMessage('Duration is required')
    .isInt({ min: 1, max: 30 }).withMessage('Duration must be 1-30 days'),
  
  body('price_standard')
    .notEmpty().withMessage('Standard price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('price_premium')
    .optional()
    .isFloat({ min: 0 }).withMessage('Premium price must be a positive number'),
  
  body('max_guests')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Max guests must be 1-50'),
  
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean')
];

/**
 * Validation rules for tour update
 */
const validateTourUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 }).withMessage('Tour name must be 3-255 characters'),
  
  body('city_id')
    .optional()
    .isInt({ min: 1 }).withMessage('Invalid city ID'),
  
  body('category_id')
    .optional()
    .isInt({ min: 1 }).withMessage('Invalid category ID'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description must be less than 5000 characters'),
  
  body('duration_days')
    .optional()
    .isInt({ min: 1, max: 30 }).withMessage('Duration must be 1-30 days'),
  
  body('price_standard')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('price_premium')
    .optional()
    .isFloat({ min: 0 }).withMessage('Premium price must be a positive number'),
  
  body('max_guests')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Max guests must be 1-50'),
  
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean')
];

// ==============================================
// BOOKING VALIDATION RULES
// ==============================================

/**
 * Validation rules for booking creation
 */
const validateBookingCreate = [
  body('tour_id')
    .notEmpty().withMessage('Tour is required')
    .isInt({ min: 1 }).withMessage('Invalid tour ID'),
  
  body('start_date')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Invalid date format (use YYYY-MM-DD)')
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),
  
  body('guests')
    .notEmpty().withMessage('Number of guests is required')
    .isInt({ min: 1, max: 20 }).withMessage('Guests must be 1-20'),
  
  body('tier')
    .optional()
    .isIn(['standard', 'premium']).withMessage('Tier must be standard or premium'),
  
  body('special_requests')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Special requests must be less than 1000 characters')
];

/**
 * Validation rules for booking update
 */
const validateBookingUpdate = [
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Invalid status'),
  
  body('guests')
    .optional()
    .isInt({ min: 1, max: 20 }).withMessage('Guests must be 1-20'),
  
  body('special_requests')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Special requests must be less than 1000 characters')
];

// ==============================================
// REVIEW VALIDATION RULES
// ==============================================

/**
 * Validation rules for review creation
 */
const validateReviewCreate = [
  body('tour_id')
    .notEmpty().withMessage('Tour is required')
    .isInt({ min: 1 }).withMessage('Invalid tour ID'),
  
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Comment must be less than 2000 characters')
];

// ==============================================
// CITY VALIDATION RULES
// ==============================================

/**
 * Validation rules for city creation/update
 */
const validateCity = [
  body('name')
    .trim()
    .notEmpty().withMessage('City name is required')
    .isLength({ min: 2, max: 100 }).withMessage('City name must be 2-100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  
  body('image_url')
    .optional()
    .trim()
    .isURL().withMessage('Invalid image URL')
];

// ==============================================
// CATEGORY VALIDATION RULES
// ==============================================

/**
 * Validation rules for category creation/update
 */
const validateCategory = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Category name must be 2-100 characters'),
  
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Icon must be less than 50 characters')
];

// ==============================================
// COMMON VALIDATION RULES
// ==============================================

/**
 * Validate ID parameter
 */
const validateIdParam = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid ID')
];

/**
 * Validate pagination query parameters
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100')
];

module.exports = {
  validateRequest,
  validateUserRegister,
  validateUserLogin,
  validateUserUpdate,
  validateTourCreate,
  validateTourUpdate,
  validateBookingCreate,
  validateBookingUpdate,
  validateReviewCreate,
  validateCity,
  validateCategory,
  validateIdParam,
  validatePagination
};
