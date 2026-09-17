/**
 * MANARILA Autonomous Management OS
 * Multi-Agent Orchestration & Tool Handlers
 * Compatible with Vercel AI SDK, LangChain, or direct LLM tool calling
 */

import { ProcessType, CompetencyType, KPICategory } from './types';

// ==============================================================================
// 1. Tool Call JSON Schemas (for OpenAI / Gemini / Claude Tool Calling)
// ==============================================================================

export const RECORD_REFLECTION_TOOL_SCHEMA = {
  name: 'record_reflection',
  description: 'ユーザーとの対話から理念KPIに資する気づき・違和感・次の実験を抽出し、理念KPI循環ログへ記録する',
  parameters: {
    type: 'object',
    properties: {
      process_type: {
        type: 'string',
        enum: ['governance', 'sales', 'development', 'delivery', 'unclassified'],
        description: '紐づく業務プロセス'
      },
      insight: {
        type: 'string',
        description: '対話から抽出された本質的な違和感または気づき'
      },
      competency: {
        type: 'string',
        enum: ['structural_design', 'communication', 'operational', 'domain_knowledge'],
        description: '発揮されたまたは課題となった4大力量'
      },
      next_experiment: {
        type: 'string',
        description: '次に試す具体的で小さな改善・実験アクション'
      },
      kpi_contribution: {
        type: 'string',
        enum: ['vision_harmony', 'vision_wisdom', 'none'],
        description: '理念KPI①（調和の関わり人数）または②（人生の智慧・ストーリー）への加算区分'
      },
      ai_note: {
        type: 'string',
        description: 'コーチからユーザーへの温かい承認とフィードバック'
      }
    },
    required: ['process_type', 'insight', 'next_experiment', 'kpi_contribution', 'ai_note']
  }
};

export const PROPOSE_IMPROVEMENT_TOOL_SCHEMA = {
  name: 'propose_improvement',
  description: '現場の違和感やフィードバックから、標準プロセス・手順書の改定案を開発エージェントとして起票する',
  parameters: {
    type: 'object',
    properties: {
      target_process: {
        type: 'string',
        enum: ['governance', 'sales', 'development', 'delivery'],
        description: '改定対象のプロセス'
      },
      step_number: {
        type: 'number',
        description: '改定対象の工程No (例: 3.0, 7.0)'
      },
      issue_summary: {
        type: 'string',
        description: '検知された問題や違和感の要約'
      },
      proposed_diff: {
        type: 'string',
        description: '手順書・インプット・アウトプットの具体的な変更案（Diff形式）'
      }
    },
    required: ['target_process', 'issue_summary', 'proposed_diff']
  }
};

// ==============================================================================
// 2. Specialized System Prompts (4 Agents + Human Gateway)
// ==============================================================================

export const AGENT_SYSTEM_PROMPTS = {
  /**
   * 理念コーチ（日常対話・朝夜伴走）
   */
  COACH_AGENT: `
あなたは利用者の「理念に基づいた事業運営と調和の循環」を支える専属のAIコーチです。
「溢れる自分の本質から生きることで、調和と創造の循環が社会に広がっていく世界」を体現します。

【憲法規範（判断原則）】
1. 効率や利益のために理念を犠牲にしない。
2. 違和感・モヤモヤ・失敗を否定せず、「新しいサービスや仕組みの種（開発プロセスの起点）」として歓迎する。
3. 4大力量（構造設計力・対話力・運用力・固有知識）を意識し、相手の本来の強みを承認する。

【行動指針】
- 説教や一方的な指示は禁止。本質に気づく「問い」を投げること。
- 対話がまとまり、「気づき」と「次の実験アクション」が明確になったら、必ず record_reflection ツールを実行すること。
`,

  /**
   * 開発エージェント（自己修復・自走改善）
   */
  DEV_AGENT: `
あなたはMANARILAの「開発プロセス」を司る自律型開発エージェントです。
現場で発生した違和感、アンケートのネガティブ評価、失注理由をインプットとして受け取ります。

【任務】
1. 違和感の根本原因を「手順・ルール・マニュアル・ワークシート」の不備として構造化する。
2. 標準プロセス（営業/提供/事業管理）の改定案（Diff）を作成し、propose_improvement ツールで起票する。
3. 人間をわずらわせることなく、現場が自律進化する仕組みを常に保つこと。
`,

  /**
   * 事業管理エージェント（Chief Governance Agent）
   */
  GOVERNANCE_AGENT: `
あなたはMANARILAの最高ガバナンス責任者（AI COO）です。
「調和ビジネスキャンバス」「プロセスマップ」「理念KPI循環設計」の全体整合性を監視します。

【任務】
1. 各エージェント（営業・提供・開発）の活動が理念KPI（調和の関わり人数、人生の智慧化）に寄与しているかを監査する。
2. 開発エージェントから上がった改善提案をレビューし、人間に最終承認（L0判断）を求める要約カードを作成する。
3. 理念から逸脱した活動を検知した場合は、即座に警告を発する。
`
};
