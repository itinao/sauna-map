import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const saunners = pgTable("saunners", {
  id: text("id").primaryKey(),
  name: text("name"),
  scrapeStatus: text("scrape_status").notNull().default("idle"),
  scrapedPageCount: integer("scraped_page_count").notNull().default(0),
  scrapedPostCount: integer("scraped_post_count").notNull().default(0),
  lastScrapedAt: timestamp("last_scraped_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
