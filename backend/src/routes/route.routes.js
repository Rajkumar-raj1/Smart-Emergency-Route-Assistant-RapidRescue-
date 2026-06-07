import { Router } from "express";
import {
  getShortestRoute,
 optimizeRouteWithMultipleStops
} from "../controllers/route.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// protected routes
router.route("/shortest").get(verifyJWT, getShortestRoute);

// multi-stop optimization
router
  .route("/multistop")
  .post(verifyJWT, optimizeRouteWithMultipleStops);

export default router;