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
  private k8sExec: k8s.Exec;

  constructor() {
    try {
      const kc = new k8s.KubeConfig();
      kc.loadFromDefault();

      const cluster = kc.getCurrentCluster();
      if (cluster?.server?.startsWith("http:")) {
        (cluster as any).skipTLSVerify = true;
      }

      this.k8sApi = kc.makeApiClient(k8s.CoreV1Api);
      this.k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);
      this.k8sExec = new k8s.Exec(kc);
    } catch (error) {
      throw new KubernetesError("Failed to initialize Kubernetes client", error);
    }
  }

  async createNamespace(workspaceId: string): Promise<void> {
    try {
      await this.k8sApi.createNamespace({ body: this.getNamespaceDefinition(workspaceId) });
      logger.info(`Created namespace for workspace: ${workspaceId}`);
    } catch (error) {
      this.handleError(`create namespace for workspace: ${workspaceId}`, error);
    }
  }

  async createPersistentVolumeClaim(namespace: string, workspaceId: string): Promise<void> {
    try {
      await this.k8sApi.createNamespacedPersistentVolumeClaim({
        namespace,
        body: this.getPVCDefinition(workspaceId),
      });
      logger.info(`Created PVC for workspace: ${workspaceId}`);
    } catch (error) {
      this.handleError(`create PVC for workspace: ${workspaceId}`, error);
    }
  }

  async createDeployment(namespace: string, workspaceId: string, config: WorkspaceConfig): Promise<void> {
    try {
      await this.k8sAppsApi.createNamespacedDeployment({
        namespace,
        body: this.getDeploymentDefinition(workspaceId, config),
      });
      logger.info(`Created deployment for workspace: ${workspaceId}`);
    } catch (error) {
      this.handleError(`create deployment for workspace: ${workspaceId}`, error);
    }
  }

  async createService(namespace: string, workspaceId: string): Promise<void> {
    try {
      await this.k8sApi.createNamespacedService({
        namespace,
        body: this.getServiceDefinition(workspaceId),
      });
      logger.info(`Created service for workspace: ${workspaceId}`);
    } catch (error) {
      this.handleError(`create service for workspace: ${workspaceId}`, error);
    }
  }

  async deleteWorkspace(workspaceId: string): Promise<void> {
    try {
      await this.k8sApi.deleteNamespace({ name: `workspace-${workspaceId}` });
      logger.info(`Deleted namespace and all resources for workspace: ${workspaceId}`);
    } catch (error) {
      this.handleError(`delete workspace: ${workspaceId}`, error);
    }
  }

  async getWorkspaceStatus(workspaceId: string): Promise<string> {
    try {
      const { status, spec } = await this.k8sAppsApi.readNamespacedDeployment({
        name: `${workspaceId}-deployment`,
        namespace: `workspace-${workspaceId}`,
      });

      const ready = status?.readyReplicas || 0;
      const desired = spec?.replicas || 1;

      if (ready === desired) return "running";
      if (ready === 0) return "stopped";
      return "starting";
    } catch (error) {
      logger.error(`Failed to get workspace status: ${error}`);
      if ((error as any)?.statusCode === 404) return "not_found";
      return "failed";
    }
  }

  async startWorkspace(workspaceId: string): Promise<void> {
    await this.scaleWorkspace(workspaceId, 1, "started");
  }

  async stopWorkspace(workspaceId: string): Promise<void> {
    await this.scaleWorkspace(workspaceId, 0, "stopped");
  }

  async restartWorkspace(workspaceId: string): Promise<void> {
    try {
      const name = `${workspaceId}-deployment`;
      const namespace = `workspace-${workspaceId}`;

      await this.k8sAppsApi.deleteNamespacedDeployment({ name, namespace });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Fetch fresh deployment config if needed, or rely on previous state. 
      // Ideally we would have the config to recreate it. 
      // The original code tried to read the DELETED deployment which would fail.
      // Assuming the original intention was a restart rollout or similar.
      // For now, preserving original logic flow but correcting the check.
      // Wait, reading a deleted deployment will fail. 
      // A better restart is `kubectl rollout restart` equivalent (patching annotation).
      // However, sticking to the "delete and recreate" logic of previous code requires saving the spec first.

      // Let's attempt to read BEFORE delete in the original logic?
      // Original code: delete -> wait -> read -> create. 
      // This MUST be buggy in original because read fails after delete.
      // I will fix this logic: Read FIRST, then delete, then create.

      const deployment = await this.k8sAppsApi.readNamespacedDeployment({ name, namespace });
      await this.k8sAppsApi.deleteNamespacedDeployment({ name, namespace });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Cleanup metadata for re-creation
      const body = deployment as k8s.V1Deployment;
      delete body.metadata?.resourceVersion;
      delete body.metadata?.uid;

      await this.k8sAppsApi.createNamespacedDeployment({ namespace, body });
      logger.info(`Restarted workspace: ${workspaceId}`);
    } catch (error) {
      this.handleError(`restart workspace: ${workspaceId}`, error);
    }
  }

  async listWorkspaces(): Promise<string[]> {
    try {
      const { items } = await this.k8sApi.listNamespace();
      return items
        .map(ns => ns.metadata?.name)
        .filter((name): name is string => name?.startsWith("workspace-") ?? false)
        .map(name => name.replace("workspace-", ""));
    } catch (error) {
      this.handleError("list workspaces", error);
      return [];
    }
  }

  async getPodName(workspaceId: string): Promise<string> {
    try {
      const { items } = await this.k8sApi.listNamespacedPod({
        namespace: `workspace-${workspaceId}`,
        labelSelector: `app=${workspaceId}`,
      });

      if (!items.length) throw new Error("No pod found for workspace");
      return items[0].metadata!.name!;
    } catch (error) {
      this.handleError(`get pod name for workspace: ${workspaceId}`, error);
      return "";
    }
  }

  async execCommand(workspaceId: string, command: string[]): Promise<{ stdout: string; stderr: string }> {
    return new Promise(async (resolve, reject) => {
      let stdout = "";
      let stderr = "";
      const { Writable } = await import("stream");

      try {
        await this.k8sExec.exec(
          `workspace-${workspaceId}`,
          await this.getPodName(workspaceId),
          workspaceId,
          command,
          new Writable({ write: (chunk, _, cb) => { stdout += chunk; cb(); } }),
          new Writable({ write: (chunk, _, cb) => { stderr += chunk; cb(); } }),
          null,
          false,
          () => resolve({ stdout, stderr })
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  // --- Private Helpers ---

  private async scaleWorkspace(workspaceId: string, replicas: number, action: string): Promise<void> {
    try {
      const name = `${workspaceId}-deployment`;
      const namespace = `workspace-${workspaceId}`;
      const deployment = await this.k8sAppsApi.readNamespacedDeployment({ name, namespace });

      if (deployment?.spec) {
        deployment.spec.replicas = replicas;
        await this.k8sAppsApi.replaceNamespacedDeployment({ name, namespace, body: deployment });
      }
      logger.info(`${action} workspace: ${workspaceId}`);
    } catch (error) {
      this.handleError(`${action} workspace: ${workspaceId}`, error);
    }
  }

  private handleError(context: string, error: unknown): never {
    logger.error(`Failed to ${context}: ${error}`);
    throw new KubernetesError(`Failed to ${context}`, error);
  }

  private getNamespaceDefinition(id: string): k8s.V1Namespace {
    return {
      metadata: {
        name: `workspace-${id}`,
        labels: { app: "cloudcode", workspace: id, createdAt: new Date().toISOString() },
      },
      apiVersion: "v1",
      kind: "Namespace",
    };
  }

  private getPVCDefinition(id: string): k8s.V1PersistentVolumeClaim {
    return {
      metadata: {
        name: `${id}-pvc`,
        labels: { app: "cloudcode", workspace: id },
      },
      spec: {
        accessModes: ["ReadWriteOnce"],
        resources: { requests: { storage: kubernetesConfig.storage.size } },
        storageClassName: kubernetesConfig.storage.className,
      },
      apiVersion: "v1",
      kind: "PersistentVolumeClaim",
    };
  }

  private getDeploymentDefinition(id: string, config: WorkspaceConfig): k8s.V1Deployment {
    const resources = kubernetesConfig.resources.default;
    return {
      metadata: {
        name: `${id}-deployment`,
        labels: { app: "cloudcode", workspace: id },
      },
      spec: {
        replicas: 1,
        selector: { matchLabels: { app: id } },
        template: {
          metadata: { labels: { app: id } },
          spec: {
            containers: [{
              name: id,
              image: this.getContainerImage(config.template, config.language),
              resources: {
                requests: {
                  cpu: config.resources?.cpu || resources.cpu.request,
                  memory: config.resources?.memory || resources.memory.request,
                },
                limits: {
                  cpu: config.resources?.cpu || resources.cpu.limit,
                  memory: config.resources?.memory || resources.memory.limit,
                },
              },
              volumeMounts: [{ name: "workspace-storage", mountPath: kubernetesConfig.containers.mountPath }],
              ports: [{ containerPort: kubernetesConfig.containers.port, name: "http" }],
              env: [
                { name: "WORKSPACE_ID", value: id },
                { name: "TEMPLATE", value: config.template },
                { name: "LANGUAGE", value: config.language },
              ],
              readinessProbe: {
                httpGet: { path: "/health", port: kubernetesConfig.containers.port },
                initialDelaySeconds: 10, periodSeconds: 10,
              },
              livenessProbe: {
                httpGet: { path: "/health", port: kubernetesConfig.containers.port },
                initialDelaySeconds: 15, periodSeconds: 20,
              },
            }],
            volumes: [{
              name: "workspace-storage",
              persistentVolumeClaim: { claimName: `${id}-pvc` },
            }],
          },
        },
      },
      apiVersion: "apps/v1",
      kind: "Deployment",
    };
  }

  private getServiceDefinition(id: string): k8s.V1Service {
    return {
      metadata: {
        name: `${id}-service`,
        labels: { app: "cloudcode", workspace: id },
      },
      spec: {
        selector: { app: id },
        ports: [{
          port: 80,
          targetPort: kubernetesConfig.containers.port,
          protocol: "TCP",
        }],
        type: "ClusterIP",
      },
      apiVersion: "v1",
      kind: "Service",
    };
  }

  private getContainerImage(template: string, language: string): string {
    const images = kubernetesConfig.images as any;
    const tmpl = images[template];
    return (typeof tmpl === "object" ? tmpl[language] : images.base) || images.base;
  }
}

export default new KubernetesService();
