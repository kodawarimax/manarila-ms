import { NextResponse } from 'next/server';
import { getDb } from '@/db/client';
import { ManarilaAIOrchestrator } from '@/ai/orchestrator';

export async function GET() {
  try {
    const db = getDb();
    const proposals = db.prepare(`
      SELECT p.*, r.insight, r.raw_user_input
      FROM service_improvement_proposals p
      LEFT JOIN reflection_logs r ON p.source_reflection_id = r.id
      ORDER BY p.created_at DESC
    `).all();

    return NextResponse.json({ proposals });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { proposalId, action, userId } = body;

    if (!proposalId || !action) {
      return NextResponse.json({ error: 'proposalId and action are required' }, { status: 400 });
    }

    const orchestrator = new ManarilaAIOrchestrator();

    if (action === 'approve') {
      const result = orchestrator.approveProposal(proposalId, userId || 'usr-founder-001');
      return NextResponse.json(result);
    } else if (action === 'reject') {
      const db = getDb();
      db.prepare(`UPDATE service_improvement_proposals SET status = 'rejected' WHERE id = ?`).run(proposalId);
      return NextResponse.json({ success: true, status: 'rejected' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
