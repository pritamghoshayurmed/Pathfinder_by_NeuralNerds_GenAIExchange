import { PortfolioData } from '@/types/portfolio';

/**
 * Template 2: Creative Professional
 * - Artistic asymmetric layout
 * - Smooth scroll transitions
 * - Gallery-style project showcase
 */
export const generateCreativeTemplate = (data: PortfolioData): string => {
  const accentColor = data.accentColor || '#ec4899';
  const secondaryColor = '#f59e0b';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Creative Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html { scroll-behavior: smooth; }

        body {
            font-family: 'Poppins', 'Segoe UI', sans-serif;
            background: #faf9f6;
            color: #2d2d2d;
            overflow-x: hidden;
        }

        .nav {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 999;
            background: rgba(250, 249, 246, 0.9);
            backdrop-filter: blur(10px);
            padding: 1.5rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .nav-logo {
            font-size: 1.3rem;
            font-weight: 800;
            color: ${accentColor};
            letter-spacing: -1px;
        }

        .nav-links {
            display: flex;
            gap: 2.5rem;
            list-style: none;
        }

        .nav-links a {
            text-decoration: none;
            color: #555;
            font-weight: 500;
            font-size: 0.95rem;
            transition: all 0.3s;
            position: relative;
        }

        .nav-links a::before {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, ${accentColor}, ${secondaryColor});
            transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .nav-links a:hover::before {
            width: 100%;
        }

        /* Hero Section */
        .hero {
            margin-top: 70px;
            min-height: 100vh;
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: center;
            gap: 4rem;
            padding: 4rem 2rem;
            position: relative;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -20%;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, ${accentColor}25, transparent);
            border-radius: 50%;
            animation: drift 20s ease-in-out infinite;
        }

        @keyframes drift {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(30px, -30px) rotate(180deg); }
        }

        .hero .container {
            position: relative;
            z-index: 10;
        }

        .hero-text h1 {
            font-size: 3.5rem;
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, ${accentColor}, ${secondaryColor});
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .hero-text .subtitle {
            font-size: 1.3rem;
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.6;
            animation: fadeInUp 1s ease-out 0.1s both;
        }

        .hero-cta {
            display: flex;
            gap: 1rem;
            margin-bottom: 3rem;
            animation: fadeInUp 1s ease-out 0.2s both;
        }

        .btn {
            padding: 15px 35px;
            border: 2px solid ${accentColor};
            background: ${accentColor};
            color: white;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s;
            font-size: 1rem;
        }

        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px ${accentColor}40;
        }

        .btn-outline {
            background: transparent;
            color: ${accentColor};
        }

        .btn-outline:hover {
            background: ${accentColor};
            color: white;
        }

        .hero-image {
            position: relative;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeInRight 1s ease-out 0.3s both;
        }

        @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
        }

        .profile-pic {
            width: 350px;
            height: 350px;
            border-radius: 20px;
            object-fit: cover;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
            border: 8px solid white;
        }

        /* Section Styles */
        section {
            padding: 100px 2rem;
            position: relative;
        }

        section h2 {
            font-size: 2.8rem;
            font-weight: 800;
            margin-bottom: 3rem;
            text-align: center;
            color: #2d2d2d;
        }

        /* About */
        .about {
            background: white;
        }

        .about-content {
            max-width: 700px;
            margin: 0 auto;
            text-align: center;
        }

        .about-content p {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #555;
            margin-bottom: 1rem;
        }

        /* Gallery Projects */
        .projects {
            background: #fff8f3;
        }

        .projects-masonry {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .project-item {
            position: relative;
            border-radius: 15px;
            overflow: hidden;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            aspect-ratio: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            background: linear-gradient(135deg, ${accentColor}33, ${secondaryColor}33);
        }

        .project-item:hover {
            transform: translateY(-15px);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
        }

        .project-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, ${accentColor}dd, ${secondaryColor}dd);
            opacity: 0;
            transition: opacity 0.4s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .project-item:hover .project-overlay {
            opacity: 1;
        }

        .project-overlay-content {
            text-align: center;
            color: white;
        }

        .project-overlay-content h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }

        .project-overlay-content p {
            font-size: 0.9rem;
            margin-bottom: 1rem;
            opacity: 0.9;
        }

        .overlay-links {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        .overlay-link {
            padding: 8px 16px;
            background: white;
            color: ${accentColor};
            text-decoration: none;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            transition: all 0.3s;
        }

        .overlay-link:hover {
            transform: scale(1.1);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .project-info {
            padding: 1.5rem;
            background: white;
            transition: all 0.3s;
        }

        .project-info h3 {
            color: ${accentColor};
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
        }

        .project-info p {
            color: #999;
            font-size: 0.9rem;
        }

        .project-tech {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 0.8rem;
        }

        .tech-badge {
            padding: 4px 10px;
            background: ${accentColor}15;
            color: ${accentColor};
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 500;
        }

        /* Skills */
        .skills {
            background: white;
        }

        .skills-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .skill-box {
            background: linear-gradient(135deg, #f8f6f0, #fef3e6);
            padding: 2.5rem;
            border-radius: 15px;
            border-left: 6px solid ${accentColor};
            transition: all 0.3s;
        }

        .skill-box:hover {
            transform: translateX(10px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
        }

        .skill-box h3 {
            color: ${accentColor};
            font-size: 1.3rem;
            margin-bottom: 1.5rem;
        }

        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
        }

        .skill-tag {
            padding: 8px 16px;
            background: white;
            color: #555;
            border-radius: 25px;
            font-size: 0.9rem;
            border: 1px solid ${accentColor}30;
            transition: all 0.3s;
        }

        .skill-tag:hover {
            border-color: ${accentColor};
            color: ${accentColor};
            background: ${accentColor}10;
        }

        /* Timeline */
        .experience {
            background: #fff8f3;
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
            width: 3px;
            height: 100%;
            background: linear-gradient(180deg, ${accentColor}, ${secondaryColor});
        }

        .timeline-block {
            margin-bottom: 3rem;
            position: relative;
        }

        .timeline-block:nth-child(odd) {
            margin-right: 55%;
            text-align: right;
        }

        .timeline-block:nth-child(even) {
            margin-left: 55%;
            text-align: left;
        }

        .timeline-dot {
            position: absolute;
            left: 50%;
            top: 0;
            width: 25px;
            height: 25px;
            background: white;
            border: 4px solid ${accentColor};
            border-radius: 50%;
            transform: translateX(-50%);
            box-shadow: 0 0 0 8px ${accentColor}20;
            transition: all 0.3s;
        }

        .timeline-block:hover .timeline-dot {
            width: 35px;
            height: 35px;
            margin-top: -5px;
            box-shadow: 0 0 0 12px ${accentColor}30;
        }

        .timeline-content {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
            transition: all 0.3s;
            margin-bottom: 1rem;
        }

        .timeline-block:hover .timeline-content {
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
            transform: translateY(-5px);
        }

        .timeline-content h3 {
            color: ${accentColor};
            font-size: 1.4rem;
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
            color: #555;
            line-height: 1.6;
        }

        /* Contact */
        .contact {
            background: linear-gradient(135deg, ${accentColor}15, ${secondaryColor}15);
            text-align: center;
        }

        .contact p {
            font-size: 1.1rem;
            color: #555;
            margin-bottom: 2rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .contact-methods {
            display: flex;
            justify-content: center;
            gap: 2rem;
            flex-wrap: wrap;
            margin-bottom: 2rem;
        }

        .contact-method {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            flex: 1;
            min-width: 250px;
            transition: all 0.3s;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .contact-method:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .contact-method h3 {
            color: ${accentColor};
            margin-bottom: 0.5rem;
        }

        .contact-method a {
            color: ${accentColor};
            text-decoration: none;
            font-weight: 600;
        }

        .contact-method a:hover {
            text-decoration: underline;
        }

        /* Footer */
        .footer {
            background: #2d2d2d;
            color: #999;
            text-align: center;
            padding: 3rem 2rem;
        }

        /* Social Links */
        .social-icons {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin: 2rem 0;
        }

        .social-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            background: ${accentColor};
            color: white;
            text-decoration: none;
            border-radius: 50%;
            transition: all 0.3s;
            font-size: 1.3rem;
        }

        .social-icon:hover {
            background: ${secondaryColor};
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        /* Responsive */
        @media (max-width: 768px) {
            .hero {
                grid-template-columns: 1fr;
                padding: 2rem 1rem;
                gap: 2rem;
            }

            .hero-text h1 {
                font-size: 2rem;
            }

            .profile-pic {
                width: 250px;
                height: 250px;
            }

            .nav {
                flex-direction: column;
                gap: 1rem;
            }

            .nav-links {
                gap: 1.5rem;
                font-size: 0.85rem;
            }

            .timeline::after {
                left: 15px;
            }

            .timeline-block:nth-child(odd),
            .timeline-block:nth-child(even) {
                margin-left: 70px;
                margin-right: 0;
                text-align: left;
            }

            .timeline-dot {
                left: 15px;
            }

            section h2 {
                font-size: 2rem;
            }

            .hero-cta {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <nav class="nav">
        <div class="nav-logo">${data.fullName}</div>
        <ul class="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#skills">Skills</a></li>
            ${data.experience.length > 0 ? '<li><a href="#experience">Experience</a></li>' : ''}
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>

    <section id="home" class="hero">
        <div class="container">
            <div class="hero-text">
                <h1>${data.fullName}</h1>
                <p class="subtitle">${data.headline}</p>
                <div class="hero-cta">
                    <a href="#projects" class="btn">View Work</a>
                    <a href="#contact" class="btn btn-outline">Get In Touch</a>
                </div>
                <div class="social-icons">
                    ${data.socialLinks.map(link => {
                        const icons = {
                            github: '🔗', linkedin: '💼', twitter: '𝕏',
                            behance: '🎨', dribbble: '🎯', instagram: '📷', website: '🌐'
                        };
                        return `<a href="${link.url}" class="social-icon" target="_blank" rel="noopener noreferrer" title="${link.platform}">${icons[link.platform] || '🔗'}</a>`;
                    }).join('')}
                </div>
            </div>
        </div>
        <div class="hero-image">
            ${data.profileImage ? `<img src="${data.profileImage}" alt="Profile" class="profile-pic">` : '<div style="font-size: 5rem;">👤</div>'}
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2>About Me</h2>
            <div class="about-content">
                <p>${data.about || data.bio}</p>
            </div>
        </div>
    </section>

    ${data.projects.length > 0 ? `
    <section id="projects" class="projects">
        <div class="container">
            <h2>Creative Work</h2>
            <div class="projects-masonry">
                ${data.projects.filter(p => p.featured).map(project => `
                    <div class="project-item">
                        <div class="project-overlay">
                            <div class="project-overlay-content">
                                <h3>${project.title}</h3>
                                <p>${project.description}</p>
                                <div class="overlay-links">
                                    ${project.liveUrl ? `<a href="${project.liveUrl}" class="overlay-link" target="_blank" rel="noopener noreferrer">Live</a>` : ''}
                                    ${project.githubUrl ? `<a href="${project.githubUrl}" class="overlay-link" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="project-info">
                            <h3>${project.title}</h3>
                            <p>${project.description.substring(0, 100)}...</p>
                            <div class="project-tech">
                                ${project.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
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
            <h2>Skills & Expertise</h2>
            <div class="skills-container">
                ${data.skills.map(skillGroup => `
                    <div class="skill-box">
                        <h3>${skillGroup.category}</h3>
                        <div class="skills-list">
                            ${skillGroup.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
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
            <h2>Professional Experience</h2>
            <div class="timeline">
                ${data.experience.map(exp => `
                    <div class="timeline-block">
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
            <h2>Let's Connect</h2>
            <p>Have a project in mind or just want to chat? I'd love to hear from you!</p>
            <div class="contact-methods">
                ${data.email ? `
                    <div class="contact-method">
                        <h3>Email</h3>
                        <a href="mailto:${data.email}">${data.email}</a>
                    </div>
                ` : ''}
                ${data.phone ? `
                    <div class="contact-method">
                        <h3>Phone</h3>
                        <a href="tel:${data.phone}">${data.phone}</a>
                    </div>
                ` : ''}
                ${data.location ? `
                    <div class="contact-method">
                        <h3>Location</h3>
                        <p>${data.location}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    </section>

    <footer class="footer">
        <p>&copy; 2024 ${data.fullName}. Crafted with ✨</p>
    </footer>
</body>
</html>`;
};


