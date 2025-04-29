import sql from "mssql";  
import dotenv from "dotenv";

dotenv.config();

const { ConnectionPool } = sql;  

// Database connection pool configuration
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Use encryption (true for Azure SQL, false otherwise)
    trustServerCertificate: true, // Required for self-signed certificates
  },
  pool: {
    max: 10, // Maximum number of connections in the pool
    min: 1,  // Minimum number of connections
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  },
};

// Create and initialize the connection pool once
let poolPromise;

const connectDB = () => {
  if (!poolPromise) {
    
    poolPromise = new ConnectionPool(config).connect()
      .then(pool => {
        console.log("✅ Database connected successfully!");
        return pool;
      })
      .catch(err => {
        console.error("❌ Database Connection Failed!", err);
        process.exit(1); // Exit the process if connection fails
      });
  }
  return poolPromise; // Return the same pool for all subsequent requests
};

export default connectDB;
