import Image from "next/image";
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

        <section className="space-y-3">
          <h2 className="text-base font-semibold">URLの取得方法</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold">PCの場合</h3>
              <Image
                alt="PCでユーザーメニューからマイページを表示する場所"
                className="mt-3 aspect-[1.26] w-full rounded border border-slate-200 object-cover object-top"
                height={341}
                src="/url-guide/pc.png"
                width={419}
              />
              <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <li>1. 右上のユーザーメニューを開く</li>
                <li>2. ユーザー名の「マイページを表示」を押す</li>
                <li>3. 開いたページのURLをコピーする</li>
              </ol>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold">スマホアプリの場合</h3>
              <Image
                alt="スマホアプリで共有ボタンを押す場所"
                className="mt-3 aspect-[2.47] w-full rounded border border-slate-200 object-cover object-top"
                height={474}
                src="/url-guide/mobile.png"
                width={1179}
              />
              <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <li>1. マイページ右上の共有ボタンを押す</li>
                <li>2. 表示されたURLをそのままコピーする</li>
              </ol>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
