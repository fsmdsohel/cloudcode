import swaggerJsdoc from "swagger-jsdoc";
import { readFileSync } from "fs";
import { join } from "path";

// Helper to get file path that works in both dev and prod
const getFilePath = (filename: string) => {
  console.log(__dirname);
  const devPath = join(__dirname, "../docs", filename);
  const prodPath = join(__dirname, "../../src/docs", filename);

  try {
    readFileSync(devPath);
    return devPath;
  } catch {
    return prodPath;
  }
};

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CloudCode API Documentation",
      version: "1.0.0",
      description:
        "API documentation for CloudCode authentication and workspace management",
      contact: {
        name: "API Support",
        email: "support@cloudcode.dev",
      },
    },
    servers: [
      {
        url: "/api/v1",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "Authentication and session management endpoints",
      },
      {
        name: "Workspaces",
        description: "Workspace management endpoints",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
    },
  },
  apis: [getFilePath("authRoutes.yaml"), getFilePath("workspaceRoutes.yaml")],
};

export default swaggerJsdoc(options);
