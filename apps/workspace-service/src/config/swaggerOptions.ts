import swaggerJsDoc from "swagger-jsdoc";

const { config } = require("./env");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "CodeCloud API",
    version: "1.0.0",
    description: "CodeCloud API documentation",
  },
  servers: [
    {
      url: `http://localhost:${config.app.port}/api/v1`,
      description: "Local server",
    },
    {
      url: `https://codecloud.soheldev.com/api/v1`,
      description: "Production server",
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/docs/*.yaml"],
};

const swaggerDocs = swaggerJsDoc(options);

export default swaggerDocs;
