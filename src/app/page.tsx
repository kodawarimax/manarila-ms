'use client';

import React, { useState } from 'react';
import { Sparkles, Compass, ShieldCheck, RefreshCw, Send } from 'lucide-react';

export default function DashboardPage() {
  const [message, setMessage] = useState('');
  const [chatLogs, setChatLogs] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'こんにちは！MANARILA専属理念コーチです。今日の活動で、理念『調和と創造の循環』に沿って意識したい出会いや、現場での小さな違和感はありますか？' }
  ]);
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    const userText = message;
    setMessage('');
    setChatLogs(prev => [...prev, { sender: 'user', text: userText }]);
    setIsSending(true);

    setTimeout(() => {
      let aiReply = '';
      if (userText.includes('違和感') || userText.includes('課題') || userText.includes('アンケート') || userText.includes('長すぎ')) {
        aiReply = `お話しいただきありがとうございます！
「${userText}」というお話の中に、とても大切な気づき・違和感がありましたね。

【MANARILA理念との調和】
この出来事は、単なる業務の成否ではなく、あなたの理念である『調和と創造の循環』に向けた確かな一歩（智慧）です。

📝 **循環ログに記録しました**
・プロセス：DELIVERY
・発揮力量：communication / structural_design
・次の小さな実験：「${userText.slice(0, 25)}...」に対する小さな検証と改善を行う
✨ **理念KPI（①調和の関わり人数）にカウントされました！**

🔧 **【開発エージェントが自走しました】**
現場の違和感を検知し、標準プロセスの改善案（Diff）を起票しました。上部ナビの「改善提案 (L0承認)」から承認してください。`;
      } else {
        aiReply = `「${userText}」ですね。
その取り組みは、あなたの理念である『溢れる自分の本質から生きることで、調和と創造の循環が社会に広がっていく世界』とどのように響き合っていますか？
どんな小さな気づきでも、循環ログに記録していきますね。`;
      }

      setChatLogs(prev => [...prev, { sender: 'ai', text: aiReply }]);
      setIsSending(false);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* 理念ヘッダーバナー */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>最上位憲法（理念・ゴール）</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              溢れる自分の本質から生きることで、調和と創造の循環が社会に広がっていく世界
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              理念と日々の実務が完全に直結した「最小マネジメントシステム（MS）」の設計・伴走と自走化支援
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 text-right shrink-0">
            <div className="text-xs text-teal-300 font-bold uppercase tracking-wider">自律進化ステータス</div>
            <div className="text-2xl font-black text-white mt-0.5">Level 4 Active</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-end">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400 mr-1" />
              QMS & ガバナンス常時監視中
            </div>
          </div>
        </div>
      </div>

      {/* 2カラム構成：理念KPI＆循環 vs AIコーチ対話 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左カラム：理念KPI ＆ 4大力量 */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center">
                <Sparkles className="w-4 h-4 text-amber-500 mr-2" />
                理念KPI 循環ステータス
              </h2>
              <span className="text-xs text-slate-500 font-medium">Single Source of Truth</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-teal-50/70 border border-teal-100 rounded-xl p-4">
                <div className="text-xs font-bold text-teal-800">① 理念と調和した関わり</div>
                <div className="text-2xl font-black text-teal-950 mt-1">14 <span className="text-xs font-normal text-slate-600">/ 50 名</span></div>
                <div className="text-[11px] text-teal-700 mt-1">理念共鳴顧客・共創パートナー数</div>
              </div>
              <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-4">
                <div className="text-xs font-bold text-amber-800">② 人生の智慧・ストーリー</div>
                <div className="text-2xl font-black text-amber-950 mt-1">7 <span className="text-xs font-normal text-slate-600">/ 20 件</span></div>
                <div className="text-[11px] text-amber-700 mt-1">違和感から結晶化された知見</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4">組織の4大力量（ヒューマンリソース）</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xs font-bold text-slate-800">📐 構造設計力</div>
                <div className="text-[11px] text-slate-500 mt-1">本質抽出 / 構造化 / KPI設計 / 関係把握</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xs font-bold text-slate-800">💬 コミュニケーション力</div>
                <div className="text-[11px] text-slate-500 mt-1">顧客理解 / 傾聴 / 問い / 合意形成</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xs font-bold text-slate-800">⚙️ 運用力</div>
                <div className="text-[11px] text-slate-500 mt-1">情報整理 / 条件確認 / 引継ぎ / 版管理</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xs font-bold text-slate-800">📚 固有知識</div>
                <div className="text-[11px] text-slate-500 mt-1">QMS品質規格 / 心理・コーチング / AI技術</div>
              </div>
            </div>
          </div>
        </div>

        {/* 右カラム：AI理念コーチ インタラクティブ対話 */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-[560px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping"></span>
              <h2 className="text-sm font-bold text-slate-900">専属AI理念コーチ（自律稼働中）</h2>
            </div>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
              Auto-Logger Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-sm">
            {chatLogs.map((log, idx) => (
              <div key={idx} className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                  log.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-br-none shadow-sm'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200 whitespace-pre-wrap'
                }`}>
                  {log.text}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-500 rounded-2xl p-3 text-xs flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>理念と調和する智慧を思考中...</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="今日感じた違和感や気づきを話しかけてください..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl px-4 py-2.5 flex items-center justify-center transition shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
