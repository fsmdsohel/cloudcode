import { Router } from "express";
import { verifyAccessToken } from "@/middleware/authMiddleware";
import {
  getProfile,
  updateProfile,
  deleteProfile,
  updatePassword,
  getActivity,
  updatePreferences,
} from "@/controllers/userController";
import { validateRequest } from "@/middleware/validateRequest";
import {
  updateProfileSchema,
  updatePasswordSchema,
  updatePreferencesSchema,
} from "@/schemas/userSchemas";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyAccessToken);

// Profile management
router.get("/profile", getProfile);
router.put("/profile", validateRequest(updateProfileSchema), updateProfile);
router.delete("/profile", deleteProfile);

// Password management
router.put("/password", validateRequest(updatePasswordSchema), updatePassword);

// User preferences
router.put(
  "/preferences",
  validateRequest(updatePreferencesSchema),
  updatePreferences
);

// User activity
router.get("/activity", getActivity);

export default router;
