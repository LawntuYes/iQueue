// user.routes.js
// User management route definitions
// Handles user-related operations

import express from "express";
import { getUsers } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

// Create Express router instance
const router = express.Router();

// GET /api/users/get - Get all users in the system
// Protected route (requires authentication via verifyToken middleware)
router.get("/get", verifyToken, getUsers);

// Export router for use in routes/index.js
export default router;
