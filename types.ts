/**
 * MANARILA Autonomous Management OS
 * Core Domain TypeScript Type Definitions
 */

export type ProcessType = 'governance' | 'sales' | 'development' | 'delivery' | 'unclassified';

export type CompetencyType = 
  | 'structural_design'   // 構造設計力 (本質抽出, 構造化, KPI設計, 関係把握)
  | 'communication'       // コミュニケーション力 (対話, 傾聴, 問い, 提案, 合意形成)
  | 'operational'         // 運用力 (情報整理, 条件確認, 引継ぎ, 版管理, 抜け漏れ確認)
  | 'domain_knowledge';   // 固有知識 (QMS, コーチング, 心理学, AI/科学技術)

export type KPICategory = 
  | 'vision_harmony'      // 理念KPI①: 理念と調和し循環すると感じた関わり (人数)
  | 'vision_wisdom'       // 理念KPI②: 人生を懸けた創造物の一部となるもの (智慧やストーリー)
  | 'process_lead'        // プロセス先行指標
  | 'process_lag';        // プロセス遅行指標

export type ExecutorType = 'human' | 'ai' | 'human_ai';

export interface BusinessCanvas {
  id: string;
  organizationId: string;
  vision: string;
  targetCustomer: string;
  coreValue: string;
  coreActivities: string;
  resourcesHuman: {
    structuralDesign: string[];
    communication: string[];
    operational: string[];
    domainKnowledge: string[];
  };
  resourcesMaterial: string[];
  guidingPrinciples: string[];
  revenueModel: string;
  version: number;
  isActive: boolean;
}

export interface StandardProcessStep {
  id: string;
  organizationId: string;
  processType: ProcessType;
  stepNumber: number; // 1.0, 2.0, etc.
  stepName: string;
  inputData: string;
  activityDescription: string;
  outputData: string;
  recordFormat: string;
  recordIdRef?: string; // R01, R02, etc.
  requiredCompetencies: string[];
  executor: ExecutorType;
}

export interface ReflectionLogEntry {
  id: string;
  organizationId: string;
  userId: string;
  processType: ProcessType;
  rawUserInput: string;
  insight: string;             // 違和感・気づき
  competency?: CompetencyType; // 発揮力量
  nextExperiment: string;      // 次の実験・改善アクション
  kpiCategory?: KPICategory;   // 理念KPIへの貢献
  aiFeedback?: string;
  status: 'open' | 'experimenting' | 'resolved' | 'converted_to_wisdom';
  createdAt: string;
}

export interface ServiceImprovementProposal {
  id: string;
  organizationId: string;
  sourceReflectionId?: string;
  targetProcess: ProcessType;
  stepNumber?: number;
  issueSummary: string;
  proposedDiff: string;        // 改善案（手順書・マニュアル等の変更差分）
  status: 'pending_human_review' | 'approved' | 'rejected' | 'deployed';
  approvedBy?: string;
  approvedAt?: string;
}

export interface AgentTask {
  id: string;
  organizationId: string;
  agentType: 'governance_agent' | 'sales_agent' | 'delivery_agent' | 'dev_agent';
  taskName: string;
  payload: Record<string, unknown>;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'waiting_human';
  result?: Record<string, unknown>;
  errorMessage?: string;
}
