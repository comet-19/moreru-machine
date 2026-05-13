// =============================================================================
// Moreru Machine — Core Type Definitions
// Awkwardness Potential Field Model v1.0
// =============================================================================

/** 便器の物理・社会的状態 */
export type UrinalStatus =
  | 'empty'     // 空き（ポテンシャルエネルギー = 0）
  | 'occupied'  // 使用中（斥力場を発生）
  | 'danger'    // 危険人物（非線形ポテンシャル急上昇）
  | 'broken';   // 故障・水たまり（衛生コスト加算）

/** 便器1個を表すエンティティ */
export interface Urinal {
  id: number;
  status: UrinalStatus;
  /** フレーバーテキスト（hover 時に表示） */
  note?: string;
}

// =============================================================================
// Scoring System
// =============================================================================

/** ユーザー行動の評価軸 */
export type ScoreTag =
  | 'social_distance'  // ソーシャルディスタンス至上主義：隣接を徹底回避
  | 'rationality'      // 合理性・衛生重視：期待コスト最小化
  | 'obedience'        // 忖度・従順さ：暗黙のルールへの服従
  | 'chaos';           // カオス耐性：規範を意に介さない大胆さ

/** スコア差分（正負両対応、未指定タグはゼロ扱い） */
export type ScoreDelta = Partial<Record<ScoreTag, number>>;

/** セッション全体の累積スコア */
export type UserScores = Record<ScoreTag, number>;

// =============================================================================
// Scenario / Choice
// =============================================================================

/**
 * 選択肢
 * - 位置選択型（targetUrinalIndex を指定）と
 *   行動選択型（targetUrinalIndex = undefined, action で記述）の両方を許容
 */
export interface Choice {
  id: 'A' | 'B';
  /** UIに表示される選択肢ラベル */
  label: string;
  /**
   * 学術論文風サブラベル
   * 例: "局所ポテンシャル極小点への収束"
   */
  sublabel?: string;
  /**
   * 対象となる便器のインデックス（0-origin）
   * 行動選択型シナリオでは undefined
   */
  targetUrinalIndex?: number;
  scoreDelta: ScoreDelta;
}

/** シナリオ1問を表すエンティティ */
export interface Scenario {
  id: string;
  /** 問題のタイトル（実験レポート風） */
  title: string;
  /** 状況の説明文（無駄にアカデミックな文体） */
  description: string;
  /**
   * 便器配列（1次元、左→右）
   * length: 3〜7 程度を想定
   */
  urinals: Urinal[];
  /** 常に2択 */
  choices: [Choice, Choice];
  /**
   * このシナリオで前提とする数理モデルの注釈
   * 例: "本問ではクーロン型斥力 U(r) = k/r² を仮定する"
   */
  modelNote?: string;
}

// =============================================================================
// Potential Field
// =============================================================================

/**
 * 各便器に対する気まずさポテンシャルの計算結果
 * lib/potential.ts が生成する
 */
export interface PotentialResult {
  /** 便器インデックス → ポテンシャル値（任意単位、高いほど気まずい） */
  values: number[];
  /** ポテンシャル最小の便器インデックス（理論上の最適解） */
  optimalIndex: number;
  /** 正規化済みスコア [0, 1] */
  normalized: number[];
}

// =============================================================================
// Experiment Session
// =============================================================================

export type ExperimentPhase =
  | 'intro'       // 説明・同意画面
  | 'scenario'    // シナリオ回答中
  | 'result';     // 結果表示

export interface Answer {
  scenarioId: string;
  choiceId: 'A' | 'B';
  targetUrinalIndex?: number;
  scoreDelta: ScoreDelta;
}

export interface ExperimentState {
  phase: ExperimentPhase;
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
  /** 学術風診断コメント */
  description: string;
  dominantTags: ScoreTag[];
}
