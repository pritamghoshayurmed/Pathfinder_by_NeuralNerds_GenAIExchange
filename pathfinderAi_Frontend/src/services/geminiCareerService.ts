import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_CAREER_API_KEY;

interface CareerSkill {
  id: string;
  name: string;
  category: string;
  targetLevel: number;
  importance: 'High' | 'Medium' | 'Low';
  marketDemand: number;
  description: string;
}

interface CareerProfile {
  name: string;
  level: string;
  demand: string;
  salary: string;
  growth: string;
  description: string;
  keyResponsibilities: string[];
  skills: CareerSkill[];
}

class GeminiCareerService {
  private genAI: GoogleGenerativeAI;
  private careerCache = new Map<string, { profile: CareerProfile; timestamp: number }>();
  private CACHE_DURATION = 1000 * 60 * 60; // 1 hour

  constructor() {
    if (!API_KEY) {
      console.warn('⚠️ Gemini API key not found');
    }
    this.genAI = new GoogleGenerativeAI(API_KEY || 'dummy-key');
  }

  async generateCareerProfile(careerTarget: string): Promise<CareerProfile> {
    try {
      console.log(`🎯 Generating career profile for: ${careerTarget}`);

      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `You are a career counselor and industry expert. Generate a comprehensive career profile for: "${careerTarget}"

CRITICAL: Respond with ONLY valid JSON. No markdown, no explanations, just pure JSON.

Required JSON structure:
{
  "name": "${careerTarget}",
  "level": "Entry/Mid/Senior/Expert",
  "demand": "Low/Medium/High/Very High",
  "salary": "$XX,000 - $XXX,000 (annual range)",
  "growth": "+X% (projected growth rate)",
  "description": "Clear 1-2 sentence description of the role",
  "keyResponsibilities": [
    "Responsibility 1",
    "Responsibility 2",
    "Responsibility 3",
    "Responsibility 4"
  ],
  "skills": [
    {
      "name": "Skill name",
      "category": "Category (e.g., Programming, Database, Cloud, Design, etc.)",
      "targetLevel": 85,
      "importance": "High/Medium/Low",
      "marketDemand": 90,
      "description": "Brief description of why this skill matters"
    }
  ]
}

Guidelines:
1. Generate 8-12 relevant skills for ${careerTarget}
2. Target levels should be realistic (60-95 for most skills)
3. Market demand should reflect current industry trends (0-100)
4. Include mix of technical and soft skills where appropriate
5. Importance should reflect criticality for the role
6. Categories: Programming Languages, Frameworks, Database, Cloud, DevOps, Design, Soft Skills, Tools, Security, Testing, etc.
7. Salary ranges should be based on current market data (US market)
8. Growth projections should be realistic based on industry trends
9. Key responsibilities should be specific and actionable

Ensure all data is current, accurate, and industry-relevant. Return ONLY the JSON object.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      console.log('🤖 Gemini career profile response (first 200 chars):', text.substring(0, 200));

      // Clean JSON from markdown
      text = text.trim();
      if (text.startsWith('```json')) {
        text = text.replace(/```json\s*/, '').replace(/```\s*$/, '');
      } else if (text.startsWith('```')) {
        text = text.replace(/```\s*/, '').replace(/```\s*$/, '');
      }

      // Extract JSON object
      const startIndex = text.indexOf('{');
      const lastIndex = text.lastIndexOf('}');
      if (startIndex === -1 || lastIndex === -1) {
        throw new Error('No valid JSON found in response');
      }
      text = text.substring(startIndex, lastIndex + 1);

      const parsedData: CareerProfile = JSON.parse(text);

      // Add IDs to skills
      parsedData.skills = parsedData.skills.map((skill, index) => ({
        ...skill,
        id: skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }));

      console.log(`✅ Generated career profile with ${parsedData.skills.length} skills`);
      
      return parsedData;

    } catch (error) {
      console.error('❌ Error generating career profile:', error);
      return this.getFallbackCareerProfile(careerTarget);
    }
  }

  private getFallbackCareerProfile(careerTarget: string): CareerProfile {
    return {
      name: careerTarget,
      level: 'Mid-Level',
      demand: 'Medium',
      salary: '$60,000 - $100,000',
      growth: '+10%',
      description: `Professional role focused on ${careerTarget} with industry-standard responsibilities and skill requirements.`,
      keyResponsibilities: [
        `Execute ${careerTarget} related tasks`,
        'Collaborate with team members',
        'Deliver quality results',
        'Continuous learning and improvement'
      ],
      skills: [
        {
          id: 'core-skill-1',
          name: 'Core Technical Skill',
          category: 'Technical',
          targetLevel: 80,
          importance: 'High',
          marketDemand: 75,
          description: 'Fundamental technical skill required for the role'
        },
        {
          id: 'problem-solving',
          name: 'Problem Solving',
          category: 'Soft Skills',
          targetLevel: 85,
          importance: 'High',
          marketDemand: 90,
          description: 'Critical thinking and analytical abilities'
        },
        {
          id: 'communication',
          name: 'Communication',
          category: 'Soft Skills',
          targetLevel: 80,
          importance: 'High',
          marketDemand: 95,
          description: 'Effective verbal and written communication'
        }
      ]
    };
  }

  async getCachedOrGenerateProfile(careerTarget: string): Promise<CareerProfile> {
    const cacheKey = careerTarget.toLowerCase().trim();
    const cached = this.careerCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`📦 Using cached career profile for ${careerTarget}`);
      return cached.profile;
    }

    const profile = await this.generateCareerProfile(careerTarget);

    this.careerCache.set(cacheKey, {
      profile,
      timestamp: Date.now()
    });

    return profile;
  }

  clearCache() {
    this.careerCache.clear();
    console.log('🧹 Career profile cache cleared');
  }

  // Generate learning resources for a career
  async generateLearningResources(careerTarget: string, skills: string[]): Promise<any> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `Generate learning resources for "${careerTarget}" focusing on these skills: ${skills.join(', ')}

Respond with ONLY valid JSON:
{
  "courses": [
    {
      "name": "Course name",
      "provider": "Provider name",
      "duration": "X weeks/months",
      "rating": 4.8
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "difficulty": "Beginner/Intermediate/Advanced/Expert",
      "duration": "X weeks",
      "provider": "Self/Platform",
      "rating": 5
    }
  ],
  "certifications": [
    "Certification name 1",
    "Certification name 2"
  ]
}

Generate 3 courses, 3 projects, and 3-5 relevant certifications.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Clean and parse
      text = text.trim();
      if (text.startsWith('```json')) {
        text = text.replace(/```json\s*/, '').replace(/```\s*$/, '');
      } else if (text.startsWith('```')) {
        text = text.replace(/```\s*/, '').replace(/```\s*$/, '');
      }

      const startIndex = text.indexOf('{');
      const lastIndex = text.lastIndexOf('}');
      if (startIndex !== -1 && lastIndex !== -1) {
        text = text.substring(startIndex, lastIndex + 1);
        return JSON.parse(text);
      }

      throw new Error('Failed to parse learning resources');

    } catch (error) {
      console.error('❌ Error generating learning resources:', error);
      return {
        courses: [
          { name: 'Professional Development Course', provider: 'Online Platform', duration: '8 weeks', rating: 4.5 }
        ],
        projects: [
          { name: 'Capstone Project', difficulty: 'Intermediate', duration: '4 weeks', provider: 'Self', rating: 5 }
        ],
        certifications: ['Professional Certification']
      };
    }
  }
}

export default new GeminiCareerService();
export type { CareerProfile, CareerSkill };