import express from "express";
import {
  createBusiness,
  getMyBusiness,
  getBusinessAppointments,
  getAllBusinesses,
} from "../controllers/business.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

// Note: Public route or protected? User needs to be logged in to book, so kept under verifyToken for now.
router.get("/", getAllBusinesses);
router.post("/", createBusiness);
router.get("/mybusiness", getMyBusiness);
router.get("/appointments", getBusinessAppointments);

export default router;
