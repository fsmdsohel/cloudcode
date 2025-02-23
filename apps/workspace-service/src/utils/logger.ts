import winston from "winston";

// Define the log format
const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`
  )
);

// Create the logger instance
const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    // Console transport for logging to the terminal
    new winston.transports.Console(),
    // File transport for logging to a file (optional)
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

// Export the logger instance
export default logger;
