import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import "./config/passport";
import userRoutes from "@/routes/userRoutes";
import authRoutes from "@/routes/authRoutes";
import workspaceRoutes from "@/routes/workspaceRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "@/config/swaggerOptions.js";
import logger from "@/utils/logger";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { rateLimitStore } from "@/config/redis";

const app = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000", // TODO: Change to production domain
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "Set-Cookie",
      "x-api-key",
      "x-service-id",
    ],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Basic Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// Rate Limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    store: rateLimitStore,
    message: {
      error: "Too many requests, please try again later.",
      code: "RATE_LIMIT_EXCEEDED",
    },
  })
);

const basePath = "/api/v1";
const docsPath = `${basePath}/docs`;

// Swagger documentation
app.use(docsPath, swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use(`${basePath}/auth`, authRoutes);
app.use(`${basePath}/users`, userRoutes);
app.use(`${basePath}/workspace`, workspaceRoutes);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Default route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "CodeCloud server is up and running 🚀",
    version: "v1",
    status: "Server is fully operational",
    uptime: process.uptime(),
    docs: `API documentation available at ${docsPath}`,
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error("Unhandled error:", err);
  res.status(500).json({
    error: {
      message:
        process.env.NODE_ENV === "production"
          ? "Internal Server Error"
          : err.message,
      code: "INTERNAL_SERVER_ERROR",
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: "Route not found",
      code: "NOT_FOUND",
      path: req.path,
    },
  });
});

export default app;
