/**
 * ==============================================
 * Database Migration Script
 * ==============================================
 * 
 * Creates all necessary tables for the Morocco Desert Riders API.
 * Run with: npm run migrate
 * 
 * This script uses the schema from public/schema.sql
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

/**
 * Database configuration for initial connection (without database)
 */
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true // Allow multiple SQL statements
};

const dbName = process.env.DB_NAME || 'morocco_desert_riders';

/**
 * Run database migrations
 */
async function migrate() {
  console.log('🚀 Starting database migration...\n');

  let connection;

  try {
    // Create connection without database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL server');

    // Create database if not exists
    console.log(`📦 Creating database "${dbName}" if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`   ✅ Database "${dbName}" ready`);

    // Switch to the database
    await connection.query(`USE \`${dbName}\``);

    // Read SQL schema file
    const schemaPath = path.join(__dirname, '../../../schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      // If schema.sql doesn't exist in expected location, use embedded schema
      console.log('📝 Using embedded schema (schema.sql not found at expected path)');
      await createTables(connection);
    } else {
      console.log('📝 Reading schema from schema.sql...');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Execute schema
      console.log('🔨 Executing schema...');
      await connection.query(schema);
      console.log('   ✅ Schema executed successfully');
    }

    console.log('\n✅ Migration completed successfully!\n');
    console.log('Next steps:');
    console.log('  1. Run "npm run seed" to populate sample data');
    console.log('  2. Run "npm run dev" to start the server');
    console.log('');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Tip: Check your database credentials in .env file');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Tip: Make sure MySQL server is running');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

/**
 * Create tables using embedded schema (fallback)
 */
async function createTables(connection) {
  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      role ENUM('client', 'admin') DEFAULT 'client',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_role (role)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Cities table
    `CREATE TABLE IF NOT EXISTS cities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      image_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Categories table
    `CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      icon VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Tours table
    `CREATE TABLE IF NOT EXISTS tours (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      city_id INT NOT NULL,
      category_id INT NOT NULL,
      description TEXT,
      duration_days INT NOT NULL DEFAULT 1,
      price_standard DECIMAL(10, 2) NOT NULL,
      price_premium DECIMAL(10, 2),
      images JSON,
      max_guests INT DEFAULT 10,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE RESTRICT,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
      INDEX idx_city (city_id),
      INDEX idx_category (category_id),
      INDEX idx_active (is_active),
      INDEX idx_price (price_standard)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Payments table (created before bookings due to foreign key)
    `CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      booking_id INT,
      amount DECIMAL(10, 2) NOT NULL,
      method ENUM('stripe', 'paypal', 'bank_transfer', 'cash') NOT NULL,
      status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
      transaction_id VARCHAR(255),
      currency VARCHAR(3) DEFAULT 'MAD',
      payment_details JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_status (status),
      INDEX idx_method (method)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Bookings table
    `CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      tour_id INT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      guests INT NOT NULL DEFAULT 1,
      tier ENUM('standard', 'premium') DEFAULT 'standard',
      total_price DECIMAL(10, 2) NOT NULL,
      status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
      payment_id INT,
      special_requests TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE RESTRICT,
      FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
      INDEX idx_user (user_id),
      INDEX idx_tour (tour_id),
      INDEX idx_status (status),
      INDEX idx_dates (start_date, end_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Add booking_id foreign key to payments
    `ALTER TABLE payments ADD CONSTRAINT fk_payment_booking 
     FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE`,

    // Reviews table
    `CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      tour_id INT NOT NULL,
      rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      is_verified BOOLEAN DEFAULT FALSE,
      is_published BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
      INDEX idx_tour (tour_id),
      INDEX idx_rating (rating),
      INDEX idx_published (is_published),
      UNIQUE KEY unique_user_tour (user_id, tour_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  ];

  for (const table of tables) {
    try {
      await connection.query(table);
      const tableName = table.match(/(?:CREATE TABLE|ALTER TABLE)[^`]*`?(\w+)`?/i)?.[1] || 'unknown';
      console.log(`   ✅ ${tableName}`);
    } catch (error) {
      // Ignore errors for constraints that might already exist
      if (!error.message.includes('Duplicate')) {
        throw error;
      }
    }
  }
}

// Run migration
migrate();
