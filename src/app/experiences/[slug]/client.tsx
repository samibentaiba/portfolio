"use client";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Skill } from "@/components/skill";
import { useExperience } from "./hook";

export default function ExperienceClient() {
  const { t } = useLanguage();
  const { experience } = useExperience();

  if (!experience) {
    return <div className="container py-8">Loading...</div>;
  }

  return (
    <div className="container py-8 sm:py-12 px-4 sm:px-6 flex justify-center items-center min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/#experiences"
            className="text-primary hover:underline mb-2 sm:mb-4 inline-block text-sm sm:text-base"
          >
            ← {t("experiences.backToExperiences")}
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">
            {experience.role}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground text-xs sm:text-sm">
            <span>{experience.company}</span>
            <Badge variant="outline" className="self-start sm:self-auto">
              {experience.type}
            </Badge>
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              {experience.period}
            </div>
            <div className="flex items-center">
              <MapPin className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              {experience.location}
            </div>
          </div>
        </div>

        <Card className="mb-6 sm:mb-8">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              {t("experiences.roleDescription")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
            <p className="whitespace-pre-line text-sm sm:text-base">
              {experience.description}
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">
                {t("experiences.skillsUsed")}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t("experiences.skillsApplied")}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {experience.skills.map((skill: string) => (
                  <Skill key={skill} tech={skill} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">
                {t("experiences.projects")}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t("experiences.keyProjects")}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
              <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2 text-xs sm:text-sm">
                {experience.projects.map((project: string, index: number) => (
                  <li key={index}>{project}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
