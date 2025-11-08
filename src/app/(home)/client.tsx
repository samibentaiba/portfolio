"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Skill as SkillType, SkillCategory } from "@/types";
import { Calendar } from "lucide-react";
import { MapPin } from "lucide-react";
import { Experience } from "@/types";
import { ExternalLink } from "lucide-react";
import { LuGithub } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { Project } from "@/types"; // Make sure this uses the updated type
import { Phone } from "lucide-react";
import { Mail } from "lucide-react";
import { Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendContactForm } from "@/lib/contact";
import { ReloadIcon } from "@radix-ui/react-icons";

import { useScroll } from "@/hooks/use-scroll";
import { Personal } from "@/types";

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

function Hero() {
  const { t, getPersonalData } = useLanguage();
  const { scrollToSection } = useScroll();
  const [personal, setPerosnal] = useState<Personal | null>(null);
  useEffect(() => {
    setPerosnal(getPersonalData());
  }, [getPersonalData]);
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
            <Button
              onClick={() => {
                scrollToSection("projects");
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
            >
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

function Skills() {
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const { t, getSkillsData } = useLanguage();

  useEffect(() => {
    setSkills(getSkillsData());
  }, [getSkillsData]);

  return (
    <section id="skills" className="w-full scroll-mt-16 px-4 sm:px-0">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter">
            {t("skills.title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("skills.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((category) => (
            <Card
              key={category.category}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <CardHeader className="p-4 sm:pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">
                      {category.category}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {category.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:pt-0">
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                  {category.items.map((skill: SkillType) => (
                    <Link href={`/skills/${skill.slug}`} key={skill.name}>
                      <Badge
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-muted"
                      >
                        {skill.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-xs sm:text-sm text-primary flex items-center hover:underline"
                >
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

function Experiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const { t, getExperiencesData } = useLanguage();

  useEffect(() => {
    setExperiences(getExperiencesData());
  }, [getExperiencesData]);

  return (
    <section id="experiences" className="w-full scroll-mt-16 px-4 sm:px-0">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter">
            {t("experiences.title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("experiences.subtitle")}
          </p>
        </div>
        <div className="flex flex-col gap-6">
          {experiences.map((experience) => (
            <Link
              href={`/experiences/${experience.slug}`}
              key={experience.role}
            >
              <Card className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="p-4 sm:pb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                    <div>
                      <CardTitle className="text-lg sm:text-xl">
                        {experience.role}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {experience.company}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="self-start sm:self-auto"
                    >
                      {experience.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:pt-0">
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      {experience.period}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      {experience.location}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-none">
                    {experience.summary}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const router = useRouter();
  const { t, getProjectsData } = useLanguage();

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      const initialProjects = getProjectsData(); // This gets the array from projects.json

      const processedProjects = await Promise.all(
        initialProjects.map(async (project: Project) => {
          // If fetchUrl is present and we don't already have a title, fetch metadata
          if (project.fetchUrl && !project.title) {
            try {
              const response = await fetch(
                `/api/get-metadata?url=${encodeURIComponent(project.fetchUrl)}`
              );
              if (!response.ok) throw new Error("API request failed");

              const metadata = await response.json();

              // Merge fetched data with existing data
              return {
                ...project, // Keeps slug, technologies, githubUrl, etc.
                title: metadata.title || "Dynamic Project",
                shortDescription:
                  metadata.description || "No description found.",
                image:
                  metadata.image || "/placeholder.svg?height=200&width=400",
              };
            } catch (error) {
              console.error(
                `Failed to fetch metadata for ${project.fetchUrl}`,
                error
              );
              // Return the project with fallbacks
              return {
                ...project,
                title: project.title || "Project",
                shortDescription:
                  project.shortDescription || "Could not load details.",
                image: project.image || "/placeholder.svg?height=200&width=400",
              };
            }
          }
          // If no fetchUrl, return the project as-is
          return project;
        })
      );

      setProjects(processedProjects as Project[]);
      setIsLoading(false);
    };

    loadProjects();
  }, [getProjectsData]);

  // Optional: Show a loading state
  if (isLoading) {
    return (
      <section id="projects" className="w-full scroll-mt-16 px-4 sm:px-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter">
            {t("projects.title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("projects.subtitle")}
            Showcasing my work and contributions
          </p>
        </div>
        <div className="text-center py-10">Loading projects...</div>
      </section>
    );
  }

  return (
    <section id="projects" className="w-full scroll-mt-16 px-4 sm:px-0">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter">
            {t("projects.title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("projects.subtitle")}
            Showcasing my work and contributions
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.slug} // Use slug as key
              className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col "
            >
              <div className="relative aspect-video overflow-hidden cursor-pointer">
                <Image
                  src={project.image || "/placeholder.svg?height=200&width=400"}
                  alt={project.title || "Project Image"}
                  fill
                  onClick={() => router.push(`/projects/${project.slug}`)} // Pass the whole project
                  className="object-cover transition-all hover:scale-105"
                />
              </div>
              <CardHeader className="p-4 sm:pb-3">
                <CardTitle className="text-lg sm:text-xl">
                  {project.title || "Project Title"}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {project.shortDescription || ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:pt-0 flex-1">
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                  {project.technologies.map((tech) => (
                    <Skill key={tech} tech={tech} />
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between border-t p-3 sm:p-4">
                {project.liveUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents card click
                      window.open(
                        project.liveUrl,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center"
                  >
                    <ExternalLink className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />{" "}
                    {t("navigation.live")}
                  </button>
                )}
                {project.githubUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents card click
                      window.open(
                        project.githubUrl,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center       "
                  >
                    <LuGithub className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Code
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

interface SkillProps {
  tech: string;
}

const Skill = ({ tech }: SkillProps) => {
  const { getSkillsData } = useLanguage();
  const skills = getSkillsData();

  const matchedSkill = skills
    .flatMap((category) => category.items)
    .find((item) => item.name.toLowerCase() === tech.toLowerCase());

  const slug = matchedSkill?.slug || tech.toLowerCase();

  const badge = (
    <Badge
      variant="outline"
      className={`text-xs ${
        matchedSkill ? "hover:bg-muted cursor-pointer" : "opacity-50"
      }`}
    >
      {tech}
    </Badge>
  );

  if (matchedSkill) {
    return (
      <span onClick={(e) => e.stopPropagation()}>
        <Link href={`/skills/${slug}`}>{badge}</Link>
      </span>
    );
  }

  return <span>{badge}</span>;
};

function Contact() {
  const { t } = useLanguage();

  return (
    <section
      id="contact"
      className="w-full scroll-mt-16 px-4 sm:px-0 py-8 sm:py-12"
    >
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter">
            {t("contact.title") || "Contact Me"}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mt-2">
            {t("contact.subtitle") ||
              "Have a project in mind? Let's work together to bring your ideas to life."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <Card className="lg:col-span-2">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">
                {t("contact.form.title") || "Send Me a Message"}
              </CardTitle>
              <CardDescription>
                {t("contact.form.description") ||
                  "Fill out the form below and I'll get back to you as soon as possible."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <ContactForm />
            </CardContent>
          </Card>

          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">
                  {t("contact.info.title") || "Contact Information"}
                </CardTitle>
                <CardDescription>
                  {t("contact.info.description") ||
                    "Feel free to reach out through any of these channels."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <h3 className="text-sm font-medium">
                      {t("contact.info.email") || "Email"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      contact@example.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <h3 className="text-sm font-medium">
                      {t("contact.info.phone") || "Phone"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <h3 className="text-sm font-medium">
                      {t("contact.info.location") || "Location"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      New York, NY, USA
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <h3 className="text-sm font-medium">
                      {t("contact.info.hours") || "Working Hours"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Mon - Fri: 9AM - 5PM EST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">
                  {t("contact.response.title") || "Response Time"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <p className="text-sm">
                  {t("contact.response.description") ||
                    "I typically respond to inquiries within 24-48 hours during business days. For urgent matters, please indicate in your message."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation schema
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

  // Initialize form
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

  // Form submission handler
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    placeholder={
                      t("contact.form.firstNamePlaceholder") ||
                      "Enter your first name"
                    }
                    {...field}
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
                    placeholder={
                      t("contact.form.lastNamePlaceholder") ||
                      "Enter your last name"
                    }
                    {...field}
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
                    placeholder={
                      t("contact.form.emailPlaceholder") || "Enter your email"
                    }
                    {...field}
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
                <FormLabel>
                  {t("contact.form.phone") || "Phone Number"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      t("contact.form.phonePlaceholder") ||
                      "Enter your phone number"
                    }
                    {...field}
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
                  placeholder={
                    t("contact.form.projectNamePlaceholder") ||
                    "Enter your project name"
                  }
                  {...field}
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
                  placeholder={
                    t("contact.form.messagePlaceholder") ||
                    "Tell me about your project..."
                  }
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("contact.form.messageDescription") ||
                  "Please provide details about your project and requirements."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              {t("contact.form.sending") || "Sending..."}
            </>
          ) : (
            t("contact.form.submit") || "Send Message"
          )}
        </Button>
      </form>
    </Form>
  );
}
