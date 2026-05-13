'use client';

import type { UrinalChoice } from '@/types';

interface Props {
  choice: UrinalChoice | null;
}

export default function SelectedInfo({ choice }: Props) {
  if (!choice) {
    return (
      <div className="border border-zinc-800 rounded px-4 py-3 bg-zinc-950 text-xs font-mono text-zinc-600">
        便器を選んでください
      </div>
    );
  }

  return (
    <div className="border border-zinc-700 rounded px-4 py-3 bg-zinc-950 flex flex-col gap-1">
      <span className="text-xs font-mono text-zinc-500">▸ #{choice.targetUrinalIndex} を選択</span>
      {choice.sublabel && (
        <p className="text-sm text-zinc-300 leading-6">{choice.sublabel}</p>
      )}
    </div>
  );
}
