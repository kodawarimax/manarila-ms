/**
 * MANARILA Autonomous Management OS
 * LINE Autonomous Push Delivery Worker (Morning Tuning & Evening Recovery)
 */

import { getDb } from '../db/client';

export type PushType = 'morning' | 'evening';

export async function executeLinePush(type: PushType, customUserId?: string) {
  const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const targetUserId = customUserId || process.env.LINE_TARGET_USER_ID;

  // メッセージ文面の生成（MANARILAの理念憲法に基づく問い）
  let pushMessage = '';

  if (type === 'morning') {
    pushMessage = `🌿【MANARILA 朝の意図設定】
おはようございます！

今日の予定の中で、理念KPI①「理念と調和し循環すると感じた関わり」を意識したい対話や出会いはありますか？

無理な売り込みや妥協ではなく、あなたの本質と相手の願いが調和するポイントを1つ決めてみましょう。

（※このLINEにそのまま声やテキストで返信すると、循環ジャーナルへ自動記録されます）`;
  } else {
    pushMessage = `🌙【MANARILA 夜の違和感・智慧回収】
今日1日、本当にお疲れ様でした。

今日現場や商談で感じた「小さな違和感・モヤモヤ」や「嬉しかったこと」はありましたか？

違和感は、新しいサービスや仕組みを進化させる『開発プロセスの種』です。
忘れないうちに、歩きながらの音声メモや1行テキストで教えてくださいね。`;
  }

  console.log(`[Push Dispatcher] Triggering ${type.toUpperCase()} push notification...`);

  if (!lineToken || !targetUserId) {
    console.warn(`[Push Dispatcher - DryRun] LINE_CHANNEL_ACCESS_TOKEN or LINE_TARGET_USER_ID is not configured in environment.`);
    console.log(`Message Preview:\n${pushMessage}`);
    return {
      status: 'simulated_success',
      type,
      message: pushMessage,
      note: 'To send actual LINE push, set LINE_CHANNEL_ACCESS_TOKEN and LINE_TARGET_USER_ID in .env'
    };
  }

  // 実際のLINE Messaging API Push Endpoint呼び出し
  const url = 'https://api.line.me/v2/bot/message/push';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${lineToken}`
    },
    body: JSON.stringify({
      to: targetUserId,
      messages: [{ type: 'text', text: pushMessage }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('[Push Dispatcher Error] LINE API failed:', errText);
    throw new Error(`LINE Push failed: ${errText}`);
  }

  console.log(`✅ [Push Dispatcher] Successfully sent ${type} push to ${targetUserId}`);
  return { status: 'delivered', type, targetUserId };
}

// CLI実行用
if (require.main === module) {
  const arg = process.argv[2] as PushType || 'morning';
  executeLinePush(arg).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
