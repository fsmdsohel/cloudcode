import app from "./app";
import { config } from "@/config/env";
import { connectRedis } from "./config/redis";
import warmPoolService from "./services/warmPoolService";
import logger from "./utils/logger";

const PORT: number = config.app.port;

const startServer = async () => {
  try {
    await connectRedis();
    warmPoolService.startBackgroundWorker();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
