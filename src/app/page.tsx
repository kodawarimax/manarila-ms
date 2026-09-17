'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowRight, CornerDownLeft, Circle, GitPullRequest, Mic, Square, Loader2, Volume2 } from 'lucide-react';

export default function DashboardJournalPage() {
  const [inputText, setInputText] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Web Speech API（ブラウザ標準の音声認識）の初期化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ja-JP';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setInputText(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!speechSupported) {
      alert('お使いのブラウザは音声認識に対応していません。Google ChromeまたはSafari等でお試しください。');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start recording:', err);
      }
    }
  };

  // Reflect/Granola風のデイリーエントリーログ
  const [entries, setEntries] = useState([
    {
      id: 'entry-01',
      time: '14:30',
      author: 'human',
      content: '午後の体験セッション。相手の現状を深く傾聴したところ、単なる売上アップではなく「自分の本質と乖離した仕事を終わらせたい」という魂の願いが出てきた。対話の深度が増し、一気に信頼関係が結ばれた。',
      aiSynthesis: {
        process: 'DELIVERY',
        insight: '表面的な課題（売上）から本質的な願い（自己一致）への昇華',
        competency: 'コミュニケーション力（傾聴・深い問い）',
        kpiAward: '理念KPI①（調和した関わり）+1名',
        diffCreated: false
      }
    }
  ]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSynthesizing) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    const userEntry = inputText;
    setInputText('');
    setIsSynthesizing(true);

    setTimeout(() => {
      const isFriction = userEntry.includes('違和感') || userEntry.includes('モヤモヤ') || userEntry.includes('長すぎ') || userEntry.includes('アンケート') || userEntry.includes('迷い') || userEntry.includes('負担');

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newEntry = {
        id: `entry-${Date.now()}`,
        time: timeStr,
        author: 'human',
        content: userEntry,
        aiSynthesis: {
          process: isFriction ? 'DEVELOPMENT' : 'SALES',
          insight: isFriction 
            ? '現場の違和感を検知：手順・フォーマットが顧客体験に負荷をかけている可能性' 
            : '理念に根ざした行動：関わりを通じて調和の循環が生まれている',
          competency: isFriction ? '構造設計力（観察・違和感検知）' : 'コミュニケーション力（合意形成）',
          kpiAward: isFriction ? '理念KPI②（人生の智慧・ストーリー）+1件' : '理念KPI①（調和した関わり）+1名',
          diffCreated: isFriction
        }
      };

      setEntries(prev => [newEntry, ...prev]);
      setIsSynthesizing(false);
    }, 700);
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* 1. 最上位理念の静謐な掲示（憲法） */}
      <div className="pt-2 pb-6 border-b border-[#eeede8] space-y-3">
        <div className="flex items-center justify-between text-xs text-[#78766e]">
          <span className="font-mono tracking-wider uppercase text-[10px]">Today's Alignment</span>
          <span className="flex items-center text-teal-800 bg-teal-50 px-2 py-0.5 rounded text-[11px] font-medium border border-teal-100">
            <Circle className="w-2 h-2 fill-teal-500 text-teal-500 mr-1.5" />
            自走マネジメントシステム 循環中
          </span>
        </div>
        <h1 className="font-serif-title text-2xl sm:text-3xl text-[#1a2c26] font-bold tracking-tight leading-snug">
          溢れる自分の本質から生きることで、<br />
          調和と創造の循環が社会に広がっていく世界。
        </h1>
        <p className="text-xs sm:text-sm text-[#78766e] font-sans leading-relaxed">
          面白そう！を基点に人それぞれの理念を軸に、それを実現する循環がいくつも生まれる。
        </p>
      </div>

      {/* 2. 理念KPIミニマルカウンター */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="granola-card p-4">
          <div className="text-[11px] text-[#78766e] font-sans font-medium">① 理念と調和した関わり</div>
          <div className="text-2xl font-serif-title font-bold text-[#1a2c26] mt-1">15 <span className="text-xs font-sans text-[#9c9a92] font-normal">/ 50 名</span></div>
        </div>
        <div className="granola-card p-4">
          <div className="text-[11px] text-[#78766e] font-sans font-medium">② 人生の智慧・ストーリー</div>
          <div className="text-2xl font-serif-title font-bold text-[#1a2c26] mt-1">8 <span className="text-xs font-sans text-[#9c9a92] font-normal">/ 20 件</span></div>
        </div>
        <div className="granola-card p-4">
          <div className="text-[11px] text-[#78766e] font-sans font-medium">主要力量の発揮</div>
          <div className="text-base font-serif-title font-semibold text-[#1a2c26] mt-2">対話力 ＆ 構造設計</div>
        </div>
        <div className="granola-card p-4">
          <div className="text-[11px] text-[#78766e] font-sans font-medium">自己修復・未決Diff</div>
          <div className="text-base font-serif-title font-semibold text-amber-700 mt-2 flex items-center">
            <GitPullRequest className="w-4 h-4 mr-1.5" />
            1件 承認待ち
          </div>
        </div>
      </div>

      {/* 3. Granola風「観照エディタ（音声メモ対応）」 */}
      <div className={`granola-card p-6 border transition ${
        isRecording ? 'border-red-400 ring-2 ring-red-100 bg-red-50/20' : 'border-[#eeede8] focus-within:border-[#1a2c26]'
      }`}>
        <div className="flex items-center justify-between text-xs text-[#9c9a92] mb-3">
          <span className="font-mono flex items-center">
            {isRecording ? (
              <span className="flex items-center text-red-600 font-bold animate-pulse">
                <Volume2 className="w-4 h-4 mr-1.5" /> 音声をリアルタイム文字起こし中...（話し終えたら停止）
              </span>
            ) : (
              '今日の対話・商談・現場での違和感を音声またはテキストで残す'
            )}
          </span>

          <button
            type="button"
            onClick={toggleRecording}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
              isRecording
                ? 'bg-red-600 text-white shadow-sm hover:bg-red-700 animate-pulse'
                : 'bg-[#f4f3ef] hover:bg-[#e8e7e1] text-[#24221f]'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-3 h-3 fill-current" />
                <span>録音停止</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-teal-800" />
                <span>音声で話す</span>
              </>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isRecording ? "声を聞き取っています...話してください" : "歩きながら声で話すか、キーボードで入力してください。\n例: 「事前アンケートの設問が多すぎて、顧客が身構えてしまった気がする...」"}
            rows={3}
            className="w-full bg-transparent border-none resize-none text-sm text-[#24221f] placeholder:text-[#9c9a92] focus:outline-none leading-relaxed"
          />
          <div className="flex items-center justify-between pt-3 border-t border-[#f4f3ef]">
            <span className="text-[11px] text-[#9c9a92]">
              話した内容からAIが違和感を抽出し、手順書の改善Diffを自動起票します
            </span>
            <button
              type="submit"
              disabled={isSynthesizing || !inputText.trim()}
              className="bg-[#1a2c26] hover:bg-teal-950 disabled:opacity-40 text-[#faf9f5] px-4 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition shadow-sm"
            >
              {isSynthesizing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>結晶化中...</span>
                </>
              ) : (
                <>
                  <span>結晶化する</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 4. 循環タイムライン */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#eeede8]">
          <h2 className="font-serif-title font-bold text-base text-[#1a2c26]">
            循環の足跡（Timeline of Harmony & Wisdom）
          </h2>
          <span className="text-xs font-mono text-[#9c9a92]">Chronological Stream</span>
        </div>

        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="granola-card p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-[#9c9a92] flex items-center space-x-2">
                    <span>{entry.time}</span>
                    <span>•</span>
                    <span className="uppercase text-[10px] tracking-wider text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded">
                      {entry.aiSynthesis.process}
                    </span>
                  </div>
                  <p className="text-sm text-[#24221f] leading-relaxed pt-1">
                    {entry.content}
                  </p>
                </div>
              </div>

              <div className="bg-[#f7f6f2] rounded-lg p-4 border border-[#eeede8] text-xs text-[#525049] space-y-2 font-sans">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#78766e] uppercase tracking-wider">
                  <span className="flex items-center">
                    <Sparkles className="w-3 h-3 text-teal-600 mr-1.5" />
                    AI Synthesis & Governance
                  </span>
                  <span>{entry.aiSynthesis.competency}</span>
                </div>
                <div className="text-xs text-[#24221f] font-medium leading-relaxed">
                  {entry.aiSynthesis.insight}
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px] text-teal-800">
                  <span>✨ {entry.aiSynthesis.kpiAward}</span>
                  {entry.aiSynthesis.diffCreated && (
                    <a href="/proposals" className="text-amber-800 hover:text-amber-900 font-medium flex items-center">
                      手順書Diffが自動起票されました
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
