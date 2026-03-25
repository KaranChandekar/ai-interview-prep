import { TrackSelector } from "@/components/track-selector";

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-chart-2/10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <TrackSelector />
        </div>
      </div>
    </main>
  );
}
