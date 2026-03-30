import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Brain } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Interview Prep",
  description:
    "Practice mock interviews with an AI interviewer that adapts to your skill level",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${geistSans.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold text-sm sm:text-base hover:opacity-80 transition-opacity"
              >
                <Brain className="h-5 w-5 text-primary" />
                <span className="bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent">
                  AI Interview Prep
                </span>
              </Link>
              <ThemeToggle />
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
