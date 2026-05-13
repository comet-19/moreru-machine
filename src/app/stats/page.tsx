import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { SCENARIOS } from '@/data/scenarios';
import { PERSONAS } from '@/lib/scoring';
import type { ScoreTag } from '@/types';

// ページは毎回最新データを取得する（キャッシュなし）
export const revalidate = 0;

const SCORE_LABELS: Record<ScoreTag, { label: string; color: string; bar: string }> = {
  social_distance: { label: 'ソーシャルディスタンス', color: 'text-sky-400',  bar: 'bg-sky-500' },
  rationality:     { label: '合理性',                 color: 'text-green-400', bar: 'bg-green-500' },
  obedience:       { label: '忖度',                   color: 'text-amber-400', bar: 'bg-amber-500' },
  chaos:           { label: 'カオス耐性',             color: 'text-red-400',   bar: 'bg-red-500' },
};

async function fetchStats() {
  const [{ data: sessions }, { data: answers }] = await Promise.all([
    supabase.from('sessions').select('social_distance, rationality, obedience, chaos, persona_id'),
    supabase.from('answers').select('scenario_id, choice_id'),
  ]);

  const total = sessions?.length ?? 0;

  // スコア平均
  const scoreAverages: Record<ScoreTag, number> = {
    social_distance: 0, rationality: 0, obedience: 0, chaos: 0,
  };
  if (total > 0 && sessions) {
    for (const s of sessions) {
      scoreAverages.social_distance += s.social_distance;
      scoreAverages.rationality     += s.rationality;
      scoreAverages.obedience       += s.obedience;
      scoreAverages.chaos           += s.chaos;
    }
    for (const tag of Object.keys(scoreAverages) as ScoreTag[]) {
      scoreAverages[tag] = Math.round((scoreAverages[tag] / total) * 10) / 10;
    }
  }

  // ペルソナ分布
  const personaCounts: Record<string, number> = {};
  sessions?.forEach((s) => {
    personaCounts[s.persona_id] = (personaCounts[s.persona_id] ?? 0) + 1;
  });

  // シナリオ別 A/B
  const scenarioCounts: Record<string, { A: number; B: number }> = {};
  answers?.forEach((a) => {
    if (!scenarioCounts[a.scenario_id]) scenarioCounts[a.scenario_id] = { A: 0, B: 0 };
    const choiceId = a.choice_id as 'A' | 'B';
    if (choiceId === 'A' || choiceId === 'B') {
      scenarioCounts[a.scenario_id][choiceId]++;
    }
  });

  return { total, scoreAverages, personaCounts, scenarioCounts };
}

export default async function StatsPage() {
  const { total, scoreAverages, personaCounts, scenarioCounts } = await fetchStats();

  const maxScore = Math.max(...Object.values(scoreAverages));

  return (
    <main className="min-h-screen bg-black text-zinc-300 flex flex-col items-center px-4 py-10">
      <div className="max-w-lg w-full flex flex-col gap-8">

        {/* ヘッダー */}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
            Aggregate Statistics
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            みんなの結果
          </h1>
          <p className="text-xs font-mono text-zinc-600">
            全 {total} セッションの集計データ
          </p>
        </div>

        <div className="border-t border-zinc-800" />

        {total === 0 ? (
          <p className="text-sm text-zinc-600 font-mono">まだデータがありません。</p>
        ) : (
          <>
            {/* スコア平均 */}
            <section className="flex flex-col gap-3">
              <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                ▸ 平均スコア
              </h2>
              {(Object.keys(SCORE_LABELS) as ScoreTag[]).map((tag) => {
                const { label, color, bar } = SCORE_LABELS[tag];
                const value = scoreAverages[tag];
                const pct = maxScore > 0 ? (value / maxScore) * 100 : 0;
                return (
                  <div key={tag} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className={color}>{label}</span>
                      <span className="text-zinc-500">{value}</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded">
                      <div className={`h-1.5 rounded ${bar}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </section>

            <div className="border-t border-zinc-800" />

            {/* ペルソナ分布 */}
            <section className="flex flex-col gap-3">
              <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                ▸ ペルソナ分布
              </h2>
              {PERSONAS.map((persona) => {
                const count = personaCounts[persona.id] ?? 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={persona.id} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-300">{persona.label}</span>
                      <span className="text-zinc-500">{count}人 ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded">
                      <div className="h-1.5 rounded bg-zinc-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </section>

            <div className="border-t border-zinc-800" />

            {/* シナリオ別選択率 */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                ▸ シナリオ別 A/B 選択率
              </h2>
              {SCENARIOS.map((scenario) => {
                const counts = scenarioCounts[scenario.id] ?? { A: 0, B: 0 };
                const total_sc = counts.A + counts.B;
                const pctA = total_sc > 0 ? Math.round((counts.A / total_sc) * 100) : 50;
                const pctB = 100 - pctA;
                return (
                  <div key={scenario.id} className="flex flex-col gap-2">
                    <p className="text-xs text-zinc-400">{scenario.title}</p>
                    <div className="flex gap-1 items-center">
                      {/* A バー */}
                      <span className="text-xs font-mono text-sky-400 w-6 text-right">A</span>
                      <div className="flex-1 h-4 bg-zinc-800 rounded overflow-hidden flex">
                        <div className="h-full bg-sky-700 flex items-center justify-end pr-1 transition-all"
                          style={{ width: `${pctA}%` }}>
                          {pctA >= 15 && (
                            <span className="text-xs text-sky-200 font-mono">{pctA}%</span>
                          )}
                        </div>
                        <div className="h-full bg-amber-700 flex items-center justify-start pl-1 flex-1 transition-all">
                          {pctB >= 15 && (
                            <span className="text-xs text-amber-200 font-mono">{pctB}%</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-mono text-amber-400 w-6">B</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono text-zinc-600 px-7">
                      <span>{scenario.choices[0].label}</span>
                      <span>{scenario.choices[1].label}</span>
                    </div>
                  </div>
                );
              })}
            </section>
          </>
        )}

        <div className="border-t border-zinc-800" />

        <div className="flex flex-col gap-2">
          <Link
            href="/experiment"
            className="w-full text-center py-3 rounded border border-zinc-600 bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 hover:border-zinc-400 transition-all duration-150"
          >
            実験に参加する →
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
