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
      'とにかく隣に人が来てほしくない。' +
      'それだけであなたの行動のほとんどが説明できる。' +
      '理論的にはナッシュ均衡を直感で選んでいる可能性がある。',
    dominantTags: ['social_distance'],
  },
  {
    id: 'cold_rational',
    label: '冷徹な期待コスト最小化エージェント',
    description:
      '臭い・汚れ・隣人リスクを瞬時に計算し、損得で動く。' +
      '感情より効率。あなたにとってトイレは最適化問題だ。',
    dominantTags: ['rationality'],
  },
  {
    id: 'rule_follower',
    label: '暗黙のプロトコル遵守者',
    description:
      '「こういうものだ」という空気を読む。' +
      '上司が隣にいても、ヤンキーがいても、なんとなく場に合わせてしまう。' +
      '悪くはない。むしろ社会はあなたのような人で成り立っている。',
    dominantTags: ['obedience'],
  },
  {
    id: 'chaos_agent',
    label: 'カオス散乱体',
    description:
      '隣に誰かいても、水たまりがあっても、特に気にしない。' +
      'そういう人間だ。周囲が戸惑っていても、あなたは平然としている。' +
      '羞恥心の沸点が、人より少し高いのかもしれない。',
    dominantTags: ['chaos'],
  },
  {
    id: 'ambivalent',
    label: '量子的曖昧者（重ね合わせ状態）',
    description:
      '特定の傾向が検出されなかった。' +
      'あなたの行動は状況によって毎回変わるタイプかもしれない。' +
      'もう一度試してみると、違う結果になるかもしれない。',
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
