'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import type { UserScores, ScoreTag } from '@/types';
import { normalizeScores, classifyPersona, INITIAL_SCORES } from '@/lib/scoring';
import ScoreRadarChart from '@/components/result/RadarChart';

const SCORE_LABELS: Record<ScoreTag, { label: string; color: string; bar: string }> = {
  social_distance: { label: 'ソーシャルディスタンス', color: 'text-sky-400',   bar: 'bg-sky-500' },
  rationality:     { label: '合理性',                 color: 'text-green-400', bar: 'bg-green-500' },
  obedience:       { label: '忖度',                   color: 'text-amber-400', bar: 'bg-amber-500' },
  chaos:           { label: 'カオス耐性',             color: 'text-red-400',   bar: 'bg-red-500' },
};

function ResultContent() {
  const params = useSearchParams();
  const raw = params.get('scores');

  let scores: UserScores = INITIAL_SCORES;
  try {
    if (raw) scores = JSON.parse(raw) as UserScores;
  } catch {
    // fallback to zeros
  }

  const normalized = normalizeScores(scores);
  const persona = classifyPersona(scores);

  return (
    <main className="min-h-screen bg-black text-zinc-300 flex flex-col items-center px-4 py-10">
      <div className="max-w-lg w-full flex flex-col gap-8">

        {/* ヘッダー */}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
            Experimental Result
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            行動傾向分析レポート
          </h1>
          <p className="text-xs font-mono text-zinc-600">
            Laboratory for Lavatory Decision Science — Final Report
          </p>
        </div>

        <div className="border-t border-zinc-800" />

        {/* レーダーチャート */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-6 flex flex-col gap-2">
          <p className="text-xs font-mono text-zinc-500 mb-2">▸ 4軸スコアマップ（正規化済み）</p>
          <ScoreRadarChart scores={scores} />
        </div>

        {/* スコアバー */}
        <div className="flex flex-col gap-3">
          {(Object.keys(SCORE_LABELS) as ScoreTag[]).map((tag) => {
            const { label, color, bar } = SCORE_LABELS[tag];
            const value = normalized[tag];
            return (
              <div key={tag} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className={color}>{label}</span>
                  <span className="text-zinc-500">{value}</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded">
                  <div
                    className={`h-1.5 rounded transition-all duration-700 ${bar}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-zinc-800" />

        {/* ペルソナ判定 */}
        <div className="flex flex-col gap-3 border border-zinc-700 rounded-lg px-5 py-5 bg-zinc-950">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            Persona Classification
          </p>
          <h2 className="text-xl font-bold text-white">
            {persona.label}
          </h2>
          <p className="text-sm text-zinc-400 leading-7">
            {persona.description}
          </p>
          <div className="flex gap-2 flex-wrap mt-1">
            {persona.dominantTags.map((tag) => (
              <span
                key={tag}
                className={`text-xs font-mono px-2 py-0.5 rounded border border-zinc-700 ${SCORE_LABELS[tag].color}`}
              >
                {SCORE_LABELS[tag].label}
              </span>
            ))}
          </div>
        </div>

        {/* 生スコア（折りたたみ風） */}
        <div className="border border-zinc-900 rounded px-4 py-3 bg-zinc-950 font-mono text-xs text-zinc-600">
          <p className="text-zinc-500 mb-2">▸ 生スコア（正規化前）</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            {(Object.keys(SCORE_LABELS) as ScoreTag[]).map((tag) => (
              <p key={tag}>
                <span className={SCORE_LABELS[tag].color}>{tag}</span>: {scores[tag]}
              </p>
            ))}
          </div>
        </div>

        {/* リトライ */}
        <div className="flex flex-col gap-3">
          <Link
            href="/experiment"
            className="w-full text-center py-3 rounded border border-zinc-600 bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 hover:border-zinc-400 transition-all duration-150"
          >
            再実験する →
          </Link>
          <Link
            href="/"
            className="w-full text-center py-2 text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            トップに戻る
          </Link>
        </div>

      </div>
    </main>
  );
}

// useSearchParams は Suspense が必要
export default function ResultPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-600 font-mono text-sm">解析中...</p>
      </main>
    }>
      <ResultContent />
    </Suspense>
  );
}
