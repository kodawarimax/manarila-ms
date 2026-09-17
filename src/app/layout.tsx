import './globals.css';
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'MANARILA OS — 理念連動型 自律マネジメントシステム',
  description: '溢れる自分の本質から生き、調和と創造の循環を社会に広げる経営OS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col antialiased selection:bg-teal-100 selection:text-teal-900">
        {/* 上品で控えめなヘッダー */}
        <header className="border-b border-[#eeede8] bg-[#faf9f5]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 group">
                <span className="w-7 h-7 rounded-lg bg-[#1a2c26] text-teal-300 flex items-center justify-center font-serif text-sm font-bold shadow-sm transition group-hover:bg-teal-900">
                  M
                </span>
                <span className="font-serif-title font-bold text-base tracking-tight text-[#24221f]">
                  MANARILA
                </span>
                <span className="text-[11px] text-[#78766e] tracking-widest uppercase ml-1 font-mono">
                  Autonomous OS
                </span>
              </Link>
            </div>

            <nav className="flex items-center space-x-7 text-xs font-medium text-[#78766e]">
              <Link href="/" className="hover:text-[#24221f] transition">
                循環ジャーナル (Today)
              </Link>
              <Link href="/canvas" className="hover:text-[#24221f] transition">
                調和キャンバス
              </Link>
              <Link href="/proposals" className="hover:text-[#24221f] transition flex items-center">
                自己修復Diff
                <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              </Link>
            </nav>
          </div>
        </header>

        {/* メイン領域 */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
          {children}
        </main>

        <footer className="border-t border-[#eeede8] py-6 text-center text-xs text-[#9c9a92] font-mono">
          MANARILA Minimal Management System — Designed with Quiet Intelligence
        </footer>
      </body>
    </html>
  );
}
