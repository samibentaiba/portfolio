"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ExternalLink } from "lucide-react";
import { LuGithub } from "react-icons/lu";
import { useLanguage } from "@/components/language-provider";
import { Project } from "@/types"; // Make sure this uses the updated type
import { Skill } from "./skill";

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const router = useRouter();
  const { t, getProjectsData } = useLanguage();

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      const initialProjects = getProjectsData(); // This gets the array from projects.json

      const processedProjects = await Promise.all(
        initialProjects.map(async (project: Project) => {
          // If fetchUrl is present and we don't already have a title, fetch metadata
          if (project.fetchUrl && !project.title) {
            try {
              const response = await fetch(`/api/get-metadata?url=${encodeURIComponent(project.fetchUrl)}`);
              if (!response.ok) throw new Error('API request failed');
              
              const metadata = await response.json();

              // Merge fetched data with existing data
              return {
                ...project, // Keeps slug, technologies, githubUrl, etc.
                title: metadata.title || 'Dynamic Project',
                shortDescription: metadata.description || 'No description found.',
                image: metadata.image || '/placeholder.svg?height=200&width=400',
              };
            } catch (error) {
              console.error(`Failed to fetch metadata for ${project.fetchUrl}`, error);
              // Return the project with fallbacks
              return {
                ...project,
                title: project.title || 'Project',
                shortDescription: project.shortDescription || 'Could not load details.',
                image: project.image || '/placeholder.svg?height=200&width=400',
              };
            }
          }
          // If no fetchUrl, return the project as-is
          return project;
        })
      );
      
      setProjects(processedProjects as Project[]);
      setIsLoading(false);
    };

    loadProjects();
  }, [getProjectsData]);


  // Optional: Show a loading state
  if (isLoading) {
    return (
      <section id="projects" className="w-full scroll-mt-16 px-4 sm:px-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter">
            {t("projects.title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("projects.subtitle")}
            Showcasing my work and contributions
          </p>
        </div>
        <div className="text-center py-10">Loading projects...</div>
      </section>
    );
  }

  return (
    <section id="projects" className="w-full scroll-mt-16 px-4 sm:px-0">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter">
            {t("projects.title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("projects.subtitle")}
            Showcasing my work and contributions
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.slug} // Use slug as key
              className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col "
              
            >
              <div className="relative aspect-video overflow-hidden cursor-pointer">
                <Image
                  src={project.image || "/placeholder.svg?height=200&width=400"}
                  alt={project.title || "Project Image"}
                  fill
                  onClick={() => router.push(`/projects/${project.slug}`)} // Pass the whole project
                  className="object-cover transition-all hover:scale-105"
                />
              </div>
              <CardHeader className="p-4 sm:pb-3">
                <CardTitle className="text-lg sm:text-xl">
                  {project.title || "Project Title"}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {project.shortDescription || ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:pt-0 flex-1">
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                  {project.technologies.map((tech) => (
                    <Skill key={tech} tech={tech} />
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between border-t p-3 sm:p-4">
                {project.liveUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents card click
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
                      e.stopPropagation(); // Prevents card click
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
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}