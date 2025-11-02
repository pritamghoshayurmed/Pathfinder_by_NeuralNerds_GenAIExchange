import { GoogleGenerativeAI } from '@google/generative-ai';

export interface CoverLetterTemplate {
  name: string;
  icon: string;
  style: string;
  prompt: string;
}

export interface GeneratedCoverLetter {
  id: string;
  company: string;
  position: string;
  content: string;
  template: string;
  lastModified: string;
  createdAt: string;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

class CoverLetterService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (!API_KEY) {
      throw new Error('Gemini API key not found in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(API_KEY);
  }

  private async callGemini(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to generate cover letter. Please try again.');
    }
  }

  async generateCoverLetter(
    company: string,
    position: string,
    jobDescription: string = '',
    userBackground: string = '',
    template: string = 'Professional'
  ): Promise<string> {
    try {
      const prompt = `You are an expert cover letter writer. Generate a compelling, professional cover letter following the ${template} template style.

Company: ${company}
Position: ${position}
${jobDescription ? `Job Description: ${jobDescription}` : ''}
${userBackground ? `User Background: ${userBackground}` : ''}

Guidelines:
1. Start with proper date and address format
2. Use a professional greeting
3. Write 3-4 compelling paragraphs that:
   - Show genuine interest in the company and role
   - Highlight relevant skills and achievements
   - Demonstrate knowledge of the company
   - Explain why you're a great fit
4. Include a strong closing statement
5. Keep it to one page (around 250-400 words)
6. Use active voice and specific examples
7. Tailor it to the ${template} style

Generate ONLY the cover letter content, properly formatted with proper spacing between paragraphs.`;

      const coverLetter = await this.callGemini(prompt);
      return coverLetter;
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw error;
    }
  }

  async refineCoverLetter(
    coverLetter: string,
    feedback: string
  ): Promise<string> {
    try {
      const prompt = `You are an expert cover letter writer. Please refine the following cover letter based on the user's feedback.

Original Cover Letter:
${coverLetter}

User Feedback:
${feedback}

Please incorporate the feedback and improve the cover letter while maintaining its professional tone and structure. Return ONLY the refined cover letter.`;

      const refinedLetter = await this.callGemini(prompt);
      return refinedLetter;
    } catch (error) {
      console.error('Error refining cover letter:', error);
      throw error;
    }
  }

  async getCoverLetterSuggestions(
    company: string,
    position: string,
    coverLetter: string
  ): Promise<string[]> {
    try {
      const prompt = `You are an expert cover letter writer. Analyze this cover letter and provide 5-7 specific suggestions for improvement.

Company: ${company}
Position: ${position}

Cover Letter:
${coverLetter}

Provide suggestions in the format of a numbered list. Each suggestion should be:
1. Specific and actionable
2. Focused on improving impact and relevance
3. Concise (1-2 sentences each)

Return ONLY the numbered suggestions.`;

      const suggestionsText = await this.callGemini(prompt);
      const suggestions = suggestionsText
        .split('\n')
        .filter((line) => line.trim().match(/^\d+\./))
        .map((line) => line.replace(/^\d+\.\s*/, '').trim());

      return suggestions;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      throw error;
    }
  }

  async optimizeForATS(coverLetter: string, jobDescription: string): Promise<string> {
    try {
      const prompt = `You are an expert in ATS (Applicant Tracking System) optimization. Optimize the following cover letter for ATS systems while maintaining its quality and professionalism.

Job Description:
${jobDescription}

Cover Letter:
${coverLetter}

Focus on:
1. Including relevant keywords from the job description
2. Using clear formatting with proper line breaks
3. Avoiding special characters that might confuse ATS
4. Organizing information in a scannable format
5. Maintaining professional tone while being ATS-friendly

Return ONLY the optimized cover letter.`;

      const optimizedLetter = await this.callGemini(prompt);
      return optimizedLetter;
    } catch (error) {
      console.error('Error optimizing for ATS:', error);
      throw error;
    }
  }

  async generateTailoredVariation(
    baseCoverLetter: string,
    specificFocus: string
  ): Promise<string> {
    try {
      const prompt = `You are an expert cover letter writer. Create a variation of this cover letter with a specific focus.

Base Cover Letter:
${baseCoverLetter}

Specific Focus:
${specificFocus}

Please adapt the cover letter to emphasize the specified focus while maintaining its core message and professional tone. Return ONLY the adapted cover letter.`;

      const variation = await this.callGemini(prompt);
      return variation;
    } catch (error) {
      console.error('Error generating variation:', error);
      throw error;
    }
  }

  async analyzeAlignment(
    coverLetter: string,
    jobDescription: string
  ): Promise<{
    alignmentScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    feedback: string;
  }> {
    try {
      const prompt = `You are an expert in job alignment analysis. Analyze how well this cover letter aligns with the job description.

Job Description:
${jobDescription}

Cover Letter:
${coverLetter}

Provide your analysis in the following JSON format:
{
  "alignmentScore": <number 0-100>,
  "matchedSkills": [<list of skills mentioned in both>],
  "missingSkills": [<list of important skills from job description not mentioned in letter>],
  "feedback": "<specific feedback on alignment>"
}

Return ONLY valid JSON, no markdown formatting.`;

      const analysisText = await this.callGemini(prompt);
      
      // Clean and parse JSON
      let cleaned = analysisText.replace(/```json\n?|\n?```/g, '').trim();
      cleaned = cleaned.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
      
      const analysis = JSON.parse(cleaned);
      return analysis;
    } catch (error) {
      console.error('Error analyzing alignment:', error);
      return {
        alignmentScore: 0,
        matchedSkills: [],
        missingSkills: [],
        feedback: 'Unable to analyze alignment. Please try again.',
      };
    }
  }

  getTemplates(): CoverLetterTemplate[] {
    return [
      {
        name: 'Professional',
        icon: '💼',
        style: 'Formal and traditional',
        prompt: 'professional-formal-structure',
      },
      {
        name: 'Creative',
        icon: '🎨',
        style: 'Engaging and innovative',
        prompt: 'creative-engaging-style',
      },
      {
        name: 'Academic',
        icon: '🎓',
        style: 'Scholarly and detailed',
        prompt: 'academic-research-focused',
      },
      {
        name: 'Career Change',
        icon: '🚀',
        style: 'Emphasizing transferable skills',
        prompt: 'career-transition-focused',
      },
      {
        name: 'Internship',
        icon: '👨‍💼',
        style: 'Highlighting potential and eagerness',
        prompt: 'internship-entry-level',
      },
      {
        name: 'Referral-based',
        icon: '🤝',
        style: 'Building on personal connection',
        prompt: 'referral-recommendation-focused',
      },
    ];
  }

  saveToLocalStorage(coverLetters: GeneratedCoverLetter[]): void {
    try {
      localStorage.setItem('coverLetters', JSON.stringify(coverLetters));
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  }

  loadFromLocalStorage(): GeneratedCoverLetter[] {
    try {
      const data = localStorage.getItem('coverLetters');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading from local storage:', error);
      return [];
    }
  }

  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getFormattedDate(): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date().toLocaleDateString('en-US', options);
  }
}

export const coverLetterService = new CoverLetterService();
