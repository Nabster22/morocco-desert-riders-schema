/**
 * ==============================================
 * Error Handling Middleware
 * ==============================================
 * 
 * Centralized error handling for consistent error responses
 * across the entire API. Includes custom error classes and
 * middleware functions for handling errors.
 */

/**
 * Custom API Error Class
 * 
 * Extends the built-in Error class to include HTTP status codes
 * and additional error details.
 * 
 * @class ApiError
 * @extends Error
 * 
 * @example
 * throw new ApiError(404, 'Tour not found');
 * throw new ApiError(400, 'Invalid email format', { field: 'email' });
 */
class ApiError extends Error {
  /**
   * Create an API Error
   * 
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Object} details - Additional error details
   */
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // Distinguishes operational errors from programming errors
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error Class
 * 
 * Specialized error for input validation failures.
 * Automatically sets status code to 400 (Bad Request).
 * 
 * @class ValidationError
 * @extends ApiError
 */
class ValidationError extends ApiError {
  constructor(message, details = null) {
    super(400, message, details);
    this.name = 'ValidationError';
  }
}

/**
 * Not Found Error Class
 * 
 * Specialized error for resource not found.
 * Automatically sets status code to 404.
 * 
 * @class NotFoundError
 * @extends ApiError
 */
class NotFoundError extends ApiError {
  constructor(resource = 'Resource') {
    super(404, `${resource} not found`);
    this.name = 'NotFoundError';
  }
}

/**
 * Unauthorized Error Class
 * 
 * Specialized error for authentication failures.
 * Automatically sets status code to 401.
 * 
 * @class UnauthorizedError
 * @extends ApiError
 */
class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Forbidden Error Class
 * 
 * Specialized error for authorization failures.
 * Automatically sets status code to 403.
 * 
 * @class ForbiddenError
 * @extends ApiError
 */
class ForbiddenError extends ApiError {
  constructor(message = 'Access forbidden') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

/**
 * 404 Not Found Handler Middleware
 * 
 * Catches requests to undefined routes and returns
 * a consistent 404 error response.
 * 
 * Place this AFTER all route definitions.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`);
  next(error);
};

/**
 * Global Error Handler Middleware
 * 
 * Catches all errors thrown in the application and returns
 * a consistent error response format.
 * 
 * In development, includes stack trace for debugging.
 * In production, hides internal error details.
 * 
 * Place this as the LAST middleware.
 * 
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  // Log error for debugging (always log in development)
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Error:', {
      message: err.message,
      stack: err.stack,
      statusCode,
      path: req.path,
      method: req.method
    });
  } else {
    // In production, only log server errors
    if (statusCode >= 500) {
      console.error('❌ Server Error:', err.message);
    }
  }

  // Handle specific error types
  
  // MySQL duplicate entry error
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'A record with this value already exists';
  }

  // MySQL foreign key constraint error
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'Referenced record does not exist';
  }

  // JSON parsing error
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File size exceeds maximum limit';
  }

  // Build error response
  const errorResponse = {
    success: false,
    message,
    ...(details && { details }),
    // Include stack trace only in development
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  };

  res.status(statusCode).json(errorResponse);
};

/**
 * Async Handler Wrapper
 * 
 * Wraps async route handlers to automatically catch errors
 * and pass them to the error handling middleware.
 * 
 * This eliminates the need for try/catch blocks in every route.
 * 
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped function that catches errors
 * 
 * @example
 * // Instead of:
 * router.get('/tours', async (req, res, next) => {
 *   try {
 *     const tours = await Tour.findAll();
 *     res.json(tours);
 *   } catch (error) {
 *     next(error);
 *   }
 * });
 * 
 * // Use:
 * router.get('/tours', asyncHandler(async (req, res) => {
 *   const tours = await Tour.findAll();
 *   res.json(tours);
 * }));
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  ApiError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  notFoundHandler,
  errorHandler,
  asyncHandler
};
