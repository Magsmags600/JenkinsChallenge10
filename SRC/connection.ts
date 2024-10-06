import dotenv from 'dotenv';
dotenv.config();

// Import and require Pool (node-postgres)
import pkg from 'pg';
const { Pool } = pkg;


// Create a new instance of the Pool object for managing PostgreSQL connections
const pool = new Pool({
  user: process.env.DB_USER,         // PostgreSQL username from environment variables
  password: process.env.DB_PASSWORD, // PostgreSQL password from environment variables
  host: 'localhost',                 // Host for database (typically localhost)
  database: process.env.DB_NAME,     // Database name from environment variables
  port: 5432,                        // Default PostgreSQL port
});

// Function to connect to the database and handle connection errors
const connectToDb = async () => {
  try {
    await pool.connect();
    console.log('Connected to the employee tracker database.');
  } catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
};

// Export both the pool and the connection function
export { pool, connectToDb };
