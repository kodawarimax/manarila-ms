'use client';

import React, { useState } from 'react';
import { Check, X, GitCommit, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([
    {
      id: 'prop-sample-01',
      target_process: 'delivery',
      step_number: 3.0,
      step_name: '事前アンケートの運用',
      issue_summary: '【違和感からの自律改善】事前アンケートが長すぎて顧客離脱リスクが高い',
      insight: '事前アンケートの設問が10問あり、セッション前に心理的負担を与えていた',
      proposed_diff: `--- a/standard_process_delivery.md (Step 3.0)
+++ b/standard_process_delivery.md (Step 3.0)
@@ -12,4 +12,4 @@
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
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-[#eeede8]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#78766e]">
            <Link href="/" className="hover:text-[#24221f] flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Journal
            </Link>
            <span>/</span>
            <span>Self-Healing Governance</span>
          </div>
          <h1 className="font-serif-title text-2xl font-bold text-[#1a2c26] mt-2">
            自己修復・改善提案 (L0人間承認ゲート)
          </h1>
          <p className="text-xs text-[#78766e] mt-1 font-sans">
            現場の違和感から開発エージェントが自律生成した、手順書の変更差分（Diff）です。
          </p>
        </div>
        <span className="text-[11px] font-mono bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded">
          Force L0 Human Gateway
        </span>
      </div>

      <div className="space-y-6">
        {proposals.map((p) => (
          <div key={p.id} className="granola-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold tracking-wider ${
                  p.status === 'pending_human_review'
                    ? 'bg-amber-100 text-amber-900'
                    : p.status === 'approved'
                    ? 'bg-teal-100 text-teal-900'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {p.status === 'pending_human_review' ? 'Pending Review' : p.status === 'approved' ? 'Approved & Deployed' : 'Rejected'}
                </span>
                <span className="text-xs font-mono text-[#78766e]">
                  {p.target_process?.toUpperCase()} (Step {p.step_number}: {p.step_name})
                </span>
              </div>
              <span className="text-xs font-mono text-[#9c9a92]">{p.created_at}</span>
            </div>

            <div className="space-y-1">
              <h2 className="font-serif-title font-bold text-base text-[#1a2c26]">{p.issue_summary}</h2>
              {p.insight && (
                <p className="text-xs text-[#78766e] leading-relaxed">起因となった違和感：{p.insight}</p>
              )}
            </div>

            {/* Linear風の洗練されたDiffビューア */}
            <div className="bg-[#1e1e1e] text-[#d4d4d4] rounded-lg p-4 font-mono text-[11px] leading-relaxed overflow-x-auto shadow-inner">
              <div className="text-[#858585] text-[10px] mb-2 flex items-center">
                <GitCommit className="w-3 h-3 mr-1" />
                Proposed Standard Process Diff
              </div>
              <pre className="text-[#ce9178]">{p.proposed_diff}</pre>
            </div>

            {p.status === 'pending_human_review' ? (
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#9c9a92] font-mono">
                  承認すると標準プロセスが本番へ自動デプロイされます
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAction(p.id, 'rejected')}
                    className="px-3 py-1.5 text-xs text-[#78766e] hover:text-[#24221f] hover:bg-[#f4f3ef] rounded-md transition font-medium flex items-center"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    却下
                  </button>
                  <button
                    onClick={() => handleAction(p.id, 'approved')}
                    className="px-4 py-1.5 text-xs bg-[#1a2c26] hover:bg-teal-950 text-[#faf9f5] rounded-md shadow-sm transition font-medium flex items-center"
                  >
                    <Check className="w-3.5 h-3.5 mr-1.5 text-teal-300" />
                    承認して反映（L0サイン）
                  </button>
                </div>
              </div>
            ) : p.status === 'approved' ? (
              <div className="pt-2 flex items-center text-xs text-teal-800 font-medium space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>承認済み：標準プロセスへの自動適用（デプロイ）が完了しました。</span>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
