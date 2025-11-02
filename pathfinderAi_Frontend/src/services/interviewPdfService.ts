/**
 * Interview PDF Generation Service
 * Generates professionally formatted PDFs with interview questions and answers
 * Handles code blocks, structured formatting, and proper typography
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InterviewQuestion, InterviewSession } from './geminiInterviewService';

interface PDFOptions {
  includeJobDescription?: boolean;
  includeTips?: boolean;
  includeFollowUpQuestions?: boolean;
  pageOrientation?: 'portrait' | 'landscape';
}

class InterviewPdfService {
  private pageWidth = 210; // A4 width in mm
  private pageHeight = 297; // A4 height in mm
  private margin = 15;
  private contentWidth = this.pageWidth - 2 * this.margin;
  private lineHeight = 7;
  private fontSize = {
    title: 24,
    heading: 16,
    subHeading: 12,
    body: 10,
    small: 8
  };

  /**
   * Generate a professional interview questions PDF
   */
  generateInterviewPDF(
    session: InterviewSession,
    options: PDFOptions = {}
  ): void {
    const {
      includeJobDescription = true,
      includeTips = true,
      includeFollowUpQuestions = true,
      pageOrientation = 'portrait'
    } = options;

    const pdf = new jsPDF({
      orientation: pageOrientation,
      unit: 'mm',
      format: 'A4'
    });

    let yPosition = this.margin;

    // Set default font
    pdf.setFont('Helvetica');

    // ========== Title Page ==========
    yPosition = this.addTitlePage(pdf, session, yPosition);

    // Add page break
    pdf.addPage();
    yPosition = this.margin;

    // ========== Job Description (if included) ==========
    if (includeJobDescription && session.jobDescription) {
      yPosition = this.addJobDescription(pdf, session.jobDescription, yPosition);
      pdf.addPage();
      yPosition = this.margin;
    }

    // ========== Questions and Answers ==========
    session.questions.forEach((question, index) => {
      // Check if we need a new page
      const estimatedHeight = this.estimateQuestionHeight(
        question,
        includeTips,
        includeFollowUpQuestions
      );

      if (yPosition + estimatedHeight > this.pageHeight - this.margin) {
        pdf.addPage();
        yPosition = this.margin;
      }

      yPosition = this.addQuestion(
        pdf,
        question,
        index + 1,
        session.questions.length,
        yPosition,
        includeTips,
        includeFollowUpQuestions
      );

      // Add spacing between questions
      yPosition += 5;
    });

    // ========== Footer ==========
    this.addFooter(pdf);

    // Save the PDF
    const fileName = `Interview_Questions_${session.role.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }

  /**
   * Add title page with session information
   */
  private addTitlePage(pdf: jsPDF, session: InterviewSession, startY: number): number {
    let yPosition = startY;

    // Title
    pdf.setFontSize(this.fontSize.title);
    pdf.setFont('Helvetica', 'bold');
    pdf.setTextColor(25, 118, 210); // Professional blue
    yPosition += 20;
    const titleLines = pdf.splitTextToSize('Interview Questions', this.contentWidth);
    pdf.text(titleLines, this.margin, yPosition);
    yPosition += titleLines.length * this.lineHeight + 5;

    // Role
    pdf.setFontSize(this.fontSize.heading);
    pdf.setFont('Helvetica', 'bold');
    pdf.setTextColor(66, 66, 66); // Dark gray
    const roleText = `${session.role}`;
    pdf.text(roleText, this.margin, yPosition);
    yPosition += this.lineHeight + 10;

    // Divider line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(this.margin, yPosition, this.pageWidth - this.margin, yPosition);
    yPosition += 10;

    // Session details
    pdf.setFontSize(this.fontSize.body);
    pdf.setFont('Helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);

    const details = [
      `Total Questions: ${session.questions.length}`,
      `Generated: ${new Date(session.generatedAt).toLocaleDateString()}`,
      `Estimated Preparation Time: ${session.estimatedPreparationTime} minutes`,
      `Difficulty Distribution: ${this.getDifficultyDistribution(session.questions)}`
    ];

    details.forEach(detail => {
      pdf.text(`• ${detail}`, this.margin + 5, yPosition);
      yPosition += this.lineHeight + 2;
    });

    yPosition += 10;

    // Category breakdown
    pdf.setFontSize(this.fontSize.subHeading);
    pdf.setFont('Helvetica', 'bold');
    pdf.setTextColor(66, 66, 66);
    pdf.text('Question Categories:', this.margin, yPosition);
    yPosition += this.lineHeight + 3;

    const categories = this.getCategoryBreakdown(session.questions);
    pdf.setFontSize(this.fontSize.body);
    pdf.setFont('Helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);

    Object.entries(categories).forEach(([category, count]) => {
      pdf.text(`• ${category}: ${count} questions`, this.margin + 5, yPosition);
      yPosition += this.lineHeight + 2;
    });

    return yPosition;
  }

  /**
   * Add job description section
   */
  private addJobDescription(pdf: jsPDF, jobDescription: string, startY: number): number {
    let yPosition = startY;

    // Heading
    pdf.setFontSize(this.fontSize.heading);
    pdf.setFont('Helvetica', 'bold');
    pdf.setTextColor(25, 118, 210);
    pdf.text('Job Description', this.margin, yPosition);
    yPosition += this.lineHeight + 5;

    // Divider line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(this.margin, yPosition, this.pageWidth - this.margin, yPosition);
    yPosition += 8;

    // Content
    pdf.setFontSize(this.fontSize.body);
    pdf.setFont('Helvetica', 'normal');
    pdf.setTextColor(66, 66, 66);

    const lines = pdf.splitTextToSize(jobDescription, this.contentWidth);
    lines.forEach(line => {
      if (yPosition > this.pageHeight - this.margin - 10) {
        pdf.addPage();
        yPosition = this.margin;
      }
      pdf.text(line, this.margin, yPosition);
      yPosition += this.lineHeight;
    });

    return yPosition;
  }

  /**
   * Add a single question with answer and details
   */
  private addQuestion(
    pdf: jsPDF,
    question: InterviewQuestion,
    questionNumber: number,
    totalQuestions: number,
    startY: number,
    includeTips: boolean,
    includeFollowUpQuestions: boolean
  ): number {
    let yPosition = startY;

    // Question number and title
    pdf.setFontSize(this.fontSize.subHeading);
    pdf.setFont('Helvetica', 'bold');
    pdf.setTextColor(25, 118, 210);
    
    const questionHeader = `Q${questionNumber}. ${question.question}`;
    const questionLines = pdf.splitTextToSize(questionHeader, this.contentWidth - 20);
    pdf.text(questionLines, this.margin, yPosition);
    yPosition += questionLines.length * this.lineHeight + 3;

    // Difficulty and Category badges
    pdf.setFontSize(this.fontSize.small);
    pdf.setFont('Helvetica', 'normal');

    // Difficulty badge
    const difficultyColor = this.getDifficultyColor(question.difficulty);
    pdf.setFillColor(difficultyColor.r, difficultyColor.g, difficultyColor.b);
    pdf.rect(this.margin, yPosition - 3, 20, 5, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text(`${question.difficulty.toUpperCase()}`, this.margin + 1, yPosition + 1);

    // Category badge
    pdf.setFillColor(100, 150, 200);
    pdf.rect(this.margin + 25, yPosition - 3, 30, 5, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text(question.category, this.margin + 26, yPosition + 1);

    yPosition += 8;

    // Sample Answer
    pdf.setFontSize(this.fontSize.small);
    pdf.setFont('Helvetica', 'bold');
    pdf.setTextColor(66, 66, 66);
    pdf.text('Sample Answer:', this.margin, yPosition);
    yPosition += this.lineHeight;

    // Answer text
    pdf.setFontSize(this.fontSize.body);
    pdf.setFont('Helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    
    // Check if answer contains code blocks
    const answerLines = this.formatAnswerWithCodeBlocks(pdf, question.sampleAnswer, this.contentWidth);
    answerLines.forEach((line: any) => {
      if (yPosition > this.pageHeight - this.margin - 15) {
        pdf.addPage();
        yPosition = this.margin;
      }
      
      if (line.isCode) {
        // Render code block
        pdf.setFillColor(240, 240, 240);
        pdf.rect(this.margin, yPosition - 2, this.contentWidth, this.lineHeight + 2, 'F');
        pdf.setFont('Courier', 'normal');
        pdf.setTextColor(50, 50, 50);
        pdf.text(line.text, this.margin + 2, yPosition + 1);
        pdf.setFont('Helvetica', 'normal');
      } else {
        pdf.setTextColor(80, 80, 80);
        pdf.text(line.text, this.margin + 5, yPosition);
      }
      yPosition += this.lineHeight + 1;
    });

    yPosition += 3;

    // Key Points
    if (question.keyPoints && question.keyPoints.length > 0) {
      pdf.setFontSize(this.fontSize.small);
      pdf.setFont('Helvetica', 'bold');
      pdf.setTextColor(66, 66, 66);
      pdf.text('Key Points to Mention:', this.margin, yPosition);
      yPosition += this.lineHeight;

      pdf.setFontSize(this.fontSize.body);
      pdf.setFont('Helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);

      question.keyPoints.forEach(point => {
        if (yPosition > this.pageHeight - this.margin - 10) {
          pdf.addPage();
          yPosition = this.margin;
        }
        const cleanedPoint = this.cleanText(point);
        const pointLines = pdf.splitTextToSize(`• ${cleanedPoint}`, this.contentWidth - 10);
        pointLines.forEach(pointLine => {
          const sanitizedLine = this.sanitizeText(pointLine);
          if (sanitizedLine) {
            pdf.text(sanitizedLine, this.margin + 5, yPosition);
            yPosition += this.lineHeight;
          }
        });
      });

      yPosition += 2;
    }

    // Tips
    if (includeTips && question.tips && question.tips.length > 0) {
      pdf.setFontSize(this.fontSize.small);
      pdf.setFont('Helvetica', 'bold');
      pdf.setTextColor(139, 117, 0); // Dark orange
      pdf.text('Tips:', this.margin, yPosition);
      yPosition += this.lineHeight;

      pdf.setFontSize(this.fontSize.body);
      pdf.setFont('Helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);

      question.tips.forEach(tip => {
        if (yPosition > this.pageHeight - this.margin - 10) {
          pdf.addPage();
          yPosition = this.margin;
        }
        const cleanedTip = this.cleanText(tip);
        const tipLines = pdf.splitTextToSize(`- ${cleanedTip}`, this.contentWidth - 10);
        tipLines.forEach(tipLine => {
          const sanitizedLine = this.sanitizeText(tipLine);
          if (sanitizedLine) {
            pdf.text(sanitizedLine, this.margin + 5, yPosition);
            yPosition += this.lineHeight;
          }
        });
      });

      yPosition += 2;
    }

    // Follow-up Questions
    if (includeFollowUpQuestions && question.followUpQuestions && question.followUpQuestions.length > 0) {
      pdf.setFontSize(this.fontSize.small);
      pdf.setFont('Helvetica', 'bold');
      pdf.setTextColor(66, 66, 66);
      pdf.text('Possible Follow-up Questions:', this.margin, yPosition);
      yPosition += this.lineHeight;

      pdf.setFontSize(this.fontSize.body);
      pdf.setFont('Helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);

      question.followUpQuestions.forEach((followUp, index) => {
        if (yPosition > this.pageHeight - this.margin - 10) {
          pdf.addPage();
          yPosition = this.margin;
        }
        const cleanedFollowUp = this.cleanText(followUp);
        const followUpLines = pdf.splitTextToSize(`${index + 1}. ${cleanedFollowUp}`, this.contentWidth - 10);
        followUpLines.forEach(followUpLine => {
          const sanitizedLine = this.sanitizeText(followUpLine);
          if (sanitizedLine) {
            pdf.text(sanitizedLine, this.margin + 5, yPosition);
            yPosition += this.lineHeight;
          }
        });
      });
    }

    return yPosition;
  }

  /**
   * Sanitize text to remove special characters and encoding issues
   */
  private sanitizeText(text: string): string {
    if (!text) return '';
    
    // Remove special Unicode characters that cause issues
    return text
      .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
      .replace(/[^\w\s.,!?:;()\-\'"\/]/g, '') // Keep only safe characters
      .trim();
  }

  /**
   * Clean and normalize text from Gemini API
   */
  private cleanText(text: string): string {
    if (!text) return '';

    return text
      // Remove markdown bold/italic markers
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      // Remove extra spaces and line breaks
      .replace(/\s+/g, ' ')
      // Remove special symbols that might be encoding issues
      .replace(/[^\x20-\x7E\n\t]/g, '')
      .trim();
  }

  /**
   * Format answer with code block detection and proper text handling
   */
  private formatAnswerWithCodeBlocks(
    pdf: jsPDF,
    answer: string,
    maxWidth: number
  ): Array<{ text: string; isCode: boolean }> {
    const lines: Array<{ text: string; isCode: boolean }> = [];

    // Clean the answer first
    const cleanedAnswer = this.cleanText(answer);

    // Simple code block detection (```code``` or indented text)
    const parts = cleanedAnswer.split(/```/);

    parts.forEach((part, index) => {
      if (index % 2 === 1) {
        // This is code
        const codeLine = part.trim();
        if (codeLine) {
          const codeLines = pdf.splitTextToSize(codeLine, maxWidth - 10);
          codeLines.forEach(line => {
            const cleanedLine = this.sanitizeText(line);
            if (cleanedLine) {
              lines.push({ text: cleanedLine, isCode: true });
            }
          });
        }
      } else {
        // This is regular text
        const textLines = pdf.splitTextToSize(part, maxWidth - 10);
        textLines.forEach(line => {
          const cleanedLine = this.sanitizeText(line);
          if (cleanedLine) {
            lines.push({ text: cleanedLine, isCode: false });
          }
        });
      }
    });

    return lines;
  }

  /**
   * Estimate the height required for a question
   */
  private estimateQuestionHeight(
    question: InterviewQuestion,
    includeTips: boolean,
    includeFollowUpQuestions: boolean
  ): number {
    let height = this.lineHeight * 3; // Question title and badges

    // Sample answer (rough estimate)
    const answerLineCount = Math.ceil(question.sampleAnswer.length / 80);
    height += answerLineCount * this.lineHeight;

    // Key points
    if (question.keyPoints) {
      height += this.lineHeight * (1 + question.keyPoints.length);
    }

    // Tips
    if (includeTips && question.tips) {
      height += this.lineHeight * (1 + question.tips.length);
    }

    // Follow-up questions
    if (includeFollowUpQuestions && question.followUpQuestions) {
      height += this.lineHeight * (1 + question.followUpQuestions.length);
    }

    return height + 10; // Add buffer
  }

  /**
   * Get difficulty color for PDF
   */
  private getDifficultyColor(difficulty: string): { r: number; g: number; b: number } {
    switch (difficulty) {
      case 'easy':
        return { r: 76, g: 175, b: 80 }; // Green
      case 'medium':
        return { r: 255, g: 193, b: 7 }; // Amber
      case 'hard':
        return { r: 244, g: 67, b: 54 }; // Red
      default:
        return { r: 158, g: 158, b: 158 }; // Gray
    }
  }

  /**
   * Get difficulty distribution
   */
  private getDifficultyDistribution(questions: InterviewQuestion[]): string {
    const easy = questions.filter(q => q.difficulty === 'easy').length;
    const medium = questions.filter(q => q.difficulty === 'medium').length;
    const hard = questions.filter(q => q.difficulty === 'hard').length;

    return `Easy: ${easy}, Medium: ${medium}, Hard: ${hard}`;
  }

  /**
   * Get category breakdown
   */
  private getCategoryBreakdown(questions: InterviewQuestion[]): Record<string, number> {
    const breakdown: Record<string, number> = {};

    questions.forEach(q => {
      breakdown[q.category] = (breakdown[q.category] || 0) + 1;
    });

    return breakdown;
  }

  /**
   * Add footer to all pages
   */
  private addFooter(pdf: jsPDF): void {
    const pageCount = (pdf as any).internal.pages.length - 1;

    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(this.fontSize.small);
      pdf.setFont('Helvetica', 'normal');
      pdf.setTextColor(150, 150, 150);

      // Page number
      pdf.text(
        `Page ${i} of ${pageCount}`,
        this.pageWidth / 2,
        this.pageHeight - 8,
        { align: 'center' }
      );

      // Timestamp
      const timestamp = new Date().toLocaleString();
      pdf.text(
        `Generated: ${timestamp}`,
        this.margin,
        this.pageHeight - 8
      );

      // Footer line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(
        this.margin,
        this.pageHeight - 10,
        this.pageWidth - this.margin,
        this.pageHeight - 10
      );
    }
  }
}

export default new InterviewPdfService();
