interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code' | 'scenario';
  options?: string[];
  correctAnswer?: string;
  points: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  role: string;
  questions: QuizQuestion[];
  totalPoints: number;
  estimatedTime: number;
}

interface QuizAnswer {
  questionId: string;
  answer: string;
  timeSpent: number;
}

interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
  description: string;
}

interface MarketTrend {
  skill: string;
  demand: 'very-high' | 'high' | 'medium' | 'low';
  growth: string;
  salaryRange: string;
  futureOutlook: string;
}

interface LearningPath {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  resources: {
    type: 'course' | 'tutorial' | 'project' | 'certification' | 'article';
    title: string;
    provider: string;
    url?: string;
    duration: string;
  }[];
}

interface GapAnalysisResult {
  overallScore: number;
  skillGaps: SkillGap[];
  marketTrends: MarketTrend[];
  learningPaths: LearningPath[];
  recommendations: string[];
  nextSteps: string[];
}

class GeminiService {
  private apiKey: string;
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!this.apiKey) {
      throw new Error('Gemini API key not found in environment variables');
    }
  }

  private async makeRequest(prompt: string): Promise<string> {
    try {
      console.log('Making Gemini API request...');
      console.log('API Key exists:', !!this.apiKey);
      console.log('API Key length:', this.apiKey?.length);
      console.log('API URL:', this.apiUrl);

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API Error Response:', errorData);
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response received successfully');

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response format from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error making request to Gemini API:', error);
      throw error;
    }
  }

  async generateQuiz(role: string, skillLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'): Promise<Quiz> {
    const prompt = `You are a professional career counselor and technical interviewer. Generate a comprehensive skill assessment quiz for the role: "${role}" at ${skillLevel} level.

IMPORTANT: You must respond with ONLY valid JSON. No markdown, no explanations, just pure JSON.

Required JSON structure:
{
  "title": "string - Quiz title for ${role}",
  "description": "string - Brief description of what the quiz assesses",
  "questions": [
    {
      "id": "q1, q2, q3, etc.",
      "question": "string - Clear, specific question",
      "type": "multiple-choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "string - The correct option text",
      "points": 10,
      "difficulty": "${skillLevel}",
      "topic": "string - skill area"
    }
  ],
  "totalPoints": 100,
  "estimatedTime": 15
}

Requirements:
- Create exactly 10 questions
- All questions must be multiple-choice with 4 options each
- Questions should be relevant to ${role} role
- Mix of practical and theoretical questions
- Ensure questions test real job-related skills
- Make sure the JSON is perfectly valid and parseable

Return ONLY the JSON object, nothing else.`;

    try {
      const response = await this.makeRequest(prompt);

      // Clean the response to extract JSON
      let jsonString = response.trim();

      // Remove any markdown formatting if present
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/```json\s*/, '').replace(/```\s*$/, '');
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/```\s*/, '').replace(/```\s*$/, '');
      }

      // Find JSON object boundaries
      const startIndex = jsonString.indexOf('{');
      const lastIndex = jsonString.lastIndexOf('}');

      if (startIndex === -1 || lastIndex === -1) {
        throw new Error('No JSON object found in response');
      }

      jsonString = jsonString.substring(startIndex, lastIndex + 1);

      const quizData = JSON.parse(jsonString);

      // Validate the structure
      if (!quizData.title || !quizData.description || !Array.isArray(quizData.questions)) {
        throw new Error('Invalid quiz structure received from API');
      }

      return {
        id: `quiz_${Date.now()}`,
        role,
        ...quizData
      };
    } catch (error) {
      console.error('Error generating quiz:', error);

      // Return a fallback quiz for the role
      return this.getFallbackQuiz(role, skillLevel);
    }
  }

  private getFallbackQuiz(role: string, skillLevel: 'beginner' | 'intermediate' | 'advanced'): Quiz {
    const fallbackQuestions: QuizQuestion[] = [
      {
        id: 'q1',
        question: `What is the most important skill for a ${role}?`,
        type: 'multiple-choice',
        options: ['Technical Knowledge', 'Communication', 'Problem Solving', 'Leadership'],
        correctAnswer: 'Problem Solving',
        points: 10,
        difficulty: skillLevel,
        topic: 'Core Skills'
      },
      {
        id: 'q2',
        question: `Which tool is commonly used in ${role} roles?`,
        type: 'multiple-choice',
        options: ['Microsoft Word', 'Industry-specific software', 'Basic calculator', 'Notepad'],
        correctAnswer: 'Industry-specific software',
        points: 10,
        difficulty: skillLevel,
        topic: 'Tools & Technologies'
      },
      {
        id: 'q3',
        question: `What should you do when facing a complex problem in ${role} work?`,
        type: 'multiple-choice',
        options: ['Give up immediately', 'Break it down into smaller parts', 'Ask for complete solution', 'Ignore it'],
        correctAnswer: 'Break it down into smaller parts',
        points: 10,
        difficulty: skillLevel,
        topic: 'Problem Solving'
      },
      {
        id: 'q4',
        question: `Why is continuous learning important for ${role} professionals?`,
        type: 'multiple-choice',
        options: ['To get promotions only', 'Technology and methods evolve constantly', 'To impress colleagues', 'It\'s not important'],
        correctAnswer: 'Technology and methods evolve constantly',
        points: 10,
        difficulty: skillLevel,
        topic: 'Professional Development'
      },
      {
        id: 'q5',
        question: `What is a key soft skill for ${role} success?`,
        type: 'multiple-choice',
        options: ['Playing video games', 'Effective communication', 'Watching movies', 'Sleeping on time'],
        correctAnswer: 'Effective communication',
        points: 10,
        difficulty: skillLevel,
        topic: 'Soft Skills'
      }
    ];

    return {
      id: `fallback_quiz_${Date.now()}`,
      title: `${role} Skills Assessment`,
      description: `Basic skill assessment for ${role} position`,
      role,
      questions: fallbackQuestions,
      totalPoints: 50,
      estimatedTime: 10
    };
  }

  async analyzeQuizResults(
    role: string, 
    quiz: Quiz, 
    answers: QuizAnswer[]
  ): Promise<GapAnalysisResult> {
    // Calculate score and prepare data for analysis
    let totalScore = 0;
    let maxScore = quiz.totalPoints;
    
    const answerAnalysis = answers.map(answer => {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      return {
        question: question?.question || '',
        userAnswer: answer.answer,
        correctAnswer: question?.correctAnswer || '',
        topic: question?.topic || '',
        difficulty: question?.difficulty || 'intermediate',
        points: question?.points || 0
      };
    });

    const prompt = `You are a professional career counselor and technical interviewer. Analyze the quiz results for a ${role} candidate and provide comprehensive gap analysis.

IMPORTANT: You must respond with ONLY valid JSON. No markdown, no explanations, just pure JSON.

Quiz Performance Data:
${JSON.stringify(answerAnalysis, null, 2)}

Role: ${role}
Total Score: ${totalScore}/${maxScore}

Required JSON structure:
{
  "overallScore": ${Math.round((totalScore / maxScore) * 100)},
  "skillGaps": [
    {
      "skill": "Core Technical Skills",
      "currentLevel": 65,
      "requiredLevel": 85,
      "gap": 20,
      "priority": "high",
      "description": "Need to improve core technical competencies for ${role}"
    },
    {
      "skill": "Problem Solving",
      "currentLevel": 70,
      "requiredLevel": 80,
      "gap": 10,
      "priority": "medium",
      "description": "Develop analytical thinking and problem-solving abilities"
    }
  ],
  "marketTrends": [
    {
      "skill": "${role} Skills",
      "demand": "high",
      "growth": "+15%",
      "salaryRange": "₹8-15L",
      "futureOutlook": "Growing demand expected in the next 2-3 years"
    }
  ],
  "learningPaths": [
    {
      "title": "${role} Mastery Path",
      "description": "Comprehensive learning path to master core ${role} skills",
      "duration": "3-6 months",
      "difficulty": "intermediate",
      "resources": [
        {
          "type": "course",
          "title": "Complete ${role} Course",
          "provider": "Online Platform",
          "duration": "40 hours"
        },
        {
          "type": "project",
          "title": "Build ${role} Portfolio Project",
          "provider": "Self-paced",
          "duration": "20 hours"
        }
      ]
    }
  ],
  "recommendations": [
    "Focus on core technical skills development",
    "Practice with real-world projects",
    "Stay updated with industry trends",
    "Network with professionals in the field"
  ],
  "nextSteps": [
    "Start with recommended learning path",
    "Join relevant online communities",
    "Build a portfolio of projects",
    "Consider relevant certifications"
  ]
}

Return ONLY the JSON object, nothing else.`;

    try {
      const response = await this.makeRequest(prompt);

      // Clean the response to extract JSON
      let jsonString = response.trim();

      // Remove any markdown formatting if present
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/```json\s*/, '').replace(/```\s*$/, '');
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/```\s*/, '').replace(/```\s*$/, '');
      }

      // Find JSON object boundaries
      const startIndex = jsonString.indexOf('{');
      const lastIndex = jsonString.lastIndexOf('}');

      if (startIndex === -1 || lastIndex === -1) {
        throw new Error('No JSON object found in response');
      }

      jsonString = jsonString.substring(startIndex, lastIndex + 1);

      const analysisData = JSON.parse(jsonString);

      // Validate the structure
      if (!analysisData.skillGaps || !analysisData.marketTrends || !analysisData.learningPaths) {
        throw new Error('Invalid analysis structure received from API');
      }

      // Calculate actual score
      const calculatedScore = Math.round((totalScore / maxScore) * 100);

      return {
        ...analysisData,
        overallScore: calculatedScore
      };
    } catch (error) {
      console.error('Error analyzing quiz results:', error);

      // Return a fallback analysis
      return this.getFallbackAnalysis(role, totalScore, maxScore);
    }
  }

  private getFallbackAnalysis(role: string, totalScore: number, maxScore: number): GapAnalysisResult {
    const calculatedScore = Math.round((totalScore / maxScore) * 100);

    return {
      overallScore: calculatedScore,
      skillGaps: [
        {
          skill: 'Core Technical Skills',
          currentLevel: calculatedScore,
          requiredLevel: 85,
          gap: Math.max(0, 85 - calculatedScore),
          priority: calculatedScore < 60 ? 'high' : calculatedScore < 75 ? 'medium' : 'low',
          description: `Based on your score of ${calculatedScore}%, you need to focus on core technical competencies for ${role}`
        },
        {
          skill: 'Problem Solving',
          currentLevel: Math.max(50, calculatedScore - 10),
          requiredLevel: 80,
          gap: Math.max(0, 80 - (calculatedScore - 10)),
          priority: 'medium',
          description: 'Develop analytical thinking and problem-solving abilities'
        },
        {
          skill: 'Communication',
          currentLevel: Math.max(60, calculatedScore),
          requiredLevel: 75,
          gap: Math.max(0, 75 - calculatedScore),
          priority: 'low',
          description: 'Improve communication skills for better collaboration'
        }
      ],
      marketTrends: [
        {
          skill: role,
          demand: 'high',
          growth: '+15%',
          salaryRange: '₹8-15L',
          futureOutlook: 'Growing demand expected in the next 2-3 years'
        },
        {
          skill: 'Technical Skills',
          demand: 'very-high',
          growth: '+20%',
          salaryRange: '₹10-20L',
          futureOutlook: 'Strong growth due to digital transformation'
        }
      ],
      learningPaths: [
        {
          title: `${role} Mastery Path`,
          description: 'Comprehensive learning path to master core skills',
          duration: '3-6 months',
          difficulty: 'intermediate',
          resources: [
            {
              type: 'course',
              title: `Complete ${role} Course`,
              provider: 'Coursera',
              url: 'https://www.coursera.org/courses',
              duration: '40 hours'
            },
            {
              type: 'tutorial',
              title: `${role} Fundamentals - YouTube Playlist`,
              provider: 'YouTube',
              url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(`${role} tutorial`),
              duration: '10 hours'
            },
            {
              type: 'project',
              title: `Build ${role} Portfolio Project`,
              provider: 'GitHub',
              url: 'https://github.com/topics/' + role.toLowerCase().replace(/\s+/g, '-'),
              duration: '20 hours'
            },
            {
              type: 'certification',
              title: `${role} Professional Certificate`,
              provider: 'Google/IBM/Microsoft',
              url: 'https://www.coursera.org/professional-certificates',
              duration: '30 hours'
            },
            {
              type: 'article',
              title: `${role} Best Practices & Trends`,
              provider: 'Towards Data Science/Medium',
              url: 'https://towardsdatascience.com/tagged/' + role.toLowerCase().replace(/\s+/g, '-'),
              duration: '5 hours'
            }
          ]
        }
      ],
      recommendations: [
        'Focus on core technical skills development',
        'Practice with real-world projects',
        'Stay updated with industry trends',
        'Network with professionals in the field',
        'Consider relevant certifications'
      ],
      nextSteps: [
        'Start with recommended learning path',
        'Join relevant online communities',
        'Build a portfolio of projects',
        'Schedule regular practice sessions'
      ]
    };
  }

  async getMarketTrends(role: string): Promise<MarketTrend[]> {
    const prompt = `You are a professional career counselor. Provide current market trends and insights for the role: "${role}".

IMPORTANT: You must respond with ONLY valid JSON array. No markdown, no explanations, just pure JSON.

Required JSON structure:
[
  {
    "skill": "skill_name",
    "demand": "very-high",
    "growth": "+15%",
    "salaryRange": "₹8-15L",
    "futureOutlook": "brief_future_prediction"
  }
]

Focus on top 5-8 most relevant skills for ${role} in India.
Return ONLY the JSON array, nothing else.`;

    try {
      const response = await this.makeRequest(prompt);

      // Clean the response to extract JSON
      let jsonString = response.trim();

      // Remove any markdown formatting if present
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/```json\s*/, '').replace(/```\s*$/, '');
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/```\s*/, '').replace(/```\s*$/, '');
      }

      // Find JSON array boundaries
      const startIndex = jsonString.indexOf('[');
      const lastIndex = jsonString.lastIndexOf(']');

      if (startIndex === -1 || lastIndex === -1) {
        throw new Error('No JSON array found in response');
      }

      jsonString = jsonString.substring(startIndex, lastIndex + 1);

      const trendsData = JSON.parse(jsonString);

      // Validate the structure
      if (!Array.isArray(trendsData)) {
        throw new Error('Invalid trends structure received from API');
      }

      return trendsData;
    } catch (error) {
      console.error('Error getting market trends:', error);

      // Return fallback market trends
      return this.getFallbackMarketTrends(role);
    }
  }

  private getFallbackMarketTrends(role: string): MarketTrend[] {
    return [
      {
        skill: role,
        demand: 'high',
        growth: '+15%',
        salaryRange: '₹8-15L',
        futureOutlook: 'Growing demand expected in the next 2-3 years'
      },
      {
        skill: 'Technical Skills',
        demand: 'very-high',
        growth: '+20%',
        salaryRange: '₹10-20L',
        futureOutlook: 'Strong growth due to digital transformation'
      },
      {
        skill: 'Problem Solving',
        demand: 'high',
        growth: '+12%',
        salaryRange: '₹6-12L',
        futureOutlook: 'Essential skill across all industries'
      },
      {
        skill: 'Communication',
        demand: 'high',
        growth: '+10%',
        salaryRange: '₹5-10L',
        futureOutlook: 'Increasing importance in remote work environments'
      }
    ];
  }
}

export default new GeminiService();
export type { Quiz, QuizQuestion, QuizAnswer, GapAnalysisResult, SkillGap, MarketTrend, LearningPath };