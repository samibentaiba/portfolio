// src/app/(home)/client.tsx

"use client";

import Link from "next/link";
import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import {
  useExperiencesData,
} from "../hook";
import {
  Experience,
} from "@/types";
// ────────────────────────────────
// Experiences Section
// ────────────────────────────────
const Experiences = memo(function Experiences() {
  const { t, experiences } = useExperiencesData();

  if (experiences.length === 0) {
    return null;
  }

  return (
    <section
      id="experiences"
      className="w-full scroll-mt-16 px-4 sm:px-0"
      aria-labelledby="experiences-heading"
    >
      <div className="space-y-6">
        <div>
          <h2
            id="experiences-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tighter"
          >
            {t("experiences.title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("experiences.subtitle")}
          </p>
        </div>
        <div className="flex flex-col gap-6">
          {experiences.map((experience: Experience) => (
            <ExperienceCard key={experience.slug} experience={experience} />
          ))}
        </div>
      </div>
    </section>
  );
});

const ExperienceCard = memo(function ExperienceCard({
  experience,
}: {
  experience: Experience;
}) {
  return (
    <Link
      href={`/experiences/${experience.slug}`}
      aria-label={`View details about ${experience.role}`}
    >
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="p-4 sm:pb-3">
          <CardTitle className="text-lg sm:text-xl">
            {experience.role}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {experience.company}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:pt-0">
          <div className="flex gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 flex-wrap">
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" aria-hidden="true" />
              <span>{experience.period}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-1 h-3 w-3" aria-hidden="true" />
              <span>{experience.location}</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-none">
            {experience.summary}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
});

export default Experiences
