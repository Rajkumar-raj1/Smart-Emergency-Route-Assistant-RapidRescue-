import { Router } from "express";
import {
  sendSOS,
  getSOSLogs,
} from "../controllers/sos.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// protected routes
router.route("/send").post(verifyJWT, sendSOS);
router.route("/logs").get(verifyJWT, getSOSLogs);

export default router;