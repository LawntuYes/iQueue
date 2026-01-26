import express from "express";
import { getUsers } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all users (Protected)
router.get("/get", verifyToken, getUsers);

export default router;
