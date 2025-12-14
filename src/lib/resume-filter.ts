import { ResumeRole, ROLE_KEYWORDS } from "@/lib/resume-roles";
import { Experience, Project, SkillCategory } from "@/types";

export function filterResumeData(
  role: ResumeRole,
  experiences: Experience[],
  projects: Project[],
  skills: SkillCategory[]
) {
  if (role === "Software Engineer") {
    return {
      filteredExperiences: experiences,
      filteredProjects: projects,
      filteredSkills: skills,
    };
  }

  const keywords = ROLE_KEYWORDS[role];

  // Helper to check if text contains any keyword
  const hasKeyword = (text: string) =>
    keywords.some((k) => text.toLowerCase().includes(k.toLowerCase()));

  // Filter Projects
  const filteredProjects = projects.filter(
    (p) =>
      hasKeyword(p.title) ||
      hasKeyword(p.description || "") ||
      p.technologies.some((tech) => hasKeyword(tech))
  );

  // Filter Skills
  const filteredSkills = skills
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) => hasKeyword(item.name) || hasKeyword(item.description)
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  // Filter Experiences (keep if role matches or if it has relevant projects)
  const filteredExperiences = experiences.filter(
    (exp) =>
      hasKeyword(exp.role) ||
      hasKeyword(exp.summary) ||
      exp.projects.some((p) => hasKeyword(p))
  );

  return { filteredExperiences, filteredProjects, filteredSkills };
}
