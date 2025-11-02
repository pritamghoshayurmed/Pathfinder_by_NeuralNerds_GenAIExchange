import { GoogleGenerativeAI } from '@google/generative-ai';

export interface CareerField {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface CareerPathway {
  id: string;
  title: string;
  description: string;
  averageSalary: string;
  jobOutlook: string;
  growth: string;
  requiredSkills: string[];
  careerProgression: string[];
  educationRequirements: string;
  marketDemand: number;
  workLifeBalance: number;
  relatedCareers: string[];
}

export interface CareerPathwaysResult {
  fieldName: string;
  fieldDescription: string;
  pathways: CareerPathway[];
  trendingOpportunities: string[];
  emergingRoles: string[];
  totalOpportunities: number;
}

class CareerPathwaysService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY_NABIN;
    console.log('🔑 API Key available:', apiKey ? 'Yes' : 'No');
    
    if (!apiKey) {
      console.error('❌ Gemini API key not found in environment variables');
      throw new Error('Gemini API key not found in environment variables');
    }
    
    console.log('🚀 Initializing Gemini AI with API key:', apiKey.substring(0, 10) + '...');
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      }
    });
    
    console.log('✅ Gemini AI model initialized successfully');
  }

  async getCareerPathways(fieldId: string): Promise<CareerPathwaysResult> {
    console.log(`🎯 Fetching career pathways for field: ${fieldId}`);
    
    const prompt = this.buildCareerPathwaysPrompt(fieldId);
    console.log('📝 Generated prompt:', prompt.substring(0, 200) + '...');
    
    try {
      console.log('🚀 Sending request to Gemini API...');
      
      // Add timeout to the API call
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API timeout after 30 seconds')), 30000)
      );
      
      const apiPromise = this.model.generateContent(prompt);
      
      const result = await Promise.race([apiPromise, timeoutPromise]) as any;
      console.log('📡 Received response from Gemini API');
      
      const response = await result.response;
      const text = response.text();
      
      console.log('🤖 Raw Gemini response length:', text.length);
      console.log('🤖 Raw Gemini response preview:', text.substring(0, 500));
      
      // Parse the JSON response
      const cleanedText = this.cleanJsonResponse(text);
      console.log('🧹 Cleaned response preview:', cleanedText.substring(0, 300));
      
      const pathwaysData = JSON.parse(cleanedText);
      
      console.log('✅ Parsed career pathways data:', pathwaysData);
      
      return pathwaysData;
      
    } catch (error) {
      console.error('❌ Error fetching career pathways:', error);
      console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
      
      // Return fallback data in case of API failure
      console.log('🔄 Returning fallback data...');
      return this.getFallbackData(fieldId);
    }
  }

  private getFallbackData(fieldId: string): CareerPathwaysResult {
    const fieldName = this.getFieldDisplayName(fieldId);
    
    return {
      fieldName: fieldName,
      fieldDescription: `Explore exciting career opportunities in ${fieldName.toLowerCase()}`,
      pathways: [
        {
          id: `${fieldId}-pathway-1`,
          title: `${fieldName} Specialist`,
          description: `Lead specialist role in ${fieldName.toLowerCase()} with advanced expertise`,
          averageSalary: "$65,000 - $120,000",
          jobOutlook: "Excellent",
          growth: "15-25%",
          requiredSkills: ["Problem Solving", "Critical Thinking", "Communication", "Technical Skills"],
          careerProgression: ["Entry Level", "Mid Level", "Senior Level", "Leadership"],
          educationRequirements: "Bachelor's degree or equivalent experience",
          marketDemand: 85,
          workLifeBalance: 75,
          relatedCareers: [`${fieldName} Consultant`, `${fieldName} Manager`, `${fieldName} Director`]
        },
        {
          id: `${fieldId}-pathway-2`,
          title: `${fieldName} Manager`,
          description: `Management role overseeing ${fieldName.toLowerCase()} teams and projects`,
          averageSalary: "$80,000 - $150,000",
          jobOutlook: "Very Good",
          growth: "10-20%",
          requiredSkills: ["Leadership", "Project Management", "Strategic Planning", "Team Building"],
          careerProgression: ["Team Lead", "Manager", "Senior Manager", "Director"],
          educationRequirements: "Bachelor's degree plus management experience",
          marketDemand: 80,
          workLifeBalance: 70,
          relatedCareers: [`${fieldName} Director`, `${fieldName} VP`, "Operations Manager"]
        }
      ],
      trendingOpportunities: ["Remote Work", "AI Integration", "Sustainability Focus"],
      emergingRoles: ["Digital Transformation Lead", "Data-Driven Specialist"],
      totalOpportunities: 2
    };
  }

  private buildCareerPathwaysPrompt(fieldId: string): string {
    const fieldDescriptions = {
      'stem': 'Science, Technology, Engineering, and Mathematics',
      'arts': 'Arts, Design, Creative Industries, and Entertainment',
      'business': 'Business, Commerce, Finance, and Entrepreneurship',
      'communication': 'Communication, Media, Journalism, and Digital Marketing',
      'sports': 'Sports, Fitness, Athletics, and Physical Training',
      'social': 'Education, Social Work, and Community Services'
    };

    const fieldName = fieldDescriptions[fieldId as keyof typeof fieldDescriptions] || fieldId.toUpperCase();

    return `
You are an expert career counselor with access to the latest industry data and job market trends. Generate comprehensive career pathway information for the ${fieldName} field.

Create a detailed JSON response with the following structure:

{
  "fieldName": "${fieldName}",
  "fieldDescription": "Brief description of the field and its current relevance",
  "pathways": [
    {
      "id": "unique-pathway-id",
      "title": "Career Pathway Title",
      "description": "Detailed description of this career path",
      "averageSalary": "$XX,XXX - $XXX,XXX",
      "jobOutlook": "Excellent/Good/Fair",
      "growth": "XX%",
      "requiredSkills": ["skill1", "skill2", "skill3"],
      "careerProgression": ["Entry Level", "Mid Level", "Senior Level", "Executive Level"],
      "educationRequirements": "Specific education requirements",
      "marketDemand": 85,
      "workLifeBalance": 75,
      "relatedCareers": ["related career 1", "related career 2"]
    }
  ],
  "trendingOpportunities": ["emerging opportunity 1", "emerging opportunity 2"],
  "emergingRoles": ["new role 1", "new role 2"],
  "totalOpportunities": 8
}

Requirements:
1. Generate 6-8 diverse career pathways within the ${fieldName} field
2. Include both traditional and emerging career paths
3. Use realistic salary ranges based on current market data (2024-2025)
4. Provide accurate growth percentages based on bureau of labor statistics
5. Include specific, actionable skills for each pathway
6. Make sure market demand scores are realistic (0-100 scale)
7. Work-life balance should reflect industry realities
8. Include trending opportunities that are currently in high demand
9. Add emerging roles that are expected to grow in the next 5 years

Focus on providing actionable, realistic career information that would help students make informed decisions.

Return ONLY the JSON object, no additional text or explanations.
`;
  }

  private cleanJsonResponse(text: string): string {
    // Remove markdown code blocks and any extra formatting
    let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Remove any text before the first {
    const firstBrace = cleaned.indexOf('{');
    if (firstBrace !== -1) {
      cleaned = cleaned.substring(firstBrace);
    }
    
    // Remove any text after the last }
    const lastBrace = cleaned.lastIndexOf('}');
    if (lastBrace !== -1) {
      cleaned = cleaned.substring(0, lastBrace + 1);
    }
    
    return cleaned.trim();
  }

  getFieldDisplayName(fieldId: string): string {
    const fieldNames = {
      'stem': 'STEM',
      'arts': 'Arts & Creative',
      'business': 'Business & Commerce',
      'communication': 'Communication & Media',
      'sports': 'Sports & Fitness',
      'social': 'Education & Social'
    };

    return fieldNames[fieldId as keyof typeof fieldNames] || fieldId.toUpperCase();
  }
}

export default new CareerPathwaysService();