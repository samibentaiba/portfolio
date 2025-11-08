export interface Skill {
  name: string;
  slug: string;
  experience: string;
  description: string;
}
export interface SkillCategory {
  category: string;
  slug: string;
  description: string;
  longDescription: string;
  items: Skill[];
}
export interface Experience {
  role: string;
  company: string;
  slug: string;
  type: string;
  period: string;
  location: string;
  summary: string;
  description: string;
  skills: string[];
  projects: string[];
}

// types.ts

// ... other interfaces (Skill, Experience, etc.)

export interface Project {
  slug: string; // Required for navigation
  fetchUrl?: string; // The URL to fetch metadata from
  
  // These are now optional, they can be fetched or manually set
  title: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  
  // These are optional and can be added manually
  technologies: string[]; // Keep this, user can add manually
  timeline?: string;
  liveUrl?: string;
  githubUrl?: string;
  personalExperience?: string;
  collaborators?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  startYear: number;
  endYear: number;
}
export interface Personal {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  job: string;
  summary: string;
}

export interface FunFact {
  category: string;
  text: string;
}
