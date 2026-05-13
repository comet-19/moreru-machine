'use client';

import type { Urinal, UrinalChoice } from '@/types';
import { getUrinalPotentialMap } from '@/lib/potential';
import UrinalUnit from './UrinalUnit';

interface Props {
  urinals: Urinal[];
  urinalChoices: UrinalChoice[];
  selectedIndex?: number | null;
  onSelect?: (urinalIndex: number) => void;
  entrance?: 'left' | 'right';
  showPotential?: boolean;
}

export default function UrinalBoard({
  urinals,
  urinalChoices,
  selectedIndex,
  onSelect,
  entrance,
  showPotential = false,
}: Props) {
  const potentialMap = showPotential ? getUrinalPotentialMap(urinals) : null;
  const choiceSet = new Set(urinalChoices.map((c) => c.targetUrinalIndex));

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 壁 */}
      <div className="w-full h-2 bg-zinc-700 rounded" />

      {/* 便器列 */}
      <div className="flex gap-3 items-end">
        {urinals.map((urinal) => {
          const isChoice = choiceSet.has(urinal.id);
          const isSelected = selectedIndex === urinal.id;
          const potential = potentialMap?.find((p) => p.index === urinal.id)?.potential;

          return (
            <UrinalUnit
              key={urinal.id}
              urinal={urinal}
              potential={potential}
              isChoice={isChoice}
              isSelected={isSelected}
              onClick={isChoice && onSelect ? () => onSelect(urinal.id) : undefined}
            />
          );
        })}
      </div>

      {/* 床 */}
      <div className="w-full h-1 bg-zinc-600 rounded" />

      {/* 入口インジケーター */}
      {entrance && (
        <div className={`w-full flex ${entrance === 'left' ? 'justify-start' : 'justify-end'}`}>
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-8 h-1 bg-zinc-500 rounded" />
            <span className="text-xs font-mono text-zinc-500">入口</span>
          </div>
        </div>
      )}

      {showPotential && (
        <p className="text-xs text-zinc-500 font-mono">
          ↑ 気まずさポテンシャル U（低いほど最適）
        </p>
      )}
    </div>
  );
}
