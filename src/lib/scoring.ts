import { CategoryScore, AnswerEvaluation } from "@/types";

export function updateCategoryScores(
  existing: CategoryScore[],
  evaluation: AnswerEvaluation
): CategoryScore[] {
  const updated = [...existing];
  const idx = updated.findIndex((c) => c.category === evaluation.category);

  if (idx >= 0) {
    const prev = updated[idx];
    const totalScore =
      (prev.score * prev.questionsAsked + evaluation.score) /
      (prev.questionsAsked + 1);
    updated[idx] = {
      ...prev,
      score: Math.round(totalScore),
      questionsAsked: prev.questionsAsked + 1,
    };
  } else {
    updated.push({
      category: evaluation.category,
      score: evaluation.score,
      questionsAsked: 1,
    });
  }

  return updated;
}

export function calculateOverallScore(scores: CategoryScore[]): number {
  if (scores.length === 0) return 0;
  const total = scores.reduce((sum, s) => sum + s.score, 0);
  return Math.round(total / scores.length);
}
