import { z } from "zod";

// Define the login form schema with Zod
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Type for our form data based on the schema
export type LoginFormData = z.infer<typeof loginSchema>;