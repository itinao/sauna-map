"use server";

import { revalidatePath } from "next/cache";
import {
  saveSaunnerScrapeResult,
  saveSaunnerScrapeStatus,
  scrapeSaunner,
} from "./model/scrape-saunner";

export async function scrapeSaunnerAction(saunnerId: string) {
  try {
    await saveSaunnerScrapeStatus(saunnerId, "running");
    revalidatePath(`/saunners/${saunnerId}`);

    const result = await scrapeSaunner(saunnerId);
    await saveSaunnerScrapeResult(saunnerId, result);
  } catch (error) {
    await saveSaunnerScrapeStatus(saunnerId, "failed");
    throw error;
  } finally {
    revalidatePath(`/saunners/${saunnerId}`);
  }
}
