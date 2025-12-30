import redisClient from "../config/redis";
import kubernetesService from "./kubernetesService";
import logger from "@/utils/logger";
import { v4 as uuidv4 } from "uuid";
import { WorkspaceConfig } from "../types/workspace";

const WARM_POOL_KEY = "warm_workspaces";
const TARGET_POOL_SIZE = 3; // Keep 3 warm pods
const POOL_CHECK_INTERVAL = 10000; // Check every 10s

class WarmPoolService {
    private isChecking = false;

    async startBackgroundWorker() {
        logger.info("Starting Warm Pool Worker...");
        setInterval(() => this.ensureWarmPool(), POOL_CHECK_INTERVAL);
        // Initial check
        this.ensureWarmPool();
    }

    async ensureWarmPool() {
        if (this.isChecking) return;
        this.isChecking = true;

        try {
            const poolSize = await redisClient.sCard(WARM_POOL_KEY);
            logger.debug(`Warm Pool Size: ${poolSize}/${TARGET_POOL_SIZE}`);

            if (poolSize < TARGET_POOL_SIZE) {
                const needed = TARGET_POOL_SIZE - poolSize;
                logger.info(`Warm Pool low. Creating ${needed} new workspaces...`);

                // Create 'needed' workspaces in parallel
                const promises = Array(needed)
                    .fill(null)
                    .map(() => this.createWarmWorkspace());

                await Promise.allSettled(promises);
            }
        } catch (error) {
            logger.error("Error in Warm Pool Worker:", error);
        } finally {
            this.isChecking = false;
        }
    }

    private async createWarmWorkspace() {
        const workspaceId = `warm-${uuidv4().substring(0, 8)}`;
        const config: WorkspaceConfig = {
            name: "warm-instance",
            template: "node", // Default template
            language: "javascript",
            libraries: []
        };

        try {
            logger.info(`Provisioning warm workspace: ${workspaceId}`);

            // 1. Create K8s resources
            await kubernetesService.createNamespace(workspaceId);
            await kubernetesService.createPersistentVolumeClaim(workspaceId, workspaceId);
            await kubernetesService.createDeployment(workspaceId, workspaceId, config);
            await kubernetesService.createService(workspaceId, workspaceId);

            // 2. Add to Redis set
            await redisClient.sAdd(WARM_POOL_KEY, workspaceId);
            logger.info(`Warm workspace ready: ${workspaceId}`);

        } catch (error) {
            logger.error(`Failed to provision warm workspace ${workspaceId}:`, error);
            // Cleanup if failed
            try {
                await kubernetesService.deleteWorkspace(workspaceId);
            } catch (e) { /* ignore */ }
        }
    }

    async claimWorkspace(): Promise<string | null> {
        // Pop a random member from the set
        const result = await redisClient.sPop(WARM_POOL_KEY);
        const workspaceId = Array.isArray(result) ? result[0] : result;

        if (workspaceId) {
            logger.info(`Claimed warm workspace: ${workspaceId}`);
            // Immediately trigger replenishment
            this.ensureWarmPool();
            return workspaceId;
        }
        return null;
    }
}

export default new WarmPoolService();
