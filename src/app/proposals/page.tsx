'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle, XCircle, ArrowRight, GitCommit } from 'lucide-react';

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProposals = () => {
    setIsLoading(true);
    fetch('/api/proposals')
      .then(res => res.json())
      .then(data => {
        setProposals(data.proposals || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const handleAction = async (proposalId: string, action: 'approve' | 'reject') => {
    try {
      await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId, action })
      });
      loadProposals();
    } catch (err) {
      alert('エラーが発生しました');
    }
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

      {isLoading ? (
        <div className="text-center py-12 text-slate-500 text-sm">読み込み中...</div>
      ) : proposals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <CheckCircle className="w-10 h-10 text-teal-500 mx-auto" />
          <h3 className="font-bold text-slate-800">未承認の改善提案はありません</h3>
          <p className="text-xs text-slate-500">
            現場で違和感や課題が発生すると、開発エージェントが自動で手順書の改定案をここに起票します。
          </p>
        </div>
      ) : (
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
                    {p.status === 'pending_human_review' ? '承認待ち (Pending L0)' : p.status}
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
                    onClick={() => handleAction(p.id, 'reject')}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex items-center"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1.5" />
                    却下する
                  </button>
                  <button
                    onClick={() => handleAction(p.id, 'approve')}
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
      )}
    </div>
  );
}
