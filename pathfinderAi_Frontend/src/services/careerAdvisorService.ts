import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';

const API_KEY = import.meta.env.VITE_CAREER_ADVISORY_API_KEY;

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface LearningPathStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  duration: string;
  resources: {
    type: string;
    title: string;
    url?: string;
  }[];
  skills: string[];
  projects: string[];
  milestones: string[];
}

export interface CareerSummary {
  careerGoal: string;
  keyInterests: string[];
  currentLevel: string;
  targetRole: string;
  timeframe: string;
  learningPath: LearningPathStep[];
}

export interface DetailedLearningPath {
  career: string;
  overview: string;
  totalDuration: string;
  difficulty: string;
  prerequisites: string[];
  outcomes: string[];
  phases: LearningPathStep[];
  certifications: string[];
  jobMarket: {
    averageSalary: string;
    demandLevel: string;
    topCompanies: string[];
    requiredSkills: string[];
  };
}

export interface SavedLearningPath {
  id: string;
  user_id: string;
  career_goal: string;
  key_interests: string[];
  current_level: string;
  target_role: string;
  timeframe: string;
  career_overview: string;
  total_duration: string;
  difficulty: string;
  prerequisites: string[];
  outcomes: string[];
  phases: LearningPathStep[];
  certifications: string[];
  job_market: {
    averageSalary: string;
    demandLevel: string;
    topCompanies: string[];
    requiredSkills: string[];
  };
  conversation_messages?: Message[];
  created_at: string;
  updated_at: string;
}

class CareerAdvisorService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(API_KEY);
  }

  /**
   * Check if message contains thank you or goodbye phrases
   */
  isThankYouMessage(message: string): boolean {
    const thankYouPhrases = [
      'thank you',
      'thank',
      'thanks',
      'thank u',
      'thx',
      'ty',
      'appreciate it',
      'grateful',
      "that's all",
      'bye',
      'goodbye',
      'generate a learning path',
      'create a learning path',
      'that will be all'
    ];
    
    const lowerMessage = message.toLowerCase().trim();
    return thankYouPhrases.some(phrase => lowerMessage.includes(phrase));
  }

  /**
   * Generate AI response for conversation
   */
  async generateAIResponse(userMessage: string, conversationHistory: Message[]): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const conversationContext = conversationHistory
        .slice(-6) // Keep last 3 exchanges for context
        .map(msg => `${msg.role === 'user' ? 'User' : 'PathFinder AI'}: ${msg.content}`)
        .join('\n');

      const prompt = `You are PathFinder AI, a warm, empathetic AI Career Advisor.

Previous conversation:
${conversationContext}

User: ${userMessage}

Provide helpful, conversational response (3-5 sentences):`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Clean up response
      text = text
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/#{1,6}\s/g, '')
        .trim();

      return text;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I apologize, but I'm having technical difficulties. Could you please repeat that?";
    }
  }

  /**
   * Generate career summary from conversation
   */
  async generateCareerSummary(messages: Message[]): Promise<CareerSummary> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const conversationHistory = messages
        .map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
        .join('\n');

      const prompt = `Analyze the following career counseling conversation and extract key information.

CONVERSATION:
${conversationHistory}

Extract and provide ONLY valid JSON (no markdown, no code blocks):

{
  "careerGoal": "Clear career goal from conversation",
  "keyInterests": ["Interest 1", "Interest 2", "Interest 3"],
  "currentLevel": "Beginner/Intermediate/Advanced",
  "targetRole": "Specific job title",
  "timeframe": "6 months/1 year/2 years",
  "learningPath": []
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();

      if (text.startsWith('```')) {
        text = text.replace(/```json\s*/, '').replace(/```\s*$/, '').replace(/```\s*/, '');
      }

      const startIndex = text.indexOf('{');
      const lastIndex = text.lastIndexOf('}');
      if (startIndex !== -1 && lastIndex !== -1) {
        text = text.substring(startIndex, lastIndex + 1);
      }

      const summary: CareerSummary = JSON.parse(text);
      return summary;

    } catch (error) {
      console.error('Error generating career summary:', error);
      return {
        careerGoal: "Career Development",
        keyInterests: ["Professional Growth"],
        currentLevel: "Intermediate",
        targetRole: "Career Professional",
        timeframe: "1 year",
        learningPath: []
      };
    }
  }

  /**
   * Generate detailed learning path based on career summary
   */
  async generateDetailedLearningPath(summary: CareerSummary): Promise<DetailedLearningPath> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `Create a COMPREHENSIVE, MULTI-PHASE learning path for: ${summary.targetRole}

CONTEXT:
- Career Goal: ${summary.careerGoal}
- Current Level: ${summary.currentLevel}
- Key Interests: ${summary.keyInterests.join(', ')}
- Timeframe: ${summary.timeframe}

CRITICAL REQUIREMENTS:
1. You MUST create EXACTLY 5-6 progressive learning phases
2. Each phase must build upon the previous one
3. Each phase must include ALL required fields
4. Be SPECIFIC with course names, books, and resources
5. Include realistic timeframes for each phase

Provide ONLY valid JSON (no markdown, no code blocks, no explanations):

{
  "career": "${summary.targetRole}",
  "overview": "An engaging 2-3 sentence description of this career path and its opportunities",
  "totalDuration": "${summary.timeframe}",
  "difficulty": "${summary.currentLevel === 'Beginner' ? 'Beginner-Friendly' : summary.currentLevel === 'Advanced' ? 'Advanced' : 'Intermediate'}",
  "prerequisites": [
    "Basic computer literacy",
    "English proficiency",
    "Time commitment of X hours/week"
  ],
  "outcomes": [
    "Specific technical skill 1",
    "Specific technical skill 2", 
    "Build professional portfolio",
    "Job-ready for ${summary.targetRole}",
    "Earn competitive salary"
  ],
  "phases": [
    {
      "id": "phase-1",
      "phase": "Foundation",
      "title": "Building Strong Fundamentals",
      "description": "Start your journey by mastering the core concepts and foundational skills needed for ${summary.targetRole}",
      "duration": "3-4 weeks",
      "skills": [
        "Fundamental Skill 1",
        "Fundamental Skill 2",
        "Fundamental Skill 3",
        "Fundamental Skill 4",
        "Fundamental Skill 5"
      ],
      "resources": [
        {
          "type": "Course",
          "title": "Specific beginner course name (e.g., CS50, FreeCodeCamp)",
          "url": "https://actual-url.com"
        },
        {
          "type": "Book",
          "title": "Specific book name for beginners",
          "url": ""
        },
        {
          "type": "Documentation",
          "title": "Official documentation or tutorial",
          "url": "https://docs-url.com"
        },
        {
          "type": "Video",
          "title": "YouTube tutorial series name",
          "url": "https://youtube.com/..."
        }
      ],
      "projects": [
        "Beginner project 1 with clear description",
        "Beginner project 2 with clear description"
      ],
      "milestones": [
        "Complete X foundational concepts",
        "Build first simple project",
        "Understand core terminology"
      ]
    },
    {
      "id": "phase-2",
      "phase": "Core Skills",
      "title": "Developing Core Technical Skills",
      "description": "Dive deeper into essential technologies and frameworks used by professionals",
      "duration": "4-6 weeks",
      "skills": [
        "Core Technology 1",
        "Core Technology 2",
        "Core Framework 1",
        "Core Tool 1",
        "Best Practices"
      ],
      "resources": [
        {
          "type": "Course",
          "title": "Intermediate course (Udemy, Coursera, etc.)",
          "url": "https://course-url.com"
        },
        {
          "type": "Book",
          "title": "Intermediate level book",
          "url": ""
        },
        {
          "type": "Documentation",
          "title": "Framework/tool documentation",
          "url": "https://docs-url.com"
        },
        {
          "type": "Practice",
          "title": "Coding challenge platform (LeetCode, HackerRank)",
          "url": "https://platform-url.com"
        }
      ],
      "projects": [
        "Intermediate project 1 using learned skills",
        "Intermediate project 2 with complexity",
        "Portfolio piece that demonstrates proficiency"
      ],
      "milestones": [
        "Master core technology stack",
        "Complete 3 portfolio projects",
        "Contribute to open source"
      ]
    },
    {
      "id": "phase-3",
      "phase": "Advanced Concepts",
      "title": "Mastering Advanced Techniques",
      "description": "Learn industry-standard practices and advanced concepts used in real-world applications",
      "duration": "6-8 weeks",
      "skills": [
        "Advanced Concept 1",
        "Advanced Concept 2",
        "System Design",
        "Performance Optimization",
        "Security Best Practices"
      ],
      "resources": [
        {
          "type": "Course",
          "title": "Advanced specialization course",
          "url": "https://advanced-course.com"
        },
        {
          "type": "Book",
          "title": "Advanced book on architecture/design patterns",
          "url": ""
        },
        {
          "type": "Article",
          "title": "Industry blogs and technical articles",
          "url": "https://blog-url.com"
        },
        {
          "type": "Workshop",
          "title": "Online workshop or bootcamp",
          "url": "https://workshop-url.com"
        }
      ],
      "projects": [
        "Complex full-featured application",
        "System design project",
        "Production-ready application with testing"
      ],
      "milestones": [
        "Understand advanced architectures",
        "Implement complex features",
        "Deploy scalable application"
      ]
    },
    {
      "id": "phase-4",
      "phase": "Specialization",
      "title": "Specializing in ${summary.keyInterests[0] || 'Your Focus Area'}",
      "description": "Develop expertise in your chosen specialization and build advanced portfolio pieces",
      "duration": "6-8 weeks",
      "skills": [
        "Specialized Skill 1",
        "Specialized Skill 2",
        "Domain Knowledge",
        "Industry Tools",
        "Professional Practices"
      ],
      "resources": [
        {
          "type": "Course",
          "title": "Specialized certification course",
          "url": "https://cert-course.com"
        },
        {
          "type": "Book",
          "title": "Specialized domain book",
          "url": ""
        },
        {
          "type": "Community",
          "title": "Professional community/forum",
          "url": "https://community-url.com"
        },
        {
          "type": "Conference",
          "title": "Virtual conference or meetup",
          "url": "https://conference-url.com"
        }
      ],
      "projects": [
        "Industry-standard project in specialization",
        "Capstone project showcasing expertise",
        "Open source contribution in specialization"
      ],
      "milestones": [
        "Become proficient in specialization",
        "Build impressive portfolio pieces",
        "Network with professionals"
      ]
    },
    {
      "id": "phase-5",
      "phase": "Professional Development",
      "title": "Career Preparation & Job Readiness",
      "description": "Prepare for the job market with interview skills, networking, and professional branding",
      "duration": "3-4 weeks",
      "skills": [
        "Technical Interview Skills",
        "System Design Interviews",
        "Behavioral Interviews",
        "Salary Negotiation",
        "Professional Networking"
      ],
      "resources": [
        {
          "type": "Course",
          "title": "Interview preparation course (AlgoExpert, Pramp)",
          "url": "https://interview-prep.com"
        },
        {
          "type": "Book",
          "title": "Cracking the Coding Interview or similar",
          "url": ""
        },
        {
          "type": "Platform",
          "title": "Mock interview platform",
          "url": "https://mock-interview.com"
        },
        {
          "type": "Guide",
          "title": "Resume and LinkedIn optimization guide",
          "url": "https://career-guide.com"
        }
      ],
      "projects": [
        "Polish portfolio website",
        "Create case studies for projects",
        "Build professional online presence"
      ],
      "milestones": [
        "Complete 50+ interview practice problems",
        "Perfect resume and portfolio",
        "Apply to 20+ positions",
        "Receive job offer"
      ]
    },
    {
      "id": "phase-6",
      "phase": "Continuous Growth",
      "title": "Ongoing Learning & Career Advancement",
      "description": "Stay current with industry trends and continue growing as a professional",
      "duration": "Ongoing",
      "skills": [
        "Latest Industry Trends",
        "Emerging Technologies",
        "Leadership Skills",
        "Mentorship",
        "Continuous Learning"
      ],
      "resources": [
        {
          "type": "Newsletter",
          "title": "Industry newsletter subscriptions",
          "url": "https://newsletter-url.com"
        },
        {
          "type": "Podcast",
          "title": "Industry podcasts",
          "url": "https://podcast-url.com"
        },
        {
          "type": "Platform",
          "title": "Continuous learning platform (Pluralsight, LinkedIn Learning)",
          "url": "https://learning-platform.com"
        },
        {
          "type": "Community",
          "title": "Professional network/community",
          "url": "https://professional-community.com"
        }
      ],
      "projects": [
        "Personal projects with new technologies",
        "Contribute to open source regularly",
        "Write technical blog posts",
        "Mentor junior developers"
      ],
      "milestones": [
        "Stay updated with latest trends",
        "Achieve senior level expertise",
        "Build professional reputation",
        "Contribute to community"
      ]
    }
  ],
  "certifications": [
    "Relevant certification 1 for ${summary.targetRole}",
    "Relevant certification 2",
    "Professional certification 3"
  ],
  "jobMarket": {
    "averageSalary": "$XX,XXX - $XXX,XXX per year (based on location and experience)",
    "demandLevel": "High/Very High/Moderate/Growing",
    "topCompanies": [
      "Major Company 1",
      "Major Company 2", 
      "Major Company 3",
      "Major Company 4",
      "Major Company 5"
    ],
    "requiredSkills": [
      "Must-have skill 1",
      "Must-have skill 2",
      "Must-have skill 3",
      "Must-have skill 4",
      "Must-have skill 5"
    ]
  }
}

IMPORTANT REMINDERS:
- Create ALL 6 phases as shown in the template
- Make each phase progressively more advanced
- Include 4-5 specific skills per phase
- Include 3-4 diverse resources per phase (with real URLs when possible)
- Include 2-3 concrete projects per phase
- Include 2-4 measurable milestones per phase
- Tailor everything specifically to ${summary.targetRole}
- Use realistic timeframes that add up to ${summary.timeframe}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();

      console.log('🤖 Raw Learning Path Response:', text.substring(0, 500));

      // Clean up the response
      if (text.startsWith('```')) {
        text = text.replace(/```json\s*/, '').replace(/```\s*$/, '').replace(/```\s*/, '');
      }

      const startIndex = text.indexOf('{');
      const lastIndex = text.lastIndexOf('}');
      if (startIndex !== -1 && lastIndex !== -1) {
        text = text.substring(startIndex, lastIndex + 1);
      }

      const path: DetailedLearningPath = JSON.parse(text);
      
      // Ensure all phases have IDs
      path.phases = path.phases.map((phase, index) => ({
        ...phase,
        id: phase.id || `phase-${index + 1}`
      }));

      console.log('✅ Learning Path Generated with', path.phases.length, 'phases');

      // Validate that we have multiple phases
      if (path.phases.length < 4) {
        console.warn('⚠️ Less than 4 phases generated, adding additional phases...');
        
        // Add missing phases if needed
        while (path.phases.length < 5) {
          const phaseNumber = path.phases.length + 1;
          path.phases.push({
            id: `phase-${phaseNumber}`,
            phase: phaseNumber === 4 ? "Specialization" : "Professional Development",
            title: phaseNumber === 4 ? `Specializing in ${summary.keyInterests[0] || 'Your Focus Area'}` : "Career Preparation",
            description: phaseNumber === 4 ? "Develop expertise in your chosen specialization" : "Prepare for the job market",
            duration: "4-6 weeks",
            skills: ["Advanced Skill 1", "Advanced Skill 2", "Advanced Skill 3"],
            resources: [
              { type: "Course", title: "Advanced course", url: "" },
              { type: "Book", title: "Specialized book", url: "" }
            ],
            projects: ["Advanced project"],
            milestones: ["Achieve proficiency"]
          });
        }
      }

      return path;

    } catch (error) {
      console.error('❌ Error generating learning path:', error);
      
      // Fallback with multiple phases
      return {
        career: summary.targetRole,
        overview: `A comprehensive journey to master ${summary.targetRole} through structured learning phases.`,
        totalDuration: summary.timeframe,
        difficulty: summary.currentLevel === 'Beginner' ? 'Beginner-Friendly' : 'Intermediate',
        prerequisites: ["Basic computer skills", "English proficiency", "Motivation to learn"],
        outcomes: [
          "Master core technical skills",
          "Build professional portfolio", 
          "Job-ready for entry-level positions",
          "Industry-recognized knowledge",
          "Career advancement potential"
        ],
        phases: [
          {
            id: "phase-1",
            phase: "Foundation",
            title: "Building Strong Fundamentals",
            description: "Start with core concepts and foundational knowledge",
            duration: "3-4 weeks",
            skills: ["Core Concept 1", "Core Concept 2", "Basic Tool 1", "Fundamental Skill 1", "Problem Solving"],
            resources: [
              { type: "Course", title: "Introduction to " + summary.targetRole, url: "" },
              { type: "Book", title: "Beginner's Guide", url: "" },
              { type: "Video", title: "YouTube Tutorial Series", url: "" }
            ],
            projects: ["Beginner project 1", "Simple application"],
            milestones: ["Complete fundamentals", "Build first project", "Understand basics"]
          },
          {
            id: "phase-2",
            phase: "Core Skills",
            title: "Developing Core Technical Skills",
            description: "Master essential technologies and tools",
            duration: "4-6 weeks",
            skills: ["Technology 1", "Technology 2", "Framework 1", "Tool 1", "Best Practices"],
            resources: [
              { type: "Course", title: "Intermediate Course", url: "" },
              { type: "Documentation", title: "Official Docs", url: "" },
              { type: "Practice", title: "Coding Challenges", url: "" }
            ],
            projects: ["Intermediate project", "Portfolio piece"],
            milestones: ["Master core stack", "Complete portfolio", "Build confidence"]
          },
          {
            id: "phase-3",
            phase: "Advanced Concepts",
            title: "Mastering Advanced Techniques",
            description: "Learn industry-standard practices and advanced concepts",
            duration: "6-8 weeks",
            skills: ["Advanced Concept 1", "System Design", "Performance", "Security", "Scalability"],
            resources: [
              { type: "Course", title: "Advanced Specialization", url: "" },
              { type: "Book", title: "Advanced Architecture", url: "" },
              { type: "Article", title: "Industry Blogs", url: "" }
            ],
            projects: ["Complex application", "Production-ready project"],
            milestones: ["Understand architectures", "Deploy application", "Master advanced concepts"]
          },
          {
            id: "phase-4",
            phase: "Specialization",
            title: `Specializing in ${summary.keyInterests[0] || 'Your Focus Area'}`,
            description: "Develop expertise in your chosen specialization",
            duration: "6-8 weeks",
            skills: ["Specialized Skill 1", "Specialized Skill 2", "Domain Knowledge", "Industry Tools", "Expertise"],
            resources: [
              { type: "Course", title: "Certification Course", url: "" },
              { type: "Book", title: "Specialized Book", url: "" },
              { type: "Community", title: "Professional Forum", url: "" }
            ],
            projects: ["Industry-standard project", "Capstone project"],
            milestones: ["Achieve specialization", "Build impressive portfolio", "Network professionally"]
          },
          {
            id: "phase-5",
            phase: "Professional Development",
            title: "Career Preparation & Job Readiness",
            description: "Prepare for the job market with interview skills and networking",
            duration: "3-4 weeks",
            skills: ["Interview Skills", "System Design Interviews", "Networking", "Resume Writing", "Negotiation"],
            resources: [
              { type: "Course", title: "Interview Preparation", url: "" },
              { type: "Book", title: "Cracking the Interview", url: "" },
              { type: "Platform", title: "Mock Interviews", url: "" }
            ],
            projects: ["Polish portfolio", "Create case studies", "Build online presence"],
            milestones: ["Complete practice problems", "Perfect resume", "Apply to jobs", "Receive offers"]
          }
        ],
        certifications: [
          `Professional ${summary.targetRole} Certification`,
          "Industry-recognized credential",
          "Specialized certification"
        ],
        jobMarket: {
          averageSalary: "$60,000 - $120,000 per year",
          demandLevel: "High",
          topCompanies: ["Google", "Microsoft", "Amazon", "Meta", "Apple"],
          requiredSkills: ["Technical Skill 1", "Technical Skill 2", "Technical Skill 3", "Problem Solving", "Communication"]
        }
      };
    }
  }

  /**
   * Save learning path to Supabase
   */
  async saveLearningPath(
    userId: string,
    summary: CareerSummary,
    detailedPath: DetailedLearningPath,
    conversationMessages: Message[]
  ): Promise<{ success: boolean; error?: string; data?: SavedLearningPath }> {
    try {
      console.log('💾 Saving learning path to database...');

      const pathData = {
        user_id: userId,
        career_goal: summary.careerGoal,
        key_interests: summary.keyInterests,
        current_level: summary.currentLevel,
        target_role: summary.targetRole,
        timeframe: summary.timeframe,
        career_overview: detailedPath.overview,
        total_duration: detailedPath.totalDuration,
        difficulty: detailedPath.difficulty,
        prerequisites: detailedPath.prerequisites,
        outcomes: detailedPath.outcomes,
        phases: detailedPath.phases,
        certifications: detailedPath.certifications,
        job_market: detailedPath.jobMarket,
        conversation_messages: conversationMessages,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('learning_paths')
        .insert(pathData)
        .select()
        .single();

      if (error) {
        console.error('❌ Error saving learning path:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Learning path saved successfully!', data.id);
      return { success: true, data };

    } catch (error) {
      console.error('❌ Unexpected error saving learning path:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get latest learning path for user
   */
  async getLatestLearningPath(userId: string): Promise<{ success: boolean; data?: SavedLearningPath; error?: string }> {
    try {
      console.log('📚 Fetching latest learning path for user:', userId);

      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          console.log('📝 No previous learning path found');
          return { success: true, data: undefined };
        }
        console.error('❌ Error fetching learning path:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Latest learning path found:', data.id);
      return { success: true, data };

    } catch (error) {
      console.error('❌ Unexpected error fetching learning path:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get all learning paths for user
   */
  async getAllLearningPaths(userId: string): Promise<{ success: boolean; data?: SavedLearningPath[]; error?: string }> {
    try {
      console.log('📚 Fetching all learning paths for user:', userId);

      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching learning paths:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Found', data.length, 'learning paths');
      return { success: true, data };

    } catch (error) {
      console.error('❌ Unexpected error fetching learning paths:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Delete a learning path
   */
  async deleteLearningPath(pathId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🗑️ Deleting learning path:', pathId);

      const { error } = await supabase
        .from('learning_paths')
        .delete()
        .eq('id', pathId);

      if (error) {
        console.error('❌ Error deleting learning path:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Learning path deleted successfully');
      return { success: true };

    } catch (error) {
      console.error('❌ Unexpected error deleting learning path:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update a learning path
   */
  async updateLearningPath(
    pathId: string,
    updates: Partial<SavedLearningPath>
  ): Promise<{ success: boolean; data?: SavedLearningPath; error?: string }> {
    try {
      console.log('📝 Updating learning path:', pathId);

      const { data, error } = await supabase
        .from('learning_paths')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', pathId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating learning path:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Learning path updated successfully');
      return { success: true, data };

    } catch (error) {
      console.error('❌ Unexpected error updating learning path:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const careerAdvisorService = new CareerAdvisorService();