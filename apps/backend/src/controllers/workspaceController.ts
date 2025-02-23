import { Request, Response } from "express";
import workspaceService from "@/services/workspaceService";
import { CreateWorkspaceDto, UpdateWorkspaceDto } from "@/dtos/workspace.dto";
import logger from "@/utils/logger";

// Create a new workspace
export const createWorkspace = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const workspace = await workspaceService.createWorkspace(
      req.user!.id,
      req.body
    );
    res.status(201).json({
      status: "success",
      data: { workspace },
    });
  } catch (error) {
    logger.error("Create workspace error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create workspace",
    });
  }
};

// List all workspaces for the current user
export const listWorkspaces = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const workspaces = await workspaceService.listWorkspaces(req.user!.id);
    res.json({
      status: "success",
      data: { workspaces },
    });
  } catch (error) {
    logger.error("List workspaces error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to list workspaces",
    });
  }
};

// Get a specific workspace
export const getWorkspace = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.params.id) {
      res
        .status(400)
        .json({ status: "error", message: "Workspace ID is required" });
      return;
    }
    const workspace = await workspaceService.getWorkspace(
      req.params.id,
      req.user!.id
    );
    res.json({
      status: "success",
      data: { workspace },
    });
  } catch (error) {
    logger.error("Get workspace error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get workspace",
    });
  }
};

// Update a workspace
export const updateWorkspace = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.params.id) {
      res
        .status(400)
        .json({ status: "error", message: "Workspace ID is required" });
      return;
    }
    const workspace = await workspaceService.updateWorkspace(
      req.params.id,
      req.user!.id,
      req.body
    );
    res.json({
      status: "success",
      data: { workspace },
    });
  } catch (error) {
    logger.error("Update workspace error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update workspace",
    });
  }
};

// Delete a workspace
export const deleteWorkspace = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.params.id) {
      res
        .status(400)
        .json({ status: "error", message: "Workspace ID is required" });
      return;
    }
    await workspaceService.deleteWorkspace(req.params.id, req.user!.id);
    res.json({
      status: "success",
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    logger.error("Delete workspace error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete workspace",
    });
  }
};

// Start a workspace
export const startWorkspace = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.params.id) {
      res
        .status(400)
        .json({ status: "error", message: "Workspace ID is required" });
      return;
    }
    await workspaceService.startWorkspace(req.params.id, req.user!.id);
    res.json({
      status: "success",
      message: "Workspace started successfully",
    });
  } catch (error) {
    logger.error("Start workspace error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to start workspace",
    });
  }
};

// Stop a workspace
export const stopWorkspace = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.params.id) {
      res
        .status(400)
        .json({ status: "error", message: "Workspace ID is required" });
      return;
    }
    await workspaceService.stopWorkspace(req.params.id, req.user!.id);
    res.json({
      status: "success",
      message: "Workspace stopped successfully",
    });
  } catch (error) {
    logger.error("Stop workspace error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to stop workspace",
    });
  }
};

// Restart a workspace
export const restartWorkspace = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.params.id) {
      res
        .status(400)
        .json({ status: "error", message: "Workspace ID is required" });
      return;
    }
    await workspaceService.restartWorkspace(req.params.id, req.user!.id);
    res.json({
      status: "success",
      message: "Workspace restarted successfully",
    });
  } catch (error) {
    logger.error("Restart workspace error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to restart workspace",
    });
  }
};

// Get workspace status
export const getWorkspaceStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.params.id) {
      res
        .status(400)
        .json({ status: "error", message: "Workspace ID is required" });
      return;
    }
    const status = await workspaceService.getWorkspaceStatus(
      req.params.id,
      req.user!.id
    );
    res.json({
      status: "success",
      data: { status },
    });
  } catch (error) {
    logger.error("Get workspace status error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get workspace status",
    });
  }
};

// Get workspace logs
export const getWorkspaceLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.params.id) {
      res
        .status(400)
        .json({ status: "error", message: "Workspace ID is required" });
      return;
    }
    const logs = await workspaceService.getWorkspaceLogs(
      req.params.id,
      req.user!.id
    );
    res.json({
      status: "success",
      data: { logs },
    });
  } catch (error) {
    logger.error("Get workspace logs error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get workspace logs",
    });
  }
};
