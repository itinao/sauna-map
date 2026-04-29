import { eq } from "drizzle-orm";
import { getDb } from "@/shared/db";
import { saunners } from "./schema";

export async function getSaunner(saunnerId: string) {
  const [saunner] = await getDb()
    .select()
    .from(saunners)
    .where(eq(saunners.id, saunnerId))
    .limit(1);

  return saunner;
}
