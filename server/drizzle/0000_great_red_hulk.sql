CREATE TYPE "public"."location_status" AS ENUM('Active', 'Inactive');--> statement-breakpoint
CREATE TYPE "public"."registration_status" AS ENUM('Pending', 'Approved', 'Rejected');--> statement-breakpoint
CREATE TYPE "public"."report_option_category" AS ENUM('wifi', 'noise', 'crowd', 'seats');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('Visible', 'Hidden');--> statement-breakpoint
CREATE TYPE "public"."university_status" AS ENUM('Pending', 'Active', 'Inactive');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('Active', 'Inactive');--> statement-breakpoint
CREATE TABLE "amenities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "location_hours" (
	"location_id" uuid NOT NULL,
	"weekday" integer NOT NULL,
	"is_closed" boolean DEFAULT false NOT NULL,
	"open_time" text DEFAULT '08:00' NOT NULL,
	"close_time" text DEFAULT '20:00' NOT NULL,
	"peak_start" text,
	"peak_end" text,
	CONSTRAINT "location_hours_location_id_weekday_pk" PRIMARY KEY("location_id","weekday"),
	CONSTRAINT "location_hours_weekday_range" CHECK ("location_hours"."weekday" between 0 and 6)
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"building" text,
	"faculty" text,
	"department" text,
	"staff_monitored" boolean DEFAULT false NOT NULL,
	"address" text NOT NULL,
	"hours" text,
	"status" "location_status" DEFAULT 'Active' NOT NULL,
	"seats" text,
	"wifi" text,
	"crowd" text,
	"noise" text,
	"last_reported_by" uuid,
	"last_reported_at" timestamp with time zone,
	"description" text,
	"amenities" text[] DEFAULT '{}' NOT NULL,
	"image_urls" text[] DEFAULT '{}' NOT NULL,
	"university_id" uuid NOT NULL,
	"created_by_university_admin_id" uuid,
	"created_by_super_admin_id" uuid,
	"last_updated" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "otp_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"code_hash" text NOT NULL,
	"purpose" text DEFAULT 'login' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "registration_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text,
	"name" text NOT NULL,
	"university" text NOT NULL,
	"email" text NOT NULL,
	"note" text,
	"status" "registration_status" DEFAULT 'Pending' NOT NULL,
	"decided_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" "report_option_category" NOT NULL,
	"label" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_votes" (
	"review_id" uuid PRIMARY KEY NOT NULL,
	"voter_ids" uuid[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"location_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"text" text NOT NULL,
	"status" "review_status" DEFAULT 'Visible' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_rating_range" CHECK ("reviews"."rating" between 1 and 5)
);
--> statement-breakpoint
CREATE TABLE "saved_places" (
	"student_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "saved_places_student_id_location_id_pk" PRIMARY KEY("student_id","location_id")
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"status" "user_status" DEFAULT 'Active' NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"university_id" uuid,
	"profile_img" text,
	"study_preferences" jsonb,
	"amenities" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "super_admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"status" "user_status" DEFAULT 'Active' NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"profile_img" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "universities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"status" "university_status" DEFAULT 'Active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "university_admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"status" "user_status" DEFAULT 'Active' NOT NULL,
	"title" text,
	"name" text NOT NULL,
	"address" text,
	"university_id" uuid,
	"profile_img" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "location_hours" ADD CONSTRAINT "location_hours_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_last_reported_by_students_id_fk" FOREIGN KEY ("last_reported_by") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_created_by_university_admin_id_university_admins_id_fk" FOREIGN KEY ("created_by_university_admin_id") REFERENCES "public"."university_admins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_created_by_super_admin_id_super_admins_id_fk" FOREIGN KEY ("created_by_super_admin_id") REFERENCES "public"."super_admins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_votes" ADD CONSTRAINT "review_votes_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_places" ADD CONSTRAINT "saved_places_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_places" ADD CONSTRAINT "saved_places_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "university_admins" ADD CONSTRAINT "university_admins_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "amenities_label_unique" ON "amenities" USING btree (lower("label"));--> statement-breakpoint
CREATE INDEX "amenities_order_idx" ON "amenities" USING btree ("order");--> statement-breakpoint
CREATE INDEX "locations_university_id_idx" ON "locations" USING btree ("university_id");--> statement-breakpoint
CREATE INDEX "locations_status_idx" ON "locations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "locations_last_reported_by_idx" ON "locations" USING btree ("last_reported_by");--> statement-breakpoint
CREATE INDEX "otp_codes_email_created_idx" ON "otp_codes" USING btree ("email","created_at");--> statement-breakpoint
CREATE INDEX "registration_requests_status_idx" ON "registration_requests" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "report_options_category_label_unique" ON "report_options" USING btree ("category",lower("label"));--> statement-breakpoint
CREATE INDEX "report_options_category_order_idx" ON "report_options" USING btree ("category","order");--> statement-breakpoint
CREATE INDEX "reviews_location_id_idx" ON "reviews" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "reviews_student_id_idx" ON "reviews" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "reviews_status_idx" ON "reviews" USING btree ("status");--> statement-breakpoint
CREATE INDEX "saved_places_location_id_idx" ON "saved_places" USING btree ("location_id");--> statement-breakpoint
CREATE UNIQUE INDEX "students_email_unique" ON "students" USING btree (lower("email"));--> statement-breakpoint
CREATE INDEX "students_university_id_idx" ON "students" USING btree ("university_id");--> statement-breakpoint
CREATE UNIQUE INDEX "super_admins_email_unique" ON "super_admins" USING btree (lower("email"));--> statement-breakpoint
CREATE UNIQUE INDEX "universities_name_unique" ON "universities" USING btree (lower("name"));--> statement-breakpoint
CREATE UNIQUE INDEX "university_admins_email_unique" ON "university_admins" USING btree (lower("email"));--> statement-breakpoint
CREATE INDEX "university_admins_university_id_idx" ON "university_admins" USING btree ("university_id");