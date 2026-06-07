import { z } from "zod";

export const updateUserRoleSchema = z.object({
  role: z.enum(["student", "tutor", "admin"]),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  picture: z.string().url().optional().or(z.literal("")),
  role: z.enum(["student", "tutor", "admin"]).optional(),
}).passthrough(); // allow extra fields for forward compat
