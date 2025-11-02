import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface SystemDesignQuestion {
  title: string;
  description: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  constraints: string[];
  scalability: string;
  architecture: string;
}

class GeminiSystemDesignService {
  private genAI: GoogleGenerativeAI;
  private questionCache = new Map<string, { question: SystemDesignQuestion; timestamp: number }>();
  private CACHE_DURATION = 1000 * 60 * 60; // 1 hour

  constructor() {
    if (!API_KEY) {
      console.warn('⚠️ Gemini API key not found');
    }
    this.genAI = new GoogleGenerativeAI(API_KEY || 'dummy-key');
  }

  async generateSystemDesignQuestion(): Promise<SystemDesignQuestion> {
    try {
      console.log('🏗️ Generating system design question...');

      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const systemDesignPrompts = [
        'Design a URL Shortener Service (like bit.ly)',
        'Design a Social Media Feed',
        'Design a Video Streaming Platform (like YouTube)',
        'Design a Real-time Chat Application',
        'Design an E-commerce Shopping Cart and Checkout System',
        'Design a Ride-Sharing Application (like Uber)',
        'Design a Hotel Booking System',
        'Design a Distributed Cache (like Redis)',
        'Design a Message Queue System',
        'Design a Rate Limiter',
        'Design a Search Engine',
        'Design a File Sharing System (like Google Drive)',
        'Design a Payment Processing System',
        'Design a Notification System',
        'Design a Recommendation Engine',
      ];

      // Random selection for diversity
      const selectedPrompt = systemDesignPrompts[Math.floor(Math.random() * systemDesignPrompts.length)];

      const prompt = `You are a senior system design expert and tech interviewer. Generate a comprehensive system design interview question.

Theme: "${selectedPrompt}"

CRITICAL: Respond with ONLY valid JSON. No markdown, no explanations, just pure JSON.

Required JSON structure (ensure all fields are present):
{
  "title": "A clear, concise title for the system design problem",
  "description": "A detailed 2-3 sentence description of the system to be designed",
  "functionalRequirements": [
    "List of 4-6 core functional requirements",
    "Each as a complete sentence",
    "Examples: Generate short URLs, Redirect to original URLs, etc."
  ],
  "nonFunctionalRequirements": [
    "List of 4-5 non-functional requirements with metrics",
    "Each as a complete sentence with specific numbers",
    "Examples: Support 100M URLs, <100ms latency, 99.9% uptime, etc."
  ],
  "constraints": [
    "List of 3-4 important constraints or considerations",
    "Each as a concise statement"
  ],
  "scalability": "A 1-2 sentence description of the scalability challenges and considerations",
  "architecture": "A 1-2 sentence high-level overview of the suggested architecture approach"
}

Ensure:
1. The question is realistic and asked in real tech interviews
2. Requirements are specific with measurable metrics
3. All arrays contain at least the minimum number of items specified
4. The JSON is valid and properly formatted
5. No extra fields or markdown formatting
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Parse JSON response
      let jsonText = responseText.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.substring(7);
      }
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.substring(3);
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.substring(0, jsonText.length - 3);
      }

      const parsedQuestion = JSON.parse(jsonText.trim()) as SystemDesignQuestion;

      // Validate required fields
      if (!parsedQuestion.title || !parsedQuestion.description || 
          !parsedQuestion.functionalRequirements || !parsedQuestion.nonFunctionalRequirements) {
        throw new Error('Invalid system design question structure');
      }

      console.log('✅ System design question generated:', parsedQuestion.title);
      return parsedQuestion;
    } catch (error) {
      console.error('❌ Error generating system design question:', error);
      throw error;
    }
  }

  async generateSystemDesignQuestionWithCache(): Promise<SystemDesignQuestion> {
    try {
      // Use a fixed cache key for the session
      const cacheKey = 'current-session-question';
      
      // Check if cached and still valid
      const cached = this.questionCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        console.log('📦 Using cached system design question');
        return cached.question;
      }

      // Generate new question
      const question = await this.generateSystemDesignQuestion();
      
      // Cache the question
      this.questionCache.set(cacheKey, {
        question,
        timestamp: Date.now()
      });

      return question;
    } catch (error) {
      console.error('❌ Error in generateSystemDesignQuestionWithCache:', error);
      throw error;
    }
  }

  clearCache(): void {
    this.questionCache.clear();
    console.log('🧹 System design question cache cleared');
  }
}

export default new GeminiSystemDesignService();
