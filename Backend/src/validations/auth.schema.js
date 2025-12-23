import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long").regex(/[0-9]/, "Password must contain at least one number").regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
  userType: z.enum(["user", "business"]).optional(),
});

export const LoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
