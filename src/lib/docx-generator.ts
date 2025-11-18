import { Education, Experience, Project } from "@/types";
import { Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { Personal } from "@/types";
// Define a type for the translate function
type TranslateFunction = (key: string) => string;

export const createSummarySection = (
  personal: Personal | null,
  t: TranslateFunction,
  isRtl: boolean
) => [
  new Paragraph({
    children: [
      new TextRun({
        text: `${t("resume.summary")}` || "Summary:",
        bold: true,
        size: 26,
        rightToLeft: isRtl,
      }),
    ],
    spacing: { before: 100, after: 200 },
    heading: HeadingLevel.HEADING_1,
    alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: `${personal?.job}` || "Summary:",
        bold: true,
        size: 16,
        rightToLeft: isRtl,
      }),
    ],
    spacing: { before: 100, after: 100 },
    alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
  }),
  new Paragraph({
    children: [new TextRun({ text: personal?.summary, rightToLeft: isRtl })],
    spacing: { after: 200 },
    alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
  }),
];

export const createSkillsSection = (
  skills: {
    category: string;
    items: { name: string; experience: string; description: string }[];
  }[],
  t: TranslateFunction,
  isRtl: boolean
) => {
  const skillsParagraphs = skills.map((group) => [
    new Paragraph({
      children: [
        new TextRun({
          text: group.category,
          bold: true,
          size: 20,
          rightToLeft: isRtl,
        }),
      ],
      spacing: { before: 400, after: 200 },
      heading: HeadingLevel.HEADING_1,
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    }),
    ...group.items.map(
      (item) =>
        new Paragraph({
          children: [
            new TextRun({
              text: `${item.name} (${item.experience})`,
              bold: true,
              rightToLeft: isRtl,
            }),
            new TextRun({ text: `: ${item.description}`, rightToLeft: isRtl }),
          ],
          spacing: { before: 200, after: 100 },
          alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
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
          rightToLeft: isRtl,
        }),
      ],
      spacing: { before: 400, after: 200 },
      heading: HeadingLevel.HEADING_1,
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    }),
    ...skillsParagraphs.flat(),
  ];
};

export const createExperienceSection = (
  experiences: Experience[],
  t: TranslateFunction,
  isRtl: boolean
) => {
  const experienceParagraphs = experiences.flatMap((exp) => [
    new Paragraph({
      children: [new TextRun({ text: exp.role, bold: true, rightToLeft: isRtl })],
      spacing: { before: 200 },
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    }),
    new Paragraph({
      children: [new TextRun({ text: `${exp.company}`, italics: true, rightToLeft: isRtl })],
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    }),
    new Paragraph({
      children: [new TextRun({ text: `${exp.period} · ${exp.location}`, rightToLeft: isRtl })],
      spacing: { after: 100 },
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    }),
    ...exp.projects.slice(0, 3).map(
      (project: string) =>
        new Paragraph({
          children: [new TextRun({ text: `• ${project}`, rightToLeft: isRtl })],
          spacing: { before: 80 },
          alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
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
          rightToLeft: isRtl,
        }),
      ],
      spacing: { before: 400, after: 200 },
      heading: HeadingLevel.HEADING_1,
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    }),
    ...experienceParagraphs,
  ];
};

export const createProjectsSection = (
  projects: Project[],
  t: TranslateFunction,
  isRtl: boolean
): Paragraph[] => {
  const projectParagraphs = projects.map((project) => {
    const technologies =
      project.technologies && project.technologies.length > 0
        ? ` (${project.technologies.join(", ")})`
        : "";
    return [
      new Paragraph({
        children: [
          new TextRun({ text: `${project.title}`, bold: true, rightToLeft: isRtl }),
          new TextRun({ text: technologies, rightToLeft: isRtl }),
          new TextRun({
            text: project.personalExperience
              ? `: ${project.personalExperience}`
              : "",
            rightToLeft: isRtl,
          }),
        ],
        spacing: { before: 200 },
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
      }),
      new Paragraph({
        children: [new TextRun({ text: project.liveUrl || "", rightToLeft: isRtl })],
        spacing: { before: 50, after: 50 },
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
      }),
      new Paragraph({
        children: [new TextRun({ text: project.githubUrl || "", rightToLeft: isRtl })],
        spacing: { before: 50, after: 50 },
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
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
          rightToLeft: isRtl,
        }),
      ],
      spacing: { before: 400, after: 200 },
      heading: HeadingLevel.HEADING_1,
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    }),
    ...projectParagraphs.flat(),
  ];
};

export const createEducationSection = (
  educations: Education[],
  t: TranslateFunction,
  isRtl: boolean
): Paragraph[] => {
  const educationParagraphs = educations.map((education) => {
    return [
      new Paragraph({
        children: [
          new TextRun({ text: `${education.degree}`, bold: true, rightToLeft: isRtl }),
          new TextRun({
            text: ` (${education.institution}, ${education.startYear}-${education.endYear})`,
            rightToLeft: isRtl,
          }),
        ],
        spacing: { before: 200 },
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
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
          rightToLeft: isRtl,
        }),
      ],
      spacing: { before: 400, after: 200 },
      heading: HeadingLevel.HEADING_1,
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    }),
    ...educationParagraphs.flat(),
  ];
};
