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
  description: string;
  summary: string;
}

export interface FunFact {
  category: string;
  text: string;
}

// ============================================
// 3. UPDATE: src/types/index.ts (Add these types)
// ============================================
export interface CareerMilestone {
  id: string;
  title: string;
  description: string;
  size: 'small' | 'medium' | 'large';
  type: 'achievement' | 'job' | 'project' | 'skill';
  date?: string;
}

export interface CareerLink {
  targetId: string;
  type?: 'merge';
}

export interface CareerPoint {
  id: string;
  x: number;
  branch: string;
  milestone: CareerMilestone;
  linkedTo?: CareerLink[];
}

export interface CareerBranch {
  id: string;
  name: string;
  color: string;
  points: CareerPoint[];
}

export interface CareerTimelineData {
  branches: CareerBranch[];
}
