/**
 * LaTeX Resume Templates Library
 * Pre-built templates with placeholder variables for dynamic population
 */

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary?: string;
  skills: string[];
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    graduation: string;
    gpa?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string;
  }>;
}

export interface LatexTemplate {
  id: string;
  name: string;
  description: string;
  category: "modern" | "minimalist" | "creative" | "professional";
  thumbnail?: string;
  generateLatex: (data: ResumeData) => string;
}

// ============ MODERN TEMPLATE ============
export const modernTemplate: LatexTemplate = {
  id: "modern",
  name: "Modern",
  description: "Contemporary design with clean layout and modern aesthetics",
  category: "modern",
  generateLatex: (data: ResumeData) => `
\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage[left=0.5in, right=0.5in, top=0.5in, bottom=0.5in]{geometry}
\\usepackage{xcolor}
\\usepackage{tikz}
\\usepackage{hyperref}
\\usepackage{fontawesome5}
\\usepackage[default]{lato}
\\usepackage{fancyhdr}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Define modern colors
\\definecolor{accent}{RGB}{59, 130, 246}
\\definecolor{darkaccent}{RGB}{30, 65, 150}
\\definecolor{lightgray}{RGB}{243, 244, 246}
\\definecolor{textcolor}{RGB}{31, 41, 55}

\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}

% Header section
\\newcommand{\\header}[1]{%
  \\vspace*{-20pt}
  {\\color{darkaccent}\\fontsize{28}{28}\\textbf{#1}}\\\\[2pt]
  {\\color{accent}\\rule{\\textwidth}{2pt}}\\\\[8pt]
}

% Contact info
\\newcommand{\\contactinfo}[5]{%
  \\noindent
  \\fontsize{10}{12}\\selectfont
  \\href{mailto:#2}{#2} \\mid #3 \\mid #4 \\mid #5\\\\
  \\vspace{8pt}
}

% Section heading
\\newcommand{\\sectionheading}[1]{%
  \\vspace{6pt}
  {\\color{accent}\\fontsize{12}{14}\\textbf{#1}}\\\\
  {\\color{accent}\\rule{\\textwidth}{1pt}}\\\\
  \\vspace{4pt}
}

% Experience entry
\\newcommand{\\experience}[4]{%
  {\\textbf{#1}} \\hfill {\\color{accent}#2}\\\\
  {\\textit{#3}}\\\\
  #4\\\\
  \\vspace{3pt}
}

% Education entry
\\newcommand{\\education}[4]{%
  {\\textbf{#1}} \\hfill {\\color{accent}#3}\\\\
  {\\textit{#2}}\\\\
  \\vspace{3pt}
}

% Skills display
\\newcommand{\\skillslist}[1]{%
  {\\fontsize{10}{12}\\selectfont #1}\\\\
  \\vspace{6pt}
}

\\begin{document}

% Header
\\header{${data.fullName}}

% Contact Info
\\contactinfo{${data.email}}{${data.email}}{${data.phone}}{${data.location}}{linkedin.com/in/profile}

% Professional Summary
${
  data.summary
    ? `\\sectionheading{PROFESSIONAL SUMMARY}
{\\small ${data.summary}}\\\\
\\vspace{6pt}`
    : ""
}

% Experience
\\sectionheading{EXPERIENCE}
${data.experience.map((exp) => `\\experience{${exp.company}}{${exp.duration}}{${exp.position}}{${exp.description}}`).join("\n")}

% Education
\\sectionheading{EDUCATION}
${data.education.map((edu) => `\\education{${edu.degree} in ${edu.field}}{${edu.school}}{${edu.graduation}}${edu.gpa ? ` (GPA: ${edu.gpa})` : ""}`).join("\n")}

% Skills
\\sectionheading{SKILLS}
\\skillslist{${data.skills.join(" $\\bullet$ ")}}

${
  data.certifications && data.certifications.length > 0
    ? `\\sectionheading{CERTIFICATIONS}
${data.certifications.map((cert) => `{\\textbf{${cert.name}}} - ${cert.issuer} (${cert.date})\\\\`).join("\n")}
\\vspace{6pt}`
    : ""
}

${
  data.projects && data.projects.length > 0
    ? `\\sectionheading{PROJECTS}
${data.projects.map((proj) => `{\\textbf{${proj.name}}} - ${proj.description} (${proj.technologies})\\\\`).join("\n")}`
    : ""
}

\\end{document}
  `.trim(),
};

// ============ MINIMALIST TEMPLATE ============
export const minimalistTemplate: LatexTemplate = {
  id: "minimalist",
  name: "Minimalist",
  description: "Simple and elegant design for maximum ATS compatibility",
  category: "minimalist",
  generateLatex: (data: ResumeData) => `
\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage[left=0.75in, right=0.75in, top=0.6in, bottom=0.6in]{geometry}
\\usepackage{hyperref}
\\usepackage[default]{lato}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}

% Define section style
\\newcommand{\\sectionheading}[1]{%
  \\vspace{6pt}
  {\\fontsize{12}{14}\\textbf{\\uppercase{#1}}}\\\\
  \\vspace{2pt}
}

% Entry format
\\newcommand{\\entry}[4]{%
  \\noindent
  {\\textbf{#1}} \\hfill #2\\\\
  {\\textit{#3}} \\hfill #4\\\\
  \\vspace{2pt}
}

\\begin{document}

% Header
{\\Large\\textbf{${data.fullName}}}\\\\
${data.email} $|$ ${data.phone} $|$ ${data.location}\\\\
\\vspace{6pt}

% Professional Summary
${
  data.summary
    ? `\\sectionheading{Professional Summary}
${data.summary}\\\\
\\vspace{4pt}`
    : ""
}

% Experience
\\sectionheading{Professional Experience}
${data.experience.map((exp) => `\\entry{${exp.company}}{${exp.duration}}{${exp.position}}{Duration: ${exp.duration}}\\par${exp.description}\\\\\\vspace{2pt}`).join("\n")}

% Education
\\sectionheading{Education}
${data.education.map((edu) => `\\entry{${edu.school}}{${edu.graduation}}{${edu.degree} in ${edu.field}}{${edu.graduation}}`).join("\n")}

% Skills
\\sectionheading{Skills}
${data.skills.join(" $|$ ")}\\\\
\\vspace{4pt}

% Certifications
${
  data.certifications && data.certifications.length > 0
    ? `\\sectionheading{Certifications}
${data.certifications.map((cert) => `${cert.name} - ${cert.issuer} (${cert.date})\\\\`).join("\n")}
\\vspace{4pt}`
    : ""
}

% Projects
${
  data.projects && data.projects.length > 0
    ? `\\sectionheading{Projects}
${data.projects.map((proj) => `\\entry{${proj.name}}{}{}{}${proj.description}\\\\Tech: ${proj.technologies}\\\\`).join("\n")}`
    : ""
}

\\end{document}
  `.trim(),
};

// ============ CREATIVE TEMPLATE ============
export const creativeTemplate: LatexTemplate = {
  id: "creative",
  name: "Creative",
  description: "Eye-catching design perfect for creative and tech roles",
  category: "creative",
  generateLatex: (data: ResumeData) => `
\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage[left=0.5in, right=0.5in, top=0.75in, bottom=0.75in]{geometry}
\\usepackage{xcolor}
\\usepackage{tikz}
\\usepackage{hyperref}
\\usepackage[default]{opensans}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}

% Define creative colors
\\definecolor{primary}{RGB}{236, 72, 153}
\\definecolor{secondary}{RGB}{99, 102, 241}
\\definecolor{accent}{RGB}{6, 182, 212}
\\definecolor{darkgray}{RGB}{55, 65, 81}

% Creative section style with colored bars
\\newcommand{\\creativesection}[1]{%
  \\vspace{8pt}
  \\noindent
  \\begin{tikzpicture}
    \\fill[primary] (0,0) rectangle (0.3, 12pt);
    \\node[anchor=west, inner sep=5pt] at (0.5, 6pt) {\\fontsize{13}{15}\\textbf{\\uppercase{#1}}};
  \\end{tikzpicture}\\\\
  \\vspace{4pt}
}

% Entry with accent
\\newcommand{\\creativeentry}[4]{%
  {\\color{darkgray}\\textbf{#1}} \\hfill {\\color{secondary}\\textit{#2}}\\\\
  {\\color{accent}#3}\\\\
  \\small #4\\\\
  \\normalsize
  \\vspace{3pt}
}

\\begin{document}

% Creative Header
\\noindent
\\begin{tikzpicture}[overlay, remember picture]
  \\fill[secondary] (0, 20) rectangle (21, 24);
\\end{tikzpicture}

{\\fontsize{32}{38}\\selectfont\\textbf{\\color{white}${data.fullName}}}\\\\
\\vspace{-2pt}
{\\color{primary}${data.email} $\\bullet$ ${data.phone} $\\bullet$ ${data.location}}\\\\
\\vspace{8pt}

% Summary
${
  data.summary
    ? `\\creativesection{About}
${data.summary}\\\\
\\vspace{4pt}`
    : ""
}

% Experience
\\creativesection{Experience}
${data.experience.map((exp) => `\\creativeentry{${exp.position}}{${exp.duration}}{${exp.company}}{${exp.description}}`).join("\n")}

% Education
\\creativesection{Education}
${data.education.map((edu) => `\\creativeentry{${edu.degree} in ${edu.field}}{${edu.graduation}}{${edu.school}}{${edu.gpa ? `GPA: ${edu.gpa}` : ""}}`).join("\n")}

% Skills with dots
\\creativesection{Skills}
${data.skills.map((skill) => `{\\color{accent}$\\bullet$} ${skill}\\\\`).join("")}
\\vspace{4pt}

% Certifications
${
  data.certifications && data.certifications.length > 0
    ? `\\creativesection{Certifications}
${data.certifications.map((cert) => `{\\color{primary}$\\bullet$} ${cert.name} - ${cert.issuer} (${cert.date})\\\\`).join("\n")}
\\vspace{4pt}`
    : ""
}

% Projects
${
  data.projects && data.projects.length > 0
    ? `\\creativesection{Projects}
${data.projects.map((proj) => `{\\color{primary}$\\bullet$} \\textbf{${proj.name}}: ${proj.description} (${proj.technologies})\\\\`).join("\n")}`
    : ""
}

\\end{document}
  `.trim(),
};

// ============ PROFESSIONAL TEMPLATE ============
export const professionalTemplate: LatexTemplate = {
  id: "professional",
  name: "Professional",
  description: "Corporate formal design for business positions",
  category: "professional",
  generateLatex: (data: ResumeData) => `
\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage[left=0.6in, right=0.6in, top=0.5in, bottom=0.5in]{geometry}
\\usepackage{xcolor}
\\usepackage{hyperref}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}

% Professional colors
\\definecolor{headercolor}{RGB}{13, 27, 62}
\\definecolor{accent}{RGB}{79, 126, 176}

% Professional section style
\\newcommand{\\profsection}[1]{%
  \\vspace{8pt}
  {\\color{headercolor}\\fontsize{11}{13}\\textbf{\\uppercase{#1}}}\\\\
  {\\color{accent}\\rule{\\textwidth}{0.5pt}}\\\\
  \\vspace{3pt}
}

% Professional entry
\\newcommand{\\profentry}[4]{%
  \\noindent
  {\\textbf{#1}} \\hfill {\\small #2}\\\\
  {\\small\\textit{#3}} \\hfill {\\small #4}\\\\
  {\\small #4}\\\\
  \\vspace{2pt}
}

\\begin{document}

% Professional Header
\\noindent
{\\color{headercolor}\\fontsize{24}{28}\\selectfont\\textbf{${data.fullName}}}\\\\
\\vspace{2pt}
{\\color{accent}${data.email} \\textbullet\\ ${data.phone} \\textbullet\\ ${data.location}}\\\\
\\vspace{4pt}

% Professional Summary
${
  data.summary
    ? `\\profsection{Executive Summary}
${data.summary}\\\\
\\vspace{4pt}`
    : ""
}

% Experience
\\profsection{Professional Experience}
${data.experience.map((exp) => `\\noindent{\\textbf{${exp.position}}} \\hfill {\\small${exp.duration}}\\\\{\\small\\textit{${exp.company}}}\\\\{\\small ${exp.description}}\\\\\\vspace{3pt}`).join("\n")}

% Education
\\profsection{Education}
${data.education.map((edu) => `\\noindent{\\textbf{${edu.degree} in ${edu.field}}} \\hfill {\\small${edu.graduation}}\\\\{\\small${edu.school}}${edu.gpa ? ` \\textbullet\\ GPA: ${edu.gpa}` : ""}\\\\\\vspace{2pt}`).join("\n")}

% Skills
\\profsection{Core Competencies}
${data.skills.join(" \\textbullet\\ ")}\\\\
\\vspace{4pt}

% Certifications
${
  data.certifications && data.certifications.length > 0
    ? `\\profsection{Professional Certifications}
${data.certifications.map((cert) => `${cert.name} - ${cert.issuer} (${cert.date})\\\\`).join("\n")}
\\vspace{4pt}`
    : ""
}

% Projects
${
  data.projects && data.projects.length > 0
    ? `\\profsection{Key Projects}
${data.projects.map((proj) => `\\noindent{\\textbf{${proj.name}}}: ${proj.description}\\\\{\\small Tech Stack: ${proj.technologies}}\\\\\\vspace{2pt}`).join("\n")}`
    : ""
}

\\end{document}
  `.trim(),
};

// ============ TEMPLATE REGISTRY ============
export const templates: LatexTemplate[] = [
  modernTemplate,
  minimalistTemplate,
  creativeTemplate,
  professionalTemplate,
];

export const getTemplate = (templateId: string): LatexTemplate | undefined => {
  return templates.find((t) => t.id === templateId);
};

// Sample resume data for preview/demo
export const sampleResumeData: ResumeData = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  summary:
    "Experienced software engineer with 5+ years in full-stack development. Passionate about creating scalable applications and mentoring junior developers.",
  skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB", "Docker", "GraphQL", "Git"],
  experience: [
    {
      company: "Tech Company Inc.",
      position: "Senior Software Engineer",
      duration: "2022 - Present",
      description:
        "Led development of microservices architecture handling 1M+ daily transactions. Mentored 3 junior developers.",
    },
    {
      company: "Previous Corp",
      position: "Full Stack Developer",
      duration: "2020 - 2022",
      description: "Built responsive web applications using React and Node.js. Improved performance by 40%.",
    },
  ],
  education: [
    {
      school: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      graduation: "2020",
      gpa: "3.8",
    },
  ],
  certifications: [
    {
      name: "AWS Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023",
    },
  ],
  projects: [
    {
      name: "E-Commerce Platform",
      description: "Built a full-stack e-commerce solution with payment integration",
      technologies: "React, Node.js, MongoDB, Stripe",
    },
  ],
};
