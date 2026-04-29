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
- プロダクト内の表示言語は日本語です。

## 技術スタック

- `src/app` 配下の Next.js App Router
- Feature-Sliced Design
- strict mode の TypeScript
- Tailwind CSS v4
- Vercel ホスティング
- データベース: Vercel Marketplace の Neon Postgres
- ORM / クエリ層: Drizzle ORM

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
