import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sauna Map",
  description: "日本の都道府県ごとの訪問回数を地図で可視化します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
