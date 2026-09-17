import { NextResponse } from 'next/server';
import { ManarilaAIOrchestrator } from '@/ai/orchestrator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const events = body.events;

    if (!events || events.length === 0) {
      return NextResponse.json({ status: 'ok' });
    }

    const event = events[0];
    const userMessage = event.message?.text;
    const userId = event.source?.userId;
    const replyToken = event.replyToken;

    if (!userMessage) {
      return NextResponse.json({ status: 'no_message' });
    }

    const orchestrator = new ManarilaAIOrchestrator();
    const result = await orchestrator.handleCoachDialogue(userMessage, userId);

    console.log(`[LINE Webhook] Handled dialogue for user ${userId}:`, result.reply.slice(0, 50));

    return NextResponse.json({
      status: 'success',
      replyToken,
      replyText: result.reply,
      recordedLog: result.recordedLog,
      autoProposalTriggered: result.autoProposalTriggered
    });
  } catch (error: any) {
    console.error('[LINE Webhook Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
