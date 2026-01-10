/**
 * ==============================================
 * Database Configuration and Connection Pool
 * ==============================================
 * 
 * This module configures the MySQL database connection pool
 * using mysql2 with promise support for async/await operations.
 * 
 * Connection pooling improves performance by reusing connections
 * instead of creating new ones for each query.
 */

const mysql = require('mysql2/promise');

/**
 * Database configuration object
 * Values are loaded from environment variables with sensible defaults
 */
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'morocco_desert_riders',
  
  // Connection pool settings
  waitForConnections: true,  // Queue requests when no connections available
  connectionLimit: 10,       // Maximum number of connections in pool
  queueLimit: 0,             // Unlimited queue (0 = no limit)
  
  // Enable named placeholders for cleaner queries
  namedPlaceholders: true,
  
  // Timezone configuration
  timezone: '+00:00',        // Use UTC
  
  // Return dates as JavaScript Date objects
  dateStrings: false
};

/**
 * Create the connection pool
 * This pool is shared across the entire application
 */
const pool = mysql.createPool(dbConfig);

/**
 * Test the database connection
 * Called on server startup to verify connectivity
 * 
 * @returns {Promise<boolean>} True if connection successful
 * @throws {Error} If connection fails
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`📦 Connected to MySQL database: ${dbConfig.database}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

/**
 * Execute a query with parameters
 * This is the main method for database operations
 * 
 * @param {string} sql - SQL query string
 * @param {Array|Object} params - Query parameters (array for ? placeholders, object for named)
 * @returns {Promise<Array>} Query results
 * 
 * @example
 * // Using positional parameters
 * const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
 * 
 * // Using named parameters
 * const [users] = await db.query(
 *   'SELECT * FROM users WHERE email = :email',
 *   { email: 'user@example.com' }
 * );
 */
const query = async (sql, params = []) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('❌ Query error:', error.message);
    console.error('Query:', sql);
    console.error('Params:', params);
    throw error;
  }
};

/**
 * Get a connection from the pool for transactions
 * Remember to release the connection when done!
 * 
 * @returns {Promise<Connection>} Database connection
 * 
 * @example
 * const connection = await db.getConnection();
 * try {
 *   await connection.beginTransaction();
 *   // ... perform queries
 *   await connection.commit();
 * } catch (error) {
 *   await connection.rollback();
 *   throw error;
 * } finally {
 *   connection.release();
 * }
 */
const getConnection = async () => {
  return await pool.getConnection();
};

/**
 * Execute a transaction with automatic commit/rollback
 * Simplifies transaction handling with proper error management
 * 
 * @param {Function} callback - Async function receiving connection
 * @returns {Promise<any>} Result of the callback
 * @throws {Error} Rolls back and rethrows on error
 * 
 * @example
 * const result = await db.transaction(async (connection) => {
 *   await connection.execute('INSERT INTO orders ...', [...]);
 *   await connection.execute('UPDATE inventory ...', [...]);
 *   return { success: true };
 * });
 */
const transaction = async (callback) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Export all database utilities
module.exports = {
  pool,
  query,
  getConnection,
  transaction,
  testConnection
};
