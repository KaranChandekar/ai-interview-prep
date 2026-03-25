"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnswerEvaluation } from "@/types";

interface FeedbackCardProps {
  evaluation: AnswerEvaluation;
}

export function FeedbackCard({ evaluation }: FeedbackCardProps) {
  const scoreColor =
    evaluation.score >= 80
      ? "text-emerald-600 bg-emerald-50 border-emerald-200"
      : evaluation.score >= 60
        ? "text-amber-600 bg-amber-50 border-amber-200"
        : "text-red-600 bg-red-50 border-red-200";

  const borderColor =
    evaluation.score >= 80
      ? "border-l-emerald-500"
      : evaluation.score >= 60
        ? "border-l-amber-500"
        : "border-l-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border-l-4 ${borderColor} shadow-md`}>
        <CardContent className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <Badge variant="secondary">{evaluation.category}</Badge>
            </div>
            <span
              className={`font-bold text-lg px-3 py-0.5 rounded-full border ${scoreColor}`}
            >
              {evaluation.score}/100
            </span>
          </div>

          {evaluation.strengths.length > 0 && (
            <div className="space-y-1">
              {evaluation.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}

          {evaluation.improvements.length > 0 && (
            <div className="space-y-1">
              {evaluation.improvements.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
