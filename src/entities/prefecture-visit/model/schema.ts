import {
  bigint,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const prefectureVisits = pgTable(
  "prefecture_visits",
  {
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity(),
    userId: text("user_id").notNull().default("demo-user"),
    prefectureCode: integer("prefecture_code").notNull(),
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
