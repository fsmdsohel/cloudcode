import winston from "winston";

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  format: logFormat,
  transports: [
    // Console transport for development
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
    }),
    // File transport for errors
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

export default logger;
