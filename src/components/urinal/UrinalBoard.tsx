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

function EntranceDoor() {
  return (
    <div className="flex flex-col items-center gap-1">
      {/* ドア枠（上が開口、下が床レベル） */}
      <div className="relative w-12 h-8 border-2 border-b-0 border-zinc-400 rounded-t flex items-center justify-center">
        {/* 矢印 */}
        <span className="text-zinc-200 text-base leading-none select-none">↓</span>
        {/* ドアノブ */}
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-zinc-400" />
      </div>
      <span className="text-xs font-mono text-zinc-400 tracking-wider">入口</span>
    </div>
  );
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
    <div className="flex flex-col items-center gap-3">
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

      {/* 床ライン（入口部分に切れ目） */}
      {entrance ? (
        <div className="w-full flex items-center">
          {entrance === 'left' ? (
            <>
              <div className="w-14 flex-shrink-0" />
              <div className="flex-1 h-1 bg-zinc-600 rounded-r" />
            </>
          ) : (
            <>
              <div className="flex-1 h-1 bg-zinc-600 rounded-l" />
              <div className="w-14 flex-shrink-0" />
            </>
          )}
        </div>
      ) : (
        <div className="w-full h-1 bg-zinc-600 rounded" />
      )}

      {/* 入口ドア */}
      {entrance && (
        <div className={`w-full flex mt-0 ${entrance === 'left' ? 'justify-start' : 'justify-end'}`}>
          <div className="w-14 flex justify-center">
            <EntranceDoor />
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
