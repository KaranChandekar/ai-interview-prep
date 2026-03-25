import { Difficulty } from "@/types";

export function calculateNextDifficulty(
  currentLevel: Difficulty,
  recentScores: number[]
): Difficulty {
  if (recentScores.length < 2) return currentLevel;

  const avg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;

  if (avg > 80) return Math.min(currentLevel + 1, 5) as Difficulty;
  if (avg < 40) return Math.max(currentLevel - 1, 1) as Difficulty;
  return currentLevel;
}

export function getDifficultyLabel(level: Difficulty): string {
  const labels: Record<Difficulty, string> = {
    1: "Entry Level",
    2: "Junior",
    3: "Mid-Level",
    4: "Senior",
    5: "Staff+",
  };
  return labels[level];
}

export function getDifficultyColor(level: Difficulty): string {
  const colors: Record<Difficulty, string> = {
    1: "bg-green-500",
    2: "bg-blue-500",
    3: "bg-yellow-500",
    4: "bg-orange-500",
    5: "bg-red-500",
  };
  return colors[level];
}
