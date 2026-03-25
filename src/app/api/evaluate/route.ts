import { generateObject } from "ai";
import { interviewModel } from "@/lib/ai";
import { evaluationSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const { question, answer, trackName, categories, difficulty } =
    await req.json();

  const result = await generateObject({
    model: interviewModel,
    schema: evaluationSchema,
    prompt: `You are evaluating a candidate's answer in a ${trackName} interview.

Difficulty level: ${difficulty}/5
Available categories: ${categories.join(", ")}

Question asked: "${question}"
Candidate's answer: "${answer}"

Evaluate the answer and provide:
1. A score from 0-100
2. The category this question belongs to (must be one of the available categories)
3. Specific strengths in the answer
4. Specific areas for improvement
5. A suggested follow-up question`,
  });

  return Response.json(result.object);
}
