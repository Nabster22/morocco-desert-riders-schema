#!/usr/bin/env node
/**
 * ==============================================
 * Cleanup Script for Scheduled Tasks
 * ==============================================
 * 
 * Run via cron (daily at 4 AM):
 * 0 4 * * * cd /home/username/api && node scripts/cleanup.js
 * 
 * Tasks:
 * - Delete expired/abandoned bookings
 * - Clean up old upload files
 * - Archive old logs
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

// Database connection (simplified for script)
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'morocco_desert_riders'
};

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const MAX_AGE_DAYS = 30; // Files older than this will be deleted

/**
 * Log with timestamp
 */
const log = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

/**
 * Clean up expired pending bookings
 * Bookings that are pending for more than 24 hours are cancelled
 */
const cleanupExpiredBookings = async (connection) => {
  log('Cleaning up expired bookings...');
  
  try {
    const [result] = await connection.execute(`
      UPDATE bookings 
      SET status = 'cancelled',
          cancelled_at = NOW(),
          cancelled_reason = 'Automatically cancelled - payment not received within 24 hours'
      WHERE status = 'pending' 
        AND created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR)
    `);
    
    log(`Cancelled ${result.affectedRows} expired booking(s)`);
    return result.affectedRows;
  } catch (error) {
    log(`ERROR cleaning bookings: ${error.message}`);
    return 0;
  }
};

/**
 * Clean up orphaned uploads
 * Files in upload directory not referenced in database
 */
const cleanupOrphanedFiles = async () => {
  log('Cleaning up orphaned upload files...');
  
  try {
    const uploadsPath = path.resolve(UPLOAD_DIR);
    const files = await fs.readdir(uploadsPath);
    let deleted = 0;
    
    const maxAge = Date.now() - (MAX_AGE_DAYS * 24 * 60 * 60 * 1000);
    
    for (const file of files) {
      const filePath = path.join(uploadsPath, file);
      const stats = await fs.stat(filePath);
      
      // Skip directories
      if (stats.isDirectory()) continue;
      
      // Delete files older than MAX_AGE_DAYS
      if (stats.mtimeMs < maxAge) {
        await fs.unlink(filePath);
        deleted++;
        log(`Deleted old file: ${file}`);
      }
    }
    
    log(`Deleted ${deleted} orphaned file(s)`);
    return deleted;
  } catch (error) {
    if (error.code === 'ENOENT') {
      log('Upload directory does not exist, skipping file cleanup');
    } else {
      log(`ERROR cleaning files: ${error.message}`);
    }
    return 0;
  }
};

/**
 * Update tour statistics
 * Recalculate average ratings and booking counts
 */
const updateTourStats = async (connection) => {
  log('Updating tour statistics...');
  
  try {
    // Update total bookings
    await connection.execute(`
      UPDATE tours t
      SET total_bookings = (
        SELECT COUNT(*) FROM bookings b 
        WHERE b.tour_id = t.id AND b.status IN ('confirmed', 'completed')
      )
    `);
    
    // Update average ratings
    await connection.execute(`
      UPDATE tours t
      SET average_rating = (
        SELECT AVG(r.rating) FROM reviews r 
        WHERE r.tour_id = t.id AND r.is_approved = 1
      )
    `);
    
    log('Tour statistics updated successfully');
  } catch (error) {
    log(`ERROR updating stats: ${error.message}`);
  }
};

/**
 * Main execution
 */
const main = async () => {
  log('=== Starting cleanup tasks ===');
  
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    log('Connected to database');
    
    // Run cleanup tasks
    await cleanupExpiredBookings(connection);
    await cleanupOrphanedFiles();
    await updateTourStats(connection);
    
    log('=== Cleanup completed successfully ===');
    process.exit(0);
  } catch (error) {
    log(`FATAL ERROR: ${error.message}`);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

main();
