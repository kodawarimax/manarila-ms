import { initSchema } from './client';
import { randomUUID } from 'crypto';

export function seedDatabase() {
  const db = initSchema();

  const orgId = 'org-manarila-main';
  const userId = 'usr-founder-001';

  // 1. Insert Org & User
  db.prepare(`
    INSERT OR REPLACE INTO organizations (id, name, slug, plan)
    VALUES (?, ?, ?, ?)
  `).run(orgId, 'MANARILA 組織', 'manarila', 'enterprise');

  db.prepare(`
    INSERT OR REPLACE INTO users (id, organization_id, email, full_name, role, line_user_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(userId, orgId, 'founder@manarila.com', 'MANARILA 創業者', 'owner', 'U1234567890abcdef');

  // 2. Insert 調和ビジネスキャンバス (L1)
  const humanResources = JSON.stringify({
    structuralDesign: ['本質抽出', '意味判断', '構造化', '関係把握', 'KPI設計', '観察・評価', '改善・再設計'],
    communication: ['顧客理解', '傾聴', '問い', '説明', '文章化', '提案', '合意形成', '初期対応'],
    operational: ['情報整理・管理', '条件確認', '引継ぎ', '抜け漏れ確認', 'データ管理', '版管理'],
    domainKnowledge: ['QMS (品質マネジメント)', '心理・コーチング', 'AI・科学技術', '会計・事務']
  });

  const materialResources = JSON.stringify([
    'PC・スマホ・タブレット・書斎',
    'Zoom / クラウドデータ / 生成AI (Claude / Gemini)',
    '業務手順・フォーマット・説明資料・ワーク体系'
  ]);

  const principles = JSON.stringify([
    '心理学・コーチング・スピリチュアル等共通構造理論（持論）',
    '理念起点の循環構造理論',
    '誠実さ・謙虚さ（適正な自己・他者評価の認識を意識すること）',
    '生じた違和感を放置せず、開発プロセスの改善種として扱う'
  ]);

  db.prepare(`
    INSERT OR REPLACE INTO business_canvases (
      id, organization_id, vision, target_customer, core_value, core_activities,
      resources_human, resources_material, guiding_principles, revenue_model, version, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'canvas-manarila-001',
    orgId,
    '溢れる自分の本質から生きることで、調和と創造の循環が社会に広がっていく世界\n→ 面白そう！を基点に人それぞれの理念を軸に、それを実現する循環がいくつも生まれる。それらが調和と共創を起こし、また次の循環へつながっていく世界。',
    '自らの本質から事業を営み、社会と調和した循環を生み出したい個人起業家・中小企業経営者',
    '理念と日々の実務が完全に直結した「最小マネジメントシステム（MS）」の設計・伴走と自走化支援',
    'サービスの提供 / コンテンツ開発 / コミュニティ活動 / 営業・発信活動',
    humanResources,
    materialResources,
    principles,
    '個別セッション伴走支援 / 最小マネジメントシステム設計・導入 / 継続サポート / コミュニティ',
    1,
    1
  );

  // 3. Insert 標準プロセス (営業・開発・提供・事業管理: L4)
  const processes = [
    // 事業管理
    { type: 'governance', no: 1.0, name: '調和ビジネスキャンバス 作成・レビュー', in: '理念・ゴール / 事業情報一式', act: '理念・理念KPIを含む事業全体を設計／レビューする', out: '調和ビジネスキャンバス（更新）', fmt: '調和ビジネスキャンバス', ref: 'R_CANVAS', comp: '構造設計力（本質抽出・全体構造化・意味判断）', exec: 'human_ai' },
    { type: 'governance', no: 2.0, name: 'プロセスマップ 作成・レビュー', in: '調和ビジネスキャンバス（更新）', act: '主要プロセスと相互関係・境界を整理／レビューする', out: 'プロセスマップ（更新）', fmt: 'プロセスマップ', ref: 'R_PROCESS', comp: '構造設計力（プロセス思考・構造化・関係把握）', exec: 'human_ai' },
    { type: 'governance', no: 3.0, name: '理念KPI循環設計 作成・レビュー', in: 'キャンバス＋プロセスマップ', act: '理念KPIが各活動でどう進むかを整理しズレ・実験を設計', out: '理念KPI循環設計（更新）', fmt: '理念KPI循環設計', ref: 'R_CYCLE', comp: '構造設計力（KPI設計・仮説化・ズレ検知・全体整合）', exec: 'human_ai' },
    { type: 'governance', no: 4.0, name: '展開', in: '3つの上位成果物＋レビュー結果', act: '必要な目標・課題・改善事項を該当プロセスへ展開する', out: '各プロセスへの展開事項', fmt: '該当する正本', ref: 'R_DEPLOY', comp: '構造設計力（優先判断） コミュニケーション力（伝達）', exec: 'human_ai' },
    
    // 営業
    { type: 'sales', no: 1.0, name: '認知・流入', in: '事業管理レビュー結果', act: '発信・紹介・交流を通じて対象顧客との接点をつくる', out: '見込み顧客との接点・反応', fmt: '顧客管理／発信媒体', ref: 'R01', comp: '構造設計力（発信設計） コミュニケーション力（顧客理解）', exec: 'human_ai' },
    { type: 'sales', no: 2.0, name: '引き合い', in: '問い合わせ／紹介情報', act: '相談内容・連絡先・次アクションに必要な情報を確認する', out: '顧客情報（初期）', fmt: '顧客管理', ref: 'R01', comp: 'コミュニケーション力（傾聴） 運用力（情報整理）', exec: 'human_ai' },
    { type: 'sales', no: 3.0, name: '初期対話・ヒアリング', in: '顧客情報（初期）', act: '相手の状況・目的とMANARILAとの適合を確認する', out: '顧客情報（更新）', fmt: '面談記録／顧客管理', ref: 'R01', comp: 'コミュニケーション力（傾聴・問い） 構造設計力（適合判断）', exec: 'human_ai' },
    { type: 'sales', no: 4.0, name: '提案・案内', in: '顧客情報（更新）＋事業案内資料', act: '必要に応じてサービス内容・進め方・価格を案内する', out: '提案内容／意思確認結果', fmt: 'サービス資料／送付文', ref: 'R01', comp: '構造設計力（提案設計） コミュニケーション力（説明）', exec: 'human_ai' },
    { type: 'sales', no: 5.0, name: '条件確認・受注', in: '提案内容／意思確認結果', act: '実施内容・料金・日程を確認し受注条件を確定する', out: '受注情報（確定）', fmt: '顧客管理／申込情報', ref: 'R01', comp: 'コミュニケーション力（合意形成） 運用力（条件確認）', exec: 'human' },
    { type: 'sales', no: 6.0, name: '提供へ引継ぎ', in: '受注情報（確定）＋顧客情報', act: '顧客情報・受注内容・必要事項を提供プロセスへ渡す', out: '提供用顧客情報', fmt: '顧客管理／顧客フォルダ', ref: 'R01', comp: '運用力（情報管理・引継ぎ・抜け漏れ確認）', exec: 'ai' },

    // 開発
    { type: 'development', no: 1.0, name: '開発起点の収集', in: '顧客からの結果・現場の違和感', act: '違和感・モヤモヤ・課題を拾い集めて整理する', out: '開発テーマ候補・違和感一覧', fmt: '開発管理／違和感ログ', ref: 'R_DEV_LOG', comp: '構造設計力（観察・違和感検知） 運用力（情報整理）', exec: 'human_ai' },
    { type: 'development', no: 2.0, name: 'テーマ・課題設定', in: '違和感一覧', act: 'どの違和感を優先して仕組みやサービスの改善に繋げるか設定', out: '開発テーマ定義', fmt: '開発テーマシート', ref: 'R_DEV_THEME', comp: '構造設計力（課題設定・抽象化・優先判断）', exec: 'human_ai' },
    { type: 'development', no: 3.0, name: '試作設計', in: '開発テーマ定義', act: '改善されたサービス・手順書・ワークシートを設計する', out: '試作設計書（Diff案）', fmt: '試作ドキュメント', ref: 'R_DEV_DIFF', comp: '構造設計力（品質設計・構造化）', exec: 'ai' },
    { type: 'development', no: 4.0, name: '標準化・反映', in: '検証完了した試作', act: '本番の標準プロセス・マニュアルへ反映・更新する', out: '改定版標準手順書', fmt: '標準プロセスシート', ref: 'R_PROCESS', comp: '構造設計力（標準化） 運用力（版管理）', exec: 'human_ai' },

    // 提供
    { type: 'delivery', no: 1.0, name: '受注確認・顧客登録', in: '提供用顧客情報', act: '顧客情報を登録し顧客別フォルダと正本を作成する', out: '顧客登録完了・専用フォルダ', fmt: '顧客台帳／Google Drive', ref: 'R01', comp: '運用力（データ管理・顧客識別・命名規則）', exec: 'ai' },
    { type: 'delivery', no: 2.0, name: '案内・日程調整', in: '顧客登録情報', act: '事前案内と日程調整リンクを送付する', out: '案内送付・日程候補', fmt: '連絡チャネル／メール', ref: 'R01', comp: 'コミュニケーション力（文章化・対外伝達）', exec: 'human_ai' },
    { type: 'delivery', no: 3.0, name: '事前アンケート', in: '顧客情報', act: '事前ヒアリングフォームを配信・回収する', out: '事前アンケート回答', fmt: 'Google Forms', ref: 'R05', comp: '運用力（フォーム運用・本人確認）', exec: 'ai' },
    { type: 'delivery', no: 4.0, name: 'セッション準備', in: '事前アンケート回答', act: '回答を要約しキャンバス素案を作成する', out: 'セッション準備資料', fmt: '顧客作業ファイル', ref: 'R02', comp: '運用力（情報整理） 構造設計力（構造理解）', exec: 'ai' },
    { type: 'delivery', no: 5.0, name: 'セッション実施', in: '準備資料＋顧客との対話', act: '理念と事業の調和を対話・構造化し価値を届ける', out: '調和キャンバス（顧客版）＋議事録', fmt: '顧客キャンバス／面談記録', ref: 'R02', comp: 'コミュニケーション力（傾聴・問い） 構造設計力（設計）', exec: 'human' },
    { type: 'delivery', no: 6.0, name: '事後アンケート・フォロー', in: 'セッション完了', act: '事後アンケート取得・気づき集約・アフターフォロー', out: '事後フィードバック・智慧ログ', fmt: 'アンケート／理念KPIログ', ref: 'R05', comp: 'コミュニケーション力（顧客フォロー） 運用力（データ取得）', exec: 'human_ai' }
  ];

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO standard_processes (
      id, organization_id, process_type, step_number, step_name, input_data,
      activity_description, output_data, record_format, record_id_ref, required_competencies, executor
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of processes) {
    stmt.run(
      `proc-${p.type}-${p.no.toFixed(1)}`,
      orgId,
      p.type,
      p.no,
      p.name,
      p.in,
      p.act,
      p.out,
      p.fmt,
      p.ref,
      p.comp,
      p.exec
    );
  }

  // 4. Insert 理念KPI 定義 (L3)
  const kpis = [
    { id: 'kpi-harmony', cat: 'vision_harmony', name: '① 理念と調和し循環すると感じた関わり', desc: '理念に共鳴し、相互に良いエネルギーが循環した顧客・パートナーの人数', unit: '名', target: 50 },
    { id: 'kpi-wisdom', cat: 'vision_wisdom', name: '② 人生を懸けた創造物の一部となる智慧・ストーリー', desc: '現場の違和感や挑戦から言語化・結晶化された知見や物語の数', unit: '件', target: 20 }
  ];

  const kpiStmt = db.prepare(`
    INSERT OR REPLACE INTO kpi_definitions (id, organization_id, category, name, description, unit, target_value)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const k of kpis) {
    kpiStmt.run(k.id, orgId, k.cat, k.name, k.desc, k.unit, k.target);
  }

  // 5. Initial Sample Logs
  db.prepare(`
    INSERT OR REPLACE INTO reflection_logs (
      id, organization_id, user_id, process_type, raw_user_input, insight, competency, next_experiment, kpi_category, ai_feedback, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'log-sample-001',
    orgId,
    userId,
    'sales',
    '体験会で理念の話を熱く語ったら、参加者がすごく共感してくれて個別相談を申し込んでくれた！',
    '理念そのものをオープンに語ることが、最も純度の高い共鳴顧客を引き寄せる',
    'structural_design',
    '次回体験会の案内文にも、小手先のノウハウではなく理念ストーリーを冒頭に配置してみる',
    'vision_harmony',
    '素晴らしい調和の循環ですね！理念KPI①に+1カウントしました。',
    'experimenting'
  );

  console.log('✅ MANARILA Database successfully initialized and seeded!');
}

if (require.main === module) {
  seedDatabase();
}
