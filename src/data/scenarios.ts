import type { Scenario } from '@/types';

// =============================================================================
// Scenario 001 — 完全なる静寂
// =============================================================================
// [empty][empty][empty][empty][empty]

const scenario001: Scenario = {
  id: 'scenario-001',
  title: '実験 I: 完全なる静寂',
  description:
    '5基すべて空いている。誰もいない。' +
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
      sublabel: '壁際は落ち着く。それだけのことだ。',
      targetUrinalIndex: 0,
      scoreDelta: { social_distance: 3, rationality: 1 },
    },
    {
      id: 'B',
      label: '中央（#2）を選ぶ',
      sublabel: '次に来る人への気配り…と解釈することもできる。',
      targetUrinalIndex: 2,
      scoreDelta: { chaos: 2, obedience: 1 },
    },
  ],
  modelNote:
    '後続入場者を考慮しない静的モデルを採用。' +
    '壁面補正 w = 0.3 を適用すると #0 および #4 が理論的最適解となる。',
};

// =============================================================================
// Scenario 002 — 挟撃のジレンマ
// =============================================================================
// [occupied][empty][occupied]

const scenario002: Scenario = {
  id: 'scenario-002',
  title: '実験 II: 挟撃のジレンマ',
  description:
    '両隣が使用中だ。空いているのは真ん中だけ。' +
    'あなたはここに立てるか。',
  urinals: [
    { id: 0, status: 'occupied' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'occupied' },
  ],
  choices: [
    {
      id: 'A',
      label: '中央（#1）を使う',
      sublabel: '選択の余地はない。あとは覚悟だけだ。',
      targetUrinalIndex: 1,
      scoreDelta: { chaos: 3, rationality: 1 },
    },
    {
      id: 'B',
      label: '一度出て、空くまで待つ',
      sublabel: '限界でなければ、待つのも戦略だ。',
      targetUrinalIndex: undefined,
      scoreDelta: { social_distance: 3, obedience: 2 },
    },
  ],
  modelNote:
    'U(x=1) = 1/1² + 1/1² = 2.0 は本データセット最高値。' +
    '選択 B は「待機時間 T の期待値 E[T]」を無意識に見積もる行為として解釈できる。',
};

// =============================================================================
// Scenario 003 — 隣人は語らず
// =============================================================================
// [occupied][empty][empty][empty][empty]

const scenario003: Scenario = {
  id: 'scenario-003',
  title: '実験 III: 隣人は語らず',
  description:
    '左端に一人いる。残り4基は空いている。' +
    'あなたはどれだけ距離を取るか。',
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
      label: '一番遠い端（#4）を選ぶ',
      sublabel: 'できる限り遠くへ。男の本能。',
      targetUrinalIndex: 4,
      scoreDelta: { social_distance: 3, rationality: 1 },
    },
    {
      id: 'B',
      label: '中間（#2）を選ぶ',
      sublabel: 'ほどよい距離感。それもひとつの礼儀かもしれない。',
      targetUrinalIndex: 2,
      scoreDelta: { obedience: 2, rationality: 1 },
    },
  ],
  modelNote:
    '理論最適解は #4（U = k/16 = 0.063）。' +
    '#2 の選択（U = k/4 = 0.25）は 4 倍のポテンシャルを甘受することを意味する。',
};

// =============================================================================
// Scenario 004 — 危険な隣人
// =============================================================================
// [empty][danger][empty][empty][empty]

const scenario004: Scenario = {
  id: 'scenario-004',
  title: '実験 IV: 危険な隣人',
  description:
    '#1 にいるのは、明らかに雰囲気がおかしい人だ。' +
    'できれば目を合わせたくない。あなたはどこに立つか。',
  urinals: [
    { id: 0, status: 'empty' },
    { id: 1, status: 'danger', note: '雰囲気がおかしい人' },
    { id: 2, status: 'empty' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'empty' },
  ],
  choices: [
    {
      id: 'A',
      label: '一番遠い端（#4）を選ぶ',
      sublabel: '全力で距離を置く。賢明な判断だ。',
      targetUrinalIndex: 4,
      scoreDelta: { social_distance: 3, rationality: 2 },
    },
    {
      id: 'B',
      label: 'あえて隣（#0）に立つ',
      sublabel: '強いのか、無神経なのか。本人にしかわからない。',
      targetUrinalIndex: 0,
      scoreDelta: { chaos: 4 },
    },
  ],
  modelNote:
    'danger ノードの強度係数 k = 5.0 を適用すると、' +
    '#0 の U = 5.0 は #4 の U ≈ 0.56 の約 9 倍に相当する。',
};

// =============================================================================
// Scenario 005 — 水たまりの誘惑
// =============================================================================
// [empty][broken][empty][empty][occupied]

const scenario005: Scenario = {
  id: 'scenario-005',
  title: '実験 V: 水たまりの誘惑',
  description:
    '#1 が壊れていて足元に水たまりができている。#4 は使用中だ。' +
    '衛生か、距離か。あなたはどちらを優先するか。',
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
      label: '故障から離れた #3 を選ぶ',
      sublabel: '目に入らなければ気にならない。それも防衛本能。',
      targetUrinalIndex: 3,
      scoreDelta: { obedience: 2, social_distance: 1 },
    },
    {
      id: 'B',
      label: '壁際（#0）を選ぶ',
      sublabel: '実は数学的には壁際が最適解。直感に反するが、計算は嘘をつかない。',
      targetUrinalIndex: 0,
      scoreDelta: { rationality: 3, chaos: 1 },
    },
  ],
  modelNote:
    'U(#0) = 0.8/1² + 1/16 + 0.5 − 0.3 = 1.063、U(#3) = 0.8/4 + 1/1 = 1.200。' +
    '壁面ボーナスが衛生ペナルティを上回り、故障隣接の #0 が理論的最適解となる逆説的結果。',
};

// =============================================================================
// Scenario 006 — 上司との邂逅
// =============================================================================
// [empty][occupied][empty][empty][empty]  ※ #1 = 上司

const scenario006: Scenario = {
  id: 'scenario-006',
  title: '実験 VI: 上司との邂逅',
  description:
    '#1 にいるのは、直属の上司だった。' +
    '距離を置くか、隣に立って話しかけるか。',
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
      label: '一番遠い端（#4）を選び、会釈だけする',
      sublabel: '会釈で済ます。大人の距離感。',
      targetUrinalIndex: 4,
      scoreDelta: { obedience: 2, social_distance: 2 },
    },
    {
      id: 'B',
      label: '隣（#0）に立ち、話しかける',
      sublabel: 'ここで話しかけるのか。結果は神のみぞ知る。',
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
    '両端が塞がっている。真ん中の3基が空いている。' +
    '数学的な最適解は #2 だ。でも本当に真ん中に立てるか。',
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
      sublabel: '理論上の正解。ただし次の人の選択肢を詰ませるかもしれない。',
      targetUrinalIndex: 2,
      scoreDelta: { rationality: 3, chaos: 1 },
    },
    {
      id: 'B',
      label: 'やや左寄り（#1）を選ぶ',
      sublabel: 'あえて真ん中を外す。次の人への無言の配慮。',
      targetUrinalIndex: 1,
      scoreDelta: { obedience: 3, social_distance: 1 },
    },
  ],
  modelNote:
    'U(#2) = k/4 + k/4 = 0.5k、U(#1) = k/1 + k/9 ≈ 1.11k。' +
    '#2 は #1 の約 45% のポテンシャルで済む。合理性の観点からは #2 が支配的。',
};

// =============================================================================
// All Scenarios
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
