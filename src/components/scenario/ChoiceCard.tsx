'use client';

import type { Choice } from '@/types';

interface Props {
  choice: Choice;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ChoiceCard({ choice, isSelected, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className={[
        'w-full text-left px-5 py-4 rounded border transition-all duration-150',
        'flex flex-col gap-1',
        isSelected
          ? choice.id === 'A'
            ? 'border-sky-400 bg-sky-950/40 text-sky-100'
            : 'border-amber-400 bg-amber-950/40 text-amber-100'
          : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800',
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
          choice.id === 'A'
            ? isSelected ? 'bg-sky-500 text-white' : 'bg-zinc-700 text-zinc-300'
            : isSelected ? 'bg-amber-500 text-white' : 'bg-zinc-700 text-zinc-300'
        }`}>
          {choice.id}
        </span>
        <span className="font-medium text-sm">{choice.label}</span>
      </div>
      {choice.sublabel && (
        <p className="text-xs text-zinc-500 font-mono leading-relaxed pl-10">
          {choice.sublabel}
        </p>
      )}
    </button>
  );
}
