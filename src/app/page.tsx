import { Skills } from "@/components/skills";
import { Experiences } from "@/components/experiences";
import { Projects } from "@/components/projects";
import { Contact } from "@/components/contact"
import Hero from "@/components/hero";

export default async function Home() {
  return (
    <main  className="flex flex-col items-center justify-center w-full">
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
