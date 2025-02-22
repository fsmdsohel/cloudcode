import { z } from "zod";

export const createWorkspaceSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name cannot exceed 50 characters")
        .regex(
          /^[a-z0-9-]+$/,
          "Name can only contain lowercase letters, numbers, and hyphens"
        ),
      template: z.string().min(1, "Template is required"),
      language: z.string().min(1, "Language is required"),
      libraries: z.array(z.string()).optional(),
      description: z
        .string()
        .max(200, "Description cannot exceed 200 characters")
        .optional(),
      resources: z
        .object({
          cpu: z
            .string()
            .regex(
              /^\d+m$/,
              'CPU must be specified in millicores (e.g., "500m")'
            ),
          memory: z
            .string()
            .regex(
              /^\d+(Mi|Gi)$/,
              'Memory must be specified in Mi or Gi (e.g., "512Mi" or "2Gi")'
            ),
        })
        .optional(),
    })
    .strict(),
});

export const updateWorkspaceSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name cannot exceed 50 characters")
        .regex(
          /^[a-z0-9-]+$/,
          "Name can only contain lowercase letters, numbers, and hyphens"
        )
        .optional(),
      description: z
        .string()
        .max(200, "Description cannot exceed 200 characters")
        .optional(),
      resources: z
        .object({
          cpu: z
            .string()
            .regex(
              /^\d+m$/,
              'CPU must be specified in millicores (e.g., "500m")'
            ),
          memory: z
            .string()
            .regex(
              /^\d+(Mi|Gi)$/,
              'Memory must be specified in Mi or Gi (e.g., "512Mi" or "2Gi")'
            ),
        })
        .optional(),
      editorConfig: z
        .object({
          theme: z.enum(["light", "dark", "system"]).optional(),
          fontSize: z.number().min(8).max(32).optional(),
          tabSize: z.number().min(2).max(8).optional(),
          lineNumbers: z.boolean().optional(),
          wordWrap: z.boolean().optional(),
          minimap: z.boolean().optional(),
          formatOnSave: z.boolean().optional(),
        })
        .optional(),
      editorLayout: z
        .object({
          orientation: z.enum(["horizontal", "vertical"]).optional(),
          sizes: z.array(z.number()).optional(),
          activePanel: z.number().nullable().optional(),
          panels: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .strict(),
});
