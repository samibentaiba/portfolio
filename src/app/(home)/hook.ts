// src/app/(home)/hook.ts
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      const data = getPersonalData();
      setPersonal(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load personal data'));
      console.error('Error loading personal data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getPersonalData]);

  return { t, scrollToSection, personal, isLoading, error };
}

// ────────────────────────────────
// Skills Hook
// ────────────────────────────────
export function useSkillsData() {
  const { t, getSkillsData } = useLanguage();
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      const data = getSkillsData();
      setSkills(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load skills data'));
      console.error('Error loading skills:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getSkillsData]);

  return { t, skills, isLoading, error };
}

// ────────────────────────────────
// Experiences Hook
// ────────────────────────────────
export function useExperiencesData() {
  const { t, getExperiencesData } = useLanguage();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      const data = getExperiencesData();
      setExperiences(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load experiences data'));
      console.error('Error loading experiences:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getExperiencesData]);

  return { t, experiences, isLoading, error };
}

// ────────────────────────────────
// Projects Hook with Enhanced Error Handling
// ────────────────────────────────
export function useProjectsData() {
  const { t, getProjectsData } = useLanguage();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const initialProjects = getProjectsData();

        const processedProjects = await Promise.allSettled(
          initialProjects.map(async (project: Project) => {
            if (project.fetchUrl && !project.title) {
              try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

                const response = await fetch(
                  `/api/get-metadata?url=${encodeURIComponent(project.fetchUrl)}`,
                  { signal: controller.signal }
                );

                clearTimeout(timeoutId);

                if (!response.ok) {
                  throw new Error(`API request failed: ${response.statusText}`);
                }

                const metadata = await response.json();

                return {
                  ...project,
                  title: metadata.title || "Dynamic Project",
                  shortDescription: metadata.description || "No description found.",
                  image: metadata.image || "/placeholder.svg?height=200&width=400",
                };
              } catch (fetchError) {
                console.error(`Failed to fetch metadata for ${project.fetchUrl}:`, fetchError);
                
                return {
                  ...project,
                  title: project.title || "Project",
                  shortDescription: project.shortDescription || "Could not load details.",
                  image: project.image || "/placeholder.svg?height=200&width=400",
                };
              }
            }
            return project;
          })
        );

        if (!isMounted) return;

        // Extract successful results and handle failures gracefully
        const successfulProjects = processedProjects
          .filter((result): result is PromiseFulfilledResult<Project> => 
            result.status === 'fulfilled'
          )
          .map(result => result.value);

        setProjects(successfulProjects);
      } catch (err) {
        if (!isMounted) return;
        
        setError(err instanceof Error ? err : new Error('Failed to load projects'));
        console.error('Error loading projects:', err);
        
        // Fallback to initial data
        try {
          const fallbackData = getProjectsData();
          setProjects(fallbackData);
        } catch (fallbackErr) {
          console.error('Fallback also failed:', fallbackErr);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, [getProjectsData]);

  return { t, projects, isLoading, error, router };
}

// ────────────────────────────────
// Contact Form Hook with Enhanced Validation
// ────────────────────────────────
export function useContactForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = useMemo(() => z.object({
    firstName: z.string()
      .min(2, { message: t("contact.validation.firstNameRequired") || "First name is required" })
      .max(50, { message: "First name is too long" }),
    
    lastName: z.string()
      .min(2, { message: t("contact.validation.lastNameRequired") || "Last name is required" })
      .max(50, { message: "Last name is too long" }),
    
    email: z.string()
      .email({ message: t("contact.validation.emailValid") || "Please enter a valid email address" })
      .max(100, { message: "Email is too long" }),
    
    phone: z.string()
      .min(5, { message: t("contact.validation.phoneRequired") || "Phone number is required" })
      .max(20, { message: "Phone number is too long" })
      .regex(/^[\d\s\-\+\(\)]+$/, { message: "Invalid phone number format" }),
    
    projectName: z.string()
      .min(2, { message: t("contact.validation.projectRequired") || "Project name is required" })
      .max(100, { message: "Project name is too long" }),
    
    message: z.string()
      .min(10, { message: t("contact.validation.messageLength") || "Message must be at least 10 characters" })
      .max(1000, { message: "Message is too long (max 1000 characters)" }),
  }), [t]);

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

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      await sendContactForm(values);
      
      toast({
        title: t("contact.success.title") || "Message sent!",
        description: t("contact.success.description") || "Thank you for your message. I'll get back to you soon.",
        variant: "default",
      });
      
      form.reset();
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Error submitting contact form:', err);
      
      toast({
        title: t("contact.error.title") || "Something went wrong",
        description: err.message || t("contact.error.description") || "Your message couldn't be sent. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [t, toast, form]);

  return { t, form, isSubmitting, onSubmit };
}