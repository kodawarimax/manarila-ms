import { ManarilaAIOrchestrator } from '../src/ai/orchestrator';
import { getDb, initSchema } from '../src/db/client';
import { seedDatabase } from '../src/db/seed';

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 Starting MANARILA OS End-to-End Verification Tests');
  console.log('====================================================');

  // 1. Reset and seed DB
  seedDatabase();
  const orchestrator = new ManarilaAIOrchestrator();

  // Test 1: Context Loading
  console.log('\n[TEST 1] Testing Business Context Retrieval (L1 & L4)...');
  const context = orchestrator.getContext();
  if (!context.canvas || !context.canvas.vision.includes('調和と創造の循環')) {
    throw new Error('TEST 1 FAILED: Invalid canvas context');
  }
  if (context.processes.length < 15) {
    throw new Error(`TEST 1 FAILED: Expected at least 15 processes, got ${context.processes.length}`);
  }
  console.log(`✅ [TEST 1 PASSED] Loaded Canvas and ${context.processes.length} standard processes.`);

  // Test 2: AI Coach Dialogue & KPI Reflection Logging
  console.log('\n[TEST 2] Testing AI Coach Dialogue & KPI Log Recording...');
  const dialogueInput = '新しいクライアントと体験セッションを実施した。理念への深い共鳴があり、相互に大きな気づきと智慧が得られた！';
  const dialogueResult = await orchestrator.handleCoachDialogue(dialogueInput);

  if (!dialogueResult.recordedLog || !dialogueResult.recordedLog.success) {
    throw new Error('TEST 2 FAILED: Reflection log was not recorded');
  }

  const db = getDb();
  const savedLog = db.prepare(`SELECT * FROM reflection_logs WHERE id = ?`).get(dialogueResult.recordedLog.logId) as any;
  if (!savedLog || !savedLog.insight.includes('共鳴')) {
    throw new Error('TEST 2 FAILED: Saved reflection log mismatch');
  }
  console.log(`✅ [TEST 2 PASSED] Dialogue handled and logged as ID: ${savedLog.id} (KPI category: ${savedLog.kpi_category})`);

  // Test 3: Self-Healing Loop (Dev Agent auto-proposing Diff upon friction)
  console.log('\n[TEST 3] Testing Self-Healing Loop (Friction -> Dev Agent Proposal)...');
  const frictionInput = '提供フローの事前アンケートが長すぎて顧客が離脱しかけたという深刻な違和感・課題があった。';
  const frictionResult = await orchestrator.handleCoachDialogue(frictionInput);

  if (!frictionResult.autoProposalTriggered) {
    throw new Error('TEST 3 FAILED: Self-healing loop was not triggered on friction');
  }

  const latestProposal = db.prepare(`SELECT * FROM service_improvement_proposals WHERE status = 'pending_human_review' ORDER BY created_at DESC`).get() as any;
  if (!latestProposal || !latestProposal.proposed_diff.includes('--- a/standard_process_')) {
    throw new Error('TEST 3 FAILED: Improvement proposal with Diff was not created');
  }
  console.log(`✅ [TEST 3 PASSED] Dev Agent created Proposal ID: ${latestProposal.id}`);
  console.log(`   Issue Summary: ${latestProposal.issue_summary}`);

  // Test 4: Human-in-the-Loop L0 Approval & Process Auto-Deployment
  console.log('\n[TEST 4] Testing Human L0 Approval & Standard Process Auto-Deployment...');
  const approvalResult = orchestrator.approveProposal(latestProposal.id, 'usr-founder-001');

  if (!approvalResult.success) {
    throw new Error('TEST 4 FAILED: Proposal approval failed');
  }

  const updatedProposal = db.prepare(`SELECT * FROM service_improvement_proposals WHERE id = ?`).get(latestProposal.id) as any;
  if (updatedProposal.status !== 'approved') {
    throw new Error('TEST 4 FAILED: Proposal status is not approved');
  }

  const updatedProcess = db.prepare(`SELECT * FROM standard_processes WHERE process_type = ? AND step_number = ?`).get(latestProposal.target_process, latestProposal.step_number) as any;
  if (!updatedProcess.activity_description.includes('[改善済:')) {
    throw new Error('TEST 4 FAILED: Standard process was not updated with improvement');
  }
  console.log(`✅ [TEST 4 PASSED] Proposal approved by human and deployed to standard process step: ${updatedProcess.step_name}`);

  console.log('\n====================================================');
  console.log('🎉 ALL 4 CORE VERIFICATION TESTS PASSED SUCCESSFULLY!');
  console.log('====================================================\n');
}

runTestSuite().catch(err => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
