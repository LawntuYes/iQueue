// user.controller.js
// User controller handling user-related operations
// Currently provides functionality to retrieve all users

import { User } from "../models/User.model.js";

/**
 * Get All Users Controller
 * Retrieves a list of all users in the system
 * Requires authentication (protected by verifyToken middleware)
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with array of all users
 */
export const getUsers = async (req, res) => {
  try {
    // Find all users in the database
    // Empty object {} means no filter - get all documents
    const users = await User.find({});
    
    // Return users array
    // Each user's passwordHash is automatically excluded by User model's toJSON method
    res.status(200).json(users);
  } catch (error) {
    // Log error details for debugging
    console.log("Error in getUsers controller", error.message);
    
    // Return generic error response
    res.status(500).json({ message: "Internal Server Error" });
  }
};
