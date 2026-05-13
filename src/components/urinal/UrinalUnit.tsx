'use client';

import type { Urinal } from '@/types';

interface Props {
  urinal: Urinal;
  potential?: number;
  isChoice?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

const STATUS_CONFIG = {
  empty: {
    bg: 'bg-zinc-100 border-zinc-300',
    hoverBg: 'hover:bg-zinc-200',
    label: '空き',
  },
  occupied: {
    bg: 'bg-zinc-700 border-zinc-600',
    hoverBg: '',
    label: '使用中',
  },
  danger: {
    bg: 'bg-red-950 border-red-700',
    hoverBg: '',
    label: '危険',
  },
  broken: {
    bg: 'bg-zinc-800 border-zinc-600',
    hoverBg: '',
    label: '故障',
  },
} as const;

function potentialToColor(v: number): string {
  if (v < 0.2) return 'text-sky-400';
  if (v < 0.5) return 'text-green-400';
  if (v < 0.8) return 'text-amber-400';
  return 'text-red-400';
}

export default function UrinalUnit({ urinal, potential, isChoice, isSelected, onClick }: Props) {
  const config = STATUS_CONFIG[urinal.status];
  const isClickable = urinal.status === 'empty' && isChoice && !!onClick;

  const isChild = urinal.type === 'child';
  const isAccessible = urinal.type === 'accessible';

  const height = isChild ? 'h-12' : isAccessible ? 'h-24' : 'h-20';
  const width = isAccessible ? 'w-16' : 'w-14';

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
        title={urinal.note ?? config.label}
        className={[
          'relative flex flex-col items-center justify-center',
          `${width} ${height} rounded-sm border-2 transition-all duration-150`,
          config.bg,
          isClickable ? `${config.hoverBg} cursor-pointer` : 'cursor-default',
          isSelected ? 'ring-2 ring-offset-2 ring-white scale-105' : '',
          !isSelected && isChoice && urinal.status === 'empty' ? 'ring-1 ring-zinc-400' : '',
        ].join(' ')}
      >
        {/* 特殊タイプのバッジ */}
        {isAccessible && (
          <span className="text-base select-none text-blue-400">♿</span>
        )}
        {isChild && (
          <span className="text-xs select-none text-zinc-400 font-mono">child</span>
        )}

        {/* 使用中・危険の人物 */}
        {(urinal.status === 'occupied' || urinal.status === 'danger') && !isAccessible && !isChild && (
          <>
            <span className={`text-2xl font-mono select-none ${
              urinal.status === 'danger' ? 'text-red-400' : 'text-zinc-300'
            }`}>▮</span>
            <span className={`text-base select-none ${
              urinal.status === 'danger' ? 'text-red-300' : 'text-zinc-400'
            }`}>＊</span>
          </>
        )}
        {(urinal.status === 'occupied' || urinal.status === 'danger') && (isAccessible || isChild) && (
          <span className={`text-base select-none ${
            urinal.status === 'danger' ? 'text-red-300' : 'text-zinc-400'
          }`}>＊</span>
        )}

        {/* 故障 */}
        {urinal.status === 'broken' && (
          <>
            <span className="text-xl font-mono select-none text-zinc-500">✕</span>
            <span className="text-xs text-blue-400 select-none">〜</span>
          </>
        )}
      </button>

      <span className="text-xs text-zinc-500 font-mono">#{urinal.id}</span>

      {potential !== undefined && isFinite(potential) && (
        <span className={`text-xs font-mono ${potentialToColor(potential)}`}>
          {potential.toFixed(2)}
        </span>
      )}
    </div>
  );
}
