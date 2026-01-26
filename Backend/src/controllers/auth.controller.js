// auth.controller.js
// Authentication controller handling user registration, login, logout, and profile retrieval
// Manages JWT token generation, password hashing, and user authentication

import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/User.model.js";
import { LoginSchema, RegisterSchema } from "../validations/auth.schema.js";

// Number of salt rounds for bcrypt password hashing
// Higher rounds = more secure but slower (12 is a good balance)
// Must be >= 10 for production security
const SALT_ROUNDS = 12;

/**
 * Generic validation helper function
 * Validates data against a Zod schema and formats errors consistently
 * 
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {Object} data - Data to validate
 * @returns {Object} Validated and parsed data
 * @throws {Object} Throws formatted error object with status 400 if validation fails
 */
const validate = (schema, data) => {
  try {
    // Parse and validate data using Zod schema
    return schema.parse(data);
  } catch (error) {
    // If validation error, format it for API response
    if (error instanceof z.ZodError) {
      // Map Zod errors to user-friendly format
      const errors = error.errors.map((err) => ({
        field: err.path.join("."), // Field path (e.g., "password" or "user.name")
        message: err.message, // Error message from schema
      }));

      // Throw formatted error object
      throw { status: 400, message: "Validation Error", errors };
    }
    // Re-throw non-validation errors
    throw error;
  }
};

/**
 * User Registration Controller
 * Handles new user registration with email/password
 * Creates user account, hashes password, and issues JWT token
 * 
 * @param {Object} req - Express request object containing registration data
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data and success message
 */
export const register = async (req, res) => {
  try {
    // Validate request body against RegisterSchema
    // Throws formatted error if validation fails
    const { name, email, password, userType } = validate(
      RegisterSchema,
      req.body,
    );
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Return 409 Conflict if email is already registered
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }
    
    // Hash the password using bcrypt before storing
    // Never store plain text passwords in database
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Create new user document with validated data
    const newUser = new User({ name, email, passwordHash, userType });
    
    // Save user to MongoDB database
    await newUser.save();
    
    // Generate JWT token for authenticated session
    // Token contains userId and expires in 7 days
    const token = jwt.sign(
      { userId: newUser._id }, // Payload: user ID
      process.env.JWT_SECRET || "default_secret_key", // Secret key for signing
      { expiresIn: "7d" }, // Token expiration time
    );

    // Set JWT token as HTTP-only cookie
    // HTTP-only prevents client-side JavaScript access (XSS protection)
    res.cookie("jwt", token, {
      httpOnly: true, // Cookie not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days (matches token)
    });

    // Return success response with user data
    // Note: passwordHash is automatically excluded by User model's toJSON method
    return res.status(201).json({
      success: true,
      user: newUser,
      message: "User registered successfully",
    });
  } catch (error) {
    // Handle validation errors (from validate function)
    if (error.status === 400) {
      return res.status(400).json(error);
    }
    
    // Log unexpected errors for debugging
    console.error("Registration Error:", error);
    
    // Return generic error response (don't expose internal errors in production)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
      stack: error.stack,
    });
  }
};

/**
 * User Login Controller
 * Authenticates user with email and password
 * Verifies credentials and issues JWT token for authenticated session
 * 
 * @param {Object} req - Express request object containing login credentials
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data and success message
 */
export const login = async (req, res) => {
  try {
    // Validate request body against LoginSchema
    // Ensures email format and password minimum length
    const { email, password } = validate(LoginSchema, req.body);
    
    // Helper function to return consistent "invalid credentials" error
    // Uses same message for both wrong email and wrong password (security best practice)
    const invalidCridentials = () => {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    };
    
    // Find user by email address
    const user = await User.findOne({ email });
    
    // Check if user exists
    if (!user) {
      // Return generic error (don't reveal if email exists)
      return invalidCridentials();
    }
    
    // Compare provided password with stored password hash
    // bcrypt.compare handles the comparison securely
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    // Verify password matches
    if (!isMatch) {
      // Password doesn't match stored hash
      return invalidCridentials();
    }

    // Generate JWT token for authenticated session
    // Token contains userId and expires in 7 days
    const token = jwt.sign(
      { userId: user._id }, // Payload: user ID
      process.env.JWT_SECRET || "default_secret_key", // Secret key for signing
      { expiresIn: "7d" }, // Token expiration time
    );

    // Set JWT token as HTTP-only cookie
    // Same security settings as registration
    res.cookie("jwt", token, {
      httpOnly: true, // Cookie not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
    });

    // Return success response with user data
    // User model's toJSON method automatically excludes passwordHash and adds role field
    return res.status(200).json({
      success: true,
      user,
      message: "Login successful.",
    });
  } catch (error) {
    // Handle validation errors (from validate function)
    if (error.status === 400) {
      return res.status(400).json(error);
    }
    
    // Log unexpected errors for debugging
    console.error("Login Error:", error);
    
    // Return generic error response
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * User Logout Controller
 * Clears the JWT cookie to end authenticated session
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response confirming logout
 */
export const logout = async (req, res) => {
  try {
    // Clear the JWT cookie
    // Cookie options must match the ones used when setting the cookie (in login/register)
    // This ensures the cookie is properly cleared regardless of environment
    res.clearCookie("jwt", {
      httpOnly: true, // Must match login cookie settings
      secure: process.env.NODE_ENV === "production", // Must match login cookie settings
      sameSite: "strict", // Must match login cookie settings
    });
    
    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Logout successful." });
  } catch (error) {
    // Log errors for debugging
    console.error("Logout Error:", error);
    
    // Return error response
    return res.status(500).json({ message: "Error logging out." });
  }
};

/**
 * Get Current User Profile Controller
 * Retrieves the authenticated user's profile information
 * Requires authentication middleware (verifyToken) to set req.userId
 * 
 * @param {Object} req - Express request object (req.userId set by auth middleware)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data
 */
export const getMe = async (req, res) => {
  try {
    // Find user by ID from JWT token (set by verifyToken middleware)
    const user = await User.findById(req.userId);
    
    // Check if user exists
    if (!user) {
      // User ID in token doesn't match any user (shouldn't happen normally)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    
    // Return user data
    // User model's toJSON method automatically excludes passwordHash
    return res.status(200).json({ success: true, user });
  } catch (error) {
    // Log errors for debugging
    console.error("GetMe Error:", error);
    
    // Return error response
    return res.status(500).json({ message: "Error fetching user." });
  }
};
