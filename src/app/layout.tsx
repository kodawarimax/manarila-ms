import './globals.css';
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'MANARILA OS - 理念連動型 自律マネジメントシステム',
  description: '理念に基づいた事業運営と調和の循環を自走させる経営OS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans">
        <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-black text-slate-950 text-lg shadow">
                M
              </span>
              <div>
                <Link href="/" className="font-bold text-lg hover:text-teal-400 transition">
                  MANARILA OS
                </Link>
                <span className="ml-2 text-xs bg-teal-900 text-teal-300 px-2 py-0.5 rounded-full font-medium">
                  Autonomous QMS
                </span>
              </div>
            </div>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/" className="hover:text-teal-300 transition">
                ダッシュボード
              </Link>
              <Link href="/canvas" className="hover:text-teal-300 transition">
                調和キャンバス
              </Link>
              <Link href="/proposals" className="hover:text-teal-300 transition flex items-center">
                改善提案 (L0承認)
                <span className="ml-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
          MANARILA Minimal Management System — Powered by Multi-Agent Autonomous Architecture
        </footer>
      </body>
    </html>
  );
}
