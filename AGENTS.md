<!-- BEGIN:nextjs-agent-rules -->
# この Next.js は既知の前提と違う可能性があります

このバージョンには破壊的変更が含まれる可能性があります。API、規約、ファイル構成が学習済みの知識と異なる場合があるため、コードを書く前に `node_modules/next/dist/docs/` 内の関連ガイドを確認してください。非推奨の警告にも注意してください。
<!-- END:nextjs-agent-rules -->

# Sauna Map エージェント向けメモ

## プロダクト

このアプリは、ユーザーが日本の各都道府県に何回行ったかを可視化します。

- メイン UI は日本地図です。
- 都道府県は青色の濃淡で表示します。
- 訪問回数 `0` は最も薄い色、または未訪問状態として扱います。
- 色の変化は `30` 回を上限にします。`30` 回を超えた値も、最も濃い青色のままにします。
- 訪問回数はユーザーごとに保持します。基本単位は `userId + prefectureCode` です。
- プロダクト内の表示言語は日本語です。

## 技術スタック

- `src/app` 配下の Next.js App Router
- Feature-Sliced Design
- strict mode の TypeScript
- Tailwind CSS v4
- Vercel ホスティング
- データベース: Vercel Marketplace の Neon Postgres
- ORM / クエリ層: Drizzle ORM
- 日本地図: `@react-map/japan`

## ディレクトリ構成

Feature-Sliced Design を採用します。

- `src/app`: Next.js App Router のルーティング、レイアウト、グローバル CSS だけを置きます。
- `src/views`: ルートに対応する画面単位の UI を置きます。FSD の `pages` layer 相当ですが、Next.js Pages Router と衝突するため `views` という名前にします。
- `src/widgets`: 複数 entity / feature を組み合わせる大きめの UI ブロックを置きます。
- `src/features`: ユーザー操作やユースケース単位の実装を置きます。
- `src/entities`: ドメインモデル、型、スキーマ、entity 単位の UI を置きます。
- `src/shared`: DB 接続、共通 UI、共通 lib、設定など、ドメインに依存しない基盤を置きます。

依存方向は `app -> views -> widgets -> features -> entities -> shared` を基本にします。下位 layer から上位 layer を import しないでください。

## データベースのルール

- `@vercel/postgres` は使わないでください。現在は sunset 扱いのため、Vercel Marketplace 経由の Neon を使います。
- DB クライアントを module scope で初期化しないでください。
- `src/shared/db/index.ts` の遅延初期化ヘルパー `getDb()` を使ってください。
- DB 用の集約スキーマは `src/shared/db/schema.ts` に置き、entity ごとの Drizzle schema は `src/entities/*/model/schema.ts` に置いてください。
- `prefecture_visits` は `userId + prefectureCode` を一意にします。都道府県コードだけを一意にしないでください。
- 認証が入るまでは、動作確認用ユーザーとして `demo-user` を使います。
- サウナイキタイIDに紐づくユーザーは `saunners` テーブルに保存します。
- サウナイキタイ由来の集計では `prefecture_visits.userId` に `saunnerId` をそのまま保存します。

## サウナイキタイ連携

- マップURLは `/saunners/[saunnerId]` です。
- `saunnerId` はサウナイキタイの `https://sauna-ikitai.com/saunners/xxx` の `xxx` と対応します。
- DBに `saunners` と `prefecture_visits` がある場合は地図を表示します。
- DBにデータがない場合はスクレイピング開始ボタンを表示します。
- スクレイピング処理は `src/features/scrape-saunner` に置きます。
- サ活カードの都道府県は `p-postCard_address` の `[ 東京都 ]` のような表示から抽出します。
- ページネーションは `?cursor=...` を辿り、次ページがなくなるまで全ページを取得します。
- スクレイピングは相手サイトへの負荷を避けるため、ページ間に待機時間を入れます。既定値は `SCRAPE_PAGE_DELAY_MS=1500` 相当です。
- 異常なページネーションに備えて安全上限 `SCRAPE_MAX_PAGES` を持ちます。既定値は `500` ページです。
- `/saunners/[saunnerId]` は長めの取得に備えて `maxDuration = 300` を設定しています。
- 動作確認用CLIは `npm run db:scrape -- <saunnerId>` です。

## 地図表示のルール

- 日本地図は `src/widgets/visit-map` に置きます。
- `@react-map/japan` は client component から import してください。
- 都道府県コードと地図側のキーの対応は `src/entities/prefecture-visit/model/prefectures.ts` に集約します。
- 色は `visitCount` を `0` から `30` までに丸めて青色グラデーションにします。
- `30` 回を超える値は、地図上では `30` 回と同じ濃い青として扱います。

## Vercel / GitHub / Env

- GitHub と Vercel は接続済みです。`main` への push は Vercel 側の自動デプロイ対象です。
- Vercel Git Integration を使う場合、`DATABASE_URL` などの secret は GitHub Secrets ではなく Vercel Project の Environment Variables を使います。
- GitHub Actions で migration や deploy を自前実行する場合だけ、GitHub Secrets の設計を別途行ってください。
- Neon integration は Vercel Project に接続済みです。
- `.env.local` は Vercel から pull したローカル用 secret なので commit しないでください。

## 検証メモ

- `npm run db:push` で Neon に schema を反映します。
- `npm run db:seed` で `demo-user` の東京都 `12` 回を投入します。
- ローカルの `npm run build` はサンドボックス内だと Turbopack の内部ポート制限で落ちることがあります。その場合は通常権限で再実行して確認します。
- `.env.local` や Vercel の env 出力に含まれる secret 値をログや回答に表示しないでください。

## コマンド

- `npm run dev`: ローカルの Next.js dev server を起動します。
- `npm run build`: アプリを production build します。
- `npm run lint`: ESLint を実行します。
- `npm run db:generate`: Drizzle の migration ファイルを生成します。
- `npm run db:push`: 設定済み DB にスキーマを反映します。
- `npm run db:studio`: Drizzle Studio を開きます。

## セットアップ順序

1. プロジェクトを Vercel に link します。
2. Vercel Marketplace から Neon を provision します。
3. 環境変数を `.env.local` に pull します。
4. `DATABASE_URL` が存在することを確認します。
5. DB コマンドは環境変数の確認後にだけ実行します。
