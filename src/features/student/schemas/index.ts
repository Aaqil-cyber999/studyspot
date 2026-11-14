import { z } from "zod";

export { MAX_PROFILE_IMAGE_BYTES, profileImageSchema } from "@/lib/profile-image";

export const chooseUniversitySchema = z.object({
  name: z.string().min(2, "Name is required"),
  university: z.string().min(1, "Select a university"),
  address: z.string().optional(),
});

export const rateCommentSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, "Please write a comment"),
});

export const editStudentInfoSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  location: z.string().trim().min(3, "Enter your location"),
});