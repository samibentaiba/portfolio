#!/usr/bin/env tsx

/**
 * Script to generate static PDF resumes for both French and English
 * Run with: npm run generate-resumes
 */

import fs from 'fs';
import path from 'path';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import {
  createSummarySection,
  createSkillsSection,
  createExperienceSection,
  createProjectsSection,
  createEducationSection,
} from '../src/lib/docx-generator';
import { convertDocxToPdf } from '../src/lib/convertDocxToPdf';
import type { SkillCategory } from '../src/types';

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
    'resume.summary': 'ملخص',
    'skills.title': 'مهارات',
    'experiences.title': 'خبرة',
    'projects.title': 'مشاريع',
    'educations.title': 'تعليم',
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

  // Transform skills data with proper typing
  const skillsData = skills.map((group: SkillCategory) => ({
    category: group.category,
    items: group.items.map((item) => ({
      name: item.name,
      experience: item.experience,
      description: item.description,
    })),
  }));

  const isRtl = language === 'ar';

  // Create DOCX document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            children: [
              new TextRun({
                text: personal?.name || '',
                bold: true,
                size: 32,
              }),
            ],
            spacing: { after: 200 },
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `${personal?.email ?? ''} · ${personal?.phone ?? ''}`,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `${personal?.website ?? ''}`,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `${personal?.github ?? ''}`,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `${personal?.linkedin ?? ''}`,
              }),
            ],
            spacing: { after: 400 },
          }),
          ...createSummarySection(personal, translate, isRtl),
          ...createSkillsSection(skillsData, translate, isRtl),
          ...createExperienceSection(experiences, translate, isRtl),
          ...createProjectsSection(projects, translate, isRtl),
          ...createEducationSection(educations, translate, isRtl),
        ],
      },
    ],
  });

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