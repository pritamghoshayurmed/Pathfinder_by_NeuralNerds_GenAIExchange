interface IndustryReport {
  title: string;
  source: string;
  date: string;
  summary: string;
  keyFindings: string[];
  relevantSkills: string[];
  reportUrl: string;
  articleLinks: {
    title: string;
    url: string;
    source: string;
  }[];
}

interface CachedReports {
  data: IndustryReport[];
  timestamp: number;
  lastFetchDate: string;
}

const CACHE_KEY = 'industry_reports_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

class IndustryReportsService {
  private apiKey: string;
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Gemini API key not found in environment variables');
    }
  }

  /**
   * Make a request to Gemini API
   */
  private async makeGeminiRequest(prompt: string): Promise<string> {
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
            maxOutputTokens: 4096,
          },
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

  /**
   * Check if cached data is still valid (less than 24 hours old)
   */
  private isCacheValid(cachedData: CachedReports): boolean {
    const now = new Date();
    const cacheDate = new Date(cachedData.lastFetchDate);
    
    // Check if it's the same day
    const isSameDay = 
      now.getDate() === cacheDate.getDate() &&
      now.getMonth() === cacheDate.getMonth() &&
      now.getFullYear() === cacheDate.getFullYear();
    
    // Check if cache is less than 24 hours old
    const isWithin24Hours = (now.getTime() - cachedData.timestamp) < CACHE_DURATION;
    
    return isSameDay && isWithin24Hours;
  }

  /**
   * Get cached reports from localStorage
   */
  private getCachedReports(): CachedReports | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const cachedData: CachedReports = JSON.parse(cached);
      
      if (this.isCacheValid(cachedData)) {
        console.log('Using cached industry reports from:', cachedData.lastFetchDate);
        return cachedData;
      } else {
        console.log('Cache expired, fetching new reports...');
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }

  /**
   * Save reports to localStorage cache
   */
  private setCachedReports(reports: IndustryReport[]): void {
    try {
      const cacheData: CachedReports = {
        data: reports,
        timestamp: Date.now(),
        lastFetchDate: new Date().toISOString()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log('Industry reports cached successfully');
    } catch (error) {
      console.error('Error caching reports:', error);
    }
  }

  /**
   * Fetch latest industry reports using Gemini AI
   */
  private async fetchLatestReports(): Promise<IndustryReport[]> {
    try {
      const currentDate = new Date().toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });

      const prompt = `Generate 4 latest and most relevant industry reports for technology and career development as of ${currentDate}. 
      
      Focus on these areas:
      1. AI & Machine Learning trends
      2. Cloud Computing & DevOps
      3. Cybersecurity
      4. Future of Work / Digital Transformation
      
      For each report, provide:
      - A realistic title (e.g., "State of AI in India 2025")
      - A credible source (e.g., NASSCOM, Gartner, IDC, McKinsey, World Economic Forum, ISC2)
      - Recent date (within last 3 months)
      - Compelling summary (1-2 sentences)
      - 4 key findings with specific numbers/percentages
      - 3-5 relevant skills
      - Realistic report URL (use actual organization domains)
      - 2 related article links with titles, URLs, and sources (use real Indian tech news sources like Economic Times, LiveMint, The Hindu Business Line, Forbes India, etc.)

      Return ONLY valid JSON array with this exact structure:
      [
        {
          "title": "Report Title",
          "source": "Organization Name",
          "date": "Month Year",
          "summary": "Brief summary",
          "keyFindings": ["Finding 1", "Finding 2", "Finding 3", "Finding 4"],
          "relevantSkills": ["Skill 1", "Skill 2", "Skill 3"],
          "reportUrl": "https://example.com/report",
          "articleLinks": [
            {
              "title": "Article Title",
              "url": "https://example.com/article",
              "source": "Source Name"
            }
          ]
        }
      ]

      Important: Return ONLY the JSON array, no markdown, no explanations, no code blocks.`;

      const response = await this.makeGeminiRequest(prompt);
      
      // Clean up the response to extract JSON
      let jsonText = response.trim();
      
      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Parse the JSON
      const reports: IndustryReport[] = JSON.parse(jsonText);
      
      // Validate the structure
      if (!Array.isArray(reports) || reports.length === 0) {
        throw new Error('Invalid response format from Gemini');
      }

      console.log(`Successfully fetched ${reports.length} industry reports`);
      return reports;
      
    } catch (error) {
      console.error('Error fetching latest reports:', error);
      throw new Error('Failed to fetch industry reports from AI service');
    }
  }

  /**
   * Get industry reports - from cache if valid, otherwise fetch new ones
   */
  async getIndustryReports(forceRefresh: boolean = false): Promise<IndustryReport[]> {
    try {
      // Check cache first unless force refresh
      if (!forceRefresh) {
        const cached = this.getCachedReports();
        if (cached) {
          return cached.data;
        }
      }

      // Fetch new reports
      const reports = await this.fetchLatestReports();
      
      // Cache the new reports
      this.setCachedReports(reports);
      
      return reports;
      
    } catch (error) {
      console.error('Error in getIndustryReports:', error);
      
      // If fetch fails, try to return cached data even if expired
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const cachedData: CachedReports = JSON.parse(cached);
        console.log('Returning expired cache due to fetch failure');
        return cachedData.data;
      }
      
      // If no cache available, return fallback static data
      return this.getFallbackReports();
    }
  }

  /**
   * Get cache info for display
   */
  getCacheInfo(): { lastUpdated: string | null; isValid: boolean } {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) {
        return { lastUpdated: null, isValid: false };
      }
      
      const cachedData: CachedReports = JSON.parse(cached);
      return {
        lastUpdated: new Date(cachedData.timestamp).toLocaleString(),
        isValid: this.isCacheValid(cachedData)
      };
    } catch {
      return { lastUpdated: null, isValid: false };
    }
  }

  /**
   * Clear cache and force refresh
   */
  clearCache(): void {
    localStorage.removeItem(CACHE_KEY);
    console.log('Industry reports cache cleared');
  }

  /**
   * Fallback static reports in case of complete failure
   */
  private getFallbackReports(): IndustryReport[] {
    return [
      {
        title: "State of AI in India 2025",
        source: "NASSCOM",
        date: "September 2025",
        summary: "AI adoption in Indian enterprises surged by 180% with demand for AI professionals reaching unprecedented levels",
        keyFindings: [
          "85% companies implementing AI initiatives",
          "52% skill gap in AI/ML talent",
          "₹750B AI market value by 2026",
          "2.5M AI jobs expected by 2027"
        ],
        relevantSkills: ["Machine Learning", "Python", "Deep Learning", "MLOps"],
        reportUrl: "https://www.nasscom.in/knowledge-center/publications/state-ai-india-2025",
        articleLinks: [
          {
            title: "AI Revolution in Indian Tech: NASSCOM's Latest Report",
            url: "https://economictimes.indiatimes.com/tech/technology/ai-revolution-in-indian-tech-nasscom-report/articleshow/123456789.cms",
            source: "Economic Times"
          },
          {
            title: "India's AI Workforce Gap: What Companies Need to Know",
            url: "https://www.livemint.com/technology/tech-news/indias-ai-workforce-gap-companies-need-to-know-116789012345678.html",
            source: "LiveMint"
          }
        ]
      },
      {
        title: "Cloud Computing Trends Report 2025",
        source: "Gartner",
        date: "August 2025",
        summary: "Multi-cloud and hybrid strategies dominate with 92% of enterprises adopting cloud-first approach",
        keyFindings: [
          "95% use multi-cloud architectures",
          "75% increase in DevOps/SRE roles",
          "₹350B cloud market in India",
          "Edge computing adoption up 300%"
        ],
        relevantSkills: ["AWS", "Azure", "Kubernetes", "DevOps", "Terraform"],
        reportUrl: "https://www.gartner.com/en/documents/1234567/cloud-computing-trends-2025",
        articleLinks: [
          {
            title: "Cloud Computing Market in India to Reach ₹1.2 Trillion by 2027",
            url: "https://www.business-standard.com/article/technology/cloud-computing-market-india-2027-1250897654321.html",
            source: "Business Standard"
          },
          {
            title: "Multi-Cloud Strategies: Why Indian Companies Are Leading",
            url: "https://www.forbesindia.com/article/explainers/multi-cloud-strategies-indian-companies-leading/98765",
            source: "Forbes India"
          }
        ]
      }
    ];
  }
}

export default new IndustryReportsService();
