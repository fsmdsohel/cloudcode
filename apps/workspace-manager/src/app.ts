import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { v4 as uuidv4 } from "uuid";
import { apiConfig } from "@/config/api";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "@/config/swaggerOptions";
import workspaceRoutes from "@/routes/workspaceRoutes";
import logger from "@/utils/logger";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Request ID and logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  req.id = uuidv4();
  res.setHeader("X-Request-ID", req.id);
  next();
});

app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

const basePath = "/api/v1";
const docsPath = `${basePath}/docs`;

// Swagger doc
app.use(docsPath, swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use(`${basePath}${apiConfig.workspace}`, workspaceRoutes);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "CodeCloud workspace service is up and running 🚀",
    version: apiConfig.basePath.split("/")[2],
    status: "Server is fully operational",
    uptime: process.uptime(),
    docs: `API documentation available at ${docsPath}`,
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    requestId: req.id,
  });
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error ${req.id}: ${err.message}`);

  res.status(500).json({
    status: "error",
    message: "Internal server error",
    requestId: req.id,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    requestId: req.id,
  });
});

export default app;
