import { PortfolioData } from '@/types/portfolio';
import { generateModernTechTemplate } from './portfolioTemplate1ModernTech';
import { generateCreativeTemplate } from './portfolioTemplate2Creative';
import { generateCorporateTemplate } from './portfolioTemplate3Corporate';
import { generateFreelanceTemplate } from './portfolioTemplate4Freelance';
import { generateAgencyTemplate } from './portfolioTemplate5Agency';

/**
 * Enhanced Portfolio Templates with Animations
 * Provides 5 unique professional portfolio themes with distinct visual styles
 */

export interface PortfolioTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  colorScheme: string;
  bestFor: string[];
  features: string[];
  generateHTML: (data: PortfolioData) => string;
}

export const ENHANCED_PORTFOLIO_TEMPLATES: PortfolioTemplate[] = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Sleek, contemporary design perfect for tech professionals and startups',
    category: 'Technology',
    colorScheme: 'Indigo & Purple',
    bestFor: ['Software Engineers', 'Tech Founders', 'Product Managers', 'Developers'],
    features: [
      'Animated gradient hero',
      'Smooth scroll transitions',
      'Minimalist layout',
      'Timeline experience view',
      'Interactive project showcase',
      'Floating animations'
    ],
    generateHTML: generateModernTechTemplate,
  },
  {
    id: 'creative',
    name: 'Creative Professional',
    description: 'Artistic and modern layout for designers, artists, and creative professionals',
    category: 'Creative',
    colorScheme: 'Pink & Amber',
    bestFor: ['Designers', 'Artists', 'Photographers', 'Creative Directors'],
    features: [
      'Asymmetric hero layout',
      'Gallery-style projects',
      'Smooth transitions',
      'Artistic gradient background',
      'Overlay hover effects',
      'Artistic typography'
    ],
    generateHTML: generateCreativeTemplate,
  },
  {
    id: 'corporate',
    name: 'Corporate Executive',
    description: 'Professional and sophisticated design for executives and business leaders',
    category: 'Business',
    colorScheme: 'Navy & Cyan',
    bestFor: ['Executives', 'Business Leaders', 'Consultants', 'C-Suite'],
    features: [
      'Formal design language',
      'Gradient hero section',
      'Skill progress bars',
      'Experience timeline',
      'Professional typography',
      'Business-focused layout',
      'Project table showcase'
    ],
    generateHTML: generateCorporateTemplate,
  },
  {
    id: 'freelance',
    name: 'Freelance Creator',
    description: 'Dynamic and interactive portfolio for freelancers and independent creators',
    category: 'Freelance',
    colorScheme: 'Purple & Blue',
    bestFor: ['Freelancers', 'Content Creators', 'Influencers', 'Independent Professionals'],
    features: [
      'Dark mode design',
      'Interactive project cards',
      'Animated background blobs',
      'Hover reveal effects',
      'Modern gradient overlays',
      'Dynamic animations',
      'Playful elements'
    ],
    generateHTML: generateFreelanceTemplate,
  },
  {
    id: 'agency',
    name: 'Agency Portfolio',
    description: 'Advanced case study showcase perfect for agencies and studios',
    category: 'Agency',
    colorScheme: 'Cyan & Blue',
    bestFor: ['Agencies', 'Studios', 'Teams', 'Design Studios'],
    features: [
      'Case study layouts',
      'Alternating content grid',
      'Advanced animations',
      'Blob animations',
      'Grid patterns',
      'Professional grid system',
      'Team-focused design'
    ],
    generateHTML: generateAgencyTemplate,
  },
];

/**
 * Get a specific template by ID
 */
export const getEnhancedTemplateById = (templateId: string): PortfolioTemplate | undefined => {
  return ENHANCED_PORTFOLIO_TEMPLATES.find(t => t.id === templateId);
};

/**
 * Generate HTML using a specific template
 */
export const generateEnhancedPortfolioHTML = (
  data: PortfolioData,
  templateId: string
): string | null => {
  const template = getEnhancedTemplateById(templateId);
  if (!template) return null;
  
  return template.generateHTML(data);
};

/**
 * Get all template metadata (without the expensive generation functions)
 */
export const getTemplateMetadata = () => {
  return ENHANCED_PORTFOLIO_TEMPLATES.map(t => ({
    id: t.id,
    name: t.name,
    description: t.description,
    category: t.category,
    colorScheme: t.colorScheme,
    bestFor: t.bestFor,
    features: t.features,
  }));
};

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category: string): PortfolioTemplate[] => {
  return ENHANCED_PORTFOLIO_TEMPLATES.filter(t => t.category === category);
};

/**
 * Get unique categories
 */
export const getTemplateCategories = (): string[] => {
  return [...new Set(ENHANCED_PORTFOLIO_TEMPLATES.map(t => t.category))];
};

// Re-export template generators for use in portfolioService
export {
  generateModernTechTemplate,
  generateCreativeTemplate,
  generateCorporateTemplate,
  generateFreelanceTemplate,
  generateAgencyTemplate
};

export default ENHANCED_PORTFOLIO_TEMPLATES;
