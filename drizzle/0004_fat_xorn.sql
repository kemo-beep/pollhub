ALTER TABLE "vote" ALTER COLUMN "rankings" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "voting_type" text DEFAULT 'rank' NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "max_selections" integer;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "rating_scale" integer DEFAULT 5;--> statement-breakpoint
ALTER TABLE "vote" ADD COLUMN "vote_data" jsonb;