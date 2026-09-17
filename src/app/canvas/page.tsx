'use client';

import React from 'react';
import { Compass, Users, Sparkles, Activity, UserCheck, Box, Coins, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CanvasPage() {
  const canvas = {
    vision: "溢れる自分の本質から生きることで、調和と創造の循環が社会に広がっていく世界\n→ 面白そう！を基点に人それぞれの理念を軸に、それを実現する循環がいくつも生まれる。それらが調和と共創を起こし、また次の循環へつながっていく世界。",
    targetCustomer: "自らの本質から事業を営み、社会と調和した循環を生み出したい個人起業家・中小企業経営者",
    coreValue: "理念と日々の実務が完全に直結した「最小マネジメントシステム（MS）」の設計・伴走と自走化支援",
    coreActivities: "サービスの提供 / コンテンツ開発 / コミュニティ活動 / 営業・発信活動",
    revenueModel: "個別セッション伴走支援 / 最小マネジメントシステム設計・導入 / 継続サポート / コミュニティ"
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-[#eeede8]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#78766e]">
            <Link href="/" className="hover:text-[#24221f] flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Journal
            </Link>
            <span>/</span>
            <span>Single Source of Truth</span>
          </div>
          <h1 className="font-serif-title text-2xl font-bold text-[#1a2c26] mt-2">
            調和ビジネスキャンバス (L1)
          </h1>
          <p className="text-xs text-[#78766e] mt-1 font-sans">
            理念・顧客・価値・活動・資源・収益を1枚に統合した事業の最上位設計です。
          </p>
        </div>
        <span className="text-[11px] font-mono bg-teal-50 text-teal-900 border border-teal-200/80 px-2.5 py-1 rounded">
          Active Constitution
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 理念（最重要） */}
        <div className="granola-card p-6 md:col-span-3 border-l-4 border-l-teal-800 space-y-2">
          <div className="text-[11px] font-mono text-teal-800 uppercase tracking-wider flex items-center">
            <Compass className="w-3.5 h-3.5 mr-1.5" />
            ① 理念・ゴール（最上位憲法）
          </div>
          <p className="font-serif-title text-lg font-bold text-[#1a2c26] whitespace-pre-wrap leading-relaxed">
            {canvas.vision}
          </p>
        </div>

        {/* 顧客像 */}
        <div className="granola-card p-5 space-y-2">
          <div className="text-[11px] font-mono text-[#78766e] uppercase tracking-wider flex items-center">
            <Users className="w-3.5 h-3.5 mr-1.5 text-blue-700" />
            ② 顧客像（対象）
          </div>
          <p className="text-xs text-[#24221f] leading-relaxed">
            {canvas.targetCustomer}
          </p>
        </div>

        {/* 提供価値 */}
        <div className="granola-card p-5 space-y-2">
          <div className="text-[11px] font-mono text-[#78766e] uppercase tracking-wider flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
            ③ 提供価値（コアバリュー）
          </div>
          <p className="text-xs text-[#24221f] leading-relaxed">
            {canvas.coreValue}
          </p>
        </div>

        {/* 活動 */}
        <div className="granola-card p-5 space-y-2">
          <div className="text-[11px] font-mono text-[#78766e] uppercase tracking-wider flex items-center">
            <Activity className="w-3.5 h-3.5 mr-1.5 text-purple-700" />
            ④ 主要活動
          </div>
          <p className="text-xs text-[#24221f] leading-relaxed">
            {canvas.coreActivities}
          </p>
        </div>

        {/* ヒト */}
        <div className="granola-card p-5 space-y-2">
          <div className="text-[11px] font-mono text-[#78766e] uppercase tracking-wider flex items-center">
            <UserCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
            ⑤ ヒト（4大力量）
          </div>
          <ul className="text-[11px] text-[#525049] space-y-1.5 leading-relaxed">
            <li>• <strong>構造設計力：</strong> 本質抽出、全体構造化、KPI設計</li>
            <li>• <strong>対話力：</strong> 傾聴、深い問い、合意形成</li>
            <li>• <strong>運用力：</strong> 情報整理、引継ぎ、版管理</li>
            <li>• <strong>固有知識：</strong> QMS品質規格、心理学、AI技術</li>
          </ul>
        </div>

        {/* モノ */}
        <div className="granola-card p-5 space-y-2">
          <div className="text-[11px] font-mono text-[#78766e] uppercase tracking-wider flex items-center">
            <Box className="w-3.5 h-3.5 mr-1.5 text-indigo-700" />
            ⑥ モノ（道具・環境）
          </div>
          <p className="text-xs text-[#24221f] leading-relaxed">
            PC、スマホ、Zoom、クラウドデータ、生成AI (Claude/Gemini)、標準手順書・ワーク体系
          </p>
        </div>

        {/* 収益モデル */}
        <div className="granola-card p-5 space-y-2">
          <div className="text-[11px] font-mono text-[#78766e] uppercase tracking-wider flex items-center">
            <Coins className="w-3.5 h-3.5 mr-1.5 text-yellow-700" />
            ⑦ 収益モデル
          </div>
          <p className="text-xs text-[#24221f] leading-relaxed">
            {canvas.revenueModel}
          </p>
        </div>
      </div>
    </div>
  );
}
