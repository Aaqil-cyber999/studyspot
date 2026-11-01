import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const locationSchema = z.object({
  name: z.string().min(2),
  building: z.string().min(2),
});