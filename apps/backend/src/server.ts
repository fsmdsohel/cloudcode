import app from "@/app";
import { initializeRedis } from "@/config/redis";
import logger from "@/utils/logger";
import prisma from "@/controllers/prismaClient";

const PORT = process.env.PORT || 8000;

// Test database connection
async function testDbConnection() {
  try {
    await prisma.$connect();
    logger.info("✅ PostgreSQL Database connected successfully");
  } catch (error) {
    logger.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
}

const startServer = async () => {
  try {
    await testDbConnection(); // Test DB connection before starting server
    await initializeRedis();

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle cleanup on shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
