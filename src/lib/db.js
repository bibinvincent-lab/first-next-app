// src/lib/db.js
import mysql from "mysql2/promise";

// Create connection pool for better performance and reliability
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Get connection from pool
export const createConnection = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// For backward compatibility, also export pool directly
export { pool };