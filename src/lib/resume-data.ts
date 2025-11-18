/**
 * Helper file to export resume data for the generation script
 * This centralizes data access for both the app and the generation script
 */

import type { Education, Experience, Personal, Project, SkillCategory } from '@/types';

// Import English data
import personalDataEn from '@/data/personal.json';
import skillsDataEn from '@/data/skills.json';
import experiencesDataEn from '@/data/experiences.json';
import projectsDataEn from '@/data/projects.json';
import educationsDataEn from '@/data/educations.json';

// Import French translations
import personalDataFr from '@/data/translations/personal-fr.json';
import skillsDataFr from '@/data/translations/skills-fr.json';
import experiencesDataFr from '@/data/translations/experiences-fr.json';
import projectsDataFr from '@/data/translations/projects-fr.json';
import educationsDataFr from '@/data/translations/educations-fr.json';

// Import Arabic translations
import personalDataAr from '@/data/translations/personal-ar.json';
import skillsDataAr from '@/data/translations/skills-ar.json';
import experiencesDataAr from '@/data/translations/experiences-ar.json';
import projectsDataAr from '@/data/translations/projects-ar.json';
import educationsDataAr from '@/data/translations/educations-ar.json';

export function getPersonalData(language: string = 'en'): Personal | null {
  switch (language) {
    case 'fr':
      return personalDataFr as Personal;
    case 'ar':
      return personalDataAr as Personal;
    default:
      return personalDataEn as Personal;
  }
}

export function getSkillsData(language: string = 'en'): SkillCategory[] {
  switch (language) {
    case 'fr':
      return skillsDataFr as SkillCategory[];
    case 'ar':
      return skillsDataAr as SkillCategory[];
    default:
      return skillsDataEn as SkillCategory[];
  }
}

export function getExperiencesData(language: string = 'en'): Experience[] {
  switch (language) {
    case 'fr':
      return experiencesDataFr as Experience[];
    case 'ar':
      return experiencesDataAr as Experience[];
    default:
      return experiencesDataEn as Experience[];
  }
}

export function getProjectsData(language: string = 'en'): Project[] {
  switch (language) {
    case 'fr':
      return projectsDataFr as Project[];
    case 'ar':
      return projectsDataAr as Project[];
    default:
      return projectsDataEn as Project[];
  }
}

export function getEducationsData(language: string = 'en'): Education[] {
  switch (language) {
    case 'fr':
      return educationsDataFr as Education[];
    case 'ar':
      return educationsDataAr as Education[];
    default:
      return educationsDataEn as Education[];
  }
}