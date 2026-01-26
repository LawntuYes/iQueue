// business.controller.js
// Business controller handling business-related operations
// Manages business creation, retrieval, and appointment viewing

import { Business } from "../models/Business.model.js";
import { Appointment } from "../models/Appointment.model.js";

/**
 * Create Business Controller
 * Creates a new business entity for the authenticated user
 * Enforces one business per user rule
 * Requires authentication (req.userId set by verifyToken middleware)
 * 
 * @param {Object} req - Express request object (req.userId from auth middleware)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created business data
 */
export const createBusiness = async (req, res) => {
  try {
    // Extract business data from request body
    const { name, description, operatingHours, category } = req.body;
    
    // Get authenticated user ID from JWT token (set by verifyToken middleware)
    const userId = req.userId;

    // Check if user already owns a business
    // Business schema has unique constraint on owner field, but checking here for better error message
    const existingBusiness = await Business.findOne({ owner: userId });
    if (existingBusiness) {
      // Return error if user already has a business
      return res
        .status(400)
        .json({ success: false, message: "User already owns a business" });
    }

    // Create new business document
    const newBusiness = new Business({
      owner: userId, // Link business to authenticated user
      name,
      description,
      operatingHours,
      category: category || "Other", // Default to "Other" if not provided
    });

    // Save business to MongoDB database
    await newBusiness.save();

    // Return success response with created business data
    res
      .status(201)
      .json({
        success: true,
        message: "Business created successfully",
        business: newBusiness,
      });
  } catch (error) {
    // Log error for debugging
    console.error("Create Business Error:", error);
    
    // Return error response
    res
      .status(500)
      .json({ success: false, message: "Error creating business" });
  }
};

/**
 * Get My Business Controller
 * Retrieves the business owned by the authenticated user
 * Returns null if user doesn't own a business yet (not an error)
 * Requires authentication (req.userId set by verifyToken middleware)
 * 
 * @param {Object} req - Express request object (req.userId from auth middleware)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with business data or null
 */
export const getMyBusiness = async (req, res) => {
  try {
    // Get authenticated user ID from JWT token
    const userId = req.userId;
    console.log("getMyBusiness - Requesting User ID:", userId);

    // Find business owned by this user
    const business = await Business.findOne({ owner: userId });
    console.log("getMyBusiness - Found Business:", business);

    // Check if business exists
    if (!business) {
      // User doesn't have a business yet - this is valid, not an error
      // Return success with null business
      return res.status(200).json({ success: true, business: null });
    }

    // Return business data
    res.status(200).json({ success: true, business });
  } catch (error) {
    // Log error for debugging
    console.error("Get My Business Error:", error);
    
    // Return error response
    res
      .status(500)
      .json({ success: false, message: "Error fetching business" });
  }
};

/**
 * Get Business Appointments Controller
 * Retrieves all appointments for the authenticated user's business
 * Populates user information to show who made each appointment
 * Requires authentication and user must own a business
 * 
 * @param {Object} req - Express request object (req.userId from auth middleware)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with array of appointments
 */
export const getBusinessAppointments = async (req, res) => {
  try {
    // Get authenticated user ID from JWT token
    const userId = req.userId;
    
    // Find business owned by this user
    const business = await Business.findOne({ owner: userId });

    // Check if user owns a business
    if (!business) {
      // User doesn't have a business - return error
      return res
        .status(404)
        .json({ success: false, message: "Business not found" });
    }

    // Fetch all appointments for this business
    // Note: Appointments must have business field set when created
    // If business field is optional/null, this query may return empty results
    const appointments = await Appointment.find({ business: business._id })
      .populate("user", "name email") // Populate user reference with name and email fields
      .sort({ date: 1, time: 1 }); // Sort by date ascending, then time ascending

    // Return appointments array
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    // Log error for debugging
    console.error("Get Business Appointments Error:", error);
    
    // Return error response
    res
      .status(500)
      .json({ success: false, message: "Error fetching appointments" });
  }
};

/**
 * Get All Businesses Controller
 * Retrieves a list of all businesses in the system
 * Returns limited fields (name, description, category, operatingHours, owner)
 * Requires authentication (protected by verifyToken middleware)
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with array of all businesses
 */
export const getAllBusinesses = async (req, res) => {
  try {
    // Find all businesses, selecting only specified fields
    // Second parameter limits which fields are returned (projection)
    const businesses = await Business.find(
      {}, // Empty filter - get all businesses
      "name description category operatingHours owner" // Fields to include in response
    );
    
    // Return businesses array
    res.status(200).json({ success: true, businesses });
  } catch (error) {
    // Log error for debugging
    console.error("Get All Businesses Error:", error);
    
    // Return error response
    res
      .status(500)
      .json({ success: false, message: "Error fetching businesses" });
  }
};
