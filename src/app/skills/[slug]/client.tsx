"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSkillData } from "./hook";

export default function SkillClient() {
  const { t, skill, category, relatedProjects, loading } = useSkillData();

  if (loading || !skill || !category) {
    return <div className="container py-8">Loading...</div>;
  }

  return (
    <div className="container py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
            <Link href="/#skills" className="text-primary hover:underline text-sm sm:text-base">
              ← {t("skills.backToSkills")}
            </Link>
            <Link
              href={`/categories/${category.slug}`}
              className="text-primary hover:underline text-sm sm:text-base"
            >
              {t("skills.viewCategory")} {category.category}
            </Link>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">{skill.name}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {category.category} • {skill.experience}
          </p>
        </div>

        <Card className="mb-6 sm:mb-8">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">{t("skills.description")}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
            <p className="text-sm sm:text-base">{skill.description}</p>
          </CardContent>
        </Card>

        {relatedProjects.length > 0 && (
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">{t("skills.projectsUsing")}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t("skills.projectsApplied")} {skill.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
              <div className="grid gap-3 sm:gap-4">
                {relatedProjects.map((project) => (
                  <Link href={`/projects/${project.slug}`} key={project.slug}>
                    <div className="p-3 sm:p-4 border rounded-lg hover:bg-muted transition-colors">
                      <h3 className="font-medium mb-0.5 sm:mb-1 text-sm sm:text-base">{project.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
                        {project.shortDescription}
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {project.technologies.map((tech: string) => (
                          <Badge
                            key={tech}
                            variant={
                              tech.toLowerCase() === skill.name.toLowerCase()
                                ? "default"
                                : "secondary"
                            }
                            className={`text-xs ${
                              tech.toLowerCase() === skill.name.toLowerCase() ? "" : "bg-muted"
                            }`}
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
