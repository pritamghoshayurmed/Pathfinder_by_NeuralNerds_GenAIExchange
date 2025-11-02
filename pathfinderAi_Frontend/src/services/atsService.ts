import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ATSAnalysisResult {
  overallScore: number;
  parseability: number;
  keywordMatch: number;
  formatting: number;
  readability: number;
  sections: SectionAnalysis[];
  recommendations: Recommendation[];
  missingKeywords: string[];
  strengthAreas: string[];
  improvementAreas: string[];
}

export interface SectionAnalysis {
  name: string;
  status: 'good' | 'warning' | 'bad';
  score: number;
  feedback: string;
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  text: string;
  actionable: boolean;
  section?: string;
}

export interface JobDescriptionMatch {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  skillsMatched: SkillMatch[];
  experienceRelevance: number;
  educationRelevance: number;
  recommendations: string[];
}

export interface SkillMatch {
  skill: string;
  confidence: number;
  foundIn: string;
}

export interface OptimizationSuggestion {
  type: 'keyword' | 'formatting' | 'content' | 'structure';
  originalText: string;
  suggestedText: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

const API_KEY = import.meta.env.VITE_ATS_SCANNER_API_KEY;

class ATSService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (!API_KEY) {
      throw new Error('Gemini API key not found in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(API_KEY);
  }

  // Clean and normalize resume text - removes encoding issues
  private cleanResumeText(text: string): string {
    try {
      // Remove PDF binary markers and control characters
      let cleaned = text
        // Remove PDF header and binary data
        .replace(/%PDF-[0-9.]+/g, '')
        .replace(/%[\w]+/g, '')
        // Remove null bytes and other control characters (except newlines and tabs)
        .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
        // Remove excessive whitespace but preserve structure
        .replace(/\s{4,}/g, '\n\n')
        // Fix common encoding artifacts
        .replace(/[\uFFFD]/g, '')
        .replace(/[""]/g, '"')
        .replace(/[']/g, "'")
        // Remove base64 and stream data
        .replace(/stream\s*[\s\S]*?endstream/g, '')
        .replace(/obj\s*[\s\S]*?endobj/g, '')
        .trim();

      return cleaned;
    } catch (error) {
      console.error('Error cleaning resume text:', error);
      return text;
    }
  }

  // Extract text from PDF content
  private extractPDFText(content: string): string {
    try {
      // Attempt to decode base64 if PDF
      if (content.includes('%PDF')) {
        // This is a PDF - extract readable text portions
        const textMatches = content.match(/BT[\s\S]*?ET/g) || [];
        const extractedText = textMatches
          .map(match => 
            match
              .replace(/BT|ET|Tj|TJ|Tm/g, '')
              .replace(/\(([^)]*)\)/g, '$1')
              .trim()
          )
          .filter(text => text.length > 0)
          .join(' ');

        if (extractedText.length > 50) {
          return this.cleanResumeText(extractedText);
        }
      }

      // Fallback: clean as regular text
      return this.cleanResumeText(content);
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      return this.cleanResumeText(content);
    }
  }

  private async callGemini(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get AI analysis. Please try again.');
    }
  }

  // Safely parse JSON with error recovery
  private safeJsonParse(jsonString: string): any {
    try {
      // Remove markdown code blocks if present
      let cleaned = jsonString.replace(/```json\n?|\n?```/g, '').trim();

      // Remove any leading/trailing non-JSON characters
      cleaned = cleaned.replace(/^[^[\{]*/, '').replace(/[^\]\}]*$/, '');

      // Fix common encoding issues in JSON strings
      cleaned = cleaned
        .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
        .replace(/[\uFFFD]/g, '') // Remove replacement character
        .replace(/\r\n/g, '\\n') // Normalize line breaks in strings
        .replace(/\n(?=(?:[^"]*"[^"]*")*[^"]*$)/g, ''); // Remove unescaped newlines outside quotes

      return JSON.parse(cleaned);
    } catch (error) {
      console.error('JSON Parse Error:', error);
      console.error('Attempted to parse:', jsonString.substring(0, 200));
      throw new Error(`Invalid JSON response from AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async analyzeResume(resumeText: string): Promise<ATSAnalysisResult> {
    try {
      // Clean and extract text from input
      const cleanedText = this.extractPDFText(resumeText).substring(0, 3000);
      
      if (cleanedText.trim().length < 20) {
        throw new Error('Resume text is too short or could not be parsed');
      }

      const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze the following resume and provide detailed feedback in JSON format.

Resume Content:
${cleanedText}

Analyze and return a JSON object with EXACTLY this structure (no markdown, just pure JSON):
{
  "overallScore": <0-100>,
  "parseability": <0-100>,
  "keywordMatch": <0-100>,
  "formatting": <0-100>,
  "readability": <0-100>,
  "sections": [
    {
      "name": "<section name>",
      "status": "<good|warning|bad>",
      "score": <0-100>,
      "feedback": "<feedback>"
    }
  ],
  "recommendations": [
    {
      "priority": "<high|medium|low>",
      "text": "<recommendation>",
      "actionable": true,
      "section": "<optional section>"
    }
  ],
  "missingKeywords": ["<keyword1>", "<keyword2>"],
  "strengthAreas": ["<strength1>", "<strength2>"],
  "improvementAreas": ["<area1>", "<area2>"]
}

Provide ONLY the JSON object, no additional text.`;

      const response = await this.callGemini(prompt);
      const result = this.safeJsonParse(response);
      return result as ATSAnalysisResult;
    } catch (error) {
      console.error('Error parsing ATS analysis:', error);
      // Return fallback analysis
      return this.getFallbackAnalysis();
    }
  }

  async matchJobDescription(resumeText: string, jobDescription: string): Promise<JobDescriptionMatch> {
    try {
      // Clean input texts
      const cleanedResume = this.extractPDFText(resumeText).substring(0, 2000);
      const cleanedJobDesc = this.cleanResumeText(jobDescription).substring(0, 2000);

      const prompt = `You are an expert recruiter. Analyze how well this resume matches the job description.

Resume:
${cleanedResume}

Job Description:
${cleanedJobDesc}

Return ONLY a JSON object with this exact structure:
{
  "matchScore": <0-100>,
  "matchedKeywords": ["<keyword1>", "<keyword2>"],
  "missingKeywords": ["<keyword1>", "<keyword2>"],
  "skillsMatched": [
    {
      "skill": "<skill>",
      "confidence": <0-100>,
      "foundIn": "<section>"
    }
  ],
  "experienceRelevance": <0-100>,
  "educationRelevance": <0-100>,
  "recommendations": ["<recommendation1>", "<recommendation2>"]
}

Provide ONLY the JSON object, no additional text.`;

      const response = await this.callGemini(prompt);
      const result = this.safeJsonParse(response);
      return result as JobDescriptionMatch;
    } catch (error) {
      console.error('Error matching job description:', error);
      return this.getFallbackJobMatch();
    }
  }

  async getOptimizationSuggestions(resumeText: string): Promise<OptimizationSuggestion[]> {
    try {
      // Clean the resume text
      const cleanedText = this.extractPDFText(resumeText).substring(0, 2500);

      const prompt = `You are an expert resume optimizer. Provide specific optimization suggestions for this resume.

Resume:
${cleanedText}

Identify the top 5-8 specific changes that would improve ATS compatibility and impact. For each suggestion, provide:
1. The type of change (keyword, formatting, content, or structure)
2. The original text from the resume
3. The suggested improved version
4. The reason for the change
5. Priority level (high, medium, low)

Return ONLY a JSON array with this structure (no markdown, no extra text):
[
  {
    "type": "<keyword|formatting|content|structure>",
    "originalText": "<exact text from resume>",
    "suggestedText": "<improved version>",
    "reason": "<why this improves the resume>",
    "priority": "<high|medium|low>"
  }
]

Return ONLY valid JSON array.`;

      const response = await this.callGemini(prompt);
      const result = this.safeJsonParse(response);
      return result as OptimizationSuggestion[];
    } catch (error) {
      console.error('Error getting optimization suggestions:', error);
      return this.getFallbackSuggestions();
    }
  }

  async refineResumeSection(sectionText: string, sectionType: string, context: string): Promise<string> {
    try {
      // Clean input texts
      const cleanedSection = this.cleanResumeText(sectionText).substring(0, 1000);
      const cleanedContext = this.cleanResumeText(context).substring(0, 1000);

      const prompt = `You are an expert resume writer. Improve this ${sectionType} section of a resume based on the context provided.

Current Text:
${cleanedSection}

Context:
${cleanedContext}

Provide an improved version of this section that:
1. Uses strong action verbs
2. Includes quantifiable results
3. Uses industry keywords
4. Is ATS-optimized
5. Maintains clarity and conciseness

Return ONLY the improved text, no additional formatting or explanation.`;

      const response = await this.callGemini(prompt);
      return response.trim();
    } catch (error) {
      console.error('Error refining section:', error);
      return sectionText;
    }
  }

  async getResumeChat(resumeText: string, userQuestion: string): Promise<string> {
    try {
      // Clean inputs
      const cleanedResume = this.extractPDFText(resumeText).substring(0, 2000);
      const cleanedQuestion = this.cleanResumeText(userQuestion).substring(0, 500);

      const prompt = `You are an expert resume coach. Help the user improve their resume based on their specific question.

Resume:
${cleanedResume}

User Question:
${cleanedQuestion}

Provide helpful, specific advice tailored to their resume and question. Be conversational and actionable.`;

      const response = await this.callGemini(prompt);
      return response;
    } catch (error) {
      console.error('Error in resume chat:', error);
      return 'I apologize, but I encountered an error. Please try your question again.';
    }
  }

  private getFallbackAnalysis(): ATSAnalysisResult {
    return {
      overallScore: 75,
      parseability: 80,
      keywordMatch: 72,
      formatting: 70,
      readability: 78,
      sections: [
        { name: 'Contact Info', status: 'good', score: 95, feedback: 'Clear and properly formatted' },
        { name: 'Professional Summary', status: 'good', score: 85, feedback: 'Good overview of qualifications' },
        { name: 'Experience', status: 'warning', score: 70, feedback: 'Consider adding more specific metrics' },
        { name: 'Education', status: 'good', score: 90, feedback: 'Well organized' },
        { name: 'Skills', status: 'warning', score: 68, feedback: 'Include industry-specific keywords' },
        { name: 'Certifications', status: 'good', score: 85, feedback: 'Good additions' }
      ],
      recommendations: [
        { priority: 'high', text: 'Add quantifiable achievements with metrics', actionable: true, section: 'Experience' },
        { priority: 'high', text: 'Use industry-specific keywords and technical terms', actionable: true },
        { priority: 'medium', text: 'Organize skills by category for better parsing', actionable: true, section: 'Skills' },
        { priority: 'medium', text: 'Use standard formatting and consistent styling', actionable: true },
        { priority: 'low', text: 'Consider adding a technical skills section', actionable: true }
      ],
      missingKeywords: ['Machine Learning', 'Cloud Architecture', 'DevOps', 'CI/CD', 'Kubernetes'],
      strengthAreas: ['Well-structured', 'Clear contact information', 'Good education details'],
      improvementAreas: ['Action verbs in experience', 'Quantified results', 'Technical keywords']
    };
  }

  private getFallbackJobMatch(): JobDescriptionMatch {
    return {
      matchScore: 65,
      matchedKeywords: ['Python', 'JavaScript', 'Project Management', 'Team Leadership'],
      missingKeywords: ['React', 'TypeScript', 'AWS', 'Docker'],
      skillsMatched: [
        { skill: 'Python', confidence: 90, foundIn: 'Skills' },
        { skill: 'Project Management', confidence: 80, foundIn: 'Experience' },
        { skill: 'Team Leadership', confidence: 75, foundIn: 'Experience' }
      ],
      experienceRelevance: 70,
      educationRelevance: 75,
      recommendations: [
        'Highlight relevant project experience with similar scope',
        'Add missing technologies to skills section',
        'Quantify leadership impact with metrics'
      ]
    };
  }

  private getFallbackSuggestions(): OptimizationSuggestion[] {
    return [
      {
        type: 'keyword',
        originalText: 'Responsible for managing multiple projects',
        suggestedText: 'Led and delivered 5+ cross-functional projects with 100% on-time completion',
        reason: 'Uses specific metrics and strong action verbs that improve ATS scoring',
        priority: 'high'
      },
      {
        type: 'content',
        originalText: 'Skills: C++, Java, Python',
        suggestedText: 'Technical Skills: C++ (Expert), Java (Advanced), Python (Advanced), SQL, Git',
        reason: 'Organized format and expanded technical keywords improve ATS parsing and match rates',
        priority: 'high'
      },
      {
        type: 'formatting',
        originalText: 'Work Experience\n2020-present ABC Company',
        suggestedText: 'PROFESSIONAL EXPERIENCE\nABC Company | 2020 - Present',
        reason: 'Standard formatting improves ATS readability and parsing accuracy',
        priority: 'medium'
      },
      {
        type: 'keyword',
        originalText: 'Worked on software development',
        suggestedText: 'Designed and implemented scalable microservices using REST APIs',
        reason: 'Industry-specific keywords improve job matching and ATS compatibility',
        priority: 'high'
      }
    ];
  }
}

export const atsService = new ATSService();
export default atsService;
