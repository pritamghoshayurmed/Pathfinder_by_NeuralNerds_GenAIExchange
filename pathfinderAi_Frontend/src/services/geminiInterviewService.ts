/**
 * Gemini Interview Service
 * Generates role-specific interview questions based on job descriptions using Gemini API
 */

export interface InterviewQuestion {
  id: string;
  questionNumber: number;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'Technical' | 'Behavioral' | 'System Design' | 'Situational' | 'Domain-Specific';
  keyPoints: string[];
  sampleAnswer: string;
  followUpQuestions?: string[];
  tips?: string[];
}

export interface InterviewSession {
  id: string;
  role: string;
  jobDescription: string;
  questions: InterviewQuestion[];
  generatedAt: string;
  estimatedPreparationTime: number;
}

class GeminiInterviewService {
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
            maxOutputTokens: 8192,
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API Error Response:', errorData);
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

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

  async generateInterviewQuestions(
    role: string,
    jobDescription: string,
    numberOfQuestions: number = 10
  ): Promise<InterviewSession> {
    const sessionId = `interview_${Date.now()}`;
    
    const prompt = `You are an expert interview coach and technical recruiter. Generate comprehensive interview questions for a ${role} position based on the following job description:

JOB DESCRIPTION:
${jobDescription}

IMPORTANT: You must respond with ONLY valid JSON. No markdown, no explanations, just pure JSON.

Generate exactly ${numberOfQuestions} interview questions that cover:
1. Technical skills required by the role
2. Behavioral competencies
3. Domain-specific knowledge
4. System design (if applicable)
5. Situational questions

Required JSON structure:
{
  "questions": [
    {
      "id": "q1, q2, q3, etc.",
      "questionNumber": 1,
      "question": "string - The interview question",
      "difficulty": "easy|medium|hard",
      "category": "Technical|Behavioral|System Design|Situational|Domain-Specific",
      "keyPoints": ["point1", "point2", "point3"],
      "sampleAnswer": "string - A comprehensive sample answer (2-3 paragraphs)",
      "followUpQuestions": ["follow-up1", "follow-up2"],
      "tips": ["tip1", "tip2"]
    }
  ],
  "estimatedPreparationTime": 120
}

Requirements:
- Create exactly ${numberOfQuestions} questions
- Mix difficulties: some easy, medium, and hard
- Each question must have a comprehensive sample answer (2-3 sentences minimum)
- Include 2-3 key points for each question
- Include 1-2 follow-up questions that interviewers might ask
- Include 2-3 tips for answering each question well
- Make questions specific to the job description
- Ensure sample answers are realistic and professional
- Ensure the JSON is perfectly valid and parseable

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
        throw new Error('No valid JSON object found in response');
      }

      jsonString = jsonString.substring(startIndex, lastIndex + 1);

      const parsedData = JSON.parse(jsonString);

      // Validate and normalize the response
      if (!Array.isArray(parsedData.questions)) {
        throw new Error('Invalid response structure: questions must be an array');
      }

      const questions: InterviewQuestion[] = parsedData.questions.map((q: any, index: number) => ({
        id: q.id || `q${index + 1}`,
        questionNumber: index + 1,
        question: q.question || '',
        difficulty: q.difficulty || 'medium',
        category: q.category || 'Technical',
        keyPoints: Array.isArray(q.keyPoints) ? q.keyPoints : [],
        sampleAnswer: q.sampleAnswer || '',
        followUpQuestions: Array.isArray(q.followUpQuestions) ? q.followUpQuestions : [],
        tips: Array.isArray(q.tips) ? q.tips : []
      }));

      return {
        id: sessionId,
        role,
        jobDescription,
        questions,
        generatedAt: new Date().toISOString(),
        estimatedPreparationTime: parsedData.estimatedPreparationTime || 120
      };
    } catch (error) {
      console.error('Error generating interview questions:', error);
      throw new Error(
        error instanceof Error
          ? `Failed to generate interview questions: ${error.message}`
          : 'Failed to generate interview questions'
      );
    }
  }

  async generateFollowUpQuestion(
    question: string,
    answer: string,
    role: string
  ): Promise<string> {
    const prompt = `As an expert interviewer for the ${role} position, based on the following question and answer, generate one insightful follow-up question to dig deeper into the candidate's knowledge:

Question: "${question}"
Answer: "${answer}"

Respond with ONLY the follow-up question, nothing else. Make it challenging but fair.`;

    try {
      return await this.makeRequest(prompt);
    } catch (error) {
      console.error('Error generating follow-up question:', error);
      throw error;
    }
  }

  async improveSampleAnswer(
    question: string,
    currentAnswer: string,
    role: string
  ): Promise<string> {
    const prompt = `As an expert interview coach for ${role} positions, improve the following sample answer to make it more compelling, comprehensive, and professional:

Question: "${question}"
Current Answer: "${currentAnswer}"

Provide an improved version that:
1. Directly answers the question
2. Provides specific examples or technical details
3. Shows relevant skills and competencies
4. Is 2-3 paragraphs long
5. Sounds natural and confident

Respond with ONLY the improved answer, nothing else.`;

    try {
      return await this.makeRequest(prompt);
    } catch (error) {
      console.error('Error improving sample answer:', error);
      throw error;
    }
  }
}

export default new GeminiInterviewService();
