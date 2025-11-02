import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

export interface AISubCourse {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  jobRoles: string[];
  averageSalary: string;
  marketDemand: number;
  skills: string[];
  prerequisites?: string[];
  certification?: string;
  industryApplications: string[];
}

export interface AICourseData {
  mainCourse: string;
  description: string;
  color: string;
  subcourses: AISubCourse[];
  lastUpdated: string;
}

class GeminiCourseService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private cache: Map<string, AICourseData> = new Map();

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  }

  private createPrompt(courseName: string): string {
    return `You are an expert education consultant. Generate comprehensive subcourse information for "${courseName}".

Please provide a JSON response with the following structure:

{
  "mainCourse": "${courseName}",
  "description": "A comprehensive description of ${courseName} field",
  "subcourses": [
    {
      "id": "unique-id-1",
      "name": "Subcourse Name",
      "description": "Detailed description of what this subcourse covers",
      "duration": "X months to Y years",
      "difficulty": "Beginner|Intermediate|Advanced",
      "jobRoles": ["Role 1", "Role 2", "Role 3", "Role 4"],
      "averageSalary": "$XX,000 - $XX,000",
      "marketDemand": 85,
      "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
      "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
      "certification": "Popular certification name",
      "industryApplications": ["Industry 1", "Industry 2", "Industry 3"]
    }
  ]
}

Requirements:
- Generate 6-8 relevant subcourses for ${courseName}
- Include both traditional and emerging specializations
- Make job roles realistic and current (2024-2025)
- Salary ranges should be in USD and realistic
- Market demand should be 0-100 percentage
- Skills should include both technical and soft skills
- Include current industry trends and technologies
- Prerequisites should be realistic
- Certifications should be actual, recognized certifications
- Industry applications should be diverse and specific

Focus on current market trends, emerging technologies, and real career opportunities in ${courseName}.`;
  }

  async generateSubcourses(courseName: string): Promise<AICourseData> {
    // Check cache first
    const cacheKey = courseName.toLowerCase().replace(/\s+/g, '-');
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const prompt = this.createPrompt(courseName);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const courseData = JSON.parse(jsonMatch[0]);
      
      // Add metadata
      const finalData: AICourseData = {
        ...courseData,
        color: this.getCourseColor(courseName),
        lastUpdated: new Date().toISOString()
      };

      // Cache the result
      this.cache.set(cacheKey, finalData);
      
      return finalData;
    } catch (error) {
      console.error('Error generating subcourses:', error);
      
      // Fallback to default data if API fails
      return this.getFallbackData(courseName);
    }
  }

  private getCourseColor(courseName: string): string {
    const colors = {
      'computer science': '#3B82F6',
      'engineering': '#EF4444',
      'mechanical': '#EF4444',
      'electrical': '#F59E0B',
      'civil': '#10B981',
      'business': '#8B5CF6',
      'medicine': '#EC4899',
      'biology': '#10B981',
      'physics': '#6366F1',
      'chemistry': '#F59E0B',
      'mathematics': '#8B5CF6',
      'arts': '#F97316',
      'psychology': '#EC4899',
      'economics': '#3B82F6'
    };

    const lowerCourseName = courseName.toLowerCase();
    for (const [key, color] of Object.entries(colors)) {
      if (lowerCourseName.includes(key)) {
        return color;
      }
    }
    
    return '#3B82F6'; // Default blue
  }

  private getFallbackData(courseName: string): AICourseData {
    return {
      mainCourse: courseName,
      description: `A comprehensive program covering the fundamentals and advanced concepts of ${courseName}.`,
      color: this.getCourseColor(courseName),
      subcourses: [
        {
          id: 'fallback-1',
          name: 'Foundation & Core Concepts',
          description: `Introduction to fundamental concepts and principles of ${courseName}.`,
          duration: '6-12 months',
          difficulty: 'Beginner',
          jobRoles: ['Junior Specialist', 'Entry Level Analyst', 'Associate'],
          averageSalary: '$45,000 - $70,000',
          marketDemand: 75,
          skills: ['Problem Solving', 'Critical Thinking', 'Communication'],
          prerequisites: ['High School Diploma'],
          certification: 'Foundation Certificate',
          industryApplications: ['Technology', 'Education', 'Research']
        },
        {
          id: 'fallback-2',
          name: 'Advanced Applications',
          description: `Advanced topics and practical applications in ${courseName}.`,
          duration: '12-18 months',
          difficulty: 'Advanced',
          jobRoles: ['Senior Specialist', 'Lead Engineer', 'Project Manager'],
          averageSalary: '$70,000 - $120,000',
          marketDemand: 85,
          skills: ['Leadership', 'Project Management', 'Innovation'],
          prerequisites: ['Bachelor\'s Degree', 'Basic Experience'],
          certification: 'Professional Certificate',
          industryApplications: ['Industry', 'Consulting', 'Management']
        }
      ],
      lastUpdated: new Date().toISOString()
    };
  }

  // Method to clear cache if needed
  clearCache(): void {
    this.cache.clear();
  }

  // Method to get cached course names
  getCachedCourses(): string[] {
    return Array.from(this.cache.keys());
  }
}

export default new GeminiCourseService();
