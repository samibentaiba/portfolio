import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import {
  createSummarySection,
  createSkillsSection,
  createExperienceSection,
  createProjectsSection,
  createEducationSection,
} from "@/lib/docx-generator";
import type {
  Personal,
  SkillCategory,
  Experience,
  Project,
  Education,
} from "@/types";

type TranslateFunction = (key: string) => string;

export const generateResumeDoc = (
  personal: Personal | null,
  skills: SkillCategory[],
  experiences: Experience[],
  projects: Project[],
  educations: Education[],
  t: TranslateFunction,
  language: string
) => {
  const isRtl = language === "ar";

  const skillsData = skills.map((group) => ({
    category: group.category,
    items: group.items.map((item) => ({
      name: item.name,
      experience: item.experience,
      description: item.description,
    })),
  }));

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            children: [
              new TextRun({
                text: personal?.name || "",
                bold: true,
                size: 32,
              }),
            ],
            spacing: { after: 200 },
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `${personal?.email ?? ""} · ${personal?.phone ?? ""}`,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            children: [new TextRun({ text: `${personal?.website ?? ""}` })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            children: [new TextRun({ text: `${personal?.github ?? ""}` })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            children: [new TextRun({ text: `${personal?.linkedin ?? ""}` })],
            spacing: { after: 400 },
          }),
          ...createSummarySection(personal, t, isRtl),
          ...createSkillsSection(skillsData, t, isRtl),
          ...createExperienceSection(experiences, t, isRtl),
          ...createProjectsSection(projects, t, isRtl),
          ...createEducationSection(educations, t, isRtl),
        ],
      },
    ],
  });

  return doc;
};
