// Appointment.model.js
// Mongoose schema and model for Appointment documents
// Represents a booking/appointment made by a user for a business

import mongoose from "mongoose";

/**
 * Appointment Schema Definition
 * Defines the structure and validation rules for Appointment documents
 * Links a User (who made the appointment) with a Business (where appointment is made)
 */
const appointmentSchema = new mongoose.Schema(
  {
    // Reference to the User who made this appointment
    // Uses ObjectId to create a relationship with User collection
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Enables population of user data using .populate()
      required: true, // Every appointment must have a user
    },
    
    // Reference to the Business where appointment is scheduled
    // Uses ObjectId to create a relationship with Business collection
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business", // Enables population of business data using .populate()
      // Currently optional to support migration/initial implementation
      // In future versions, this should be required: true
    },
    
    // Date of the appointment
    date: {
      type: Date,
      required: true, // Appointment date is mandatory
    },
    
    // Time of the appointment (stored as string)
    // Format examples: "10:00 AM", "2:30 PM", etc.
    time: {
      type: String,
      required: true, // Appointment time is mandatory
    },
    
    // Current status of the appointment
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"], // Only these statuses allowed
      default: "pending", // New appointments start as pending
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Export the Appointment model
// Used throughout the application to interact with Appointment collection
export const Appointment = mongoose.model("Appointment", appointmentSchema);
