import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface CourseData {
  id: string;
  name: string;
  category: string;
  level: string;
  duration: string;
  description: string;
  skills: Array<{
    skill: string;
    level: number;
    current: number;
    status: string;
  }>;
  trends: Array<{
    skill: string;
    demand: number;
    growth: string;
  }>;
}

export interface CourseSearchResult {
  id: string;
  name: string;
  category: string;
  level: string;
  duration: string;
  description: string;
}

export class GeminiSkillGapService {
  private model = genAI.getGenerativeModel({ model: 'gemini-flash-2.5' });

  /**
   * Search for courses based on user query
   */
  async searchCourses(query: string, limit: number = 5): Promise<CourseSearchResult[]> {
    try {
      const prompt = `
        You are a course search expert. Based on the search query: "${query}"
        
        Please provide ${limit} relevant courses that match this search. Return a JSON array with the following structure:
        [
          {
            "id": "unique-course-id",
            "name": "Course Name",
            "category": "Category (e.g., Development, Design, Marketing, Data Science, Business)",
            "level": "Beginner/Intermediate/Advanced",
            "duration": "X months/weeks",
            "description": "Brief 1-2 sentence description of what the course covers"
          }
        ]
        
        Make sure the courses are diverse, realistic, and directly related to the search query.
        The course names should be specific and professional.
        Categories should be one of: Development, Design, Marketing, Data Science, Business, Security, Infrastructure, AI/ML
        
        Return only the JSON array, no additional text.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response
      const courses = JSON.parse(text.trim()) as Array<{
        id?: string;
        name?: string;
        category?: string;
        level?: string;
        duration?: string;
        description?: string;
      }>;
      
      // Add unique IDs and validate structure
      return courses.map((course, index: number) => ({
        id: course.id || `course-${Date.now()}-${index}`,
        name: course.name || 'Unnamed Course',
        category: course.category || 'General',
        level: course.level || 'Intermediate',
        duration: course.duration || '4 weeks',
        description: course.description || 'Course description not available'
      }));
      
    } catch (error) {
      console.error('Error searching courses:', error);
      throw new Error('Failed to search courses. Please try again.');
    }
  }

  /**
   * Get detailed skill analysis for a specific course
   */
  async getCourseSkillAnalysis(courseName: string, courseDescription?: string): Promise<CourseData> {
    try {
      const prompt = `
        You are a skill assessment expert. For the course: "${courseName}"
        ${courseDescription ? `Description: ${courseDescription}` : ''}
        
        Please provide a comprehensive skill analysis in the following JSON format:
        {
          "id": "unique-course-id",
          "name": "${courseName}",
          "category": "Category",
          "level": "Beginner/Intermediate/Advanced",
          "duration": "X months",
          "description": "Detailed course description",
          "skills": [
            {
              "skill": "Skill Name",
              "level": 85,
              "current": 45,
              "status": "gap"
            }
          ],
          "trends": [
            {
              "skill": "Trending Skill",
              "demand": 90,
              "growth": "+30%"
            }
          ]
        }
        
        Guidelines:
        - Include 6-8 key skills required for this course
        - Level: Required proficiency level (0-100)
        - Current: Assume user's current level (vary between 20-80)
        - Status: "strong" (current >= level), "developing" (current >= level-20), "gap" (current >= level-40), "critical" (current < level-40)
        - Include 3-4 market trends related to the course skills
        - Demand: Market demand percentage (0-100)
        - Growth: Expected growth rate
        - Make the assessment realistic and industry-relevant
        
        Return only the JSON object, no additional text.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response
      const courseData = JSON.parse(text.trim());
      
      // Ensure proper structure and add fallbacks
      return {
        id: courseData.id || `course-${Date.now()}`,
        name: courseData.name || courseName,
        category: courseData.category || 'General',
        level: courseData.level || 'Intermediate',
        duration: courseData.duration || '4 months',
        description: courseData.description || 'Course description not available',
        skills: courseData.skills || [],
        trends: courseData.trends || []
      };
      
    } catch (error) {
      console.error('Error analyzing course skills:', error);
      throw new Error('Failed to analyze course skills. Please try again.');
    }
  }

  /**
   * Get course categories for filtering
   */
  async getCourseCategories(): Promise<string[]> {
    return [
      'Development',
      'Design', 
      'Marketing',
      'Data Science',
      'Business',
      'Security',
      'Infrastructure',
      'AI/ML'
    ];
  }

  /**
   * Get course levels for filtering
   */
  async getCourseLevels(): Promise<string[]> {
    return ['Beginner', 'Intermediate', 'Advanced'];
  }
}

export const geminiSkillGapService = new GeminiSkillGapService();