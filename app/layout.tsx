import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ワークショップメーカー",
  description: "あなたのワークショップを、自動でデザインします",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
