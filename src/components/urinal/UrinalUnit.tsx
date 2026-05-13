'use client';

import type { Urinal } from '@/types';

interface Props {
  urinal: Urinal;
  potential?: number;
  isChoice?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

function potentialToColor(v: number): string {
  if (v < 0.2) return 'text-sky-400';
  if (v < 0.5) return 'text-green-400';
  if (v < 0.8) return 'text-amber-400';
  return 'text-red-400';
}

function PersonFigure({ color }: { color: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className={`w-3.5 h-3.5 rounded-full ${color}`} />
      <div className={`w-5 h-5 rounded-t-full ${color} opacity-90`} />
    </div>
  );
}

export default function UrinalUnit({ urinal, potential, isChoice, isSelected, onClick }: Props) {
  const isClickable = urinal.status === 'empty' && isChoice && !!onClick;
  const isChild = urinal.type === 'child';
  const isAccessible = urinal.type === 'accessible';

  const width = 'w-14';
  const height = isChild ? 'h-14' : 'h-20';

  // 状態ごとの配色
  const bgMap = {
    empty:    'bg-zinc-100 border-zinc-300',
    occupied: 'bg-zinc-600 border-zinc-500',
    danger:   'bg-red-950 border-red-700',
    broken:   'bg-zinc-800 border-zinc-600',
    wet:      'bg-zinc-800 border-blue-800',
  };

  const bg = bgMap[urinal.status];

  return (
    <div className="flex flex-col items-center gap-1">
      {/* 壁取り付けプレート */}
      <div className={`w-14 h-1.5 rounded-t-sm ${
        isSelected ? 'bg-white' : 'bg-zinc-600'
      }`} />

      {/* 便器本体（底を丸くして便器シルエットに） */}
      <button
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
        title={urinal.note ?? urinal.status}
        style={{ borderRadius: '4px 4px 45% 45% / 4px 4px 35% 35%' }}
        className={[
          'relative flex flex-col items-center justify-center gap-1',
          `${width} ${height}`,
          'border-2 transition-all duration-150',
          bg,
          isClickable ? 'hover:brightness-90 cursor-pointer' : 'cursor-default',
          isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-zinc-950 scale-105 brightness-110' : '',
          !isSelected && isChoice && urinal.status === 'empty' ? 'ring-1 ring-zinc-400 ring-offset-1 ring-offset-zinc-950' : '',
        ].join(' ')}
      >
        {/* 内部コンテンツ */}
        {urinal.status === 'empty' && (
          <>
            {isAccessible && <span className="text-base text-blue-400 select-none">♿</span>}
            {isChild && <span className="text-xs font-mono text-zinc-400 select-none">child</span>}
            {/* 排水口 */}
            <div className="absolute bottom-2 w-2 h-1 rounded-full bg-zinc-300/40" />
          </>
        )}

        {(urinal.status === 'occupied') && (
          <PersonFigure color="bg-zinc-300" />
        )}

        {urinal.status === 'danger' && (
          <>
            <PersonFigure color="bg-red-400" />
            <span className="text-xs font-mono text-red-500 select-none leading-none">!</span>
          </>
        )}

        {urinal.status === 'broken' && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-mono text-zinc-500 select-none leading-none">✕</span>
            <span className="text-xs font-mono text-zinc-500 select-none">故障</span>
          </div>
        )}

        {urinal.status === 'wet' && (
          <div className="flex flex-col items-center gap-0.5">
            <div className="absolute bottom-2 flex gap-0.5">
              <div className="w-1 h-1 rounded-full bg-blue-400/70" />
              <div className="w-2 h-1 rounded-full bg-blue-400/50" />
              <div className="w-1 h-1 rounded-full bg-blue-400/70" />
            </div>
            <span className="text-xs text-blue-400/80 select-none font-mono">〜〜</span>
          </div>
        )}
      </button>

      {/* 番号 */}
      <span className="text-xs text-zinc-500 font-mono">#{urinal.id}</span>

      {potential !== undefined && isFinite(potential) && (
        <span className={`text-xs font-mono ${potentialToColor(potential)}`}>
          {potential.toFixed(2)}
        </span>
      )}
    </div>
  );
}
