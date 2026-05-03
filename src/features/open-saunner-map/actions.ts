"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  saveSaunnerScrapeResult,
  saveSaunnerScrapeStatus,
  scrapeSaunner,
} from "@/features/scrape-saunner/model/scrape-saunner";

export type OpenSaunnerMapState = {
  error: string | null;
};

function extractSaunnerId(input: string) {
  const value = input.trim();

  if (/^\d+$/.test(value)) {
    return value;
  }

  const sharedTextMatch = value.match(
    /https?:\/\/(?:www\.)?sauna-ikitai\.com\/saunners\/(\d+)/u,
  );

  if (sharedTextMatch) {
    return sharedTextMatch[1];
  }

  try {
    const url = new URL(value);
    const match = url.pathname.match(/^\/saunners\/(\d+)/u);

    if (
      (url.hostname === "sauna-ikitai.com" ||
        url.hostname === "www.sauna-ikitai.com") &&
      match
    ) {
      return match[1];
    }
  } catch {
    return null;
  }

  return null;
}

export async function openSaunnerMapAction(
  _state: OpenSaunnerMapState,
  formData: FormData,
): Promise<OpenSaunnerMapState> {
  const input = String(formData.get("saunnerInput") ?? "");
  const saunnerId = extractSaunnerId(input);

  if (!saunnerId) {
    return {
      error:
        "サウナイキタイのURL、または数字のサウナイキタイIDを入力してください。",
    };
  }

  try {
    await saveSaunnerScrapeStatus(saunnerId, "running");
    revalidatePath(`/saunners/${saunnerId}`);

    const result = await scrapeSaunner(saunnerId);
    await saveSaunnerScrapeResult(saunnerId, result);
  } catch {
    await saveSaunnerScrapeStatus(saunnerId, "failed");
  } finally {
    revalidatePath(`/saunners/${saunnerId}`);
  }

  redirect(`/saunners/${saunnerId}`);
}
