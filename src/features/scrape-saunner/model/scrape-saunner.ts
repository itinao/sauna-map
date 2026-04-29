import { getDb } from "@/shared/db";
import {
  getPrefectureByName,
  prefectureVisits,
} from "@/entities/prefecture-visit";
import { saunners } from "@/entities/saunner";

const MAX_PAGES = 20;
const BASE_URL = "https://sauna-ikitai.com";

type ScrapeResult = {
  name: string | null;
  pageCount: number;
  postCount: number;
  visitsByPrefectureCode: Map<number, { name: string; count: number }>;
};

function extractSaunnerName(html: string) {
  const titleMatch = html.match(/<title>\s*([^<]+?)さんのサ活一覧/u);
  return titleMatch?.[1]?.trim() ?? null;
}

function extractPrefectureNames(html: string) {
  const matches = html.matchAll(
    /<p class="p-postCard_address">\s*\[\s*([^<\]]+?)\s*\]\s*<\/p>/gu,
  );

  return Array.from(matches, (match) => match[1].trim());
}

function extractNextUrl(html: string, saunnerId: string) {
  const escapedSaunnerPath = `/saunners/${saunnerId}`;
  const nextLinkPattern = new RegExp(
    `<a href="([^"]*${escapedSaunnerPath.replaceAll("/", "\\/")}\\?cursor=[^"]+)"><\\/a>`,
    "u",
  );
  const nextHref = html.match(nextLinkPattern)?.[1];

  if (!nextHref) {
    return null;
  }

  return nextHref.startsWith("http") ? nextHref : `${BASE_URL}${nextHref}`;
}

async function fetchSaunnerPage(url: string) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "sauna-map/0.1 (+https://sauna-map-taupe.vercel.app)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

export async function scrapeSaunner(saunnerId: string): Promise<ScrapeResult> {
  let nextUrl: string | null = `${BASE_URL}/saunners/${saunnerId}`;
  let name: string | null = null;
  let pageCount = 0;
  let postCount = 0;
  const visitsByPrefectureCode = new Map<
    number,
    { name: string; count: number }
  >();

  while (nextUrl && pageCount < MAX_PAGES) {
    const html = await fetchSaunnerPage(nextUrl);
    name ??= extractSaunnerName(html);
    pageCount += 1;

    for (const prefectureName of extractPrefectureNames(html)) {
      const prefecture = getPrefectureByName(prefectureName);

      if (!prefecture) {
        continue;
      }

      postCount += 1;
      const current = visitsByPrefectureCode.get(prefecture.code);
      visitsByPrefectureCode.set(prefecture.code, {
        name: prefecture.name,
        count: (current?.count ?? 0) + 1,
      });
    }

    nextUrl = extractNextUrl(html, saunnerId);
  }

  return {
    name,
    pageCount,
    postCount,
    visitsByPrefectureCode,
  };
}

export async function saveSaunnerScrapeResult(
  saunnerId: string,
  result: ScrapeResult,
) {
  const now = new Date();

  await getDb()
    .insert(saunners)
    .values({
      id: saunnerId,
      name: result.name,
      scrapeStatus: "completed",
      scrapedPageCount: result.pageCount,
      scrapedPostCount: result.postCount,
      lastScrapedAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: saunners.id,
      set: {
        name: result.name,
        scrapeStatus: "completed",
        scrapedPageCount: result.pageCount,
        scrapedPostCount: result.postCount,
        lastScrapedAt: now,
        updatedAt: now,
      },
    });

  for (const [prefectureCode, visit] of result.visitsByPrefectureCode) {
    await getDb()
      .insert(prefectureVisits)
      .values({
        id: `${saunnerId}-prefecture-${prefectureCode}`,
        userId: saunnerId,
        prefectureCode,
        prefectureName: visit.name,
        visitCount: visit.count,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [prefectureVisits.userId, prefectureVisits.prefectureCode],
        set: {
          prefectureName: visit.name,
          visitCount: visit.count,
          updatedAt: now,
        },
      });
  }
}
