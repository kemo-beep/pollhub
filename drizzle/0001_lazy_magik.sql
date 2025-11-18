CREATE TABLE "category" (
	"id" text PRIMARY KEY NOT NULL,
	"contest_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"max_rankings" integer,
	"allow_write_ins" boolean DEFAULT false NOT NULL,
	"randomize_order" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contest" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"slug" text NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"passcode" text,
	"email_domain_restriction" text,
	"one_vote_per_device" boolean DEFAULT true NOT NULL,
	"one_vote_per_email" boolean DEFAULT false NOT NULL,
	"one_vote_per_account" boolean DEFAULT false NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp NOT NULL,
	"show_live_results" boolean DEFAULT false NOT NULL,
	"show_results_after_end" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "contest_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contestant" (
	"id" text PRIMARY KEY NOT NULL,
	"category_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"avatar" text,
	"social_links" jsonb,
	"is_write_in" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vote" (
	"id" text PRIMARY KEY NOT NULL,
	"contest_id" text NOT NULL,
	"category_id" text NOT NULL,
	"user_id" text,
	"email" text,
	"device_id" text,
	"ip_address" text,
	"rankings" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_contest_id_contest_id_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contest"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest" ADD CONSTRAINT "contest_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contestant" ADD CONSTRAINT "contestant_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_contest_id_contest_id_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contest"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;