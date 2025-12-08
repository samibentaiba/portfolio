// src/app/(home)/_sections/Projects.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LuGithub } from "react-icons/lu";
import { Download, ExternalLink, ArrowRight, AlertTriangle } from "lucide-react";

import {
  useProjectsData,
} from "../hook";
import {
  Project,
} from "@/types";
import { getProjectImage } from "@/lib/utils";

// Featured project slugs
const FEATURED_PROJECTS = ["algis", "c-studio", "itc-hub"];

// ────────────────────────────────
// Projects Section (Homepage - 3 Featured Only)
// ────────────────────────────────
const Projects = memo(function Projects() {
  const { t, projects, isLoading, router } = useProjectsData();

  if (isLoading) {
    return (
      <section id="projects" className="w-full scroll-mt-16 px-4 sm:px-0">
        <div className="text-center py-10">
          <div className="animate-pulse">Loading projects...</div>
        </div>
      </section>
    );
  }

  // Filter to only show featured projects
  const featuredProjects = projects.filter((p) => FEATURED_PROJECTS.includes(p.slug));

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <section
      id="projects"
      className="w-full scroll-mt-16 px-4 sm:px-0"
      aria-labelledby="projects-heading"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2
              id="projects-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tighter"
            >
              {t("projects.title")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t("projects.subtitle")}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/projects" className="flex items-center gap-1">
              {t("projects.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              router={router}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

const ProjectCard = memo(function ProjectCard({
  project,
  router,
  t,
}: {
  project: Project;
  router: { push: (path: string) => void };
  t: (key: string) => string;
}) {
  const [imgSrc, setImgSrc] = useState(getProjectImage(project));

  useEffect(() => {
    setImgSrc(getProjectImage(project));
  }, [project]);

  const handleImageClick = useCallback(() => {
    router.push(`/projects/${project.slug}`);
  }, [router, project.slug]);

  const handleLiveClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (project.liveUrl) {
        window.open(project.liveUrl, "_blank", "noopener,noreferrer");
      }
    },
    [project.liveUrl]
  );

  const handleGithubClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (project.githubUrl) {
        window.open(project.githubUrl, "_blank", "noopener,noreferrer");
      }
    },
    [project.githubUrl]
  );

  const handleDownloadClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (project.downloadUrl) {
        window.open(project.downloadUrl, "_blank", "noopener,noreferrer");
      }
    },
    [project.downloadUrl]
  );

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden cursor-pointer">
          <Image
            src={imgSrc}
          alt={project.title || "Project Image"}
          fill
          onClick={handleImageClick}
          className="object-cover transition-all hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc("/placeholder.svg?height=400&width=800")}
        />
        {project.status && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-amber-500/90 text-black px-3 py-2 rounded-md flex items-center gap-2 max-w-[90%]" title={project.statusReason}>
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium truncate">{project.status}</span>
            </div>
          </div>
        )}
      </div>
      <CardHeader className="p-4 sm:pb-3">
        <CardTitle className="text-lg sm:text-xl">{project.title}</CardTitle>
        <CardDescription className="text-xs sm:text-sm line-clamp-2">
          {project.shortDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:pt-0 flex-1">
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
          {project.technologies.slice(0, 5).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 5 && (
            <Badge variant="outline" className="text-xs">
              +{project.technologies.length - 5}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-3 sm:p-4">
        {project.liveUrl && (
          <button
            onClick={handleLiveClick}
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center transition-colors"
            aria-label={`View live site for ${project.title}`}
          >
            <ExternalLink className="mr-1 h-3 w-3" aria-hidden="true" />
            {t("navigation.live")}
          </button>
        )}
        {project.downloadUrl && (
          <button
            onClick={handleDownloadClick}
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center transition-colors"
            aria-label={`Download ${project.title}`}
          >
            <Download className="mr-1 h-3 w-3" aria-hidden="true" />
            {t("projects.download")}
          </button>
        )}
        {project.githubUrl && (
          <button
            onClick={handleGithubClick}
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center transition-colors"
            aria-label={`View code for ${project.title}`}
          >
            <LuGithub className="mr-1 h-3 w-3" aria-hidden="true" />
            Code
          </button>
        )}
      </CardFooter>
    </Card>
  );
});

export default Projects
