import { Request, Response } from "express";
import {
  getUserProfileService,
  updateUserProfileService,
  deleteUserProfileService,
  updateUserPasswordService,
  getUserActivityService,
  updateUserPreferencesService,
  getAllUsersService,
  updateUserByIdService,
  deleteUserByIdService,
} from "@/services/userService";
import { User } from "@prisma/client";
import { rateLimit } from "express-rate-limit";
import logger from "@/utils/logger";
import { UpdateUserDto } from "@/dtos/user.dto";

// Extend Express Request type
interface AuthRequest extends Request {
  user?: User;
}

// Rate limiting
export const userProfileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

/**
 * Get user profile
 */
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await getUserProfileService(req.user!.id);
    res.json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    logger.error("Get profile error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get user profile",
    });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedUser = await updateUserProfileService(req.user!.id, req.body);
    res.json({
      status: "success",
      message: "Profile updated successfully",
      data: { user: updatedUser },
    });
  } catch (error: any) {
    logger.error("Update profile error:", error);
    if (error.code === "EMAIL_EXISTS") {
      res.status(409).json({
        status: "error",
        message: "Email already in use",
      });
      return;
    }
    res.status(500).json({
      status: "error",
      message: "Failed to update profile",
    });
  }
};

/**
 * Delete user account
 */
export const deleteProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await deleteUserProfileService(req.user!.id);
    res.json({
      status: "success",
      message: "Profile deleted successfully",
    });
  } catch (error) {
    logger.error("Delete profile error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete profile",
    });
  }
};

export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const users = await getAllUsersService();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: { message: "Error fetching users" } });
  }
};

export const updateUserById = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    if (!req.params.id) {
      return res
        .status(400)
        .json({ error: { message: "User ID is required" } });
    }
    const user = await updateUserByIdService(req.params.id, req.body);
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: { message: "Error updating user" } });
  }
};

export const deleteUserById = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    if (!req.params.id) {
      return res
        .status(400)
        .json({ error: { message: "User ID is required" } });
    }
    await deleteUserByIdService(req.params.id);
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: { message: "Error deleting user" } });
  }
};

export const updatePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await updateUserPasswordService(req.user!.id, req.body);
    res.json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error: any) {
    logger.error("Update password error:", error);
    if (error.message === "Current password is incorrect") {
      res.status(400).json({
        status: "error",
        message: "Current password is incorrect",
      });
      return;
    }
    res.status(500).json({
      status: "error",
      message: "Failed to update password",
    });
  }
};

export const updatePreferences = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedPreferences = await updateUserPreferencesService(
      req.user!.id,
      req.body
    );
    res.json({
      status: "success",
      message: "Preferences updated successfully",
      data: { preferences: updatedPreferences },
    });
  } catch (error) {
    logger.error("Update preferences error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update preferences",
    });
  }
};

export const getActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const activity = await getUserActivityService(req.user!.id);
    res.json({
      status: "success",
      data: { activity },
    });
  } catch (error) {
    logger.error("Get activity error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get user activity",
    });
  }
};
