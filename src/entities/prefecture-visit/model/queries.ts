import { asc } from "drizzle-orm";
import { getDb } from "@/shared/db";
import { prefectureVisits } from "./schema";

export async function listPrefectureVisits() {
  return getDb()
    .select()
    .from(prefectureVisits)
    .orderBy(asc(prefectureVisits.prefectureCode));
}
