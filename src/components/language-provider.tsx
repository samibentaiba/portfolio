"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import enTranslations from "@/data/translations/en.json";
import frTranslations from "@/data/translations/fr.json";
import arTranslations from "@/data/translations/ar.json";
import enSkills from "@/data/skills.json";
import frSkills from "@/data/translations/skills-fr.json";
import arSkills from "@/data/translations/skills-ar.json";
import enExperiences from "@/data/experiences.json";
import frExperiences from "@/data/translations/experiences-fr.json";
import arExperiences from "@/data/translations/experiences-ar.json";
import enProjects from "@/data/projects.json";
import frProjects from "@/data/translations/projects-fr.json";
import arProjects from "@/data/translations/projects-ar.json";
import enEducations from "@/data/educations.json";
import frEducations from "@/data/translations/educations-fr.json";
import arEducations from "@/data/translations/educations-ar.json";
import enPersonal from "@/data/personal.json";
import frPersonal from "@/data/translations/personal-fr.json";
import arPersonal from "@/data/translations/personal-ar.json";
import enFunFacts from "@/data/fun-facts.json";
import frFunFacts from "@/data/translations/fun-facts-fr.json";
import arFunFacts from "@/data/translations/fun-facts-ar.json";
import enCareerTimeline from "@/data/career-timeline.json";
import frCareerTimeline from "@/data/translations/career-timeline-fr.json";
import arCareerTimeline from "@/data/translations/career-timeline-ar.json";
import {
  Experience,
  FunFact,
  Project,
  SkillCategory,
  Education,
  Personal,
  CareerTimelineData,
} from "@/types";

type Language = "en" | "fr" | "ar";
type StoredLanguage = Language | "system";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  getSkillsData: () => SkillCategory[];
  getExperiencesData: () => Experience[];
  getProjectsData: () => Project[];
  getEducationsData: () => Education[];
  getCareerTimelineData: () => CareerTimelineData;
  getPersonalData: () => Personal;
  getFunFactsData: () => FunFact[];
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [storedLanguage, setStoredLanguage] = useLocalStorage<StoredLanguage>(
    "language",
    "system"
  );
  const [language, setLanguage] = useState<Language>("en");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (storedLanguage === "system") {
      const browserLanguage = navigator.language.split("-")[0];
      setLanguage(browserLanguage === "fr" ? "fr" : browserLanguage === "ar" ? "ar" : "en");
    } else {
      setLanguage(storedLanguage);
    }
  }, [storedLanguage]);

  if (!isClient) return null;

  const t = (key: string): string => {
    const keys = key.split(".");
    const translations: Record<string, unknown> =
      language === "fr"
        ? frTranslations
        : language === "ar"
        ? arTranslations
        : enTranslations;

    let result: unknown = translations;
    for (const k of keys) {
      if (typeof result === "object" && result !== null && k in result) {
        result = (result as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    return typeof result === "string" ? result : key;
  };

  const getSkillsData = (): SkillCategory[] =>
    (language === "fr"
      ? frSkills
      : language === "ar"
      ? arSkills
      : enSkills) as SkillCategory[];

  const getExperiencesData = (): Experience[] =>
    (language === "fr"
      ? frExperiences
      : language === "ar"
      ? arExperiences
      : enExperiences) as Experience[];

  const getProjectsData = (): Project[] =>
    (language === "fr"
      ? frProjects
      : language === "ar"
      ? arProjects
      : enProjects) as Project[];

  const getEducationsData = (): Education[] =>
    (language === "fr"
      ? frEducations
      : language === "ar"
      ? arEducations
      : enEducations) as Education[];

  const getPersonalData = (): Personal =>
    (language === "fr"
      ? frPersonal
      : language === "ar"
      ? arPersonal
      : enPersonal) as Personal;

  const getFunFactsData = (): FunFact[] =>
    (language === "fr"
      ? frFunFacts
      : language === "ar"
      ? arFunFacts
      : enFunFacts) as FunFact[];

  const getCareerTimelineData = (): CareerTimelineData =>
    (language === "fr"
      ? frCareerTimeline
      : language === "ar"
      ? arCareerTimeline
      : enCareerTimeline) as CareerTimelineData;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: (lang) => {
          setStoredLanguage(lang);
          setLanguage(lang);
        },
        t,
        getSkillsData,
        getExperiencesData,
        getProjectsData,
        getEducationsData,
        getCareerTimelineData,
        getPersonalData,
        getFunFactsData,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
