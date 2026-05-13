'use client';

import type { Urinal, Choice } from '@/types';
import { getUrinalPotentialMap } from '@/lib/potential';
import UrinalUnit from './UrinalUnit';

interface Props {
  urinals: Urinal[];
  choices: [Choice, Choice];
  /** 現在選択中の choice id */
  selectedChoice?: 'A' | 'B' | null;
  onSelect?: (choiceId: 'A' | 'B') => void;
  /** ポテンシャル値を表示するか */
  showPotential?: boolean;
}

export default function UrinalBoard({
  urinals,
  choices,
  selectedChoice,
  onSelect,
  showPotential = false,
}: Props) {
  const potentialMap = showPotential ? getUrinalPotentialMap(urinals) : null;

  // どの便器インデックスがどの選択肢に対応するか
  const highlightMap = new Map<number, 'A' | 'B'>();
  choices.forEach((c) => {
    if (c.targetUrinalIndex !== undefined) {
      highlightMap.set(c.targetUrinalIndex, c.id);
    }
  });

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 壁 */}
      <div className="w-full h-2 bg-zinc-700 rounded" />

      {/* 便器列 */}
      <div className="flex gap-3 items-end">
        {urinals.map((urinal) => {
          const highlight = highlightMap.get(urinal.id) ?? null;
          const isSelected =
            highlight !== null && selectedChoice === highlight;
          const potential = potentialMap?.find((p) => p.index === urinal.id)?.potential;

          return (
            <UrinalUnit
              key={urinal.id}
              urinal={urinal}
              potential={potential}
              highlight={highlight}
              isSelected={isSelected}
              onClick={
                highlight && onSelect
                  ? () => onSelect(highlight)
                  : undefined
              }
            />
          );
        })}
      </div>

      {/* 床 */}
      <div className="w-full h-1 bg-zinc-600 rounded" />

      {showPotential && (
        <p className="text-xs text-zinc-500 font-mono">
          ↑ 気まずさポテンシャル U（低いほど最適）
        </p>
      )}
    </div>
  );
}
