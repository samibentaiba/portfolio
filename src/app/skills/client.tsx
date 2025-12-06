// src/app/skills/client.tsx
"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useSkillsData } from "../(home)/hook";
import { SkillCategory, Skill } from "@/types";

export default function SkillsListClient() {
  const { t, skills, isLoading } = useSkillsData();

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">Loading skills...</div>
      </div>
    );
  }

  if (skills.length === 0) {
    return null;
  }

  return (
    <div className="container py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/#skills"
            className="text-primary hover:underline mb-4 inline-flex items-center gap-1 text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("navigation.backToHome")}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {t("skills.title")}
          </h1>
          <p className="text-muted-foreground">{t("skills.subtitle")}</p>
        </div>

        {/* All Categories */}
        <div className="space-y-12">
          {skills.map((category: SkillCategory) => (
            <section key={category.slug} id={category.slug}>
              <div className="mb-6">
                <Link href={`/categories/${category.slug}`}>
                  <h2 className="text-2xl font-bold mb-2 hover:text-primary transition-colors">
                    {category.category}
                  </h2>
                </Link>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.items.map((skill: Skill) => (
                  <Link href={`/skills/${skill.slug}`} key={skill.slug}>
                    <Card className="h-full hover:shadow-md transition-all">
                      <CardHeader className="p-4 sm:p-6">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{skill.name}</CardTitle>
                          <Badge variant="outline">{skill.experience}</Badge>
                        </div>
                        <CardDescription className="text-xs sm:text-sm mt-1">
                          {t("skills.clickToView")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                        <p className="text-sm line-clamp-3">{skill.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
