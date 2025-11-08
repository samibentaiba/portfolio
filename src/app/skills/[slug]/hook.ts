"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { Project, Skill, SkillCategory } from "@/types";

export function useSkillData() {
  const params = useParams();
  const { t, getSkillsData, getProjectsData } = useLanguage();
  const [skill, setSkill] = useState<Skill>();
  const [category, setCategory] = useState<SkillCategory>();
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = params?.slug as string;
    if (!slug) return;

    let foundSkill: Skill | null = null;
    let foundCategory: SkillCategory | null = null;

    // Find skill and category
    for (const cat of getSkillsData()) {
      const skillFound = cat.items.find((s: Skill) => s.slug === slug);
      if (skillFound) {
        foundSkill = skillFound;
        foundCategory = cat;
        break;
      }
    }

    if (foundSkill && foundCategory) {
      setSkill(foundSkill);
      setCategory(foundCategory);

      // Related projects
      const projects = getProjectsData().filter((project) =>
        project.technologies.some(
          (tech: string) => tech.toLowerCase() === foundSkill!.name.toLowerCase()
        )
      );
      setRelatedProjects(projects);
    } else if (getSkillsData().length > 0) {
      notFound();
    }

    setLoading(false);
  }, [params, getSkillsData, getProjectsData]);

  return { t, skill, category, relatedProjects, loading };
}
