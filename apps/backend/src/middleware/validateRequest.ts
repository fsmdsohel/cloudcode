import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import logger from "@/utils/logger";

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      logger.warn("Validation error:", error);

      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};

        error.errors.forEach((err) => {
          const field = err.path.join(".").replace("body.", "");
          formattedErrors[field] = err.message;
        });

        res.status(400).json({
          status: "error",
          code: "VALIDATION_ERROR",
          message: "Please check your input",
          details: formattedErrors,
        });
        return;
      }

      res.status(400).json({
        status: "error",
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
      });
    }
  };
};
