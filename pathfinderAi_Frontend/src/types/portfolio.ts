// Portfolio Types and Interfaces

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'behance' | 'dribbble' | 'instagram' | 'website';
  url: string;
  icon?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrently: boolean;
  description: string;
  technologies?: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
  details?: string;
}

export interface PortfolioData {
  // Personal Info
  fullName: string;
  headline: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  profileImage?: string;

  // Social Links
  socialLinks: SocialLink[];

  // Content Sections
  about: string;
  projects: ProjectItem[];
  skills: SkillCategory[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications?: string[];

  // Settings
  templateId?: 'modern-tech' | 'creative' | 'corporate' | 'freelance' | 'agency';
  theme: 'modern' | 'minimal' | 'creative' | 'professional' | 'dark' | 'vibrant' | 'retro' | 'glassmorphism';
  accentColor?: string;
  showCertifications?: boolean;
  showEducation?: boolean;
}

export interface PortfolioTemplate {
  id: string;
  name: string;
  description: string;
  theme: PortfolioData['theme'];
  preview: string;
  features: string[];
}
