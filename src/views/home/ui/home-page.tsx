import { listPrefectureVisits } from "@/entities/prefecture-visit";
import { VisitJapanMap } from "@/widgets/visit-map";

const DEMO_USER_ID = "demo-user";

export async function HomePage() {
  const prefectureVisits = await listPrefectureVisits(DEMO_USER_ID);
  const visitsByPrefectureCode = Object.fromEntries(
    prefectureVisits.map((prefectureVisit) => [
      prefectureVisit.prefectureCode,
      prefectureVisit.visitCount,
    ]),
  );

  return (
    <main className="flex flex-1 flex-col bg-slate-50 text-slate-950">
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8 lg:py-12">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-medium text-blue-700">Sauna Map</p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            都道府県ごとの訪問回数を、日本地図で記録する
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            30回を上限にした青色グラデーションで、よく行く地域ほど濃く表示します。
          </p>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <VisitJapanMap visitsByPrefectureCode={visitsByPrefectureCode} />
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold">初期設定</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-slate-500">ホスティング</dt>
                <dd className="font-medium">Vercel</dd>
              </div>
              <div>
                <dt className="text-slate-500">データベース</dt>
                <dd className="font-medium">
                  Neon Postgres via Vercel Marketplace
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">現在のユーザー</dt>
                <dd className="font-mono text-xs">{DEMO_USER_ID}</dd>
              </div>
              <div>
                <dt className="text-slate-500">色の上限</dt>
                <dd className="font-medium">30回</dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <h2 className="text-base font-semibold">DB接続確認</h2>
              {prefectureVisits.length > 0 ? (
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
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  DBにはまだ訪問回数データがありません。
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
