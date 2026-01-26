// auth.routes.js
// Authentication route definitions
// Handles user registration, login, logout, and profile retrieval

import express from "express";
import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

// Create Express router instance
const router = express.Router();

// POST /api/auth/register - Register a new user
// Public route (no authentication required)
router.post("/register", register);

// POST /api/auth/login - Authenticate user and get JWT token
// Public route (no authentication required)
router.post("/login", login);

// POST /api/auth/logout - Clear authentication cookie
// Public route (can be called without token, just clears cookie)
router.post("/logout", logout);

// GET /api/auth/me - Get current authenticated user's profile
// Protected route (requires authentication via verifyToken middleware)
router.get("/me", verifyToken, getMe);

// Export router for use in routes/index.js
export default router;
