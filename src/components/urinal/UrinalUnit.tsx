'use client';

import type { Urinal } from '@/types';

interface Props {
  urinal: Urinal;
  /** ポテンシャル値（0〜1 の正規化済み、undefined なら非表示） */
  potential?: number;
  /** ハイライト（選択肢 A or B の対象便器） */
  highlight?: 'A' | 'B' | null;
  /** クリックハンドラ */
  onClick?: () => void;
  isSelected?: boolean;
}

const STATUS_CONFIG = {
  empty: {
    bg: 'bg-zinc-100 border-zinc-300',
    hoverBg: 'hover:bg-zinc-200',
    icon: '▯',
    label: '空き',
  },
  occupied: {
    bg: 'bg-zinc-700 border-zinc-600',
    hoverBg: '',
    icon: '▮',
    label: '使用中',
  },
  danger: {
    bg: 'bg-red-950 border-red-700',
    hoverBg: '',
    icon: '▮',
    label: '危険',
  },
  broken: {
    bg: 'bg-zinc-800 border-zinc-600',
    hoverBg: '',
    icon: '✕',
    label: '故障',
  },
} as const;

const HIGHLIGHT_RING = {
  A: 'ring-2 ring-offset-2 ring-sky-400',
  B: 'ring-2 ring-offset-2 ring-amber-400',
} as const;

/** ポテンシャル値を熱マップ風の色に変換 */
function potentialToColor(v: number): string {
  if (v < 0.2) return 'text-sky-400';
  if (v < 0.5) return 'text-green-400';
  if (v < 0.8) return 'text-amber-400';
  return 'text-red-400';
}

export default function UrinalUnit({ urinal, potential, highlight, onClick, isSelected }: Props) {
  const config = STATUS_CONFIG[urinal.status];
  const isClickable = urinal.status === 'empty' && !!onClick;

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
        title={urinal.note ?? config.label}
        className={[
          'relative flex flex-col items-center justify-center',
          'w-14 h-20 rounded-sm border-2 transition-all duration-150',
          config.bg,
          isClickable ? `${config.hoverBg} cursor-pointer` : 'cursor-default',
          highlight ? HIGHLIGHT_RING[highlight] : '',
          isSelected ? 'scale-105' : '',
        ].join(' ')}
      >
        {/* 便器アイコン */}
        <span className={`text-2xl font-mono select-none ${
          urinal.status === 'empty' ? 'text-zinc-400' :
          urinal.status === 'danger' ? 'text-red-400' :
          urinal.status === 'broken' ? 'text-zinc-500' :
          'text-zinc-300'
        }`}>
          {config.icon}
        </span>

        {/* 故障の水たまり表現 */}
        {urinal.status === 'broken' && (
          <span className="text-xs text-blue-400 select-none">〜</span>
        )}

        {/* 使用中の人物表現 */}
        {(urinal.status === 'occupied' || urinal.status === 'danger') && (
          <span className={`text-base select-none ${urinal.status === 'danger' ? 'text-red-300' : 'text-zinc-400'}`}>
            ＊
          </span>
        )}

        {/* 選択肢ラベル */}
        {highlight && (
          <span className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
            highlight === 'A' ? 'bg-sky-500 text-white' : 'bg-amber-500 text-white'
          }`}>
            {highlight}
          </span>
        )}
      </button>

      {/* インデックス番号 */}
      <span className="text-xs text-zinc-500 font-mono">#{urinal.id}</span>

      {/* ポテンシャル値表示 */}
      {potential !== undefined && isFinite(potential) && (
        <span className={`text-xs font-mono ${potentialToColor(potential)}`}>
          {potential.toFixed(2)}
        </span>
      )}
    </div>
  );
}
