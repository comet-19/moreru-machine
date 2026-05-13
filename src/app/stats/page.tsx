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
    supabase.from('answers').select('scenario_id, target_urinal_index'),
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

  // シナリオ別 選択分布（便器インデックスごと）
  const scenarioChoiceCounts: Record<string, Record<number, number>> = {};
  answers?.forEach((a) => {
    if (!scenarioChoiceCounts[a.scenario_id]) scenarioChoiceCounts[a.scenario_id] = {};
    const idx = a.target_urinal_index as number;
    scenarioChoiceCounts[a.scenario_id][idx] = (scenarioChoiceCounts[a.scenario_id][idx] ?? 0) + 1;
  });

  return { total, scoreAverages, personaCounts, scenarioChoiceCounts };
}

export default async function StatsPage() {
  const { total, scoreAverages, personaCounts, scenarioChoiceCounts } = await fetchStats();

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

            {/* シナリオ別選択分布 */}
            <section className="flex flex-col gap-5">
              <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                ▸ シナリオ別 選択分布
              </h2>
              {SCENARIOS.map((scenario) => {
                const counts = scenarioChoiceCounts[scenario.id] ?? {};
                const sc_total = Object.values(counts).reduce((s, n) => s + n, 0);
                return (
                  <div key={scenario.id} className="flex flex-col gap-2">
                    <p className="text-xs text-zinc-400">{scenario.title}</p>
                    <div className="flex flex-col gap-1">
                      {scenario.urinalChoices.map((choice) => {
                        const n = counts[choice.targetUrinalIndex] ?? 0;
                        const pct = sc_total > 0 ? Math.round((n / sc_total) * 100) : 0;
                        return (
                          <div key={choice.targetUrinalIndex} className="flex items-center gap-2">
                            <span className="text-xs font-mono text-zinc-500 w-5 text-right">#{choice.targetUrinalIndex}</span>
                            <div className="flex-1 h-3 bg-zinc-800 rounded overflow-hidden">
                              <div
                                className="h-full bg-zinc-500 rounded transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs font-mono text-zinc-600 w-8 text-right">{pct}%</span>
                          </div>
                        );
                      })}
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
