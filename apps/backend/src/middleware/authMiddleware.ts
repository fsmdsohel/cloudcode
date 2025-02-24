import { Request, Response, NextFunction } from "express";
import logger from "@/utils/logger";
import { verifyToken } from "@/services/tokenService";

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.accessToken;

    // Allow logout requests to proceed even without a valid token
    if (req.path === "/logout" && !token) {
      return next();
    }

    if (!token) {
      res.status(401).json({
        error: "Authentication required",
        code: "TOKEN_MISSING",
      });
      return;
    }

    const decoded = await verifyToken(token, "access");
    if (!decoded) {
      res.status(401).json({
        error: "Invalid session",
        code: "TOKEN_INVALID",
      });
      return;
    }

    // Add user info to request
    req.user = decoded;

    next();
  } catch (error: any) {
    // Allow logout requests to proceed even with invalid token
    if (req.path === "/logout") {
      return next();
    }

    if (error.code === "TOKEN_EXPIRED") {
      res.status(401).json({
        error: "Session expired",
        code: "TOKEN_EXPIRED",
      });
      return;
    }

    logger.error("Auth error:", error);
    res.status(401).json({
      error: "Invalid session",
      code: "AUTH_ERROR",
    });
  }
};
