import { NextResponse } from 'next/server';
import { ManarilaAIOrchestrator } from '@/ai/orchestrator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, userId, orgId } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const orchestrator = new ManarilaAIOrchestrator(orgId || 'org-manarila-main');
    const result = await orchestrator.handleCoachDialogue(message, userId || 'usr-founder-001');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Coach API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orchestrator = new ManarilaAIOrchestrator();
    const context = orchestrator.getContext();
    return NextResponse.json(context);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
