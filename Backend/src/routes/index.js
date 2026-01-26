// routes/index.js
// Main router file that aggregates all route modules
// All routes are mounted under /api prefix in index.js

import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import appointmentRoutes from "./appointment.routes.js";
import businessRoutes from "./business.routes.js";

// Create Express router instance
const router = express.Router();

// Mount route modules under specific paths
// All routes will be accessible at /api/{path}
// Example: /api/auth/login, /api/users/get, etc.

// Authentication routes (register, login, logout, get profile)
router.use("/auth", authRoutes);

// User management routes (get all users)
router.use("/users", userRoutes);

// Appointment routes (create, get, delete appointments)
router.use("/appointments", appointmentRoutes);

// Business routes (create, get businesses, get business appointments)
router.use("/business", businessRoutes);

// Export the aggregated router
export default router;
