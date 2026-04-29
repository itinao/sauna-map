DROP INDEX "prefecture_visits_prefecture_code_idx";--> statement-breakpoint
ALTER TABLE "prefecture_visits" ADD COLUMN "user_id" text DEFAULT 'demo-user' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "prefecture_visits_user_prefecture_idx" ON "prefecture_visits" USING btree ("user_id","prefecture_code");