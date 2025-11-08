"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, ExternalLink, Github, Users } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Project } from "@/types";
import { Skill } from "@/components/skill";
export default function ProjectPage() {
  const params = useParams();
  const { t, getProjectsData } = useLanguage();
  const [project, setProject] = useState<Project>();

  useEffect(() => {
    const slug = params?.slug as string;
    const foundProject = getProjectsData().find((p) => p.slug === slug);

    if (foundProject) {
      setProject(foundProject);
    } else if (getProjectsData().length > 0) {
      notFound();
    }
  }, [params, getProjectsData]);

  if (!project) {
    return null;
  }

  return (
    <div className="container py-8 sm:py-12 px-4 sm:px-6 flex justify-center items-center min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/#projects"
            className="text-primary hover:underline mb-2 sm:mb-4 inline-block text-sm sm:text-base"
          >
            ← {t("projects.backToProjects")}
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
            {project.technologies.map((tech) => (
              <Skill key={tech} tech={tech} />
            ))}
          </div>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-lg mb-6 sm:mb-8 w-full">
          <Image
            src={project.image || "/placeholder.svg?height=400&width=800"}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto"
            >
              <Button className="gap-2 w-full sm:w-auto">
                <ExternalLink className="h-4 w-4" /> {t("projects.viewLive")}
              </Button>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Github className="h-4 w-4" /> {t("projects.viewCode")}
              </Button>
            </a>
          )}
        </div>

        <Card className="mb-6 sm:mb-8">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              {t("projects.description")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
            <p className="whitespace-pre-line text-sm sm:text-base">
              {project.description}
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">
                {t("projects.projectDetails")}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0 space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <div>
                <h3 className="font-medium mb-0.5 sm:mb-1 flex items-center">
                  <Calendar className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />{" "}
                  {t("projects.timeline")}
                </h3>
                <p className="text-muted-foreground">{project.timeline}</p>
              </div>

              <div>
                <h3 className="font-medium mb-0.5 sm:mb-1 flex items-center">
                  <Users className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />{" "}
                  {t("projects.collaborators")}
                </h3>
                {project.collaborators && project.collaborators.length > 0 ? (
                  <ul className="text-muted-foreground">
                    {project.collaborators.map(
                      (collaborator: string, index: number) => (
                        <li key={index}>{collaborator}</li>
                      ),
                    )}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    {t('projects.soloProject')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">
                {t("projects.personalExperience")}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
              <p className="whitespace-pre-line text-sm sm:text-base">
                {project.personalExperience}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
