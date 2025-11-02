import { PortfolioData } from '@/types/portfolio';

export const PORTFOLIO_TEMPLATES = {
  developer: {
    fullName: "Alex Johnson",
    headline: "Full Stack Developer | React & Node.js Specialist",
    bio: "Passionate about building scalable web applications and solving complex problems",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    about: "I'm a full-stack developer with 5+ years of experience building web applications. I specialize in React, Node.js, and cloud technologies. I love creating beautiful, functional interfaces and robust backend systems.",
    projects: [
      {
        id: "1",
        title: "E-Commerce Platform",
        description: "Full-stack MERN application with Stripe integration, real-time inventory, and admin dashboard",
        technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
        featured: true,
        liveUrl: "https://example-ecommerce.com",
        githubUrl: "https://github.com/example/ecommerce"
      },
      {
        id: "2",
        title: "AI Chat Application",
        description: "Real-time messaging platform with ML-powered sentiment analysis",
        technologies: ["React", "Firebase", "TensorFlow", "Socket.io", "Tailwind"],
        featured: true,
        liveUrl: "https://example-chat.com",
        githubUrl: "https://github.com/example/chat"
      }
    ],
    skills: [
      { category: "Frontend", skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Redux"] },
      { category: "Backend", skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "GraphQL"] },
      { category: "DevOps & Tools", skills: ["Docker", "AWS", "CI/CD", "Git", "Linux"] }
    ],
    experience: [
      {
        id: "1",
        title: "Senior Full Stack Developer",
        company: "Tech Innovations Inc",
        startDate: "Jan 2023",
        endDate: "Present",
        isCurrently: true,
        description: "Leading development of microservices architecture. Mentoring 3 junior developers.",
        technologies: ["React", "Node.js", "AWS", "Docker"]
      }
    ],
    education: [
      {
        id: "1",
        school: "State University",
        degree: "Bachelor of Science",
        field: "Computer Science",
        graduationDate: "2019",
        details: "GPA: 3.8/4.0. Focus on software engineering and distributed systems."
      }
    ],
    socialLinks: [
      { platform: "github", url: "https://github.com" },
      { platform: "linkedin", url: "https://linkedin.com/in/example" },
      { platform: "twitter", url: "https://twitter.com/example" }
    ],
    theme: "modern",
    accentColor: "#6366f1"
  } as PortfolioData,

  designer: {
    fullName: "Sarah Williams",
    headline: "Product Designer | UI/UX Specialist",
    bio: "Designing beautiful, user-centered digital experiences",
    email: "sarah@example.com",
    phone: "+1 (555) 987-6543",
    location: "New York, NY",
    about: "I'm a product designer with 6+ years of experience creating beautiful and intuitive user interfaces. I specialize in user research, wireframing, prototyping, and design systems.",
    projects: [
      {
        id: "1",
        title: "Fintech App Redesign",
        description: "Complete redesign of a financial app increasing user engagement by 40%",
        technologies: ["Figma", "Prototyping", "User Research", "Design System"],
        featured: true,
        liveUrl: "https://example-fintech.com",
        githubUrl: "https://dribbble.com/example"
      },
      {
        id: "2",
        title: "E-Learning Platform UI",
        description: "Designed comprehensive design system for educational platform",
        technologies: ["Figma", "Design System", "Accessibility", "Animation"],
        featured: true,
        liveUrl: "https://example-learning.com",
        githubUrl: "https://dribbble.com/example"
      }
    ],
    skills: [
      { category: "Design Tools", skills: ["Figma", "Adobe XD", "Sketch", "Protopie"] },
      { category: "Design Skills", skills: ["UI Design", "UX Research", "Wireframing", "Prototyping", "Design Systems"] },
      { category: "Other", skills: ["Web Design", "Mobile Design", "Animation", "Accessibility"] }
    ],
    experience: [
      {
        id: "1",
        title: "Senior Product Designer",
        company: "Design Studio Pro",
        startDate: "Jun 2021",
        endDate: "Present",
        isCurrently: true,
        description: "Leading design for 5+ products. Building design systems and design processes.",
        technologies: ["Figma", "Protopie", "User Research"]
      }
    ],
    education: [
      {
        id: "1",
        school: "Design Institute",
        degree: "Master of Arts",
        field: "Interaction Design",
        graduationDate: "2018",
        details: "Focused on human-centered design and user research methodologies."
      }
    ],
    socialLinks: [
      { platform: "dribbble", url: "https://dribbble.com" },
      { platform: "behance", url: "https://behance.net" },
      { platform: "linkedin", url: "https://linkedin.com/in/example" }
    ],
    theme: "creative",
    accentColor: "#ec4899"
  } as PortfolioData,

  entrepreneur: {
    fullName: "Michael Chen",
    headline: "Entrepreneur | Startup Founder",
    bio: "Building products that create value and impact",
    email: "michael@example.com",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX",
    about: "I'm an entrepreneur with 8+ years of experience building and scaling startups. I'm passionate about innovation, product development, and creating high-performing teams.",
    projects: [
      {
        id: "1",
        title: "SaaS Platform Launch",
        description: "Founded and grew a SaaS company to $2M ARR in 18 months",
        technologies: ["Product Strategy", "Growth", "Leadership", "B2B SaaS"],
        featured: true,
        liveUrl: "https://example-saas.com",
        githubUrl: "https://example-saas.com"
      }
    ],
    skills: [
      { category: "Business", skills: ["Strategy", "Product Management", "Growth", "Fundraising"] },
      { category: "Leadership", skills: ["Team Building", "Scaling", "Mentoring", "Culture"] },
      { category: "Technical", skills: ["Tech Stack", "APIs", "Databases", "Deployment"] }
    ],
    experience: [
      {
        id: "1",
        title: "Founder & CEO",
        company: "TechStart Ventures",
        startDate: "Jan 2020",
        endDate: "Present",
        isCurrently: true,
        description: "Building and scaling a B2B SaaS platform in the fintech space.",
        technologies: ["Product Management", "Growth Hacking", "Sales"]
      }
    ],
    education: [
      {
        id: "1",
        school: "Business University",
        degree: "MBA",
        field: "Entrepreneurship",
        graduationDate: "2016",
        details: "Focus on startup strategy and venture capital"
      }
    ],
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/example" },
      { platform: "twitter", url: "https://twitter.com/example" },
      { platform: "website", url: "https://example.com" }
    ],
    theme: "professional",
    accentColor: "#0891b2"
  } as PortfolioData,

  photographer: {
    fullName: "Emma Roberts",
    headline: "Professional Photographer | Visual Storyteller",
    bio: "Capturing moments, creating memories",
    email: "emma@example.com",
    phone: "+1 (555) 234-5678",
    location: "Los Angeles, CA",
    about: "I'm a professional photographer specializing in portrait, lifestyle, and commercial photography. With 10+ years of experience, I bring creativity and technical excellence to every project.",
    projects: [
      {
        id: "1",
        title: "Brand Photography Campaign",
        description: "Complete brand photography shoot for luxury lifestyle brand",
        technologies: ["Canon R5", "Lightroom", "Capture One"],
        featured: true,
        imageUrl: "https://example-photo-1.jpg",
        liveUrl: "https://example-portfolio.com/campaign"
      },
      {
        id: "2",
        title: "Wedding Series",
        description: "Curated collection of wedding photography across stunning venues",
        technologies: ["Canon R5", "Sony A7R", "Editing"],
        featured: true,
        imageUrl: "https://example-photo-2.jpg",
        liveUrl: "https://example-portfolio.com/weddings"
      }
    ],
    skills: [
      { category: "Photography", skills: ["Portrait", "Lifestyle", "Commercial", "Wedding", "Events"] },
      { category: "Equipment", skills: ["Canon EOS", "Sony Alpha", "Lighting", "Lenses"] },
      { category: "Post-Production", skills: ["Lightroom", "Capture One", "Retouching", "Color Grading"] }
    ],
    experience: [
      {
        id: "1",
        title: "Professional Photographer",
        company: "Roberts Photography Studio",
        startDate: "Jan 2014",
        endDate: "Present",
        isCurrently: true,
        description: "Running independent photography business with 500+ completed projects.",
        technologies: ["Portrait", "Branding", "Editing"]
      }
    ],
    education: [
      {
        id: "1",
        school: "Photography Institute",
        degree: "Diploma",
        field: "Professional Photography",
        graduationDate: "2013",
        details: "Specialized in digital photography and post-processing"
      }
    ],
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/example" },
      { platform: "website", url: "https://example-photos.com" },
      { platform: "behance", url: "https://behance.net/example" }
    ],
    theme: "vibrant",
    accentColor: "#d946ef"
  } as PortfolioData
};

export const getTemplateByType = (type: keyof typeof PORTFOLIO_TEMPLATES): PortfolioData => {
  return PORTFOLIO_TEMPLATES[type];
};
