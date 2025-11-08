import { Skills } from "@/components/skills";
import { Experiences } from "@/components/experiences";
import { Projects } from "@/components/projects";
import { Contact } from "@/components/contact"
import Hero from "@/components/hero";
export const metadata = {
  title: "Bentaidev",
  description: "I'm a passionate and fast-learning software engineer and student who, within 3 years, has mastered full-stack web development using both JavaScript , Java and PHP. Currently, I'm expanding my skills into desktop and mobile application development, along with a deep focus on building software services across multiple platforms. My drive to continuously learn and adapt allows me to tackle new technologies quickly and effectively.",
};

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
