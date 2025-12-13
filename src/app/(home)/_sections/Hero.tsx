// src/app/(home)/_sections/Projects.tsx
"use client";

import Link from "next/link";
import { memo, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import { useHeroData } from "../hook";

// ────────────────────────────────
// Hero Section
// ────────────────────────────────
const Hero = memo(function Hero() {
  const { t, scrollToSection, personal } = useHeroData();

  const handleProjectsClick = useCallback(() => {
    scrollToSection("projects");
  }, [scrollToSection]);

  if (!personal) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <section
      className="w-full h-screen items-center flex justify-center"
      aria-label="Hero section"
    >
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex space-y-12 flex-col items-center text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.2 },
            },
          }}
        >
          <div className="space-y-6">
            <motion.h1
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-6xl lg:text-7xl"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: "easeOut" },
                },
              }}
            >
              {t(personal.name)}
            </motion.h1>
            <motion.p
              className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-xl"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
            >
              {t(personal.job)}
            </motion.p>
          </div>
          <motion.div
            className="flex justify-center gap-3 sm:gap-4 flex-wrap"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: "easeOut" },
              },
            }}
          >
            <Button
              onClick={handleProjectsClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
              aria-label="View my projects"
            >
              {t("hero.viewProjects")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Link href="/resume" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                aria-label="View my resume"
              >
                {t("hero.resume")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

export default Hero;
