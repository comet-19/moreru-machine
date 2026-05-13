import type { Scenario } from '@/types';

// =============================================================================
// Scenario 001 — 完全なる静寂
// [empty][empty][empty][empty][empty]  入口←左
// =============================================================================
const scenario001: Scenario = {
  id: 'scenario-001',
  title: '実験 I: 完全なる静寂',
  description:
    '5基すべて空いている。誰もいない。' +
    '入口は左側だ。あなたはどこに立つか。',
  entrance: 'left',
  urinals: [
    { id: 0, status: 'empty' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'empty' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'empty' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 0, sublabel: '入口のすぐ横。後から来た人が背後を通る。', scoreDelta: { obedience: 2 } },
    { targetUrinalIndex: 1, sublabel: '入口に近い。悪くはないが、特に理由もない。', scoreDelta: { obedience: 1 } },
    { targetUrinalIndex: 2, sublabel: '真ん中。次の人の選択肢を両側から詰める。', scoreDelta: { chaos: 2 } },
    { targetUrinalIndex: 3, sublabel: '入口から程よく遠い。バランスは取れている。', scoreDelta: { social_distance: 1, obedience: 1 } },
    { targetUrinalIndex: 4, sublabel: '一番奥。壁面補正あり。理論的最適解。', scoreDelta: { social_distance: 3, rationality: 1 } },
  ],
  modelNote:
    '壁面補正 w = 0.3 を適用すると #4 が最小ポテンシャル点。' +
    '入口近接ペナルティを加味した場合も同様の結論が導かれる。',
};

// =============================================================================
// Scenario 002 — 隣人は語らず
// [occupied][empty][empty][empty][empty]  入口←左
// =============================================================================
const scenario002: Scenario = {
  id: 'scenario-002',
  title: '実験 II: 隣人は語らず',
  description:
    '左端に一人いる。入口もそちら側だ。' +
    'あなたはどれだけ距離を取るか。',
  entrance: 'left',
  urinals: [
    { id: 0, status: 'occupied' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'empty' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'empty' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 1, sublabel: '真隣。入口にも近い。あなたは強いのか、無神経なのか。', scoreDelta: { chaos: 3 } },
    { targetUrinalIndex: 2, sublabel: '1基空けた。最低限の礼儀は守った。', scoreDelta: { chaos: 1, obedience: 1 } },
    { targetUrinalIndex: 3, sublabel: '適度な距離。無難な選択。', scoreDelta: { obedience: 2, social_distance: 1 } },
    { targetUrinalIndex: 4, sublabel: '一番遠い端。壁もある。これ以上は離れられない。', scoreDelta: { social_distance: 3, rationality: 1 } },
  ],
  modelNote:
    'U(#1) = k/1² = 1.0、U(#4) = k/9 ≈ 0.11。' +
    '#4 が理論最適解。#1 を選んだ場合のポテンシャルは約 9 倍に相当する。',
};

// =============================================================================
// Scenario 003 — 障害者用の誘惑
// [occupied][empty][accessible_empty][empty][occupied]  入口←右
// =============================================================================
const scenario003: Scenario = {
  id: 'scenario-003',
  title: '実験 III: 障害者用の誘惑',
  description:
    '両端が使用中で、中央には障害者用便器がある。' +
    '両隣の #1 と #3 も空いている。あなたはどこに立つか。',
  entrance: 'right',
  urinals: [
    { id: 0, status: 'occupied' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'empty', type: 'accessible' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'occupied' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 1, sublabel: '左側の使用中に隣接。入口からは遠い。', scoreDelta: { social_distance: 1, obedience: 1 } },
    { targetUrinalIndex: 2, sublabel: '障害者用を使う。必要な人が来たら気まずい。それでも構わないか。', scoreDelta: { chaos: 2, rationality: 1 } },
    { targetUrinalIndex: 3, sublabel: '入口に近い右側。右の使用中に隣接するが、退出しやすい。', scoreDelta: { obedience: 2 } },
  ],
  modelNote:
    '障害者用便器の使用可否は状況依存だが、本モデルでは' +
    '「必要な人が来た際の気まずさ」を追加コストとして chaos に反映する。',
};

// =============================================================================
// Scenario 004 — 危険な隣人
// [empty][danger][empty][empty][empty]  入口←左
// =============================================================================
const scenario004: Scenario = {
  id: 'scenario-004',
  title: '実験 IV: 危険な隣人',
  description:
    '#1 の人の雰囲気がおかしい。目が合いたくない。' +
    '入口は左側。あなたはどこに立つか。',
  entrance: 'left',
  urinals: [
    { id: 0, status: 'empty' },
    { id: 1, status: 'danger', note: '雰囲気がおかしい人' },
    { id: 2, status: 'empty' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'empty' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 0, sublabel: '入口横かつ危険人物の真隣。最悪の組み合わせ。', scoreDelta: { chaos: 4 } },
    { targetUrinalIndex: 2, sublabel: '危険人物の反対隣。近いが、逃げ場は一応ある。', scoreDelta: { chaos: 2 } },
    { targetUrinalIndex: 3, sublabel: '危険人物から2基離れた。安心感がある。', scoreDelta: { social_distance: 2, rationality: 1 } },
    { targetUrinalIndex: 4, sublabel: '一番遠い。壁もある。これが正解だと思う。', scoreDelta: { social_distance: 3, rationality: 2 } },
  ],
  modelNote:
    'danger ノード k = 5.0 適用時、U(#0) = 5.0、U(#4) ≈ 0.56。' +
    '約 9 倍のポテンシャル差が存在する。',
};

// =============================================================================
// Scenario 005 — 子供用の壁
// [empty][occupied][child_empty][occupied][empty]  入口←左
// =============================================================================
const scenario005: Scenario = {
  id: 'scenario-005',
  title: '実験 V: 子供用の壁',
  description:
    '両隣が使用中で、間には子供用便器がある。' +
    '両端にも空きがある。どこに立つか。',
  entrance: 'left',
  urinals: [
    { id: 0, status: 'empty' },
    { id: 1, status: 'occupied' },
    { id: 2, status: 'empty', type: 'child' },
    { id: 3, status: 'occupied' },
    { id: 4, status: 'empty' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 0, sublabel: '入口横。左端の壁はない。背後に人が通る。', scoreDelta: { obedience: 2, chaos: 1 } },
    { targetUrinalIndex: 2, sublabel: '子供用を使う。両隣が使用中の上に高さも合わない。度胸がいる。', scoreDelta: { chaos: 4 } },
    { targetUrinalIndex: 4, sublabel: '一番遠い端。壁あり。唯一の安定点。', scoreDelta: { social_distance: 3, rationality: 2 } },
  ],
  modelNote:
    '#2 は子供用ペナルティ（社会的コスト）+ 両側斥力の合計で本データセット最高ポテンシャルを記録。' +
    '#4 が唯一の低コスト安定点。',
};

// =============================================================================
// Scenario 006 — 上司との邂逅
// [empty][empty][occupied_boss][empty][empty]  入口←左
// =============================================================================
const scenario006: Scenario = {
  id: 'scenario-006',
  title: '実験 VI: 上司との邂逅',
  description:
    '中央にいるのは直属の上司だった。' +
    '入口は左側。あなたはどこに立つか。',
  entrance: 'left',
  urinals: [
    { id: 0, status: 'empty' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'occupied', note: '直属の上司' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'empty' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 0, sublabel: '入口横。上司から最も遠い。来たことに気づかれないかもしれない。', scoreDelta: { social_distance: 2, chaos: 1 } },
    { targetUrinalIndex: 1, sublabel: '上司の左隣。会話が発生するかもしれない。', scoreDelta: { obedience: 3 } },
    { targetUrinalIndex: 3, sublabel: '上司の右隣。同様に会話リスクあり。入口には近い。', scoreDelta: { obedience: 2, chaos: 1 } },
    { targetUrinalIndex: 4, sublabel: '一番奥。会釈だけして距離を保つ。大人の判断。', scoreDelta: { social_distance: 3, obedience: 1 } },
  ],
  modelNote:
    '本問では「権力補正係数 p」を標準モデルに追加することが考えられるが、' +
    '個人差が大きく定量化は困難なため定性的扱いとする。',
};

// =============================================================================
// Scenario 007 — 鏡の法則
// [occupied][empty][empty][empty][occupied]  入口←右
// =============================================================================
const scenario007: Scenario = {
  id: 'scenario-007',
  title: '実験 VII: 鏡の法則',
  description:
    '両端が使用中。入口は右側だ。' +
    '中間の3基が空いている。どこに立つか。',
  entrance: 'right',
  urinals: [
    { id: 0, status: 'occupied' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'empty' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'occupied' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 1, sublabel: '左の使用中に隣接。次の人のために #3 を残せる。', scoreDelta: { obedience: 2, social_distance: 1 } },
    { targetUrinalIndex: 2, sublabel: '中央。等距離で理論最適。ただし次の人の選択肢を両側から詰める。', scoreDelta: { rationality: 3, chaos: 1 } },
    { targetUrinalIndex: 3, sublabel: '入口に近い右寄り。右の使用中に隣接するが、退出しやすい。', scoreDelta: { obedience: 2, chaos: 1 } },
  ],
  modelNote:
    'U(#2) = k/4 + k/4 = 0.5k が最小。U(#1) = U(#3) = k + k/9 ≈ 1.11k。' +
    '合理性の観点からは #2 が支配的だが、協調的観点からは #1 または #3 が望ましい。',
};

// =============================================================================
// Scenario 008 — 水たまりの逆説
// [empty][wet][empty][empty][occupied]  入口←左
// =============================================================================
const scenario008: Scenario = {
  id: 'scenario-008',
  title: '実験 VIII: 水たまりの逆説',
  description:
    '#1 の足元に水たまりがある。前の人がこぼしたのだろう。#4 は使用中。' +
    '入口は左側。衛生か、距離か。',
  entrance: 'left',
  urinals: [
    { id: 0, status: 'empty' },
    { id: 1, status: 'wet', note: '前の人がこぼした水たまり' },
    { id: 2, status: 'empty' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'occupied' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 0, sublabel: '入口横かつ故障の隣。だが壁あり。計算上は最適解に近い。', scoreDelta: { rationality: 2, chaos: 1 } },
    { targetUrinalIndex: 2, sublabel: '故障の右隣。飛沫リスクが気になる。', scoreDelta: { chaos: 1, social_distance: 1 } },
    { targetUrinalIndex: 3, sublabel: '故障から遠く、使用中とも程よい距離。直感的に安心。', scoreDelta: { obedience: 2, social_distance: 1 } },
  ],
  modelNote:
    'U(#0) = 0.8 + 0.06 + 0.5(衛生) − 0.3(壁) = 1.06、U(#3) = 0.2 + 1.0 = 1.20。' +
    '壁面ボーナスが衛生ペナルティを上回り #0 が理論最適。直感を裏切る結果。',
};

// =============================================================================
// Scenario 009 — 混雑地獄
// [occupied][empty][occupied][occupied][empty]  入口←右
// =============================================================================
const scenario009: Scenario = {
  id: 'scenario-009',
  title: '実験 IX: 混雑地獄',
  description:
    '5基中3基が使用中。空いているのは #1 と #4 だけだ。' +
    '入口は右側。どちらを選ぶか。',
  entrance: 'right',
  urinals: [
    { id: 0, status: 'occupied' },
    { id: 1, status: 'empty' },
    { id: 2, status: 'occupied' },
    { id: 3, status: 'occupied' },
    { id: 4, status: 'empty' },
  ],
  urinalChoices: [
    { targetUrinalIndex: 1, sublabel: '両隣が使用中。完全な挟撃状態。入口からは遠い。', scoreDelta: { chaos: 3, rationality: 1 } },
    { targetUrinalIndex: 4, sublabel: '入口のすぐ横。右の使用中に隣接するが、壁はない。退出はしやすい。', scoreDelta: { obedience: 2, social_distance: 1 } },
  ],
  modelNote:
    'U(#1) = 1/1 + 1/1 = 2.0（両側斥力の重ね合わせ）、U(#4) = 1/1 + 1/4 + 1/9 ≈ 1.36。' +
    '#4 が計算上は優位だが、入口近接ペナルティを加算すると差は縮まる。',
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
