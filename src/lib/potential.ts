/**
 * Moreru Machine — Awkwardness Potential Field Model
 *
 * 男子トイレにおける「気まずさ」を物理学のポテンシャル場として定式化する。
 *
 * ## 基本モデル
 *
 * 便器を 1 次元格子上の点 x_i (i = 0, 1, ..., N-1) として配置する。
 * 各占有点 x_j が生成する気まずさポテンシャルを以下で定義する：
 *
 *   U_j(x) = k_j / |x - x_j|^α
 *
 * ここで:
 *   k_j : 占有状態に依存する強度係数（下記参照）
 *   α   : 距離減衰指数（デフォルト 2.0, クーロン型）
 *   |x - x_j| : 格子上の整数距離
 *
 * 全ポテンシャルは重ね合わせの原理により：
 *   U(x_i) = Σ_j U_j(x_i)  （i ≠ j かつ x_j が occupied/danger/broken）
 *
 * ## 強度係数 k_j（状態依存）
 *
 *   empty    → 0    （発生源なし）
 *   occupied → 1.0  （通常の斥力）
 *   danger   → 5.0  （非線形ポテンシャル急上昇：ヤンキー・酔漢等）
 *   broken   → 0.8  （物理的忌避 + 衛生コスト）
 *
 * ## 壁面補正（Wall Effect）
 *
 * 端の便器には「壁への寄り掛かり感」による安定化補正を加える：
 *   U_wall(x_0) -= w,  U_wall(x_{N-1}) -= w
 *   w = WALL_BONUS（デフォルト 0.3）
 *
 * ## 衛生コスト（Hygiene Penalty）
 *
 * 破損便器に隣接する場合、飛沫リスクとして追加コストを課す：
 *   U_hygiene(x_i) += h  （|x_i - x_broken| = 1 かつ broken 隣接）
 *   h = HYGIENE_PENALTY（デフォルト 0.5）
 *
 * ## 選択不可能な便器の処理
 *
 * status が 'empty' 以外の便器は Infinity を返し、候補から除外する。
 */

import type { Urinal, PotentialResult, UrinalStatus } from '@/types';

// =============================================================================
// Model Parameters（調整可能な定数）
// =============================================================================

/** 距離減衰指数 α（2 = クーロン型、1 = 重力型） */
const DECAY_EXPONENT = 2.0;

/** 占有状態ごとの強度係数 k */
const INTENSITY: Record<UrinalStatus, number> = {
  empty:    0.0,
  occupied: 1.0,
  danger:   5.0,
  broken:   0.8,
};

/** 壁面安定化ボーナス（端の便器のポテンシャルから差し引く） */
const WALL_BONUS = 0.3;

/** 故障便器隣接ペナルティ（衛生コスト） */
const HYGIENE_PENALTY = 0.5;

// =============================================================================
// Core Functions
// =============================================================================

/**
 * クーロン型ポテンシャル: k / r^α
 * r = 0 は呼ばれない前提（自己ポテンシャルは計算しない）
 */
function coulombPotential(k: number, r: number): number {
  return k / Math.pow(r, DECAY_EXPONENT);
}

/**
 * 便器配列に対して気まずさポテンシャルを計算する。
 *
 * @param urinals 便器の配列（左→右）
 * @returns PotentialResult
 */
export function computePotential(urinals: Urinal[]): PotentialResult {
  const n = urinals.length;
  const raw = new Array<number>(n).fill(0);

  // --- 1. 各 empty 便器に対して、占有点からのポテンシャルを積算 ---
  for (let i = 0; i < n; i++) {
    if (urinals[i].status !== 'empty') {
      raw[i] = Infinity; // 選択不可
      continue;
    }

    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const k = INTENSITY[urinals[j].status];
      if (k === 0) continue;

      const r = Math.abs(i - j);
      raw[i] += coulombPotential(k, r);
    }

    // --- 2. 壁面補正 ---
    if (i === 0 || i === n - 1) {
      raw[i] -= WALL_BONUS;
    }

    // --- 3. 衛生コスト（故障便器への隣接ペナルティ） ---
    for (let j = 0; j < n; j++) {
      if (urinals[j].status === 'broken' && Math.abs(i - j) === 1) {
        raw[i] += HYGIENE_PENALTY;
      }
    }
  }

  // --- 4. 正規化 ---
  const finite = raw.filter(v => isFinite(v));
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  const range = max - min;

  const normalized = raw.map(v => {
    if (!isFinite(v)) return Infinity;
    return range === 0 ? 0 : (v - min) / range;
  });

  // --- 5. 最適インデックス（ポテンシャル最小の empty 便器） ---
  let optimalIndex = -1;
  let minVal = Infinity;
  for (let i = 0; i < n; i++) {
    if (raw[i] < minVal) {
      minVal = raw[i];
      optimalIndex = i;
    }
  }

  return { values: raw, optimalIndex, normalized };
}

// =============================================================================
// Utility: Describe potential in academic flavor text
// =============================================================================

/**
 * ポテンシャル値から気まずさレベルの学術的記述を返す。
 * UI のフレーバーテキストとして利用する。
 */
export function describeAwkwardness(normalizedValue: number): string {
  if (!isFinite(normalizedValue)) return '選択不可（位相空間外）';
  if (normalizedValue < 0.2) return '安定点（ポテンシャル極小）';
  if (normalizedValue < 0.5) return '準安定状態（局所極小候補）';
  if (normalizedValue < 0.8) return '不安定点（鞍点近傍）';
  return '最大応力点（ポテンシャル極大）';
}

/**
 * 各便器について { index, potential, label } の配列を返す。
 * UrinalBoard コンポーネント向けのビュー用データ。
 */
export function getUrinalPotentialMap(
  urinals: Urinal[],
): Array<{ index: number; potential: number; label: string }> {
  const result = computePotential(urinals);
  return urinals.map((_, i) => ({
    index: i,
    potential: result.normalized[i],
    label: describeAwkwardness(result.normalized[i]),
  }));
}
