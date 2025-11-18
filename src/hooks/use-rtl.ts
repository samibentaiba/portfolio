// src/hooks/use-rtl.ts
"use client";

import { useEffect } from "react";
import { useLanguage } from "@/components/language-provider";

export function useRTL() {
  const { language } = useLanguage();
  const isRtl = language === "ar";

  useEffect(() => {
    // Set document direction
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = language;
    
    // Add RTL class to body for additional styling if needed
    if (isRtl) {
      document.body.classList.add("rtl");
    } else {
      document.body.classList.remove("rtl");
    }
  }, [isRtl, language]);

  return { isRtl, language };
}