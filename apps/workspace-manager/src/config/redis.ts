import { createClient } from "redis";
import logger from "@/utils/logger";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redisClient = createClient({
    url: redisUrl,
});

redisClient.on("error", (err) => {
    logger.error("Redis Client Error", err);
});

redisClient.on("connect", () => {
    logger.info("Connected to Redis in Workspace Manager");
});

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};

export default redisClient;
