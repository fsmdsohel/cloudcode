import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import RateLimitRedis from "rate-limit-redis";
import logger from "@/utils/logger";

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy(retries) {
      logger.info(`Attempting Redis reconnection #${retries}`);
      return Math.min(retries * 500, 3000);
    },
  },
});

redisClient.on("error", (err) => logger.error("Redis Client Error:", err));
redisClient.on("connect", () => logger.info("Redis Client Connected"));

export let sessionStore: any;
export let rateLimitStore: any;

export const initializeRedis = async () => {
  try {
    await redisClient.connect();
    logger.info("Redis connected successfully");

    sessionStore = new RedisStore({ client: redisClient });
    rateLimitStore = new RateLimitRedis({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
      prefix: "rl:",
    });
  } catch (error) {
    logger.error("Redis initialization failed:", error);
    throw error;
  }
};

export const addToBlacklist = async (userId: string, token: string) => {
  await redisClient.set(`bl_${token}`, userId, { EX: 30 * 24 * 60 * 60 }); // 30 day expiry
};

export const isBlacklisted = async (token: string): Promise<boolean> => {
  return (await redisClient.exists(`bl_${token}`)) === 1;
};

export default redisClient;
