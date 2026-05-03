import Image from "next/image";
import { OpenSaunnerMapForm } from "@/features/open-saunner-map";

export function HomePage() {
  return (
    <main className="flex flex-1 flex-col bg-slate-50 text-slate-950">
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-8 px-4 py-10 sm:px-6">
        <header className="space-y-4">
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            サウナマップを開く
          </h1>
          <div className="space-y-2 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            <p>
              サウナイキタイのURLまたはIDを入力すると、都道府県ごとの訪問回数を表示します。
            </p>
            <p>
              公開サ活ページへ負荷をかけすぎないように、時間をかけて優しくデータを取得します。
            </p>
          </div>
          <div className="rounded border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-500">
            サウナイキタイとは非公式の連携です。サイト側の変更などにより、データ取得が停止する可能性があります。
          </div>
        </header>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <OpenSaunnerMapForm />
          <div className="mt-5 border-t border-slate-200 pt-4">
            <ul className="space-y-2 text-sm leading-6 text-slate-600">
              <li>
                更新時間はサ活数に比例します。目安として、500件で1分程度かかります。
              </li>
            </ul>
          </div>
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
