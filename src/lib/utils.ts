import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import projectsData from "@/data/projects.json";
import experiencesData from "@/data/experiences.json";
import { Project } from "@/types";

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

export function getProjectImage(project: Project): string {
  // If image is present and not a placeholder, use it
  if (project.image && !project.image.includes("placeholder.svg")) {
    return project.image;
  }
  
  // If image is missing or is a placeholder, try to use liveUrl for screenshot
  if (project.liveUrl) {
    // Using image.thum.io for free screenshots
    // width=1200 to get high quality, crop=600 to get the top part (hero section)
    // wait/5 to wait 5 seconds for the page to load before taking screenshot
    return `https://image.thum.io/get/width/1200/crop/600/wait/5/noanimate/${project.liveUrl}`;
  }
  
  // Fallback to placeholder
  return project.image || "/placeholder.svg?height=400&width=800";
}

export type Props = {
  params: Promise<{ slug: string }>;
};

