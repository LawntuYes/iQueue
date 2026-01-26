// appointment.routes.js
// Appointment route definitions
// Handles appointment creation, retrieval, and deletion

import express from "express";
import {
  createAppointment,
  getMyAppointments,
  deleteAppointment,
} from "../controllers/appointment.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

// Create Express router instance
const router = express.Router();

// Apply authentication middleware to all routes in this router
// All appointment routes require authentication
router.use(verifyToken);

// POST /api/appointments/ - Create a new appointment
// Protected route (requires authentication)
router.post("/", createAppointment);

// GET /api/appointments/my-appointments - Get all appointments for authenticated user
// Protected route (requires authentication)
router.get("/my-appointments", getMyAppointments);

// DELETE /api/appointments/:id - Delete an appointment by ID
// Protected route (requires authentication)
// Note: Currently allows any authenticated user to delete any appointment (security improvement needed)
router.delete("/:id", deleteAppointment);

// Export router for use in routes/index.js
export default router;
