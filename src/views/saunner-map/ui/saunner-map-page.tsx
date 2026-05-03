import { listPrefectureVisits } from "@/entities/prefecture-visit";
import { getSaunner } from "@/entities/saunner";
import { ScrapeSaunnerForm } from "@/features/scrape-saunner";
import { VisitJapanMap } from "@/widgets/visit-map";

type SaunnerMapPageProps = {
  saunnerId: string;
};

export async function SaunnerMapPage({ saunnerId }: SaunnerMapPageProps) {
  const [saunner, prefectureVisits] = await Promise.all([
    getSaunner(saunnerId),
    listPrefectureVisits(saunnerId),
  ]);
  const hasScrapedData = Boolean(saunner) && prefectureVisits.length > 0;
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

        {hasScrapedData ? (
          <div className="grid flex-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
              <VisitJapanMap visitsByPrefectureCode={visitsByPrefectureCode} />
            </div>

            <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold">取得データ</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500">サウナイキタイID</dt>
                  <dd className="font-mono text-xs">{saunnerId}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">取得ページ数</dt>
                  <dd className="font-medium">{saunner?.scrapedPageCount}ページ</dd>
                </div>
                <div>
                  <dt className="text-slate-500">集計サ活数</dt>
                  <dd className="font-medium">{saunner?.scrapedPostCount}件</dd>
                </div>
                <div>
                  <dt className="text-slate-500">色の上限</dt>
                  <dd className="font-medium">30回</dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <h2 className="text-base font-semibold">都道府県別</h2>
                <ul className="mt-4 space-y-3 text-sm">
                  {prefectureVisits.map((prefectureVisit) => (
                    <li
                      key={prefectureVisit.id}
                      className="flex items-center justify-between rounded border border-blue-100 bg-blue-50 px-3 py-2"
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
              </div>
            </aside>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="max-w-xl space-y-4">
              <h2 className="text-xl font-semibold">まだデータがありません</h2>
              <p className="text-sm leading-6 text-slate-600">
                サウナイキタイの公開サ活ページから都道府県を集計し、DBに保存します。
              </p>
              <ScrapeSaunnerForm saunnerId={saunnerId} />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
