# Sauna Map

日本の都道府県ごとに訪問回数を記録し、日本地図上の青色グラデーションで可視化する Next.js アプリです。30回を表示上限として、それ以上は同じ濃い青で表示します。

## 技術スタック

- Next.js App Router
- Feature-Sliced Design
- TypeScript
- Tailwind CSS v4
- Vercel
- Neon Postgres via Vercel Marketplace
- Drizzle ORM

## ディレクトリ構成

Feature-Sliced Design を採用しています。

```text
src/
  app/       Next.js App Router のルーティング層
  views/     画面単位の UI。FSD の pages layer 相当
  widgets/   複数の feature / entity を組み合わせる UI ブロック
  features/  ユーザー操作やユースケース単位の実装
  entities/  ドメインモデル、型、スキーマ、entity 単位の UI
  shared/    DB 接続、共通 UI、共通 lib、設定
```

Next.js の Pages Router と名前が衝突するため、FSD の `pages` layer は `src/views` として扱います。

## 環境変数

```bash
cp .env.example .env.local
```

Vercel Marketplace で Neon を追加したあと、Vercel から env を pull してください。

```bash
vercel env pull .env.local
```

## 開発

開発サーバーを起動します。

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認します。

## データベース

entity ごとのスキーマは `src/entities/*/model/schema.ts` に定義し、Drizzle 用の集約は `src/shared/db/schema.ts` に置きます。

```bash
npm run db:generate
npm run db:push
```

DB コマンドを実行するには、`.env.local` に `DATABASE_URL` が必要です。

## デプロイ

Vercel project の link と Neon の環境変数設定が完了してからデプロイします。

```bash
vercel
```

## 注意点

- `src/shared/db/index.ts` では、ビルド時の安全性のため DB クライアントを遅延初期化しています。
- `.env.local` は commit しないでください。
- `@vercel/postgres` ではなく、Vercel Marketplace の Neon を使ってください。

## 参考リンク

- [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
- [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
