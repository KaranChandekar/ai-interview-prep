"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  current: number;
  total: number;
}

export function ProgressTracker({ current, total }: ProgressTrackerProps) {
  const percentage = Math.min(Math.round((current / total) * 100), 100);

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap font-medium">
        Q{Math.min(current, total)}/{total}
      </span>
      <Progress value={percentage} className="h-2 w-12 sm:w-20" />
    </div>
  );
}
