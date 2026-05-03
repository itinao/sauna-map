import { asc, eq } from "drizzle-orm";
import { getDb } from "@/shared/db";
import { getPrefectureByCode } from "./prefectures";
import { prefectureVisits } from "./schema";

export async function listPrefectureVisits(userId: string) {
  const rows = await getDb()
    .select()
    .from(prefectureVisits)
    .where(eq(prefectureVisits.userId, userId))
    .orderBy(asc(prefectureVisits.prefectureCode));

  return rows.map((row) => ({
    ...row,
    prefectureName:
      getPrefectureByCode(row.prefectureCode)?.name ??
      `都道府県コード ${row.prefectureCode}`,
  }));
}
