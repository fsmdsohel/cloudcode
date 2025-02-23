import * as k8s from "@kubernetes/client-node";
import { WorkspaceConfig } from "../types/workspace";
import { kubernetesConfig } from "../config/kubernetes";
import logger from "@/utils/logger";

class KubernetesError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "KubernetesError";
  }
}

export class KubernetesService {
  private k8sApi: k8s.CoreV1Api;
  private k8sAppsApi: k8s.AppsV1Api;

  constructor() {
    try {
      const kc = new k8s.KubeConfig();
      kc.loadFromDefault();
      this.k8sApi = kc.makeApiClient(k8s.CoreV1Api);
      this.k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);
    } catch (error) {
      throw new KubernetesError(
        "Failed to initialize Kubernetes client",
        error
      );
    }
  }

  async createNamespace(workspaceId: string): Promise<void> {
    try {
      const namespace: k8s.V1Namespace = {
        metadata: {
          name: `workspace-${workspaceId}`,
          labels: {
            app: "cloudcode",
            workspace: workspaceId,
            createdAt: new Date().toISOString(),
          },
        },
        apiVersion: "v1",
        kind: "Namespace",
      };

      await this.k8sApi.createNamespace({ body: namespace });
      logger.info(`Created namespace for workspace: ${workspaceId}`);
    } catch (error) {
      logger.error(`Failed to create namespace: ${error}`);
      throw new KubernetesError(
        `Failed to create namespace for workspace: ${workspaceId}`,
        error
      );
    }
  }

  async createPersistentVolumeClaim(
    namespace: string,
    workspaceId: string
  ): Promise<void> {
    try {
      const pvc: k8s.V1PersistentVolumeClaim = {
        metadata: {
          name: `${workspaceId}-pvc`,
          labels: {
            app: "cloudcode",
            workspace: workspaceId,
          },
        },
        spec: {
          accessModes: ["ReadWriteOnce"],
          resources: {
            requests: {
              storage: kubernetesConfig.storage.size,
            },
          },
          storageClassName: kubernetesConfig.storage.className,
        },
        apiVersion: "v1",
        kind: "PersistentVolumeClaim",
      };

      const request: k8s.CoreV1ApiCreateNamespacedPersistentVolumeClaimRequest =
        {
          namespace,
          body: pvc,
        };

      await this.k8sApi.createNamespacedPersistentVolumeClaim(request);
      logger.info(`Created PVC for workspace: ${workspaceId}`);
    } catch (error) {
      logger.error(`Failed to create PVC: ${error}`);
      throw new KubernetesError(
        `Failed to create PVC for workspace: ${workspaceId}`,
        error
      );
    }
  }

  async createDeployment(
    namespace: string,
    workspaceId: string,
    config: WorkspaceConfig
  ): Promise<void> {
    try {
      const deployment: k8s.V1Deployment = {
        metadata: {
          name: `${workspaceId}-deployment`,
          labels: {
            app: "cloudcode",
            workspace: workspaceId,
          },
        },
        spec: {
          replicas: 1,
          selector: {
            matchLabels: {
              app: workspaceId,
            },
          },
          template: {
            metadata: {
              labels: {
                app: workspaceId,
              },
            },
            spec: {
              containers: [
                {
                  name: workspaceId,
                  image: this.getContainerImage(
                    config.template,
                    config.language
                  ),
                  resources: {
                    requests: {
                      cpu:
                        config.resources?.cpu ||
                        kubernetesConfig.resources.default.cpu.request,
                      memory:
                        config.resources?.memory ||
                        kubernetesConfig.resources.default.memory.request,
                    },
                    limits: {
                      cpu:
                        config.resources?.cpu ||
                        kubernetesConfig.resources.default.cpu.limit,
                      memory:
                        config.resources?.memory ||
                        kubernetesConfig.resources.default.memory.limit,
                    },
                  },
                  volumeMounts: [
                    {
                      name: "workspace-storage",
                      mountPath: kubernetesConfig.containers.mountPath,
                    },
                  ],
                  ports: [
                    {
                      containerPort: kubernetesConfig.containers.port,
                      name: "http",
                    },
                  ],
                  env: [
                    {
                      name: "WORKSPACE_ID",
                      value: workspaceId,
                    },
                    {
                      name: "TEMPLATE",
                      value: config.template,
                    },
                    {
                      name: "LANGUAGE",
                      value: config.language,
                    },
                  ],
                  readinessProbe: {
                    httpGet: {
                      path: "/health",
                      port: kubernetesConfig.containers.port,
                    },
                    initialDelaySeconds: 10,
                    periodSeconds: 10,
                  },
                  livenessProbe: {
                    httpGet: {
                      path: "/health",
                      port: kubernetesConfig.containers.port,
                    },
                    initialDelaySeconds: 15,
                    periodSeconds: 20,
                  },
                },
              ],
              volumes: [
                {
                  name: "workspace-storage",
                  persistentVolumeClaim: {
                    claimName: `${workspaceId}-pvc`,
                  },
                },
              ],
            },
          },
        },
        apiVersion: "apps/v1",
        kind: "Deployment",
      };

      const request: k8s.AppsV1ApiCreateNamespacedDeploymentRequest = {
        namespace,
        body: deployment,
      };

      await this.k8sAppsApi.createNamespacedDeployment(request);
      logger.info(`Created deployment for workspace: ${workspaceId}`);
    } catch (error) {
      logger.error(`Failed to create deployment: ${error}`);
      throw new KubernetesError(
        `Failed to create deployment for workspace: ${workspaceId}`,
        error
      );
    }
  }

  async createService(namespace: string, workspaceId: string): Promise<void> {
    try {
      const service: k8s.V1Service = {
        metadata: {
          name: `${workspaceId}-service`,
          labels: {
            app: "cloudcode",
            workspace: workspaceId,
          },
        },
        spec: {
          selector: {
            app: workspaceId,
          },
          ports: [
            {
              port: 80,
              targetPort: kubernetesConfig.containers.port,
              protocol: "TCP",
            },
          ],
          type: "ClusterIP",
        },
        apiVersion: "v1",
        kind: "Service",
      };

      const request: k8s.CoreV1ApiCreateNamespacedServiceRequest = {
        namespace,
        body: service,
      };

      await this.k8sApi.createNamespacedService(request);
      logger.info(`Created service for workspace: ${workspaceId}`);
    } catch (error) {
      logger.error(`Failed to create service: ${error}`);
      throw new KubernetesError(
        `Failed to create service for workspace: ${workspaceId}`,
        error
      );
    }
  }

  async deleteWorkspace(workspaceId: string): Promise<void> {
    const namespace = `workspace-${workspaceId}`;
    try {
      const request: k8s.CoreV1ApiDeleteNamespaceRequest = {
        name: namespace,
      };

      await this.k8sApi.deleteNamespace(request);
      logger.info(
        `Deleted namespace and all resources for workspace: ${workspaceId}`
      );
    } catch (error) {
      logger.error(`Failed to delete workspace: ${error}`);
      throw new KubernetesError(
        `Failed to delete workspace: ${workspaceId}`,
        error
      );
    }
  }

  private getContainerImage(template: string, language: string): string {
    const images = kubernetesConfig.images as Record<
      string,
      Record<string, string> | string
    >;
    const templateConfig = images[template];

    if (typeof templateConfig === "object") {
      return templateConfig[language] || (images.base as string);
    }

    return images.base as string;
  }

  async getWorkspaceStatus(workspaceId: string): Promise<string> {
    try {
      const namespace = `workspace-${workspaceId}`;
      const request: k8s.AppsV1ApiReadNamespacedDeploymentRequest = {
        name: `${workspaceId}-deployment`,
        namespace,
      };

      const response = await this.k8sAppsApi.readNamespacedDeployment(request);
      const deployment = response as unknown as k8s.V1Deployment;
      const readyReplicas = deployment.status?.readyReplicas || 0;
      const desiredReplicas = deployment.spec?.replicas || 1;

      if (readyReplicas === desiredReplicas) {
        return "running";
      } else if (readyReplicas === 0) {
        return "stopped";
      } else {
        return "starting";
      }
    } catch (error) {
      logger.error(`Failed to get workspace status: ${error}`);
      if (
        error &&
        typeof error === "object" &&
        "statusCode" in error &&
        error.statusCode === 404
      ) {
        return "not_found";
      }
      return "failed";
    }
  }

  async startWorkspace(workspaceId: string): Promise<void> {
    try {
      const namespace = `workspace-${workspaceId}`;
      const request: k8s.AppsV1ApiReadNamespacedDeploymentRequest = {
        name: `${workspaceId}-deployment`,
        namespace,
      };
      const deployment =
        await this.k8sAppsApi.readNamespacedDeployment(request);

      if (deployment?.spec) {
        deployment.spec.replicas = 1;
        const replaceRequest: k8s.AppsV1ApiReplaceNamespacedDeploymentRequest =
          {
            name: request.name,
            namespace: request.namespace,
            body: deployment,
          };
        await this.k8sAppsApi.replaceNamespacedDeployment(replaceRequest);
      }

      logger.info(`Started workspace: ${workspaceId}`);
    } catch (error) {
      logger.error(`Failed to start workspace: ${error}`);
      throw new KubernetesError(
        `Failed to start workspace: ${workspaceId}`,
        error
      );
    }
  }

  async stopWorkspace(workspaceId: string): Promise<void> {
    try {
      const namespace = `workspace-${workspaceId}`;
      const request: k8s.AppsV1ApiReadNamespacedDeploymentRequest = {
        name: `${workspaceId}-deployment`,
        namespace,
      };
      const deployment =
        await this.k8sAppsApi.readNamespacedDeployment(request);

      if (deployment?.spec) {
        deployment.spec.replicas = 0;
        const replaceRequest: k8s.AppsV1ApiReplaceNamespacedDeploymentRequest =
          {
            name: request.name,
            namespace: request.namespace,
            body: deployment,
          };
        await this.k8sAppsApi.replaceNamespacedDeployment(replaceRequest);
      }

      logger.info(`Stopped workspace: ${workspaceId}`);
    } catch (error) {
      logger.error(`Failed to stop workspace: ${error}`);
      throw new KubernetesError(
        `Failed to stop workspace: ${workspaceId}`,
        error
      );
    }
  }

  async restartWorkspace(workspaceId: string): Promise<void> {
    try {
      const namespace = `workspace-${workspaceId}`;
      const deleteRequest: k8s.AppsV1ApiDeleteNamespacedDeploymentRequest = {
        name: `${workspaceId}-deployment`,
        namespace,
      };
      await this.k8sAppsApi.deleteNamespacedDeployment(deleteRequest);

      // Wait for deletion
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Recreate deployment
      const readRequest: k8s.AppsV1ApiReadNamespacedDeploymentRequest = {
        name: `${workspaceId}-deployment`,
        namespace,
      };
      const deployment =
        await this.k8sAppsApi.readNamespacedDeployment(readRequest);

      const createRequest: k8s.AppsV1ApiCreateNamespacedDeploymentRequest = {
        namespace,
        body: deployment,
      };
      await this.k8sAppsApi.createNamespacedDeployment(createRequest);

      logger.info(`Restarted workspace: ${workspaceId}`);
    } catch (error) {
      logger.error(`Failed to restart workspace: ${error}`);
      throw new KubernetesError(
        `Failed to restart workspace: ${workspaceId}`,
        error
      );
    }
  }

  async listWorkspaces(): Promise<string[]> {
    try {
      const namespaces = await this.k8sApi.listNamespace();
      return namespaces.items
        .filter((ns: k8s.V1Namespace) =>
          ns.metadata?.name?.startsWith("workspace-")
        )
        .map((ns: k8s.V1Namespace) =>
          ns.metadata!.name!.replace("workspace-", "")
        );
    } catch (error) {
      logger.error(`Failed to list workspaces: ${error}`);
      throw new KubernetesError("Failed to list workspaces", error);
    }
  }
}

export default new KubernetesService();
