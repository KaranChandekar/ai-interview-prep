"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { CategoryScore } from "@/types";

interface PerformanceChartProps {
  scores: CategoryScore[];
}

export function PerformanceChart({ scores }: PerformanceChartProps) {
  const data = scores.map((s) => ({
    category: s.category,
    score: s.score,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="var(--color-border)" strokeOpacity={0.5} />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 10 }}
          tickCount={5}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="var(--color-primary)"
          fill="var(--color-primary)"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
