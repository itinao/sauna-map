import {
  saveSaunnerScrapeResult,
  scrapeSaunner,
} from "@/features/scrape-saunner/model/scrape-saunner";

async function main() {
  const saunnerId = process.argv[2];

  if (!saunnerId) {
    throw new Error("Usage: npm run db:scrape -- <saunnerId>");
  }

  const result = await scrapeSaunner(saunnerId);
  await saveSaunnerScrapeResult(saunnerId, result);

  console.log(
    JSON.stringify({
      name: result.name,
      pageCount: result.pageCount,
      postCount: result.postCount,
      prefectures: result.visitsByPrefectureCode.size,
    }),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
