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

export const editStudentInfoSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  location: z.string().trim().min(3, "Enter your location"),
});

export const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;

export const profileImageSchema = z
  .custom<File>((value) => value instanceof File, "Choose an image file")
  .refine((file) => file.type.startsWith("image/"), "Choose a PNG, JPG or WebP image")
  .refine(
    (file) => file.size <= MAX_PROFILE_IMAGE_BYTES,
    "Image must be 5 MB or smaller",
  );