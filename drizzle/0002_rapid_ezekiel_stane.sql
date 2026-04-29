CREATE TABLE "saunners" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"scrape_status" text DEFAULT 'idle' NOT NULL,
	"scraped_page_count" integer DEFAULT 0 NOT NULL,
	"scraped_post_count" integer DEFAULT 0 NOT NULL,
	"last_scraped_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
