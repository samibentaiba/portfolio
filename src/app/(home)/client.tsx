// src/app/(home)/client.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, MapPin, ExternalLink } from "lucide-react";
import { LuGithub } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  useHeroData,
  useSkillsData,
  useExperiencesData,
  useProjectsData,
  useContactForm,
} from "./hook";
import {
  Skill as SkillType,
  SkillCategory,
  Experience,
  Project,
} from "@/types";

export default function HomeClient() {
  return (
    <main className="flex flex-col items-center justify-center w-full">
      <Hero />
      <div className="w-full max-w-6xl mx-auto space-y-16 sm:space-y-24">
        <Skills />
        <Experiences />
        <Projects />
        <Contact />
      </div>
    </main>
  );
}

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
        <div className="flex space-y-12 flex-col items-center text-center">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-6xl lg:text-7xl">
              {t(personal.name)}
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-xl">
              {t(personal.job)}
            </p>
          </div>
          <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
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
          </div>
        </div>
      </div>
    </section>
  );
});

// ────────────────────────────────
// Skills Section
// ────────────────────────────────
const Skills = memo(function Skills() {
  const { t, skills } = useSkillsData();

  if (skills.length === 0) {
    return null;
  }

  return (
    <section
      id="skills"
      className="w-full scroll-mt-16 px-4 sm:px-0"
      aria-labelledby="skills-heading"
    >
      <div className="space-y-6">
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
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((category: SkillCategory) => (
            <SkillCard key={category.slug} category={category} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
});

const SkillCard = memo(function SkillCard({
  category,
  t,
}: {
  category: SkillCategory;
  t: (key: string) => string;
}) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 sm:pb-3">
        <CardTitle className="text-lg sm:text-xl">
          {category.category}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {category.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:pt-0">
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
          {category.items.map((skill: SkillType) => (
            <Link
              href={`/skills/${skill.slug}`}
              key={skill.slug}
              aria-label={`Learn more about ${skill.name}`}
            >
              <Badge
                variant="outline"
                className="text-xs cursor-pointer hover:bg-muted transition-colors"
              >
                {skill.name}
              </Badge>
            </Link>
          ))}
        </div>
        <Link
          href={`/categories/${category.slug}`}
          className="text-xs sm:text-sm text-primary flex items-center hover:underline"
          aria-label={`Learn more about ${category.category}`}
        >
          {t("skills.learnMore")} {category.category.toLowerCase()}
          <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
        </Link>
      </CardContent>
    </Card>
  );
});

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

// ────────────────────────────────
// Projects Section
// ────────────────────────────────
const Projects = memo(function Projects() {
  const { t, projects, isLoading, router } = useProjectsData();

  if (isLoading) {
    return (
      <section id="projects" className="w-full scroll-mt-16 px-4 sm:px-0">
        <div className="text-center py-10">
          <div className="animate-pulse">Loading projects...</div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      id="projects"
      className="w-full scroll-mt-16 px-4 sm:px-0"
      aria-labelledby="projects-heading"
    >
      <div className="space-y-6">
        <h2
          id="projects-heading"
          className="text-2xl sm:text-3xl font-bold tracking-tighter"
        >
          {t("projects.title")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t("projects.subtitle")}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              router={router}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

const ProjectCard = memo(function ProjectCard({
  project,
  router,
  t,
}: {
  project: Project;
  router: { push: (path: string) => void };
  t: (key: string) => string;
}) {
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

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden cursor-pointer">
        <Image
          src={project.image || "/placeholder.svg?height=200&width=400"}
          alt={project.title || "Project Image"}
          fill
          onClick={handleImageClick}
          className="object-cover transition-all hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
  );
});

// ────────────────────────────────
// Contact Section
// ────────────────────────────────
const Contact = memo(function Contact() {
  return (
    <section
      id="contact"
      className="w-full scroll-mt-16 px-4 sm:px-0 py-8 sm:py-12"
      aria-labelledby="contact-heading"
    >
      <Card>
        <CardContent className="p-6">
          <ContactForm />
        </CardContent>
      </Card>
    </section>
  );
});

const ContactForm = memo(function ContactForm() {
  const { t, form, isSubmitting, onSubmit } = useContactForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h2 id="contact-heading" className="text-2xl font-bold">
            {t("contact.form.title") || "Contact Me"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("contact.form.description") ||
              "Fill out the form below to get in touch."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("contact.form.firstName") || "First Name"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={
                      t("contact.form.firstNamePlaceholder") ||
                      "Enter your first name"
                    }
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("contact.form.lastName") || "Last Name"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={
                      t("contact.form.lastNamePlaceholder") ||
                      "Enter your last name"
                    }
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contact.form.email") || "Email"}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder={
                      t("contact.form.emailPlaceholder") || "Enter your email"
                    }
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contact.form.phone") || "Phone"}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder={
                      t("contact.form.phonePlaceholder") || "Enter your phone"
                    }
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("contact.form.projectName") || "Project Name"}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={
                    t("contact.form.projectNamePlaceholder") ||
                    "Enter project name"
                  }
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contact.form.message") || "Message"}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={
                    t("contact.form.messagePlaceholder") ||
                    "Tell me about your project..."
                  }
                  rows={5}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              {t("contact.form.sending")}
            </>
          ) : (
            t("contact.form.submit")
          )}
        </Button>
      </form>
    </Form>
  );
});
