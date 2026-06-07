import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateLastKnownLocation,
  updateProfile,
  addEmergencyContact,
  deleteEmergencyContact,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// protected routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-location").patch(verifyJWT, updateLastKnownLocation);
router.route("/update-profile").patch(verifyJWT, updateProfile);
router.route("/emergency-contacts").post(verifyJWT, addEmergencyContact);
router
  .route("/emergency-contacts/:contactId")
  .delete(verifyJWT, deleteEmergencyContact);
export default router;