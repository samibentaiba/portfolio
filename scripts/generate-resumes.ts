#!/usr/bin/env tsx

/**
 * Script to generate static PDF resumes for English, French, and Arabic
 * Run with: npm run generate-resumes
 */

import fs from 'fs';
import path from 'path';
import { Packer } from 'docx';
import { generateResumeDoc } from '../src/lib/resume-generator';
import { convertDocxToPdf } from '../src/lib/convertDocxToPdf';

// Import your data
import { 
  getSkillsData, 
  getExperiencesData, 
  getProjectsData, 
  getEducationsData, 
  getPersonalData 
} from '../src/lib/resume-data';

// Simple translation function - expand as needed
const translations: Record<string, Record<string, string>> = {
  en: {
    'resume.summary': 'Summary',
    'skills.title': 'Skills',
    'experiences.title': 'Experience',
    'projects.title': 'Projects',
    'educations.title': 'Education',
  },
  fr: {
    'resume.summary': 'Résumé',
    'skills.title': 'Compétences',
    'experiences.title': 'Expérience',
    'projects.title': 'Projets',
    'educations.title': 'Formation',
  },
  ar: {
    'resume.summary': 'الملخص',
    'skills.title': 'المهارات',
    'experiences.title': 'الخبرات',
    'projects.title': 'المشاريع',
    'educations.title': 'التعليم',
  },
};

const t = (language: string) => (key: string) => {
  return translations[language]?.[key] || key;
};

async function generateResume(language: 'en' | 'fr' | 'ar') {
  console.log(`Generating ${language.toUpperCase()} resume...`);

  const translate = t(language);
  
  // Get data for the specified language
  const personal = getPersonalData(language);
  const skills = getSkillsData(language);
  const experiences = getExperiencesData(language);
  const projects = getProjectsData(language);
  const educations = getEducationsData(language);

  // Create DOCX document
  const doc = generateResumeDoc(personal, skills, experiences, projects, educations, translate, language);

  // Generate DOCX buffer
  const docxBuffer = await Packer.toBuffer(doc);

  // Create temp directory if it doesn't exist
  const tempDir = path.join(process.cwd(), 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Save temporary DOCX file
  const tempDocxPath = path.join(tempDir, `resume.${language}.docx`);
  fs.writeFileSync(tempDocxPath, docxBuffer);

  // Convert to PDF
  console.log(`Converting ${language.toUpperCase()} DOCX to PDF...`);
  const pdfBuffer = await convertDocxToPdf(tempDocxPath);

  // Save PDF to public directory
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const pdfPath = path.join(publicDir, `resume.${language}.pdf`);
  fs.writeFileSync(pdfPath, pdfBuffer);

  // Clean up temp DOCX file
  fs.unlinkSync(tempDocxPath);

  console.log(`✅ ${language.toUpperCase()} resume generated: ${pdfPath}`);
}

async function main() {
  try {
    console.log('Starting resume generation...\n');

    // Generate all language versions
    await generateResume('en');
    await generateResume('fr');
    await generateResume('ar');

    console.log('\n✅ All resumes generated successfully!');
    console.log('Files created:');
    console.log('  - public/resume.en.pdf');
    console.log('  - public/resume.fr.pdf');
    console.log('  - public/resume.ar.pdf');
  } catch (error) {
    console.error('❌ Error generating resumes:', error);
    process.exit(1);
  }
}

main();