/**
 * PREMIUM PORTFOLIO TEMPLATES - SHOWCASE & DEMO
 * This file provides sample data and examples for all premium templates
 */

import { PortfolioData } from '@/types/portfolio';

// Sample Portfolio Data (use this for testing)
export const SAMPLE_PORTFOLIO_DATA: PortfolioData = {
  // Personal Info
  fullName: 'Alex Johnson',
  headline: 'Full Stack Developer & UI/UX Designer',
  bio: 'Passionate developer with 5+ years of experience building scalable web applications. Specialized in React, TypeScript, and modern web technologies.',
  email: 'alex@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',

  // Social Links
  socialLinks: [
    {
      platform: 'github',
      url: 'https://github.com',
      icon: 'fab fa-github'
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com',
      icon: 'fab fa-linkedin'
    },
    {
      platform: 'twitter',
      url: 'https://twitter.com',
      icon: 'fab fa-twitter'
    }
  ],

  // About
  about: 'I\'m a full-stack developer who loves creating beautiful, functional web applications. With expertise in modern JavaScript frameworks and cloud technologies, I help startups and enterprises build scalable digital solutions. When I\'m not coding, you can find me contributing to open-source projects or sharing knowledge with the developer community.',

  // Skills
  skills: [
    'React',
    'TypeScript',
    'Node.js',
    'AWS',
    'GraphQL',
    'PostgreSQL'
  ],

  // Projects
  projects: [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'Built a full-stack e-commerce platform with real-time inventory management and payment integration. Achieved 99.9% uptime and handles 100k+ daily users.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=400&fit=crop',
      liveUrl: 'https://example-ecommerce.com',
      githubUrl: 'https://github.com',
      featured: true
    },
    {
      id: '2',
      title: 'Project Management Dashboard',
      description: 'Real-time collaborative project management tool with WebSocket integration. Features include task tracking, team collaboration, and automated reporting.',
      technologies: ['React', 'TypeScript', 'WebSockets', 'MongoDB'],
      imageUrl: 'https://images.unsplash.com/photo-1551683969-acb94f097b71?w=500&h=400&fit=crop',
      liveUrl: 'https://example-dashboard.com',
      githubUrl: 'https://github.com',
      featured: true
    },
    {
      id: '3',
      title: 'AI-Powered Analytics Platform',
      description: 'Machine learning-powered analytics platform that provides predictive insights and real-time data visualization. Integrated with popular data sources.',
      technologies: ['Python', 'React', 'TensorFlow', 'AWS'],
      imageUrl: 'https://images.unsplash.com/photo-1543269865-cbdf26cea6cb?w=500&h=400&fit=crop',
      liveUrl: 'https://example-analytics.com',
      githubUrl: 'https://github.com',
      featured: true
    }
  ],

  // Experience
  experience: [
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      company: 'Tech Corp Inc',
      startDate: 'Jan 2021',
      endDate: 'Present',
      isCurrently: true,
      description: 'Lead development of multiple projects, mentored junior developers, and architected scalable microservices. Improved application performance by 40%.',
      technologies: ['React', 'Node.js', 'AWS', 'Docker']
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'StartUp Labs',
      startDate: 'Jun 2019',
      endDate: 'Dec 2020',
      isCurrently: false,
      description: 'Developed and maintained multiple web applications serving 50k+ users. Implemented CI/CD pipelines and improved code quality.',
      technologies: ['React', 'Express', 'MongoDB', 'GitHub Actions']
    },
    {
      id: '3',
      title: 'Junior Web Developer',
      company: 'Digital Solutions',
      startDate: 'Jan 2019',
      endDate: 'May 2019',
      isCurrently: false,
      description: 'Started my career building responsive websites and learning modern web development practices. Completed projects on time and within budget.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'jQuery']
    }
  ],

  // Education
  education: [
    {
      id: '1',
      school: 'State University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      graduationDate: '2018',
      details: 'GPA: 3.8/4.0, Dean\'s List, Software Engineering Focus'
    }
  ],

  // Template Selection
  templateId: 'premium-luxury-minimal',
  accentColor: '#00ff88'
};

/**
 * Template Showcase Examples
 */
export const TEMPLATE_SHOWCASE = {
  templates: [
    {
      id: 'premium-luxury-minimal',
      name: 'Luxury Minimal',
      description: 'Sleek dark theme with neon green accents and smooth animations',
      bestFor: 'Tech Professionals',
      accentColor: '#00ff88',
      preview: {
        backgroundColor: 'from-slate-950 to-slate-900',
        gradient: 'from-green-500 to-emerald-500'
      }
    },
    {
      id: 'premium-glassmorphism',
      name: 'Glassmorphism Chic',
      description: 'Modern glassmorphism with blur effects and magenta accents',
      bestFor: 'Designers',
      accentColor: '#ff00ff',
      preview: {
        backgroundColor: 'from-slate-900 to-slate-800',
        gradient: 'from-pink-500 to-purple-500'
      }
    },
    {
      id: 'premium-neon-cyberpunk',
      name: 'Neon Cyberpunk',
      description: 'Bold cyberpunk aesthetic with neon glow and glitch effects',
      bestFor: 'Tech Innovators',
      accentColor: '#00ffff',
      preview: {
        backgroundColor: 'from-slate-950 to-slate-900',
        gradient: 'from-cyan-500 to-blue-500'
      }
    },
    {
      id: 'premium-elegant-gradient',
      name: 'Elegant Gradient',
      description: 'Sophisticated gradient-based design for professionals',
      bestFor: 'Executives',
      accentColor: '#6366f1',
      preview: {
        backgroundColor: 'from-slate-900 to-slate-800',
        gradient: 'from-indigo-500 to-purple-500'
      }
    },
    {
      id: 'premium-neumorphic-pro',
      name: 'Neumorphic Pro',
      description: 'Soft neumorphism with depth and shadow effects',
      bestFor: 'Minimalists',
      accentColor: '#10b981',
      preview: {
        backgroundColor: 'from-slate-100 to-slate-200',
        gradient: 'from-emerald-500 to-teal-500'
      }
    }
  ]
};

/**
 * Usage Examples
 */
export const USAGE_EXAMPLES = {
  // Example 1: Generate with Luxury Minimal
  luxuryMinimal: {
    code: `
import { PortfolioHTMLGenerator } from '@/services/portfolioService';
import { SAMPLE_PORTFOLIO_DATA } from '@/services/premiumPortfolioShowcase';

const html = PortfolioHTMLGenerator.generateHTML({
  ...SAMPLE_PORTFOLIO_DATA,
  templateId: 'premium-luxury-minimal'
});
    `,
    description: 'Generate a portfolio using the Luxury Minimal template'
  },

  // Example 2: Custom Accent Color
  customColor: {
    code: `
const html = PortfolioHTMLGenerator.generateHTML({
  ...SAMPLE_PORTFOLIO_DATA,
  templateId: 'premium-glassmorphism',
  accentColor: '#ff6b6b' // Custom red accent
});
    `,
    description: 'Generate with custom accent color'
  },

  // Example 3: Use in Component
  componentUsage: {
    code: `
import { PremiumTemplateSelector } from '@/components/PremiumTemplateSelector';
import { PortfolioHTMLGenerator } from '@/services/portfolioService';

export const PortfolioBuilder = () => {
  const [template, setTemplate] = useState('premium-luxury-minimal');
  
  const handleGenerate = () => {
    const html = PortfolioHTMLGenerator.generateHTML({
      ...portfolioData,
      templateId: template
    });
    displayPreview(html);
  };

  return (
    <>
      <PremiumTemplateSelector 
        selectedId={template}
        onSelect={setTemplate}
      />
      <button onClick={handleGenerate}>Generate Portfolio</button>
    </>
  );
};
    `,
    description: 'Use PremiumTemplateSelector component'
  }
};

/**
 * Testing / Demo Component
 */
export const DEMO_CONFIGURATIONS = [
  {
    name: 'Tech Developer Profile',
    templateId: 'premium-luxury-minimal',
    data: {
      ...SAMPLE_PORTFOLIO_DATA,
      headline: 'Full Stack Developer & Open Source Enthusiast',
      accentColor: '#00ff88'
    }
  },
  {
    name: 'UX Designer Profile',
    templateId: 'premium-glassmorphism',
    data: {
      ...SAMPLE_PORTFOLIO_DATA,
      headline: 'UX/UI Designer & Creative Thinker',
      accentColor: '#ff00ff'
    }
  },
  {
    name: 'Tech Innovator Profile',
    templateId: 'premium-neon-cyberpunk',
    data: {
      ...SAMPLE_PORTFOLIO_DATA,
      headline: 'AI/ML Engineer & Tech Innovator',
      accentColor: '#00ffff'
    }
  },
  {
    name: 'Executive Profile',
    templateId: 'premium-elegant-gradient',
    data: {
      ...SAMPLE_PORTFOLIO_DATA,
      headline: 'VP of Engineering & Strategic Leader',
      accentColor: '#6366f1'
    }
  },
  {
    name: 'Product Designer Profile',
    templateId: 'premium-neumorphic-pro',
    data: {
      ...SAMPLE_PORTFOLIO_DATA,
      headline: 'Product Designer & Minimalist',
      accentColor: '#10b981'
    }
  }
];

export default {
  SAMPLE_PORTFOLIO_DATA,
  TEMPLATE_SHOWCASE,
  USAGE_EXAMPLES,
  DEMO_CONFIGURATIONS
};
