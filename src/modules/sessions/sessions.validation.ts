import { z } from "zod";

export const updateSessionSchema = z.object({
  status: z.string(),
  isFree: z.boolean(),
  amount: z.number().optional(),
});

export const sessionFilterQuerySchema = z.object({
  filter: z.string().optional(),
});
