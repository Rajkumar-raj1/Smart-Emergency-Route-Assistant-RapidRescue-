import { Router } from "express";
import {
  getNearbyServices,
  saveEmergencyHistory,
  getEmergencyHistory,
} from "../controllers/emergency.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// protected routes
router.route("/nearby").get(verifyJWT, getNearbyServices);
router.route("/history").post(verifyJWT, saveEmergencyHistory);
router.route("/history").get(verifyJWT, getEmergencyHistory);

export default router;