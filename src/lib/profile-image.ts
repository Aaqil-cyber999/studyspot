import { z } from "zod";

export const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;

export const profileImageSchema = z
  .custom<File>((value) => value instanceof File, "Choose an image file")
  .refine((file) => file.type.startsWith("image/"), "Choose a PNG, JPG or WebP image")
  .refine(
    (file) => file.size <= MAX_PROFILE_IMAGE_BYTES,
    "Image must be 5 MB or smaller",
  );
