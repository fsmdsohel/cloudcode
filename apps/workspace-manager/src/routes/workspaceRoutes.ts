import { Router } from "express";
import {
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from "@/controllers/workspaceController";
import { validate } from "@/middleware/validateRequest";
import { authMiddleware } from "@/middleware/authMiddleware";
import {
  createWorkspaceValidation,
  updateWorkspaceValidation,
} from "@/validations/workspaceValidations";

const router: Router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Workspace CRUD operations
router.post("/", validate(createWorkspaceValidation), createWorkspace);
router.get("/", getWorkspace);
router.get("/:workspaceId", getWorkspace);
router.put(
  "/:workspaceId",
  validate(updateWorkspaceValidation),
  updateWorkspace
);
router.delete("/:workspaceId", deleteWorkspace);

// Workspace lifecycle operations
router.get("/:workspaceId/status", getWorkspace);
router.post("/:workspaceId/start", updateWorkspace);
router.post("/:workspaceId/stop", updateWorkspace);
router.post("/:workspaceId/restart", updateWorkspace);

export default router;
