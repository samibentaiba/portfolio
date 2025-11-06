"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight, FileIcon, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { LuGithub } from "react-icons/lu";
import { useResume, useResumePagination } from "./hook";
import { ResumeSection } from "./utils";
import type { Education, Experience, Personal, Project, SkillCategory } from "@/types";

interface Props {
  t: (key: string) => string;
  experiences: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  isGenerating: boolean;
  personal: Personal | null;
  educations: Education[];
  handleDownload: () => void;
  handleDownloadPdf: () => void;
}

export default function ResumeClient() {
  const resume = useResume();

  const {
    t,
    experiences,
    projects,
    skills,
    isGenerating,
    personal,
    educations,
    handleDownload,
    handleDownloadPdf,
  } = resume;

  return (
    <ResumeContent
      t={t}
      experiences={experiences}
      projects={projects}
      skills={skills}
      personal={personal}
      educations={educations}
      isGenerating={isGenerating}
      handleDownload={handleDownload}
      handleDownloadPdf={handleDownloadPdf}
    />
  );
}

function ResumeContent({
  t,
  experiences,
  projects,
  skills,
  isGenerating,
  personal,
  educations,
  handleDownload,
  handleDownloadPdf,
}: Props) {
  const [resumeSections, setResumeSections] = useState<ReactElement[]>([]);
  const [pageHeight, setPageHeight] = useState(550);

  useEffect(() => {
    const sections: ReactElement[] = [];

    if (personal) {
      sections.push(
        <div key="header" className="space-y-2">
          <h1 className="text-3xl font-bold">{personal?.name}</h1>
          <p className="text-muted-foreground">
            {personal?.job}· {personal?.email}
          </p>
        </div>
      );

      sections.push(
        <div key="summary" className="flex flex-col space-y-2">
          <h2 className="text-xl font-semibold">
            {t("resume.summary") || "Summary"}:
          </h2>
          <p className="text-sm text-muted-foreground">{personal?.summary}</p>
        </div>
      );
    }
    if (experiences.length > 0) {
      experiences.forEach((exp, i) => {
        sections.push(
          <ResumeSection
            key={`exp-${i}`}
            title={i === 0 ? t("experiences.title") || "Experience" : undefined}
          >
            <div className="space-y-1">
              <p className="font-medium">
                {exp.role} - {exp.company}
              </p>
              <p className="text-xs text-muted-foreground">
                {exp.period} · {exp.location}
              </p>
              <ul className="list-disc ml-5 text-xs">
                {exp.projects.map((project, idx) => (
                  <li key={idx}>{project}</li>
                ))}
              </ul>
            </div>
          </ResumeSection>
        );
      });
    }
    if (projects.length > 0) {
      const projectChunkSize = 1;
      const projectChunks = [];

      for (let i = 0; i < projects.length; i += projectChunkSize) {
        projectChunks.push(projects.slice(i, i + projectChunkSize));
      }

      projectChunks.forEach((chunk, chunkIndex) => {
        sections.push(
          <ResumeSection
            key={`project-chunk-${chunkIndex}`}
            title={
              chunkIndex === 0 ? t("projects.title") || "Projects" : undefined
            }
          >
            <div className="space-y-4">
              {chunk.map((project, i) => (
                <div key={`project-${chunkIndex}-${i}`} className="space-y-1">
                  <p className="font-medium">{project.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {project.timeline} · {project.technologies.join(", ")}
                  </p>
                  <p className="text-sm">{project.description}</p>
                  {project.collaborators?.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {t("projects.collaborators") || "Collaborators"}:{" "}
                      {project.collaborators.join(", ")}
                    </p>
                  )}
                  <CardFooter className="flex justify-between p-3 sm:p-4">
                    {project.liveUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            project.liveUrl,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                        className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center"
                      >
                        <ExternalLink className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />{" "}
                        {t("navigation.live")}
                      </button>
                    )}
                    {project.githubUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            project.githubUrl,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                        className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center       "
                      >
                        <LuGithub className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Code
                      </button>
                    )}
                  </CardFooter>
                </div>
              ))}
            </div>
          </ResumeSection>
        );
      });
    }
    if (skills.length > 0) {
      skills.forEach((group, i) => {
        const chunkSize = 5;
        const skillChunks = [];

        for (let j = 0; j < group.items.length; j += chunkSize) {
          skillChunks.push(group.items.slice(j, j + chunkSize));
        }

        skillChunks.forEach((chunk, chunkIndex) => {
          sections.push(
            <ResumeSection
              key={`skill-${i}-${chunkIndex}`}
              title={
                i === 0 && chunkIndex === 0
                  ? t("skills.title") || "Skills"
                  : undefined
              }
            >
              <div className="space-y-1">
                <p className="font-medium">{group.category}</p>
                <ul className="list-disc ml-5 text-sm">
                  {chunk.map((skill, idx) => (
                    <li key={idx}>
                      <span className="font-medium">{skill.name}</span>{" "}
                      <span className="text-muted-foreground">
                        ({skill.experience})
                      </span>
                      <span className="text-xs block text-muted-foreground ml-1">
                        {skill.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ResumeSection>
          );
        });
      });
    }
    if (educations.length > 0) {
      sections.push(
        <div key="education" className="space-y-2">
          <h2 className="text-xl font-semibold">
            {t("resume.education") || "Education"}
          </h2>
          {educations.map((edu, index) => (
            <div key={index}>
              <p className="font-medium">{edu.degree}</p>
              <p className="text-sm text-muted-foreground">
                {edu.institution} · {edu.startYear}-{edu.endYear}
              </p>
            </div>
          ))}
        </div>
      );
    }

    setResumeSections(sections);
  }, [t, experiences, projects, skills, personal, educations]);

  useEffect(() => {
    const updateHeight = () => {
      const containerHeight =
        document.querySelector(".space-y-6")?.scrollHeight || 0;
      setPageHeight(Math.max(containerHeight, 400));
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [resumeSections]);

  const {
    containerRef,
    measureRef,
    currentPage,
    totalPages,
    currentPageContent,
    goToNextPage,
    goToPrevPage,
    setCurrentPage,
  } = useResumePagination({
    content: resumeSections,
    pageHeight,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [resumeSections, setCurrentPage]);

  return (
    <main className="container py-8 sm:py-12 px-4 sm:px-6 flex justify-center items-center min-h-screen">
      <div className="max-w-2xl w-full flex flex-col gap-6 mx-auto">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-primary hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("navigation.backToHome") || "Back to Home"}
          </Link>
        </div>
        <Card className="p-8 flex flex-col shadow-lg">
          <div
            ref={containerRef}
            className="space-y-6 max-h-[750px] min-h-[600px]  overflow-hidden"
          >
            {currentPageContent.map((section, index) => (
              <div key={index}>{section}</div>
            ))}
          </div>

          <div
            ref={measureRef}
            aria-hidden="true"
            className="invisible absolute -z-50 h-0 overflow-hidden pointer-events-none"
          >
            {resumeSections.map((section, index) => (
              <div key={index}>{section}</div>
            ))}
          </div>

          <div className="flex items-center flex-col justify-between ">
            <div className="flex items-center w-full md:justify-between justify-center pt-4 mt-4 ">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t("navigation.previous")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  {t("navigation.next")}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <span className="text-sm hidden md:flex lg:flex text-muted-foreground">
                Page {currentPage} {t("navigation.of")} {totalPages}
              </span>
            </div>
            <span className="text-sm md:hidden lg:hidden text-muted-foreground">
              Page {currentPage} {t("navigation.of")} {totalPages}
            </span>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2 flex-1"
              disabled={isGenerating}
            >
              <FileText className="h-4 w-4" />
              {isGenerating
                ? t("resume.generating") || "Generating..."
                : t("resume.downloadDocx") || "Download as DOCX"}
            </Button>
            <Button
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 flex-1"
              variant="outline"
              disabled={isGenerating}
            >
              <FileIcon className="h-4 w-4" />
              {isGenerating
                ? t("resume.generating") || "Generating..."
                : t("resume.downloadPdf") || "Download as PDF"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}