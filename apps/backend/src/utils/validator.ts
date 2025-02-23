import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Validator function for creating a workspace
export const validateCreateWorkspace = [
  body("workspaceName").notEmpty().withMessage("Workspace name is required"),
  body("template")
    .isIn(["nodejs", "python", "java"])
    .withMessage("Invalid template type"),
  body("cpu")
    .isInt({ min: 1, max: 8 })
    .withMessage("CPU must be between 1 and 8 cores"),
  body("memory")
    .isInt({ min: 512, max: 8192 })
    .withMessage("Memory must be between 512MB and 8GB"),

  // Middleware to check for validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validator function for updating a workspace
export const validateUpdateWorkspace = [
  body("workspaceName")
    .optional()
    .notEmpty()
    .withMessage("Workspace name cannot be empty"),
  body("template")
    .optional()
    .isIn(["nodejs", "python", "java"])
    .withMessage("Invalid template type"),
  body("cpu")
    .optional()
    .isInt({ min: 1, max: 8 })
    .withMessage("CPU must be between 1 and 8 cores"),
  body("memory")
    .optional()
    .isInt({ min: 512, max: 8192 })
    .withMessage("Memory must be between 512MB and 8GB"),

  // Middleware to check for validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
