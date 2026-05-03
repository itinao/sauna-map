import { listPrefectureVisits } from "@/entities/prefecture-visit";
import { getSaunner } from "@/entities/saunner";
import { ScrapeSaunnerForm } from "@/features/scrape-saunner";
import { VisitJapanMap } from "@/widgets/visit-map";

type SaunnerMapPageProps = {
  saunnerId: string;
};

const TOTAL_PREFECTURE_COUNT = 47;

function ScrapingStatusBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-blue-600 motion-safe:animate-pulse"
      />
      集計中
    </span>
  );
}

function formatUpdatedAt(date: Date | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Tokyo",
  }).format(date);
}

export async function SaunnerMapPage({ saunnerId }: SaunnerMapPageProps) {
  const [saunner, prefectureVisits] = await Promise.all([
    getSaunner(saunnerId),
    listPrefectureVisits(saunnerId),
  ]);
  const hasScrapedData = Boolean(saunner) && prefectureVisits.length > 0;
  const isScraping = saunner?.scrapeStatus === "running";
  const hasScrapeFailed = saunner?.scrapeStatus === "failed";
  const scrapedPostCountLabel = hasScrapedData
    ? `${saunner?.scrapedPostCount}件`
    : "-";
  const visitedPrefectureCountLabel = hasScrapedData
    ? `${prefectureVisits.length} / ${TOTAL_PREFECTURE_COUNT}`
    : "-";
  const visitsByPrefectureCode = Object.fromEntries(
    prefectureVisits.map((prefectureVisit) => [
      prefectureVisit.prefectureCode,
      prefectureVisit.visitCount,
    ]),
  );

  return (
    <main className="flex flex-1 flex-col bg-slate-50 text-slate-950">
      <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:py-8">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-medium text-blue-700">Sauna Map</p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            {saunner?.name ? `${saunner.name}さんのサウナマップ` : "サウナマップ"}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            サウナイキタイのサ活から、都道府県ごとの訪問回数を集計します。
          </p>
        </header>

        <div className="grid flex-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
            <VisitJapanMap visitsByPrefectureCode={visitsByPrefectureCode} />
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold">サマリ</h2>
              {isScraping ? <ScrapingStatusBadge /> : null}
              {hasScrapeFailed ? (
                <span className="rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
                  更新失敗
                </span>
              ) : null}
            </div>
            <dl className="mt-4 divide-y divide-slate-100 text-sm">
              <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
                <dt className="text-slate-500">更新日時</dt>
                <dd className="text-right font-medium">
                  {formatUpdatedAt(saunner?.lastScrapedAt)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-slate-500">サウナイキタイID</dt>
                <dd className="font-mono text-xs">{saunnerId}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-slate-500">サ活合計</dt>
                <dd className="font-semibold">{scrapedPostCountLabel}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3 last:pb-0">
                <dt className="text-slate-500">訪問都道府県</dt>
                <dd className="font-semibold">{visitedPrefectureCountLabel}</dd>
              </div>
            </dl>

            <div className="mt-5">
              <ScrapeSaunnerForm
                disabled={isScraping}
                idleLabel="更新する"
                saunnerId={saunnerId}
              />
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <h2 className="text-base font-semibold">都道府県別の回数</h2>
              {hasScrapedData ? (
                <ul className="mt-4 divide-y divide-slate-100 text-sm">
                  {prefectureVisits.map((prefectureVisit) => (
                    <li
                      key={prefectureVisit.id}
                      className="flex items-center justify-between gap-4 py-2"
                    >
                      <span className="font-medium">
                        {prefectureVisit.prefectureName}
                      </span>
                      <span className="font-mono text-blue-800">
                        {prefectureVisit.visitCount}回
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm font-medium text-slate-500">-</p>
              )}
              {hasScrapeFailed ? (
                <p className="mt-4 text-sm font-medium text-red-700">
                  前回の集計に失敗しました。
                </p>
              ) : null}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
