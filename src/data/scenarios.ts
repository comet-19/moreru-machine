/**
 * Moreru Machine — Scenario Dataset
 *
 * 全シナリオを定義する。各シナリオは以下の原則に従って設計されている：
 * 1. 2択であること（Moral Machine 準拠）
 * 2. いずれの選択肢も一定の合理性を持つこと（正解なし）
 * 3. 選択がスコアタグに反映されること
 */

import type { Scenario } from '@/types';

// =============================================================================
// Scenario 001 — 完全なる静寂
// =============================================================================
// [empty][empty][empty][empty][empty]

const scenario001: Scenario = {
  id: 'scenario-001',
  title: '実験 I: 完全なる静寂',
  description:
    '5基の小便器はすべて空である。外部からの社会的拘束力はゼロ、' +
    'すなわち純粋な内部選好のみが意思決定を規定するケースである。' +
    'あなたはどこに立つか。',
  urinals: [
    { id: 0, status: 'empty' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'empty' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'empty' },
  ],
  choices: [
    {
      id: 'A',
      label: '端（#0）を選ぶ',
      sublabel: '境界条件による自由度の固定。壁面を背景とした安定点への収束。',
      targetUrinalIndex: 0,
      scoreDelta: { social_distance: 3, rationality: 1 },
    },
    {
      id: 'B',
      label: '中央（#2）を選ぶ',
      sublabel: '対称性の破れを自ら担う。後続入場者へのコスト分散を意図した可能性がある。',
      targetUrinalIndex: 2,
      scoreDelta: { chaos: 2, obedience: 1 },
    },
  ],
  modelNote:
    '本問では後続入場者を考慮しない静的モデルを採用する。' +
    '壁面補正 w = 0.3 を適用した場合、#0 および #4 が理論的最適解となる。',
};

// =============================================================================
// Scenario 002 — 挟撃のジレンマ
// =============================================================================
// [occupied][empty][occupied]

const scenario002: Scenario = {
  id: 'scenario-002',
  title: '実験 II: 挟撃のジレンマ',
  description:
    '3基の小便器のうち両端2基はすでに使用中であり、' +
    '利用可能な空間は中央 #1 のみである。' +
    '左右対称な斥力場の中、あなたは中央のポテンシャル極大点に立てるか。',
  urinals: [
    { id: 0, status: 'occupied' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'occupied' },
  ],
  choices: [
    {
      id: 'A',
      label: '中央（#1）を使用する',
      sublabel:
        '両側斥力の等値点への自発的移行。' +
        'エントロピー的観点からは最も高コストな状態の受容。',
      targetUrinalIndex: 1,
      scoreDelta: { chaos: 3, rationality: 1 },
    },
    {
      id: 'B',
      label: '一度退出し、空くまで待機する',
      sublabel:
        '現状の位相空間からの離脱。' +
        '生理的コストと時間コストのトレードオフを無意識に推定している。',
      targetUrinalIndex: undefined,
      scoreDelta: { social_distance: 3, obedience: 2 },
    },
  ],
  modelNote:
    '気まずさポテンシャル U(x=1) = 2k（k=1.0）は本データセット最高値を記録する。' +
    '選択 B は「待機時間 T の期待値 E[T]」を暗黙に見積もる行為として解釈できる。',
};

// =============================================================================
// Scenario 003 — 隣人は語らず
// =============================================================================
// [occupied][empty][empty][empty][empty]

const scenario003: Scenario = {
  id: 'scenario-003',
  title: '実験 III: 隣人は語らず',
  description:
    '5基中、左端 #0 のみが占有されている。' +
    '単一の斥力源が生成する非対称ポテンシャル場において、' +
    'あなたはどの程度の距離を確保しようとするか。',
  urinals: [
    { id: 0, status: 'occupied' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'empty' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'empty' },
  ],
  choices: [
    {
      id: 'A',
      label: '対角端（#4）を選ぶ',
      sublabel:
        '斥力源から最大距離点への移動。' +
        '社会的距離最大化戦略の純粋形。',
      targetUrinalIndex: 4,
      scoreDelta: { social_distance: 3, rationality: 1 },
    },
    {
      id: 'B',
      label: '中間（#2）を選ぶ',
      sublabel:
        '斥力源との距離は中程度。後続入場者への占有シグナル送信を兼ねた選択か。',
      targetUrinalIndex: 2,
      scoreDelta: { obedience: 2, rationality: 1 },
    },
  ],
  modelNote:
    '単一占有源モデルにおける理論最適解は #4（U=k/16）であり、' +
    '#2 の選択（U=k/4）は 4 倍のポテンシャルを甘受することを意味する。',
};

// =============================================================================
// Scenario 004 — 危険な隣人
// =============================================================================
// [empty][danger][empty][empty][empty]

const scenario004: Scenario = {
  id: 'scenario-004',
  title: '実験 IV: 危険な隣人',
  description:
    '5基中 #1 に「威圧的な先客」が存在する。' +
    '当該ノードの強度係数 k=5.0 は通常占有の5倍であり、' +
    'その非線形斥力場は隣接点 #0, #2 において急峻なポテンシャル急上昇を引き起こす。',
  urinals: [
    { id: 0, status: 'empty' },
    { id: 1, status: 'danger', note: '威圧的な先客' },
    { id: 2, status: 'empty' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'empty' },
  ],
  choices: [
    {
      id: 'A',
      label: '対角端（#4）を選ぶ',
      sublabel:
        '危険源から最遠点。壁面補正も加わり理論上の最安定点。',
      targetUrinalIndex: 4,
      scoreDelta: { social_distance: 3, rationality: 2 },
    },
    {
      id: 'B',
      label: 'あえて隣接（#0）に立つ',
      sublabel:
        'ポテンシャル极大点への自発的移動。' +
        '無関心の表明か、あるいは確信犯的カオス戦略か。',
      targetUrinalIndex: 0,
      scoreDelta: { chaos: 4 },
    },
  ],
  modelNote:
    'danger ノードの強度係数 k=5.0 を適用した場合、' +
    '#0 における U = 5.0/1² = 5.0 は #4 の U ≈ 5.0/9 ≈ 0.56 の約9倍に相当する。',
};

// =============================================================================
// Scenario 005 — 水たまりの誘惑
// =============================================================================
// [empty][broken][empty][empty][occupied]

const scenario005: Scenario = {
  id: 'scenario-005',
  title: '実験 V: 水たまりの誘惑',
  description:
    '5基中 #1 が「故障・水たまり」状態、#4 が使用中である。' +
    '故障ノードは弱い斥力（k=0.8）に加えて隣接衛生ペナルティを発生させる。' +
    'あなたは衛生コストと社会的距離のどちらを優先するか。',
  urinals: [
    { id: 0, status: 'empty' },
    { id: 1, status: 'broken', note: '故障・水たまり' },
    { id: 2, status: 'empty' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'occupied' },
  ],
  choices: [
    {
      id: 'A',
      label: '故障から遠い #3 を選ぶ',
      sublabel:
        '直感的には合理的に見える選択。' +
        '故障便器を視界に収めず、精神的安定を優先する経験的戦略。',
      targetUrinalIndex: 3,
      scoreDelta: { obedience: 2, social_distance: 1 },
    },
    {
      id: 'B',
      label: '壁際（#0）を選ぶ',
      sublabel:
        '計算上の最適解。壁面安定化ボーナス(−0.3)が衛生ペナルティ(+0.5)を ' +
        '部分的に相殺し、U(#0)=1.063 < U(#3)=1.200 となる。数学は直感を裏切る。',
      targetUrinalIndex: 0,
      scoreDelta: { rationality: 3, chaos: 1 },
    },
  ],
  modelNote:
    'U(#0) = 0.8/1² + 1/4² + 0.5 − 0.3 = 1.063、' +
    'U(#3) = 0.8/4 + 1/1² = 1.200。' +
    '壁面ボーナスが衛生コストを上回り、故障隣接の #0 が理論的最適解となる逆説的結果。',
};

// =============================================================================
// Scenario 006 — 上司との邂逅
// =============================================================================
// [empty][occupied][empty][empty][empty]  ※ #1 = 上司

const scenario006: Scenario = {
  id: 'scenario-006',
  title: '実験 VI: 上司との邂逅',
  description:
    '先客 #1 が自身の直属の上司であると判明した。' +
    '通常の社会的斥力場に加え、権力勾配が新たなポテンシャル項として作用する。' +
    'あなたは距離を取るか、あえて隣接して会話の機会を得るか。',
  urinals: [
    { id: 0, status: 'empty' },
    { id: 1, status: 'occupied', note: '直属の上司' },
    { id: 2, status: 'empty' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'empty' },
  ],
  choices: [
    {
      id: 'A',
      label: '最遠端（#4）を選び、会釈だけする',
      sublabel:
        '権力勾配への適応的回避。物理的距離を確保しつつ最低限の礼節を維持する戦略。',
      targetUrinalIndex: 4,
      scoreDelta: { obedience: 2, social_distance: 2 },
    },
    {
      id: 'B',
      label: '隣接（#0）に立ち、自然な会話を試みる',
      sublabel:
        '権力ノードへの意図的接近。社会的ネットワーク強化コストとして ' +
        'U=k/1² を支払う戦略。結果は不定。',
      targetUrinalIndex: 0,
      scoreDelta: { obedience: 3, chaos: 1 },
    },
  ],
  modelNote:
    '本問では「権力補正係数 p」を標準モデルに追加することが考えられるが、' +
    '個人差が大きいため定量化は困難であり、定性的シナリオとして扱う。',
};

// =============================================================================
// Scenario 007 — 鏡の法則
// =============================================================================
// [occupied][empty][empty][empty][occupied]

const scenario007: Scenario = {
  id: 'scenario-007',
  title: '実験 VII: 鏡の法則',
  description:
    '両端 #0 と #4 が占有されており、中間の3基が空いている。' +
    '左右対称なポテンシャル場において、理論上の最適解は中央 #2 である。' +
    'だがあなたは本当に中央を選べるか。',
  urinals: [
    { id: 0, status: 'occupied' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'empty' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'occupied' },
  ],
  choices: [
    {
      id: 'A',
      label: '中央（#2）を選ぶ',
      sublabel:
        '両側斥力の等距離点。ポテンシャル場の理論的対称解。' +
        'しかし後続入場者を詰まらせる「棘」となる可能性がある。',
      targetUrinalIndex: 2,
      scoreDelta: { rationality: 3, chaos: 1 },
    },
    {
      id: 'B',
      label: 'やや左寄り（#1）を選ぶ',
      sublabel:
        '対称性の自発的破れ。非合理だが「次の人のために #3 を残す」' +
        'という他者配慮的行動として解釈できる。',
      targetUrinalIndex: 1,
      scoreDelta: { obedience: 3, social_distance: 1 },
    },
  ],
  modelNote:
    'U(#2) = k/4 + k/4 = k/2、U(#1) = k/1 + k/9 ≈ 1.11k。' +
    '#2 は #1 の約45%のポテンシャルで済む。合理性の観点からは #2 が支配的。',
};

// =============================================================================
// All Scenarios（ランダマイズ用エクスポート）
// =============================================================================

export const SCENARIOS: Scenario[] = [
  scenario001,
  scenario002,
  scenario003,
  scenario004,
  scenario005,
  scenario006,
  scenario007,
];

export {
  scenario001,
  scenario002,
  scenario003,
  scenario004,
  scenario005,
  scenario006,
  scenario007,
};
