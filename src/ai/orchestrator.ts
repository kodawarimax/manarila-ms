import { getDb } from '../db/client';
import { buildCoachSystemPrompt, DEV_AGENT_SYSTEM_PROMPT } from './prompts';
import { executeRecordReflection, executeProposeImprovement, RecordReflectionArgs } from './tools';
import { BusinessCanvas, StandardProcessStep, ReflectionLogEntry, ServiceImprovementProposal } from '../types';

export class ManarilaAIOrchestrator {
  private orgId: string;

  constructor(orgId = 'org-manarila-main') {
    this.orgId = orgId;
  }

  /**
   * データベースから最新の調和キャンバスと標準プロセスを取得
   */
  public getContext() {
    const db = getDb();
    const canvasRaw = db.prepare(`SELECT * FROM business_canvases WHERE organization_id = ? AND is_active = 1`).get(this.orgId) as any;
    
    if (!canvasRaw) throw new Error('Active canvas not found for org');

    const canvas: BusinessCanvas = {
      ...canvasRaw,
      resourcesHuman: JSON.parse(canvasRaw.resources_human),
      resourcesMaterial: JSON.parse(canvasRaw.resources_material),
      guidingPrinciples: JSON.parse(canvasRaw.guiding_principles),
      isActive: Boolean(canvasRaw.is_active)
    };

    const processesRaw = db.prepare(`SELECT * FROM standard_processes WHERE organization_id = ? ORDER BY process_type, step_number ASC`).all(this.orgId) as any[];

    const processes: StandardProcessStep[] = processesRaw.map(p => ({
      id: p.id,
      organizationId: p.organization_id,
      processType: p.process_type,
      stepNumber: p.step_number,
      stepName: p.step_name,
      inputData: p.input_data,
      activityDescription: p.activity_description,
      outputData: p.output_data,
      recordFormat: p.record_format,
      recordIdRef: p.record_id_ref,
      requiredCompetencies: p.required_competencies,
      executor: p.executor
    }));

    return { canvas, processes };
  }

  /**
   * 理念コーチング対話の処理（LLMまたはインテリジェント・エミュレータ）
   */
  public async handleCoachDialogue(userInput: string, userId = 'usr-founder-001'): Promise<{
    reply: string;
    recordedLog?: any;
    autoProposalTriggered?: boolean;
  }> {
    const { canvas, processes } = this.getContext();
    const systemPrompt = buildCoachSystemPrompt(canvas, processes);

    // ルールベース＋スマート推論による違和感・気づき・アクションの抽出
    const isReflection = userInput.includes('違和感') || 
                         userInput.includes('気づき') || 
                         userInput.includes('モヤモヤ') || 
                         userInput.includes('課題') || 
                         userInput.includes('試してみる') ||
                         userInput.includes('改善') ||
                         userInput.includes('共感') ||
                         userInput.length > 20;

    let recordedLog: any = null;
    let replyText = '';

    if (isReflection) {
      let targetProcess: any = 'unclassified';
      if (userInput.includes('営業') || userInput.includes('商談') || userInput.includes('提案') || userInput.includes('集客')) targetProcess = 'sales';
      else if (userInput.includes('提供') || userInput.includes('セッション') || userInput.includes('アンケート') || userInput.includes('顧客')) targetProcess = 'delivery';
      else if (userInput.includes('開発') || userInput.includes('改善') || userInput.includes('手順') || userInput.includes('ワーク')) targetProcess = 'development';
      else if (userInput.includes('事業') || userInput.includes('理念') || userInput.includes('全体')) targetProcess = 'governance';

      const isWisdom = userInput.includes('智慧') || userInput.includes('学び') || userInput.includes('ストーリー') || userInput.includes('気づき');
      const isHarmony = userInput.includes('共鳴') || userInput.includes('共感') || userInput.includes('出会い') || userInput.includes('成約');

      let kpiType: any = 'none';
      if (isHarmony) kpiType = 'vision_harmony';
      else if (isWisdom) kpiType = 'vision_wisdom';

      const logArgs: RecordReflectionArgs = {
        process_type: targetProcess,
        insight: userInput,
        competency: targetProcess === 'delivery' ? 'communication' : 'structural_design',
        next_experiment: `「${userInput.slice(0, 30)}...」に対する小さな検証と改善を行う`,
        kpi_contribution: kpiType,
        ai_note: '違和感をそのままにせず、自走改善のエネルギーとして受け止めました。',
        raw_input: userInput,
        user_id: userId,
        org_id: this.orgId
      };

      recordedLog = executeRecordReflection(logArgs);

      replyText = `お話しいただきありがとうございます！
「${userInput}」というお話の中に、とても大切な気づき・違和感がありましたね。

【MANARILA理念との調和】
この出来事は、単なる業務の成否ではなく、あなたの理念である『調和と創造の循環』に向けた確かな一歩（智慧）です。

📝 **循環ログに記録しました**
・プロセス：${targetProcess.toUpperCase()}
・発揮力量：${logArgs.competency}
・次の小さな実験：${logArgs.next_experiment}`;

      if (recordedLog.kpiCounted) {
        replyText += `\n✨ **理念KPI（${kpiType === 'vision_harmony' ? '①調和の関わり人数' : '②人生の創造物となる智慧'}）にカウントされました！**`;
      }

      // もしネガティブな違和感・課題であれば、開発エージェントを自動起動して改善案を起票
      let autoProposalTriggered = false;
      if (userInput.includes('難しすぎ') || userInput.includes('離脱') || userInput.includes('クレーム') || userInput.includes('長すぎ') || userInput.includes('違和感')) {
        this.triggerSelfHealingLoop(userInput, targetProcess, recordedLog.logId);
        autoProposalTriggered = true;
        replyText += `\n\n🔧 **【開発エージェントが自走しました】**
現場の違和感を検知し、標準プロセスの改善案（Diff）を起票しました。管理画面の「改善提案」から承認（L0確認）してください。`;
      }

      return { reply: replyText, recordedLog, autoProposalTriggered };

    } else {
      replyText = `こんにちは！今日の活動で、あなたの理念『${canvas.vision.slice(0, 35)}...』に沿って、意識したい出会いや対話はありますか？どんな小さなモヤモヤでも壁打ちしてくださいね。`;
      return { reply: replyText };
    }
  }

  /**
   * 自己修復ループ（開発エージェントが違和感から手順書Diffを自動起票）
   */
  public triggerSelfHealingLoop(issueText: string, targetProcess: any, sourceLogId?: string) {
    const diffText = `--- a/standard_process_${targetProcess}.md
+++ b/standard_process_${targetProcess}.md
@@ -10,4 +10,4 @@
- 事前準備・アンケートを全項目詳細に入力してもらう（負担大）
+ 事前アンケートを必須3問に厳選し、対話セッション内での引き出しを重視する（負担軽減と対話深度の両立）
`;

    return executeProposeImprovement({
      target_process: targetProcess === 'unclassified' ? 'delivery' : targetProcess,
      step_number: targetProcess === 'delivery' ? 3.0 : 1.0,
      issue_summary: `【違和感からの自律改善】${issueText.slice(0, 60)}`,
      proposed_diff: diffText,
      source_reflection_id: sourceLogId,
      org_id: this.orgId
    });
  }

  /**
   * 人間による改善提案の承認（L0判断）と標準プロセスの自動更新
   */
  public approveProposal(proposalId: string, approverId = 'usr-founder-001') {
    const db = getDb();
    const proposal = db.prepare(`SELECT * FROM service_improvement_proposals WHERE id = ?`).get(proposalId) as any;
    if (!proposal) throw new Error('Proposal not found');

    // 1. ステータスを approved に更新
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE service_improvement_proposals 
      SET status = 'approved', approved_by = ?, approved_at = ?
      WHERE id = ?
    `).run(approverId, now, proposalId);

    // 2. 標準プロセスを自動更新（自己修復デプロイ完了）
    if (proposal.target_process && proposal.step_number) {
      db.prepare(`
        UPDATE standard_processes
        SET activity_description = activity_description || ' [改善済: ' || ? || ']',
            updated_at = ?
        WHERE organization_id = ? AND process_type = ? AND step_number = ?
      `).run(proposal.issue_summary.slice(0, 30), now, this.orgId, proposal.target_process, proposal.step_number);
    }

    return { success: true, proposalId, deployedAt: now };
  }
}
