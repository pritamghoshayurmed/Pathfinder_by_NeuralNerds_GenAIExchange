import { PortfolioData } from '@/types/portfolio';

/**
 * PREMIUM PORTFOLIO TEMPLATE 1: Luxury Minimal Dark
 * Ultra-modern, sleek dark theme with premium gradients and animations
 */
export const generatePremiumLuxuryMinimal = (data: PortfolioData): string => {
  const accentColor = data.accentColor || '#00ff88';
  
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Premium Portfolio</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #0a0e27;
            --secondary: #111631;
            --tertiary: #1a1f3a;
            --accent: ${accentColor};
            --text-primary: #e0e0e0;
            --text-secondary: #a0a0a0;
            --border: rgba(255, 255, 255, 0.1);
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: var(--text-primary);
            line-height: 1.6;
            min-height: 100vh;
        }

        /* Animated grid background */
        body::before {
            content: '';
            position: fixed;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            background: radial-gradient(circle, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: moveGrid 20s linear infinite;
            z-index: -1;
        }

        @keyframes moveGrid {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* NAVBAR */
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(10, 14, 39, 0.7);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            padding: 1rem 0;
        }

        .navbar.scrolled {
            background: rgba(10, 14, 39, 0.9);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .navbar .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .nav-brand {
            font-size: 1.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, var(--accent) 0%, #00ccff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .nav-menu {
            display: flex;
            list-style: none;
            gap: 3rem;
        }

        .nav-menu a {
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
            position: relative;
            text-transform: uppercase;
            font-size: 0.9rem;
            letter-spacing: 1px;
        }

        .nav-menu a::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, var(--accent), transparent);
            transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .nav-menu a:hover {
            color: var(--accent);
        }

        .nav-menu a:hover::after {
            width: 100%;
        }

        /* HERO SECTION */
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-top: 80px;
            position: relative;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(0, 255, 136, 0.15) 0%, transparent 70%);
            border-radius: 50%;
            top: 10%;
            right: 10%;
            animation: float 6s ease-in-out infinite;
        }

        .hero::after {
            content: '';
            position: absolute;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(0, 204, 255, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            bottom: 10%;
            left: 5%;
            animation: float 8s ease-in-out infinite reverse;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-30px); }
        }

        .hero-content {
            position: relative;
            z-index: 1;
            text-align: center;
            max-width: 900px;
            animation: slideUpIn 1s ease-out;
        }

        @keyframes slideUpIn {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .profile-image {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 2rem;
            border: 3px solid var(--accent);
            box-shadow: 0 0 60px rgba(0, 255, 136, 0.3);
            animation: rotateIn 1s ease-out;
        }

        @keyframes rotateIn {
            from {
                opacity: 0;
                transform: rotate(-10deg) scale(0.8);
            }
            to {
                opacity: 1;
                transform: rotate(0) scale(1);
            }
        }

        .hero h1 {
            font-size: 4rem;
            font-weight: 900;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -2px;
        }

        .headline {
            font-size: 1.5rem;
            color: var(--text-secondary);
            margin-bottom: 2rem;
            font-weight: 300;
        }

        .hero-desc {
            font-size: 1.1rem;
            color: var(--text-secondary);
            margin-bottom: 3rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .social-links {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            margin-bottom: 3rem;
            animation: slideUpIn 1s ease-out 0.4s both;
        }

        .social-link {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
            text-decoration: none;
            transition: all 0.3s;
            font-size: 1.2rem;
        }

        .social-link:hover {
            background: linear-gradient(135deg, var(--accent) 0%, #00ccff 100%);
            border-color: var(--accent);
            color: var(--primary);
            transform: translateY(-8px);
            box-shadow: 0 12px 30px rgba(0, 255, 136, 0.4);
        }

        .cta-button {
            display: inline-block;
            padding: 1.2rem 3.5rem;
            background: linear-gradient(135deg, var(--accent) 0%, #00ccff 100%);
            color: var(--primary);
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
            letter-spacing: 1px;
            animation: slideUpIn 1s ease-out 0.6s both;
        }

        .cta-button:hover {
            transform: translateY(-5px);
            box-shadow: 0 25px 50px rgba(0, 255, 136, 0.5);
        }

        /* SECTIONS */
        section {
            padding: 80px 0;
            position: relative;
            z-index: 1;
        }

        .section-title {
            font-size: 2.5rem;
            font-weight: 900;
            margin-bottom: 3rem;
            text-align: center;
            position: relative;
            display: inline-block;
            width: 100%;
        }

        .section-title::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 4px;
            background: linear-gradient(90deg, var(--accent), transparent);
            border-radius: 2px;
        }

        /* ABOUT SECTION */
        .about-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
            margin-top: 3rem;
        }

        .about-text {
            font-size: 1.1rem;
            color: var(--text-secondary);
            line-height: 2;
            animation: slideInLeft 0.8s ease-out;
        }

        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-40px); }
            to { opacity: 1; transform: translateX(0); }
        }

        .stat-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            animation: slideInRight 0.8s ease-out;
        }

        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(40px); }
            to { opacity: 1; transform: translateX(0); }
        }

        .stat-item {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border);
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            transition: all 0.3s;
        }

        .stat-item:hover {
            background: rgba(0, 255, 136, 0.1);
            border-color: var(--accent);
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 255, 136, 0.2);
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 900;
            background: linear-gradient(135deg, var(--accent), #00ccff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .stat-label {
            color: var(--text-secondary);
            margin-top: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.9rem;
        }

        /* SKILLS SECTION */
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .skill-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border);
            padding: 2.5rem;
            border-radius: 16px;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .skill-card:hover {
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 204, 255, 0.05) 100%);
            border-color: var(--accent);
            transform: translateY(-12px);
            box-shadow: 0 20px 40px rgba(0, 255, 136, 0.2);
        }

        .skill-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--accent) 0%, #00ccff 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--primary);
        }

        .skill-name {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .skill-desc {
            color: var(--text-secondary);
            font-size: 0.95rem;
        }

        /* PROJECTS SECTION */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 3rem;
            margin-top: 3rem;
        }

        .project-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            animation: fadeInUp 0.6s ease-out;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .project-card:hover {
            border-color: var(--accent);
            transform: translateY(-15px);
            box-shadow: 0 30px 60px rgba(0, 255, 136, 0.3);
        }

        .project-image {
            width: 100%;
            height: 250px;
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 204, 255, 0.05));
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            position: relative;
            overflow: hidden;
        }

        .project-image::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, transparent 0%, rgba(0, 255, 136, 0.2) 100%);
            opacity: 0;
            transition: opacity 0.3s;
        }

        .project-card:hover .project-image::after {
            opacity: 1;
        }

        .project-content {
            padding: 2rem;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .project-title {
            font-size: 1.4rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }

        .project-desc {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
            flex: 1;
        }

        .project-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
            margin-bottom: 1.5rem;
        }

        .project-tag {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: rgba(0, 255, 136, 0.15);
            color: var(--accent);
            border-radius: 20px;
            font-size: 0.85rem;
            border: 1px solid rgba(0, 255, 136, 0.3);
        }

        .project-link {
            color: var(--accent);
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
        }

        .project-link:hover {
            color: #00ccff;
        }

        /* EXPERIENCE SECTION */
        .timeline {
            max-width: 800px;
            margin: 3rem auto;
            position: relative;
        }

        .timeline::before {
            content: '';
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 2px;
            height: 100%;
            background: linear-gradient(180deg, var(--accent) 0%, transparent 100%);
        }

        .timeline-item {
            margin-bottom: 3rem;
            animation: fadeInUp 0.6s ease-out;
        }

        .timeline-item:nth-child(odd) {
            text-align: right;
            padding-right: 50%;
            margin-right: 0;
        }

        .timeline-item:nth-child(even) {
            text-align: left;
            padding-left: 50%;
            margin-left: 0;
        }

        .timeline-dot {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 0;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, var(--accent), #00ccff);
            border-radius: 50%;
            border: 4px solid var(--primary);
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
        }

        .timeline-content {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border);
            padding: 1.5rem;
            border-radius: 12px;
            margin: 0 1rem;
            transition: all 0.3s;
        }

        .timeline-item:hover .timeline-content {
            border-color: var(--accent);
            background: rgba(0, 255, 136, 0.1);
        }

        .timeline-date {
            color: var(--accent);
            font-weight: 700;
            font-size: 0.9rem;
            text-transform: uppercase;
        }

        .timeline-title {
            font-size: 1.2rem;
            font-weight: 700;
            margin: 0.5rem 0;
        }

        .timeline-subtitle {
            color: var(--text-secondary);
            font-weight: 500;
            margin-bottom: 0.5rem;
        }

        .timeline-desc {
            color: var(--text-secondary);
            font-size: 0.95rem;
        }

        /* CONTACT SECTION */
        .contact-content {
            max-width: 600px;
            margin: 3rem auto;
            text-align: center;
        }

        .contact-desc {
            color: var(--text-secondary);
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }

        .contact-buttons {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .contact-btn {
            padding: 1rem 2.5rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 700;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .contact-btn.primary {
            background: linear-gradient(135deg, var(--accent), #00ccff);
            color: var(--primary);
        }

        .contact-btn.primary:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 255, 136, 0.4);
        }

        .contact-btn.secondary {
            background: rgba(255, 255, 255, 0.1);
            color: var(--accent);
            border: 2px solid var(--accent);
        }

        .contact-btn.secondary:hover {
            background: rgba(0, 255, 136, 0.15);
            transform: translateY(-5px);
        }

        /* FOOTER */
        .footer {
            padding: 3rem 0;
            border-top: 1px solid var(--border);
            text-align: center;
            color: var(--text-secondary);
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
            .nav-menu {
                gap: 1.5rem;
                font-size: 0.85rem;
            }

            .hero h1 {
                font-size: 2.5rem;
            }

            .about-content {
                grid-template-columns: 1fr;
                gap: 2rem;
            }

            .timeline::before {
                left: 10px;
            }

            .timeline-item:nth-child(odd),
            .timeline-item:nth-child(even) {
                text-align: left;
                padding-left: 50px;
                padding-right: 0;
            }

            .timeline-dot {
                left: 0;
            }

            .projects-grid {
                grid-template-columns: 1fr;
            }

            .contact-buttons {
                flex-direction: column;
            }

            .contact-btn {
                width: 100%;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar" id="navbar">
        <div class="container">
            <div class="nav-brand">${data.fullName}</div>
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#skills">Skills</a></li>
                ${data.projects && data.projects.length > 0 ? '<li><a href="#projects">Projects</a></li>' : ''}
                ${data.experience && data.experience.length > 0 ? '<li><a href="#experience">Experience</a></li>' : ''}
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <section id="home" class="hero">
        <div class="hero-content">
            ${data.profileImage ? '<img src="' + data.profileImage + '" alt="Profile" class="profile-image">' : '<div style="width:180px;height:180px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#00ccff);display:flex;align-items:center;justify-content:center;font-size:80px;margin-bottom:2rem;box-shadow:0 0 60px rgba(0,255,136,0.3);">👤</div>'}
            <h1>${data.fullName}</h1>
            <p class="headline">${data.headline}</p>
            ${data.about ? '<p class="hero-desc">' + data.about + '</p>' : ''}
            <div class="social-links">
                ${(data.socialLinks || []).map(link => '<a href="' + link.url + '" class="social-link" title="' + link.platform + '" target="_blank"><i class="fab fa-' + link.platform.toLowerCase() + '"></i></a>').join('')}
            </div>
            <a href="#projects" class="cta-button">View My Work</a>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <div class="about-text">
                    ${data.about ? '<p>' + data.about + '</p>' : '<p>Passionate professional with expertise in creating innovative solutions and delivering excellence.</p>'}
                </div>
                <div class="stat-grid">
                    <div class="stat-item">
                        <div class="stat-number">${(data.projects || []).length}+</div>
                        <div class="stat-label">Projects</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${(data.experience || []).length}+</div>
                        <div class="stat-label">Experiences</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${(data.skills || []).length}+</div>
                        <div class="stat-label">Skills</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">100%</div>
                        <div class="stat-label">Dedication</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="skills" class="skills">
        <div class="container">
            <h2 class="section-title">Skills & Expertise</h2>
            <div class="skills-grid">
                ${(data.skills || []).slice(0, 6).map(skill => '<div class="skill-card"><div class="skill-icon">💻</div><div class="skill-name">' + skill + '</div><div class="skill-desc">Expert-level proficiency and practical experience</div></div>').join('')}
            </div>
        </div>
    </section>

    ${(data.projects && data.projects.length > 0) ? `
    <section id="projects" class="projects">
        <div class="container">
            <h2 class="section-title">Featured Projects</h2>
            <div class="projects-grid">
                ${(data.projects || []).slice(0, 6).map(project => '<div class="project-card"><div class="project-image">🚀</div><div class="project-content"><h3 class="project-title">' + (project.title || 'Project') + '</h3><p class="project-desc">' + (project.description || 'An innovative project demonstrating technical excellence.') + '</p><div class="project-tags">' + ((project.technologies || ['Web', 'Development']).slice(0, 3).map(tag => '<span class="project-tag">' + tag + '</span>').join('')) + '</div>' + (project.liveUrl ? '<a href="' + project.liveUrl + '" class="project-link" target="_blank">View Project →</a>' : '<span class="project-link">Learn More →</span>') + '</div></div>').join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${(data.experience && data.experience.length > 0) ? `
    <section id="experience" class="experience">
        <div class="container">
            <h2 class="section-title">Professional Experience</h2>
            <div class="timeline">
                ${(data.experience || []).map(exp => '<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-date">' + (exp.startDate || '') + ' - ' + (exp.endDate || 'Present') + '</div><div class="timeline-title">' + (exp.title || '') + '</div><div class="timeline-subtitle">' + (exp.company || '') + '</div><div class="timeline-desc">' + (exp.description || 'Contributed to key projects and achievements') + '</div></div></div>').join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-content">
                <p class="contact-desc">
                    Interested in collaborating? Let's connect and create something amazing together.
                </p>
                <div class="contact-buttons">
                    ${data.email ? '<a href="mailto:' + data.email + '" class="contact-btn primary">Send Email</a>' : ''}
                    ${data.phone ? '<a href="tel:' + data.phone + '" class="contact-btn secondary">Call Me</a>' : ''}
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${data.fullName}. All rights reserved. Crafted with precision and passion.</p>
        </div>
    </footer>

    <script>
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    </script>
</body>
</html>`;
  
  return htmlContent;
};
