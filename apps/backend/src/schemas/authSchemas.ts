import { z } from "zod";

export const registerSchema = z.object({
  body: z
    .object({
      firstName: z.string().min(2, "First name must be at least 2 characters"),
      lastName: z.string().min(2, "Last name must be at least 2 characters"),
      email: z.string().email("Please enter a valid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      acceptTerms: z.boolean().optional(),
    })
    .strict(),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z.string().email("Please enter a valid email address"),
      password: z.string().min(1, "Password is required"),
    })
    .strict(),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
