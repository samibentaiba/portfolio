/**
 * Helper file to export resume data for the generation script
 * This centralizes data access for both the app and the generation script
 */

import type { Education, Experience, Personal, Project, SkillCategory } from '@/types';

// Import the actual data from your data directory
import personalDataEn from '@/data/personal.json';
import personalDataFr from '@/data/translations/personal-fr.json';
import skillsDataEn from '@/data/skills.json';
import skillsDataFr from '@/data/translations/skills-fr.json';
import experiencesDataEn from '@/data/experiences.json';
import experiencesDataFr from '@/data/translations/experiences-fr.json';
import projectsDataEn from '@/data/projects.json';
import projectsDataFr from '@/data/translations/projects-fr.json';
import educationsDataEn from '@/data/educations.json';
import educationsDataFr from '@/data/translations/educations-fr.json';

export function getPersonalData(language: string = 'en'): Personal | null {
  return language === 'fr' ? (personalDataFr as Personal) : (personalDataEn as Personal);
}

export function getSkillsData(language: string = 'en'): SkillCategory[] {
  return language === 'fr' ? (skillsDataFr as SkillCategory[]) : (skillsDataEn as SkillCategory[]);
}

export function getExperiencesData(language: string = 'en'): Experience[] {
  return language === 'fr' ? (experiencesDataFr as Experience[]) : (experiencesDataEn as Experience[]);
}

export function getProjectsData(language: string = 'en'): Project[] {
  return language === 'fr' ? (projectsDataFr as Project[]) : (projectsDataEn as Project[]);
}

export function getEducationsData(language: string = 'en'): Education[] {
  return language === 'fr' ? (educationsDataFr as Education[]) : (educationsDataEn as Education[]);
}