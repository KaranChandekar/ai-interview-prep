"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowRight, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VoiceInput } from "@/components/voice-input";
import { VoiceOutput } from "@/components/voice-output";
import { Timer } from "@/components/timer";
import { DifficultyIndicator } from "@/components/difficulty-indicator";
import { ProgressTracker } from "@/components/progress-tracker";
import { FeedbackCard } from "@/components/feedback-card";
import { calculateNextDifficulty } from "@/lib/difficulty";
import { updateCategoryScores } from "@/lib/scoring";
import type {
  Track,
  Difficulty,
  InterviewState,
  CategoryScore,
  AnswerEvaluation,
} from "@/types";

interface InterviewChatProps {
  interviewId: string;
  track: Track;
  initialDifficulty: Difficulty;
  questionCount: number;
}

function getMessageText(message: {
  parts?: Array<{ type: string; text?: string }>;
  content?: string;
}): string {
  // Try parts first (AI SDK v6)
  if (message.parts && Array.isArray(message.parts)) {
    const text = message.parts
      .filter(
        (p): p is { type: "text"; text: string } =>
          p.type === "text" && typeof p.text === "string"
      )
      .map((p) => p.text)
      .join("");
    if (text) return text;
  }
  // Fallback to content (older AI SDK versions)
  if (typeof message.content === "string") return message.content;
  return "";
}

function parseScoreFromMessage(content: string): number | null {
  const match = content.match(/\*\*Score:\*\*\s*(\d+)\/100/);
  return match ? parseInt(match[1], 10) : null;
}

function parseCategoryFromMessage(content: string): string | null {
  const match = content.match(/\*\*Category:\*\*\s*(.+?)(?:\n|$)/);
  return match ? match[1].trim() : null;
}

export function InterviewChat({
  interviewId,
  track,
  initialDifficulty,
  questionCount,
}: InterviewChatProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [currentDifficulty, setCurrentDifficulty] =
    useState<Difficulty>(initialDifficulty);
  const [categoryScores, setCategoryScores] = useState<CategoryScore[]>([]);
  const [evaluations, setEvaluations] = useState<AnswerEvaluation[]>([]);
  const [recentScores, setRecentScores] = useState<number[]>([]);
  const [difficultyProgression, setDifficultyProgression] = useState<number[]>([
    initialDifficulty,
  ]);
  const [lastEvaluation, setLastEvaluation] =
    useState<AnswerEvaluation | null>(null);
  const [timerReset, setTimerReset] = useState(0);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const initializedRef = useRef(false);
  const difficultyRef = useRef(currentDifficulty);
  const scoresRef = useRef(categoryScores);
  difficultyRef.current = currentDifficulty;
  scoresRef.current = categoryScores;

  const { messages, sendMessage, status } = useChat({
    transport: new TextStreamChatTransport({
      api: "/api/interview",
      body: () => ({
        trackName: track.name,
        categories: track.categories,
        difficulty: difficultyRef.current,
        performanceHistory: scoresRef.current,
      }),
    }),
    onFinish: ({ message }) => {
      const text = getMessageText(message);
      const score = parseScoreFromMessage(text);
      const category = parseCategoryFromMessage(text);

      if (score !== null && category) {
        const evaluation: AnswerEvaluation = {
          score,
          category,
          strengths: [],
          improvements: [],
        };

        setEvaluations((prev) => [...prev, evaluation]);
        setCategoryScores((prev) => updateCategoryScores(prev, evaluation));
        setLastEvaluation(evaluation);

        setRecentScores((prev) => {
          const newRecent = [...prev.slice(-2), score];
          const nextDifficulty = calculateNextDifficulty(
            currentDifficulty,
            newRecent
          );
          if (nextDifficulty !== currentDifficulty) {
            setCurrentDifficulty(nextDifficulty);
            setDifficultyProgression((dp) => [...dp, nextDifficulty]);
          }
          return newRecent;
        });

        setCurrentQuestion((prev) => {
          if (prev >= questionCount) {
            setIsInterviewComplete(true);
          }
          return prev + 1;
        });
        setTimerReset((prev) => prev + 1);
      }
    },
  });

  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      sendMessage({
        text: `Start the ${track.name} interview at difficulty level ${initialDifficulty}/5. Ask me the first question.`,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleVoiceTranscript = (text: string) => {
    setInput(text);
  };

  const finishInterview = () => {
    const state: InterviewState = {
      id: interviewId,
      config: {
        trackId: track.id,
        difficulty: initialDifficulty,
        questionCount,
        timerEnabled: true,
        voiceEnabled: true,
      },
      currentQuestion,
      currentDifficulty,
      categoryScores,
      evaluations,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    sessionStorage.setItem(`interview-${interviewId}`, JSON.stringify(state));
    sessionStorage.setItem(
      `interview-${interviewId}-difficulty`,
      JSON.stringify(difficultyProgression)
    );
    router.push(`/results/${interviewId}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background via-background to-muted/30">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2 sm:gap-4 shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-sm sm:text-lg font-semibold flex items-center gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-2xl">{track.icon}</span>
            <span className="hidden sm:inline">{track.name}</span>
          </span>
          <DifficultyIndicator level={currentDifficulty} />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <ProgressTracker current={currentQuestion} total={questionCount} />
          <Timer
            duration={180}
            isRunning={!isStreaming && !isInterviewComplete}
            onReset={timerReset}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => {
            const text = getMessageText(message);
            if (message.role === "user" && text.startsWith("Start the"))
              return null;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center shadow-md">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <Card
                  className={`max-w-[85%] sm:max-w-[75%] ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-card shadow-md border-border/50"
                  }`}
                >
                  <CardContent className="py-3 px-4">
                    <div className="flex items-start gap-2">
                      <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                        {text || (
                          <span className="text-muted-foreground italic">
                            Thinking...
                          </span>
                        )}
                      </div>
                      {message.role === "assistant" && text && (
                        <VoiceOutput text={text} />
                      )}
                    </div>
                  </CardContent>
                </Card>
                {message.role === "user" && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-chart-2 to-chart-5 flex items-center justify-center shadow-md">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isStreaming &&
          messages.length > 0 &&
          !getMessageText(messages[messages.length - 1]) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 justify-start"
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center shadow-md">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <Card className="bg-card shadow-md">
                <CardContent className="py-3 px-4">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

        {lastEvaluation && <FeedbackCard evaluation={lastEvaluation} />}

        <div ref={scrollRef} />
      </div>

      {/* Input */}
      {isInterviewComplete ? (
        <div className="border-t bg-card/80 backdrop-blur-sm p-3 sm:p-4">
          <Button
            onClick={finishInterview}
            className="w-full bg-gradient-to-r from-primary to-chart-4 hover:from-primary/90 hover:to-chart-4/90 text-white shadow-lg"
            size="lg"
          >
            View Results <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="border-t bg-card/80 backdrop-blur-sm p-3 sm:p-4 flex gap-2 shrink-0"
        >
          <VoiceInput
            onTranscript={handleVoiceTranscript}
            disabled={isStreaming}
          />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
            className="flex-1 resize-none rounded-xl border border-border/60 bg-background px-3 sm:px-4 py-2.5 text-sm min-h-[44px] max-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isStreaming || !input.trim()}
            className="shrink-0 bg-gradient-to-r from-primary to-chart-4 hover:from-primary/90 hover:to-chart-4/90 text-white shadow-md"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      )}
    </div>
  );
}
