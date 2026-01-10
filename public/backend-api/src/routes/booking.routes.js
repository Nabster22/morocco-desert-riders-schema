/**
 * ==============================================
 * Booking Routes
 * ==============================================
 * 
 * Handles all booking-related operations.
 * Clients can create/view their bookings, admins can manage all.
 * All routes are prefixed with /api/v1/bookings
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, adminOnly } = require('../middleware/auth.middleware');
const { asyncHandler, ApiError, NotFoundError } = require('../middleware/error.middleware');
const { 
  validateBookingCreate,
  validateBookingUpdate,
  validateIdParam,
  validatePagination,
  validateRequest 
} = require('../middleware/validation.middleware');

/**
 * @route   GET /api/v1/bookings
 * @desc    Get all bookings (admin) or user's bookings (client)
 * @access  Private
 * 
 * @query   {page?, limit?, status?, tour_id?, start_date?, end_date?}
 * @returns {bookings[], pagination}
 */
router.get('/',
  authenticate,
  validatePagination,
  validateRequest,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { status, tour_id, start_date, end_date } = req.query;

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params = [];

    // Non-admin users can only see their own bookings
    if (req.user.role !== 'admin') {
      whereClause += ' AND b.user_id = ?';
      params.push(req.user.id);
    }

    // Filter by status
    if (status && ['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      whereClause += ' AND b.status = ?';
      params.push(status);
    }

    // Filter by tour
    if (tour_id) {
      whereClause += ' AND b.tour_id = ?';
      params.push(parseInt(tour_id));
    }

    // Filter by date range
    if (start_date) {
      whereClause += ' AND b.start_date >= ?';
      params.push(start_date);
    }

    if (end_date) {
      whereClause += ' AND b.start_date <= ?';
      params.push(end_date);
    }

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM bookings b ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get bookings with related data
    const bookings = await db.query(
      `SELECT 
        b.*,
        t.name as tour_name,
        t.duration_days,
        t.images as tour_images,
        c.name as city_name,
        u.name as user_name,
        u.email as user_email,
        p.status as payment_status,
        p.method as payment_method
       FROM bookings b
       JOIN tours t ON b.tour_id = t.id
       JOIN cities c ON t.city_id = c.id
       JOIN users u ON b.user_id = u.id
       LEFT JOIN payments p ON b.payment_id = p.id
       ${whereClause}
       ORDER BY b.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Parse tour images
    const parsedBookings = bookings.map(booking => ({
      ...booking,
      tour_images: booking.tour_images ? JSON.parse(booking.tour_images) : []
    }));

    res.json({
      success: true,
      data: {
        bookings: parsedBookings,
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
 * @route   GET /api/v1/bookings/stats
 * @desc    Get booking statistics (admin only)
 * @access  Admin only
 * 
 * @returns {stats}
 */
router.get('/stats',
  authenticate,
  adminOnly,
  asyncHandler(async (req, res) => {
    // Get overall stats
    const stats = await db.query(`
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_bookings,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
        COALESCE(SUM(total_price), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN status = 'confirmed' OR status = 'completed' THEN total_price ELSE 0 END), 0) as confirmed_revenue,
        COALESCE(AVG(guests), 0) as avg_guests
      FROM bookings
    `);

    // Get monthly revenue (last 6 months)
    const monthlyRevenue = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as booking_count,
        COALESCE(SUM(total_price), 0) as revenue
      FROM bookings
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        AND status IN ('confirmed', 'completed')
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
    `);

    // Get top tours by bookings
    const topTours = await db.query(`
      SELECT 
        t.id,
        t.name,
        COUNT(b.id) as booking_count,
        COALESCE(SUM(b.total_price), 0) as revenue
      FROM tours t
      LEFT JOIN bookings b ON t.id = b.tour_id AND b.status IN ('confirmed', 'completed')
      GROUP BY t.id
      ORDER BY booking_count DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        overview: stats[0],
        monthly_revenue: monthlyRevenue,
        top_tours: topTours
      }
    });
  })
);

/**
 * @route   GET /api/v1/bookings/:id
 * @desc    Get booking by ID
 * @access  Private (owner or admin)
 * 
 * @param   {id} - Booking ID
 * @returns {booking}
 */
router.get('/:id',
  authenticate,
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const bookings = await db.query(
      `SELECT 
        b.*,
        t.name as tour_name,
        t.description as tour_description,
        t.duration_days,
        t.images as tour_images,
        t.price_standard,
        t.price_premium,
        c.name as city_name,
        cat.name as category_name,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        p.id as payment_id,
        p.amount as payment_amount,
        p.method as payment_method,
        p.status as payment_status,
        p.transaction_id,
        p.created_at as payment_date
       FROM bookings b
       JOIN tours t ON b.tour_id = t.id
       JOIN cities c ON t.city_id = c.id
       JOIN categories cat ON t.category_id = cat.id
       JOIN users u ON b.user_id = u.id
       LEFT JOIN payments p ON b.payment_id = p.id
       WHERE b.id = ?`,
      [id]
    );

    if (bookings.length === 0) {
      throw new NotFoundError('Booking');
    }

    const booking = bookings[0];

    // Check ownership (non-admin can only view their own bookings)
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      throw new ApiError(403, 'Access denied');
    }

    res.json({
      success: true,
      data: {
        booking: {
          ...booking,
          tour_images: booking.tour_images ? JSON.parse(booking.tour_images) : []
        }
      }
    });
  })
);

/**
 * @route   POST /api/v1/bookings
 * @desc    Create a new booking
 * @access  Private (authenticated users)
 * 
 * @body    {tour_id, start_date, guests, tier?, special_requests?}
 * @returns {booking}
 */
router.post('/',
  authenticate,
  validateBookingCreate,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { tour_id, start_date, guests, tier, special_requests } = req.body;

    // Get tour details and validate
    const tours = await db.query(
      'SELECT * FROM tours WHERE id = ? AND is_active = 1',
      [tour_id]
    );

    if (tours.length === 0) {
      throw new ApiError(400, 'Tour not found or not available');
    }

    const tour = tours[0];

    // Check guest limit
    if (guests > tour.max_guests) {
      throw new ApiError(400, `Maximum ${tour.max_guests} guests allowed for this tour`);
    }

    // Calculate dates and price
    const startDate = new Date(start_date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + tour.duration_days);

    const selectedTier = tier || 'standard';
    const pricePerPerson = selectedTier === 'premium' && tour.price_premium 
      ? tour.price_premium 
      : tour.price_standard;
    const totalPrice = pricePerPerson * guests;

    // Create booking using transaction
    const result = await db.transaction(async (connection) => {
      // Insert booking
      const [bookingResult] = await connection.execute(
        `INSERT INTO bookings 
         (user_id, tour_id, start_date, end_date, guests, tier, 
          total_price, status, special_requests, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, NOW())`,
        [
          req.user.id, tour_id, start_date, 
          endDate.toISOString().split('T')[0],
          guests, selectedTier, totalPrice, special_requests || null
        ]
      );

      return bookingResult.insertId;
    });

    // Get created booking with full details
    const newBooking = await db.query(
      `SELECT 
        b.*,
        t.name as tour_name,
        t.duration_days,
        c.name as city_name
       FROM bookings b
       JOIN tours t ON b.tour_id = t.id
       JOIN cities c ON t.city_id = c.id
       WHERE b.id = ?`,
      [result]
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking: newBooking[0] }
    });
  })
);

/**
 * @route   PUT /api/v1/bookings/:id
 * @desc    Update a booking
 * @access  Private (owner can update details, admin can update status)
 * 
 * @param   {id} - Booking ID
 * @body    {status?, guests?, special_requests?}
 * @returns {booking}
 */
router.put('/:id',
  authenticate,
  validateIdParam,
  validateBookingUpdate,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, guests, special_requests } = req.body;

    // Get existing booking
    const bookings = await db.query(
      'SELECT * FROM bookings WHERE id = ?',
      [id]
    );

    if (bookings.length === 0) {
      throw new NotFoundError('Booking');
    }

    const booking = bookings[0];

    // Check permissions
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      throw new ApiError(403, 'Access denied');
    }

    // Only admin can change status
    if (status && req.user.role !== 'admin') {
      throw new ApiError(403, 'Only admin can change booking status');
    }

    // Can't modify completed or cancelled bookings
    if (['completed', 'cancelled'].includes(booking.status) && req.user.role !== 'admin') {
      throw new ApiError(400, 'Cannot modify completed or cancelled bookings');
    }

    const updates = [];
    const values = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }

    if (guests !== undefined) {
      // Recalculate price if guests changed
      const tour = await db.query('SELECT * FROM tours WHERE id = ?', [booking.tour_id]);
      const pricePerPerson = booking.tier === 'premium' && tour[0].price_premium 
        ? tour[0].price_premium 
        : tour[0].price_standard;
      
      updates.push('guests = ?', 'total_price = ?');
      values.push(guests, pricePerPerson * guests);
    }

    if (special_requests !== undefined) {
      updates.push('special_requests = ?');
      values.push(special_requests || null);
    }

    if (updates.length === 0) {
      throw new ApiError(400, 'No fields to update');
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    await db.query(
      `UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated booking
    const updatedBooking = await db.query(
      `SELECT b.*, t.name as tour_name, c.name as city_name
       FROM bookings b
       JOIN tours t ON b.tour_id = t.id
       JOIN cities c ON t.city_id = c.id
       WHERE b.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: { booking: updatedBooking[0] }
    });
  })
);

/**
 * @route   DELETE /api/v1/bookings/:id
 * @desc    Cancel/Delete a booking
 * @access  Private (owner can cancel pending, admin can delete)
 * 
 * @param   {id} - Booking ID
 * @returns {message}
 */
router.delete('/:id',
  authenticate,
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const bookings = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);

    if (bookings.length === 0) {
      throw new NotFoundError('Booking');
    }

    const booking = bookings[0];

    // Check permissions
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      throw new ApiError(403, 'Access denied');
    }

    // Non-admin users can only cancel pending bookings
    if (req.user.role !== 'admin') {
      if (booking.status !== 'pending') {
        throw new ApiError(400, 'Can only cancel pending bookings. Contact support for confirmed bookings.');
      }
      
      // Mark as cancelled instead of deleting
      await db.query(
        'UPDATE bookings SET status = "cancelled", updated_at = NOW() WHERE id = ?',
        [id]
      );

      return res.json({
        success: true,
        message: 'Booking cancelled successfully'
      });
    }

    // Admin can hard delete
    await db.query('DELETE FROM bookings WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  })
);

/**
 * @route   POST /api/v1/bookings/:id/payment
 * @desc    Process payment for a booking
 * @access  Private (booking owner)
 * 
 * @param   {id} - Booking ID
 * @body    {method, transaction_id?}
 * @returns {payment}
 */
router.post('/:id/payment',
  authenticate,
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { method, transaction_id } = req.body;

    // Validate payment method
    if (!method || !['stripe', 'paypal', 'bank_transfer', 'cash'].includes(method)) {
      throw new ApiError(400, 'Valid payment method required (stripe, paypal, bank_transfer, cash)');
    }

    // Get booking
    const bookings = await db.query(
      'SELECT * FROM bookings WHERE id = ?',
      [id]
    );

    if (bookings.length === 0) {
      throw new NotFoundError('Booking');
    }

    const booking = bookings[0];

    // Check ownership
    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      throw new ApiError(403, 'Access denied');
    }

    // Check if already paid
    if (booking.payment_id) {
      throw new ApiError(400, 'Booking already has a payment');
    }

    // Create payment record
    const result = await db.transaction(async (connection) => {
      const [paymentResult] = await connection.execute(
        `INSERT INTO payments 
         (booking_id, amount, method, status, transaction_id, currency, created_at)
         VALUES (?, ?, ?, 'completed', ?, 'MAD', NOW())`,
        [id, booking.total_price, method, transaction_id || null]
      );

      // Update booking with payment ID and confirm it
      await connection.execute(
        'UPDATE bookings SET payment_id = ?, status = "confirmed", updated_at = NOW() WHERE id = ?',
        [paymentResult.insertId, id]
      );

      return paymentResult.insertId;
    });

    // Get created payment
    const payment = await db.query('SELECT * FROM payments WHERE id = ?', [result]);

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      data: { payment: payment[0] }
    });
  })
);

module.exports = router;
