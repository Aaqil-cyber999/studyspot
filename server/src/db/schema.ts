import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { z } from "zod";

export const roleEnum = pgEnum("role", ["student", "university-admin", "super-admin"]);

export const locationStatusEnum = pgEnum("location_status", ["Active", "Inactive"]);

export const commentStatusEnum = pgEnum("comment_status", ["Visible", "Hidden"]);

export const reportStatusEnum = pgEnum("report_status", ["Pending", "Reviewed"]);

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => require("@paralleldrive/cuid2").createId()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("student"),
  name: text("name").notNull(),
  university: text("university").notNull(),
  image: text("image"), // base64 data URL
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const universities = pgTable("universities", {
  id: text("id").primaryKey().$defaultFn(() => require("@paralleldrive/cuid2").createId()),
  name: text("name").notNull().unique(),
  status: text("status").notNull().default("Active"), // Active | Pending
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const locations = pgTable("locations", {
  id: text("id").primaryKey().$defaultFn(() => require("@paralleldrive/cuid2").createId()),
  name: text("name").notNull(),
  building: text("building"),
  area: text("area").notNull(),
  hours: text("hours"),
  rating: integer("rating").notNull().default(0),
  reviews: integer("reviews").notNull().default(0),
  status: locationStatusEnum("status").notNull().default("Active"),
  seats: text("seats"), // Yes / Limited / No
  wifi: text("wifi"), // Strong / Weak / No
  crowd: text("crowd"), // Low / Medium / High
  noise: text("noise"), // Quiet / Moderate / Loud
  description: text("description"),
  category: text("category"), // Library / Labs / Study space
  amenities: text("amenities").array().notNull().default([]),
  imageUrls: text("image_urls").array().notNull().default([]),
  lastUpdated: timestamp("last_updated").defaultNow(),
  universityId: text("university_id").notNull(),
  createdBy: text("created_by").notNull(), // user id
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: text("id").primaryKey().$defaultFn(() => require("@paralleldrive/cuid2").createId()),
  locationId: text("location_id").notNull().references(() => locations.id),
  userId: text("user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  text: text("text").notNull(),
  status: commentStatusEnum("status").notNull().default("Visible"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reports = pgTable("reports", {
  id: text("id").primaryKey().$defaultFn(() => require("@paralleldrive/cuid2").createId()),
  locationId: text("location_id").notNull().references(() => locations.id),
  userId: text("user_id").notNull().references(() => users.id),
  noise: text("noise").notNull(), // Quiet / Moderate / Loud
  crowd: text("crowd").notNull(), // Low / Medium / High
  seats: text("seats").notNull(), // Yes / Limited / No
  wifi: text("wifi").notNull(), // Strong / Weak / No
  comment: text("comment"),
  status: reportStatusEnum("status").notNull().default("Pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Registration requests table — universities requesting admin access
export const registrationRequests = pgTable("registration_requests", {
  id: text("id").primaryKey().$defaultFn(() => require("@paralleldrive/cuid2").createId()),
  university: text("university").notNull(),
  email: text("email").notNull(),
  applicant: text("applicant"), // name of the person requesting
  status: text("status").notNull().default("Pending"), // Pending | Approved | Rejected
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

// Standalone Zod validation schemas
export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  university: z.string().min(1, "University is required"),
});

export const insertLocationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  building: z.string().optional(),
  area: z.string().min(1, "Area is required"),
  hours: z.string().optional(),
  rating: z.number().optional(),
  reviews: z.number().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
  seats: z.string().optional(),
  wifi: z.string().optional(),
  crowd: z.string().optional(),
  noise: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  imageUrls: z.array(z.string()).optional(),
  universityId: z.string(),
});

export const insertCommentSchema = z.object({
  locationId: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string().min(3, "Comment must be at least 3 characters"),
});

export const insertReportSchema = z.object({
  locationId: z.string(),
  noise: z.string(),
  crowd: z.string(),
  seats: z.string(),
  wifi: z.string(),
  comment: z.string().optional(),
});

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
export type University = typeof universities.$inferSelect;
export type NewUniversity = typeof universities.$inferInsert;
