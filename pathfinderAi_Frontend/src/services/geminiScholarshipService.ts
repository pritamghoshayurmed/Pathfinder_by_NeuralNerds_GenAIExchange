import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  type: string;
  amount: string;
  duration: string;
  totalAmount: string;
  eligibility: string[];
  deadline: string;
  status: string;
  applicants: string;
  successRate: number;
  requirements: string[];
  description: string;
  benefits: string[];
  category: string;
  field: string;
  applicationUrl?: string;
  isAIGenerated?: boolean;
}

export interface ScholarshipSearchParams {
  searchTerm: string;
  category: string;
  eligibility: string;
  amount: string;
  deadline: string;
}

export interface ScholarshipSearchResult {
  scholarships: Scholarship[];
  searchQuery: string;
  totalFound: number;
  aiGenerated: Scholarship[];
}

class GeminiScholarshipService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_SCHOLARSHIP_API_KEY;
    console.log('🔑 Gemini Scholarship API Key Status:', apiKey ? 'Found' : 'Missing');
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.error('❌ Gemini Scholarship API key not configured properly');
      throw new Error('Gemini Scholarship API key not found or not configured. Please check your .env file.');
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      console.log('✅ Gemini Scholarship service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Gemini Scholarship service:', error);
      throw error;
    }
  }

  async searchScholarships(
    searchParams: ScholarshipSearchParams,
    existingScholarships: Scholarship[]
  ): Promise<ScholarshipSearchResult> {
    console.log('🔍 Starting AI scholarship search...');
    console.log('📋 Search params:', searchParams);
    
    try {
      // First check if search matches existing scholarships
      const existingMatches = this.filterExistingScholarships(searchParams, existingScholarships);
      
      // If we have good matches and search is generic, return existing
      if (existingMatches.length >= 3 && this.isGenericSearch(searchParams.searchTerm)) {
        console.log('✅ Found sufficient existing matches for generic search');
        return {
          scholarships: existingMatches,
          searchQuery: searchParams.searchTerm,
          totalFound: existingMatches.length,
          aiGenerated: []
        };
      }

      // Generate AI scholarships for specific searches or when few matches found
      const aiScholarships = await this.generateScholarships(searchParams);
      
      // Combine existing and AI generated
      const allScholarships = [...existingMatches, ...aiScholarships];
      
      console.log('✅ Successfully completed scholarship search');
      
      return {
        scholarships: allScholarships,
        searchQuery: searchParams.searchTerm,
        totalFound: allScholarships.length,
        aiGenerated: aiScholarships
      };
      
    } catch (error) {
      console.error('❌ Error in scholarship search:', error);
      
      // Fallback to existing scholarships only
      const existingMatches = this.filterExistingScholarships(searchParams, existingScholarships);
      
      return {
        scholarships: existingMatches,
        searchQuery: searchParams.searchTerm,
        totalFound: existingMatches.length,
        aiGenerated: []
      };
    }
  }

  private filterExistingScholarships(
    searchParams: ScholarshipSearchParams,
    scholarships: Scholarship[]
  ): Scholarship[] {
    return scholarships.filter(scholarship => {
      const searchTerm = searchParams.searchTerm.toLowerCase();
      
      const matchesSearch = !searchTerm || 
        scholarship.name.toLowerCase().includes(searchTerm) ||
        scholarship.provider.toLowerCase().includes(searchTerm) ||
        scholarship.field.toLowerCase().includes(searchTerm) ||
        scholarship.description.toLowerCase().includes(searchTerm);
      
      const matchesCategory = !searchParams.category || 
        searchParams.category === "all-categories" || 
        scholarship.category === searchParams.category;
      
      const matchesType = !searchParams.eligibility || 
        searchParams.eligibility === "all-types" || 
        scholarship.type === searchParams.eligibility;
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }

  private isGenericSearch(searchTerm: string): boolean {
    const genericTerms = ['scholarship', 'funding', 'grant', 'education', 'student', 'financial aid'];
    const term = searchTerm.toLowerCase().trim();
    
    if (term.length <= 3) return true;
    
    return genericTerms.some(generic => term === generic || term.includes(generic));
  }

  private async generateScholarships(searchParams: ScholarshipSearchParams): Promise<Scholarship[]> {
    const prompt = this.createScholarshipPrompt(searchParams);
    console.log('📝 Generated search prompt');
    
    try {
      console.log('🤖 Calling Gemini API for scholarship search...');
      const result = await this.model.generateContent(prompt);
      
      if (!result || !result.response) {
        throw new Error('Invalid response from Gemini API');
      }
      
      const response = await result.response;
      const text = response.text();
      console.log('📨 Raw AI response received');

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('⚠️ No JSON found in response');
        return [];
      }

      const jsonData = JSON.parse(jsonMatch[0]);
      console.log('✅ Successfully parsed JSON response');
      
      if (!jsonData.scholarships || !Array.isArray(jsonData.scholarships)) {
        console.warn('⚠️ Invalid scholarship data structure');
        return [];
      }

      // Process and validate AI scholarships
      const aiScholarships = jsonData.scholarships.map((scholarship: Record<string, unknown>, index: number) => ({
        id: `ai-scholarship-${Date.now()}-${index}`,
        name: scholarship.name || 'AI Generated Scholarship',
        provider: scholarship.provider || 'Various Organizations',
        type: scholarship.type || 'Merit-based',
        amount: scholarship.amount || '₹50,000/year',
        duration: scholarship.duration || '4 years',
        totalAmount: scholarship.totalAmount || '₹2,00,000',
        eligibility: Array.isArray(scholarship.eligibility) ? scholarship.eligibility : ['Standard eligibility criteria'],
        deadline: scholarship.deadline || this.generateFutureDate(),
        status: 'Active',
        applicants: scholarship.applicants || '10,000+',
        successRate: Number(scholarship.successRate) || 30,
        requirements: Array.isArray(scholarship.requirements) ? scholarship.requirements : ['Application form', 'Academic documents'],
        description: scholarship.description || 'AI generated scholarship opportunity',
        benefits: Array.isArray(scholarship.benefits) ? scholarship.benefits : ['Financial support', 'Educational assistance'],
        category: scholarship.category || 'Private Foundation',
        field: scholarship.field || searchParams.searchTerm || 'All Streams',
        applicationUrl: scholarship.applicationUrl || this.generateFallbackApplicationUrl(scholarship.provider as string, scholarship.category as string),
        isAIGenerated: true
      }));

      console.log(`✅ Generated ${aiScholarships.length} AI scholarships`);
      return aiScholarships.slice(0, 5); // Limit to 5 AI scholarships
      
    } catch (error) {
      console.error('❌ Error generating AI scholarships:', error);
      return [];
    }
  }

  private createScholarshipPrompt(searchParams: ScholarshipSearchParams): string {
    return `You are an expert scholarship database consultant. Generate realistic scholarship opportunities based on the search criteria.

Search Query: "${searchParams.searchTerm}"
Category Filter: ${searchParams.category || 'Any'}
Type Filter: ${searchParams.eligibility || 'Any'}
Amount Filter: ${searchParams.amount || 'Any'}

Generate 3-5 relevant scholarship opportunities that match these criteria. Focus on creating realistic scholarships that would actually exist for this search query.

Return ONLY a valid JSON object with this exact structure:

{
  "scholarships": [
    {
      "name": "Scholarship name that matches the search query",
      "provider": "Realistic organization or government body",
      "type": "Merit-based/Need-based/Gender-specific/Community-based",
      "amount": "₹X,XXX/year format",
      "duration": "X years",
      "totalAmount": "₹X,XX,XXX format",
      "eligibility": ["Realistic eligibility criteria", "Academic requirements", "Income criteria"],
      "deadline": "2025-XX-XX format",
      "applicants": "XX,XXX+ format",
      "successRate": 25,
      "requirements": ["Realistic document requirements", "Application materials"],
      "description": "Detailed description of the scholarship purpose and goals",
      "benefits": ["Specific benefits offered", "Additional support"],
      "category": "Government/Corporate/Private Foundation/State Government",
      "field": "Field of study this scholarship covers",
      "applicationUrl": "https://example.com/apply (realistic application portal URL)"
    }
  ]
}

IMPORTANT GUIDELINES:
- Make scholarships relevant to the search query "${searchParams.searchTerm}"
- Use realistic Indian scholarship amounts and providers
- Include proper eligibility criteria and requirements
- Set future deadlines in 2025
- Make descriptions specific to the search field
- Ensure all amounts are in Indian Rupees format
- Success rates should be between 15-60%
- Provider names should sound authentic and real
- Application URLs should be realistic (use scholarships.gov.in for government, buddy4study.com for private, or organization-specific URLs)
- Always include a valid applicationUrl field for each scholarship`;
  }

  private generateFutureDate(): string {
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const days = ['15', '20', '25', '30'];
    
    const randomMonth = months[Math.floor(Math.random() * months.length)];
    const randomDay = days[Math.floor(Math.random() * days.length)];
    
    return `2025-${randomMonth}-${randomDay}`;
  }

  private generateFallbackApplicationUrl(provider: string, category: string): string {
    // Generate appropriate fallback URLs based on provider and category
    const normalizedProvider = provider?.toLowerCase() || '';
    const normalizedCategory = category?.toLowerCase() || '';

    // Government scholarships
    if (normalizedCategory.includes('government') || 
        normalizedProvider.includes('government') || 
        normalizedProvider.includes('ministry') ||
        normalizedProvider.includes('department')) {
      return 'https://scholarships.gov.in/';
    }

    // State government scholarships
    if (normalizedCategory.includes('state') || normalizedProvider.includes('state')) {
      return 'https://scholarships.gov.in/';
    }

    // Corporate scholarships
    if (normalizedCategory.includes('corporate') || 
        normalizedProvider.includes('foundation') ||
        normalizedProvider.includes('group') ||
        normalizedProvider.includes('company')) {
      return 'https://www.buddy4study.com/';
    }

    // Private foundation scholarships
    if (normalizedCategory.includes('private') || normalizedCategory.includes('foundation')) {
      return 'https://www.buddy4study.com/';
    }

    // Default fallback
    return 'https://scholarships.gov.in/';
  }

  // Method to validate and clean AI generated data
  validateScholarship(scholarship: Record<string, unknown>): boolean {
    const required = ['name', 'provider', 'amount', 'description'];
    return required.every(field => {
      const value = scholarship[field];
      return typeof value === 'string' && value.length > 0;
    });
  }
}

export default new GeminiScholarshipService();
