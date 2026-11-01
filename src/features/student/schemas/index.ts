import { z } from "zod";

export const chooseUniversitySchema = z.object({
  name: z.string().min(2, "Name is required"),
  university: z.string().min(1, "Select a university"),
  address: z.string().optional(),
});

export const rateCommentSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, "Please write a comment"),
});