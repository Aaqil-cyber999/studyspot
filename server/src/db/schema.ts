import {
  pgTable,
  text,
  uuid,
  integer,
  timestamp,
  pgEnum,
  boolean,
  primaryKey,
  index,
  uniqueIndex,
  check,
  jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { z } from "zod";

export const userStatusEnum = pgEnum("user_status", ["Active", "Inactive"]);
export const universityStatusEnum = pgEnum("university_status", ["Pending", "Active", "Inactive"]);
export const locationStatusEnum = pgEnum("location_status", ["Active", "Inactive"]);
export const reviewStatusEnum = pgEnum("review_status", ["Visible", "Hidden"]);
export const reportOptionCategoryEnum = pgEnum("report_option_category", [
  "wifi",
  "noise",
  "crowd",
  "seats",
]);
export const registrationStatusEnum = pgEnum("registration_status", [
  "Pending",
  "Approved",
  "Rejected",
]);

export type ReportOptionCategory = (typeof reportOptionCategoryEnum.enumValues)[number];

export interface StudyPreferences {
  studyStyle: "Quiet" | "Focused" | "Social";
  noiseLevel: "Low" | "Medium" | "High";
  studyType: "Individual" | "Group" | "Hybrid";
}

export const universities = pgTable(
  "universities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    status: universityStatusEnum("status").notNull().default("Active"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("universities_name_unique").on(sql`lower(${t.name})`)]
);

// ── Role-specific account tables ────────────────────────────────────────────
// Identity is split per role: every row belongs to exactly one portal.
// Cross-role lookups (login, /me) dispatch on the JWT `role`.

export const students = pgTable(
  "students",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    status: userStatusEnum("status").notNull().default("Active"),
    name: text("name").notNull(),
    address: text("address"),
    universityId: uuid("university_id").references(() => universities.id, {
      onDelete: "set null",
    }),
    faculty: text("faculty"), // e.g. Faculty of Information Technology
    profileImg: text("profile_img"), // data URL or path, validated at the API layer
    studyPreferences: jsonb("study_preferences").$type<StudyPreferences>(),
    amenities: text("amenities").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("students_email_unique").on(sql`lower(${t.email})`),
    index("students_university_id_idx").on(t.universityId),
  ]
);

export const universityAdmins = pgTable(
  "university_admins",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    status: userStatusEnum("status").notNull().default("Active"),
    title: text("title"), // e.g. Dr | Prof | Ms
    name: text("name").notNull(),
    address: text("address"),
    universityId: uuid("university_id").references(() => universities.id, {
      onDelete: "cascade",
    }),
    profileImg: text("profile_img"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("university_admins_email_unique").on(sql`lower(${t.email})`),
    index("university_admins_university_id_idx").on(t.universityId),
  ]
);

export const superAdmins = pgTable(
  "super_admins",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    status: userStatusEnum("status").notNull().default("Active"),
    name: text("name").notNull(),
    address: text("address"),
    profileImg: text("profile_img"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("super_admins_email_unique").on(sql`lower(${t.email})`)]
);

// Master catalog of amenities. `locations.amenities` and `students.amenities`
// store labels that must exist (active) here.
export const amenities = pgTable(
  "amenities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    label: text("label").notNull(),
    active: boolean("active").notNull().default(true),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("amenities_label_unique").on(sql`lower(${t.label})`),
    index("amenities_order_idx").on(t.order),
  ]
);

export const locations = pgTable(
  "locations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    building: text("building"),
    faculty: text("faculty"),
    department: text("department"),
    staffMonitored: boolean("staff_monitored").notNull().default(false),
    address: text("address").notNull(),
    hours: text("hours"),
    status: locationStatusEnum("status").notNull().default("Active"),
    // Live status cache: only the latest student report is kept.
    seats: text("seats"), // Yes | Limited | No
    wifi: text("wifi"), // Strong | Medium | Weak
    crowd: text("crowd"), // Low | Medium | High
    noise: text("noise"), // Quiet | Moderate | Loud
    reportComment: text("report_comment"), // latest report's optional comment
    lastReportedBy: uuid("last_reported_by").references(() => students.id, {
      onDelete: "set null",
    }),
    lastReportedAt: timestamp("last_reported_at", { withTimezone: true }),
    description: text("description"),
    amenities: text("amenities").array().notNull().default([]),
    imageUrls: text("image_urls").array().notNull().default([]),
    // Global popularity counter: incremented by one per student detail-page open.
    totalViews: integer("total_views").notNull().default(0),
    universityId: uuid("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    createdByUniversityAdminId: uuid("created_by_university_admin_id").references(
      () => universityAdmins.id,
      { onDelete: "set null" }
    ),
    createdBySuperAdminId: uuid("created_by_super_admin_id").references(
      () => superAdmins.id,
      { onDelete: "set null" }
    ),
    lastUpdated: timestamp("last_updated", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("locations_university_id_idx").on(t.universityId),
    index("locations_status_idx").on(t.status),
    index("locations_last_reported_by_idx").on(t.lastReportedBy),
  ]
);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    text: text("text").notNull(),
    status: reviewStatusEnum("status").notNull().default("Visible"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    check("reviews_rating_range", sql`${t.rating} between 1 and 5`),
    index("reviews_location_id_idx").on(t.locationId),
    index("reviews_student_id_idx").on(t.studentId),
    index("reviews_status_idx").on(t.status),
  ]
);

// One row per review; `voter_ids` lists every student who found it helpful.
export const reviewVotes = pgTable(
  "review_votes",
  {
    reviewId: uuid("review_id")
      .primaryKey()
      .references(() => reviews.id, { onDelete: "cascade" }),
    voterIds: uuid("voter_ids").array().notNull().default([]),
  }
);

// Master list for the student status-report form (/university-admin/settings/options).
export const reportOptions = pgTable(
  "report_options",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    category: reportOptionCategoryEnum("category").notNull(),
    label: text("label").notNull(),
    active: boolean("active").notNull().default(true),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("report_options_category_label_unique").on(t.category, sql`lower(${t.label})`),
    index("report_options_category_order_idx").on(t.category, t.order),
  ]
);

export const savedPlaces = pgTable(
  "saved_places",
  {
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.studentId, t.locationId] }),
    index("saved_places_location_id_idx").on(t.locationId),
  ]
);

// One-time codes for the student OTP sign-in flow. Codes are stored hashed
// with an expiry and an attempt counter; never returned by any API response.
export const otpCodes = pgTable(
  "otp_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    codeHash: text("code_hash").notNull(),
    purpose: text("purpose").notNull().default("login"), // login | verify
    attempts: integer("attempts").notNull().default(0),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("otp_codes_email_created_idx").on(t.email, t.createdAt)]
);

// Structured per-day opening hours (0 = Sunday … 6 = Saturday).
// Peak window is optional and shared across the day.
export const locationHours = pgTable(
  "location_hours",
  {
    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
    weekday: integer("weekday").notNull(),
    isClosed: boolean("is_closed").notNull().default(false),
    openTime: text("open_time").notNull().default("08:00"),
    closeTime: text("close_time").notNull().default("20:00"),
    peakStart: text("peak_start"),
    peakEnd: text("peak_end"),
  },
  (t) => [
    primaryKey({ columns: [t.locationId, t.weekday] }),
    check("location_hours_weekday_range", sql`${t.weekday} between 0 and 6`),
  ]
);

// Universities requesting admin access
export const registrationRequests = pgTable(
  "registration_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title"), // e.g. Dr. / Prof.
    name: text("name").notNull(),
    university: text("university").notNull(),
    email: text("email").notNull(),
    note: text("note"),
    status: registrationStatusEnum("status").notNull().default("Pending"),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("registration_requests_status_idx").on(t.status)]
);

// ── Zod schemas (API boundary validation) ────────────────────────────────────

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  university: z.string().min(1, "University is required"), // university id or name
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const insertLocationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  building: z.string().optional(),
  faculty: z.string().optional(),
  department: z.string().optional(),
  staffMonitored: z.boolean().optional(),
  address: z.string().min(1, "Address is required"),
  hours: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
  seats: z.enum(["Yes", "Limited", "No"]).optional(),
  wifi: z.enum(["Strong", "Medium", "Weak"]).optional(),
  crowd: z.enum(["Low", "Medium", "High"]).optional(),
  noise: z.enum(["Quiet", "Moderate", "Loud"]).optional(),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  imageUrls: z.array(z.string().url().or(z.string().startsWith("/")).or(z.string().startsWith("data:"))).optional(),
  universityId: z.string().min(1),
});

export const updateLocationSchema = insertLocationSchema.partial().omit({ universityId: true });

export const insertReviewSchema = z.object({
  locationId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(3, "Review must be at least 3 characters"),
});

/** Live status report. Same shape as the student report form; upserts the location row. */
export const submitReportSchema = z.object({
  locationId: z.string().min(1),
  noise: z.enum(["Quiet", "Moderate", "Loud"]),
  crowd: z.enum(["Low", "Medium", "High"]),
  seats: z.enum(["Yes", "Limited", "No"]),
  wifi: z.enum(["Strong", "Medium", "Weak"]),
  comment: z.string().max(2000).optional(),
});

export const registrationRequestSchema = z.object({
  title: z.string().max(20).optional(),
  name: z.string().min(2, "Name is required"),
  university: z.string().min(2, "University is required"),
  email: z.string().email("Invalid email"),
  note: z.string().max(2000).optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  title: z.string().max(20).nullable().optional(), // university-admins only
  address: z.string().max(200).nullable().optional(),
  universityId: z.string().min(1).nullable().optional(),
  faculty: z.string().trim().min(2, "Enter your faculty").max(120).nullable().optional(), // students only
  studyStyle: z.enum(["Quiet", "Focused", "Social"]).nullable().optional(), // students only
  noiseLevel: z.enum(["Low", "Medium", "High"]).nullable().optional(), // students only
  studyType: z.enum(["Individual", "Group", "Hybrid"]).nullable().optional(), // students only
  amenities: z.array(z.string()).optional(), // students only
});

export const updateProfileImageSchema = z.object({
  profileImg: z
    .string()
    .startsWith("data:image/", "Image must be a data URL")
    .max(7_000_000, "Image must be smaller than 5 MB")
    .nullable(), // null removes the photo
});

export const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;

// ── Types ────────────────────────────────────────────────────────────────────
export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
export type UniversityAdmin = typeof universityAdmins.$inferSelect;
export type NewUniversityAdmin = typeof universityAdmins.$inferInsert;
export type SuperAdmin = typeof superAdmins.$inferSelect;
export type NewSuperAdmin = typeof superAdmins.$inferInsert;
export type Amenity = typeof amenities.$inferSelect;
export type NewAmenity = typeof amenities.$inferInsert;
export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
export type AdminOption = typeof reportOptions.$inferSelect;
export type NewAdminOption = typeof reportOptions.$inferInsert;
export type ReportOption = typeof reportOptions.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type ReviewVote = typeof reviewVotes.$inferSelect;
export type University = typeof universities.$inferSelect;
export type NewUniversity = typeof universities.$inferInsert;
export type SavedPlace = typeof savedPlaces.$inferSelect;
export type OtpCode = typeof otpCodes.$inferSelect;
export type LocationHours = typeof locationHours.$inferSelect;
export type RegistrationRequest = typeof registrationRequests.$inferSelect;
export type NewRegistrationRequest = typeof registrationRequests.$inferInsert;
