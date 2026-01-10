/**
 * ==============================================
 * Export Routes
 * ==============================================
 * 
 * Handles data export functionality:
 * - PDF invoice generation for bookings
 * - CSV/Excel export of bookings data
 * 
 * All routes are prefixed with /api/v1/export
 */

const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { Parser } = require('json2csv');
const db = require('../config/database');
const { authenticate, adminOnly } = require('../middleware/auth.middleware');
const { asyncHandler, ApiError, NotFoundError } = require('../middleware/error.middleware');
const { validateIdParam, validateRequest } = require('../middleware/validation.middleware');

/**
 * @route   GET /api/v1/export/booking/:id/invoice
 * @desc    Generate PDF invoice for a booking
 * @access  Private (booking owner or admin)
 * 
 * @param   {id} - Booking ID
 * @returns {PDF file}
 */
router.get('/booking/:id/invoice',
  authenticate,
  validateIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Get booking with all related data
    const bookings = await db.query(
      `SELECT 
        b.*,
        t.name as tour_name,
        t.description as tour_description,
        t.duration_days,
        t.price_standard,
        t.price_premium,
        c.name as city_name,
        cat.name as category_name,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
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

    // Check ownership
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      throw new ApiError(403, 'Access denied');
    }

    // Create PDF document
    const doc = new PDFDocument({ 
      size: 'A4',
      margin: 50,
      info: {
        Title: `Invoice #${booking.id}`,
        Author: 'Morocco Desert Riders'
      }
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${booking.id}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // ============================================
    // PDF CONTENT
    // ============================================

    // Header with logo area
    doc.fontSize(28)
       .fillColor('#C87533') // Desert orange color
       .text('MOROCCO DESERT RIDERS', 50, 50, { align: 'center' })
       .fontSize(12)
       .fillColor('#666')
       .text('Premium Sahara Adventures', { align: 'center' });

    // Invoice title and number
    doc.moveDown(2)
       .fontSize(20)
       .fillColor('#333')
       .text('INVOICE', { align: 'center' })
       .fontSize(12)
       .fillColor('#666')
       .text(`Invoice #: INV-${String(booking.id).padStart(6, '0')}`, { align: 'center' })
       .text(`Date: ${new Date().toLocaleDateString('en-US', { 
         year: 'numeric', 
         month: 'long', 
         day: 'numeric' 
       })}`, { align: 'center' });

    // Horizontal line
    doc.moveDown()
       .strokeColor('#C87533')
       .lineWidth(2)
       .moveTo(50, doc.y)
       .lineTo(545, doc.y)
       .stroke();

    // Customer Information
    doc.moveDown(2)
       .fontSize(14)
       .fillColor('#333')
       .text('Bill To:', { underline: true })
       .fontSize(11)
       .fillColor('#444')
       .moveDown(0.5)
       .text(booking.user_name)
       .text(booking.user_email)
       .text(booking.user_phone || 'No phone provided');

    // Booking Details Section
    doc.moveDown(2)
       .fontSize(14)
       .fillColor('#333')
       .text('Booking Details:', { underline: true })
       .moveDown(0.5);

    // Create a table-like structure
    const tableTop = doc.y;
    const tableLeft = 50;
    const colWidths = [150, 345];

    const details = [
      ['Booking Reference:', `BK-${String(booking.id).padStart(6, '0')}`],
      ['Tour Name:', booking.tour_name],
      ['Category:', booking.category_name],
      ['Destination:', booking.city_name],
      ['Duration:', `${booking.duration_days} days`],
      ['Start Date:', new Date(booking.start_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })],
      ['End Date:', new Date(booking.end_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })],
      ['Number of Guests:', `${booking.guests} person(s)`],
      ['Package Tier:', booking.tier === 'premium' ? 'Premium' : 'Standard'],
      ['Status:', booking.status.charAt(0).toUpperCase() + booking.status.slice(1)]
    ];

    details.forEach((row, i) => {
      const y = tableTop + (i * 22);
      doc.fontSize(10)
         .fillColor('#666')
         .text(row[0], tableLeft, y, { width: colWidths[0] })
         .fillColor('#333')
         .text(row[1], tableLeft + colWidths[0], y, { width: colWidths[1] });
    });

    // Special Requests (if any)
    if (booking.special_requests) {
      doc.moveDown(3)
         .fontSize(14)
         .fillColor('#333')
         .text('Special Requests:', { underline: true })
         .moveDown(0.5)
         .fontSize(10)
         .fillColor('#444')
         .text(booking.special_requests, {
           width: 495,
           align: 'left'
         });
    }

    // Price Breakdown
    doc.moveDown(2)
       .fontSize(14)
       .fillColor('#333')
       .text('Price Breakdown:', { underline: true })
       .moveDown(0.5);

    const pricePerPerson = booking.tier === 'premium' && booking.price_premium
      ? booking.price_premium
      : booking.price_standard;

    const priceDetails = [
      [`Price per person (${booking.tier})`, `${pricePerPerson.toFixed(2)} MAD`],
      ['Number of guests', `× ${booking.guests}`],
      ['', '─────────────'],
      ['Total Amount', `${booking.total_price.toFixed(2)} MAD`]
    ];

    const priceTableTop = doc.y;
    priceDetails.forEach((row, i) => {
      const y = priceTableTop + (i * 22);
      doc.fontSize(11)
         .fillColor(i === 3 ? '#C87533' : '#444')
         .font(i === 3 ? 'Helvetica-Bold' : 'Helvetica')
         .text(row[0], 300, y, { width: 150, align: 'left' })
         .text(row[1], 450, y, { width: 95, align: 'right' });
    });

    // Payment Information
    if (booking.payment_status) {
      doc.moveDown(3)
         .fontSize(14)
         .fillColor('#333')
         .font('Helvetica-Bold')
         .text('Payment Information:', { underline: true })
         .font('Helvetica')
         .moveDown(0.5)
         .fontSize(10)
         .fillColor('#444')
         .text(`Payment Method: ${booking.payment_method || 'N/A'}`)
         .text(`Payment Status: ${booking.payment_status}`)
         .text(`Transaction ID: ${booking.transaction_id || 'N/A'}`)
         .text(`Payment Date: ${booking.payment_date ? 
           new Date(booking.payment_date).toLocaleDateString() : 'N/A'}`);
    }

    // Footer
    doc.moveDown(3)
       .strokeColor('#C87533')
       .lineWidth(1)
       .moveTo(50, doc.y)
       .lineTo(545, doc.y)
       .stroke()
       .moveDown()
       .fontSize(10)
       .fillColor('#666')
       .text('Thank you for choosing Morocco Desert Riders!', { align: 'center' })
       .moveDown(0.5)
       .fontSize(8)
       .text('Morocco Desert Riders | contact@moroccodesert.com | +212 600 000 000', { align: 'center' })
       .text('© 2024 Morocco Desert Riders. All rights reserved.', { align: 'center' });

    // Finalize PDF
    doc.end();
  })
);

/**
 * @route   GET /api/v1/export/bookings/csv
 * @desc    Export bookings to CSV
 * @access  Admin only
 * 
 * @query   {start_date?, end_date?, status?}
 * @returns {CSV file}
 */
router.get('/bookings/csv',
  authenticate,
  adminOnly,
  asyncHandler(async (req, res) => {
    const { start_date, end_date, status } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (start_date) {
      whereClause += ' AND b.created_at >= ?';
      params.push(start_date);
    }

    if (end_date) {
      whereClause += ' AND b.created_at <= ?';
      params.push(end_date + ' 23:59:59');
    }

    if (status) {
      whereClause += ' AND b.status = ?';
      params.push(status);
    }

    // Get bookings data
    const bookings = await db.query(
      `SELECT 
        b.id as booking_id,
        b.created_at as booking_date,
        b.start_date,
        b.end_date,
        b.guests,
        b.tier,
        b.total_price,
        b.status,
        b.special_requests,
        u.name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone,
        t.name as tour_name,
        t.duration_days,
        c.name as city,
        cat.name as category,
        p.method as payment_method,
        p.status as payment_status,
        p.transaction_id
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN tours t ON b.tour_id = t.id
       JOIN cities c ON t.city_id = c.id
       JOIN categories cat ON t.category_id = cat.id
       LEFT JOIN payments p ON b.payment_id = p.id
       ${whereClause}
       ORDER BY b.created_at DESC`,
      params
    );

    // Define CSV fields
    const fields = [
      { label: 'Booking ID', value: 'booking_id' },
      { label: 'Booking Date', value: 'booking_date' },
      { label: 'Customer Name', value: 'customer_name' },
      { label: 'Customer Email', value: 'customer_email' },
      { label: 'Customer Phone', value: 'customer_phone' },
      { label: 'Tour Name', value: 'tour_name' },
      { label: 'City', value: 'city' },
      { label: 'Category', value: 'category' },
      { label: 'Duration (Days)', value: 'duration_days' },
      { label: 'Start Date', value: 'start_date' },
      { label: 'End Date', value: 'end_date' },
      { label: 'Guests', value: 'guests' },
      { label: 'Tier', value: 'tier' },
      { label: 'Total Price (MAD)', value: 'total_price' },
      { label: 'Status', value: 'status' },
      { label: 'Payment Method', value: 'payment_method' },
      { label: 'Payment Status', value: 'payment_status' },
      { label: 'Transaction ID', value: 'transaction_id' },
      { label: 'Special Requests', value: 'special_requests' }
    ];

    // Generate CSV
    const parser = new Parser({ fields });
    const csv = parser.parse(bookings);

    // Set response headers
    const filename = `bookings-export-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    res.send(csv);
  })
);

/**
 * @route   GET /api/v1/export/bookings/excel
 * @desc    Export bookings to Excel
 * @access  Admin only
 * 
 * @query   {start_date?, end_date?, status?}
 * @returns {Excel file}
 */
router.get('/bookings/excel',
  authenticate,
  adminOnly,
  asyncHandler(async (req, res) => {
    const { start_date, end_date, status } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (start_date) {
      whereClause += ' AND b.created_at >= ?';
      params.push(start_date);
    }

    if (end_date) {
      whereClause += ' AND b.created_at <= ?';
      params.push(end_date + ' 23:59:59');
    }

    if (status) {
      whereClause += ' AND b.status = ?';
      params.push(status);
    }

    // Get bookings data
    const bookings = await db.query(
      `SELECT 
        b.id as booking_id,
        b.created_at as booking_date,
        b.start_date,
        b.end_date,
        b.guests,
        b.tier,
        b.total_price,
        b.status,
        b.special_requests,
        u.name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone,
        t.name as tour_name,
        t.duration_days,
        c.name as city,
        cat.name as category,
        p.method as payment_method,
        p.status as payment_status,
        p.transaction_id
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN tours t ON b.tour_id = t.id
       JOIN cities c ON t.city_id = c.id
       JOIN categories cat ON t.category_id = cat.id
       LEFT JOIN payments p ON b.payment_id = p.id
       ${whereClause}
       ORDER BY b.created_at DESC`,
      params
    );

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Morocco Desert Riders';
    workbook.created = new Date();

    // Add Bookings worksheet
    const worksheet = workbook.addWorksheet('Bookings', {
      headerFooter: {
        firstHeader: 'Morocco Desert Riders - Bookings Export'
      }
    });

    // Define columns
    worksheet.columns = [
      { header: 'Booking ID', key: 'booking_id', width: 12 },
      { header: 'Booking Date', key: 'booking_date', width: 15 },
      { header: 'Customer Name', key: 'customer_name', width: 20 },
      { header: 'Customer Email', key: 'customer_email', width: 25 },
      { header: 'Customer Phone', key: 'customer_phone', width: 15 },
      { header: 'Tour Name', key: 'tour_name', width: 30 },
      { header: 'City', key: 'city', width: 15 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Duration (Days)', key: 'duration_days', width: 12 },
      { header: 'Start Date', key: 'start_date', width: 12 },
      { header: 'End Date', key: 'end_date', width: 12 },
      { header: 'Guests', key: 'guests', width: 8 },
      { header: 'Tier', key: 'tier', width: 10 },
      { header: 'Total Price (MAD)', key: 'total_price', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Payment Method', key: 'payment_method', width: 15 },
      { header: 'Payment Status', key: 'payment_status', width: 15 },
      { header: 'Transaction ID', key: 'transaction_id', width: 20 },
      { header: 'Special Requests', key: 'special_requests', width: 30 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC87533' } // Desert orange
    };

    // Add data rows
    bookings.forEach((booking) => {
      worksheet.addRow({
        ...booking,
        booking_date: new Date(booking.booking_date).toLocaleDateString(),
        start_date: new Date(booking.start_date).toLocaleDateString(),
        end_date: new Date(booking.end_date).toLocaleDateString()
      });
    });

    // Add summary worksheet
    const summarySheet = workbook.addWorksheet('Summary');
    
    // Calculate summary statistics
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.total_price), 0);
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const avgGuests = bookings.length > 0 
      ? (bookings.reduce((sum, b) => sum + b.guests, 0) / bookings.length).toFixed(1)
      : 0;

    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 25 },
      { header: 'Value', key: 'value', width: 20 }
    ];

    summarySheet.getRow(1).font = { bold: true };

    summarySheet.addRows([
      { metric: 'Total Bookings', value: totalBookings },
      { metric: 'Total Revenue (MAD)', value: totalRevenue.toFixed(2) },
      { metric: 'Confirmed Bookings', value: confirmedBookings },
      { metric: 'Completed Bookings', value: completedBookings },
      { metric: 'Pending Bookings', value: pendingBookings },
      { metric: 'Cancelled Bookings', value: cancelledBookings },
      { metric: 'Average Guests per Booking', value: avgGuests },
      { metric: 'Export Date', value: new Date().toLocaleString() }
    ]);

    // Set response headers
    const filename = `bookings-export-${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  })
);

module.exports = router;
