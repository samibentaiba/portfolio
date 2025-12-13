// src/app/experiences/client.tsx
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
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useExperiencesData } from "../(home)/hook";
import { Experience } from "@/types";

export default function ExperiencesListClient() {
  const { t, experiences, isLoading } = useExperiencesData();

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">Loading experiences...</div>
      </div>
    );
  }

  if (experiences.length === 0) {
    return null;
  }

  return (
    <div className="container py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/#experiences"
            className="text-primary hover:underline mb-4 inline-flex items-center gap-1 text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("navigation.backToHome")}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {t("experiences.title")}
          </h1>
          <p className="text-muted-foreground">{t("experiences.subtitle")}</p>
        </motion.div>

        {/* Narrative Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-muted/50 border-dashed mb-8">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t("experiences.narrative")}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* All Experiences */}
        <motion.div
          className="flex flex-col gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12, delayChildren: 0.2 },
            },
          }}
        >
          {experiences.map((experience: Experience, index: number) => (
            <ExperienceCard
              key={experience.slug}
              experience={experience}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

const ExperienceCard = memo(function ExperienceCard({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: index % 2 === 0 ? -30 : 30 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      }}
    >
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
            <p className="text-xs sm:text-sm">{experience.summary}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
});
