import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import logger from "@/utils/logger";

export const validate = (validations: ValidationChain[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }

    logger.warn(
      `Validation error for request ${req.id}: ${JSON.stringify(
        errors.array()
      )}`
    );

    res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array(),
      requestId: req.id,
    });
  };
};
