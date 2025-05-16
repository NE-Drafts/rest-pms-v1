import { z } from "zod";

// Regex for strong password: 8-16 chars, at least one uppercase, one lowercase, one digit, one special char
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/;

// Regex for Rwandan phone numbers starting with 078, 079, 072, or 073 and exactly 10 digits
const phoneRegex = /^(078|079|072|073)\d{7}$/;

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email().transform((val) => val.toLowerCase()),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(24, { message: "Password must be at most 16 characters" })
      .regex(passwordRegex, {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      }),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    phoneNumber: z
      .string()
      .regex(phoneRegex, {
        message:
          "Phone number must start with 078, 079, 072, or 073 and be 10 digits",
      })
      .optional(),
    role: z.optional(z.enum(["USER", "ADMIN"])).default("USER"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" }),
  }),
});
