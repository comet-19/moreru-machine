/**
 * Moreru Machine — Scoring & Persona Classification
 *
 * 各シナリオでの選択を累積スコアに変換し、
 * 最終的にユーザーのペルソナを判定する。
 */

import type { ScoreDelta, UserScores, ScoreTag, Persona } from '@/types';

// =============================================================================
// Score Accumulation
// =============================================================================

export const INITIAL_SCORES: UserScores = {
  social_distance: 0,
  rationality:     0,
  obedience:       0,
  chaos:           0,
};

export function applyDelta(scores: UserScores, delta: ScoreDelta): UserScores {
  return {
    social_distance: scores.social_distance + (delta.social_distance ?? 0),
    rationality:     scores.rationality     + (delta.rationality     ?? 0),
    obedience:       scores.obedience       + (delta.obedience       ?? 0),
    chaos:           scores.chaos           + (delta.chaos           ?? 0),
  };
}

// =============================================================================
// Normalization
// 最大スコアを 100 に正規化してレーダーチャート用に変換する
// =============================================================================

export function normalizeScores(scores: UserScores): UserScores {
  const values = Object.values(scores);
  const max = Math.max(...values);
  if (max === 0) return { ...INITIAL_SCORES };
  const factor = 100 / max;
  return {
    social_distance: Math.round(scores.social_distance * factor),
    rationality:     Math.round(scores.rationality     * factor),
    obedience:       Math.round(scores.obedience       * factor),
    chaos:           Math.round(scores.chaos           * factor),
  };
}

/** レーダーチャートの recharts 用データ形式に変換 */
export function toChartData(scores: UserScores): Array<{ axis: string; value: number; fullMark: number }> {
  const AXIS_LABELS: Record<ScoreTag, string> = {
    social_distance: 'ソーシャル\nディスタンス',
    rationality:     '合理性',
    obedience:       '忖度',
    chaos:           'カオス',
  };
  const normalized = normalizeScores(scores);
  return (Object.keys(AXIS_LABELS) as ScoreTag[]).map(tag => ({
    axis: AXIS_LABELS[tag],
    value: normalized[tag],
    fullMark: 100,
  }));
}

// =============================================================================
// Persona Classification
// =============================================================================

export const PERSONAS: Persona[] = [
  {
    id: 'stoic_maximizer',
    label: '孤独の最適化者',
    description:
      'あなたの行動は常に社会的距離の最大化を指向しており、' +
      '他者との接触コストをゼロに近づけようとする傾向が有意に確認された。' +
      '理論的にはナッシュ均衡解を直感的に選択している可能性がある。',
    dominantTags: ['social_distance'],
  },
  {
    id: 'cold_rational',
    label: '冷徹な期待コスト最小化エージェント',
    description:
      '衛生状態・物理的リスク・後続入場者の確率分布を無意識下で推定し、' +
      '期待効用最大化に基づく選択を繰り返している。感情的要素の寄与は有意でなかった。',
    dominantTags: ['rationality'],
  },
  {
    id: 'rule_follower',
    label: '暗黙のプロトコル遵守者',
    description:
      '明文化されていない社会規範（トイレの暗黙のプロトコル）への高い服従性が観測された。' +
      '権力勾配への適応的反応として、従順行動を採る傾向がある。',
    dominantTags: ['obedience'],
  },
  {
    id: 'chaos_agent',
    label: 'カオス散乱体',
    description:
      '通常の社会的斥力場に対して著しく低い感受性を示した。' +
      '隣接使用・不安定点選択を躊躇なく行う傾向は、' +
      '高いカオス耐性もしくは羞恥心の臨界温度上昇として解釈できる。',
    dominantTags: ['chaos'],
  },
  {
    id: 'ambivalent',
    label: '量子的曖昧者（重ね合わせ状態）',
    description:
      '全評価軸において有意な偏りが検出されなかった。' +
      'あなたの行動は測定のたびに異なる固有状態へ収束する可能性があり、' +
      '再現性の観点から追加実験が推奨される。',
    dominantTags: ['social_distance', 'rationality', 'obedience', 'chaos'],
  },
];

/**
 * スコアに基づいてペルソナを判定する。
 * 最大スコアのタグが支配的なペルソナを返す。
 * 最大が複数存在する場合は 'ambivalent' を返す。
 */
export function classifyPersona(scores: UserScores): Persona {
  const entries = Object.entries(scores) as Array<[ScoreTag, number]>;
  const maxScore = Math.max(...entries.map(([, v]) => v));

  if (maxScore === 0) {
    return PERSONAS.find(p => p.id === 'ambivalent')!;
  }

  const dominantTags = entries
    .filter(([, v]) => v === maxScore)
    .map(([tag]) => tag);

  if (dominantTags.length > 1) {
    return PERSONAS.find(p => p.id === 'ambivalent')!;
  }

  const dominant = dominantTags[0];
  return (
    PERSONAS.find(p => p.dominantTags.length === 1 && p.dominantTags[0] === dominant) ??
    PERSONAS.find(p => p.id === 'ambivalent')!
  );
}
