import { body } from "express-validator";

export const createWorkspaceValidation = [
  body("workspaceId")
    .trim()
    .notEmpty()
    .withMessage("Workspace ID is required")
    .isString()
    .withMessage("Workspace ID must be a string")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Workspace ID must contain only lowercase letters, numbers, and hyphens"
    )
    .isLength({ min: 3, max: 63 })
    .withMessage("Workspace ID must be between 3 and 63 characters long"),
];

export const updateWorkspaceValidation = [
  body("resources")
    .optional()
    .isObject()
    .withMessage("Resources must be an object"),
  body("resources.cpu")
    .optional()
    .isString()
    .matches(/^\d+m$/)
    .withMessage('CPU must be specified in millicores (e.g., "500m")'),
  body("resources.memory")
    .optional()
    .isString()
    .matches(/^\d+(Mi|Gi)$/)
    .withMessage(
      'Memory must be specified in Mi or Gi (e.g., "512Mi" or "2Gi")'
    ),
];
