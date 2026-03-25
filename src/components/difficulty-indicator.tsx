"use client";

import { Badge } from "@/components/ui/badge";
import { getDifficultyLabel, getDifficultyColor } from "@/lib/difficulty";
import type { Difficulty } from "@/types";

interface DifficultyIndicatorProps {
  level: Difficulty;
}

export function DifficultyIndicator({ level }: DifficultyIndicatorProps) {
  return (
    <Badge
      variant="outline"
      className="flex items-center gap-1.5 text-xs sm:text-sm"
    >
      <span className={`h-2 w-2 rounded-full ${getDifficultyColor(level)}`} />
      <span className="hidden sm:inline">Difficulty:</span>
      {getDifficultyLabel(level)}
    </Badge>
  );
}
