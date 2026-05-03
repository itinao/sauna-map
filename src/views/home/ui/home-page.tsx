import { OpenSaunnerMapForm } from "@/features/open-saunner-map";

export function HomePage() {
  return (
    <main className="flex flex-1 flex-col bg-slate-50 text-slate-950">
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-8 px-4 py-10 sm:px-6">
        <header className="space-y-3">
          <p className="text-sm font-medium text-blue-700">Sauna Map</p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            サウナマップを開く
          </h1>
          <p className="text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            サウナイキタイのURLまたはIDを入力すると、サ活を集計して都道府県ごとの訪問回数を表示します。
          </p>
        </header>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <OpenSaunnerMapForm />
        </div>
      </section>
    </main>
  );
}
