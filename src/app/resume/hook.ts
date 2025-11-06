import { useEffect, useState, useRef } from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { useLanguage } from "@/components/language-provider";
import {
  createSummarySection,
  createSkillsSection,
  createExperienceSection,
  createProjectsSection,
  createEducationSection,
} from "@/lib/docx-generator";
import type { ReactElement } from "react";
import {
  Experience,
  Project,
  SkillCategory,
  Education,
  Personal,
} from "@/types";

// Hook for managing resume data and document generation
export function useResume() {
  const {
    language,
    t,
    getSkillsData,
    getExperiencesData,
    getProjectsData,
    getEducationsData,
    getPersonalData,
  } = useLanguage();

  const [personal, setPersonal] = useState<Personal | null>(null);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setSkills(getSkillsData());
    setExperiences(getExperiencesData());
    setProjects(getProjectsData());
    setEducations(getEducationsData());
    setPersonal(getPersonalData());
  }, [
    getSkillsData,
    getExperiencesData,
    getProjectsData,
    getEducationsData,
    getPersonalData,
    language,
  ]);

  const generateAndDownload = async (format: "docx" | "pdf") => {
    setIsGenerating(true);
    try {
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
                children: [
                  new TextRun(
                    `${personal?.email ?? ""} · ${personal?.phone ?? ""}`
                  ),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [new TextRun(`${personal?.website ?? ""}`)],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [new TextRun(`${personal?.github ?? ""}`)],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [new TextRun(`${personal?.linkedin ?? ""}`)],
                spacing: { after: 400 },
              }),
              ...createSummarySection(personal, t),
              ...createSkillsSection(skillsData, t),
              ...createExperienceSection(experiences, t),
              ...createProjectsSection(projects, t),
              ...createEducationSection(educations, t),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);

      if (format === "docx") {
        saveAs(blob, `resume_${language}.docx`);
      } else {
        const formData = new FormData();
        formData.append("file", blob, "resume.docx");

        const res = await fetch("/api/convert-to-pdf", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "PDF conversion failed");
        }

        const pdfBlob = await res.blob();
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `resume_${language}.pdf`;
        link.click();
      }
    } catch (error) {
      console.error(`Error generating ${format.toUpperCase()}:`, error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    t,
    skills,
    experiences,
    projects,
    isGenerating,
    educations,
    personal,
    handleDownload: () => generateAndDownload("docx"),
    handleDownloadPdf: () => generateAndDownload("pdf"),
  };
}

// Hook for managing resume pagination
interface UsePaginationProps {
  content: ReactElement[];
  pageHeight: number;
}

export function useResumePagination({ content, pageHeight }: UsePaginationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<ReactElement[][]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!measureRef.current) return;

    const children = Array.from(measureRef.current.children);
    const pagesArray: ReactElement[][] = [];
    let currentPageContent: ReactElement[] = [];

    let pageTop = 0;
    let pageBottom = pageHeight;

    children.forEach((child, index) => {
      const rect = (child as HTMLElement).getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;

      const relativeTop = elementTop - (measureRef.current as HTMLDivElement).getBoundingClientRect().top;

      if (relativeTop + elementHeight > pageBottom) {
        pagesArray.push(currentPageContent);
        currentPageContent = [content[index]];
        pageTop = relativeTop;
        pageBottom = pageTop + pageHeight;
      } else {
        currentPageContent.push(content[index]);
      }
    });

    if (currentPageContent.length > 0) {
      pagesArray.push(currentPageContent);
    }

    setPages(pagesArray);
    setTotalPages(pagesArray.length);
    setCurrentPage(1);
  }, [content, pageHeight]);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return {
    containerRef,
    measureRef,
    currentPage,
    setCurrentPage,
    totalPages,
    currentPageContent: pages[currentPage - 1] || [],
    goToNextPage,
    goToPrevPage,
  };
}