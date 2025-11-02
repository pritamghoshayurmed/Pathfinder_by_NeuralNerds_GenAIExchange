import { PortfolioData } from '@/types/portfolio';
import { 
  generateModernTechTemplate,
  generateCreativeTemplate,
  generateCorporateTemplate,
  generateFreelanceTemplate,
  generateAgencyTemplate
} from './enhancedPortfolioTemplates';
import {
  generatePremiumLuxuryMinimal,
  generatePremiumGlassmorphism,
  generatePremiumNeonCyberpunk,
  generatePremiumElegantGradient,
  generatePremiumNeumorphicPro,
  PREMIUM_TEMPLATE_CATALOG
} from './premiumPortfolioIndex';

export class PortfolioHTMLGenerator {
  static generateHTML(data: PortfolioData): string {
    // Route to the appropriate template based on templateId
    if (data.templateId) {
      return this.generateTemplateHTML(data, data.templateId);
    }
    
    // Default to premium luxury minimal template
    return generatePremiumLuxuryMinimal(data);
  }

  private static generateTemplateHTML(data: PortfolioData, templateId: string): string {
    try {
      // Premium Templates (New)
      switch (templateId) {
        case 'premium-luxury-minimal':
          return generatePremiumLuxuryMinimal(data);
        case 'premium-glassmorphism':
          return generatePremiumGlassmorphism(data);
        case 'premium-neon-cyberpunk':
          return generatePremiumNeonCyberpunk(data);
        case 'premium-elegant-gradient':
          return generatePremiumElegantGradient(data);
        case 'premium-neumorphic-pro':
          return generatePremiumNeumorphicPro(data);
        // Legacy Templates (Old)
        case 'modern-tech':
          return generateModernTechTemplate(data);
        case 'creative':
          return generateCreativeTemplate(data);
        case 'corporate':
          return generateCorporateTemplate(data);
        case 'freelance':
          return generateFreelanceTemplate(data);
        case 'agency':
          return generateAgencyTemplate(data);
        default:
          // Fallback to premium luxury minimal
          return generatePremiumLuxuryMinimal(data);
      }
    } catch (error) {
      console.error('Error generating template:', error);
      return generatePremiumLuxuryMinimal(data);
    }
  }

  private static generateDefaultTemplate(data: PortfolioData): string {
    const themeStyles = this.getThemeStyles(data.theme, data.accentColor);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Portfolio</title>
    <style>
        ${themeStyles}
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">${data.fullName}</div>
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#skills">Skills</a></li>
                ${data.experience.length > 0 ? '<li><a href="#experience">Experience</a></li>' : ''}
                ${data.education.length > 0 ? '<li><a href="#education">Education</a></li>' : ''}
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="hero-content">
            ${data.profileImage ? `<img src="${data.profileImage}" alt="Profile" class="profile-image">` : '<div class="profile-placeholder">👤</div>'}
            <h1>${data.fullName}</h1>
            <p class="headline">${data.headline}</p>
            <div class="social-links">
                ${data.socialLinks.map(link => `
                    <a href="${link.url}" class="social-link" title="${link.platform}" target="_blank" rel="noopener noreferrer">
                        ${this.getSocialIcon(link.platform)}
                    </a>
                `).join('')}
            </div>
            <a href="#projects" class="cta-button">View My Work</a>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="container">
            <h2>About Me</h2>
            <p>${data.about || data.bio}</p>
        </div>
    </section>

    <!-- Projects Section -->
    ${data.projects.length > 0 ? `
    <section id="projects" class="projects">
        <div class="container">
            <h2>Featured Projects</h2>
            <div class="projects-grid">
                ${data.projects.filter(p => p.featured).map(project => `
                    <div class="project-card">
                        ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" class="project-image">` : '<div class="project-image-placeholder">🎨</div>'}
                        <div class="project-content">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            <div class="tech-tags">
                                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                            <div class="project-links">
                                ${project.liveUrl ? `<a href="${project.liveUrl}" class="link-btn" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ''}
                                ${project.githubUrl ? `<a href="${project.githubUrl}" class="link-btn" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Skills Section -->
    ${data.skills.length > 0 ? `
    <section id="skills" class="skills">
        <div class="container">
            <h2>Skills & Expertise</h2>
            <div class="skills-grid">
                ${data.skills.map(skillGroup => `
                    <div class="skill-category">
                        <h3>${skillGroup.category}</h3>
                        <div class="skills-list">
                            ${skillGroup.skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Experience Section -->
    ${data.experience.length > 0 ? `
    <section id="experience" class="experience">
        <div class="container">
            <h2>Work Experience</h2>
            <div class="timeline">
                ${data.experience.map(exp => `
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h3>${exp.title}</h3>
                            <p class="company">${exp.company}</p>
                            <p class="date">${exp.startDate} - ${exp.isCurrently ? 'Present' : exp.endDate}</p>
                            <p>${exp.description}</p>
                            ${exp.technologies ? `
                                <div class="tech-tags">
                                    ${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Education Section -->
    ${data.education.length > 0 ? `
    <section id="education" class="education">
        <div class="container">
            <h2>Education</h2>
            <div class="education-list">
                ${data.education.map(edu => `
                    <div class="education-item">
                        <div class="education-icon">🎓</div>
                        <div class="education-content">
                            <h3>${edu.degree}</h3>
                            <p class="school">${edu.school}</p>
                            <p class="field">${edu.field}</p>
                            <p class="date">${edu.graduationDate}</p>
                            ${edu.details ? `<p class="details">${edu.details}</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <h2>Get In Touch</h2>
            <p>Feel free to reach out to me for any opportunities or collaborations!</p>
            <div class="contact-info">
                ${data.email ? `<p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>` : ''}
                ${data.phone ? `<p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ''}
                ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
            </div>
        </div>
    </section>

    <footer class="footer">
        <p>&copy; 2024 ${data.fullName}. All rights reserved.</p>
    </footer>

    <script>
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Navbar active state
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-menu a');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= sectionTop - 60) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    </script>
</body>
</html>`;
  }

  private static getThemeStyles(theme: string, accentColor?: string): string {
    const accent = accentColor || '#6366f1';
    
    const baseStyles = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Navbar */
        .navbar {
            position: sticky;
            top: 0;
            z-index: 1000;
            padding: 1rem 0;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .navbar .container {
            display: flex;        .nav-brand {
            font-size: 1.5rem;
            font-weight: bold;
            color: ${accent};
        }

        .nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }

        .nav-menu a {
            text-decoration: none;
            color: #666;
            transition: color 0.3s;
        }

        .nav-menu a:hover,
        .nav-menu a.active {
            color: ${accent};
        }

        /* Hero Section */
        .hero {
            padding: 100px 20px;
            text-align: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .hero-content {
            max-width: 800px;
        }

        .profile-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 5px solid ${accent};
            margin-bottom: 2rem;
            object-fit: cover;
        }

        .profile-placeholder {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 5px solid ${accent};
            margin: 0 auto 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            background: rgba(0, 0, 0, 0.05);
        }

        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 0.5rem;
            color: #1a1a1a;
        }

        .headline {
            font-size: 1.5rem;
            color: ${accent};
            margin-bottom: 2rem;
            font-weight: 500;
        }

        .social-links {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-bottom: 2rem;
        }

        .social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: ${accent};
            color: white;
            text-decoration: none;
            transition: all 0.3s;
            font-size: 1.5rem;
        }

        .social-link:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .cta-button {
            display: inline-block;
            padding: 15px 40px;
            background: ${accent};
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            transition: all 0.3s;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        /* Sections */
        section {
            padding: 80px 20px;
        }

        section h2 {
            font-size: 2.5rem;
            margin-bottom: 2rem;
            text-align: center;
            color: #1a1a1a;
            position: relative;
            padding-bottom: 1rem;
        }

        section h2::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 4px;
            background: ${accent};
            border-radius: 2px;
        }

        /* About Section */
        .about {
            background: #f9f9f9;
        }

        .about p {
            font-size: 1.1rem;
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
            color: #555;
        }

        /* Projects Section */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .project-card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .project-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
        }

        .project-image-placeholder {
            width: 100%;
            height: 250px;
            background: linear-gradient(135deg, ${accent}33, ${accent}11);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
        }

        .project-content {
            padding: 1.5rem;
        }

        .project-content h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: #1a1a1a;
        }

        .project-content p {
            color: #666;
            margin-bottom: 1rem;
        }

        .tech-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .tech-tag {
            display: inline-block;
            padding: 5px 12px;
            background: ${accent}22;
            color: ${accent};
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .project-links {
            display: flex;
            gap: 1rem;
        }

        .link-btn {
            flex: 1;
            padding: 10px 15px;
            background: ${accent};
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            transition: all 0.3s;
            font-weight: 500;
            font-size: 0.9rem;
        }

        .link-btn:hover {
            background: ${this.darkenColor(accent, 20)};
        }

        /* Skills Section */
        .skills {
            background: #f9f9f9;
        }

        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .skill-category {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .skill-category h3 {
            font-size: 1.3rem;
            margin-bottom: 1rem;
            color: ${accent};
        }

        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
        }

        .skill-item {
            display: inline-block;
            padding: 8px 16px;
            background: ${accent}22;
            color: ${accent};
            border-radius: 20px;
            font-weight: 500;
            font-size: 0.95rem;
        }

        /* Timeline */
        .timeline {
            position: relative;
            padding: 2rem 0;
        }

        .timeline::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: ${accent}33;
            transform: translateX(-50%);
        }

        .timeline-item {
            margin-bottom: 3rem;
            position: relative;
        }

        .timeline-item:nth-child(odd) .timeline-content {
            margin-left: 0;
            margin-right: 52%;
            text-align: right;
        }

        .timeline-item:nth-child(even) .timeline-content {
            margin-left: 52%;
            margin-right: 0;
            text-align: left;
        }

        .timeline-marker {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 15px;
            height: 15px;
            background: ${accent};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 0 4px ${accent}33;
        }

        .timeline-content h3 {
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
            color: #1a1a1a;
        }

        .timeline-content .company {
            color: ${accent};
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .timeline-content .date {
            color: #999;
            font-size: 0.9rem;
            margin-bottom: 0.8rem;
        }

        .timeline-content p {
            color: #555;
            line-height: 1.6;
        }

        /* Education */
        .education {
            background: #f9f9f9;
        }

        .education-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .education-item {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            display: flex;
            gap: 1.5rem;
        }

        .education-icon {
            font-size: 2.5rem;
            flex-shrink: 0;
        }

        .education-content h3 {
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
            color: #1a1a1a;
        }

        .education-content .school {
            color: ${accent};
            font-weight: 600;
            margin-bottom: 0.3rem;
        }

        .education-content .field {
            color: #666;
            margin-bottom: 0.3rem;
            font-size: 0.95rem;
        }

        .education-content .date {
            color: #999;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }

        .education-content .details {
            color: #555;
            margin-top: 0.5rem;
            font-size: 0.95rem;
        }

        /* Contact Section */
        .contact {
            background: linear-gradient(135deg, ${accent}22, ${accent}11);
            text-align: center;
        }

        .contact p {
            font-size: 1.1rem;
            color: #555;
            margin-bottom: 2rem;
        }

        .contact-info {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-width: 500px;
            margin: 0 auto;
        }

        .contact-info p {
            text-align: left;
            font-size: 1rem;
            margin-bottom: 0.5rem;
        }

        .contact-info a {
            color: ${accent};
            text-decoration: none;
            font-weight: 600;
        }

        .contact-info a:hover {
            text-decoration: underline;
        }

        /* Footer */
        .footer {
            background: #333;
            color: #999;
            text-align: center;
            padding: 2rem;
        }

        .footer p {
            margin: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2rem;
            }

            .headline {
                font-size: 1.2rem;
            }

            .nav-menu {
                gap: 1rem;
                font-size: 0.9rem;
            }

            .timeline::before {
                left: 10px;
            }

            .timeline-item:nth-child(odd) .timeline-content,
            .timeline-item:nth-child(even) .timeline-content {
                margin-left: 50px;
                margin-right: 0;
                text-align: left;
            }

            .timeline-marker {
                left: 10px;
            }

            section h2 {
                font-size: 1.8rem;
            }
        }
    `;

    // Theme-specific overrides
    const themeOverrides = {
      modern: `
        body {
            background: #fafbfc;
        }
        .navbar {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
        }
      `,
      minimal: `
        body {
            background: #ffffff;
            font-size: 15px;
        }
        .hero {
            background: #f5f5f5;
        }
      `,
      dark: `
        body {
            background: #1a1a1a;
            color: #e0e0e0;
        }
        .navbar {
            background: #0d0d0d;
            box-shadow: 0 2px 10px rgba(255, 255, 255, 0.05);
        }
        .hero {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        }
        .hero h1 {
            color: #ffffff;
        }
        .about, .skills, .education, .contact {
            background: #0d0d0d;
        }
        .project-card, .skill-category, .education-item {
            background: #2a2a2a;
            color: #e0e0e0;
        }
        .project-content h3, .skill-category h3, .education-content h3 {
            color: #ffffff;
        }
        section h2 {
            color: #ffffff;
        }
      `,
      professional: `
        body {
            font-family: 'Georgia', serif;
        }
        .hero {
            background: linear-gradient(to right, #2c3e50, #34495e);
            color: white;
        }
        .hero h1 {
            color: white;
        }
      `
    };

    return baseStyles + (themeOverrides[theme as keyof typeof themeOverrides] || '');
  }

  private static getSocialIcon(platform: string): string {
    const icons: Record<string, string> = {
      github: '🔗',
      linkedin: '💼',
      twitter: '𝕏',
      behance: '🎨',
      dribbble: '🎯',
      instagram: '📷',
      website: '🌐'
    };
    return icons[platform] || '🔗';
  }

  private static darkenColor(color: string, percent: number): string {
    return color; // Simplified for now
  }
}
