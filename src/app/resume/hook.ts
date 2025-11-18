import { useEffect, useState, useRef } from "react";
import { saveAs } from "file-saver";
import { Packer } from "docx";
import { useLanguage } from "@/components/language-provider";
import { generateResumeDoc } from "@/lib/resume-generator";
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

  // Generate DOCX on-demand (keeps original functionality)
  const generateDocx = async () => {
    setIsGenerating(true);
    try {
      const doc = generateResumeDoc(personal, skills, experiences, projects, educations, t, language);
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `resume_${language}.docx`);
    } catch (error) {
      console.error("Error generating DOCX:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download pre-generated static PDF
  const downloadStaticPdf = () => {
    const pdfPath = `/resume.${language}.pdf`;
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = `resume_${language}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    t,
    skills,
    experiences,
    projects,
    isGenerating,
    educations,
    personal,
    handleDownload: generateDocx, // DOCX generation on-demand
    handleDownloadPdf: downloadStaticPdf, // Static PDF download
  };
}

// Hook for managing resume pagination
interface UsePaginationProps {
  content: ReactElement[];
  pageHeight: number;
}

export function useResumePagination({
  content,
  pageHeight,
}: UsePaginationProps) {
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

      const relativeTop =
        elementTop -
        (measureRef.current as HTMLDivElement).getBoundingClientRect().top;

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
