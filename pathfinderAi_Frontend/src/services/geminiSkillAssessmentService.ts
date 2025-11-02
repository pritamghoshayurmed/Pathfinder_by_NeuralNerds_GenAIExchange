import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_SKILL_API_KEY;

interface AssessmentQuestion {
  id: string;
  skillId: string;
  question: string;
  options: string[];
  correct: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  explanation?: string;
}

class GeminiSkillAssessmentService {
  private genAI: GoogleGenerativeAI;
  private requestCounter = 0; // Add counter to ensure uniqueness

  constructor() {
    if (!API_KEY) {
      console.warn('⚠️ Gemini API key not found. Using fallback questions.');
    }
    this.genAI = new GoogleGenerativeAI(API_KEY || 'dummy-key');
  }

  async generateAssessmentQuestions(
    skillName: string,
    skillCategory: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' = 'intermediate',
    numberOfQuestions: number = 5
  ): Promise<AssessmentQuestion[]> {
    try {
      this.requestCounter++; // Increment counter for each request
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `You are an expert technical interviewer and skills assessor. Generate ${numberOfQuestions} UNIQUE multiple-choice assessment questions for evaluating proficiency in "${skillName}" (${skillCategory}).

CRITICAL: Each question MUST be completely different from any previous questions. Vary the topics, concepts, and aspects of ${skillName}.

IMPORTANT: Respond with ONLY valid JSON. No markdown, no explanations, just pure JSON.

Difficulty Level: ${difficulty}
Request ID: ${this.requestCounter}-${Date.now()} (Use this to ensure uniqueness)

Required JSON structure:
{
  "questions": [
    {
      "question": "Clear, specific question testing DIFFERENT aspect of ${skillName}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "difficulty": "${difficulty}",
      "explanation": "Brief explanation of why the correct answer is right (1-2 sentences)"
    }
  ]
}

Question Topics to Cover (choose ${numberOfQuestions} different ones):
${this.getQuestionTopics(skillName, skillCategory, difficulty)}

Guidelines:
1. Each question MUST test a DIFFERENT concept/topic in ${skillName}
2. Questions should test practical, real-world knowledge
3. All questions must have exactly 4 options
4. The correct answer index (0-3) must be accurate
5. Mix conceptual and practical questions
6. For ${difficulty} level:
   - beginner: Basic concepts, syntax, and definitions
   - intermediate: Application, problem-solving, and common patterns
   - advanced: Complex scenarios, best practices, and optimization
   - expert: Architecture, advanced patterns, and edge cases
7. Ensure questions are clear, unambiguous, and industry-relevant
8. Include brief explanations for learning purposes
9. VARY the question types: "What is...", "How do you...", "Which approach...", "When should you...", etc.

Generate exactly ${numberOfQuestions} DIFFERENT questions. Return ONLY the JSON object.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      console.log(`🤖 Gemini request #${this.requestCounter} for ${skillName}:`, text.substring(0, 150));

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

      const parsedData = JSON.parse(text);

      if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
        throw new Error('Invalid response structure from Gemini');
      }

      // Format and validate questions with unique IDs
      const questions: AssessmentQuestion[] = parsedData.questions.map((q: any, index: number) => ({
        id: `${skillName.toLowerCase().replace(/\s+/g, '-')}-${this.requestCounter}-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        skillId: skillName.toLowerCase().replace(/\s+/g, '-'),
        question: q.question || '',
        options: Array.isArray(q.options) ? q.options : [],
        correct: typeof q.correct === 'number' ? q.correct : 0,
        difficulty: q.difficulty || difficulty,
        explanation: q.explanation || ''
      }));

      console.log(`✅ Generated ${questions.length} UNIQUE questions for ${skillName}`);
      console.log(`   First question: ${questions[0]?.question.substring(0, 50)}...`);
      
      return questions;

    } catch (error) {
      console.error('❌ Error generating assessment questions:', error);
      
      // Return fallback questions
      return this.getFallbackQuestions(skillName, difficulty, numberOfQuestions);
    }
  }

  private getQuestionTopics(skillName: string, category: string, difficulty: string): string {
    const topicsByCategory: Record<string, string[]> = {
      'Programming Languages': [
        'Syntax and basic constructs',
        'Data structures and algorithms',
        'Object-oriented programming concepts',
        'Functional programming patterns',
        'Memory management',
        'Error handling and debugging',
        'Standard library usage',
        'Performance optimization',
        'Design patterns',
        'Concurrency and parallelism'
      ],
      'Web Development': [
        'HTML/CSS fundamentals',
        'JavaScript/TypeScript features',
        'DOM manipulation',
        'API integration',
        'State management',
        'Component architecture',
        'Performance optimization',
        'Security best practices',
        'Testing strategies',
        'Deployment and CI/CD'
      ],
      'Database': [
        'Query fundamentals',
        'Schema design',
        'Indexing strategies',
        'Transaction management',
        'Performance tuning',
        'Data modeling',
        'Backup and recovery',
        'Security and permissions',
        'Replication and scaling',
        'Query optimization'
      ],
      'Cloud & DevOps': [
        'Infrastructure concepts',
        'Containerization',
        'CI/CD pipelines',
        'Monitoring and logging',
        'Security practices',
        'Scalability patterns',
        'Cost optimization',
        'Disaster recovery',
        'Automation tools',
        'Service orchestration'
      ],
      'Default': [
        'Core concepts and principles',
        'Common use cases',
        'Best practices',
        'Problem-solving approaches',
        'Tool usage',
        'Integration patterns',
        'Performance considerations',
        'Security aspects',
        'Troubleshooting',
        'Advanced techniques'
      ]
    };

    const topics = topicsByCategory[category] || topicsByCategory['Default'];
    
    // Shuffle and return topics
    const shuffled = [...topics].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10).map((topic, i) => `${i + 1}. ${topic}`).join('\n');
  }

  private getFallbackQuestions(
    skillName: string,
    difficulty: string,
    count: number
  ): AssessmentQuestion[] {
    const fallbackQuestions: AssessmentQuestion[] = [];
    
    const questionTemplates = [
      {
        question: `What is the primary purpose of ${skillName}?`,
        options: [
          'To solve specific technical problems',
          'To provide a framework for development',
          'To optimize performance',
          'To ensure code quality'
        ],
        correct: 0,
        explanation: `Understanding the core purpose of ${skillName} is fundamental to using it effectively.`
      },
      {
        question: `Which scenario is ${skillName} best suited for?`,
        options: [
          'Large-scale enterprise applications',
          'Small prototype projects',
          'Performance-critical systems',
          'All of the above depending on context'
        ],
        correct: 3,
        explanation: `${skillName} can be applied in various contexts depending on requirements.`
      },
      {
        question: `What is a key advantage of using ${skillName}?`,
        options: [
          'Improved code maintainability',
          'Faster development time',
          'Better performance',
          'Enhanced security'
        ],
        correct: 0,
        explanation: `One of the main benefits of ${skillName} is improved code organization and maintainability.`
      },
      {
        question: `When working with ${skillName}, what is considered a best practice?`,
        options: [
          'Following established patterns and conventions',
          'Writing custom solutions for everything',
          'Avoiding documentation',
          'Minimizing code comments'
        ],
        correct: 0,
        explanation: `Following best practices and conventions leads to more maintainable code.`
      },
      {
        question: `How does ${skillName} handle common challenges in development?`,
        options: [
          'Through built-in features and patterns',
          'By requiring external libraries',
          'By avoiding the problems entirely',
          'Through manual implementation'
        ],
        correct: 0,
        explanation: `${skillName} typically provides built-in solutions for common development challenges.`
      }
    ];
    
    for (let i = 0; i < count; i++) {
      const template = questionTemplates[i % questionTemplates.length];
      fallbackQuestions.push({
        id: `${skillName.toLowerCase().replace(/\s+/g, '-')}-fallback-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        skillId: skillName.toLowerCase().replace(/\s+/g, '-'),
        question: template.question,
        options: template.options,
        correct: template.correct,
        difficulty: difficulty as any,
        explanation: template.explanation
      });
    }
    
    return fallbackQuestions;
  }

  // Cache management
  private questionCache = new Map<string, { questions: AssessmentQuestion[], timestamp: number }>();
  private CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

  async getCachedOrGenerateQuestions(
    skillName: string,
    skillCategory: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' = 'intermediate',
    numberOfQuestions: number = 5,
    forceRegenerate: boolean = false // Add option to force regeneration
  ): Promise<AssessmentQuestion[]> {
    // Create a more specific cache key that includes timestamp for uniqueness
    const cacheKey = `${skillName}-${difficulty}-${numberOfQuestions}-${forceRegenerate ? Date.now() : ''}`;
    const cached = this.questionCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION && !forceRegenerate) {
      console.log(`📦 Using cached questions for ${skillName}`);
      return cached.questions;
    }

    console.log(`🔄 Generating NEW questions for ${skillName}...`);
    
    const questions = await this.generateAssessmentQuestions(
      skillName,
      skillCategory,
      difficulty,
      numberOfQuestions
    );

    this.questionCache.set(cacheKey, {
      questions,
      timestamp: Date.now()
    });

    return questions;
  }

  clearCache() {
    this.questionCache.clear();
    console.log('🧹 Question cache cleared');
  }

  // Clear cache for specific skill
  clearSkillCache(skillName: string) {
    const keysToDelete: string[] = [];
    this.questionCache.forEach((_, key) => {
      if (key.startsWith(skillName)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.questionCache.delete(key));
    console.log(`🧹 Cache cleared for ${skillName} (${keysToDelete.length} entries)`);
  }
}

export default new GeminiSkillAssessmentService();
export type { AssessmentQuestion };