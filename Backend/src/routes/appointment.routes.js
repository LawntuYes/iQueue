import express from "express";
import {
  createAppointment,
  getMyAppointments,
  deleteAppointment,
<<<<<<< HEAD
  getUserAppointments,
=======
  approveAppointment,
>>>>>>> cd8a7524fdfe94ed22813ea6af61d319c2a74049
} from "../controllers/appointment.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

// Appointment routes
router.post("/", createAppointment);
router.get("/my-appointments", getMyAppointments);
<<<<<<< HEAD
router.get("/user/:id", getUserAppointments);
=======
router.patch("/:id/approve", approveAppointment);
>>>>>>> cd8a7524fdfe94ed22813ea6af61d319c2a74049
router.delete("/:id", deleteAppointment);

export default router;
