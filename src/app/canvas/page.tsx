'use client';

import React, { useEffect, useState } from 'react';
import { Compass, Users, Sparkles, Activity, UserCheck, Box, Coins } from 'lucide-react';

export default function CanvasPage() {
  const [context, setContext] = useState<any>(null);

  useEffect(() => {
    fetch('/api/coach')
      .then(res => res.json())
      .then(data => setContext(data))
      .catch(console.error);
  }, []);

  const canvas = context?.canvas;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">調和ビジネスキャンバス (L1)</h1>
          <p className="text-sm text-slate-600 mt-1">理念・顧客・価値・活動・資源・収益を1枚に統合した事業のSingle Source of Truth</p>
        </div>
        <span className="text-xs bg-teal-100 text-teal-800 font-bold px-3 py-1 rounded-full border border-teal-200">
          Version 1.0 Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 理念 */}
        <div className="bg-white rounded-2xl p-6 border-2 border-teal-600 shadow-sm md:col-span-3">
          <div className="text-xs font-bold text-teal-800 flex items-center mb-2">
            <Compass className="w-4 h-4 mr-1.5" />
            ① 理念・ゴール（最上位憲法）
          </div>
          <p className="text-base font-bold text-slate-900 whitespace-pre-wrap leading-relaxed">
            {canvas?.vision || '読み込み中...'}
          </p>
        </div>

        {/* 顧客像 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-700 flex items-center mb-2">
            <Users className="w-4 h-4 text-blue-600 mr-1.5" />
            ② 顧客像（対象）
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            {canvas?.targetCustomer || '読み込み中...'}
          </p>
        </div>

        {/* 提供価値 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-700 flex items-center mb-2">
            <Sparkles className="w-4 h-4 text-amber-500 mr-1.5" />
            ③ 提供価値（コアバリュー）
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            {canvas?.coreValue || '読み込み中...'}
          </p>
        </div>

        {/* 活動 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-700 flex items-center mb-2">
            <Activity className="w-4 h-4 text-purple-600 mr-1.5" />
            ④ 主要活動
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            {canvas?.coreActivities || '読み込み中...'}
          </p>
        </div>

        {/* ヒト */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-700 flex items-center mb-2">
            <UserCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
            ⑤ ヒト（4大力量）
          </div>
          <ul className="text-xs text-slate-700 space-y-1.5">
            <li>• <strong>構造設計力：</strong> 本質抽出、全体構造化、KPI設計</li>
            <li>• <strong>対話力：</strong> 傾聴、深い問い、合意形成</li>
            <li>• <strong>運用力：</strong> 情報整理、引継ぎ、版管理</li>
            <li>• <strong>固有知識：</strong> QMS品質規格、心理学、AI技術</li>
          </ul>
        </div>

        {/* モノ */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-700 flex items-center mb-2">
            <Box className="w-4 h-4 text-indigo-600 mr-1.5" />
            ⑥ モノ（道具・環境）
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            PC、スマホ、Zoom、クラウドデータ、生成AI (Claude/Gemini)、標準手順書・ワーク体系
          </p>
        </div>

        {/* 収益モデル */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-700 flex items-center mb-2">
            <Coins className="w-4 h-4 text-yellow-600 mr-1.5" />
            ⑦ 収益モデル
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            {canvas?.revenueModel || '読み込み中...'}
          </p>
        </div>
      </div>
    </div>
  );
}
