import { asc, eq } from "drizzle-orm";
import { getDb } from "@/shared/db";
import { prefectureVisits } from "./schema";

export async function listPrefectureVisits(userId: string) {
  return getDb()
    .select()
    .from(prefectureVisits)
    .where(eq(prefectureVisits.userId, userId))
    .orderBy(asc(prefectureVisits.prefectureCode));
}
