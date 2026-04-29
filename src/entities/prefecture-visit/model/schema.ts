import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const prefectureVisits = pgTable(
  "prefecture_visits",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().default("demo-user"),
    prefectureCode: integer("prefecture_code").notNull(),
    prefectureName: text("prefecture_name").notNull(),
    visitCount: integer("visit_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("prefecture_visits_user_prefecture_idx").on(
      table.userId,
      table.prefectureCode,
    ),
  ],
);
