// src/app/(home)/_sections/Skills.tsx
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
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSkillsData } from "../hook";
import { SkillCategory } from "@/types";

// Featured categories to show on homepage
const FEATURED_CATEGORIES = [
  "development-operations",
  "architecture-documentation",
  "programming-languages",
];

// ────────────────────────────────
// Skills Section (Homepage - Featured Categories Only)
// ────────────────────────────────
const Skills = memo(function Skills() {
  const { t, skills } = useSkillsData();

  if (skills.length === 0) {
    return null;
  }

  // Filter to only show featured categories
  const featuredSkills = skills.filter((category) =>
    FEATURED_CATEGORIES.includes(category.slug)
  );

  if (featuredSkills.length === 0) {
    return null;
  }

  return (
    <motion.section
      className="w-full scroll-mt-16 px-4 py-15 sm:px-0"
      aria-labelledby="skills-heading"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="space-y-8">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div>
            <h2
              id="skills-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tighter"
            >
              {t("skills.title")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t("skills.subtitle")}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/skills" className="flex items-center gap-1">
              {t("skills.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Soft Skills Foundation Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t("skills.narrative")}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.3 },
            },
          }}
        >
          {featuredSkills.map((category: SkillCategory) => (
            <SkillCategoryCard key={category.slug} category={category} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
});

const SkillCategoryCard = memo(function SkillCategoryCard({
  category,
}: {
  category: SkillCategory;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.4, ease: "easeOut" },
        },
      }}
    >
      <Link href={`/categories/${category.slug}`}>
        <Card className="overflow-hidden transition-all hover:shadow-md h-full">
          <CardHeader className="p-4 sm:pb-3">
            <CardTitle className="text-lg sm:text-xl">
              {category.category}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {category.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:pt-0">
            <p className="text-xs text-muted-foreground">
              {category.items.length}{" "}
              {category.items.length === 1 ? "skill" : "skills"}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
});

export default Skills;
