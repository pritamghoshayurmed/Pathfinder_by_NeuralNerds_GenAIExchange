import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Import Course type from courseData
export interface Course {
  id: number;
  name: string;
  stream: string;
  description: string;
  avgSalary: string;
  jobOutlook: string;
  growth: string;
  skills?: string[];
  careers?: string[];
  marketDemand?: number;
  workLifeBalance?: number;
}

export interface UserProfile {
  interests: string[];
  skills: string[];
  careerGoals: string[];
  preferences: {
    jobMarket: number;
    salary: number;
    workLifeBalance: number;
    growth: number;
  };
}

export interface AIRecommendation {
  courseId: number;
  courseName: string;
  matchScore: number;
  reasoning: string;
  keyAlignments: string[];
  suggestedPath: string;
  potentialChallenges: string[];
  nextSteps: string[];
  isNewCourse?: boolean; // Flag for newly created courses
}

export interface NewCourseData {
  name: string;
  stream: string;
  description: string;
  avgSalary: string;
  jobOutlook: string;
  growth: string;
  skills: string[];
  careers: string[];
  marketDemand: number;
  workLifeBalance: number;
  duration?: string;
  difficulty?: string;
  topColleges: string[];
}

export interface RecommendationResult {
  recommendations: AIRecommendation[];
  profileSummary: string;
  overallInsights: string[];
  careerPathSuggestions: string[];
  newCoursesCreated?: NewCourseData[]; // New courses that were created
}

export interface ResultRecommendation {
  courseName: string;
  field: string;
  eligibility: string;
  cutoffScore: number;
  duration: string;
  avgSalary: string;
  jobOpportunities: string[];
  matchScore: number;
  reasoning: string;
  topColleges: string[];
  analysisMarks: {
    [subject: string]: number;
  };
  keyStrengths: string[];
}

class GeminiRecommendationService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_RECOMMENDATIONS_API_KEY;
    console.log('🔑 Gemini API Key Status:', apiKey ? 'Found' : 'Missing');
    
    if (!apiKey || apiKey === 'your_gemini_recommendations_api_key_here') {
      console.error('❌ Gemini Recommendations API key not configured properly');
      throw new Error('Gemini Recommendations API key not found or not configured. Please check your .env file.');
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      console.log('✅ Gemini service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Gemini service:', error);
      throw error;
    }
  }

  async getPersonalizedRecommendations(
    profile: UserProfile, 
    availableCourses: Course[]
  ): Promise<RecommendationResult> {
    console.log('🚀 Starting AI recommendation generation...');
    console.log('📋 Profile:', profile);
    
    try {
      const prompt = this.createRecommendationPrompt(profile, availableCourses);
      console.log('📝 Generated prompt (first 200 chars):', prompt.substring(0, 200) + '...');
      
      console.log('🤖 Calling Gemini API...');
      const result = await this.model.generateContent(prompt);
      
      if (!result || !result.response) {
        throw new Error('Invalid response from Gemini API');
      }
      
      const response = await result.response;
      const text = response.text();
      console.log('📨 Raw AI response (first 300 chars):', text.substring(0, 300) + '...');

      // More robust JSON extraction
      let jsonData;
      try {
        // Try to find JSON in the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.warn('⚠️ No JSON found in response, creating fallback...');
          return this.getFallbackRecommendations(profile, availableCourses);
        }

        jsonData = JSON.parse(jsonMatch[0]);
        console.log('✅ Successfully parsed JSON response:', jsonData);
      } catch (parseError) {
        console.error('❌ JSON parsing failed:', parseError);
        console.log('📄 Full response text:', text);
        return this.getFallbackRecommendations(profile, availableCourses);
      }

      // Validate and fix the response structure
      if (!jsonData.recommendations || !Array.isArray(jsonData.recommendations)) {
        console.warn('⚠️ Invalid response structure, using fallback');
        return this.getFallbackRecommendations(profile, availableCourses);
      }

      // Ensure each recommendation has proper course mapping
      const validatedRecommendations = jsonData.recommendations.map((rec: unknown, index: number) => {
        const recommendation = rec as Record<string, unknown>;
        
        // Try to find the course by ID first, then by name
        let course = availableCourses.find(c => c.id === recommendation.courseId);
        if (!course && recommendation.courseName) {
          course = availableCourses.find(c => 
            c.name.toLowerCase().includes(String(recommendation.courseName).toLowerCase()) ||
            String(recommendation.courseName).toLowerCase().includes(c.name.toLowerCase())
          );
        }
        
        // If still no course found, pick a relevant one from available courses
        if (!course) {
          console.warn(`⚠️ Course not found for recommendation: ${recommendation.courseName || recommendation.courseId}`);
          course = availableCourses[index] || availableCourses[0];
        }

        console.log(`🔍 Mapped recommendation ${index + 1}:`, {
          originalId: recommendation.courseId,
          originalName: recommendation.courseName,
          mappedCourse: course?.name,
          matchScore: recommendation.matchScore
        });

        return {
          courseId: course.id,
          courseName: course.name,
          matchScore: Number(recommendation.matchScore) || 85,
          reasoning: String(recommendation.reasoning) || `This course aligns well with your profile and career goals.`,
          keyAlignments: Array.isArray(recommendation.keyAlignments) 
            ? recommendation.keyAlignments.map(String) 
            : [`Matches your interests`, `Utilizes your skills`],
          suggestedPath: String(recommendation.suggestedPath) || "Start with foundation courses and progress to advanced topics",
          potentialChallenges: Array.isArray(recommendation.potentialChallenges)
            ? recommendation.potentialChallenges.map(String)
            : ["Competitive field", "Continuous learning required"],
          nextSteps: Array.isArray(recommendation.nextSteps)
            ? recommendation.nextSteps.map(String)
            : ["Research colleges", "Connect with professionals", "Build relevant skills"]
        };
      });

      const recommendationData = {
        ...jsonData,
        recommendations: validatedRecommendations
      };
      
      console.log('✅ Validated recommendations:', recommendationData.recommendations.length);
      
      // Check if we need to create new courses based on user profile
      const shouldCreateNewCourses = this.shouldCreateNewCourses(profile, recommendationData.recommendations);
      console.log('🔍 Should create new courses:', shouldCreateNewCourses);
      
      let newCoursesCreated: NewCourseData[] = [];
      let enhancedRecommendations = recommendationData.recommendations;

      if (shouldCreateNewCourses) {
        // Identify missing areas
        const missingAreas = this.identifyMissingAreas(profile, availableCourses);
        console.log('📋 Missing areas identified:', missingAreas);
        
        if (missingAreas.length > 0) {
          try {
            // Create new courses
            console.log('🎨 Creating new courses...');
            newCoursesCreated = await this.createNewCourses(profile, missingAreas);
            console.log('✅ Created new courses:', newCoursesCreated.length);
            
            if (newCoursesCreated.length > 0) {
              // Convert new courses to Course objects and add them
              const newCourseObjects = await this.appendCoursesToFile(newCoursesCreated);
              
              // Add new course recommendations
              const newCourseRecommendations = newCourseObjects.map(course => ({
                courseId: course.id,
                courseName: course.name,
                matchScore: 98, // Very high match since created specifically for user
                reasoning: `This innovative course was created specifically for your unique profile, combining your interests in ${profile.interests.slice(0, 3).join(', ')} with emerging market opportunities.`,
                keyAlignments: [
                  `Perfect match for your ${profile.interests[0] || 'primary'} interest`,
                  `Utilizes your ${profile.skills[0] || 'key'} skills optimally`,
                  `Aligns with your ${profile.careerGoals[0] || 'career'} goal`
                ],
                suggestedPath: "Start with foundation courses, then specialize in this cutting-edge field",
                potentialChallenges: ["New field requiring continuous learning", "Limited traditional career guidance"],
                nextSteps: [
                  "Research universities offering similar interdisciplinary programs",
                  "Connect with professionals in related fields",
                  "Build a portfolio in relevant skills"
                ],
                isNewCourse: true
              }));

              enhancedRecommendations = [...newCourseRecommendations, ...enhancedRecommendations];
              console.log('🎯 Enhanced recommendations with new courses');
            }
          } catch (newCourseError) {
            console.error('❌ Error creating new courses:', newCourseError);
            // Continue without new courses
          }
        }
      }

      const finalResult = {
        ...recommendationData,
        recommendations: enhancedRecommendations,
        newCoursesCreated
      };

      console.log('🎉 Successfully generated recommendations:', finalResult.recommendations.length);
      return finalResult;
      
    } catch (error) {
      console.error('❌ Error in getPersonalizedRecommendations:', error);
      console.error('🔍 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Always return fallback instead of throwing
      console.log('🔄 Falling back to rule-based recommendations');
      return this.getFallbackRecommendations(profile, availableCourses);
    }
  }

  // Method to validate user profile
  validateProfile(profile: UserProfile): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (profile.interests.length === 0) {
      errors.push('Please select at least one interest');
    }

    if (profile.skills.length === 0) {
      errors.push('Please select at least one skill');
    }

    if (profile.careerGoals.length === 0) {
      errors.push('Please select at least one career goal');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private createRecommendationPrompt(profile: UserProfile, availableCourses: Course[]): string {
    const courseList = availableCourses.slice(0, 25).map(course => 
      `- ID: ${course.id}
  Name: "${course.name}"
  Description: "${course.description || 'N/A'}"
  Average Salary: ${course.avgSalary || 'N/A'}
  Job Outlook: ${course.jobOutlook || 'N/A'}
  Growth Rate: ${course.growth || 'N/A'}
  Key Skills: ${course.skills?.join(', ') || 'N/A'}
  Career Paths: ${course.careers?.join(', ') || 'N/A'}`
    ).join('\n\n');

    return `You are an expert AI career counselor with deep expertise in education pathways, market trends, and career development. Your task is to analyze a student's comprehensive profile and provide highly personalized, data-driven course recommendations.

🎓 STUDENT PROFILE ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 INTERESTS: ${profile.interests.join(', ')}
🛠️ CURRENT SKILLS: ${profile.skills.join(', ')}
🎯 CAREER ASPIRATIONS: ${profile.careerGoals.join(', ')}
⚖️ PRIORITIES: 
   • Job Market Demand: ${profile.preferences.jobMarket}% importance
   • Salary Potential: ${profile.preferences.salary}% importance  
   • Work-Life Balance: ${profile.preferences.workLifeBalance}% importance
   • Career Growth: ${profile.preferences.growth}% importance

📚 AVAILABLE COURSES DATABASE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${courseList}

🤖 AI ANALYSIS INSTRUCTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. DEEP PROFILE ANALYSIS: Examine how each interest, skill, and goal interconnects
2. MARKET ALIGNMENT: Consider current industry trends and future job market demands
3. SKILL GAP ANALYSIS: Identify which courses best bridge the student's current skills to their career goals
4. PREFERENCE WEIGHTING: Factor in the student's priority percentages when calculating match scores
5. HOLISTIC MATCHING: Look for courses that satisfy multiple aspects of the student's profile
6. GROWTH TRAJECTORY: Recommend courses with strong future potential and adaptability

⚠️ CRITICAL REQUIREMENTS:
- Select courses ONLY from the provided database above
- Use EXACT course IDs and names from the list
- Calculate match scores based on comprehensive analysis (60-98% range)
- Provide specific, actionable insights rather than generic advice
- Consider both immediate fit and long-term career potential

📋 REQUIRED JSON OUTPUT FORMAT:
{
  "recommendations": [
    {
      "courseId": "exact_course_id_from_database",
      "courseName": "exact_course_name_from_database", 
      "matchScore": 87,
      "reasoning": "Comprehensive analysis of why this course is ideal for this student's unique profile, considering their interests, skills, goals, and preferences. Be specific about how the course content aligns with their aspirations and market realities.",
      "keyAlignments": [
        "Specific connection to student's primary interest",
        "How it leverages their existing skills",
        "Direct path to their career goal"
      ],
      "suggestedPath": "Detailed learning progression and timeline for mastering this field",
      "potentialChallenges": ["Realistic challenge 1", "Realistic challenge 2"],
      "nextSteps": [
        "Immediate actionable step",
        "Medium-term preparation",
        "Long-term strategy"
      ]
    }
  ],
  "profileSummary": "Insightful analysis of the student's strengths, potential, and unique value proposition in the job market",
  "overallInsights": [
    "Key strength or opportunity identified",
    "Market trend that favors this profile", 
    "Strategic recommendation for career development"
  ],
  "careerPathSuggestions": [
    "Primary career trajectory",
    "Alternative high-potential path",
    "Emerging opportunity to consider"
  ]
}

Select the top 3-5 most relevant courses from the available list and provide detailed analysis for each.`;
  }

  private shouldCreateNewCourses(profile: UserProfile, recommendations: AIRecommendation[]): boolean {
    if (recommendations.length < 3) return true;
    const highMatchRecommendations = recommendations.filter((rec: AIRecommendation) => rec.matchScore > 90);
    return highMatchRecommendations.length === 0;
  }

  private identifyMissingAreas(profile: UserProfile, availableCourses: Course[]): string[] {
    const missingAreas: string[] = [];
    
    for (const interest of profile.interests) {
      const hasMatchingCourse = availableCourses.some(course => 
        course.description?.toLowerCase().includes(interest.toLowerCase()) ||
        course.name.toLowerCase().includes(interest.toLowerCase())
      );
      
      if (!hasMatchingCourse) {
        missingAreas.push(interest);
      }
    }
    
    return missingAreas;
  }

  async createNewCourses(profile: UserProfile, missingAreas: string[]): Promise<NewCourseData[]> {
    try {
      const prompt = `Create innovative courses for a student interested in: ${profile.interests.join(', ')}. Focus on: ${missingAreas.join(', ')}. Return JSON with newCourses array.`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return [];

      const courseData = JSON.parse(jsonMatch[0]);
      return courseData.newCourses || [];
    } catch (error) {
      console.error('Error creating new courses:', error);
      return [];
    }
  }

  private async appendCoursesToFile(newCourses: NewCourseData[]): Promise<Course[]> {
    const startId = 1000;
    
    return newCourses.map((course, index) => ({
      id: startId + index,
      name: course.name,
      stream: course.stream,
      matchScore: 95,
      avgSalary: course.avgSalary,
      jobOutlook: course.jobOutlook,
      growth: course.growth,
      topColleges: course.topColleges,
      skills: course.skills,
      careers: course.careers,
      description: course.description,
      duration: course.duration,
      difficulty: course.difficulty,
      marketDemand: course.marketDemand,
      workLifeBalance: course.workLifeBalance
    }));
  }

  private getFallbackRecommendations(profile: UserProfile, availableCourses: Course[]): RecommendationResult {
    console.log('🔄 Creating fallback recommendations...');
    
    // Filter courses based on profile interests and skills
    const relevantCourses = availableCourses.filter(course => {
      const courseText = `${course.name} ${course.description || ''}`.toLowerCase();
      return profile.interests.some(interest => 
        courseText.includes(interest.toLowerCase())
      ) || profile.skills.some(skill => 
        courseText.includes(skill.toLowerCase())
      );
    });

    // If no relevant courses found, use top courses
    const coursesToUse = relevantCourses.length >= 3 ? relevantCourses : availableCourses;
    
    const recommendations: AIRecommendation[] = coursesToUse
      .slice(0, 5)
      .map((course, index) => {
        const baseScore = 90 - index * 3;
        return {
          courseId: course.id,
          courseName: course.name,
          matchScore: Math.max(75, baseScore),
          reasoning: `This course aligns with your interests in ${profile.interests.slice(0, 2).join(', ')} and leverages your skills in ${profile.skills.slice(0, 2).join(', ')}.`,
          keyAlignments: [
            `Matches your interest in ${profile.interests[0] || 'technology'}`,
            `Utilizes your ${profile.skills[0] || 'analytical'} skills`,
            `Supports your goal of ${profile.careerGoals[0] || 'career growth'}`
          ],
          suggestedPath: `Start with foundation courses, then specialize in advanced topics related to ${course.name}.`,
          potentialChallenges: [
            'Competitive field requiring continuous learning',
            'Rapidly evolving technology landscape'
          ],
          nextSteps: [
            'Research specific colleges offering this program',
            'Connect with professionals in this field',
            'Develop relevant skills through online courses'
          ]
        };
      });

    console.log('✅ Created fallback recommendations:', recommendations.length);

    return {
      recommendations,
      profileSummary: `Based on your interests in ${profile.interests.slice(0, 3).join(', ')} and skills in ${profile.skills.slice(0, 3).join(', ')}, you show strong potential for technology and analytical fields.`,
      overallInsights: [
        'Focus on developing both technical and soft skills',
        'Consider emerging fields with high growth potential',
        'Build a strong foundation in your areas of interest'
      ],
      careerPathSuggestions: [
        'Technology and Innovation',
        'Research and Development',
        'Consulting and Analysis'
      ]
    };
  }

  /**
   * Analyze uploaded exam results and recommend courses
   */
  async analyzeResultAndRecommendCourses(
    resultData: { examType: string; fileName: string; fileContent?: string }, 
    mockScores?: { [subject: string]: number }
  ): Promise<ResultRecommendation[]> {
    console.log('🎯 Starting result analysis for course recommendations...');
    console.log('📋 Result data:', resultData);
    
    try {
      const prompt = this.createResultAnalysisPrompt(resultData, mockScores);
      console.log('📝 Generated result analysis prompt');
      
      console.log('🤖 Calling Gemini API for result analysis...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('📄 Raw Gemini response length:', text.length);
      console.log('📄 Response preview:', text.substring(0, 300));
      
      // Parse the JSON response
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsedResponse = JSON.parse(cleanText);
      
      console.log('✅ Parsed course recommendations:', parsedResponse.recommendations?.length || 0);
      
      return parsedResponse.recommendations || [];
      
    } catch (error) {
      console.error('❌ Error in result analysis:', error);
      console.log('🔄 Falling back to mock recommendations');
      
      // Fallback to intelligent mock recommendations based on exam type
      return this.generateFallbackResultRecommendations(resultData.examType, mockScores);
    }
  }

  private createResultAnalysisPrompt(
    resultData: { examType: string; fileName: string; fileContent?: string },
    mockScores?: { [subject: string]: number }
  ): string {
    const scoresText = mockScores ? 
      `Mock scores for analysis: ${Object.entries(mockScores).map(([subject, score]) => `${subject}: ${score}%`).join(', ')}` :
      'No specific scores provided - analyze based on exam type and general performance expectations.';

    return `
You are an expert educational counselor and course recommendation specialist. Analyze the uploaded ${resultData.examType} exam result and recommend the best 5 courses based on the student's performance.

Exam Details:
- Exam Type: ${resultData.examType}
- File: ${resultData.fileName}
- ${scoresText}

Please provide course recommendations in the following JSON format:
{
  "recommendations": [
    {
      "courseName": "Course Name",
      "field": "Field Category",
      "eligibility": "Highly Eligible/Eligible/Moderately Eligible",
      "cutoffScore": 85,
      "duration": "4 years",
      "avgSalary": "₹10-45L/year",
      "jobOpportunities": ["Job1", "Job2", "Job3", "Job4", "Job5"],
      "matchScore": 95,
      "reasoning": "Detailed explanation why this course matches the student's performance and strengths",
      "topColleges": ["College1", "College2", "College3", "College4", "College5"],
      "analysisMarks": {
        "Mathematics": 88,
        "Physics": 85,
        "Chemistry": 82
      },
      "keyStrengths": ["Strong Mathematical Skills", "Logical Thinking", "Problem Solving"]
    }
  ]
}

Consider these factors in your recommendations:
1. Student's apparent strengths based on exam type and performance
2. Current market demand for different courses
3. Career growth potential and salary prospects
4. Alignment with exam performance patterns
5. Realistic eligibility based on typical cutoffs
6. **Include the marks/scores that led to each recommendation in analysisMarks**
7. **Identify key strengths based on subject-wise performance**

For ${resultData.examType}:
- If JEE: Focus on engineering disciplines, technology, applied sciences
- If NEET: Include medical, life sciences, biotechnology, healthcare
- If Board: Consider diverse options based on stream performance
- If Management exams: Include business, economics, management courses

Ensure recommendations are:
- Realistic and achievable based on performance
- Diverse across different career paths
- Include both traditional and emerging fields
- Consider current industry trends and job market
- Provide actionable career guidance

Return only the JSON response, no additional text.
    `;
  }

  private generateFallbackResultRecommendations(examType: string, mockScores?: { [subject: string]: number }): ResultRecommendation[] {
    console.log('🔄 Generating fallback recommendations for:', examType);
    
    // Base recommendations that can be customized based on exam type
    const baseRecommendations = [
      {
        courseName: "Computer Science Engineering",
        field: "Technology & Engineering",
        eligibility: "Highly Eligible",
        cutoffScore: 85,
        duration: "4 years",
        avgSalary: "₹12-50L/year",
        jobOpportunities: ["Software Developer", "Data Scientist", "AI Engineer", "Product Manager", "Tech Lead"],
        matchScore: 95,
        reasoning: "Your strong analytical and problem-solving abilities make you ideal for Computer Science. High demand in the job market with excellent growth prospects.",
        topColleges: ["IIT Delhi", "IIT Bombay", "BITS Pilani", "IIIT Hyderabad", "NIT Trichy"],
        analysisMarks: mockScores || { Mathematics: 88, Physics: 85, Chemistry: 82 },
        keyStrengths: ["Strong Mathematical Skills", "Logical Thinking", "Problem Solving"]
      },
      {
        courseName: "Data Science & Analytics",
        field: "Technology & Mathematics",
        eligibility: "Highly Eligible",
        cutoffScore: 82,
        duration: "3-4 years",
        avgSalary: "₹10-45L/year",
        jobOpportunities: ["Data Scientist", "Business Analyst", "ML Engineer", "Research Analyst", "Data Engineer"],
        matchScore: 92,
        reasoning: "Your mathematical aptitude and analytical thinking align perfectly with Data Science. One of the fastest-growing fields with tremendous opportunities.",
        topColleges: ["IIT Madras", "ISI Kolkata", "IIM Bangalore", "IIIT Delhi", "Great Lakes Institute"],
        analysisMarks: mockScores || { Mathematics: 90, Statistics: 87, Computer_Science: 85 },
        keyStrengths: ["Mathematical Excellence", "Analytical Thinking", "Statistical Understanding"]
      }
    ];

    // Customize based on exam type
    if (examType.toLowerCase().includes('neet')) {
      baseRecommendations.unshift({
        courseName: "Bachelor of Medicine (MBBS)",
        field: "Medical & Healthcare",
        eligibility: "Highly Eligible",
        cutoffScore: 90,
        duration: "5.5 years",
        avgSalary: "₹8-40L/year",
        jobOpportunities: ["Doctor", "Surgeon", "Medical Researcher", "Public Health Officer", "Medical Consultant"],
        matchScore: 98,
        reasoning: "Your NEET performance indicates strong aptitude for medical sciences. Healthcare is a noble profession with stable career prospects.",
        topColleges: ["AIIMS Delhi", "CMC Vellore", "JIPMER", "King George Medical University", "Grant Medical College"],
        analysisMarks: mockScores || { Physics: 85, Chemistry: 88, Biology: 92 },
        keyStrengths: ["Biological Sciences Excellence", "Medical Aptitude", "Scientific Reasoning"]
      });
    }

    if (examType.toLowerCase().includes('jee')) {
      baseRecommendations.push({
        courseName: "Artificial Intelligence & Machine Learning",
        field: "Technology & AI",
        eligibility: "Highly Eligible",
        cutoffScore: 88,
        duration: "4 years",
        avgSalary: "₹15-60L/year",
        jobOpportunities: ["AI Engineer", "ML Scientist", "Research Scientist", "AI Product Manager", "Computer Vision Engineer"],
        matchScore: 94,
        reasoning: "Your JEE performance shows strong mathematical foundation ideal for AI/ML. Cutting-edge field with tremendous growth potential.",
        topColleges: ["IIT Delhi", "IIIT Hyderabad", "IISc Bangalore", "Plaksha University", "Ashoka University"],
        analysisMarks: mockScores || { Mathematics: 92, Physics: 88, Chemistry: 85 },
        keyStrengths: ["Advanced Mathematics", "Engineering Aptitude", "Technological Innovation"]
      });
    }

    return baseRecommendations.slice(0, 5); // Return top 5 recommendations
  }
}

export default new GeminiRecommendationService();
