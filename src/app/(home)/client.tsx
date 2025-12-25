// src/app/(home)/client.tsx
"use client";
import Hero from "./_sections/Hero";
import Skills from "./_sections/Skills";
import Experiences from "./_sections/Experiences";
import Projects from "./_sections/Projects";
import Contact from "./_sections/Contact";
import Recommendations from "./_sections/Recommendations";
import CareerTimeline from "./_sections/CareerTimeline";
import { useScrollContext } from "@/components/scroll-context";
import { cn } from "@/lib/utils";

const FocusSection = ({
  id,
  children,
  className,
  center = false,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  center?: boolean;
}) => {
  const { activeSection } = useScrollContext();
  // Default to true if no active section (initial load) or if it matches
  const isActive = !activeSection || activeSection === id;

  return (
    <div
      id={id}
      className={cn(
        "snap-section min-h-screen flex flex-col py-10 transition-[opacity,filter] duration-700 ease-in-out",
        center ? "justify-center" : "justify-start",
        isActive
          ? "opacity-100 md:blur-0 md:grayscale-0 pointer-events-auto"
          : "opacity-100 md:opacity-0 md:blur-sm md:grayscale pointer-events-auto md:pointer-events-none",
        className
      )}
    >
      {children}
    </div>
  );
};

export default function HomeClient() {
  return (
    <main className="flex flex-col items-center justify-center w-full">
      <FocusSection id="hero" className="w-full" center>
        <Hero />
      </FocusSection>
      <div className="w-full max-w-6xl mx-auto">
        <FocusSection id="skills">
          <Skills />
        </FocusSection>
        <FocusSection id="experiences">
          <Experiences />
        </FocusSection>
        <FocusSection id="projects">
          <Projects />
        </FocusSection>
        <FocusSection id="career-timeline">
          <CareerTimeline />
        </FocusSection>
        <FocusSection id="contact">
          <Contact />
        </FocusSection>
        <FocusSection id="recommendations" center>
          <Recommendations />
        </FocusSection>
      </div>
    </main>
  );
}
