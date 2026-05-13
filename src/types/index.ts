// =============================================================================
// Moreru Machine — Core Type Definitions v2.0
// =============================================================================

/** 便器の物理・社会的状態 */
export type UrinalStatus =
  | 'empty'     // 空き
  | 'occupied'  // 使用中
  | 'danger'    // 危険人物
  | 'broken';   // 故障・水たまり

/** 便器の種別 */
export type UrinalType =
  | 'standard'    // 通常
  | 'accessible'  // 障害者用（広め・低め）
  | 'child';      // 子供用（低め）

/** 便器1個を表すエンティティ */
export interface Urinal {
  id: number;
  status: UrinalStatus;
  type?: UrinalType;  // 省略時は 'standard'
  note?: string;
}

// =============================================================================
// Scoring System
// =============================================================================

export type ScoreTag =
  | 'social_distance'
  | 'rationality'
  | 'obedience'
  | 'chaos';

export type ScoreDelta = Partial<Record<ScoreTag, number>>;
export type UserScores = Record<ScoreTag, number>;

// =============================================================================
// Scenario
// =============================================================================

/** 便器ひとつに対応する選択肢 */
export interface UrinalChoice {
  targetUrinalIndex: number;
  /** 選択した場合の学術的説明（選択後に表示） */
  sublabel?: string;
  scoreDelta: ScoreDelta;
}

/** シナリオ1問 */
export interface Scenario {
  id: string;
  title: string;
  description: string;
  urinals: Urinal[];
  /** 選択可能な便器とそのスコア定義（空き便器すべてに対応） */
  urinalChoices: UrinalChoice[];
  /** 入口の方向（省略時は表示なし） */
  entrance?: 'left' | 'right';
  modelNote?: string;
}

// =============================================================================
// Potential Field
// =============================================================================

export interface PotentialResult {
  values: number[];
  optimalIndex: number;
  normalized: number[];
}

// =============================================================================
// Experiment Session
// =============================================================================

export interface Answer {
  scenarioId: string;
  urinalIndex: number;
  scoreDelta: ScoreDelta;
}

export interface ExperimentState {
  currentScenarioIndex: number;
  scores: UserScores;
  answers: Answer[];
}

// =============================================================================
// Result / Persona
// =============================================================================

export interface Persona {
  id: string;
  label: string;
  description: string;
  dominantTags: ScoreTag[];
}
