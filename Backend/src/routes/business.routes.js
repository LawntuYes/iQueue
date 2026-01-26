// business.routes.js
// Business route definitions
// Handles business creation, retrieval, and appointment management

import express from "express";
import {
  createBusiness,
  getMyBusiness,
  getBusinessAppointments,
  getAllBusinesses,
} from "../controllers/business.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

// Create Express router instance
const router = express.Router();

// Apply authentication middleware to all routes in this router
// All business routes require authentication
router.use(verifyToken);

// GET /api/business/ - Get all businesses in the system
// Protected route (requires authentication)
// Note: Could be public, but kept protected since users need to be logged in to book appointments
router.get("/", getAllBusinesses);

// POST /api/business/ - Create a new business for authenticated user
// Protected route (requires authentication)
router.post("/", createBusiness);

// GET /api/business/mybusiness - Get business owned by authenticated user
// Protected route (requires authentication)
router.get("/mybusiness", getMyBusiness);

// GET /api/business/appointments - Get all appointments for user's business
// Protected route (requires authentication and user must own a business)
router.get("/appointments", getBusinessAppointments);

// Export router for use in routes/index.js
export default router;
