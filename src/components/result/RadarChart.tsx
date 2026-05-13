'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import type { UserScores } from '@/types';
import { toChartData } from '@/lib/scoring';

interface Props {
  scores: UserScores;
}

export default function ScoreRadarChart({ scores }: Props) {
  const data = toChartData(scores);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="#3f3f46" />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'monospace' }}
        />
        <Radar
          dataKey="value"
          stroke="#a1a1aa"
          fill="#a1a1aa"
          fillOpacity={0.15}
          strokeWidth={1.5}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
