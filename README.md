# AI Interview Prep

An adaptive AI-powered mock interview platform built with Next.js 15. Practice technical and behavioral interviews with an AI interviewer that adjusts difficulty in real-time, supports voice interaction via the browser's Web Speech API, and generates detailed performance analytics.

## Features

- **14 Interview Tracks** — Frontend, Backend, Fullstack, Data Engineering, DevOps, Mobile, ML/AI, Product Management, QA, Security, Cloud Architect, UX Design, DSA, and Behavioral
- **Adaptive Difficulty** — 5 levels (Entry → Staff+) that automatically adjust based on your rolling performance scores
- **Voice Mode** — Speak your answers and hear questions read aloud using the browser's built-in Web Speech API (SpeechRecognition + SpeechSynthesis) — completely free, no API keys needed
- **Real-Time Feedback** — Per-answer scoring (0–100) with detailed feedback after each response
- **Performance Analytics** — Radar charts showing strengths and weaknesses across skill categories
- **Timed Practice** — Optional per-question countdown timer to simulate interview pressure
- **Responsive Design** — Works on mobile, tablet, and desktop

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 15](https://nextjs.org) | App Router, React Server Components |
| [Vercel AI SDK](https://sdk.vercel.ai) | `streamText` and `generateObject` for AI interactions |
| [Google Gemini](https://ai.google.dev) (gemini-2.5-flash) | AI interviewer model |
| [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) | Browser-native voice input/output |
| [Recharts](https://recharts.org) | Radar chart performance analytics |
| [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS](https://tailwindcss.com) | UI components and styling |
| [Framer Motion](https://www.framer.com/motion) | Animations and transitions |
| [Zod](https://zod.dev) | Schema validation for AI structured outputs |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/apikey) API key (free tier: ~1M tokens/day)

### Installation

```bash
git clone https://github.com/KaranChandekar/ai-interview-prep.git
cd ai-interview-prep
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## App Flow

### 1. Track Selection (Home Page)

The landing page displays all 14 interview tracks as color-coded cards. Each card shows the role title, description, and top skill categories. Clicking a card opens a settings dialog.

### 2. Interview Configuration (Settings Dialog)

Configure your session without leaving the page:

- **Starting Difficulty** — Slider from Entry (1) to Staff+ (5)
- **Number of Questions** — 5 (quick) to 20 (full session)
- **Timer Toggle** — Enable/disable per-question countdown
- **Voice Toggle** — Enable/disable voice input and text-to-speech

### 3. Active Interview Session

Once started, you enter a chat-based interview with the AI:

- The AI asks one question at a time, drawn from the track's skill categories
- You can type your answer or use the **microphone button** to speak it
- The AI provides **real-time feedback** and a score (0–100) after each answer
- A **progress tracker** shows how many questions remain
- The **difficulty indicator** shows the current level, which adjusts automatically — if you score well on consecutive answers, difficulty increases; if you struggle, it decreases
- An optional **timer** counts down per question

### 4. Results & Analytics (Report Page)

After completing all questions, you're taken to a detailed results page:

- **Overall Score** — Weighted average across all answers
- **Radar Chart** — Visual breakdown of performance by skill category (e.g., React, System Design, APIs)
- **Per-Question Review** — Each question with your answer, the AI's feedback, and the score
- **Strengths & Weaknesses** — AI-generated summary of what you did well and where to improve
- **Difficulty Progression** — How the difficulty level changed throughout the session

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout with fonts and metadata
│   ├── page.tsx                   # Home — track selection grid
│   ├── interview/[id]/page.tsx    # Active interview session
│   ├── results/[id]/page.tsx      # Performance report
│   └── api/
│       ├── interview/route.ts     # AI interviewer (streamText)
│       ├── evaluate/route.ts      # Answer evaluation (generateObject)
│       └── report/route.ts        # Performance report generation
├── components/
│   ├── track-selector.tsx         # Track grid + settings dialog
│   ├── interview-chat.tsx         # Chat UI with message history
│   ├── voice-input.tsx            # Microphone button (Web Speech API)
│   ├── voice-output.tsx           # Text-to-speech for AI questions
│   ├── timer.tsx                  # Per-question countdown
│   ├── feedback-card.tsx          # Real-time answer feedback display
│   ├── performance-chart.tsx      # Recharts radar chart
│   ├── progress-tracker.tsx       # Question progress bar
│   ├── difficulty-indicator.tsx   # Current difficulty level badge
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── ai.ts                     # AI SDK + Gemini model config
│   ├── schemas.ts                # Zod schemas for structured AI output
│   ├── tracks.ts                 # Interview track definitions (14 tracks)
│   ├── difficulty.ts             # Adaptive difficulty algorithm
│   ├── speech.ts                 # Web Speech API helpers
│   ├── scoring.ts                # Answer scoring utilities
│   └── utils.ts                  # Class name utilities
└── types/
    └── index.ts                  # TypeScript type definitions
```

## Adaptive Difficulty Algorithm

The difficulty adjusts based on a rolling window of your last 3 answer scores:

| Average Score | Action |
|---|---|
| > 80% (2+ answers) | Difficulty increases by 1 level |
| < 40% (2+ answers) | Difficulty decreases by 1 level |
| 40–80% | Difficulty stays the same |

Difficulty is clamped between 1 (Entry) and 5 (Staff+).

## Deployment

Deploy to Vercel with one click:

```bash
npm run build
```

Set the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable in your Vercel project settings.

## License

MIT
