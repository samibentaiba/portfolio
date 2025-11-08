"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { useScroll } from "@/hooks/use-scroll";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { sendContactForm } from "@/lib/contact";
import { Personal, SkillCategory, Experience, Project } from "@/types";

// ────────────────────────────────
// Hero Hook
// ────────────────────────────────
export function useHeroData() {
  const { t, getPersonalData } = useLanguage();
  const { scrollToSection } = useScroll();
  const [personal, setPersonal] = useState<Personal | null>(null);

  useEffect(() => {
    setPersonal(getPersonalData());
  }, [getPersonalData]);

  return { t, scrollToSection, personal };
}

// ────────────────────────────────
// Skills Hook
// ────────────────────────────────
export function useSkillsData() {
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const { t, getSkillsData } = useLanguage();

  useEffect(() => {
    setSkills(getSkillsData());
  }, [getSkillsData]);

  return { t, skills };
}

// ────────────────────────────────
// Experiences Hook
// ────────────────────────────────
export function useExperiencesData() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const { t, getExperiencesData } = useLanguage();

  useEffect(() => {
    setExperiences(getExperiencesData());
  }, [getExperiencesData]);

  return { t, experiences };
}

// ────────────────────────────────
// Projects Hook
// ────────────────────────────────
export function useProjectsData() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { t, getProjectsData } = useLanguage();

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      const initialProjects = getProjectsData();

      const processedProjects = await Promise.all(
        initialProjects.map(async (project: Project) => {
          if (project.fetchUrl && !project.title) {
            try {
              const response = await fetch(
                `/api/get-metadata?url=${encodeURIComponent(project.fetchUrl)}`
              );
              if (!response.ok) throw new Error("API request failed");
              const metadata = await response.json();
              return {
                ...project,
                title: metadata.title || "Dynamic Project",
                shortDescription:
                  metadata.description || "No description found.",
                image:
                  metadata.image || "/placeholder.svg?height=200&width=400",
              };
            } catch {
              return {
                ...project,
                title: project.title || "Project",
                shortDescription:
                  project.shortDescription || "Could not load details.",
                image: project.image || "/placeholder.svg?height=200&width=400",
              };
            }
          }
          return project;
        })
      );

      setProjects(processedProjects as Project[]);
      setIsLoading(false);
    };

    loadProjects();
  }, [getProjectsData]);

  return { t, projects, isLoading, router };
}

// ────────────────────────────────
// Contact Form Hook
// ────────────────────────────────
export function useContactForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    firstName: z.string().min(2, {
      message:
        t("contact.validation.firstNameRequired") || "First name is required",
    }),
    lastName: z.string().min(2, {
      message:
        t("contact.validation.lastNameRequired") || "Last name is required",
    }),
    email: z.string().email({
      message:
        t("contact.validation.emailValid") ||
        "Please enter a valid email address",
    }),
    phone: z.string().min(5, {
      message:
        t("contact.validation.phoneRequired") || "Phone number is required",
    }),
    projectName: z.string().min(2, {
      message:
        t("contact.validation.projectRequired") || "Project name is required",
    }),
    message: z.string().min(10, {
      message:
        t("contact.validation.messageLength") ||
        "Message must be at least 10 characters",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      projectName: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await sendContactForm(values);
      toast({
        title: t("contact.success.title") || "Message sent!",
        description:
          t("contact.success.description") ||
          "Thank you for your message. I'll get back to you soon.",
        variant: "default",
      });
      form.reset();
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        title: t("contact.error.title") || "Something went wrong",
        description:
          err.message ||
          t("contact.error.description") ||
          "Your message couldn't be sent. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return { t, form, isSubmitting, onSubmit };
}
