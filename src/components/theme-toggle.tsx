"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

const themes = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-0.5 rounded-full border border-border bg-muted/50 p-1">
        {themes.map(({ value }) => (
          <div key={value} className="h-7 w-7 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-border bg-muted/50 p-1"
      role="group"
      aria-label="Select theme"
    >
      {themes.map(({ value, icon: Icon, label }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-label={`Switch to ${label} theme`}
            aria-pressed={isActive}
            title={label}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 ${
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
