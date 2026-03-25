import { z } from "zod";

export const evaluationSchema = z.object({
  score: z.number().min(0).max(100).describe("Score from 0 to 100"),
  category: z.string().describe("The category this question belongs to"),
  strengths: z
    .array(z.string())
    .describe("What the candidate did well"),
  improvements: z
    .array(z.string())
    .describe("Areas where the candidate can improve"),
  followUpSuggestion: z
    .string()
    .describe("A suggested follow-up question or topic"),
});

export const reportSchema = z.object({
  overallScore: z.number().min(0).max(100),
  categoryScores: z.array(
    z.object({
      category: z.string(),
      score: z.number().min(0).max(100),
      questionsAsked: z.number(),
    })
  ),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  recommendations: z.array(z.string()),
});

export type EvaluationResult = z.infer<typeof evaluationSchema>;
export type ReportResult = z.infer<typeof reportSchema>;
