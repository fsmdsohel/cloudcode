import { Request, Response } from "express";
import { WorkspaceConfig } from "../types/workspace";
import templateService from "../services/templateService";
import kubernetesService from "../services/kubernetesService";
import logger from "@/utils/logger";

// Create a new workspace
export const createWorkspace = async (req: Request, res: Response) => {
  try {
    const workspaceConfig: WorkspaceConfig = req.body;
    const workspaceId = workspaceConfig.name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-");
    const namespace = `workspace-${workspaceId}`;

    logger.info(`Creating workspace: ${workspaceId}`);

    const workspacePath =
      await templateService.initializeTemplate(workspaceConfig);
    await kubernetesService.createNamespace(workspaceId);
    await kubernetesService.createPersistentVolumeClaim(namespace, workspaceId);
    await kubernetesService.createDeployment(
      namespace,
      workspaceId,
      workspaceConfig
    );
    await kubernetesService.createService(namespace, workspaceId);

    const status = await kubernetesService.getWorkspaceStatus(workspaceId);

    res.status(201).json({
      status: "success",
      data: { ...workspaceConfig, workspaceId, path: workspacePath, status },
      requestId: req.id,
    });
  } catch (error) {
    logger.error(`Error creating workspace: ${error}`);
    res.status(500).json({
      status: "error",
      message: "Failed to create workspace",
      error: error instanceof Error ? error.message : "Unknown error",
      requestId: req.id,
    });
  }
};

// Get workspaces
export const getWorkspace = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;

    if (workspaceId) {
      const status = await kubernetesService.getWorkspaceStatus(workspaceId);
      res.status(200).json({
        status: "success",
        data: { workspaceId, status },
        requestId: req.id,
      });
    } else {
      const workspaces = await kubernetesService.listWorkspaces();
      const workspaceStatuses = await Promise.all(
        workspaces.map(async (id) => ({
          workspaceId: id,
          status: await kubernetesService.getWorkspaceStatus(id),
        }))
      );

      res.status(200).json({
        status: "success",
        data: { workspaces: workspaceStatuses },
        requestId: req.id,
      });
    }
  } catch (error) {
    logger.error(`Error retrieving workspace(s): ${error}`);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve workspace(s)",
      error: error instanceof Error ? error.message : "Unknown error",
      requestId: req.id,
    });
  }
};

// Update workspace
export const updateWorkspace = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const action = req.path.split("/").pop();

    switch (action) {
      case "start":
        await kubernetesService.startWorkspace(workspaceId);
        break;
      case "stop":
        await kubernetesService.stopWorkspace(workspaceId);
        break;
      case "restart":
        await kubernetesService.restartWorkspace(workspaceId);
        break;
      default:
        // Regular update
        const updates = req.body;
        res.status(200).json({
          status: "success",
          data: { workspaceId, updates },
          requestId: req.id,
        });
        return;
    }

    res.status(200).json({
      status: "success",
      message: `Workspace ${action}ed successfully`,
      requestId: req.id,
    });
  } catch (error) {
    logger.error(`Error updating workspace: ${error}`);
    res.status(500).json({
      status: "error",
      message: "Failed to update workspace",
      error: error instanceof Error ? error.message : "Unknown error",
      requestId: req.id,
    });
  }
};

// Delete workspace
export const deleteWorkspace = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    await kubernetesService.deleteWorkspace(workspaceId);

    res.status(200).json({
      status: "success",
      message: "Workspace deleted successfully",
      requestId: req.id,
    });
  } catch (error) {
    logger.error(`Error deleting workspace: ${error}`);
    res.status(500).json({
      status: "error",
      message: "Failed to delete workspace",
      error: error instanceof Error ? error.message : "Unknown error",
      requestId: req.id,
    });
  }
};
