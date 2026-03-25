"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  RotateCcw,
  Trophy,
  TrendingUp,
  Target,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PerformanceChart } from "@/components/performance-chart";
import { calculateOverallScore } from "@/lib/scoring";
import { getDifficultyLabel } from "@/lib/difficulty";
import type { InterviewState, PerformanceReport, Difficulty } from "@/types";

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [state, setState] = useState<InterviewState | null>(null);
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(`interview-${id}`);
    const diffProg = sessionStorage.getItem(`interview-${id}-difficulty`);

    if (!stored) {
      setLoading(false);
      return;
    }

    const parsed: InterviewState = JSON.parse(stored);
    setState(parsed);

    const difficultyProgression: number[] = diffProg
      ? JSON.parse(diffProg)
      : [parsed.config.difficulty];

    fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trackName: parsed.config.trackId,
        evaluations: parsed.evaluations,
        categoryScores: parsed.categoryScores,
        difficultyProgression,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setReport({
          ...data,
          difficultyProgression,
        });
        setLoading(false);
      })
      .catch(() => {
        setReport({
          overallScore: calculateOverallScore(parsed.categoryScores),
          categoryScores: parsed.categoryScores,
          strengths: ["Completed the interview"],
          areasForImprovement: ["Review detailed feedback above"],
          recommendations: ["Practice more interviews"],
          difficultyProgression,
        });
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <p className="text-muted-foreground font-medium">
            Generating your report...
          </p>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No interview data found.</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const overallScore =
    report?.overallScore ?? calculateOverallScore(state.categoryScores);
  const scoreColor =
    overallScore >= 80
      ? "from-emerald-500 to-green-500"
      : overallScore >= 60
        ? "from-amber-500 to-yellow-500"
        : "from-red-500 to-orange-500";

  return (
    <main className="flex-1 bg-gradient-to-b from-background via-background to-muted/30 min-h-screen">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <Button variant="ghost" onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> New Interview
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              <RotateCcw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </div>

          {/* Score Overview */}
          <Card className="overflow-hidden">
            <div className="relative">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${scoreColor} opacity-10`}
              />
              <CardContent className="relative pt-8 pb-8">
                <div className="text-center space-y-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      delay: 0.2,
                    }}
                  >
                    <Trophy className="h-14 w-14 mx-auto text-primary" />
                  </motion.div>
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    Interview Complete!
                  </h1>
                  <motion.p
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className={`text-5xl sm:text-6xl font-bold bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}
                  >
                    {overallScore}
                    <span className="text-xl sm:text-2xl text-muted-foreground">
                      /100
                    </span>
                  </motion.p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      {state.currentQuestion - 1} questions answered
                    </Badge>
                    <Badge variant="outline">
                      {getDifficultyLabel(
                        state.currentDifficulty as Difficulty
                      )}{" "}
                      level
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Radar Chart */}
          {state.categoryScores.length > 0 && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Performance by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart scores={state.categoryScores} />
              </CardContent>
            </Card>
          )}

          {/* Strengths & Improvements */}
          {report && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-md border-l-4 border-l-emerald-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.strengths.map((s, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-emerald-500 font-bold mt-0.5">
                          +
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-md border-l-4 border-l-amber-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-amber-500" />
                    Areas to Improve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.areasForImprovement.map((s, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">
                          -
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recommendations */}
          {report && report.recommendations.length > 0 && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {report.recommendations.map((r, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-primary font-bold">{i + 1}.</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Difficulty Progression */}
          {report && report.difficultyProgression.length > 1 && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">
                  Difficulty Progression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 flex-wrap">
                  {report.difficultyProgression.map((d, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <Badge
                        variant={
                          i === report.difficultyProgression.length - 1
                            ? "default"
                            : "outline"
                        }
                        className={
                          i === report.difficultyProgression.length - 1
                            ? "bg-primary"
                            : ""
                        }
                      >
                        {getDifficultyLabel(d as Difficulty)}
                      </Badge>
                      {i < report.difficultyProgression.length - 1 && (
                        <span className="text-muted-foreground text-lg">
                          &rarr;
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </main>
  );
}
