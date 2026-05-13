'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SCENARIOS } from '@/data/scenarios';
import { INITIAL_SCORES, applyDelta } from '@/lib/scoring';
import type { UserScores, Answer, Scenario } from '@/types';

export interface ExperimentActions {
  /** 選択肢を選ぶ（便器クリック or カードクリック） */
  select: (choiceId: 'A' | 'B') => void;
  /** 次の問題へ進む / 最終問なら結果ページへ遷移 */
  next: () => void;
}

export interface ExperimentState {
  /** 現在のシナリオ */
  scenario: Scenario;
  /** 表示用問題番号（1-origin） */
  questionNumber: number;
  /** 総問題数 */
  totalQuestions: number;
  /** 進捗率（0〜100） */
  progress: number;
  /** 現在の選択（null = 未選択） */
  selected: 'A' | 'B' | null;
  /** 最終問か否か */
  isLast: boolean;
  /** 累積スコア（デバッグ・結果プレビュー用） */
  scores: UserScores;
  /** 回答履歴 */
  answers: Answer[];
}

export function useExperiment(): ExperimentState & ExperimentActions {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<'A' | 'B' | null>(null);
  const [scores, setScores] = useState<UserScores>(INITIAL_SCORES);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const scenario = SCENARIOS[index];
  const isLast = index === SCENARIOS.length - 1;

  const select = useCallback((choiceId: 'A' | 'B') => {
    setSelected(choiceId);
  }, []);

  const next = useCallback(() => {
    if (!selected) return;

    const choice = scenario.choices.find((c) => c.id === selected)!;
    const newScores = applyDelta(scores, choice.scoreDelta);
    const newAnswer: Answer = {
      scenarioId: scenario.id,
      choiceId: selected,
      targetUrinalIndex: choice.targetUrinalIndex,
      scoreDelta: choice.scoreDelta,
    };
    const newAnswers = [...answers, newAnswer];

    setScores(newScores);
    setAnswers(newAnswers);

    if (isLast) {
      const params = new URLSearchParams({ scores: JSON.stringify(newScores) });
      router.push(`/experiment/result?${params.toString()}`);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }, [selected, scenario, scores, answers, isLast, router]);

  return {
    scenario,
    questionNumber: index + 1,
    totalQuestions: SCENARIOS.length,
    progress: (index / SCENARIOS.length) * 100,
    selected,
    isLast,
    scores,
    answers,
    select,
    next,
  };
}
