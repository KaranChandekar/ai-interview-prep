---
name: ai-interview-prep
description: "Build an AI-powered mock interview platform with adaptive difficulty, voice mode, and performance analytics. Use this skill whenever the user wants to work on the interview prep project, mentions mock interview, interview practice, adaptive questions, speech-to-text interview, interview analytics, or wants to build/extend/debug any part of this application. Also trigger when the user mentions Web Speech API, interview tracks, difficulty adjustment, or performance dashboard in the context of this project."
---

# AI-Powered Interview Prep Platform

## What You're Building

An adaptive mock interview platform where AI conducts technical and behavioral interviews, adjusts question difficulty based on performance, provides real-time feedback, and generates detailed performance reports. Supports both text and voice interaction using the browser's built-in Web Speech API (completely free).

## Architecture Overview

```
app/
├── layout.tsx
├── page.tsx                      # Role/track selection
├── interview/[id]/page.tsx       # Active interview session
├── results/[id]/page.tsx         # Performance report
├── api/
│   ├── interview/route.ts        # AI interview conductor
│   ├── evaluate/route.ts         # Answer evaluation
│   └── report/route.ts           # Generate performance report
├── components/
│   ├── track-selector.tsx        # Choose role + difficulty
│   ├── interview-chat.tsx        # Chat-based interview UI
│   ├── voice-input.tsx           # Web Speech API microphone
│   ├── voice-output.tsx          # Text-to-speech for AI questions
│   ├── timer.tsx                 # Per-question countdown
│   ├── feedback-card.tsx         # Real-time answer feedback
│   ├── performance-chart.tsx     # Radar/spider chart of skills
│   ├── progress-tracker.tsx      # Question progress bar
│   └── difficulty-indicator.tsx  # Current difficulty level
├── lib/
│   ├── ai.ts                    # AI SDK config
│   ├── schemas.ts               # Zod schemas
│   ├── tracks.ts                # Interview track definitions
│   ├── difficulty.ts            # Adaptive difficulty algorithm
│   ├── speech.ts                # Web Speech API helpers
│   └── scoring.ts               # Answer scoring logic
└── types/
    └── index.ts
```

## Tech Stack & Setup

```bash
npx create-next-app@latest interview-prep --typescript --tailwind --eslint --app
cd interview-prep

# Core AI
npm install ai @ai-sdk/google zod

# Visualization (performance analytics)
npm install recharts

# Auth + DB (optional, for saving progress)
npm install @supabase/supabase-js @supabase/ssr
# npm install @clerk/nextjs  # Alternative auth

# UI
npm install framer-motion lucide-react
npx shadcn@latest init
npx shadcn@latest add button card tabs badge progress avatar select radio-group dialog
```

### Environment Variables

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
# Optional: Supabase for saving sessions
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Core Implementation Strategy

### 1. Interview Tracks

Define different interview paths with question categories and skill dimensions.

```typescript
// lib/tracks.ts
export const tracks = {
  frontend: {
    name: "Frontend Engineer",
    categories: ["React", "CSS/Layout", "Performance", "Accessibility", "System Design", "JavaScript"],
    difficulties: ["junior", "mid", "senior", "staff"],
    behavioralTopics: ["collaboration", "conflict-resolution", "leadership", "failure-stories"],
  },
  backend: {
    name: "Backend Engineer",
    categories: ["APIs", "Databases", "System Design", "Security", "Scalability", "Algorithms"],
    // ...
  },
  fullstack: { /* ... */ },
};
```

### 2. Adaptive Difficulty Algorithm

Track the user's performance per category and adjust difficulty dynamically.

```typescript
// lib/difficulty.ts
export function calculateNextDifficulty(
  currentLevel: number,    // 1-5
  recentScores: number[]   // Last 3 answer scores (0-100)
): number {
  const avg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;

  if (avg > 80 && recentScores.length >= 2) return Math.min(currentLevel + 1, 5);
  if (avg < 40 && recentScores.length >= 2) return Math.max(currentLevel - 1, 1);
  return currentLevel;
}
```

### 3. AI Interview Conductor

The AI asks questions, evaluates answers, provides feedback, and decides the next question based on performance.

```typescript
// app/api/interview/route.ts
import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  const { messages, track, difficulty, performanceHistory } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: `You are a ${track.name} interviewer at a top tech company.

Current difficulty: ${difficulty}/5
Performance so far: ${JSON.stringify(performanceHistory)}

Interview guidelines:
- Ask one question at a time
- After the candidate answers, provide brief feedback (1-2 sentences)
- Score their answer 0-100 and explain the score
- Then ask a follow-up or move to the next topic
- Adjust complexity based on their performance
- Mix technical and behavioral questions
- For coding questions, ask them to explain their approach before writing code
- Be encouraging but honest about areas for improvement

Format each response as:
**Feedback on previous answer:** (if applicable)
**Score:** X/100
**Next question:** Your question here`,
    messages,
  });

  return result.toDataStreamResponse();
}
```

### 4. Voice Mode with Web Speech API

The Web Speech API is built into all modern browsers — completely free, no API key needed.

```typescript
// lib/speech.ts
export function createSpeechRecognition(): SpeechRecognition | null {
  if (typeof window === "undefined") return null;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";
  return recognition;
}

export function speak(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}
```

```typescript
// components/voice-input.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

export function VoiceInput({ onTranscript }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  const toggle = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current = createSpeechRecognition();
      recognitionRef.current.onresult = (event) => {
        const text = Array.from(event.results)
          .map(r => r[0].transcript).join("");
        setTranscript(text);
      };
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  return (
    <div>
      <button onClick={toggle} className={isListening ? "bg-red-500" : "bg-primary"}>
        {isListening ? <MicOff /> : <Mic />}
      </button>
      {transcript && <p className="text-sm mt-2">{transcript}</p>}
    </div>
  );
}
```

### 5. Performance Analytics

After the interview, generate a radar chart showing strengths and weaknesses by category.

```typescript
// components/performance-chart.tsx
import { RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

export function PerformanceChart({ scores }) {
  // scores: [{ category: "React", score: 85 }, { category: "CSS", score: 60 }, ...]
  return (
    <RadarChart data={scores} width={400} height={400}>
      <PolarGrid />
      <PolarAngleAxis dataKey="category" />
      <Radar dataKey="score" fill="#1a73e8" fillOpacity={0.3} stroke="#1a73e8" />
    </RadarChart>
  );
}
```

## Implementation Phases

### Phase 1: Core Interview (Week 1)
- Track and difficulty selection
- AI interview chat (text-based)
- Per-answer scoring and feedback
- Question progress tracking
- Basic interview completion summary

### Phase 2: Voice + Adaptive (Week 2)
- Web Speech API voice input
- Text-to-speech for AI questions
- Adaptive difficulty algorithm
- Per-category performance tracking
- Timer per question (optional pressure mode)

### Phase 3: Analytics & Polish (Week 3)
- Radar chart performance analytics
- Historical progress tracking (Supabase)
- Company-specific interview style presets
- Interview tips based on weak areas
- Share results / export PDF
- Mobile responsive design

## Free Resources

| Resource | Purpose | Free Tier |
|----------|---------|-----------|
| Google Gemini API | AI interviewer | ~1M tokens/day |
| Web Speech API | Voice input/output | Built into browsers, free |
| Recharts | Analytics charts | Open source |
| Supabase | Save progress | 500MB free |
| Vercel | Hosting | 100GB bandwidth |

## Resume Talking Points

- **Meta-relevance**: Use this project during your actual interview. Instant conversation starter.
- **Web Speech API**: Browser-native voice interaction with zero API costs.
- **Adaptive algorithms**: Difficulty adjustment based on rolling performance shows algorithmic thinking.
- **Multimodal UX**: Text + voice input, visual analytics, real-time feedback — demonstrates UX depth.
