import express from "express";
import {
  createAppointment,
  getMyAppointments,
  deleteAppointment,
} from "../controllers/appointment.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

// Appointment routes
router.post("/", createAppointment);
router.get("/my-appointments", getMyAppointments);
router.delete("/:id", deleteAppointment);

export default router;
