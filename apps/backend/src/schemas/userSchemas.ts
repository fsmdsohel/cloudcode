import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z
    .object({
      firstName: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .optional(),
      lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .optional(),
      email: z.string().email("Please enter a valid email address").optional(),
      privacy: z.boolean().optional(),
    })
    .strict(),
});

export const updatePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
      confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .strict()
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

export const updatePreferencesSchema = z.object({
  body: z
    .object({
      theme: z.enum(["light", "dark", "system"]).optional(),
      editorSettings: z
        .object({
          fontSize: z.number().min(8).max(32).optional(),
          tabSize: z.number().min(2).max(8).optional(),
          lineNumbers: z.boolean().optional(),
          minimap: z.boolean().optional(),
          wordWrap: z.boolean().optional(),
          formatOnSave: z.boolean().optional(),
        })
        .optional(),
      notifications: z
        .object({
          email: z.boolean().optional(),
          push: z.boolean().optional(),
          desktop: z.boolean().optional(),
        })
        .optional(),
    })
    .strict(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
