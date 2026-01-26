// User.model.js
// Mongoose schema and model for User documents
// Defines the structure and behavior of user data in MongoDB

import mongoose from "mongoose";

/**
 * User Schema Definition
 * Defines the structure, validation rules, and default values for User documents
 */
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: true, // Name is mandatory
      trim: true, // Removes leading/trailing whitespace
    },
    
    // User's email address (used for login)
    email: {
      type: String,
      required: true, // Email is mandatory
      trim: true, // Removes leading/trailing whitespace
      unique: true, // Ensures no duplicate emails in database
    },
    
    // Hashed password (never store plain text passwords!)
    // Password is hashed using bcrypt before saving to database
    passwordHash: {
      type: String,
      required: true, // Password hash is mandatory
    },
    
    // User role/type determining access level and permissions
    userType: {
      type: String,
      enum: ["user", "business", "admin"], // Only these values are allowed
      default: "user", // Default role if not specified during registration
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

/**
 * Custom toJSON method
 * Modifies how User objects are serialized when converted to JSON
 * This ensures sensitive data (passwordHash) is never sent to clients
 * Also maps userType to 'role' for frontend consistency
 */
userSchema.methods.toJSON = function () {
  // Convert Mongoose document to plain JavaScript object
  const userObject = this.toObject();
  
  // Remove passwordHash from the object before sending to client
  // This prevents password hash from being exposed in API responses
  delete userObject.passwordHash;
  
  // Map userType field to 'role' field for frontend consistency
  // Frontend expects 'role' but database stores 'userType'
  if (userObject.userType) {
    userObject.role = userObject.userType;
  }
  
  return userObject;
};

// Export the User model
// This model is used throughout the application to interact with User collection
export const User = mongoose.model("User", userSchema);
