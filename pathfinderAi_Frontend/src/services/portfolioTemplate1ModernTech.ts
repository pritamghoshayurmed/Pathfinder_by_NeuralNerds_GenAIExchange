import { motion } from 'framer-motion';
import { PortfolioData } from '@/types/portfolio';

/**
 * Template 1: Modern Tech Startup
 * - Animated gradient hero
 * - Smooth scroll animations
 * - Modern minimalist design
 */
export const generateModernTechTemplate = (data: PortfolioData): string => {
  const accentColor = data.accentColor || '#6366f1';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Tech Portfolio</title>
    <style>
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
            color: #1a1a1a;
            background: #fafbfc;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Navbar */
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 1rem 0;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .navbar .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .nav-brand {
            font-size: 1.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, ${accentColor}, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }

        .nav-menu a {
            text-decoration: none;
            color: #666;
            font-weight: 500;
            transition: color 0.3s;
            position: relative;
        }

        .nav-menu a:hover {
            color: ${accentColor};
        }

        .nav-menu a::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background: ${accentColor};
            transition: width 0.3s;
        }

        .nav-menu a:hover::after {
            width: 100%;
        }

        /* Hero */
        .hero {
            margin-top: 60px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            position: relative;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, ${accentColor}20, transparent);
            border-radius: 50%;
            top: -100px;
            right: -100px;
            animation: float 8s ease-in-out infinite;
        }

        .hero::after {
            content: '';
            position: absolute;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, #8b5cf620, transparent);
            border-radius: 50%;
            bottom: -50px;
            left: -50px;
            animation: float 10s ease-in-out infinite reverse;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(30px); }
        }

        .hero-content {
            position: relative;
            z-index: 10;
            text-align: center;
            max-width: 800px;
        }

        .profile-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 4px solid ${accentColor};
            margin-bottom: 2rem;
            object-fit: cover;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            animation: slideUp 0.8s ease-out;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .hero h1 {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            color: #1a1a1a;
            animation: slideUp 0.8s ease-out 0.1s both;
        }

        .hero .headline {
            font-size: 1.5rem;
            color: ${accentColor};
            margin-bottom: 2rem;
            font-weight: 600;
            animation: slideUp 0.8s ease-out 0.2s both;
        }

        .social-links {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-bottom: 2rem;
            animation: slideUp 0.8s ease-out 0.3s both;
        }

        .social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: ${accentColor};
            color: white;
            text-decoration: none;
            font-size: 1.5rem;
            transition: all 0.3s;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .social-link:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            background: #8b5cf6;
        }

        .cta-button {
            display: inline-block;
            padding: 15px 40px;
            background: linear-gradient(135deg, ${accentColor}, #8b5cf6);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            animation: slideUp 0.8s ease-out 0.4s both;
        }

        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        /* Sections */
        section {
            padding: 100px 20px;
        }

        section h2 {
            font-size: 2.5rem;
            margin-bottom: 3rem;
            text-align: center;
            color: #1a1a1a;
            position: relative;
            display: inline-block;
            width: 100%;
        }

        section h2::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 4px;
            background: linear-gradient(90deg, ${accentColor}, #8b5cf6);
            border-radius: 2px;
        }

        /* About */
        .about {
            background: white;
        }

        .about p {
            font-size: 1.1rem;
            line-height: 1.8;
            max-width: 700px;
            margin: 0 auto;
            text-align: center;
            color: #555;
        }

        /* Projects */
        .projects {
            background: #f5f5f5;
        }

        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .project-card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
            transition: all 0.3s;
            cursor: pointer;
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .project-image {
            width: 100%;
            height: 250px;
            background: linear-gradient(135deg, ${accentColor}33, ${accentColor}11);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            overflow: hidden;
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
            font-size: 0.95rem;
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
            background: ${accentColor}22;
            color: ${accentColor};
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .project-links {
            display: flex;
            gap: 0.5rem;
        }

        .link-btn {
            flex: 1;
            padding: 8px 12px;
            background: ${accentColor};
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-size: 0.9rem;
            transition: all 0.3s;
            font-weight: 500;
        }

        .link-btn:hover {
            background: #8b5cf6;
        }

        /* Skills */
        .skills {
            background: white;
        }

        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .skill-category {
            background: #f5f5f5;
            padding: 2rem;
            border-radius: 10px;
            border-left: 4px solid ${accentColor};
            transition: all 0.3s;
        }

        .skill-category:hover {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transform: translateX(5px);
        }

        .skill-category h3 {
            color: ${accentColor};
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }

        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
        }

        .skill-item {
            display: inline-block;
            padding: 8px 16px;
            background: ${accentColor}22;
            color: ${accentColor};
            border-radius: 20px;
            font-weight: 500;
            font-size: 0.95rem;
        }

        /* Timeline */
        .experience {
            background: #f5f5f5;
        }

        .timeline {
            position: relative;
            padding: 2rem 0;
            margin-top: 3rem;
        }

        .timeline::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: ${accentColor}33;
            transform: translateX(-50%);
        }

        .timeline-item {
            margin-bottom: 3rem;
            position: relative;
        }

        .timeline-item:nth-child(odd) {
            margin-left: 0;
            margin-right: 52%;
            text-align: right;
        }

        .timeline-item:nth-child(even) {
            margin-left: 52%;
            margin-right: 0;
            text-align: left;
        }

        .timeline-marker {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 20px;
            height: 20px;
            background: ${accentColor};
            border: 4px solid white;
            border-radius: 50%;
            box-shadow: 0 0 0 4px ${accentColor}33;
            transition: all 0.3s;
        }

        .timeline-item:hover .timeline-marker {
            width: 30px;
            height: 30px;
            margin-top: -5px;
            box-shadow: 0 0 0 8px ${accentColor}33;
        }

        .timeline-content {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
            transition: all 0.3s;
        }

        .timeline-item:hover .timeline-content {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            transform: translateY(-5px);
        }

        .timeline-content h3 {
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
            color: #1a1a1a;
        }

        .timeline-content .company {
            color: ${accentColor};
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

        .timeline-content .tech-tags {
            margin-top: 1rem;
        }

        /* Contact */
        .contact {
            background: linear-gradient(135deg, ${accentColor}22, ${accentColor}11);
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
            color: ${accentColor};
            text-decoration: none;
            font-weight: 600;
        }

        .contact-info a:hover {
            text-decoration: underline;
        }

        /* Footer */
        .footer {
            background: #1a1a1a;
            color: #999;
            text-align: center;
            padding: 2rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2rem;
            }

            .hero .headline {
                font-size: 1.2rem;
            }

            .nav-menu {
                gap: 1rem;
                font-size: 0.9rem;
            }

            .timeline::before {
                left: 10px;
            }

            .timeline-item:nth-child(odd),
            .timeline-item:nth-child(even) {
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
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <section id="home" class="hero">
        <div class="hero-content">
            ${data.profileImage ? `<img src="${data.profileImage}" alt="Profile" class="profile-image">` : '<div style="font-size: 4rem;">👤</div>'}
            <h1>${data.fullName}</h1>
            <p class="headline">${data.headline}</p>
            <div class="social-links">
                ${data.socialLinks.map(link => {
                    const icons = {
                        github: '🔗', linkedin: '💼', twitter: '𝕏',
                        behance: '🎨', dribbble: '🎯', instagram: '📷', website: '🌐'
                    };
                    return `<a href="${link.url}" class="social-link" target="_blank" rel="noopener noreferrer" title="${link.platform}">${icons[link.platform] || '🔗'}</a>`;
                }).join('')}
            </div>
            <a href="#projects" class="cta-button">View My Work</a>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2>About Me</h2>
            <p>${data.about || data.bio}</p>
        </div>
    </section>

    ${data.projects.length > 0 ? `
    <section id="projects" class="projects">
        <div class="container">
            <h2>Featured Projects</h2>
            <div class="projects-grid">
                ${data.projects.filter(p => p.featured).map(project => `
                    <div class="project-card">
                        <div class="project-image">${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">` : '🎨'}</div>
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

    <section id="contact" class="contact">
        <div class="container">
            <h2>Get In Touch</h2>
            <p>Feel free to reach out for collaborations or just a friendly hello!</p>
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
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideUp 0.6s ease-out forwards';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.project-card, .skill-category, .timeline-item').forEach(el => {
            observer.observe(el);
        });
    </script>
</body>
</html>`;
};


