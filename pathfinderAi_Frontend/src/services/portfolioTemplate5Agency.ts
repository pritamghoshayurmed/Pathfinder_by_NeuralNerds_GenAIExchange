import { PortfolioData } from '@/types/portfolio';

/**
 * Template 5: Agency/Team Portfolio
 * - Case study showcase
 * - Advanced animations
 * - Collaborative focus
 */
export const generateAgencyTemplate = (data: PortfolioData): string => {
  const accentColor = data.accentColor || '#00d9ff';
  const darkAccent = '#0066cc';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Agency Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Outfit', 'Inter', sans-serif;
            background: #0a0e27;
            color: #e5e7eb;
            line-height: 1.7;
        }

        html { scroll-behavior: smooth; }

        a {
            text-decoration: none;
            color: inherit;
        }

        /* Navbar */
        .navbar {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 1000;
            background: rgba(10, 14, 39, 0.8);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid ${accentColor}20;
            padding: 1.5rem 2rem;
        }

        .navbar-inner {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .navbar-logo {
            font-size: 1.4rem;
            font-weight: 900;
            letter-spacing: -1.5px;
            color: ${accentColor};
        }

        .navbar-menu {
            display: flex;
            list-style: none;
            gap: 3rem;
        }

        .navbar-menu a {
            font-size: 0.95rem;
            font-weight: 600;
            color: #9ca3af;
            transition: all 0.3s;
            position: relative;
        }

        .navbar-menu a::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 0;
            height: 2px;
            background: ${accentColor};
            transition: width 0.3s;
        }

        .navbar-menu a:hover {
            color: ${accentColor};
        }

        .navbar-menu a:hover::after {
            width: 100%;
        }

        /* Hero */
        .hero {
            margin-top: 70px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6rem 2rem;
            position: relative;
            overflow: hidden;
            background: radial-gradient(circle at 20% 50%, ${accentColor}08 0%, transparent 50%),
                        radial-gradient(circle at 80% 50%, ${darkAccent}08 0%, transparent 50%);
        }

        .hero::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -20%;
            width: 700px;
            height: 700px;
            background: radial-gradient(circle, ${accentColor}15, transparent);
            border-radius: 50%;
            animation: float-blob 15s ease-in-out infinite;
        }

        @keyframes float-blob {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(-30px, 30px) rotate(90deg); }
            50% { transform: translate(-50px, 0px) rotate(180deg); }
            75% { transform: translate(-30px, -30px) rotate(270deg); }
        }

        .hero-content {
            position: relative;
            z-index: 10;
            text-align: center;
            max-width: 1000px;
        }

        .hero h1 {
            font-size: 4.5rem;
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, ${accentColor}, ${darkAccent});
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: slideInDown 1s ease-out;
        }

        @keyframes slideInDown {
            from { opacity: 0; transform: translateY(-50px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .hero p {
            font-size: 1.3rem;
            color: #d1d5db;
            max-width: 700px;
            margin: 0 auto 3rem;
            line-height: 1.8;
            animation: fadeIn 1s ease-out 0.2s both;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .hero-buttons {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            flex-wrap: wrap;
            animation: slideUp 1s ease-out 0.3s both;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .btn {
            padding: 16px 45px;
            background: linear-gradient(135deg, ${accentColor}, ${accentColor}dd);
            color: #0a0e27;
            border: none;
            border-radius: 50px;
            font-weight: 700;
            cursor: pointer;
            display: inline-block;
            font-size: 1rem;
            transition: all 0.3s;
            box-shadow: 0 15px 40px ${accentColor}30;
            letter-spacing: 0.5px;
        }

        .btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 25px 50px ${accentColor}50;
        }

        .btn-outline {
            background: transparent;
            color: ${accentColor};
            border: 2px solid ${accentColor};
            box-shadow: none;
        }

        .btn-outline:hover {
            background: ${accentColor}10;
        }

        /* Sections */
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        section {
            padding: 120px 2rem;
            position: relative;
        }

        section h2 {
            font-size: 3.5rem;
            font-weight: 900;
            margin-bottom: 4rem;
            text-align: center;
            color: #fff;
            letter-spacing: -1px;
        }

        section h2::after {
            content: '';
            display: block;
            width: 80px;
            height: 4px;
            background: linear-gradient(90deg, ${accentColor}, ${darkAccent});
            margin: 1.5rem auto 0;
            border-radius: 2px;
        }

        /* About */
        .about {
            background: linear-gradient(180deg, rgba(0, 217, 255, 0.02) 0%, rgba(0, 102, 204, 0.02) 100%);
            border-top: 1px solid ${accentColor}15;
            border-bottom: 1px solid ${accentColor}15;
        }

        .about-content {
            max-width: 900px;
            margin: 0 auto;
            text-align: center;
            font-size: 1.15rem;
            color: #d1d5db;
            line-height: 1.9;
        }

        /* Case Studies */
        .projects {
            background: radial-gradient(circle at 50% 100%, ${accentColor}08 0%, transparent 50%);
        }

        .case-studies {
            display: grid;
            gap: 4rem;
            margin-top: 4rem;
        }

        .case-study {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
            padding: 3rem;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid ${accentColor}20;
            border-radius: 20px;
            transition: all 0.3s;
        }

        .case-study:nth-child(even) {
            grid-template-columns: 1fr 1fr;
            direction: rtl;
        }

        .case-study:nth-child(even) > * {
            direction: ltr;
        }

        .case-study:hover {
            border-color: ${accentColor};
            background: rgba(255, 255, 255, 0.04);
            box-shadow: 0 20px 60px ${accentColor}15;
            transform: translateY(-5px);
        }

        .case-study-image {
            height: 400px;
            background: linear-gradient(135deg, ${accentColor}20, ${darkAccent}20);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            position: relative;
            overflow: hidden;
        }

        .case-study-image::before {
            content: '';
            position: absolute;
            inset: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,217,255,0.1)" stroke-width="1"/></pattern></defs><rect width="400" height="400" fill="url(%23grid)"/></svg>');
            opacity: 0.5;
        }

        .case-study-content h3 {
            font-size: 2rem;
            color: ${accentColor};
            margin-bottom: 1rem;
            font-weight: 900;
            letter-spacing: -0.5px;
        }

        .case-study-content p {
            color: #d1d5db;
            margin-bottom: 1.5rem;
            line-height: 1.8;
        }

        .case-study-meta {
            display: flex;
            gap: 2rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }

        .meta-item {
            flex: 1;
            min-width: 150px;
        }

        .meta-label {
            font-size: 0.85rem;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 0.5rem;
        }

        .meta-value {
            font-size: 1rem;
            color: ${accentColor};
            font-weight: 700;
        }

        .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
            margin-bottom: 2rem;
        }

        .tech-tag {
            padding: 8px 16px;
            background: ${accentColor}20;
            color: ${accentColor};
            border-radius: 50px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .case-links {
            display: flex;
            gap: 1rem;
        }

        .case-link {
            padding: 12px 28px;
            background: ${accentColor}20;
            color: ${accentColor};
            border-radius: 50px;
            font-weight: 700;
            transition: all 0.3s;
            border: 1px solid ${accentColor}40;
        }

        .case-link:hover {
            background: ${accentColor};
            color: #0a0e27;
            transform: translateX(3px);
        }

        /* Skills */
        .skills {
            background: linear-gradient(180deg, rgba(0, 102, 204, 0.02) 0%, rgba(0, 217, 255, 0.02) 100%);
        }

        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 4rem;
        }

        .skill-category {
            padding: 2.5rem;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid ${accentColor}20;
            border-radius: 15px;
            transition: all 0.3s;
        }

        .skill-category:hover {
            border-color: ${accentColor};
            background: rgba(255, 255, 255, 0.04);
            transform: translateY(-8px);
            box-shadow: 0 20px 50px ${accentColor}15;
        }

        .skill-category h3 {
            color: ${accentColor};
            font-size: 1.4rem;
            margin-bottom: 1.5rem;
            font-weight: 900;
        }

        .skill-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
        }

        .skill-item {
            padding: 8px 15px;
            background: ${accentColor}15;
            color: ${accentColor};
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: 600;
            transition: all 0.3s;
        }

        .skill-item:hover {
            background: ${accentColor}30;
            transform: scale(1.05);
        }

        /* Testimonials */
        .testimonials {
            background: radial-gradient(circle at 50% 0%, ${accentColor}08 0%, transparent 50%);
        }

        .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 2rem;
            margin-top: 4rem;
        }

        .testimonial {
            padding: 2.5rem;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid ${accentColor}20;
            border-radius: 15px;
            transition: all 0.3s;
            position: relative;
        }

        .testimonial::before {
            content: '"';
            position: absolute;
            top: -20px;
            left: 20px;
            font-size: 4rem;
            color: ${accentColor}20;
            line-height: 1;
        }

        .testimonial:hover {
            border-color: ${accentColor};
            background: rgba(255, 255, 255, 0.04);
            transform: translateY(-8px);
            box-shadow: 0 20px 50px ${accentColor}15;
        }

        .testimonial-text {
            color: #d1d5db;
            margin-bottom: 1.5rem;
            line-height: 1.8;
            font-size: 1rem;
        }

        .testimonial-author {
            color: ${accentColor};
            font-weight: 700;
        }

        .testimonial-role {
            color: #9ca3af;
            font-size: 0.9rem;
        }

        /* Contact */
        .contact {
            background: linear-gradient(135deg, ${accentColor}15, ${darkAccent}15);
            border-top: 1px solid ${accentColor}30;
            border-bottom: 1px solid ${accentColor}30;
            text-align: center;
        }

        .contact p {
            font-size: 1.15rem;
            color: #d1d5db;
            margin-bottom: 3rem;
        }

        .contact-methods {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
            max-width: 1000px;
            margin-left: auto;
            margin-right: auto;
        }

        .contact-method {
            padding: 2rem;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid ${accentColor}30;
            border-radius: 12px;
            transition: all 0.3s;
        }

        .contact-method:hover {
            border-color: ${accentColor};
            background: rgba(255, 255, 255, 0.04);
            transform: translateY(-5px);
        }

        .contact-method h3 {
            color: ${accentColor};
            margin-bottom: 0.5rem;
        }

        .contact-method a {
            color: #d1d5db;
            transition: color 0.3s;
        }

        .contact-method a:hover {
            color: ${accentColor};
        }

        /* Footer */
        .footer {
            background: rgba(0, 0, 0, 0.5);
            color: #6b7280;
            text-align: center;
            padding: 3rem 2rem;
            border-top: 1px solid ${accentColor}15;
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .case-study {
                grid-template-columns: 1fr;
            }

            .case-study:nth-child(even) {
                direction: ltr;
            }

            .case-study:nth-child(even) > * {
                direction: ltr;
            }

            .case-study-image {
                height: 300px;
            }
        }

        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }

            .navbar-menu {
                gap: 1.5rem;
                font-size: 0.85rem;
            }

            .hero-buttons {
                flex-direction: column;
            }

            section h2 {
                font-size: 2rem;
            }

            .skills-grid,
            .contact-methods,
            .testimonials-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="navbar-inner">
            <div class="navbar-logo">${data.fullName}</div>
            <ul class="navbar-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#work">Case Studies</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <section id="home" class="hero">
        <div class="hero-content">
            <h1>${data.fullName}</h1>
            <p>${data.headline}</p>
            <p>${data.about || data.bio}</p>
            <div class="hero-buttons">
                <button class="btn" onclick="document.getElementById('work').scrollIntoView({behavior: 'smooth'})">View Work</button>
                <button class="btn btn-outline" onclick="document.getElementById('contact').scrollIntoView({behavior: 'smooth'})">Get In Touch</button>
            </div>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2>About</h2>
            <div class="about-content">
                ${data.about || data.bio}
            </div>
        </div>
    </section>

    ${data.projects.length > 0 ? `
    <section id="work" class="projects">
        <div class="container">
            <h2>Featured Work</h2>
            <div class="case-studies">
                ${data.projects.filter(p => p.featured).map(project => `
                    <div class="case-study">
                        <div class="case-study-image">
                            ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">` : '🎯'}
                        </div>
                        <div class="case-study-content">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            <div class="case-study-meta">
                                <div class="meta-item">
                                    <div class="meta-label">Category</div>
                                    <div class="meta-value">Design & Development</div>
                                </div>
                                <div class="meta-item">
                                    <div class="meta-label">Status</div>
                                    <div class="meta-value">Completed</div>
                                </div>
                            </div>
                            <div class="tech-stack">
                                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                            <div class="case-links">
                                ${project.liveUrl ? `<a href="${project.liveUrl}" class="case-link" target="_blank" rel="noopener noreferrer">View Live</a>` : ''}
                                ${project.githubUrl ? `<a href="${project.githubUrl}" class="case-link" target="_blank" rel="noopener noreferrer">View Code</a>` : ''}
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
                        <div class="skill-list">
                            ${skillGroup.skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <section id="contact" class="contact">
        <div class="container">
            <h2>Let's Collaborate</h2>
            <p>Have an exciting project? Let's discuss how we can create something amazing together.</p>
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
        <p>&copy; 2024 ${data.fullName}. Crafted with innovation & expertise.</p>
    </footer>
</body>
</html>`;
};


