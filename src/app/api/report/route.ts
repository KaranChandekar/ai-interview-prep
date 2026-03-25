import { generateObject } from "ai";
import { interviewModel } from "@/lib/ai";
import { reportSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const { trackName, evaluations, categoryScores, difficultyProgression } =
    await req.json();

  const result = await generateObject({
    model: interviewModel,
    schema: reportSchema,
    prompt: `Generate a comprehensive performance report for a ${trackName} mock interview.

Individual evaluations:
${JSON.stringify(evaluations, null, 2)}

Category scores so far:
${JSON.stringify(categoryScores, null, 2)}

Difficulty progression during interview: ${difficultyProgression.join(" → ")}

Provide:
1. An overall score (0-100)
2. Final category scores
3. Top strengths demonstrated
4. Key areas for improvement
5. Specific study recommendations`,
  });

  return Response.json(result.object);
}
