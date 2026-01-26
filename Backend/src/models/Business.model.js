// Business.model.js
// Mongoose schema and model for Business documents
// Represents a business entity owned by a user

import mongoose from "mongoose";

/**
 * Business Schema Definition
 * Defines the structure and validation rules for Business documents
 * Each business is linked to a User through the owner field
 */
const businessSchema = new mongoose.Schema(
  {
    // Reference to the User who owns this business
    // Uses ObjectId to create a relationship with User collection
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Enables population of owner data using .populate()
      required: true, // Every business must have an owner
      unique: true, // One business per user (enforced at database level)
    },
    
    // Business name/title
    name: {
      type: String,
      required: true, // Business name is mandatory
      trim: true, // Removes leading/trailing whitespace
    },
    
    // Optional description of the business
    description: {
      type: String,
      trim: true, // Removes leading/trailing whitespace
    },
    
    // Business operating hours as a string
    // Format: "9:00 AM - 5:00 PM" (can be customized)
    operatingHours: {
      type: String,
      default: "9:00 AM - 5:00 PM", // Default hours if not specified
    },
    
    // Business category/type
    category: {
      type: String,
      enum: ["Barber Shop", "Restaurant", "Shows", "Other"], // Only these categories allowed
      default: "Other", // Default category if not specified
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Export the Business model
// Used throughout the application to interact with Business collection
export const Business = mongoose.model("Business", businessSchema);
