"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, MapPin, ExternalLink } from "lucide-react";
import { LuGithub } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl,  FormField,
  FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ReloadIcon } from "@radix-ui/react-icons";
import {
  useHeroData,
  useSkillsData,
  useExperiencesData,
  useProjectsData,
  useContactForm,
} from "./hook";
import {  Skill as SkillType, SkillCategory, Experience } from "@/types";

export default function HomeClient() {
  return (
    <main className="flex flex-col items-center justify-center w-full">
      <Hero />
      <div className="w-full max-w-6xl mx-auto space-y-16 sm:space-y-24 ">
        <Skills />
        <Experiences />
        <Projects />
        <Contact />
      </div>
    </main>
  );
}

// ────────────────────────────────
// Hero
// ────────────────────────────────
function Hero() {
  const { t, scrollToSection, personal } = useHeroData();

  return (
    <div className="w-full h-screen items-center flex justify-center ">
      <div className="container px-4 md:px-6">
        <div className="flex space-y-12 flex-col items-center text-center">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-6xl lg:text-7xl">
              {t(personal?.name || "your name")}
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-xl">
              {t(personal?.job || "your job")}
            </p>
          </div>
          <div className="flex justify-center gap-3 sm:gap-4">
            <Button onClick={() => scrollToSection("projects")} className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
              {t("hero.viewProjects")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Link href="/resume" rel="noopener noreferrer">
              <Button variant="outline" className="w-full sm:w-auto">
                {t("hero.resume")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────
// Skills
// ────────────────────────────────
function Skills() {
  const { t, skills } = useSkillsData();

  return (
    <section id="skills" className="w-full scroll-mt-16 px-4 sm:px-0">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter">{t("skills.title")}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{t("skills.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((category: SkillCategory) => (
            <Card key={category.category} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="p-4 sm:pb-3">
                <CardTitle className="text-lg sm:text-xl">{category.category}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:pt-0">
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                  {category.items.map((skill: SkillType) => (
                    <Link href={`/skills/${skill.slug}`} key={skill.name}>
                      <Badge variant="outline" className="text-xs cursor-pointer hover:bg-muted">
                        {skill.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
                <Link href={`/categories/${category.slug}`} className="text-xs sm:text-sm text-primary flex items-center hover:underline">
                  {t("skills.learnMore")} {category.category.toLowerCase()}
                  <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────
// Experiences
// ────────────────────────────────
function Experiences() {
  const { t, experiences } = useExperiencesData();

  return (
    <section id="experiences" className="w-full scroll-mt-16 px-4 sm:px-0">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter">{t("experiences.title")}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{t("experiences.subtitle")}</p>
        </div>
        <div className="flex flex-col gap-6">
          {experiences.map((experience: Experience) => (
            <Link href={`/experiences/${experience.slug}`} key={experience.role}>
              <Card className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="p-4 sm:pb-3">
                  <CardTitle className="text-lg sm:text-xl">{experience.role}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{experience.company}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:pt-0">
                  <div className="flex gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    <div className="flex items-center"><Calendar className="mr-1 h-3 w-3" />{experience.period}</div>
                    <div className="flex items-center"><MapPin className="mr-1 h-3 w-3" />{experience.location}</div>
                  </div>
                  <p className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-none">{experience.summary}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────
// Projects
// ────────────────────────────────
function Projects() {
  const { t, projects, isLoading, router } = useProjectsData();

  if (isLoading) {
    return <section id="projects" className="w-full scroll-mt-16 px-4 sm:px-0"><div className="text-center py-10">Loading projects...</div></section>;
  }

  return (
    <section id="projects" className="w-full scroll-mt-16 px-4 sm:px-0">
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter">{t("projects.title")}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">{t("projects.subtitle")} Showcasing my work</p>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.slug} className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
              <div className="relative aspect-video overflow-hidden cursor-pointer">
                <Image src={project.image || "/placeholder.svg?height=200&width=400"} alt={project.title || "Project Image"} fill onClick={() => router.push(`/projects/${project.slug}`)} className="object-cover transition-all hover:scale-105" />
              </div>
              <CardHeader className="p-4 sm:pb-3">
                <CardTitle className="text-lg sm:text-xl">{project.title}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">{project.shortDescription}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:pt-0 flex-1">
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-3 sm:p-4">
                {project.liveUrl && (
                  <button onClick={(e) => { e.stopPropagation(); window.open(project.liveUrl, "_blank"); }} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center">
                    <ExternalLink className="mr-1 h-3 w-3" /> {t("navigation.live")}
                  </button>
                )}
                {project.githubUrl && (
                  <button onClick={(e) => { e.stopPropagation(); window.open(project.githubUrl, "_blank"); }} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center">
                    <LuGithub className="mr-1 h-3 w-3" /> Code
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

// ────────────────────────────────
// Contact Form
// ────────────────────────────────
function Contact() {
  
  return (
    <section id="contact" className="w-full scroll-mt-16 px-4 sm:px-0 py-8 sm:py-12">
      <Card><CardContent><ContactForm /></CardContent></Card>
    </section>
  );
}

function ContactForm() {
  const { t, form, isSubmitting, onSubmit } = useContactForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* All fields */}
        <FormField control={form.control} name="firstName" render={({ field }) => (
          <FormItem>
            <FormLabel>{t("contact.form.firstName") || "First Name"}</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (<><ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> {t("contact.form.sending")}</>) : t("contact.form.submit")}
        </Button>
      </form>
    </Form>
  );
}
