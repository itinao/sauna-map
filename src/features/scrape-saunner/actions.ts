"use server";

import { revalidatePath } from "next/cache";
import {
  saveSaunnerScrapeResult,
  scrapeSaunner,
} from "./model/scrape-saunner";

export async function scrapeSaunnerAction(saunnerId: string) {
  const result = await scrapeSaunner(saunnerId);
  await saveSaunnerScrapeResult(saunnerId, result);
  revalidatePath(`/saunners/${saunnerId}`);
}
