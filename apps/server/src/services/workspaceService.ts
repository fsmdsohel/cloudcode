import prisma from "@/controllers/prismaClient";
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  WorkspaceResponseDto,
  K8sWorkspaceDto,
} from "@/dtos/workspace.dto";
import logger from "@/utils/logger";
import axios from "axios";
import type { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { Workspace } from "@prisma/client";
const selectFields = {
  id: true,
  name: true,
  userId: true,
  template: true,
  language: true,
  libraries: true,
  description: true,
  resources: true,
  status: true,
  editorConfig: true,
  editorLayout: true,
  createdAt: true,
  updatedAt: true,
};

export class WorkspaceService {
  private client: AxiosInstance;
  private readonly serviceId: string;

  constructor() {
    this.serviceId = process.env.SERVICE_ID || "cloudcode-server";
    this.client = axios.create({
      baseURL: process.env.WORKSPACE_SERVICE_URL || "http://localhost:3001",
      headers: {
        "x-api-key": process.env.WORKSPACE_SERVICE_API_KEY,
        "x-service-id": this.serviceId,
      },
      timeout: 30000,
    });

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        logger.error(`Workspace service error: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
        });
        throw error;
      }
    );
  }

  async createWorkspace(
    userId: string,
    data: CreateWorkspaceDto
  ): Promise<WorkspaceResponseDto> {
    try {
      // Default editor configuration
      const defaultEditorConfig = {
        theme: "dark",
        fontSize: 14,
        tabSize: 2,
        lineNumbers: true,
        wordWrap: true,
        minimap: true,
        autoSave: true,
        formatOnSave: true,
        bracketPairColorization: true,
      };

      // Default editor layout
      const defaultEditorLayout = {
        panels: [],
        activePanel: null,
        orientation: "horizontal",
        sizes: [],
        sidebarVisible: true,
        sidebarSize: 250,
        terminalVisible: true,
        terminalSize: 200,
      };

      // Create database record with defaults
      const workspace = await prisma.workspace.create({
        data: {
          ...data,
          userId,
          editorConfig: defaultEditorConfig,
          editorLayout: defaultEditorLayout,
        },
        select: selectFields,
      });

      // Create Kubernetes resources
      await this.client.post("/api/v1/workspaces", data, {
        headers: { "x-user-id": userId },
      });

      logger.info(`Workspace created: ${workspace.id} by user: ${userId}`);
      return workspace;
    } catch (error) {
      logger.error(`Failed to create workspace: ${error}`);
      throw error;
    }
  }

  async getWorkspace(
    workspaceId: string,
    userId: string
  ): Promise<WorkspaceResponseDto> {
    try {
      const [dbWorkspace, k8sWorkspace] = await Promise.all([
        prisma.workspace.findFirst({
          where: { id: workspaceId, userId },
          select: selectFields,
        }),
        this.client
          .get(`/api/v1/workspaces/${workspaceId}`, {
            headers: { "x-user-id": userId },
          })
          .then((res) => res.data),
      ]);

      if (!dbWorkspace) throw new Error("Workspace not found");
      return { ...dbWorkspace, status: k8sWorkspace.status };
    } catch (error) {
      logger.error(`Failed to get workspace: ${error}`);
      throw error;
    }
  }

  async updateWorkspace(
    workspaceId: string,
    userId: string,
    data: UpdateWorkspaceDto,
    action?: string
  ): Promise<WorkspaceResponseDto> {
    try {
      const workspace = await prisma.workspace.update({
        where: { id: workspaceId, userId },
        data,
        select: selectFields,
      });

      if (action) {
        await this.client.post(
          `/api/v1/workspaces/${workspaceId}/${action}`,
          {},
          {
            headers: { "x-user-id": userId },
          }
        );
      }

      logger.info(`Workspace ${action || "updated"}: ${workspaceId}`);
      return workspace;
    } catch (error) {
      logger.error(`Failed to update workspace: ${error}`);
      throw error;
    }
  }

  async deleteWorkspace(workspaceId: string, userId: string): Promise<void> {
    try {
      await Promise.all([
        prisma.workspace.delete({ where: { id: workspaceId, userId } }),
        this.client.delete(`/api/v1/workspaces/${workspaceId}`, {
          headers: { "x-user-id": userId },
        }),
      ]);

      logger.info(`Workspace deleted: ${workspaceId}`);
    } catch (error) {
      logger.error(`Failed to delete workspace: ${error}`);
      throw error;
    }
  }

  async listWorkspaces(userId: string): Promise<WorkspaceResponseDto[]> {
    try {
      const [dbWorkspaces, k8sWorkspaces] = await Promise.all([
        prisma.workspace.findMany({
          where: { userId },
          select: selectFields,
        }),
        this.client
          .get("/api/v1/workspaces", {
            headers: { "x-user-id": userId },
          })
          .then((res) => res.data.workspaces),
      ]);

      return dbWorkspaces.map((workspace) => ({
        ...workspace,
        status:
          k8sWorkspaces.find(
            (k8s: K8sWorkspaceDto) => k8s.workspaceId === workspace.id
          )?.status || null,
      }));
    } catch (error) {
      logger.error(`Failed to list workspaces: ${error}`);
      throw error;
    }
  }

  async startWorkspace(workspaceId: string, userId: string): Promise<void> {
    await this.updateWorkspace(workspaceId, userId, {}, "start");
  }

  async stopWorkspace(workspaceId: string, userId: string): Promise<void> {
    await this.updateWorkspace(workspaceId, userId, {}, "stop");
  }

  async restartWorkspace(workspaceId: string, userId: string): Promise<void> {
    await this.updateWorkspace(workspaceId, userId, {}, "restart");
  }

  async getWorkspaceStatus(
    workspaceId: string,
    userId: string
  ): Promise<string> {
    const workspace = await this.getWorkspace(workspaceId, userId);
    return workspace.status || "unknown";
  }

  async getWorkspaceLogs(
    workspaceId: string,
    userId: string
  ): Promise<string[]> {
    const response = await this.client.get(
      `/api/v1/workspaces/${workspaceId}/logs`,
      {
        headers: { "x-user-id": userId },
      }
    );
    return response.data.logs;
  }
}

export default new WorkspaceService();
