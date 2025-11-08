import { Experience, Project, Skill, SkillCategory } from "@/types";
import { rgb, StandardFonts } from "pdf-lib";

// UI Configuration (fonts, sizes, margins, colors, etc.)
export const UI_CONFIG = {
  pageWidth: 600,
  pageHeight: 800,
  margin: 50,
  fontSize: 12,
  titleFontSize: 14,
  headerFontSize: 20,
  sectionSpacing: 30,
  lineSpacing: 15,
  color: rgb(0, 0, 0), // Black color for text
  headerColor: rgb(0, 0, 0), // Black color for header text
  sectionTitleColor: rgb(0, 0, 0), // Black color for section titles
  fontFamily: StandardFonts.Helvetica,
};

// Function to format the summary for the PDF
export function formatPdfSummary(t: (key: string) => string): string {
  return t("resume.summary");
}

// Function to format the skills section for the PDF
export function formatPdfSkills(skills: SkillCategory[]): string[] {
  return skills.flatMap((group) => [
    `${group.category}:`,
    ...group.items.map(
      (item: Skill) =>
        `  - ${item.name} (${item.experience}): ${item.description}`
    ),
  ]);
}

// Function to format the experiences section for the PDF
export function formatPdfExperiences(experiences: Experience[]): string[] {
  return experiences.flatMap((exp: Experience) => [
    `${exp.role} at ${exp.company}`,
    `${exp.period} · ${exp.location}`,
    ...exp.projects.slice(0, 3).map((p: string) => `  • ${p}`),
    "",
  ]);
}

// Function to format the projects section for the PDF
export function formatPdfProjects(
  projects: Project[]
): { title: string; technologies: string[]; personalExperience: string }[] {
  return projects.map((proj: Project) => ({
    title: proj.title,
    technologies: proj.technologies,
    personalExperience: proj.personalExperience || "",
  }));
}
