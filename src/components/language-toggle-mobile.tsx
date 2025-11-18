"use client"

import { useLanguage } from "@/components/language-provider"
import { Check, Globe } from "lucide-react"

const languages = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "ar", name: "العربية" },
]

export function LanguageToggleMobile() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">Language</span>
      </div>
      <div className="flex flex-col gap-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as "en" | "fr" | "ar")}
            className={`flex items-center justify-between px-2 py-1 rounded text-sm text-left hover:bg-accent ${
              language === lang.code ? "bg-muted font-medium" : ""
            }`}
          >
            {lang.name}
            {language === lang.code && <Check className="h-4 w-4" />}
          </button>
        ))}
      </div>
    </div>
  )
}
