"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sparkles,
  ArrowRight,
  Clock,
  BarChart3,
  Mic,
  Brain,
  Search,
  X,
} from "lucide-react";
import { getAllTracks, trackGroups } from "@/lib/tracks";
import { getDifficultyLabel } from "@/lib/difficulty";
import type { Difficulty, Track } from "@/types";

const trackColors: Record<string, string> = {
  frontend: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
  backend: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  fullstack: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
  data: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
  devops: "from-orange-500/20 to-amber-500/20 border-orange-500/30",
  mobile: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
  ml: "from-purple-500/20 to-fuchsia-500/20 border-purple-500/30",
  pm: "from-sky-500/20 to-blue-500/20 border-sky-500/30",
  qa: "from-lime-500/20 to-green-500/20 border-lime-500/30",
  security: "from-red-500/20 to-orange-500/20 border-red-500/30",
  cloud: "from-cyan-500/20 to-sky-500/20 border-cyan-500/30",
  ux: "from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/30",
  dsa: "from-amber-500/20 to-yellow-500/20 border-amber-500/30",
  behavioral: "from-teal-500/20 to-emerald-500/20 border-teal-500/30",
};

const difficultyColors: Record<number, string> = {
  1: "text-emerald-500",
  2: "text-blue-500",
  3: "text-amber-500",
  4: "text-orange-500",
  5: "text-red-500",
};

export function TrackSelector() {
  const router = useRouter();
  const tracks = getAllTracks();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(2);
  const [questionCount, setQuestionCount] = useState(8);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<string>("All");

  const filteredTracks = useMemo(() => {
    let result = tracks;

    // Filter by group
    if (activeGroup !== "All") {
      const group = trackGroups.find((g) => g.label === activeGroup);
      if (group) {
        result = result.filter((t) => group.trackIds.includes(t.id));
      }
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.categories.some((c) => c.toLowerCase().includes(q))
      );
    }

    return result;
  }, [tracks, activeGroup, searchQuery]);

  const handleTrackClick = (track: Track) => {
    setSelectedTrack(track);
    setDialogOpen(true);
  };

  const startInterview = () => {
    if (!selectedTrack) return;
    const id = crypto.randomUUID();
    const params = new URLSearchParams({
      track: selectedTrack.id,
      difficulty: String(difficulty),
      questions: String(questionCount),
      timer: String(timerEnabled),
      voice: String(voiceEnabled),
    });
    router.push(`/interview/${id}?${params}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3 sm:space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
        >
          <Sparkles className="h-4 w-4" />
          AI-Powered Mock Interviews
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-chart-4 to-chart-2 bg-clip-text text-transparent"
        >
          AI Interview Prep
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto"
        >
          Practice with an AI interviewer that adapts to your level. Choose a
          track to get started.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2"
        >
          {[
            { icon: Brain, label: "Adaptive Difficulty" },
            { icon: Mic, label: "Voice Mode" },
            { icon: BarChart3, label: "Performance Analytics" },
            { icon: Clock, label: "Timed Practice" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 text-xs sm:text-sm text-muted-foreground"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="space-y-4"
      >
        {/* Search bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks, topics, or skills..."
            className="w-full h-10 pl-10 pr-10 rounded-full border border-border bg-background/80 backdrop-blur-sm text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveGroup("All")}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeGroup === "All"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All
          </button>
          {trackGroups.map((group) => (
            <button
              key={group.label}
              type="button"
              onClick={() =>
                setActiveGroup(
                  activeGroup === group.label ? "All" : group.label
                )
              }
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeGroup === group.label
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="mr-1.5">{group.icon}</span>
              {group.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results count */}
      {(searchQuery || activeGroup !== "All") && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground text-center"
        >
          {filteredTracks.length === 0
            ? "No tracks found. Try a different search or category."
            : `Showing ${filteredTracks.length} track${filteredTracks.length !== 1 ? "s" : ""}`}
        </motion.p>
      )}

      {/* Track Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTracks.map((track) => (
            <motion.div
              key={track.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-200 bg-gradient-to-br border hover:shadow-lg h-full ${trackColors[track.id]}`}
                onClick={() => handleTrackClick(track)}
              >
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <span className="text-2xl">{track.icon}</span>
                    {track.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                    {track.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {track.categories.slice(0, 3).map((cat) => (
                      <Badge
                        key={cat}
                        variant="secondary"
                        className="text-[10px] sm:text-xs bg-background/60 backdrop-blur-sm"
                      >
                        {cat}
                      </Badge>
                    ))}
                    {track.categories.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-xs bg-background/40"
                      >
                        +{track.categories.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredTracks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-muted-foreground">
            No tracks match your search.
          </p>
          <Button
            variant="ghost"
            className="mt-3"
            onClick={() => {
              setSearchQuery("");
              setActiveGroup("All");
            }}
          >
            Clear filters
          </Button>
        </motion.div>
      )}

      {/* Interview Settings Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            {selectedTrack && (
              <>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">{selectedTrack.icon}</span>
                  {selectedTrack.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedTrack.description}
                </DialogDescription>
              </>
            )}
          </DialogHeader>

          {selectedTrack && (
            <div className="space-y-5 py-2">
              {/* Categories */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Topics Covered
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTrack.categories.map((cat) => (
                    <Badge
                      key={cat}
                      variant="secondary"
                      className="text-xs"
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center justify-between">
                  <span>Starting Difficulty</span>
                  <span
                    className={`font-semibold ${difficultyColors[difficulty]}`}
                  >
                    {getDifficultyLabel(difficulty)}
                  </span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(Number(e.target.value) as Difficulty)
                  }
                  className="w-full accent-primary h-2 rounded-full"
                />
                <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
                  <span>Entry</span>
                  <span>Junior</span>
                  <span>Mid</span>
                  <span>Senior</span>
                  <span>Staff+</span>
                </div>
              </div>

              {/* Question Count */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center justify-between">
                  <span>Number of Questions</span>
                  <span className="font-semibold text-primary">
                    {questionCount}
                  </span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={20}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full accent-primary h-2 rounded-full"
                />
                <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
                  <span>5 Quick</span>
                  <span>10</span>
                  <span>15</span>
                  <span>20 Full</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setTimerEnabled(!timerEnabled)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                    timerEnabled
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-muted/50 border-border text-muted-foreground"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  Timer {timerEnabled ? "On" : "Off"}
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                    voiceEnabled
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-muted/50 border-border text-muted-foreground"
                  }`}
                >
                  <Mic className="h-4 w-4" />
                  Voice {voiceEnabled ? "On" : "Off"}
                </button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={startInterview}
              className="w-full bg-gradient-to-r from-primary to-chart-4 hover:from-primary/90 hover:to-chart-4/90 text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
              size="lg"
            >
              Start Interview
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
