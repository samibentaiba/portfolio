// src/app/resume/client.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
  ArrowLeft,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  FileIcon,
  FileText,
  Download,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, memo, useMemo } from "react";
import type { ReactElement } from "react";
import { LuGithub } from "react-icons/lu";
import { useResume, useResumePagination } from "./hook";
import { ResumeSection } from "./utils";
import type {
  Education,
  Experience,
  Personal,
  Project,
  SkillCategory,
} from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Props {
  t: (key: string) => string;
  experiences: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  isGenerating: boolean;
  personal: Personal | null;
  educations: Education[];
  selectedRole: ResumeRole;
  language: string;
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RESUME_ROLES, ResumeRole } from "@/lib/resume-roles";

import { filterResumeData } from "@/lib/resume-filter";

export default function ResumeClient() {
  const resume = useResume();
  const [selectedRole, setSelectedRole] =
    useState<ResumeRole>("Software Engineer");

  const {
    t,
    experiences,
    projects,
    skills,
    isGenerating,
    personal,
    educations,
    language,
  } = resume;

  // Filter data based on selected role
  const { filteredExperiences, filteredProjects, filteredSkills } = useMemo(
    () => filterResumeData(selectedRole, experiences, projects, skills),
    [selectedRole, experiences, projects, skills]
  );

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body {
            background: white;
          }
          .no-print {
            display: none !important;
          }
          .print-content {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          /* Hide the pagination controls and footer in print */
          .print-hidden {
            display: none !important;
          }
        }
      `}</style>

      <main className="container py-8 sm:py-12 px-4 sm:px-6 flex justify-center items-start flex-1">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar Controls - Hidden in Print */}
          <div className="flex flex-col gap-6 no-print h-fit lg:sticky lg:top-8">
            <Link
              href="/"
              className="text-primary hover:underline flex items-center gap-1 w-fit"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("navigation.backToHome") || "Back to Home"}
            </Link>

            <div className="flex flex-col gap-4 bg-muted/30 p-6 rounded-lg border">
              <div className="space-y-1">
                <h3 className="font-medium text-sm">
                  {t("resume.targetRole") || "Target Role"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t("resume.filterDescription") ||
                    "Filter resume content for a specific job"}
                </p>
              </div>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as ResumeRole)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role">
                    {t(`roles.${selectedRole}`) || selectedRole}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {RESUME_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {t(`roles.${role}`) || role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full max-w-3xl mx-auto lg:mx-0 py-8">
            <ResumeContent
              t={t}
              experiences={filteredExperiences}
              projects={filteredProjects}
              skills={filteredSkills}
              personal={personal}
              educations={educations}
              isGenerating={isGenerating}
              selectedRole={selectedRole}
              language={language}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

const ResumeContent = memo(function ResumeContent({
  t,
  experiences,
  projects,
  skills,
  isGenerating,
  personal,
  educations,
  selectedRole,
  language,
}: Props) {
  const [resumeSections, setResumeSections] = useState<ReactElement[]>([]);
  const [pageHeight, setPageHeight] = useState(550);
  const [isGeneratingContent, setIsGeneratingContent] = useState(true);

  useEffect(() => {
    const sections: ReactElement[] = [];

    try {
      // Header Section
      if (personal) {
        sections.push(
          <div key="header" className="space-y-2">
            <h1 className="text-3xl font-bold">{personal.name}</h1>
            <p className="text-muted-foreground">
              {personal.job} · {personal.email}
            </p>
          </div>
        );

        sections.push(
          <ResumeSection key="summary" title={t("resume.summary") || "Summary"}>
            <p className="text-sm text-muted-foreground">{personal.summary}</p>
          </ResumeSection>
        );
      }

      // Experiences Section
      if (experiences.length > 0) {
        experiences.forEach((exp, i) => {
          sections.push(
            <ResumeSection
              key={`exp-${exp.slug}-${i}`}
              title={
                i === 0 ? t("experiences.title") || "Experience" : undefined
              }
            >
              <div className="space-y-1">
                <p className="font-medium">
                  {exp.role} - {exp.company}
                </p>
                <p className="text-xs text-muted-foreground">
                  {exp.period} · {exp.location}
                </p>
                <ul className="list-disc ml-5 text-xs space-y-1">
                  {exp.projects.map((project, idx) => (
                    <li key={`${exp.slug}-project-${idx}`}>{project}</li>
                  ))}
                </ul>
              </div>
            </ResumeSection>
          );
        });
      }

      // Projects Section
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
                  <div
                    key={`project-${project.slug}-${chunkIndex}-${i}`}
                    className="space-y-1"
                  >
                    <p className="font-medium">{project.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {project.timeline} ·{" "}
                      {project.technologies.slice(0, 5).join(", ")}
                      {project.technologies.length > 5 &&
                        ` +${project.technologies.length - 5} more`}
                    </p>
                    <p className="text-sm">{project.description}</p>
                    {project.collaborators &&
                      project.collaborators.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {t("projects.collaborators") || "Collaborators"}:{" "}
                          {project.collaborators.join(", ")}
                        </p>
                      )}
                    <CardFooter className="flex justify-start gap-4 p-0 pt-2 print-hidden">
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
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center"
                          aria-label={`View live site for ${project.title}`}
                        >
                          <ExternalLink
                            className="mr-1 h-3 w-3"
                            aria-hidden="true"
                          />
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
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center"
                          aria-label={`View code for ${project.title}`}
                        >
                          <LuGithub
                            className="mr-1 h-3 w-3"
                            aria-hidden="true"
                          />
                          Code
                        </button>
                      )}
                      {project.downloadUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(
                              project.downloadUrl,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }}
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center"
                          aria-label={`Download ${project.title}`}
                        >
                          <Download
                            className="mr-1 h-3 w-3"
                            aria-hidden="true"
                          />
                          {t("navigation.download") || "Download"}
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

      // Skills Section
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
                key={`skill-${group.slug}-${i}-${chunkIndex}`}
                title={
                  i === 0 && chunkIndex === 0
                    ? t("skills.title") || "Skills"
                    : undefined
                }
              >
                <div className="space-y-1">
                  <p className="font-medium">{group.category}</p>
                  <ul className="list-disc ml-5 text-sm space-y-1">
                    {chunk.map((skill, idx) => (
                      <li key={`${group.slug}-skill-${skill.slug}-${idx}`}>
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

      // Education Section
      if (educations.length > 0) {
        sections.push(
          <div key="education" className="space-y-2">
            <h2 className="text-xl font-semibold">
              {t("resume.education") || "Education"}
            </h2>
            {educations.map((edu, index) => (
              <div key={`education-${index}`}>
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
    } catch (error) {
      console.error("Error generating resume sections:", error);
    } finally {
      setIsGeneratingContent(false);
    }
  }, [t, experiences, projects, skills, personal, educations]);

  useEffect(() => {
    const updateHeight = () => {
      const container = document.querySelector(".space-y-6");
      if (container) {
        const containerHeight = container.scrollHeight;
        setPageHeight(Math.max(containerHeight, 400));
      }
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
    if (!isGeneratingContent) {
      setCurrentPage(1);
    }
  }, [resumeSections, setCurrentPage, isGeneratingContent]);

  if (isGeneratingContent) {
    return (
      <main className="container py-8 sm:py-12 px-4 sm:px-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      {resumeSections.length === 0 ? (
        <Alert>
          <AlertDescription>
            No resume content available. Please check your data files.
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="p-8 flex flex-col shadow-lg print-content">
          <div
            ref={containerRef}
            className="space-y-6 max-h-[750px] min-h-[600px] overflow-hidden print:max-h-none print:overflow-visible"
            aria-live="polite"
            aria-label={`Resume page ${currentPage} of ${totalPages}`}
          >
            {/* In print, show ALL sections, not just current page */}
            <div className="hidden print:block">
              {resumeSections.map((section, index) => (
                <div key={`print-section-${index}`}>{section}</div>
              ))}
            </div>
            {/* In screen, show paginated content */}
            <div className="block print:hidden">
              {currentPageContent.map((section, index) => (
                <div key={`page-${currentPage}-section-${index}`}>
                  {section}
                </div>
              ))}
            </div>
          </div>

          <div
            ref={measureRef}
            aria-hidden="true"
            className="invisible absolute -z-50 h-0 overflow-hidden pointer-events-none"
          >
            {resumeSections.map((section, index) => (
              <div key={`measure-${index}`}>{section}</div>
            ))}
          </div>

          <div className="flex items-center flex-col justify-between print-hidden">
            <div className="flex items-center w-full md:justify-between justify-center pt-4 mt-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  aria-label="Go to previous page"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t("navigation.previous")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Go to next page"
                >
                  {t("navigation.next")}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <span className="text-sm hidden md:flex lg:flex text-muted-foreground">
                Page {currentPage} {t("navigation.of")} {totalPages}
              </span>
            </div>
            <span className="text-sm md:hidden lg:hidden text-muted-foreground mt-2">
              Page {currentPage} {t("navigation.of")} {totalPages}
            </span>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 print-hidden">
            <Button variant="outline" className="flex-1" asChild>
              <a
                href={`/resumes/${selectedRole.replace(
                  /\s+/g,
                  "_"
                )}_Resume_${language}.docx`}
                download={`${selectedRole.replace(
                  /\s+/g,
                  "_"
                )}_Resume_${language}.docx`}
                className="flex items-center justify-center gap-2"
              >
                <FileText className="h-4 w-4" />
                {t("resume.downloadDocx") || "Download DOCX"}
              </a>
            </Button>
            <Button className="flex-1" asChild>
              <a
                href={`/resumes/${selectedRole.replace(
                  /\s+/g,
                  "_"
                )}_Resume_${language}.pdf`}
                download={`${selectedRole.replace(
                  /\s+/g,
                  "_"
                )}_Resume_${language}.pdf`}
                className="flex items-center justify-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileIcon className="h-4 w-4" />
                {t("resume.downloadPdf") || "Download PDF"}
              </a>
            </Button>
          </div>
        </Card>
      )}
    </>
  );
});
