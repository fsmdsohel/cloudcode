import { Request, Response, NextFunction } from "express";
import logger from "@/utils/logger";

export interface AuthenticatedRequest extends Request {
  serviceId?: string;
  userId?: string;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.headers["x-api-key"];
    const serviceId = req.headers["x-service-id"];
    const userId = req.headers["x-user-id"];

    if (!apiKey || apiKey !== process.env.WORKSPACE_SERVICE_API_KEY) {
      logger.warn(`Invalid API key attempt from IP: ${req.ip}`);
      res.status(401).json({
        status: "error",
        message: "Invalid API key",
        requestId: req.id,
      });
      return;
    }

    if (!serviceId) {
      logger.warn(`Missing service ID from IP: ${req.ip}`);
      res.status(401).json({
        status: "error",
        message: "Missing service ID",
        requestId: req.id,
      });
      return;
    }

    // Attach authenticated info to request
    req.serviceId = serviceId as string;
    req.userId = userId as string;

    next();
  } catch (error) {
    logger.error(`Authentication error: ${error}`);
    res.status(500).json({
      status: "error",
      message: "Authentication failed",
      requestId: req.id,
    });
  }
};
