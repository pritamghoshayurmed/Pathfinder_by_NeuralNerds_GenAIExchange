import { PortfolioData } from '@/types/portfolio';

/**
 * PREMIUM PORTFOLIO TEMPLATE 2: Glassmorphism Chic
 * Modern glassmorphism with blur effects and premium animations
 */
export const generatePremiumGlassmorphism = (data: PortfolioData): string => {
  const accentColor = data.accentColor || '#ff00ff';
  
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Premium Glassmorphism Portfolio</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #0f0f23;
            --secondary: #1a1a3f;
            --accent: ${accentColor};
            --text-primary: #ffffff;
            --text-secondary: #b0b0c0;
            --glass: rgba(255, 255, 255, 0.1);
            --glass-border: rgba(255, 255, 255, 0.2);
        }

        html { scroll-behavior: smooth; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: var(--text-primary);
            line-height: 1.6;
            min-height: 100vh;
            overflow-x: hidden;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* NAVBAR - Glassmorphic */
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(15, 15, 35, 0.7);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--glass-border);
            padding: 1.2rem 0;
            transition: all 0.3s ease;
        }

        .navbar.scrolled {
            background: rgba(15, 15, 35, 0.9);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .navbar .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .nav-brand {
            font-size: 1.6rem;
            font-weight: 800;
            background: linear-gradient(135deg, var(--accent), #00ff88);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -1px;
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
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 1.5px;
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

        .hero::before {
            content: '';
            position: absolute;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(255, 0, 255, 0.2) 0%, transparent 70%);
            border-radius: 50%;
            top: -200px;
            right: -100px;
            animation: float 6s ease-in-out infinite;
        }

        .hero::after {
            content: '';
            position: absolute;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(0, 255, 136, 0.15) 0%, transparent 70%);
            border-radius: 50%;
            bottom: -100px;
            left: 5%;
            animation: float 8s ease-in-out infinite reverse;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-40px); }
        }

        .hero-content {
            position: relative;
            z-index: 1;
            text-align: center;
            max-width: 900px;
        }

        .profile-image {
            width: 160px;
            height: 160px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 2.5rem;
            border: 2px solid var(--glass-border);
            box-shadow: 0 8px 32px rgba(255, 0, 255, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1);
            animation: slideDown 0.8s ease-out;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-40px);
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
            letter-spacing: -1.5px;
            line-height: 1.2;
            animation: slideDown 0.8s ease-out 0.2s both;
        }

        .headline {
            font-size: 1.4rem;
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
            font-weight: 300;
            animation: slideDown 0.8s ease-out 0.4s both;
        }

        .hero-desc {
            font-size: 1rem;
            color: var(--text-secondary);
            margin-bottom: 3rem;
            max-width: 550px;
            margin-left: auto;
            margin-right: auto;
            animation: slideDown 0.8s ease-out 0.6s both;
        }

        .social-links {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            margin-bottom: 3rem;
            animation: slideDown 0.8s ease-out 0.8s both;
        }

        .social-link {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--glass);
            border: 2px solid var(--glass-border);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            font-size: 1.1rem;
            backdrop-filter: blur(10px);
        }

        .social-link:hover {
            background: rgba(255, 0, 255, 0.2);
            border-color: var(--accent);
            color: var(--accent);
            transform: translateY(-10px) scale(1.1);
            box-shadow: 0 12px 24px rgba(255, 0, 255, 0.3);
        }

        .cta-button {
            display: inline-block;
            padding: 1.2rem 3.5rem;
            background: linear-gradient(135deg, var(--accent), #00ff88);
            color: #000;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
            letter-spacing: 1px;
            animation: slideDown 0.8s ease-out 1s both;
            box-shadow: 0 10px 30px rgba(255, 0, 255, 0.3);
        }

        .cta-button:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 50px rgba(255, 0, 255, 0.5);
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
            position: relative;
            width: 100%;
        }

        .section-title::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 120px;
            height: 4px;
            background: linear-gradient(90deg, var(--accent), transparent);
            border-radius: 2px;
        }

        /* CARDS - Glassmorphic */
        .card {
            background: var(--glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            padding: 2rem;
            border-radius: 20px;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .card:hover {
            background: rgba(255, 0, 255, 0.15);
            border-color: rgba(255, 0, 255, 0.5);
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(255, 0, 255, 0.2);
        }

        /* ABOUT */
        .about-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            margin-top: 3rem;
        }

        .about-text {
            font-size: 1.05rem;
            color: var(--text-secondary);
            line-height: 1.9;
        }

        .stat-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }

        .stat-item {
            background: var(--glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            transition: all 0.3s;
        }

        .stat-item:hover {
            background: rgba(255, 0, 255, 0.15);
            border-color: rgba(255, 0, 255, 0.5);
            transform: translateY(-8px);
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 900;
            background: linear-gradient(135deg, var(--accent), #00ff88);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
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
            background: var(--glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            padding: 2.5rem;
            border-radius: 20px;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .skill-card:hover {
            background: rgba(255, 0, 255, 0.15);
            border-color: rgba(255, 0, 255, 0.5);
            transform: translateY(-12px);
            box-shadow: 0 20px 40px rgba(255, 0, 255, 0.2);
        }

        .skill-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--accent), #00ff88);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #000;
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

        /* PROJECTS */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 3rem;
            margin-top: 3rem;
        }

        .project-card {
            background: var(--glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            animation: fadeIn 0.6s ease-out;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .project-card:hover {
            border-color: rgba(255, 0, 255, 0.5);
            transform: translateY(-15px);
            box-shadow: 0 30px 60px rgba(255, 0, 255, 0.25);
        }

        .project-image {
            width: 100%;
            height: 250px;
            background: linear-gradient(135deg, rgba(255, 0, 255, 0.15), rgba(0, 255, 136, 0.1));
            border-bottom: 1px solid var(--glass-border);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            position: relative;
            overflow: hidden;
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
            padding: 0.4rem 1rem;
            background: rgba(255, 0, 255, 0.2);
            color: var(--accent);
            border-radius: 20px;
            font-size: 0.8rem;
            border: 1px solid rgba(255, 0, 255, 0.4);
        }

        .project-link {
            color: var(--accent);
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
        }

        .project-link:hover {
            color: #00ff88;
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
            background: linear-gradient(180deg, var(--accent), transparent);
        }

        .timeline-item {
            margin-bottom: 3rem;
            animation: fadeIn 0.6s ease-out;
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
            background: linear-gradient(135deg, var(--accent), #00ff88);
            border-radius: 50%;
            border: 4px solid var(--primary);
            box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
        }

        .timeline-content {
            background: var(--glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            padding: 1.5rem;
            border-radius: 16px;
            margin: 0 1rem;
            transition: all 0.3s;
        }

        .timeline-item:hover .timeline-content {
            border-color: rgba(255, 0, 255, 0.5);
            background: rgba(255, 0, 255, 0.15);
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
        }

        .timeline-subtitle {
            color: var(--text-secondary);
            font-weight: 500;
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
        }

        .contact-btn.primary {
            background: linear-gradient(135deg, var(--accent), #00ff88);
            color: #000;
            box-shadow: 0 10px 30px rgba(255, 0, 255, 0.3);
        }

        .contact-btn.primary:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(255, 0, 255, 0.5);
        }

        .contact-btn.secondary {
            background: var(--glass);
            color: var(--accent);
            border: 2px solid var(--accent);
            backdrop-filter: blur(20px);
        }

        .contact-btn.secondary:hover {
            background: rgba(255, 0, 255, 0.2);
            transform: translateY(-5px);
        }

        /* FOOTER */
        .footer {
            padding: 3rem 0;
            border-top: 1px solid var(--glass-border);
            text-align: center;
            color: var(--text-secondary);
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
            .nav-menu { gap: 1.5rem; font-size: 0.75rem; }
            .hero h1 { font-size: 2.2rem; }
            .headline { font-size: 1rem; }
            .about-content { grid-template-columns: 1fr; gap: 2rem; }
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
            ${data.profileImage ? '<img src="' + data.profileImage + '" alt="Profile" class="profile-image">' : '<div style="width:160px;height:160px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#00ff88);display:flex;align-items:center;justify-content:center;font-size:70px;margin-bottom:2.5rem;box-shadow:0 8px 32px rgba(255,0,255,0.2);">👤</div>'}
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
                <div class="about-text">${data.about ? '<p>' + data.about + '</p>' : '<p>Passionate professional with expertise in creating innovative solutions.</p>'}</div>
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
                ${(data.skills || []).slice(0, 6).map(skill => '<div class="skill-card"><div class="skill-icon">💻</div><div class="skill-name">' + skill + '</div><div class="skill-desc">Expert proficiency in this domain</div></div>').join('')}
            </div>
        </div>
    </section>

    ${(data.projects && data.projects.length > 0) ? '<section id="projects" class="projects"><div class="container"><h2 class="section-title">Featured Projects</h2><div class="projects-grid">' + (data.projects || []).slice(0, 6).map(project => '<div class="project-card"><div class="project-image">🚀</div><div class="project-content"><h3 class="project-title">' + (project.title || 'Project') + '</h3><p class="project-desc">' + (project.description || 'Innovative project with technical excellence.') + '</p><div class="project-tags">' + ((project.technologies || ['Web']).slice(0, 3).map(tag => '<span class="project-tag">' + tag + '</span>').join('')) + '</div>' + (project.liveUrl ? '<a href="' + project.liveUrl + '" class="project-link" target="_blank">View Project →</a>' : '<span class="project-link">Learn More →</span>') + '</div></div>').join('') + '</div></div></section>' : ''}

    ${(data.experience && data.experience.length > 0) ? '<section id="experience" class="experience"><div class="container"><h2 class="section-title">Professional Experience</h2><div class="timeline">' + (data.experience || []).map(exp => '<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-date">' + (exp.startDate || '') + ' - ' + (exp.endDate || 'Present') + '</div><div class="timeline-title">' + (exp.title || '') + '</div><div class="timeline-subtitle">' + (exp.company || '') + '</div><div class="timeline-desc">' + (exp.description || 'Key contributions to projects') + '</div></div></div>').join('') + '</div></div></section>' : ''}

    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-content">
                <p class="contact-desc">Let's collaborate and create something amazing together!</p>
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
