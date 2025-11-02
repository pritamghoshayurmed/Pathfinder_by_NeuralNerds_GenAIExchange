import { PortfolioData } from '@/types/portfolio';

/**
 * PREMIUM PORTFOLIO TEMPLATE 3: Neon Cyberpunk
 * Bold neon colors, cyberpunk aesthetic with premium dark mode
 */
export const generatePremiumNeonCyberpunk = (data: PortfolioData): string => {
  const accentColor = data.accentColor || '#00ffff';
  
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Neon Portfolio</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-dark: #0a0e27;
            --bg-darker: #050810;
            --accent: ${accentColor};
            --accent-alt: #ff006e;
            --text-primary: #ffffff;
            --text-secondary: #a0a0c0;
            --neon-glow: rgba(0, 255, 255, 0.3);
        }

        html { scroll-behavior: smooth; }

        body {
            font-family: 'Courier New', monospace;
            background: linear-gradient(135deg, var(--bg-darker) 0%, var(--bg-dark) 100%);
            color: var(--text-primary);
            line-height: 1.6;
            min-height: 100vh;
            overflow-x: hidden;
        }

        .scanlines {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                rgba(255, 0, 255, 0.03),
                rgba(255, 0, 255, 0.03) 1px,
                transparent 1px,
                transparent 2px
            );
            pointer-events: none;
            z-index: -1;
        }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        /* NAVBAR */
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(10, 14, 39, 0.8);
            backdrop-filter: blur(10px);
            border-bottom: 2px solid var(--accent);
            padding: 1.2rem 0;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
            transition: all 0.3s;
        }

        .navbar.scrolled {
            background: rgba(10, 14, 39, 0.95);
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.4);
        }

        .navbar .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .nav-brand {
            font-size: 1.6rem;
            font-weight: 900;
            color: var(--accent);
            letter-spacing: 3px;
            text-shadow: 0 0 10px var(--neon-glow), 0 0 20px var(--neon-glow);
            animation: neonFlicker 0.15s infinite;
        }

        @keyframes neonFlicker {
            0%, 100% { text-shadow: 0 0 10px var(--neon-glow), 0 0 20px var(--neon-glow); }
            50% { text-shadow: 0 0 5px var(--neon-glow); }
        }

        .nav-menu {
            display: flex;
            list-style: none;
            gap: 2.5rem;
        }

        .nav-menu a {
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 2px;
            position: relative;
            transition: all 0.3s;
        }

        .nav-menu a::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--accent);
            transition: width 0.3s;
            box-shadow: 0 0 10px var(--accent);
        }

        .nav-menu a:hover {
            color: var(--accent);
            text-shadow: 0 0 10px var(--accent);
        }

        .nav-menu a:hover::after {
            width: 100%;
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
            border-bottom: 2px solid var(--accent);
            box-shadow: inset 0 0 40px rgba(0, 255, 255, 0.1);
        }

        .hero::before {
            content: '';
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.2) 0%, transparent 70%);
            border-radius: 50%;
            top: -300px;
            right: -300px;
            animation: pulse 4s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 1; }
        }

        .hero-content {
            position: relative;
            z-index: 1;
            text-align: center;
            max-width: 900px;
        }

        .profile-image {
            width: 150px;
            height: 150px;
            border-radius: 0;
            object-fit: cover;
            margin-bottom: 2rem;
            border: 3px solid var(--accent);
            box-shadow: 0 0 30px var(--accent), inset 0 0 20px rgba(0, 255, 255, 0.2);
            animation: glitch 0.3s infinite;
        }

        @keyframes glitch {
            0%, 100% { transform: translate(0); }
            25% { transform: translate(-2px, 2px); }
            50% { transform: translate(2px, -2px); }
            75% { transform: translate(-2px, -2px); }
        }

        .hero h1 {
            font-size: 3.5rem;
            font-weight: 900;
            margin-bottom: 1rem;
            letter-spacing: 3px;
            color: var(--accent);
            text-shadow: 0 0 30px var(--accent), 0 0 60px var(--accent-alt);
            animation: slideIn 1s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-40px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .headline {
            font-size: 1.3rem;
            color: var(--accent-alt);
            margin-bottom: 1.5rem;
            font-weight: 700;
            letter-spacing: 2px;
            text-shadow: 0 0 10px var(--accent-alt);
        }

        .hero-desc {
            font-size: 0.95rem;
            color: var(--text-secondary);
            margin-bottom: 3rem;
            max-width: 550px;
            margin-left: auto;
            margin-right: auto;
        }

        .social-links {
            display: flex;
            gap: 2rem;
            justify-content: center;
            margin-bottom: 3rem;
        }

        .social-link {
            width: 50px;
            height: 50px;
            border-radius: 0;
            background: transparent;
            border: 2px solid var(--accent);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--accent);
            text-decoration: none;
            transition: all 0.3s;
            font-size: 1.1rem;
            box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.1);
            position: relative;
        }

        .social-link::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.2), transparent);
            opacity: 0;
            transition: opacity 0.3s;
        }

        .social-link:hover {
            border-color: var(--accent-alt);
            color: var(--accent-alt);
            text-shadow: 0 0 20px var(--accent-alt);
            box-shadow: 0 0 20px var(--accent-alt), inset 0 0 10px rgba(255, 0, 110, 0.2);
            transform: scale(1.1);
        }

        .cta-button {
            display: inline-block;
            padding: 1rem 3rem;
            background: transparent;
            color: var(--accent);
            text-decoration: none;
            border: 2px solid var(--accent);
            font-weight: 700;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-size: 0.9rem;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        }

        .cta-button::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--accent);
            z-index: -1;
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.3s;
        }

        .cta-button:hover {
            color: var(--bg-dark);
            text-shadow: none;
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.6);
        }

        .cta-button:hover::before {
            transform: scaleX(1);
        }

        /* SECTIONS */
        section {
            padding: 80px 0;
            position: relative;
            z-index: 1;
            border-top: 1px solid rgba(0, 255, 255, 0.2);
        }

        .section-title {
            font-size: 2.5rem;
            font-weight: 900;
            margin-bottom: 3rem;
            text-align: center;
            letter-spacing: 3px;
            color: var(--accent);
            text-shadow: 0 0 20px var(--accent);
        }

        /* CARDS */
        .card {
            background: transparent;
            border: 2px solid var(--accent);
            padding: 2rem;
            border-radius: 0;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
            box-shadow: inset 0 0 20px rgba(0, 255, 255, 0.05);
        }

        .card::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.1), transparent);
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 1;
        }

        .card:hover {
            border-color: var(--accent-alt);
            box-shadow: 0 0 30px var(--accent-alt), inset 0 0 20px rgba(255, 0, 110, 0.1);
            transform: translateY(-8px);
        }

        .card:hover::before {
            opacity: 1;
        }

        .card > * { position: relative; z-index: 2; }

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
            line-height: 1.8;
        }

        .stat-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }

        .stat-item {
            background: transparent;
            border: 2px solid var(--accent);
            padding: 2rem;
            text-align: center;
            transition: all 0.3s;
            box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.05);
        }

        .stat-item:hover {
            border-color: var(--accent-alt);
            box-shadow: 0 0 20px var(--accent-alt);
        }

        .stat-number {
            font-size: 2rem;
            font-weight: 900;
            color: var(--accent);
            text-shadow: 0 0 10px var(--accent);
        }

        .stat-label {
            color: var(--text-secondary);
            margin-top: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.8rem;
        }

        /* SKILLS */
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .skill-card {
            background: transparent;
            border: 2px solid var(--accent);
            padding: 2.5rem;
            transition: all 0.3s;
            box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.05);
            animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .skill-card:hover {
            border-color: var(--accent-alt);
            box-shadow: 0 0 20px var(--accent-alt);
            transform: translateY(-10px);
        }

        .skill-icon {
            font-size: 1.8rem;
            margin-bottom: 1rem;
            filter: drop-shadow(0 0 10px var(--accent));
        }

        .skill-name {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: var(--accent);
            text-shadow: 0 0 10px var(--accent);
        }

        .skill-desc {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }

        /* PROJECTS */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .project-card {
            background: transparent;
            border: 2px solid var(--accent);
            border-radius: 0;
            overflow: hidden;
            transition: all 0.3s;
            animation: fadeInUp 0.6s ease-out;
            display: flex;
            flex-direction: column;
            height: 100%;
            box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.05);
        }

        .project-card:hover {
            border-color: var(--accent-alt);
            box-shadow: 0 0 30px var(--accent-alt), inset 0 0 10px rgba(255, 0, 110, 0.1);
            transform: translateY(-12px);
        }

        .project-image {
            width: 100%;
            height: 200px;
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 110, 0.05));
            border-bottom: 2px solid var(--accent);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
        }

        .project-content {
            padding: 1.5rem;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .project-title {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 0.8rem;
            color: var(--accent);
        }

        .project-desc {
            color: var(--text-secondary);
            margin-bottom: 1rem;
            flex: 1;
            font-size: 0.9rem;
        }

        .project-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.6rem;
            margin-bottom: 1rem;
        }

        .project-tag {
            padding: 0.3rem 0.8rem;
            background: transparent;
            color: var(--accent);
            border: 1px solid var(--accent);
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .project-link {
            color: var(--accent-alt);
            text-decoration: none;
            font-weight: 700;
            transition: all 0.3s;
        }

        .project-link:hover {
            color: var(--accent);
            text-shadow: 0 0 10px var(--accent);
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
            box-shadow: 0 0 20px var(--accent);
        }

        .timeline-item {
            margin-bottom: 2rem;
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
            width: 16px;
            height: 16px;
            background: var(--accent);
            border: 2px solid var(--bg-dark);
            box-shadow: 0 0 20px var(--accent);
        }

        .timeline-content {
            background: transparent;
            border: 2px solid var(--accent);
            padding: 1.5rem;
            margin: 0 1rem;
            transition: all 0.3s;
            box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.05);
        }

        .timeline-item:hover .timeline-content {
            border-color: var(--accent-alt);
            box-shadow: 0 0 20px var(--accent-alt);
        }

        .timeline-date {
            color: var(--accent-alt);
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 1px;
        }

        .timeline-title {
            font-size: 1rem;
            font-weight: 700;
            margin: 0.5rem 0;
            color: var(--accent);
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
            padding: 1rem 2rem;
            text-decoration: none;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.85rem;
        }

        .contact-btn.primary {
            background: var(--accent);
            color: var(--bg-dark);
            border: 2px solid var(--accent);
            box-shadow: 0 0 20px var(--accent);
        }

        .contact-btn.primary:hover {
            box-shadow: 0 0 40px var(--accent), inset 0 0 10px var(--accent);
            transform: scale(1.05);
        }

        .contact-btn.secondary {
            background: transparent;
            color: var(--accent-alt);
            border: 2px solid var(--accent-alt);
            box-shadow: 0 0 10px var(--accent-alt);
        }

        .contact-btn.secondary:hover {
            box-shadow: 0 0 30px var(--accent-alt);
            transform: scale(1.05);
        }

        /* FOOTER */
        .footer {
            padding: 2rem 0;
            border-top: 2px solid var(--accent);
            text-align: center;
            color: var(--text-secondary);
            font-size: 0.85rem;
        }

        @media (max-width: 768px) {
            .nav-menu { gap: 1.5rem; }
            .hero h1 { font-size: 2rem; }
            .about-content { grid-template-columns: 1fr; }
            .projects-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="scanlines"></div>

    <nav class="navbar" id="navbar">
        <div class="container">
            <div class="nav-brand">[ ${data.fullName} ]</div>
            <ul class="nav-menu">
                <li><a href="#home">HOME</a></li>
                <li><a href="#about">ABOUT</a></li>
                <li><a href="#skills">SKILLS</a></li>
                ${data.projects && data.projects.length > 0 ? '<li><a href="#projects">PROJECTS</a></li>' : ''}
                ${data.experience && data.experience.length > 0 ? '<li><a href="#experience">EXPERIENCE</a></li>' : ''}
                <li><a href="#contact">CONTACT</a></li>
            </ul>
        </div>
    </nav>

    <section id="home" class="hero">
        <div class="hero-content">
            ${data.profileImage ? '<img src="' + data.profileImage + '" alt="Profile" class="profile-image">' : '<div style="width:150px;height:150px;border:3px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:60px;margin-bottom:2rem;box-shadow:0 0 30px var(--accent);">👤</div>'}
            <h1>[ ${data.fullName} ]</h1>
            <p class="headline">> ${data.headline}</p>
            ${data.about ? '<p class="hero-desc">' + data.about + '</p>' : ''}
            <div class="social-links">
                ${(data.socialLinks || []).map(link => '<a href="' + link.url + '" class="social-link" title="' + link.platform + '" target="_blank"><i class="fab fa-' + link.platform.toLowerCase() + '"></i></a>').join('')}
            </div>
            <a href="#projects" class="cta-button">[ View Work ]</a>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2 class="section-title">> ABOUT ME</h2>
            <div class="about-content">
                <div class="about-text">${data.about ? '<p>' + data.about + '</p>' : '<p>Professional with innovative mindset.</p>'}</div>
                <div class="stat-grid">
                    <div class="stat-item">
                        <div class="stat-number">${(data.projects || []).length}</div>
                        <div class="stat-label">Projects</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${(data.experience || []).length}</div>
                        <div class="stat-label">Experiences</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="skills" class="skills">
        <div class="container">
            <h2 class="section-title">> SKILLS & EXPERTISE</h2>
            <div class="skills-grid">
                ${(data.skills || []).slice(0, 6).map(skill => '<div class="skill-card"><div class="skill-icon">⚡</div><div class="skill-name">' + skill + '</div><div class="skill-desc">Expert Level</div></div>').join('')}
            </div>
        </div>
    </section>

    ${(data.projects && data.projects.length > 0) ? '<section id="projects" class="projects"><div class="container"><h2 class="section-title">> FEATURED PROJECTS</h2><div class="projects-grid">' + (data.projects || []).slice(0, 6).map(project => '<div class="project-card"><div class="project-image">🚀</div><div class="project-content"><h3 class="project-title">' + (project.title || 'Project') + '</h3><p class="project-desc">' + (project.description || 'Innovative project') + '</p><div class="project-tags">' + ((project.technologies || ['Web']).slice(0, 3).map(tag => '<span class="project-tag">' + tag + '</span>').join('')) + '</div>' + (project.liveUrl ? '<a href="' + project.liveUrl + '" class="project-link" target="_blank">[ View ]</a>' : '') + '</div></div>').join('') + '</div></div></section>' : ''}

    ${(data.experience && data.experience.length > 0) ? '<section id="experience" class="experience"><div class="container"><h2 class="section-title">> EXPERIENCE</h2><div class="timeline">' + (data.experience || []).map(exp => '<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-date">' + (exp.startDate || '') + ' - ' + (exp.endDate || 'Present') + '</div><div class="timeline-title">' + (exp.title || '') + '</div><div class="timeline-subtitle">@ ' + (exp.company || '') + '</div><div class="timeline-desc">' + (exp.description || 'Key contributions') + '</div></div></div>').join('') + '</div></div></section>' : ''}

    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">> GET IN TOUCH</h2>
            <div class="contact-content">
                <p class="contact-desc">> Initialize connection protocol...</p>
                <div class="contact-buttons">
                    ${data.email ? '<a href="mailto:' + data.email + '" class="contact-btn primary">[ Send Email ]</a>' : ''}
                    ${data.phone ? '<a href="tel:' + data.phone + '" class="contact-btn secondary">[ Call Now ]</a>' : ''}
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <p>&copy; 2024 ${data.fullName} | All systems operational</p>
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
