'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SCENARIOS } from '@/data/scenarios';
import { INITIAL_SCORES, applyDelta } from '@/lib/scoring';
import type { UserScores, Answer, Scenario } from '@/types';

export interface ExperimentActions {
  select: (urinalIndex: number) => void;
  next: () => void;
}

export interface ExperimentState {
  scenario: Scenario;
  questionNumber: number;
  totalQuestions: number;
  progress: number;
  selected: number | null;
  isLast: boolean;
  scores: UserScores;
  answers: Answer[];
}

export function useExperiment(): ExperimentState & ExperimentActions {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [scores, setScores] = useState<UserScores>(INITIAL_SCORES);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const scenario = SCENARIOS[index];
  const isLast = index === SCENARIOS.length - 1;

  const select = useCallback((urinalIndex: number) => {
    setSelected(urinalIndex);
  }, []);

  const next = useCallback(() => {
    if (selected === null) return;

    const choice = scenario.urinalChoices.find((c) => c.targetUrinalIndex === selected)!;
    const newScores = applyDelta(scores, choice.scoreDelta);
    const newAnswer: Answer = {
      scenarioId: scenario.id,
      urinalIndex: selected,
      scoreDelta: choice.scoreDelta,
    };
    const newAnswers = [...answers, newAnswer];

    setScores(newScores);
    setAnswers(newAnswers);

    if (isLast) {
      const params = new URLSearchParams({
        scores:  JSON.stringify(newScores),
        answers: JSON.stringify(newAnswers),
      });
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
