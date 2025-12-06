// src/app/(home)/client.tsx
"use client";
import Hero from "./_sections/Hero"
import Skills from "./_sections/Skills"
import Experiences from "./_sections/Experiences"
import Projects from "./_sections/Projects"
import Contact from "./_sections/Contact"
import Recommendations from "./_sections/Recommendations"
import CareerTimeline from "./_sections/CareerTimeline"

export default function HomeClient() {
  return (
    <main className="flex flex-col items-center justify-center w-full">
      <Hero />
      <div className="w-full max-w-6xl mx-auto space-y-16 sm:space-y-24">
        <Skills />
        <Experiences />
        <Projects />
        <CareerTimeline />
        <Contact />
        <Recommendations />
      </div>
    </main>
  );
}

