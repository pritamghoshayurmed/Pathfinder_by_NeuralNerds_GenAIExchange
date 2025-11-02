import { PortfolioData } from '@/types/portfolio';

/**
 * PREMIUM PORTFOLIO TEMPLATE 5: Neumorphic Pro
 * Soft neumorphism with depth and shadow effects
 */
export const generatePremiumNeumorphicPro = (data: PortfolioData): string => {
  const accentColor = data.accentColor || '#10b981';
  
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Neumorphic Portfolio</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg: #e4e9f0;
            --bg-dark: #d1d5e0;
            --shadow-dark: rgba(0, 0, 0, 0.2);
            --shadow-light: rgba(255, 255, 255, 0.8);
            --accent: ${accentColor};
            --text-primary: #2d3748;
            --text-secondary: #718096;
        }

        html { scroll-behavior: smooth; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, var(--bg) 0%, var(--bg-dark) 100%);
            color: var(--text-primary);
            line-height: 1.6;
            min-height: 100vh;
        }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        /* NAVBAR - Neumorphic */
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: var(--bg);
            padding: 1rem 0;
            box-shadow: -5px 8px 16px var(--shadow-dark), 5px -8px 16px var(--shadow-light);
            transition: all 0.3s ease;
        }

        .navbar.scrolled {
            box-shadow: -5px 12px 20px var(--shadow-dark), 5px -12px 20px var(--shadow-light);
        }

        .navbar .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .nav-brand {
            font-size: 1.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, var(--accent), #34d399);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.5px;
        }

        .nav-menu {
            display: flex;
            list-style: none;
            gap: 3rem;
        }

        .nav-menu a {
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
            font-size: 0.9rem;
        }

        .nav-menu a:hover {
            color: var(--accent);
        }

        /* HERO */
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-top: 80px;
            position: relative;
            overflow: hidden;
        }

        .hero-content {
            position: relative;
            z-index: 1;
            text-align: center;
            max-width: 900px;
            animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .profile-image {
            width: 170px;
            height: 170px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 2.5rem;
            box-shadow: 
                -8px 12px 24px var(--shadow-dark),
                8px -12px 24px var(--shadow-light),
                inset -3px 4px 8px var(--shadow-dark),
                inset 3px -4px 8px var(--shadow-light);
            animation: slideDown 0.8s ease-out;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .hero h1 {
            font-size: 3.5rem;
            font-weight: 900;
            margin-bottom: 1rem;
            letter-spacing: -1px;
            color: var(--text-primary);
        }

        .headline {
            font-size: 1.3rem;
            color: var(--accent);
            margin-bottom: 1.5rem;
            font-weight: 600;
        }

        .hero-desc {
            font-size: 1rem;
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
        }

        .social-link {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--bg);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--accent);
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            font-size: 1.1rem;
            box-shadow: -5px 8px 16px var(--shadow-dark), 5px -8px 16px var(--shadow-light);
        }

        .social-link:hover {
            color: var(--bg);
            background: linear-gradient(135deg, var(--accent), #34d399);
            transform: translateY(-8px);
            box-shadow: -8px 12px 20px var(--shadow-dark), 8px -12px 20px var(--shadow-light);
        }

        .cta-button {
            display: inline-block;
            padding: 1.2rem 3.5rem;
            background: linear-gradient(135deg, var(--accent), #34d399);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            overflow: hidden;
            letter-spacing: 1px;
            box-shadow: -5px 8px 16px var(--shadow-dark), 5px -8px 16px var(--shadow-light);
            border: none;
        }

        .cta-button:hover {
            transform: translateY(-5px);
            box-shadow: -8px 12px 24px var(--shadow-dark), 8px -12px 24px var(--shadow-light);
        }

        /* SECTIONS */
        section {
            padding: 80px 0;
            position: relative;
            z-index: 1;
        }

        .section-title {
            font-size: 2.8rem;
            font-weight: 900;
            margin-bottom: 3rem;
            text-align: center;
            color: var(--text-primary);
        }

        .section-title::after {
            content: '';
            display: block;
            width: 120px;
            height: 4px;
            background: linear-gradient(90deg, var(--accent), transparent);
            margin: 1rem auto 0;
            border-radius: 2px;
        }

        /* NEUMORPHIC CARD */
        .card {
            background: var(--bg);
            padding: 2rem;
            border-radius: 20px;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: -5px 8px 16px var(--shadow-dark), 5px -8px 16px var(--shadow-light);
        }

        .card:hover {
            box-shadow: -8px 12px 24px var(--shadow-dark), 8px -12px 24px var(--shadow-light);
            transform: translateY(-8px);
        }

        .card.pressed {
            box-shadow: inset -3px 4px 8px var(--shadow-dark), inset 3px -4px 8px var(--shadow-light);
        }

        /* ABOUT */
        .about-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            margin-top: 3rem;
        }

        .about-text {
            font-size: 1rem;
            color: var(--text-secondary);
            line-height: 1.9;
        }

        .stat-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }

        .stat-item {
            background: var(--bg);
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            transition: all 0.3s;
            box-shadow: -5px 8px 16px var(--shadow-dark), 5px -8px 16px var(--shadow-light);
        }

        .stat-item:hover {
            transform: translateY(-8px);
            box-shadow: -8px 12px 24px var(--shadow-dark), 8px -12px 24px var(--shadow-light);
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 900;
            color: var(--accent);
        }

        .stat-label {
            color: var(--text-secondary);
            margin-top: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.85rem;
        }

        /* SKILLS */
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .skill-card {
            background: var(--bg);
            padding: 2.5rem;
            border-radius: 20px;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: -5px 8px 16px var(--shadow-dark), 5px -8px 16px var(--shadow-light);
            animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .skill-card:hover {
            transform: translateY(-12px);
            box-shadow: -8px 12px 24px var(--shadow-dark), 8px -12px 24px var(--shadow-light);
        }

        .skill-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--accent), #34d399);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: white;
            box-shadow: -3px 5px 10px var(--shadow-dark), 3px -5px 10px var(--shadow-light);
        }

        .skill-name {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }

        .skill-desc {
            color: var(--text-secondary);
            font-size: 0.95rem;
        }

        /* PROJECTS */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2.5rem;
            margin-top: 3rem;
        }

        .project-card {
            background: var(--bg);
            border-radius: 20px;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            animation: fadeInUp 0.6s ease-out;
            display: flex;
            flex-direction: column;
            height: 100%;
            box-shadow: -5px 8px 16px var(--shadow-dark), 5px -8px 16px var(--shadow-light);
        }

        .project-card:hover {
            transform: translateY(-15px);
            box-shadow: -8px 12px 24px var(--shadow-dark), 8px -12px 24px var(--shadow-light);
        }

        .project-image {
            width: 100%;
            height: 250px;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.1));
            border-bottom: 2px solid rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
        }

        .project-content {
            padding: 2rem;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .project-title {
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }

        .project-desc {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
            flex: 1;
            font-size: 0.95rem;
        }

        .project-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
            margin-bottom: 1.5rem;
        }

        .project-tag {
            display: inline-block;
            padding: 0.5rem 1.2rem;
            background: var(--bg-dark);
            color: var(--accent);
            border-radius: 20px;
            font-size: 0.85rem;
            box-shadow: -3px 4px 8px var(--shadow-dark), 3px -4px 8px var(--shadow-light);
        }

        .project-link {
            color: var(--accent);
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
        }

        .project-link:hover {
            color: #34d399;
        }

        /* TIMELINE */
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
            background: var(--accent);
            box-shadow: -2px 0 8px var(--shadow-dark), 2px 0 8px var(--shadow-light);
        }

        .timeline-item {
            margin-bottom: 3rem;
            animation: fadeInUp 0.6s ease-out;
        }

        .timeline-item:nth-child(odd) {
            text-align: right;
            padding-right: 50%;
        }

        .timeline-item:nth-child(even) {
            text-align: left;
            padding-left: 50%;
        }

        .timeline-dot {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 0;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, var(--accent), #34d399);
            border-radius: 50%;
            border: 4px solid var(--bg);
            box-shadow: -3px 5px 10px var(--shadow-dark), 3px -5px 10px var(--shadow-light);
        }

        .timeline-content {
            background: var(--bg);
            padding: 1.5rem;
            border-radius: 15px;
            margin: 0 1rem;
            transition: all 0.3s;
            box-shadow: -5px 8px 16px var(--shadow-dark), 5px -8px 16px var(--shadow-light);
        }

        .timeline-item:hover .timeline-content {
            transform: translateY(-5px);
            box-shadow: -8px 12px 24px var(--shadow-dark), 8px -12px 24px var(--shadow-light);
        }

        .timeline-date {
            color: var(--accent);
            font-weight: 700;
            font-size: 0.85rem;
            text-transform: uppercase;
        }

        .timeline-title {
            font-size: 1.1rem;
            font-weight: 700;
            margin: 0.5rem 0;
            color: var(--text-primary);
        }

        .timeline-subtitle {
            color: var(--text-secondary);
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .timeline-desc {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }

        /* CONTACT */
        .contact-content {
            max-width: 600px;
            margin: 3rem auto;
            text-align: center;
        }

        .contact-desc {
            color: var(--text-secondary);
            margin-bottom: 2rem;
            font-size: 1rem;
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
            border: none;
        }

        .contact-btn.primary {
            background: linear-gradient(135deg, var(--accent), #34d399);
            color: white;
            box-shadow: -5px 8px 16px var(--shadow-dark), 5px -8px 16px var(--shadow-light);
        }

        .contact-btn.primary:hover {
            transform: translateY(-5px);
            box-shadow: -8px 12px 24px var(--shadow-dark), 8px -12px 24px var(--shadow-light);
        }

        .contact-btn.secondary {
            background: var(--bg);
            color: var(--accent);
            box-shadow: -5px 8px 16px var(--shadow-dark), 5px -8px 16px var(--shadow-light);
            border: 2px solid var(--accent);
        }

        .contact-btn.secondary:hover {
            transform: translateY(-5px);
            box-shadow: -8px 12px 24px var(--shadow-dark), 8px -12px 24px var(--shadow-light);
        }

        /* FOOTER */
        .footer {
            padding: 3rem 0;
            text-align: center;
            color: var(--text-secondary);
            border-top: 2px solid rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
            .hero h1 { font-size: 2.3rem; }
            .about-content { grid-template-columns: 1fr; }
            .projects-grid { grid-template-columns: 1fr; }
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
            ${data.profileImage ? '<img src="' + data.profileImage + '" alt="Profile" class="profile-image">' : '<div style="width:170px;height:170px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:70px;margin-bottom:2.5rem;box-shadow:-8px 12px 24px rgba(0,0,0,0.2),8px -12px 24px rgba(255,255,255,0.8);">👤</div>'}
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
                <div class="about-text">${data.about ? '<p>' + data.about + '</p>' : ''}</div>
                <div class="stat-grid">
                    <div class="stat-item">
                        <div class="stat-number">${(data.projects || []).length}+</div>
                        <div class="stat-label">Projects</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${(data.experience || []).length}+</div>
                        <div class="stat-label">Experience</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="skills" class="skills">
        <div class="container">
            <h2 class="section-title">Skills & Expertise</h2>
            <div class="skills-grid">
                ${(data.skills || []).slice(0, 6).map(skill => '<div class="skill-card"><div class="skill-icon">💻</div><div class="skill-name">' + skill + '</div><div class="skill-desc">Expert proficiency</div></div>').join('')}
            </div>
        </div>
    </section>

    ${(data.projects && data.projects.length > 0) ? '<section id="projects" class="projects"><div class="container"><h2 class="section-title">Featured Projects</h2><div class="projects-grid">' + (data.projects || []).slice(0, 6).map(project => '<div class="project-card"><div class="project-image">🚀</div><div class="project-content"><h3 class="project-title">' + (project.title || 'Project') + '</h3><p class="project-desc">' + (project.description || 'Innovative project') + '</p><div class="project-tags">' + ((project.technologies || []).slice(0, 3).map(tag => '<span class="project-tag">' + tag + '</span>').join('')) + '</div>' + (project.liveUrl ? '<a href="' + project.liveUrl + '" class="project-link" target="_blank">View Project →</a>' : '') + '</div></div>').join('') + '</div></div></section>' : ''}

    ${(data.experience && data.experience.length > 0) ? '<section id="experience" class="experience"><div class="container"><h2 class="section-title">Professional Experience</h2><div class="timeline">' + (data.experience || []).map(exp => '<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-date">' + (exp.startDate || '') + ' - ' + (exp.endDate || 'Present') + '</div><div class="timeline-title">' + (exp.title || '') + '</div><div class="timeline-subtitle">' + (exp.company || '') + '</div><div class="timeline-desc">' + (exp.description || '') + '</div></div></div>').join('') + '</div></div></section>' : ''}

    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-content">
                <p class="contact-desc">Let's collaborate on amazing projects!</p>
                <div class="contact-buttons">
                    ${data.email ? '<a href="mailto:' + data.email + '" class="contact-btn primary">Send Email</a>' : ''}
                    ${data.phone ? '<a href="tel:' + data.phone + '" class="contact-btn secondary">Call Me</a>' : ''}
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <p>&copy; 2024 ${data.fullName}. All rights reserved.</p>
    </footer>

    <script>
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
            });
        });
    </script>
</body>
</html>`;

  return htmlContent;
};
