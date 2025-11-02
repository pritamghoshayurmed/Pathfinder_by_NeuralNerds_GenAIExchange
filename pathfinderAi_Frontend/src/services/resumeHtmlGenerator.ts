/**
 * Resume HTML Generator
 * Converts resume data directly to formatted HTML for PDF generation
 * Bypasses complex LaTeX parsing for clean, reliable output
 * Includes multiple ATS-friendly resume templates
 */

import { ResumeData } from "./latexTemplates";

export interface ResumeTemplate {
  name: string;
  generateHtml: (data: ResumeData) => string;
}

/**
 * Modern Resume Template - Clean, professional design with blue accents
 */
export const modernTemplate: ResumeTemplate = {
  name: "Modern",
  generateHtml: (data: ResumeData) => {
    return `
      <div style="max-width: 800px; margin: 0 auto; font-family: 'Calibri', Arial, sans-serif; font-size: 11px; line-height: 1.5; color: #222;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 15px; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
          <h1 style="margin: 0; font-size: 22px; color: #0066cc; font-weight: bold;">${escapeHtml(data.fullName)}</h1>
          <p style="margin: 5px 0 0 0; font-size: 10px; color: #555;">
            ${data.email ? `${escapeHtml(data.email)}` : ""} 
            ${data.phone ? `| ${escapeHtml(data.phone)}` : ""} 
            ${data.location ? `| ${escapeHtml(data.location)}` : ""}
          </p>
        </div>

        <!-- Professional Summary -->
        ${data.summary ? `
          <div style="margin-bottom: 12px;">
            <h3 style="margin: 0 0 5px 0; font-size: 12px; font-weight: bold; color: #0066cc; border-bottom: 1px solid #0066cc; padding-bottom: 3px;">Professional Summary</h3>
            <p style="margin: 0; font-size: 10px; line-height: 1.5;">${escapeHtml(data.summary)}</p>
          </div>
        ` : ""}

        <!-- Experience -->
        ${data.experience && data.experience.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <h3 style="margin: 0 0 5px 0; font-size: 12px; font-weight: bold; color: #0066cc; border-bottom: 1px solid #0066cc; padding-bottom: 3px;">Professional Experience</h3>
            ${data.experience.map(exp => `
              <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                  <span style="font-weight: bold; font-size: 11px;">${escapeHtml(exp.position || "")}</span>
                  <span style="font-size: 10px; color: #666;">${escapeHtml(exp.duration || "")}</span>
                </div>
                <div style="font-size: 10px; color: #666; margin-bottom: 2px;">${escapeHtml(exp.company || "")}</div>
                ${exp.description ? `<p style="margin: 2px 0 0 0; font-size: 10px;">${escapeHtml(exp.description)}</p>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Education -->
        ${data.education && data.education.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <h3 style="margin: 0 0 5px 0; font-size: 12px; font-weight: bold; color: #0066cc; border-bottom: 1px solid #0066cc; padding-bottom: 3px;">Education</h3>
            ${data.education.map(edu => `
              <div style="margin-bottom: 6px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                  <span style="font-weight: bold; font-size: 11px;">${escapeHtml(edu.degree || "")}</span>
                  <span style="font-size: 10px; color: #666;">${escapeHtml(edu.graduation || "")}</span>
                </div>
                <div style="font-size: 10px; color: #666;">${escapeHtml(edu.school || "")}</div>
                ${edu.field ? `<div style="font-size: 10px; margin-top: 2px;">${escapeHtml(edu.field)}</div>` : ""}
                ${edu.gpa ? `<div style="font-size: 10px;">GPA: ${escapeHtml(edu.gpa)}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Skills -->
        ${data.skills && data.skills.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <h3 style="margin: 0 0 5px 0; font-size: 12px; font-weight: bold; color: #0066cc; border-bottom: 1px solid #0066cc; padding-bottom: 3px;">Skills</h3>
            <p style="margin: 0; font-size: 10px; line-height: 1.6;">${data.skills.map(s => escapeHtml(s)).join(" • ")}</p>
          </div>
        ` : ""}

        <!-- Certifications -->
        ${data.certifications && data.certifications.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <h3 style="margin: 0 0 5px 0; font-size: 12px; font-weight: bold; color: #0066cc; border-bottom: 1px solid #0066cc; padding-bottom: 3px;">Certifications</h3>
            ${data.certifications.map(cert => `
              <div style="margin-bottom: 3px; font-size: 10px;">
                <strong>${escapeHtml(cert.name || "")}</strong>
                ${cert.issuer ? `• ${escapeHtml(cert.issuer)}` : ""}
                ${cert.date ? `• ${escapeHtml(cert.date)}` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Projects -->
        ${data.projects && data.projects.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <h3 style="margin: 0 0 5px 0; font-size: 12px; font-weight: bold; color: #0066cc; border-bottom: 1px solid #0066cc; padding-bottom: 3px;">Projects</h3>
            ${data.projects.map(proj => `
              <div style="margin-bottom: 6px;">
                <div style="font-weight: bold; font-size: 11px;">${escapeHtml(proj.name || "")}</div>
                ${proj.description ? `<p style="margin: 2px 0; font-size: 10px;">${escapeHtml(proj.description)}</p>` : ""}
                ${proj.technologies ? `<div style="font-size: 9px; color: #666;">Tech: ${escapeHtml(proj.technologies)}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}
      </div>
    `;
  }
};

/**
 * Minimalist Resume Template - Simple and elegant
 */
export const minimalistTemplate: ResumeTemplate = {
  name: "Minimalist",
  generateHtml: (data: ResumeData) => {
    return `
      <div style="max-width: 800px; margin: 0 auto; font-family: 'Calibri', Arial, sans-serif; font-size: 11px; line-height: 1.5; color: #000;">
        <!-- Header -->
        <div style="margin-bottom: 12px;">
          <h1 style="margin: 0; font-size: 20px; font-weight: bold; color: #000;">${escapeHtml(data.fullName)}</h1>
          <p style="margin: 3px 0 0 0; font-size: 10px; color: #333;">
            ${data.email ? escapeHtml(data.email) : ""} 
            ${data.phone ? `| ${escapeHtml(data.phone)}` : ""} 
            ${data.location ? `| ${escapeHtml(data.location)}` : ""}
          </p>
        </div>

        <!-- Professional Summary -->
        ${data.summary ? `
          <div style="margin-bottom: 10px;">
            <h3 style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold; color: #000; text-transform: uppercase; letter-spacing: 1px;">Summary</h3>
            <p style="margin: 0; font-size: 10px; line-height: 1.5;">${escapeHtml(data.summary)}</p>
          </div>
        ` : ""}

        <!-- Experience -->
        ${data.experience && data.experience.length > 0 ? `
          <div style="margin-bottom: 10px;">
            <h3 style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold; color: #000; text-transform: uppercase; letter-spacing: 1px;">Experience</h3>
            ${data.experience.map(exp => `
              <div style="margin-bottom: 6px;">
                <div style="font-weight: bold; font-size: 10px;">${escapeHtml(exp.position || "")}</div>
                <div style="font-size: 10px; color: #555;">${escapeHtml(exp.company || "")} | ${escapeHtml(exp.duration || "")}</div>
                ${exp.description ? `<p style="margin: 2px 0 0 0; font-size: 10px;">${escapeHtml(exp.description)}</p>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Education -->
        ${data.education && data.education.length > 0 ? `
          <div style="margin-bottom: 10px;">
            <h3 style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold; color: #000; text-transform: uppercase; letter-spacing: 1px;">Education</h3>
            ${data.education.map(edu => `
              <div style="margin-bottom: 4px;">
                <div style="font-weight: bold; font-size: 10px;">${escapeHtml(edu.degree || "")}</div>
                <div style="font-size: 10px; color: #555;">${escapeHtml(edu.school || "")} • ${escapeHtml(edu.graduation || "")}</div>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Skills -->
        ${data.skills && data.skills.length > 0 ? `
          <div style="margin-bottom: 10px;">
            <h3 style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold; color: #000; text-transform: uppercase; letter-spacing: 1px;">Skills</h3>
            <p style="margin: 0; font-size: 10px;">${data.skills.map(s => escapeHtml(s)).join(" • ")}</p>
          </div>
        ` : ""}

        <!-- Certifications -->
        ${data.certifications && data.certifications.length > 0 ? `
          <div style="margin-bottom: 10px;">
            <h3 style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold; color: #000; text-transform: uppercase; letter-spacing: 1px;">Certifications</h3>
            ${data.certifications.map(cert => `
              <div style="margin-bottom: 2px; font-size: 10px;">• ${escapeHtml(cert.name || "")}</div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Projects -->
        ${data.projects && data.projects.length > 0 ? `
          <div>
            <h3 style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold; color: #000; text-transform: uppercase; letter-spacing: 1px;">Projects</h3>
            ${data.projects.map(proj => `
              <div style="margin-bottom: 4px;">
                <div style="font-weight: bold; font-size: 10px;">${escapeHtml(proj.name || "")}</div>
                ${proj.description ? `<p style="margin: 2px 0 0 0; font-size: 10px;">${escapeHtml(proj.description)}</p>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}
      </div>
    `;
  }
};

/**
 * Professional/Corporate Template - Formal and authoritative
 */
export const professionalTemplate: ResumeTemplate = {
  name: "Professional",
  generateHtml: (data: ResumeData) => {
    return `
      <div style="max-width: 800px; margin: 0 auto; font-family: 'Times New Roman', serif; font-size: 11px; line-height: 1.6; color: #000;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 15px; border-top: 3px solid #000; border-bottom: 1px solid #000; padding: 10px 0;">
          <h1 style="margin: 0; font-size: 24px; color: #000; font-weight: bold;">${escapeHtml(data.fullName)}</h1>
          <p style="margin: 5px 0 0 0; font-size: 10px; letter-spacing: 1px;">
            ${data.email ? `${escapeHtml(data.email)}` : ""} 
            ${data.phone ? `| ${escapeHtml(data.phone)}` : ""} 
            ${data.location ? `| ${escapeHtml(data.location)}` : ""}
          </p>
        </div>

        <!-- Professional Summary -->
        ${data.summary ? `
          <div style="margin-bottom: 12px;">
            <h3 style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #000; letter-spacing: 2px;">PROFESSIONAL SUMMARY</h3>
            <p style="margin: 0; font-size: 11px; line-height: 1.6; text-align: justify;">${escapeHtml(data.summary)}</p>
          </div>
        ` : ""}

        <!-- Experience -->
        ${data.experience && data.experience.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <h3 style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #000; letter-spacing: 2px;">PROFESSIONAL EXPERIENCE</h3>
            ${data.experience.map(exp => `
              <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                  <span style="font-weight: bold; font-size: 11px;">${escapeHtml(exp.position || "")}</span>
                  <span style="font-size: 10px;">${escapeHtml(exp.duration || "")}</span>
                </div>
                <div style="font-size: 11px; margin-bottom: 3px;">${escapeHtml(exp.company || "")}</div>
                ${exp.description ? `<p style="margin: 0; font-size: 10px; line-height: 1.5; text-align: justify;">${escapeHtml(exp.description)}</p>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Education -->
        ${data.education && data.education.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <h3 style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #000; letter-spacing: 2px;">EDUCATION</h3>
            ${data.education.map(edu => `
              <div style="margin-bottom: 6px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                  <span style="font-weight: bold; font-size: 11px;">${escapeHtml(edu.degree || "")}</span>
                  <span style="font-size: 10px;">${escapeHtml(edu.graduation || "")}</span>
                </div>
                <div style="font-size: 11px;">${escapeHtml(edu.school || "")}</div>
                ${edu.field ? `<div style="font-size: 10px; margin-top: 2px;">Field of Study: ${escapeHtml(edu.field)}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Skills -->
        ${data.skills && data.skills.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <h3 style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #000; letter-spacing: 2px;">CORE COMPETENCIES</h3>
            <p style="margin: 0; font-size: 10px; line-height: 1.6;">${data.skills.map(s => escapeHtml(s)).join(" • ")}</p>
          </div>
        ` : ""}

        <!-- Certifications -->
        ${data.certifications && data.certifications.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <h3 style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #000; letter-spacing: 2px;">CERTIFICATIONS & CREDENTIALS</h3>
            ${data.certifications.map(cert => `
              <div style="margin-bottom: 3px; font-size: 10px;">
                ${escapeHtml(cert.name || "")}
                ${cert.issuer ? `• ${escapeHtml(cert.issuer)}` : ""}
                ${cert.date ? `(${escapeHtml(cert.date)})` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Projects -->
        ${data.projects && data.projects.length > 0 ? `
          <div>
            <h3 style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #000; letter-spacing: 2px;">KEY PROJECTS</h3>
            ${data.projects.map(proj => `
              <div style="margin-bottom: 6px;">
                <div style="font-weight: bold; font-size: 11px;">${escapeHtml(proj.name || "")}</div>
                ${proj.description ? `<p style="margin: 2px 0; font-size: 10px;">${escapeHtml(proj.description)}</p>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}
      </div>
    `;
  }
};

/**
 * Creative Template - Modern with color accents
 */
export const creativeTemplate: ResumeTemplate = {
  name: "Creative",
  generateHtml: (data: ResumeData) => {
    return `
      <div style="max-width: 800px; margin: 0 auto; font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; line-height: 1.5; color: #222;">
        <!-- Header with Creative Design -->
        <div style="background-color: #f0f8ff; margin-bottom: 15px; padding: 15px; border-left: 5px solid #ff6b6b;">
          <h1 style="margin: 0; font-size: 26px; color: #1a1a1a; font-weight: bold;">${escapeHtml(data.fullName)}</h1>
          <p style="margin: 8px 0 0 0; font-size: 10px; color: #555;">
            ${data.email ? `${escapeHtml(data.email)}` : ""} 
            ${data.phone ? `| ${escapeHtml(data.phone)}` : ""} 
            ${data.location ? `| ${escapeHtml(data.location)}` : ""}
          </p>
        </div>

        <!-- Professional Summary -->
        ${data.summary ? `
          <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #ff6b6b;">
            <h3 style="margin: 0 0 5px 0; font-size: 12px; font-weight: bold; color: #ff6b6b;">About</h3>
            <p style="margin: 0; font-size: 10px; line-height: 1.5;">${escapeHtml(data.summary)}</p>
          </div>
        ` : ""}

        <!-- Experience -->
        ${data.experience && data.experience.length > 0 ? `
          <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #4ecdc4;">
            <h3 style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #4ecdc4;">Experience</h3>
            ${data.experience.map((exp, index) => `
              <div style="margin-bottom: 8px; ${index !== data.experience!.length - 1 ? 'padding-bottom: 8px; border-bottom: 1px solid #eee;' : ''}">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                  <span style="font-weight: bold; font-size: 11px; color: #1a1a1a;">${escapeHtml(exp.position || "")}</span>
                  <span style="font-size: 9px; color: #999;">${escapeHtml(exp.duration || "")}</span>
                </div>
                <div style="font-size: 10px; color: #666; margin-bottom: 3px;">${escapeHtml(exp.company || "")}</div>
                ${exp.description ? `<p style="margin: 0; font-size: 10px;">${escapeHtml(exp.description)}</p>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Education -->
        ${data.education && data.education.length > 0 ? `
          <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #45b7d1;">
            <h3 style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #45b7d1;">Education</h3>
            ${data.education.map(edu => `
              <div style="margin-bottom: 6px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                  <span style="font-weight: bold; font-size: 11px;">${escapeHtml(edu.degree || "")}</span>
                  <span style="font-size: 9px; color: #999;">${escapeHtml(edu.graduation || "")}</span>
                </div>
                <div style="font-size: 10px; color: #666;">${escapeHtml(edu.school || "")}</div>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Skills -->
        ${data.skills && data.skills.length > 0 ? `
          <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #f9ca24;">
            <h3 style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #f9ca24;">Skills</h3>
            <p style="margin: 0; font-size: 10px; line-height: 1.6;">${data.skills.map(s => escapeHtml(s)).join(" • ")}</p>
          </div>
        ` : ""}

        <!-- Certifications -->
        ${data.certifications && data.certifications.length > 0 ? `
          <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #6c5ce7;">
            <h3 style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #6c5ce7;">Certifications</h3>
            ${data.certifications.map(cert => `
              <div style="margin-bottom: 3px; font-size: 10px;">
                ✓ ${escapeHtml(cert.name || "")}
                ${cert.issuer ? `• ${escapeHtml(cert.issuer)}` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Projects -->
        ${data.projects && data.projects.length > 0 ? `
          <div>
            <h3 style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #a29bfe;">Projects</h3>
            ${data.projects.map(proj => `
              <div style="margin-bottom: 6px;">
                <div style="font-weight: bold; font-size: 11px;">${escapeHtml(proj.name || "")}</div>
                ${proj.description ? `<p style="margin: 2px 0; font-size: 10px;">${escapeHtml(proj.description)}</p>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}
      </div>
    `;
  }
};

/**
 * Compact/Academic Template - Maximum content density for ATS
 */
export const compactTemplate: ResumeTemplate = {
  name: "Compact",
  generateHtml: (data: ResumeData) => {
    return `
      <div style="max-width: 800px; margin: 0 auto; font-family: 'Arial', sans-serif; font-size: 10px; line-height: 1.3; color: #000;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 8px;">
          <h1 style="margin: 0; font-size: 16px; color: #000; font-weight: bold;">${escapeHtml(data.fullName)}</h1>
          <p style="margin: 2px 0 0 0; font-size: 9px;">
            ${data.email ? `${escapeHtml(data.email)}` : ""} 
            ${data.phone ? `| ${escapeHtml(data.phone)}` : ""} 
            ${data.location ? `| ${escapeHtml(data.location)}` : ""}
          </p>
        </div>

        <!-- Professional Summary -->
        ${data.summary ? `
          <div style="margin-bottom: 8px;">
            <h3 style="margin: 0 0 2px 0; font-size: 10px; font-weight: bold; color: #000;">PROFESSIONAL SUMMARY</h3>
            <p style="margin: 0; font-size: 9px; line-height: 1.3;">${escapeHtml(data.summary)}</p>
          </div>
        ` : ""}

        <!-- Experience -->
        ${data.experience && data.experience.length > 0 ? `
          <div style="margin-bottom: 8px;">
            <h3 style="margin: 0 0 2px 0; font-size: 10px; font-weight: bold; color: #000;">PROFESSIONAL EXPERIENCE</h3>
            ${data.experience.map(exp => `
              <div style="margin-bottom: 4px;">
                <span style="font-weight: bold; font-size: 9px;">${escapeHtml(exp.position || "")}</span>
                <span style="font-size: 9px;"> | ${escapeHtml(exp.company || "")} | ${escapeHtml(exp.duration || "")}</span>
                ${exp.description ? `<p style="margin: 1px 0 0 0; font-size: 9px;">${escapeHtml(exp.description)}</p>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Education -->
        ${data.education && data.education.length > 0 ? `
          <div style="margin-bottom: 8px;">
            <h3 style="margin: 0 0 2px 0; font-size: 10px; font-weight: bold; color: #000;">EDUCATION</h3>
            ${data.education.map(edu => `
              <div style="margin-bottom: 2px; font-size: 9px;">
                <strong>${escapeHtml(edu.degree || "")}</strong> | ${escapeHtml(edu.school || "")} | ${escapeHtml(edu.graduation || "")}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Skills -->
        ${data.skills && data.skills.length > 0 ? `
          <div style="margin-bottom: 8px;">
            <h3 style="margin: 0 0 2px 0; font-size: 10px; font-weight: bold; color: #000;">SKILLS</h3>
            <p style="margin: 0; font-size: 9px; line-height: 1.3;">${data.skills.map(s => escapeHtml(s)).join(" • ")}</p>
          </div>
        ` : ""}

        <!-- Certifications -->
        ${data.certifications && data.certifications.length > 0 ? `
          <div style="margin-bottom: 8px;">
            <h3 style="margin: 0 0 2px 0; font-size: 10px; font-weight: bold; color: #000;">CERTIFICATIONS</h3>
            ${data.certifications.map(cert => `
              <div style="margin-bottom: 1px; font-size: 9px;">
                ${escapeHtml(cert.name || "")}
                ${cert.issuer ? ` | ${escapeHtml(cert.issuer)}` : ""}
                ${cert.date ? ` | ${escapeHtml(cert.date)}` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Projects -->
        ${data.projects && data.projects.length > 0 ? `
          <div>
            <h3 style="margin: 0 0 2px 0; font-size: 10px; font-weight: bold; color: #000;">PROJECTS</h3>
            ${data.projects.map(proj => `
              <div style="margin-bottom: 3px; font-size: 9px;">
                <strong>${escapeHtml(proj.name || "")}</strong>${proj.description ? ` - ${escapeHtml(proj.description)}` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}
      </div>
    `;
  }
};

/**
 * Two-Column Template - Sidebar layout for ATS compatibility
 */
export const twoColumnTemplate: ResumeTemplate = {
  name: "TwoColumn",
  generateHtml: (data: ResumeData) => {
    return `
      <div style="max-width: 800px; margin: 0 auto; font-family: 'Calibri', Arial, sans-serif; font-size: 10px; line-height: 1.4; color: #222;">
        <!-- Header -->
        <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #333;">
          <h1 style="margin: 0; font-size: 20px; color: #000; font-weight: bold;">${escapeHtml(data.fullName)}</h1>
          <p style="margin: 4px 0 0 0; font-size: 9px; color: #555;">
            ${data.email ? `${escapeHtml(data.email)}` : ""} 
            ${data.phone ? `| ${escapeHtml(data.phone)}` : ""} 
            ${data.location ? `| ${escapeHtml(data.location)}` : ""}
          </p>
        </div>

        <div style="display: flex; gap: 15px;">
          <!-- Main Content -->
          <div style="flex: 3;">
            <!-- Professional Summary -->
            ${data.summary ? `
              <div style="margin-bottom: 10px;">
                <h3 style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold; color: #000; text-transform: uppercase;">PROFESSIONAL PROFILE</h3>
                <p style="margin: 0; font-size: 9px; line-height: 1.4;">${escapeHtml(data.summary)}</p>
              </div>
            ` : ""}

            <!-- Experience -->
            ${data.experience && data.experience.length > 0 ? `
              <div style="margin-bottom: 10px;">
                <h3 style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold; color: #000; text-transform: uppercase;">EXPERIENCE</h3>
                ${data.experience.map(exp => `
                  <div style="margin-bottom: 6px;">
                    <div style="font-weight: bold; font-size: 10px;">${escapeHtml(exp.position || "")}</div>
                    <div style="font-size: 9px; color: #555;">${escapeHtml(exp.company || "")} | ${escapeHtml(exp.duration || "")}</div>
                    ${exp.description ? `<p style="margin: 2px 0 0 0; font-size: 9px;">${escapeHtml(exp.description)}</p>` : ""}
                  </div>
                `).join("")}
              </div>
            ` : ""}

            <!-- Education -->
            ${data.education && data.education.length > 0 ? `
              <div style="margin-bottom: 10px;">
                <h3 style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold; color: #000; text-transform: uppercase;">EDUCATION</h3>
                ${data.education.map(edu => `
                  <div style="margin-bottom: 4px;">
                    <div style="font-weight: bold; font-size: 10px;">${escapeHtml(edu.degree || "")}</div>
                    <div style="font-size: 9px; color: #555;">${escapeHtml(edu.school || "")} • ${escapeHtml(edu.graduation || "")}</div>
                  </div>
                `).join("")}
              </div>
            ` : ""}

            <!-- Projects -->
            ${data.projects && data.projects.length > 0 ? `
              <div>
                <h3 style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold; color: #000; text-transform: uppercase;">PROJECTS</h3>
                ${data.projects.map(proj => `
                  <div style="margin-bottom: 4px;">
                    <div style="font-weight: bold; font-size: 10px;">${escapeHtml(proj.name || "")}</div>
                    ${proj.description ? `<p style="margin: 1px 0; font-size: 9px;">${escapeHtml(proj.description)}</p>` : ""}
                  </div>
                `).join("")}
              </div>
            ` : ""}
          </div>

          <!-- Sidebar -->
          <div style="flex: 1; background-color: #f5f5f5; padding: 10px; border-left: 1px solid #ddd;">
            <!-- Skills -->
            ${data.skills && data.skills.length > 0 ? `
              <div style="margin-bottom: 12px;">
                <h4 style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold; color: #000; text-transform: uppercase;">SKILLS</h4>
                <p style="margin: 0; font-size: 8px; line-height: 1.5;">
                  ${data.skills.map(s => `<div style="margin-bottom: 2px;">• ${escapeHtml(s)}</div>`).join("")}
                </p>
              </div>
            ` : ""}

            <!-- Certifications -->
            ${data.certifications && data.certifications.length > 0 ? `
              <div>
                <h4 style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold; color: #000; text-transform: uppercase;">CERTIFICATIONS</h4>
                <p style="margin: 0; font-size: 8px; line-height: 1.5;">
                  ${data.certifications.map(cert => `<div style="margin-bottom: 2px;">• ${escapeHtml(cert.name || "")}</div>`).join("")}
                </p>
              </div>
            ` : ""}
          </div>
        </div>
      </div>
    `;
  }
};

/**
 * Convert resume data directly to HTML, bypassing LaTeX
 */
export const generateResumeHtml = (data: ResumeData, templateName: string = "modern"): string => {
  const templates: { [key: string]: ResumeTemplate } = {
    modern: modernTemplate,
    minimalist: minimalistTemplate,
    professional: professionalTemplate,
    creative: creativeTemplate,
    compact: compactTemplate,
    twocolumn: twoColumnTemplate,
  };

  const template = templates[templateName.toLowerCase()] || modernTemplate;
  return template.generateHtml(data);
};

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
