import { Education, Experience, Project } from "@/types";
import { Paragraph, TextRun, HeadingLevel } from "docx";
import { Personal } from "@/types";
// Define a type for the translate function
type TranslateFunction = (key: string) => string;

export const createSummarySection = (
  personal: Personal | null,
  t: TranslateFunction
) => [
  new Paragraph({
    children: [
      new TextRun({
        text: `${t("resume.summary")}` || "Summary:",
        bold: true,
        size: 26,
      }),
    ],
    spacing: { before: 100, after: 200 },
    heading: HeadingLevel.HEADING_1,
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: `${personal?.job}` || "Summary:",
        bold: true,
        size: 16,
      }),
    ],
    spacing: { before: 100, after: 100 },
    heading: HeadingLevel.HEADING_1,
  }),
  new Paragraph({
    children: [new TextRun({ text: personal?.summary })],
    spacing: { after: 200 },
  }),
];

export const createSkillsSection = (
  skills: {
    category: string;
    items: { name: string; experience: string; description: string }[];
  }[],
  t: TranslateFunction
) => {
  const skillsParagraphs = skills.map((group) => [
    new Paragraph({
      children: [
        new TextRun({
          text: group.category,
          bold: true,
          size: 20,
        }),
      ],
      spacing: { before: 400, after: 200 },
      heading: HeadingLevel.HEADING_1,
    }),
    ...group.items.map(
      (item) =>
        new Paragraph({
          children: [
            new TextRun({
              text: `${item.name} (${item.experience})`,
              bold: true,
            }),
            new TextRun({ text: `: ${item.description}` }),
          ],
          spacing: { before: 200, after: 100 },
        })
    ),
  ]);

  return [
    new Paragraph({
      children: [
        new TextRun({
          text: t("skills.title") || "Skills:",
          bold: true,
          size: 26,
        }),
      ],
      spacing: { before: 400, after: 200 },
      heading: HeadingLevel.HEADING_1,
    }),
    ...skillsParagraphs.flat(),
  ];
};

export const createExperienceSection = (
  experiences: Experience[],
  t: TranslateFunction
) => {
  const experienceParagraphs = experiences.flatMap((exp) => [
    new Paragraph({
      children: [new TextRun({ text: exp.role, bold: true })],
      spacing: { before: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `${exp.company}`, italics: true })],
    }),
    new Paragraph({
      children: [new TextRun({ text: `${exp.period} · ${exp.location}` })],
      spacing: { after: 100 },
    }),
    ...exp.projects.slice(0, 3).map(
      (project: string) =>
        new Paragraph({
          children: [new TextRun({ text: `• ${project}` })],
          spacing: { before: 80 },
        })
    ),
  ]);

  return [
    new Paragraph({
      children: [
        new TextRun({
          text: t("experiences.title") || "Experience:",
          bold: true,
          size: 26,
        }),
      ],
      spacing: { before: 400, after: 200 },
      heading: HeadingLevel.HEADING_1,
    }),
    ...experienceParagraphs,
  ];
};

export const createProjectsSection = (
  projects: Project[],
  t: TranslateFunction
): Paragraph[] => {
  const projectParagraphs = projects.map((project) => {
    const technologies =
      project.technologies && project.technologies.length > 0
        ? ` (${project.technologies.join(", ")})`
        : "";
    return [
      new Paragraph({
        children: [
          new TextRun({ text: `${project.title}`, bold: true }),
          new TextRun({ text: technologies }),
          new TextRun({
            text: project.personalExperience
              ? `: ${project.personalExperience}`
              : "",
          }),
        ],
        spacing: { before: 200 },
      }),
      new Paragraph({
        children: [new TextRun({ text: project.liveUrl || "" })],
        spacing: { before: 50, after: 50 },
      }),
      new Paragraph({
        children: [new TextRun({ text: project.githubUrl || "" })],
        spacing: { before: 50, after: 50 },
      }),
    ];
  });

  return [
    new Paragraph({
      children: [
        new TextRun({
          text: t("projects.title") || "Projects:",
          bold: true,
          size: 26,
        }),
      ],
      spacing: { before: 400, after: 200 },
      heading: HeadingLevel.HEADING_1,
    }),
    ...projectParagraphs.flat(),
  ];
};

export const createEducationSection = (
  educations: Education[],
  t: TranslateFunction
): Paragraph[] => {
  const educationParagraphs = educations.map((education) => {
    return [
      new Paragraph({
        children: [
          new TextRun({ text: `${education.degree}`, bold: true }),
          new TextRun({
            text: ` (${education.institution}, ${education.startYear}-${education.endYear})`,
          }),
        ],
        spacing: { before: 200 },
      }),
    ];
  });

  return [
    new Paragraph({
      children: [
        new TextRun({
          text: t("educations.title") || "Educations:",
          bold: true,
          size: 26,
        }),
      ],
      spacing: { before: 400, after: 200 },
      heading: HeadingLevel.HEADING_1,
    }),
    ...educationParagraphs.flat(),
  ];
};
