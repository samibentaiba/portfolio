// src/app/projects/client.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LuGithub } from "react-icons/lu";
import { Download, ExternalLink, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useProjectsData } from "../(home)/hook";
import { Project } from "@/types";
import { getProjectImage } from "@/lib/utils";

export default function ProjectsListClient() {
  const { t, projects, isLoading, router } = useProjectsData();

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">Loading projects...</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="container py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/#projects"
            className="text-primary hover:underline mb-4 inline-flex items-center gap-1 text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("navigation.backToHome")}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {t("projects.title")}
          </h1>
          <p className="text-muted-foreground">{t("projects.subtitle")}</p>
        </motion.div>

        {/* Projects Narrative */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t("projects.narrative")}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* All Projects */}
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              router={router}
              t={t}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

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
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { duration: 0.4, ease: "easeOut" },
        },
      }}
    >
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
    </motion.div>
  );
});
