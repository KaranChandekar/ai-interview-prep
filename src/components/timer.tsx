"use client";

import { useState, useEffect, useCallback } from "react";
import { Timer as TimerIcon } from "lucide-react";

interface TimerProps {
  duration: number;
  onTimeUp?: () => void;
  isRunning: boolean;
  onReset?: number;
}

export function Timer({ duration, onTimeUp, isRunning, onReset }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, onReset]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimeUp]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const percentage = (timeLeft / duration) * 100;
  const isLow = timeLeft < 30;
  const isMedium = timeLeft < 60 && !isLow;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <TimerIcon
        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
          isLow
            ? "text-red-500 animate-pulse"
            : isMedium
              ? "text-amber-500"
              : "text-muted-foreground"
        }`}
      />
      <span
        className={`font-mono text-xs sm:text-sm ${
          isLow
            ? "text-red-500 font-bold"
            : isMedium
              ? "text-amber-500 font-semibold"
              : "text-muted-foreground"
        }`}
      >
        {formatTime(timeLeft)}
      </span>
      <div className="w-10 sm:w-16 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isLow
              ? "bg-red-500"
              : isMedium
                ? "bg-amber-500"
                : "bg-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
