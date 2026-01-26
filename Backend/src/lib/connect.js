// connect.js
// Database connection module
// Handles the connection to MongoDB using Mongoose ODM

import mongoose from "mongoose";

/**
 * Establishes connection to MongoDB database
 * Uses the DATABASE_URL from environment variables
 * This function is called when the server starts
 * 
 * @async
 * @function connectDB
 * @throws {Error} Logs error if connection fails but doesn't throw to prevent server crash
 */
export async function connectDB() {
  try {
    // Connect to MongoDB using the connection string from environment variables
    // Mongoose handles connection pooling and retry logic automatically
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database Connected");
  } catch (error) {
    // Log connection errors for debugging
    // Note: In production, you might want to retry or exit the process
    console.log("Database Connection Error:", error);
  }
}
