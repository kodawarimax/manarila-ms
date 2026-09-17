'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, GitCommit } from 'lucide-react';

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([
    {
      id: 'prop-sample-01',
      target_process: 'delivery',
      step_number: 3.0,
      issue_summary: '【違和感からの自律改善】提供フローの事前アンケートが長すぎて顧客離脱リスクが高い',
      insight: '事前アンケートの設問が10問あり、セッション前に心理的負担を与えていた',
      proposed_diff: `--- a/standard_process_delivery.md
+++ b/standard_process_delivery.md
@@ -10,4 +10,4 @@
- 事前準備アンケートを全項目詳細に入力してもらう（負担大・離脱リスク）
+ 事前アンケートを必須3問に厳選し、対話セッション内での引き出しを重視する（負担軽減と対話深度の両立）`,
      status: 'pending_human_review',
      created_at: '2026-09-17 19:45'
    }
  ]);

  const handleAction = (proposalId: string, action: 'approved' | 'rejected') => {
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: action } : p));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">自己修復・改善提案 (L0人間承認ゲート)</h1>
          <p className="text-sm text-slate-600 mt-1">
            開発エージェントが現場の違和感・アンケートから自律生成した「標準プロセス改定案（Diff）」の一覧です。
          </p>
        </div>
        <span className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-200">
          Force L0 Review
        </span>
      </div>

      <div className="space-y-4">
        {proposals.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  p.status === 'pending_human_review'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : p.status === 'approved'
                    ? 'bg-teal-100 text-teal-800 border border-teal-200'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {p.status === 'pending_human_review' ? '承認待ち (Pending L0)' : p.status === 'approved' ? '承認済・デプロイ完了' : '却下'}
                </span>
                <span className="text-xs font-mono text-slate-500">対象: {p.target_process?.toUpperCase()} (Step {p.step_number})</span>
              </div>
              <div className="text-xs text-slate-400">{p.created_at}</div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base">{p.issue_summary}</h3>
              {p.insight && (
                <p className="text-xs text-slate-500 mt-1">起因となった違和感: {p.insight}</p>
              )}
            </div>

            <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto leading-relaxed">
              <div className="text-slate-400 text-[10px] mb-2 flex items-center">
                <GitCommit className="w-3.5 h-3.5 mr-1" />
                Proposed Git-style Process Diff:
              </div>
              <pre>{p.proposed_diff}</pre>
            </div>

            {p.status === 'pending_human_review' && (
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => handleAction(p.id, 'rejected')}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex items-center"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1.5" />
                  却下する
                </button>
                <button
                  onClick={() => handleAction(p.id, 'approved')}
                  className="px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm transition flex items-center"
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                  承認して標準プロセスへ反映（デプロイ）
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
