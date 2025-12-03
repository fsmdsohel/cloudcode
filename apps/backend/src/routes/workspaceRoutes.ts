import { Router } from "express";
import {
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  listWorkspaces,
  startWorkspace,
  stopWorkspace,
  restartWorkspace,
  getWorkspaceStatus,
  getWorkspaceLogs,
} from "@/controllers/workspaceController";
import { validateRequest } from "@/middleware/validateRequest";
import { verifyAccessToken } from "@/middleware/authMiddleware";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "@/schemas/workspaceSchemas";
import { rateLimit } from "express-rate-limit";

const router = Router();

// Rate limiting for workspace operations
const workspaceRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Apply middleware to all routes
router.use(verifyAccessToken);
router.use(workspaceRateLimit);

// Workspace CRUD operations
router.post("/", validateRequest(createWorkspaceSchema), createWorkspace);
router.get("/", listWorkspaces);
router.get("/:id", getWorkspace);
router.put("/:id", validateRequest(updateWorkspaceSchema), updateWorkspace);
router.delete("/:id", deleteWorkspace);

// Workspace lifecycle operations
router.post("/:id/start", startWorkspace);
router.post("/:id/stop", stopWorkspace);
router.post("/:id/restart", restartWorkspace);
router.get("/:id/status", getWorkspaceStatus);
router.get("/:id/logs", getWorkspaceLogs);

export default router;
