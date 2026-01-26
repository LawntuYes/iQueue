// auth.middleware.js
// Authentication middleware for protecting routes
// Verifies JWT tokens from cookies and attaches user ID to request object

import jwt from "jsonwebtoken";

/**
 * Middleware function to verify JWT authentication token
 * Extracts token from cookies, verifies it, and attaches userId to request
 * This middleware should be used on routes that require authentication
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next() if token is valid, or sends error response
 */
export const verifyToken = (req, res, next) => {
  // Extract JWT token from HTTP-only cookie named 'jwt'
  // HTTP-only cookies prevent client-side JavaScript access for security
  const token = req.cookies.jwt;

  // Check if token exists in cookies
  if (!token) {
    // Return 401 Unauthorized if no token is present
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    // Verify and decode the JWT token
    // Uses JWT_SECRET from environment variables (or default for development)
    // jwt.verify() throws an error if token is invalid, expired, or tampered with
    const decoded = jwt.verify(
      token, process.env.JWT_SECRET || "default_secret_key"
    );
    
    // Attach userId from decoded token to request object
    // This allows route handlers to access the authenticated user's ID
    req.userId = decoded.userId;
    
    // Call next() to proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Token verification failed (invalid, expired, or tampered)
    // Return 403 Forbidden status
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
