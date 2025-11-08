import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import projectsData from "@/data/projects.json";
import experiencesData from "@/data/experiences.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAllUniqueTechnologies(): string[] {
  const projectTechnologies = projectsData.flatMap((project) => project.technologies);
  const experienceSkills = experiencesData.flatMap((experience) => experience.skills);
  const allTechnologies = [...projectTechnologies, ...experienceSkills];
  const uniqueTechnologies = Array.from(new Set(allTechnologies));
  return uniqueTechnologies.sort();
}

export type Props = {
  params: Promise<{ slug: string }>;
};

