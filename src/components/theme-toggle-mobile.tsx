"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Laptop } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function ThemeToggleMobile() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        <Sun className="h-4 w-4" />
        <span className="text-sm font-medium">{t("theme.title")}</span>
      </div>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => setTheme("light")}
          className={`flex items-center justify-between px-2 py-1 rounded text-sm text-left hover:bg-accent ${theme === "light" ? "bg-muted font-medium" : ""
            }`}
        >
          <span className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            {t("theme.light")}
          </span>
          {theme === "light" && <span className="text-xs">✓</span>}
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`flex items-center justify-between px-2 py-1 rounded text-sm text-left hover:bg-accent ${theme === "dark" ? "bg-muted font-medium" : ""
            }`}
        >
          <span className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            {t("theme.dark")}
          </span>
          {theme === "dark" && <span className="text-xs">✓</span>}
        </button>
        <button
          onClick={() => setTheme("system")}
          className={`flex items-center justify-between px-2 py-1 rounded text-sm text-left hover:bg-accent ${theme === "system" ? "bg-muted font-medium" : ""
            }`}
        >
          <span className="flex items-center gap-2">
            <Laptop className="h-4 w-4" />

            {t("theme.system")}
          </span>
          {theme === "system" && <span className="text-xs">✓</span>}
        </button>
      </div>
    </div>
  );
}
