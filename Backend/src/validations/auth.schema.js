// auth.schema.js
// Zod validation schemas for authentication endpoints
// Provides runtime validation and type checking for request data

import { z } from "zod";

/**
 * Registration Schema
 * Validates user registration data before processing
 * Ensures data quality and security requirements are met
 */
export const RegisterSchema = z.object({
  // User's full name
  name: z.string().min(2, "Name must be at least 2 characters long"),
  
  // User's email address
  email: z.email("Invalid email address"),
  
  // User's password with security requirements
  password: z.string()
    .min(8, "Password must be at least 8 characters long") // Minimum length requirement
    .regex(/[0-9]/, "Password must contain at least one number") // Must contain a digit
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"), // Must contain uppercase letter
  
  // Optional user type (defaults to "user" if not provided)
  userType: z.enum(["user", "business"]).optional(),
});

/**
 * Login Schema
 * Validates user login credentials
 * Simpler validation than registration (no password complexity check needed)
 */
export const LoginSchema = z.object({
  // User's email address
  email: z.email("Invalid email address"),
  
  // User's password (minimum length check only)
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
