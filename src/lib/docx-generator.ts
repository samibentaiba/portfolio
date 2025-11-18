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
      }),
    ],
    spacing: { before: 100, after: 200 },
    heading: HeadingLevel.HEADING_1,
    alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: `${personal?.job}` || "",
        bold: true,
        size: 16,
      }),
    ],
    spacing: { before: 100, after: 100 },
    alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
  }),
  new Paragraph({
    children: [new TextRun({ text: personal?.summary || "" })],
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
  const skillsParagraphs = skills.flatMap((group) => [
    new Paragraph({
      children: [
        new TextRun({
          text: group.category,
          bold: true,
          size: 20,
        }),
      ],
      spacing: { before: 200, after: 100 },
      heading: HeadingLevel.HEADING_2,
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
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
          spacing: { before: 100, after: 80 },
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
        }),
      ],
      spacing: { before: 400, after: 200 },
      heading: HeadingLevel.HEADING_1,
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    }),
    ...skillsParagraphs,
  ];
};

export const createExperienceSection = (
  experiences: Experience[],
  t: TranslateFunction,
  isRtl: boolean
) => {
  const experienceParagraphs = experiences.flatMap((exp) => [
    new Paragraph({
      children: [new TextRun({ text: exp.role, bold: true })],
      spacing: { before: 200 },
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    }),
    new Paragraph({
      children: [new TextRun({ text: `${exp.company}`, italics: true })],
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    }),
    new Paragraph({
      children: [new TextRun({ text: `${exp.period} · ${exp.location}` })],
      spacing: { after: 100 },
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    }),
    ...exp.projects.slice(0, 3).map(
      (project: string) =>
        new Paragraph({
          children: [new TextRun({ text: `• ${project}` })],
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
  const projectParagraphs = projects.flatMap((project) => {
    const technologies =
      project.technologies && project.technologies.length > 0
        ? ` (${project.technologies.join(", ")})`
        : "";
    return [
      new Paragraph({
        children: [
          new TextRun({ text: `${project.title}`, bold: true }),
          new TextRun({ text: technologies }),
        ],
        spacing: { before: 200, after: 50 },
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: project.personalExperience || "",
          }),
        ],
        spacing: { before: 50, after: 50 },
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
      }),
      ...(project.liveUrl
        ? [
            new Paragraph({
              children: [new TextRun({ text: project.liveUrl })],
              spacing: { before: 50, after: 20 },
              alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            }),
          ]
        : []),
      ...(project.githubUrl
        ? [
            new Paragraph({
              children: [new TextRun({ text: project.githubUrl })],
              spacing: { before: 20, after: 100 },
              alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            }),
          ]
        : []),
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
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    }),
    ...projectParagraphs,
  ];
};

export const createEducationSection = (
  educations: Education[],
  t: TranslateFunction,
  isRtl: boolean
): Paragraph[] => {
  const educationParagraphs = educations.flatMap((education) => [
    new Paragraph({
      children: [new TextRun({ text: `${education.degree}`, bold: true })],
      spacing: { before: 200, after: 50 },
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${education.institution}, ${education.startYear}-${education.endYear}`,
        }),
      ],
      spacing: { after: 100 },
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    }),
  ]);

  return [
    new Paragraph({
      children: [
        new TextRun({
          text: t("educations.title") || "Education:",
          bold: true,
          size: 26,
        }),
      ],
      spacing: { before: 400, after: 200 },
      heading: HeadingLevel.HEADING_1,
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    }),
    ...educationParagraphs,
  ];
};
