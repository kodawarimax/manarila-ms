import { getDb } from '../db/client';
import { randomUUID } from 'crypto';
import { ProcessType, CompetencyType, KPICategory } from '../types';

export interface RecordReflectionArgs {
  process_type: ProcessType;
  insight: string;
  competency?: CompetencyType;
  next_experiment: string;
  kpi_contribution: KPICategory | 'none';
  ai_note: string;
  raw_input?: string;
  user_id?: string;
  org_id?: string;
}

export interface ProposeImprovementArgs {
  target_process: ProcessType;
  step_number?: number;
  issue_summary: string;
  proposed_diff: string;
  source_reflection_id?: string;
  org_id?: string;
}

export function executeRecordReflection(args: RecordReflectionArgs) {
  const db = getDb();
  const orgId = args.org_id || 'org-manarila-main';
  const userId = args.user_id || 'usr-founder-001';
  const logId = 'log-' + randomUUID().slice(0, 8);

  const kpiCat = args.kpi_contribution === 'none' ? null : args.kpi_contribution;

  db.prepare(`
    INSERT INTO reflection_logs (
      id, organization_id, user_id, process_type, raw_user_input, insight, competency, next_experiment, kpi_category, ai_feedback, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    logId,
    orgId,
    userId,
    args.process_type || 'unclassified',
    args.raw_input || args.insight,
    args.insight,
    args.competency || 'structural_design',
    args.next_experiment,
    kpiCat,
    args.ai_note,
    'open'
  );

  // 理念KPIにカウントされる場合、kpi_recordsにも加算登録
  if (kpiCat) {
    const kpiDef = db.prepare(`SELECT id FROM kpi_definitions WHERE organization_id = ? AND category = ?`).get(orgId, kpiCat) as { id: string } | undefined;
    if (kpiDef) {
      db.prepare(`
        INSERT INTO kpi_records (id, organization_id, kpi_definition_id, user_id, value, context_note, source_reference_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run('rec-' + randomUUID().slice(0, 8), orgId, kpiDef.id, userId, 1.0, args.insight, logId);
    }
  }

  return { success: true, logId, kpiCounted: Boolean(kpiCat) };
}

export function executeProposeImprovement(args: ProposeImprovementArgs) {
  const db = getDb();
  const orgId = args.org_id || 'org-manarila-main';
  const propId = 'prop-' + randomUUID().slice(0, 8);

  db.prepare(`
    INSERT INTO service_improvement_proposals (
      id, organization_id, source_reflection_id, target_process, step_number, issue_summary, proposed_diff, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    propId,
    orgId,
    args.source_reflection_id || null,
    args.target_process,
    args.step_number || null,
    args.issue_summary,
    args.proposed_diff,
    'pending_human_review'
  );

  return { success: true, proposalId: propId, status: 'pending_human_review' };
}
