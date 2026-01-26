// appointment.controller.js
// Appointment controller handling appointment-related operations
// Manages appointment creation, retrieval, and deletion

import { Appointment } from "../models/Appointment.model.js";

/**
 * Create Appointment Controller
 * Creates a new appointment booking for the authenticated user
 * Links appointment to a business (if businessId provided)
 * Requires authentication (req.userId set by verifyToken middleware)
 * 
 * @param {Object} req - Express request object (req.userId from auth middleware)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created appointment data
 */
export const createAppointment = async (req, res) => {
  try {
    // Extract appointment data from request body
    const { date, time, businessId } = req.body;
    
    // Get authenticated user ID from JWT token (set by verifyToken middleware)
    const userId = req.userId;

    // Create new appointment document
    const newAppointment = new Appointment({
      user: userId, // Link appointment to authenticated user
      business: businessId, // Link to business (optional in current schema)
      date, // Appointment date
      time, // Appointment time
      // status defaults to "pending" from schema
    });

    // Save appointment to MongoDB database
    await newAppointment.save();

    // Return success response with created appointment data
    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    // Log error for debugging
    console.error("Create Appointment Error:", error);
    
    // Return error response
    res
      .status(500)
      .json({ success: false, message: "Error booking appointment" });
  }
};

/**
 * Get My Appointments Controller
 * Retrieves all appointments made by the authenticated user
 * Populates business information to show which business each appointment is for
 * Requires authentication (req.userId set by verifyToken middleware)
 * 
 * @param {Object} req - Express request object (req.userId from auth middleware)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with array of user's appointments
 */
export const getMyAppointments = async (req, res) => {
  try {
    // Get authenticated user ID from JWT token
    const userId = req.userId;
    
    // Find all appointments for this user
    const appointments = await Appointment.find({ user: userId })
      .populate("business", "name") // Populate business reference with name field
      .sort({
        createdAt: -1, // צריך -1 כדי למיין מהחדש לישן
      });

    // Return appointments array
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    // Log error for debugging
    console.error("Get Appointments Error:", error);
    
    // Return error response
    res
      .status(500)
      .json({ success: false, message: "Error fetching appointments" });
  }
};

/**
 * Delete Appointment Controller
 * Deletes an appointment by ID
 * Currently allows any authenticated user to delete any appointment (security improvement needed)
 * Requires authentication (req.userId set by verifyToken middleware)
 * 
 * @param {Object} req - Express request object (req.userId from auth middleware, req.params.id for appointment ID)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response confirming deletion
 */
export const deleteAppointment = async (req, res) => {
  try {
    // Extract appointment ID from URL parameters
    const { id } = req.params;
    
    // Get authenticated user ID from JWT token
    const userId = req.userId;

    // TODO: Security improvement needed
    // Should verify that the user owns this appointment before allowing deletion
    // Current implementation allows any authenticated user to delete any appointment
    // Better approach: Check if appointment.user matches userId before deleting

    // Delete appointment by ID
    await Appointment.findByIdAndDelete(id);

    // Return success response
    res.status(200).json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    // Log error for debugging
    console.error("Delete Appointment Error:", error);
    
    // Return error response
    res
      .status(500)
      .json({ success: false, message: "Error deleting appointment" });
  }
};
