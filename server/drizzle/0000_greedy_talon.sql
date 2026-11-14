CREATE TYPE "public"."comment_status" AS ENUM('Visible', 'Hidden');--> statement-breakpoint
CREATE TYPE "public"."location_status" AS ENUM('Active', 'Inactive');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('Pending', 'Reviewed');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('student', 'university-admin', 'super-admin');--> statement-breakpoint
CREATE TABLE "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"location_id" text NOT NULL,
	"user_id" text NOT NULL,
	"rating" integer NOT NULL,
	"text" text NOT NULL,
	"status" "comment_status" DEFAULT 'Visible' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"building" text,
	"area" text NOT NULL,
	"hours" text,
	"rating" integer DEFAULT 0 NOT NULL,
	"reviews" integer DEFAULT 0 NOT NULL,
	"status" "location_status" DEFAULT 'Active' NOT NULL,
	"seats" text,
	"wifi" text,
	"crowd" text,
	"noise" text,
	"description" text,
	"category" text,
	"amenities" text[] DEFAULT '{}' NOT NULL,
	"image_urls" text[] DEFAULT '{}' NOT NULL,
	"last_updated" timestamp DEFAULT now(),
	"university_id" text NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" text PRIMARY KEY NOT NULL,
	"location_id" text NOT NULL,
	"user_id" text NOT NULL,
	"noise" text NOT NULL,
	"crowd" text NOT NULL,
	"seats" text NOT NULL,
	"wifi" text NOT NULL,
	"comment" text,
	"status" "report_status" DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "universities" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'Active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "universities_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "role" DEFAULT 'student' NOT NULL,
	"name" text NOT NULL,
	"university" text NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;