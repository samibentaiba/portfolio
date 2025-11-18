


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



const dataMap = {

  en: {

    personal: personalDataEn,

    skills: skillsDataEn,

    experiences: experiencesDataEn,

    projects: projectsDataEn,

    educations: educationsDataEn,

  },

  fr: {

    personal: personalDataFr,

    skills: skillsDataFr,

    experiences: experiencesDataFr,

    projects: projectsDataFr,

    educations: educationsDataFr,

  },

  ar: {

    personal: personalDataAr,

    skills: skillsDataAr,

    experiences: experiencesDataAr,

    projects: projectsDataAr,

    educations: educationsDataAr,

  },

};



const getDataForLanguage = <T>(dataType: keyof typeof dataMap['en'], language: string = 'en'): T => {

  const lang = language in dataMap ? language as keyof typeof dataMap : 'en';

  return dataMap[lang][dataType] as T;

};



export function getPersonalData(language: string = 'en'): Personal | null {

  return getDataForLanguage<Personal | null>('personal', language);

}



export function getSkillsData(language: string = 'en'): SkillCategory[] {

  return getDataForLanguage<SkillCategory[]>('skills', language);

}



export function getExperiencesData(language: string = 'en'): Experience[] {

  return getDataForLanguage<Experience[]>('experiences', language);

}



export function getProjectsData(language: string = 'en'): Project[] {

  return getDataForLanguage<Project[]>('projects', language);

}



export function getEducationsData(language: string = 'en'): Education[] {

  return getDataForLanguage<Education[]>('educations', language);

}
