CREATE TABLE "prefecture_visits" (
	"id" text PRIMARY KEY NOT NULL,
	"prefecture_code" integer NOT NULL,
	"prefecture_name" text NOT NULL,
	"visit_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "prefecture_visits_prefecture_code_idx" ON "prefecture_visits" USING btree ("prefecture_code");