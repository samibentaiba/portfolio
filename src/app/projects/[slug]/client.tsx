"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Download,
  ExternalLink,
  Github,
  Users,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Skill } from "@/components/skill";
import { useProject } from "./hook";
import { getProjectImage } from "@/lib/utils";

export default function ProjectClient() {
  const { t } = useLanguage();
  const { project } = useProject();
  const [imgSrc, setImgSrc] = useState<string>("");

  useEffect(() => {
    if (project) {
      setImgSrc(getProjectImage(project));
    }
  }, [project]);

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

        {project.status &&
          (project.status.toLowerCase().includes("available") ? (
            <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-4 mb-6 sm:mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-emerald-500">
                    {project.status}
                  </p>
                  {project.statusReason && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.statusReason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4 mb-6 sm:mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-500">{project.status}</p>
                  {project.statusReason && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.statusReason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

        <div className="relative aspect-video overflow-hidden rounded-lg mb-6 sm:mb-8 w-full">
          <Image
            src={imgSrc || "/placeholder.svg?height=400&width=800"}
            alt={project.title}
            fill
            priority
            className="object-cover"
            onError={() => setImgSrc("/placeholder.svg?height=400&width=800")}
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
          {project.downloadUrl && (
            <a href={project.downloadUrl} download className="w-full sm:w-auto">
              <Button className="gap-2 w-full sm:w-auto">
                <Download className="h-4 w-4" /> {t("projects.download")}
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
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    {t("projects.soloProject")}
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
