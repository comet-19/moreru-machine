import type { Scenario } from '@/types';

// =============================================================================
// Scenario 001 — 完全なる静寂
// [empty][empty][empty][empty][empty]  入口←左
// =============================================================================
const scenario001: Scenario = {
  id: 'scenario-001',
  title: '実験 I: 完全なる静寂',
  description: '5基すべて空いている。誰もいない。入口は左側だ。あなたはどこに立つか。',
  entrance: 'left',
  urinals: [
    { id: 0, status: 'empty' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'empty' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'empty' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 0, sublabel: '壁あり。入口に最も近い。', scoreDelta: { obedience: 2 } },
    { targetUrinalIndex: 1, sublabel: '入口から2番目。', scoreDelta: { obedience: 1 } },
    { targetUrinalIndex: 2, sublabel: '中央。', scoreDelta: { chaos: 2 } },
    { targetUrinalIndex: 3, sublabel: '入口から4番目。', scoreDelta: { social_distance: 1, obedience: 1 } },
    { targetUrinalIndex: 4, sublabel: '壁あり。入口から最も遠い。', scoreDelta: { social_distance: 3, rationality: 1 } },
  ],
  modelNote: '壁面補正 w = 0.3 を適用すると #4 が最小ポテンシャル点。入口近接ペナルティを加味した場合も同様。',
};

// =============================================================================
// Scenario 002 — 隣人は語らず
// [occupied][empty][empty][empty][empty]  入口←左
// =============================================================================
const scenario002: Scenario = {
  id: 'scenario-002',
  title: '実験 II: 隣人は語らず',
  description: '左端に一人いる。入口もそちら側だ。あなたはどれだけ距離を取るか。',
  entrance: 'left',
  urinals: [
    { id: 0, status: 'occupied' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'empty' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'empty' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 1, sublabel: '#0（使用中）に隣接。入口から2番目。', scoreDelta: { chaos: 3 } },
    { targetUrinalIndex: 2, sublabel: '#0（使用中）から2基。', scoreDelta: { chaos: 1, obedience: 1 } },
    { targetUrinalIndex: 3, sublabel: '#0（使用中）から3基。', scoreDelta: { obedience: 2, social_distance: 1 } },
    { targetUrinalIndex: 4, sublabel: '壁あり。#0（使用中）から4基。', scoreDelta: { social_distance: 3, rationality: 1 } },
  ],
  modelNote: 'U(#1) = k/1² = 1.0、U(#4) = k/16 = 0.06。#4 が理論最適解。',
};

// =============================================================================
// Scenario 003 — 障害者用の誘惑
// [occupied][empty][accessible_empty][empty][occupied]  入口←右
// =============================================================================
const scenario003: Scenario = {
  id: 'scenario-003',
  title: '実験 III: 障害者用の誘惑',
  description: '両端が使用中で、中央には障害者用便器がある。両隣の #1 と #3 も空いている。あなたはどこに立つか。',
  entrance: 'right',
  urinals: [
    { id: 0, status: 'occupied' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'empty', type: 'accessible' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'occupied' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 1, sublabel: '#0（使用中）に隣接。入口から4番目。', scoreDelta: { social_distance: 1, obedience: 1 } },
    { targetUrinalIndex: 2, sublabel: '障害者用。#1と#3の間。', scoreDelta: { chaos: 2, rationality: 1 } },
    { targetUrinalIndex: 3, sublabel: '#4（使用中）に隣接。入口から2番目。', scoreDelta: { obedience: 2 } },
  ],
  modelNote: '障害者用便器の使用可否は状況依存。本モデルでは必要な人が来た際のコストを chaos に反映する。',
};

// =============================================================================
// Scenario 004 — 子供用の壁
// [empty][occupied][child_empty][occupied][empty]  入口←左
// =============================================================================
const scenario004: Scenario = {
  id: 'scenario-004',
  title: '実験 IV: 子供用の壁',
  description: '両隣が使用中で、間には子供用便器がある。両端にも空きがある。どこに立つか。',
  entrance: 'left',
  urinals: [
    { id: 0, status: 'empty' },
    { id: 1, status: 'occupied' },
    { id: 2, status: 'empty', type: 'child' },
    { id: 3, status: 'occupied' },
    { id: 4, status: 'empty' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 0, sublabel: '壁あり。入口に最も近い。#1（使用中）に隣接。', scoreDelta: { obedience: 2, chaos: 1 } },
    { targetUrinalIndex: 2, sublabel: '子供用。#1と#3（使用中）の間。', scoreDelta: { chaos: 4 } },
    { targetUrinalIndex: 4, sublabel: '壁あり。入口から最も遠い。#3（使用中）に隣接。', scoreDelta: { social_distance: 3, rationality: 2 } },
  ],
  modelNote: '#2 は子供用ペナルティ + 両側斥力の合計で本データセット最高ポテンシャル。#4 が唯一の低コスト安定点。',
};

// =============================================================================
// Scenario 005 — 上司との邂逅
// [empty][empty][occupied_boss][empty][empty]  入口←左
// =============================================================================
const scenario005: Scenario = {
  id: 'scenario-005',
  title: '実験 V: 上司との邂逅',
  description: '中央にいるのは直属の上司だった。入口は左側。あなたはどこに立つか。',
  entrance: 'left',
  urinals: [
    { id: 0, status: 'empty' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'occupied', note: '直属の上司' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'empty' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 0, sublabel: '壁あり。入口に最も近い。#2（上司）から2基。', scoreDelta: { social_distance: 2, chaos: 1 } },
    { targetUrinalIndex: 1, sublabel: '#2（上司）に隣接。左側。', scoreDelta: { obedience: 3 } },
    { targetUrinalIndex: 3, sublabel: '#2（上司）に隣接。右側。入口から3番目。', scoreDelta: { obedience: 2, chaos: 1 } },
    { targetUrinalIndex: 4, sublabel: '壁あり。#2（上司）から2基。入口から最も遠い。', scoreDelta: { social_distance: 3, obedience: 1 } },
  ],
  modelNote: '本問では「権力補正係数 p」の追加が考えられるが、個人差が大きく定量化は困難なため定性的扱いとする。',
};

// =============================================================================
// Scenario 006 — 鏡の法則
// [occupied][empty][empty][empty][occupied]  入口←右
// =============================================================================
const scenario006: Scenario = {
  id: 'scenario-006',
  title: '実験 VI: 鏡の法則',
  description: '両端が使用中。入口は右側だ。中間の3基が空いている。どこに立つか。',
  entrance: 'right',
  urinals: [
    { id: 0, status: 'occupied' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'empty' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'occupied' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 1, sublabel: '#0（使用中）に隣接。#4（使用中）から3基。', scoreDelta: { obedience: 2, social_distance: 1 } },
    { targetUrinalIndex: 2, sublabel: '#0・#4（使用中）から等距離（2基）。', scoreDelta: { rationality: 3, chaos: 1 } },
    { targetUrinalIndex: 3, sublabel: '#4（使用中）に隣接。入口から2番目。', scoreDelta: { obedience: 2, chaos: 1 } },
  ],
  modelNote: 'U(#2) = k/4 + k/4 = 0.5k が最小。U(#1) = U(#3) ≈ 1.11k。合理性の観点では #2 が支配的。',
};

// =============================================================================
// Scenario 007 — 水たまりの逆説
// [empty][wet][empty][empty][occupied]  入口←左
// =============================================================================
const scenario007: Scenario = {
  id: 'scenario-007',
  title: '実験 VII: 水たまりの逆説',
  description: '#1 の足元に水たまりがある。前の人がこぼしたのだろう。#4 は使用中。入口は左側。衛生か、距離か。',
  entrance: 'left',
  urinals: [
    { id: 0, status: 'empty' },
    { id: 1, status: 'wet', note: '前の人がこぼした水たまり' },
    { id: 2, status: 'empty' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'occupied' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 0, sublabel: '壁あり。入口に最も近い。#1（水たまり）に隣接。', scoreDelta: { rationality: 2, chaos: 1 } },
    { targetUrinalIndex: 1, sublabel: '#1（水たまり）を使用。', scoreDelta: { chaos: 3 } },
    { targetUrinalIndex: 2, sublabel: '#1（水たまり）に隣接。右側。', scoreDelta: { chaos: 1, social_distance: 1 } },
    { targetUrinalIndex: 3, sublabel: '#1（水たまり）から2基。#4（使用中）に隣接。', scoreDelta: { obedience: 2, social_distance: 1 } },
  ],
  modelNote: 'U(#0) = 0.8 + 0.06 + 0.5(衛生) − 0.3(壁) = 1.06、U(#3) = 0.2 + 1.0 = 1.20。壁面ボーナスが衛生ペナルティを上回り #0 が理論最適。',
};

// =============================================================================
// Scenario 008 — 前の人の遺産
// [empty][empty][wet][empty][empty]  入口←左
// =============================================================================
const scenario008: Scenario = {
  id: 'scenario-008',
  title: '実験 VIII: 前の人の遺産',
  description: '#2 の足元に水たまりがある。前の人がこぼしたのだろう。他は誰もいない。入口は左側。',
  entrance: 'left',
  urinals: [
    { id: 0, status: 'empty' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'wet', note: '前の人がこぼした水たまり' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'empty' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 0, sublabel: '壁あり。入口に最も近い。#2（水たまり）まで2基。', scoreDelta: { obedience: 2 } },
    { targetUrinalIndex: 1, sublabel: '#2（水たまり）に隣接。入口から2番目。', scoreDelta: { chaos: 2 } },
    { targetUrinalIndex: 2, sublabel: '#2（水たまり）を使用。', scoreDelta: { chaos: 3 } },
    { targetUrinalIndex: 3, sublabel: '#2（水たまり）に隣接。入口から4番目。', scoreDelta: { chaos: 2 } },
    { targetUrinalIndex: 4, sublabel: '壁あり。入口から最も遠い。#2（水たまり）まで2基。', scoreDelta: { social_distance: 3, rationality: 1 } },
  ],
  modelNote: '#0 と #4 は #2（水たまり）から等距離（2基）。両者の差は入口距離のみ。衛生コストの心理的影響を測定する。',
};

// =============================================================================
// Scenario 009 — 混雑地獄
// [occupied][empty][occupied][occupied][empty]  入口←右
// =============================================================================
const scenario009: Scenario = {
  id: 'scenario-009',
  title: '実験 IX: 混雑地獄',
  description: '5基中3基が使用中。空いているのは #1 と #4 だけだ。入口は右側。どちらを選ぶか。',
  entrance: 'right',
  urinals: [
    { id: 0, status: 'occupied' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'occupied' },
    { id: 3, status: 'occupied' },
    { id: 4, status: 'empty' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 1, sublabel: '#0（使用中）と#2（使用中）に隣接。', scoreDelta: { chaos: 3, rationality: 1 } },
    { targetUrinalIndex: 4, sublabel: '入口に最も近い。#3（使用中）に隣接。壁なし。', scoreDelta: { obedience: 2, social_distance: 1 } },
  ],
  modelNote: 'U(#1) = 1/1 + 1/1 = 2.0（両側斥力）、U(#4) = 1/1 + 1/4 + 1/9 ≈ 1.36。#4 が計算上は優位。',
};

export const SCENARIOS: Scenario[] = [
  scenario001,
  scenario002,
  scenario003,
  scenario004,
  scenario005,
  scenario006,
  scenario007,
  scenario008,
  scenario009,
];
