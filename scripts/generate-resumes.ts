import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { Packer } from "docx";
import { RESUME_ROLES, ResumeRole } from "../src/lib/resume-roles";
import { filterResumeData } from "../src/lib/resume-filter";
import { generateResumeDoc } from "../src/lib/resume-generator";
import {
  Personal,
  Experience,
  Project,
  SkillCategory,
  Education,
} from "../src/types";

// Mock translation function for the generator
const getTranslator = (lang: string) => {
  const translationsPath = path.join(
    process.cwd(),
    `src/data/translations/${lang}.json`
  );
  let translations: Record<string, any> = {};
  if (fs.existsSync(translationsPath)) {
    translations = JSON.parse(fs.readFileSync(translationsPath, "utf8"));
  }

  return (key: string) => {
    const keys = key.split(".");
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
};

const LANGUAGES = ["en", "fr", "ar"];

async function generateResumes() {
  try {
    const outputDir = path.join(process.cwd(), "public/resumes");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const lang of LANGUAGES) {
      console.log(
        `\nGenerating resumes for language: ${lang.toUpperCase()}...`
      );
      const t = getTranslator(lang);

      // Helper to load data file (default or localized)
      const loadData = (filename: string) => {
        const defaultPath = path.join(
          process.cwd(),
          `src/data/${filename}.json`
        );
        const localizedPath = path.join(
          process.cwd(),
          `src/data/translations/${filename}-${lang}.json`
        );

        // For English, use default. For others, try localized, fallback to default.
        if (lang === "en") {
          return JSON.parse(fs.readFileSync(defaultPath, "utf8"));
        } else {
          if (fs.existsSync(localizedPath)) {
            return JSON.parse(fs.readFileSync(localizedPath, "utf8"));
          } else {
            console.warn(
              `Warning: Localized file ${localizedPath} not found. Using default.`
            );
            return JSON.parse(fs.readFileSync(defaultPath, "utf8"));
          }
        }
      };

      const personal: Personal = loadData("personal");
      const experiences: Experience[] = loadData("experiences");
      const projects: Project[] = loadData("projects");
      const skills: SkillCategory[] = loadData("skills");

      // Try to load educations, fallback to hardcoded if not found
      let educations: Education[] = [];
      try {
        educations = loadData("educations");
      } catch (e) {
        // Fallback if file doesn't exist (e.g. for 'en' if it's not in src/data)
        // Check if it exists in translations for other langs
        if (lang === "en") {
          // Hardcoded fallback for EN if file missing
          educations = [
            {
              degree: "Master's Degree in Software Engineering",
              institution: "USTHB",
              startYear: 2023,
              endYear: 2025,
            },
            {
              degree: "Bachelor's Degree in Computer Science",
              institution: "USTHB",
              startYear: 2020,
              endYear: 2023,
            },
          ];
        }
      }

      console.log(`Generating resumes for ${RESUME_ROLES.length} roles...`);

      for (const role of RESUME_ROLES) {
        // console.log(`Processing role: ${role}`);

        const { filteredExperiences, filteredProjects, filteredSkills } =
          filterResumeData(role, experiences, projects, skills);

        const doc = generateResumeDoc(
          personal,
          filteredSkills,
          filteredExperiences,
          filteredProjects,
          educations,
          t,
          lang
        );

        const buffer = await Packer.toBuffer(doc);

        // Sanitize filename with language suffix
        // e.g. Software_Engineer_Resume_fr.docx
        // For English, maybe keep it without suffix? Or add _en?
        // The user request implies "support what language is requested".
        // Let's add suffix for ALL to be explicit, or keep no suffix for EN if backward compat needed.
        // But the user said "fix... to be also support", implying existing one might stay?
        // Let's add suffix for non-en, or maybe for all.
        // Given the UI likely expects specific names, I should check client.tsx.
        // client.tsx constructs filename: `${selectedRole.replace(/\s+/g, "_")}_Resume.docx`
        // It doesn't seem to account for language yet.
        // I will generate `_en` for English and update client to use it, OR keep default as English.
        // Let's do: `_fr`, `_ar`, and for English... let's keep it standard or add `_en`.
        // I'll add `_${lang}` to all to be consistent.

        const filename = `${role.replace(/\s+/g, "_")}_Resume_${lang}.docx`;
        const filePath = path.join(outputDir, filename);

        fs.writeFileSync(filePath, buffer);
        // console.log(`Saved DOCX: ${filePath}`);

        // Convert to PDF using LibreOffice
        try {
          // console.log(`Converting to PDF...`);
          execSync(
            `libreoffice --headless --convert-to pdf "${filePath}" --outdir "${outputDir}"`,
            {
              stdio: "pipe", // Suppress output unless error
            }
          );
          // const pdfFilename = filename.replace(".docx", ".pdf");
          // console.log(`Saved PDF: ${path.join(outputDir, pdfFilename)}`);
        } catch (error) {
          console.error(`Failed to generate PDF for ${role} (${lang}):`, error);
        }
      }
    }

    console.log(
      "All resumes (DOCX & PDF) generated successfully for all languages!"
    );
  } catch (error) {
    console.error("Error generating resumes:", error);
    process.exit(1);
  }
}

generateResumes();
