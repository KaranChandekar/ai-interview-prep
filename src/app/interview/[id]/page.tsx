"use client";

import { useParams, useSearchParams } from "next/navigation";
import { InterviewChat } from "@/components/interview-chat";
import { getTrack } from "@/lib/tracks";
import type { Difficulty } from "@/types";

export default function InterviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.id as string;
  const trackId = searchParams.get("track") || "frontend";
  const difficulty = (Number(searchParams.get("difficulty")) || 2) as Difficulty;
  const questionCount = Number(searchParams.get("questions")) || 8;

  const track = getTrack(trackId);

  if (!track) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/30">
        <p className="text-muted-foreground">Track not found.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <InterviewChat
        interviewId={id}
        track={track}
        initialDifficulty={difficulty}
        questionCount={questionCount}
      />
    </div>
  );
}
