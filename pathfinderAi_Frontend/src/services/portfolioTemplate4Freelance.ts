import { PortfolioData } from '@/types/portfolio';

/**
 * Template 4: Freelance Creator
 * - Dynamic, interactive showcase
 * - Project-centric layout
 * - Modern with playful elements
 */
export const generateFreelanceTemplate = (data: PortfolioData): string => {
  const primaryColor = data.accentColor || '#d946ef';
  const secondaryColor = '#3b82f6';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Freelance Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #fff;
            line-height: 1.6;
            overflow-x: hidden;
        }

        html { scroll-behavior: smooth; }

        /* Navbar */
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(26, 26, 46, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid ${primaryColor}30;
            padding: 1rem 2rem;
        }

        .navbar-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .navbar-brand {
            font-size: 1.5rem;
            font-weight: 900;
            background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
        }

        .nav-links a {
            text-decoration: none;
            color: #aaa;
            font-weight: 500;
            transition: all 0.3s;
            position: relative;
        }

        .nav-links a::before {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, ${primaryColor}, ${secondaryColor});
            transition: width 0.3s;
        }

        .nav-links a:hover {
            color: ${primaryColor};
        }

        .nav-links a:hover::before {
            width: 100%;
        }

        /* Hero */
        .hero {
            margin-top: 60px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
            position: relative;
            overflow: hidden;
        }

        .hero::before,
        .hero::after {
            content: '';
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, ${primaryColor}15, transparent);
            animation: pulse 8s ease-in-out infinite;
        }

        .hero::before {
            width: 400px;
            height: 400px;
            top: -50px;
            right: 10%;
        }

        .hero::after {
            width: 300px;
            height: 300px;
            bottom: -30px;
            left: 5%;
            animation-delay: 2s;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        .hero-content {
            position: relative;
            z-index: 10;
            text-align: center;
            max-width: 900px;
            animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .hero h1 {
            font-size: 4rem;
            font-weight: 900;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.1;
        }

        .hero .subtitle {
            font-size: 1.4rem;
            color: #aaa;
            margin-bottom: 2rem;
        }

        .hero p {
            font-size: 1.1rem;
            color: #ccc;
            max-width: 700px;
            margin: 0 auto 3rem;
            line-height: 1.8;
        }

        .hero-cta {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 3rem;
        }

        .btn {
            padding: 15px 40px;
            background: linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd);
            color: white;
            border: none;
            border-radius: 50px;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            font-size: 1rem;
            transition: all 0.3s;
            box-shadow: 0 10px 30px ${primaryColor}30;
            display: inline-block;
        }

        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px ${primaryColor}50;
        }

        .btn-secondary {
            background: transparent;
            border: 2px solid ${primaryColor};
            box-shadow: none;
        }

        .btn-secondary:hover {
            background: ${primaryColor}20;
        }

        .social-showcase {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .social-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            background: ${primaryColor}20;
            color: ${primaryColor};
            border-radius: 50%;
            text-decoration: none;
            font-size: 1.3rem;
            transition: all 0.3s;
            border: 2px solid ${primaryColor}30;
        }

        .social-icon:hover {
            background: ${primaryColor};
            color: white;
            transform: translateY(-5px);
            border-color: ${primaryColor};
        }

        /* Container */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        section {
            padding: 100px 2rem;
            position: relative;
        }

        section h2 {
            font-size: 2.8rem;
            font-weight: 900;
            margin-bottom: 3rem;
            text-align: center;
            color: #fff;
            background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* About */
        .about {
            background: rgba(255, 255, 255, 0.02);
            border-top: 1px solid ${primaryColor}20;
            border-bottom: 1px solid ${primaryColor}20;
        }

        .about-content {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
            color: #ccc;
            font-size: 1.1rem;
            line-height: 1.8;
        }

        /* Projects Showcase */
        .projects {
            background: linear-gradient(180deg, rgba(26, 26, 46, 0.5), rgba(26, 26, 46, 0.8));
        }

        .projects-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2.5rem;
            margin-top: 3rem;
        }

        .project-card {
            position: relative;
            height: 400px;
            border-radius: 15px;
            overflow: hidden;
            cursor: pointer;
            group: 'project';
            transition: all 0.3s;
        }

        .project-card::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, ${primaryColor}40, ${secondaryColor}40);
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 2;
        }

        .project-card:hover::before {
            opacity: 1;
        }

        .project-image {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
        }

        .project-content {
            position: absolute;
            inset: 0;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            background: linear-gradient(180deg, transparent 0%, rgba(26, 26, 46, 0.95) 50%);
            z-index: 3;
            transition: all 0.3s;
        }

        .project-card:hover .project-content {
            background: linear-gradient(180deg, transparent 0%, rgba(26, 26, 46, 1) 30%);
        }

        .project-content h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: ${primaryColor};
        }

        .project-content p {
            color: #aaa;
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
        }

        .project-tech {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
            margin-bottom: 1.5rem;
        }

        .tech-pill {
            padding: 6px 12px;
            background: ${primaryColor}30;
            color: ${primaryColor};
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .project-links {
            display: flex;
            gap: 1rem;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .project-card:hover .project-links {
            opacity: 1;
        }

        .project-link {
            flex: 1;
            padding: 8px 16px;
            background: ${primaryColor};
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s;
        }

        .project-link:hover {
            background: ${secondaryColor};
            transform: scale(1.05);
        }

        /* Skills */
        .skills {
            background: rgba(255, 255, 255, 0.02);
        }

        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .skill-card {
            background: linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15);
            padding: 2rem;
            border-radius: 12px;
            border: 1px solid ${primaryColor}30;
            transition: all 0.3s;
        }

        .skill-card:hover {
            transform: translateY(-10px);
            border-color: ${primaryColor};
            background: linear-gradient(135deg, ${primaryColor}25, ${secondaryColor}25);
            box-shadow: 0 15px 40px ${primaryColor}20;
        }

        .skill-card h3 {
            color: ${primaryColor};
            font-size: 1.3rem;
            margin-bottom: 1.5rem;
        }

        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
        }

        .skill-item {
            padding: 8px 14px;
            background: ${primaryColor}30;
            color: ${primaryColor};
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }

        /* Experience Timeline */
        .experience {
            background: linear-gradient(180deg, rgba(26, 26, 46, 0.5), rgba(26, 26, 46, 0.8));
        }

        .timeline {
            max-width: 900px;
            margin: 3rem auto 0;
            position: relative;
            padding: 2rem 0;
        }

        .timeline::after {
            content: '';
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 2px;
            height: 100%;
            background: linear-gradient(180deg, ${primaryColor}, ${secondaryColor});
        }

        .timeline-item {
            margin-bottom: 3rem;
            position: relative;
        }

        .timeline-item:nth-child(odd) {
            margin-right: 55%;
            text-align: right;
        }

        .timeline-item:nth-child(even) {
            margin-left: 55%;
            text-align: left;
        }

        .timeline-dot {
            position: absolute;
            left: 50%;
            top: 0;
            width: 20px;
            height: 20px;
            background: #1a1a2e;
            border: 3px solid ${primaryColor};
            border-radius: 50%;
            transform: translateX(-50%);
            box-shadow: 0 0 0 8px ${primaryColor}20;
            transition: all 0.3s;
        }

        .timeline-item:hover .timeline-dot {
            width: 28px;
            height: 28px;
            margin-top: -4px;
            box-shadow: 0 0 0 12px ${primaryColor}30;
        }

        .timeline-content {
            background: linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15);
            padding: 2rem;
            border-radius: 12px;
            border: 1px solid ${primaryColor}30;
            transition: all 0.3s;
        }

        .timeline-item:hover .timeline-content {
            transform: translateY(-5px);
            border-color: ${primaryColor};
            background: linear-gradient(135deg, ${primaryColor}25, ${secondaryColor}25);
            box-shadow: 0 10px 30px ${primaryColor}20;
        }

        .timeline-content h3 {
            color: ${primaryColor};
            font-size: 1.3rem;
            margin-bottom: 0.3rem;
        }

        .timeline-content .company {
            color: ${secondaryColor};
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .timeline-content .period {
            color: #999;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }

        .timeline-content p {
            color: #ccc;
        }

        /* Contact */
        .contact {
            background: linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20);
            border-top: 1px solid ${primaryColor}40;
            border-bottom: 1px solid ${primaryColor}40;
            text-align: center;
        }

        .contact p {
            color: #ccc;
            font-size: 1.1rem;
            margin-bottom: 2rem;
        }

        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .contact-item h3 {
            color: ${primaryColor};
            margin-bottom: 0.5rem;
        }

        .contact-item a {
            color: ${secondaryColor};
            text-decoration: none;
            transition: color 0.3s;
        }

        .contact-item a:hover {
            color: ${primaryColor};
            text-decoration: underline;
        }

        /* Footer */
        .footer {
            background: rgba(0, 0, 0, 0.3);
            color: #666;
            text-align: center;
            padding: 2rem;
            border-top: 1px solid ${primaryColor}20;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2rem;
            }

            .hero .subtitle {
                font-size: 1rem;
            }

            .hero-cta {
                flex-direction: column;
            }

            .nav-links {
                gap: 1rem;
                font-size: 0.9rem;
            }

            .projects-container {
                grid-template-columns: 1fr;
            }

            .project-card {
                height: 300px;
            }

            .timeline::after {
                left: 15px;
            }

            .timeline-item:nth-child(odd),
            .timeline-item:nth-child(even) {
                margin-left: 60px;
                margin-right: 0;
                text-align: left;
            }

            .timeline-dot {
                left: 15px;
            }

            section h2 {
                font-size: 2rem;
            }

            .skills-grid,
            .contact-info {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="navbar-content">
            <div class="navbar-brand">${data.fullName}</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Work</a></li>
                <li><a href="#skills">Skills</a></li>
                ${data.experience.length > 0 ? '<li><a href="#experience">Experience</a></li>' : ''}
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <section id="home" class="hero">
        <div class="hero-content">
            <h1>${data.fullName}</h1>
            <p class="subtitle">${data.headline}</p>
            <p>${data.about || data.bio}</p>
            <div class="hero-cta">
                <a href="#projects" class="btn">View My Work</a>
                <a href="#contact" class="btn btn-secondary">Let's Talk</a>
            </div>
            <div class="social-showcase">
                ${data.socialLinks.map(link => {
                    const icons = {
                        github: '🔗', linkedin: '💼', twitter: '𝕏',
                        behance: '🎨', dribbble: '🎯', instagram: '📷', website: '🌐'
                    };
                    return `<a href="${link.url}" class="social-icon" target="_blank" rel="noopener noreferrer" title="${link.platform}">${icons[link.platform] || '🔗'}</a>`;
                }).join('')}
            </div>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2>About Me</h2>
            <div class="about-content">
                ${data.about || data.bio}
            </div>
        </div>
    </section>

    ${data.projects.length > 0 ? `
    <section id="projects" class="projects">
        <div class="container">
            <h2>Featured Projects</h2>
            <div class="projects-container">
                ${data.projects.filter(p => p.featured).map(project => `
                    <div class="project-card">
                        <div class="project-image">
                            ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">` : '🎯'}
                        </div>
                        <div class="project-content">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            <div class="project-tech">
                                ${project.technologies.map(tech => `<span class="tech-pill">${tech}</span>`).join('')}
                            </div>
                            <div class="project-links">
                                ${project.liveUrl ? `<a href="${project.liveUrl}" class="project-link" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ''}
                                ${project.githubUrl ? `<a href="${project.githubUrl}" class="project-link" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${data.skills.length > 0 ? `
    <section id="skills" class="skills">
        <div class="container">
            <h2>Skills & Tools</h2>
            <div class="skills-grid">
                ${data.skills.map(skillGroup => `
                    <div class="skill-card">
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

    ${data.experience.length > 0 ? `
    <section id="experience" class="experience">
        <div class="container">
            <h2>Work Experience</h2>
            <div class="timeline">
                ${data.experience.map(exp => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <h3>${exp.title}</h3>
                            <p class="company">${exp.company}</p>
                            <p class="period">${exp.startDate} - ${exp.isCurrently ? 'Present' : exp.endDate}</p>
                            <p>${exp.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <section id="contact" class="contact">
        <div class="container">
            <h2>Get In Touch</h2>
            <p>Interested in working together? Let me know!</p>
            <div class="contact-info">
                ${data.email ? `
                    <div class="contact-item">
                        <h3>Email</h3>
                        <a href="mailto:${data.email}">${data.email}</a>
                    </div>
                ` : ''}
                ${data.phone ? `
                    <div class="contact-item">
                        <h3>Phone</h3>
                        <a href="tel:${data.phone}">${data.phone}</a>
                    </div>
                ` : ''}
                ${data.location ? `
                    <div class="contact-item">
                        <h3>Location</h3>
                        <p>${data.location}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    </section>

    <footer class="footer">
        <p>&copy; 2024 ${data.fullName}. Designed & Built with passion.</p>
    </footer>
</body>
</html>`;
};


