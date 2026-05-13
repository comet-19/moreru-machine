'use client';

import { useState } from 'react';
import { SCENARIOS } from '@/data/scenarios';
import { INITIAL_SCORES, applyDelta } from '@/lib/scoring';
import type { UserScores, Answer } from '@/types';
import UrinalBoard from '@/components/urinal/UrinalBoard';
import ChoiceCard from '@/components/scenario/ChoiceCard';

export default function ExperimentPage() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<'A' | 'B' | null>(null);
  const [scores, setScores] = useState<UserScores>(INITIAL_SCORES);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const scenario = SCENARIOS[index];
  const isLast = index === SCENARIOS.length - 1;

  function handleSelect(choiceId: 'A' | 'B') {
    setSelected(choiceId);
  }

  function handleNext() {
    if (!selected) return;
    const choice = scenario.choices.find((c) => c.id === selected)!;
    const newScores = applyDelta(scores, choice.scoreDelta);
    const newAnswers: Answer[] = [
      ...answers,
      {
        scenarioId: scenario.id,
        choiceId: selected,
        targetUrinalIndex: choice.targetUrinalIndex,
        scoreDelta: choice.scoreDelta,
      },
    ];
    setScores(newScores);
    setAnswers(newAnswers);

    if (isLast) {
      const params = new URLSearchParams({
        scores: JSON.stringify(newScores),
      });
      window.location.href = `/experiment/result?${params.toString()}`;
    } else {
      setIndex(index + 1);
      setSelected(null);
    }
  }

  const progress = ((index) / SCENARIOS.length) * 100;

  return (
    <main className="min-h-screen bg-black text-zinc-300 flex flex-col items-center px-4 py-10">
      <div className="max-w-lg w-full flex flex-col gap-6">

        {/* 進捗バー */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-mono text-zinc-600">
            <span>実験進捗</span>
            <span>{index + 1} / {SCENARIOS.length}</span>
          </div>
          <div className="w-full h-1 bg-zinc-800 rounded">
            <div
              className="h-1 bg-zinc-400 rounded transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* タイトル */}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
            Scenario {String(index + 1).padStart(3, '0')}
          </p>
          <h2 className="text-base font-semibold text-zinc-100 leading-snug">
            {scenario.title}
          </h2>
        </div>

        {/* 説明文 */}
        <p className="text-sm text-zinc-400 leading-7 border-l-2 border-zinc-700 pl-4">
          {scenario.description}
        </p>

        {/* 便器ボード */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg px-6 py-6">
          <UrinalBoard
            urinals={scenario.urinals}
            choices={scenario.choices}
            selectedChoice={selected}
            onSelect={handleSelect}
            showPotential={false}
          />
        </div>

        {/* 選択肢 */}
        <div className="flex flex-col gap-3">
          {scenario.choices.map((choice) => (
            <ChoiceCard
              key={choice.id}
              choice={choice}
              isSelected={selected === choice.id}
              onSelect={() => handleSelect(choice.id)}
            />
          ))}
        </div>

        {/* モデル注釈 */}
        {scenario.modelNote && (
          <p className="text-xs font-mono text-zinc-600 leading-5 border border-zinc-900 rounded px-3 py-2 bg-zinc-950">
            ▸ {scenario.modelNote}
          </p>
        )}

        {/* 次へボタン */}
        <button
          onClick={handleNext}
          disabled={!selected}
          className={[
            'w-full py-3 rounded border text-sm font-medium tracking-wide transition-all duration-150',
            selected
              ? 'border-zinc-500 bg-zinc-900 text-white hover:bg-zinc-800 hover:border-zinc-300 cursor-pointer'
              : 'border-zinc-800 bg-zinc-950 text-zinc-700 cursor-not-allowed',
          ].join(' ')}
        >
          {isLast ? '結果を見る →' : '次の問題へ →'}
        </button>
      </div>
    </main>
  );
}
