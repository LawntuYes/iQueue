import express from "express";
import {
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all users (Protected)
router.get("/get", verifyToken, getUsers);

// Update a user (Protected)
router.put("/:id", verifyToken, updateUser);

// Delete a user (Protected)
router.delete("/:id", verifyToken, deleteUser);

export default router;
