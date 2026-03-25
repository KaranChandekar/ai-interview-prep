export type Difficulty = 1 | 2 | 3 | 4 | 5;

export type TrackId =
  | "frontend"
  | "backend"
  | "fullstack"
  | "data"
  | "devops"
  | "mobile"
  | "ml"
  | "pm"
  | "qa"
  | "security"
  | "cloud"
  | "ux"
  | "dsa"
  | "behavioral";

export interface Track {
  id: TrackId;
  name: string;
  icon: string;
  description: string;
  categories: string[];
  behavioralTopics: string[];
}

export interface InterviewConfig {
  trackId: TrackId;
  difficulty: Difficulty;
  questionCount: number;
  timerEnabled: boolean;
  voiceEnabled: boolean;
}

export interface CategoryScore {
  category: string;
  score: number;
  questionsAsked: number;
}

export interface AnswerEvaluation {
  score: number;
  strengths: string[];
  improvements: string[];
  category: string;
}

export interface InterviewState {
  id: string;
  config: InterviewConfig;
  currentQuestion: number;
  currentDifficulty: Difficulty;
  categoryScores: CategoryScore[];
  evaluations: AnswerEvaluation[];
  startedAt: string;
  completedAt?: string;
}

export interface PerformanceReport {
  overallScore: number;
  categoryScores: CategoryScore[];
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  difficultyProgression: number[];
}
