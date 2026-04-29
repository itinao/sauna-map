import { getDb } from "@/shared/db";
import { and, eq, notInArray } from "drizzle-orm";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  getPrefectureByName,
  prefectureVisits,
} from "@/entities/prefecture-visit";
import { saunners } from "@/entities/saunner";

const BASE_URL = "https://sauna-ikitai.com";
const DEFAULT_PAGE_DELAY_MS = 1500;
const DEFAULT_MAX_PAGES = 500;
const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const USER_AGENTS = [
  DEFAULT_USER_AGENT,
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:124.0) Gecko/20100101 Firefox/124.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13.6; rv:123.0) Gecko/20100101 Firefox/123.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edg/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edg/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0",
] as const;
const execFileAsync = promisify(execFile);

function getNumberFromEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isWafChallenge(html: string) {
  return html.includes("window.gokuProps") || html.includes("awsWaf");
}

function pickUserAgent() {
  const index = Math.floor(Math.random() * USER_AGENTS.length);
  return USER_AGENTS[index] ?? DEFAULT_USER_AGENT;
}

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
    `<li class="c-pagenation_link c-pagenation_link--next">\\s*<a href="([^"]*${escapedSaunnerPath.replaceAll("/", "\\/")}\\?cursor=[^"]+)"><\\/a>`,
    "u",
  );
  const nextHref = html.match(nextLinkPattern)?.[1];

  if (!nextHref) {
    return null;
  }

  return nextHref.startsWith("http") ? nextHref : `${BASE_URL}${nextHref}`;
}

async function fetchSaunnerPage(url: string) {
  const userAgent = pickUserAgent();
  const response = await fetch(url, {
    headers: {
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
      "user-agent": userAgent,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const html = await response.text();

  if (response.status !== 202 && html.length > 0 && !isWafChallenge(html)) {
    return html;
  }

  const { stdout } = await execFileAsync("curl", ["-L", "-sS", url]);

  if (!stdout || isWafChallenge(stdout)) {
    throw new Error(`Failed to fetch readable saunner page: ${url}`);
  }

  return stdout;
}

export async function scrapeSaunner(saunnerId: string): Promise<ScrapeResult> {
  let nextUrl: string | null = `${BASE_URL}/saunners/${saunnerId}`;
  let name: string | null = null;
  let pageCount = 0;
  let postCount = 0;
  const pageDelayMs = getNumberFromEnv(
    "SCRAPE_PAGE_DELAY_MS",
    DEFAULT_PAGE_DELAY_MS,
  );
  const maxPages = getNumberFromEnv("SCRAPE_MAX_PAGES", DEFAULT_MAX_PAGES);
  const visitedUrls = new Set<string>();
  const visitsByPrefectureCode = new Map<
    number,
    { name: string; count: number }
  >();

  while (nextUrl) {
    if (visitedUrls.has(nextUrl)) {
      throw new Error(`Scraping stopped because pagination looped: ${nextUrl}`);
    }

    if (pageCount >= maxPages) {
      throw new Error(`Scraping stopped after reaching ${maxPages} pages.`);
    }

    visitedUrls.add(nextUrl);
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

    if (nextUrl && pageDelayMs > 0) {
      await wait(pageDelayMs);
    }
  }

  if (!name || postCount === 0) {
    throw new Error(
      `No sauna activity posts were found for saunner ${saunnerId}.`,
    );
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
  const db = getDb();

  await db
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

  const scrapedPrefectureCodes = Array.from(
    result.visitsByPrefectureCode.keys(),
  );

  await db
    .delete(prefectureVisits)
    .where(
      and(
        eq(prefectureVisits.userId, saunnerId),
        notInArray(prefectureVisits.prefectureCode, scrapedPrefectureCodes),
      ),
    );

  for (const [prefectureCode, visit] of result.visitsByPrefectureCode) {
    await db
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
