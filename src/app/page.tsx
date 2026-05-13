import Link from 'next/link';
import { SCENARIOS } from '@/data/scenarios';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-zinc-300 flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full flex flex-col gap-8">

        {/* ヘッダー */}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
            Laboratory for Lavatory Decision Science
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Moreru Machine
          </h1>
          <p className="text-sm font-mono text-zinc-500">
            モレる・マシン — 小便器最適選択シミュレーター
          </p>
        </div>

        <div className="border-t border-zinc-800" />

        {/* 概要 */}
        <div className="flex flex-col gap-4 text-sm leading-7 text-zinc-400">
          <p>
            男子トイレで、あなたはどこに立つか。
            この実験はその判断を
            <span className="text-zinc-200">気まずさポテンシャル場モデル</span>
            で解析する。
          </p>
          <p>
            7つのシナリオに答えてもらい、
            あなたのトイレ行動を4つの軸で分析する。
          </p>

          {/* 評価軸 */}
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {[
              ['social_distance', 'ソーシャルディスタンス', 'bg-sky-400'],
              ['rationality', '合理性', 'bg-green-400'],
              ['obedience', '忖度', 'bg-amber-400'],
              ['chaos', 'カオス耐性', 'bg-red-400'],
            ].map(([id, label, color]) => (
              <div key={id} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded px-3 py-2">
                <span className={`w-2 h-2 rounded-full ${color} shrink-0`} />
                <span className="text-zinc-300">{label}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-zinc-600 font-mono leading-6">
            ※ 個室（大）への逃走という選択肢は存在しない。
            すべては一列に並んだ小便器の中での話だ。
          </p>
        </div>

        {/* モデル注釈 */}
        <div className="border border-zinc-800 rounded bg-zinc-950 px-4 py-3 font-mono text-xs text-zinc-500 leading-6">
          <p className="text-zinc-400 mb-1">▸ 気まずさポテンシャルモデル</p>
          <p>U(xᵢ) = Σ kⱼ / |xᵢ − xⱼ|²</p>
          <p className="mt-1">k: occupied=1.0, danger=5.0, broken=0.8</p>
        </div>

        {/* 開始ボタン */}
        <Link
          href="/experiment"
          className="w-full text-center py-3 rounded border border-zinc-600 bg-zinc-900 text-white font-medium text-sm tracking-wide hover:bg-zinc-800 hover:border-zinc-400 transition-all duration-150"
        >
          実験を開始する →
        </Link>

        <p className="text-xs text-zinc-700 text-center font-mono">
          所要時間: 約 3 分 / {SCENARIOS.length} 問
        </p>
      </div>
    </main>
  );
}
