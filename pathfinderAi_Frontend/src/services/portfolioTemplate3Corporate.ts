import { PortfolioData } from '@/types/portfolio';

/**
 * Template 3: Corporate Executive
 * - Formal, sophisticated design
 * - Professional hierarchy
 * - Business-focused layout
 */
export const generateCorporateTemplate = (data: PortfolioData): string => {
  const primaryColor = data.accentColor || '#1e3a8a';
  const accentColor = '#0369a1';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Executive Profile</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            background: #f1f5f9;
            color: #1e293b;
            line-height: 1.8;
        }

        html { scroll-behavior: smooth; }

        .page-container {
            max-width: 1400px;
            margin: 0 auto;
        }

        /* Header/Navbar */
        .header {
            background: white;
            border-bottom: 3px solid ${primaryColor};
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1.5rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header-title {
            font-size: 1.4rem;
            font-weight: 700;
            color: ${primaryColor};
            letter-spacing: 2px;
        }

        .header-nav {
            display: flex;
            list-style: none;
            gap: 2.5rem;
        }

        .header-nav a {
            text-decoration: none;
            color: #475569;
            font-weight: 500;
            font-size: 0.95rem;
            transition: color 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.9rem;
        }

        .header-nav a:hover {
            color: ${accentColor};
        }

        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);
            color: white;
            padding: 80px 2rem 60px;
            text-align: center;
        }

        .hero-content {
            max-width: 1000px;
            margin: 0 auto;
            animation: fadeIn 1s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .profile-image {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            border: 5px solid white;
            margin-bottom: 2rem;
            object-fit: cover;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
            animation: slideDown 0.8s ease-out;
        }

        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .hero h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            animation: fadeInUp 0.8s ease-out 0.1s both;
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .hero .title {
            font-size: 1.6rem;
            font-weight: 500;
            margin-bottom: 2rem;
            opacity: 0.95;
            animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .hero p {
            font-size: 1.1rem;
            max-width: 700px;
            margin: 0 auto 2rem;
            opacity: 0.9;
            line-height: 1.6;
            animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        .hero-buttons {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            flex-wrap: wrap;
            animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .hero-button {
            padding: 12px 32px;
            background: white;
            color: ${primaryColor};
            border: none;
            border-radius: 0;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            font-size: 1rem;
            transition: all 0.3s;
            letter-spacing: 1px;
        }

        .hero-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .hero-button.outline {
            background: transparent;
            color: white;
            border: 2px solid white;
        }

        .hero-button.outline:hover {
            background: white;
            color: ${primaryColor};
        }

        /* Main Content */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        section {
            padding: 80px 2rem;
            border-bottom: 1px solid #e2e8f0;
        }

        section:last-of-type {
            border-bottom: none;
        }

        section h2 {
            font-size: 2.2rem;
            margin-bottom: 3rem;
            color: ${primaryColor};
            text-transform: uppercase;
            letter-spacing: 2px;
            position: relative;
            display: inline-block;
        }

        section h2::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 0;
            width: 60px;
            height: 3px;
            background: ${accentColor};
        }

        /* About Section */
        .about {
            background: white;
        }

        .about-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            margin-top: 3rem;
            align-items: center;
        }

        .about-text p {
            font-size: 1.05rem;
            line-height: 1.9;
            color: #455A64;
            margin-bottom: 1.5rem;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            margin-top: 2rem;
        }

        .stat-item {
            text-align: center;
            padding: 1.5rem;
            background: #f0f4f8;
            border-radius: 5px;
            transition: all 0.3s;
        }

        .stat-item:hover {
            background: ${primaryColor};
            color: white;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: ${accentColor};
        }

        .stat-item:hover .stat-number {
            color: white;
        }

        .stat-label {
            font-size: 0.9rem;
            margin-top: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Experience */
        .experience {
            background: #f8f9fa;
        }

        .experience-list {
            margin-top: 3rem;
        }

        .experience-item {
            background: white;
            padding: 2rem;
            margin-bottom: 2rem;
            border-left: 5px solid ${primaryColor};
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            transition: all 0.3s;
        }

        .experience-item:hover {
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            transform: translateX(5px);
        }

        .experience-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 1rem;
        }

        .experience-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: ${primaryColor};
        }

        .experience-company {
            color: ${accentColor};
            font-weight: 600;
        }

        .experience-date {
            color: #888;
            font-size: 0.9rem;
        }

        .experience-description {
            color: #555;
            line-height: 1.8;
            margin-bottom: 1rem;
        }

        .experience-tech {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
        }

        .tech-item {
            padding: 6px 14px;
            background: ${primaryColor}15;
            color: ${primaryColor};
            border-radius: 0;
            font-size: 0.85rem;
            font-weight: 500;
            letter-spacing: 0.5px;
        }

        /* Skills */
        .skills {
            background: white;
        }

        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .skill-group {
            padding: 2rem;
            background: #f0f4f8;
            border: 1px solid #cbd5e0;
            transition: all 0.3s;
        }

        .skill-group:hover {
            background: white;
            border-color: ${accentColor};
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .skill-group h3 {
            font-size: 1.2rem;
            color: ${primaryColor};
            margin-bottom: 1.5rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .skill-bars {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .skill-bar {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .skill-bar-label {
            font-size: 0.95rem;
            font-weight: 600;
            color: #333;
            display: flex;
            justify-content: space-between;
        }

        .skill-bar-container {
            height: 8px;
            background: #e0e0e0;
            border-radius: 0;
            overflow: hidden;
        }

        .skill-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, ${primaryColor}, ${accentColor});
            animation: fillBar 1s ease-out forwards;
        }

        @keyframes fillBar {
            from { width: 0; }
            to { width: var(--skill-level); }
        }

        /* Projects */
        .projects {
            background: #f8f9fa;
        }

        .projects-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 3rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .projects-table th {
            background: ${primaryColor};
            color: white;
            padding: 1.5rem;
            text-align: left;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.9rem;
        }

        .projects-table td {
            padding: 1.5rem;
            border-bottom: 1px solid #e0e0e0;
            background: white;
        }

        .projects-table tr:hover td {
            background: #f5f7fa;
        }

        .project-title {
            font-weight: 700;
            color: ${primaryColor};
            font-size: 1.05rem;
        }

        .project-desc {
            color: #666;
            font-size: 0.95rem;
            margin-top: 0.3rem;
        }

        .project-links {
            display: flex;
            gap: 1rem;
        }

        .project-link {
            padding: 6px 12px;
            background: ${accentColor};
            color: white;
            text-decoration: none;
            border-radius: 0;
            font-size: 0.85rem;
            transition: all 0.3s;
            font-weight: 500;
        }

        .project-link:hover {
            background: ${primaryColor};
        }

        /* Contact */
        .contact {
            background: linear-gradient(135deg, ${primaryColor}, ${accentColor});
            color: white;
        }

        .contact h2 {
            color: white;
        }

        .contact h2::after {
            background: white;
        }

        .contact-content {
            margin-top: 3rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            text-align: center;
        }

        .contact-item h3 {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .contact-item p {
            font-size: 1rem;
            opacity: 0.95;
        }

        .contact-item a {
            color: white;
            text-decoration: none;
            font-weight: 600;
            border-bottom: 2px solid white;
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 45px;
            height: 45px;
            background: white;
            color: ${primaryColor};
            text-decoration: none;
            font-weight: 600;
            font-size: 1.2rem;
            transition: all 0.3s;
        }

        .social-link:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        /* Footer */
        .footer {
            background: #0f172a;
            color: #999;
            text-align: center;
            padding: 2rem;
            font-size: 0.9rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .about-grid,
            .stats,
            .skills-grid,
            .contact-content {
                grid-template-columns: 1fr;
            }

            .hero h1 { font-size: 2rem; }
            .hero .title { font-size: 1.2rem; }

            .header-content {
                flex-direction: column;
                gap: 1rem;
            }

            .header-nav {
                gap: 1.5rem;
                font-size: 0.8rem;
            }

            .projects-table {
                font-size: 0.9rem;
            }

            .projects-table th,
            .projects-table td {
                padding: 1rem;
            }

            section h2 { font-size: 1.6rem; }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <div class="header-title">${data.fullName}</div>
            <nav>
                <ul class="header-nav">
                    <li><a href="#about">About</a></li>
                    <li><a href="#experience">Experience</a></li>
                    <li><a href="#skills">Skills</a></li>
                    ${data.projects.length > 0 ? '<li><a href="#projects">Projects</a></li>' : ''}
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <section class="hero">
        <div class="hero-content">
            ${data.profileImage ? `<img src="${data.profileImage}" alt="Profile" class="profile-image">` : '<div style="font-size: 3rem; margin-bottom: 2rem;">👤</div>'}
            <h1>${data.fullName}</h1>
            <p class="title">${data.headline}</p>
            <p>${data.about || data.bio}</p>
            <div class="hero-buttons">
                <a href="#contact" class="hero-button">Get In Touch</a>
                <a href="#projects" class="hero-button outline">View Work</a>
            </div>
            <div class="social-links">
                ${data.socialLinks.map(link => {
                    const icons = {
                        github: '🔗', linkedin: '💼', twitter: '𝕏',
                        behance: '🎨', dribbble: '🎯', instagram: '📷', website: '🌐'
                    };
                    return `<a href="${link.url}" class="social-link" target="_blank" rel="noopener noreferrer" title="${link.platform}">${icons[link.platform] || '🔗'}</a>`;
                }).join('')}
            </div>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2>About</h2>
            <div class="about-grid">
                <div class="about-text">
                    <p>${data.about || data.bio}</p>
                </div>
                ${data.experience.length >= 3 ? `
                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-number">15+</div>
                        <div class="stat-label">Years Experience</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${data.projects.length}</div>
                        <div class="stat-label">Projects</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">100+</div>
                        <div class="stat-label">Clients</div>
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    </section>

    ${data.experience.length > 0 ? `
    <section id="experience" class="experience">
        <div class="container">
            <h2>Professional Experience</h2>
            <div class="experience-list">
                ${data.experience.map(exp => `
                    <div class="experience-item">
                        <div class="experience-header">
                            <div>
                                <div class="experience-title">${exp.title}</div>
                                <div class="experience-company">${exp.company}</div>
                            </div>
                            <div class="experience-date">${exp.startDate} - ${exp.isCurrently ? 'Present' : exp.endDate}</div>
                        </div>
                        <div class="experience-description">${exp.description}</div>
                        ${exp.technologies ? `
                            <div class="experience-tech">
                                ${exp.technologies.map(tech => `<span class="tech-item">${tech}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${data.skills.length > 0 ? `
    <section id="skills" class="skills">
        <div class="container">
            <h2>Core Competencies</h2>
            <div class="skills-grid">
                ${data.skills.map(skillGroup => `
                    <div class="skill-group">
                        <h3>${skillGroup.category}</h3>
                        <div class="skill-bars">
                            ${skillGroup.skills.map((skill, idx) => {
                                const levels = [90, 85, 88, 92, 80, 95, 87, 89];
                                const level = levels[idx % levels.length];
                                return `
                                    <div class="skill-bar">
                                        <div class="skill-bar-label">
                                            <span>${skill}</span>
                                            <span>${level}%</span>
                                        </div>
                                        <div class="skill-bar-container">
                                            <div class="skill-bar-fill" style="--skill-level: ${level}%"></div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${data.projects.length > 0 ? `
    <section id="projects" class="projects">
        <div class="container">
            <h2>Featured Projects</h2>
            <table class="projects-table">
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Description</th>
                        <th>Technologies</th>
                        <th>Links</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.projects.filter(p => p.featured).map(project => `
                        <tr>
                            <td>
                                <div class="project-title">${project.title}</div>
                            </td>
                            <td>
                                <div class="project-desc">${project.description.substring(0, 80)}...</div>
                            </td>
                            <td>${project.technologies.slice(0, 3).join(', ')}</td>
                            <td>
                                <div class="project-links">
                                    ${project.liveUrl ? `<a href="${project.liveUrl}" class="project-link" target="_blank" rel="noopener noreferrer">Live</a>` : ''}
                                    ${project.githubUrl ? `<a href="${project.githubUrl}" class="project-link" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </section>
    ` : ''}

    <section id="contact" class="contact">
        <div class="container">
            <h2>Get In Touch</h2>
            <div class="contact-content">
                ${data.email ? `
                    <div class="contact-item">
                        <h3>Email</h3>
                        <p><a href="mailto:${data.email}">${data.email}</a></p>
                    </div>
                ` : ''}
                ${data.phone ? `
                    <div class="contact-item">
                        <h3>Phone</h3>
                        <p><a href="tel:${data.phone}">${data.phone}</a></p>
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
        <p>&copy; 2024 ${data.fullName}. All rights reserved.</p>
    </footer>
</body>
</html>`;
};


