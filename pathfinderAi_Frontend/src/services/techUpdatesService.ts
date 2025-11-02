interface TechUpdate {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  timestamp: string;
  url: string;
  impact: 'high' | 'medium' | 'low';
  tags: string[];
}

interface CachedTechUpdates {
  data: TechUpdate[];
  timestamp: number;
  fetchDate: string;
  scheduledTime: string; // "10:00 AM"
}

const CACHE_KEY = 'tech_updates_cache';
const SCHEDULED_HOUR = 10; // 10 AM
const SCHEDULED_MINUTE = 0;

class TechUpdatesService {
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
   * Check if it's time to fetch new updates (10:00 AM check)
   */
  private shouldFetchNewUpdates(cachedData: CachedTechUpdates | null): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // If no cache, fetch
    if (!cachedData) {
      console.log('No cache found, will fetch updates');
      return true;
    }

    const cacheDate = new Date(cachedData.fetchDate);
    const today = new Date();

    // Check if cache is from a previous day
    const isDifferentDay = 
      cacheDate.getDate() !== today.getDate() ||
      cacheDate.getMonth() !== today.getMonth() ||
      cacheDate.getFullYear() !== today.getFullYear();

    // If different day and current time is after 10:00 AM
    if (isDifferentDay && (currentHour > SCHEDULED_HOUR || 
        (currentHour === SCHEDULED_HOUR && currentMinute >= SCHEDULED_MINUTE))) {
      console.log('New day detected and past 10:00 AM, will fetch updates');
      return true;
    }

    // If same day but cache was created before 10:00 AM and now it's after 10:00 AM
    const cacheHour = cacheDate.getHours();
    const wasBeforeScheduledTime = cacheHour < SCHEDULED_HOUR || 
      (cacheHour === SCHEDULED_HOUR && cacheDate.getMinutes() < SCHEDULED_MINUTE);
    const isAfterScheduledTime = currentHour > SCHEDULED_HOUR || 
      (currentHour === SCHEDULED_HOUR && currentMinute >= SCHEDULED_MINUTE);

    if (!isDifferentDay && wasBeforeScheduledTime && isAfterScheduledTime) {
      console.log('Past 10:00 AM today, will fetch updates');
      return true;
    }

    console.log('Using cached updates, not time to fetch yet');
    return false;
  }

  /**
   * Get cached updates from localStorage
   */
  private getCachedUpdates(): CachedTechUpdates | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const cachedData: CachedTechUpdates = JSON.parse(cached);
      console.log('Tech updates cache found from:', cachedData.fetchDate);
      return cachedData;
    } catch (error) {
      console.error('Error reading tech updates cache:', error);
      return null;
    }
  }

  /**
   * Save updates to localStorage cache
   */
  private setCachedUpdates(updates: TechUpdate[]): void {
    try {
      const now = new Date();
      const cacheData: CachedTechUpdates = {
        data: updates,
        timestamp: Date.now(),
        fetchDate: now.toISOString(),
        scheduledTime: `${SCHEDULED_HOUR}:${SCHEDULED_MINUTE.toString().padStart(2, '0')} AM`
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log('Tech updates cached successfully at', now.toLocaleString());
    } catch (error) {
      console.error('Error caching tech updates:', error);
    }
  }

  /**
   * Fetch latest tech updates using Gemini AI
   */
  private async fetchLatestUpdates(): Promise<TechUpdate[]> {
    try {
      const currentDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      const prompt = `Generate 8-10 latest and most relevant technology updates and announcements for TODAY: ${currentDate}.

Focus on these categories:
1. AI & Machine Learning (new releases, models, tools)
2. Cloud Computing & DevOps (new services, features)
3. Programming Languages & Frameworks (version releases, updates)
4. Cybersecurity (vulnerabilities, patches, new tools)
5. Mobile & Web Development (new features, deprecations)
6. Hardware & Devices (product launches, announcements)
7. Tech Companies (major announcements, acquisitions, layoffs)
8. Developer Tools (new tools, updates, deprecations)

For each update, provide:
- Unique ID (uuid format)
- Title (concise, newsworthy)
- Summary (2-3 sentences about the update)
- Category (one of the 8 above)
- Source (company/organization name)
- Timestamp (ISO format for today)
- URL (realistic tech news URL like techcrunch.com, theverge.com, etc.)
- Impact level: "high", "medium", or "low"
- 2-4 relevant tags

Make updates realistic, recent, and relevant to developers and tech professionals.
Include a mix of:
- Product launches
- Version releases
- Security updates
- Company announcements
- Tool updates
- Industry trends

Return ONLY valid JSON array with this exact structure:
[
  {
    "id": "uuid-here",
    "title": "Update Title",
    "summary": "Brief summary of the update",
    "category": "AI & Machine Learning",
    "source": "Company Name",
    "timestamp": "2025-10-22T10:00:00Z",
    "url": "https://example.com/article",
    "impact": "high",
    "tags": ["tag1", "tag2", "tag3"]
  }
]

Important: Return ONLY the JSON array, no markdown, no explanations, no code blocks.`;

      const response = await this.makeGeminiRequest(prompt);
      
      // Clean up the response to extract JSON
      let jsonText = response.trim();
      
      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Parse the JSON
      const updates: TechUpdate[] = JSON.parse(jsonText);
      
      // Validate the structure
      if (!Array.isArray(updates) || updates.length === 0) {
        throw new Error('Invalid response format from Gemini');
      }

      console.log(`Successfully fetched ${updates.length} tech updates`);
      return updates;
      
    } catch (error) {
      console.error('Error fetching latest tech updates:', error);
      throw new Error('Failed to fetch tech updates from AI service');
    }
  }

  /**
   * Get tech updates - from cache if valid, otherwise fetch new ones at 10 AM
   */
  async getTechUpdates(forceRefresh: boolean = false): Promise<TechUpdate[]> {
    try {
      // Check cache first unless force refresh
      const cached = this.getCachedUpdates();
      
      if (!forceRefresh && cached && !this.shouldFetchNewUpdates(cached)) {
        return cached.data;
      }

      // Fetch new updates
      const updates = await this.fetchLatestUpdates();
      
      // Cache the new updates
      this.setCachedUpdates(updates);
      
      return updates;
      
    } catch (error) {
      console.error('Error in getTechUpdates:', error);
      
      // If fetch fails, try to return cached data even if expired
      const cached = this.getCachedUpdates();
      if (cached) {
        console.log('Returning cached updates due to fetch failure');
        return cached.data;
      }
      
      // If no cache available, return fallback static data
      return this.getFallbackUpdates();
    }
  }

  /**
   * Get cache info for display
   */
  getCacheInfo(): { lastUpdated: string | null; nextUpdate: string | null } {
    try {
      const cached = this.getCachedUpdates();
      if (!cached) {
        return { lastUpdated: null, nextUpdate: 'Today at 10:00 AM' };
      }
      
      const cacheDate = new Date(cached.fetchDate);
      const now = new Date();
      
      // Calculate next update time
      const nextUpdate = new Date(now);
      if (now.getHours() >= SCHEDULED_HOUR) {
        // If past 10 AM today, next update is tomorrow at 10 AM
        nextUpdate.setDate(nextUpdate.getDate() + 1);
      }
      nextUpdate.setHours(SCHEDULED_HOUR, SCHEDULED_MINUTE, 0, 0);
      
      return {
        lastUpdated: cacheDate.toLocaleString(),
        nextUpdate: nextUpdate.toLocaleString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true 
        })
      };
    } catch {
      return { lastUpdated: null, nextUpdate: 'Today at 10:00 AM' };
    }
  }

  /**
   * Clear cache and force refresh
   */
  clearCache(): void {
    localStorage.removeItem(CACHE_KEY);
    console.log('Tech updates cache cleared');
  }

  /**
   * Check if updates should be refreshed (for UI to show notification)
   */
  shouldShowRefreshNotification(): boolean {
    const cached = this.getCachedUpdates();
    return this.shouldFetchNewUpdates(cached);
  }

  /**
   * Fallback static updates in case of complete failure
   */
  private getFallbackUpdates(): TechUpdate[] {
    const today = new Date().toISOString();
    return [
      {
        id: '1',
        title: 'Google Announces Gemini 2.0 Flash with Enhanced Performance',
        summary: 'Google has released Gemini 2.0 Flash, featuring improved response times and better contextual understanding for developers.',
        category: 'AI & Machine Learning',
        source: 'Google',
        timestamp: today,
        url: 'https://techcrunch.com/google-gemini-2-0-flash',
        impact: 'high',
        tags: ['AI', 'Gemini', 'Google', 'LLM']
      },
      {
        id: '2',
        title: 'React 19 Release Candidate Now Available',
        summary: 'The React team has announced the release candidate for React 19, introducing new Server Components and improved performance optimizations.',
        category: 'Programming Languages & Frameworks',
        source: 'Meta',
        timestamp: today,
        url: 'https://react.dev/blog/react-19-rc',
        impact: 'high',
        tags: ['React', 'JavaScript', 'Frontend', 'Web Development']
      },
      {
        id: '3',
        title: 'Critical Security Patch Released for Node.js',
        summary: 'Node.js has released security updates addressing multiple vulnerabilities. Developers are urged to update immediately.',
        category: 'Cybersecurity',
        source: 'Node.js Foundation',
        timestamp: today,
        url: 'https://nodejs.org/security',
        impact: 'high',
        tags: ['Node.js', 'Security', 'Vulnerability', 'Backend']
      },
      {
        id: '4',
        title: 'AWS Launches New Serverless Database Service',
        summary: 'Amazon Web Services introduces a new serverless database offering with automatic scaling and pay-per-request pricing.',
        category: 'Cloud Computing & DevOps',
        source: 'AWS',
        timestamp: today,
        url: 'https://aws.amazon.com/blogs/aws',
        impact: 'medium',
        tags: ['AWS', 'Database', 'Serverless', 'Cloud']
      },
      {
        id: '5',
        title: 'Microsoft Copilot Updates with New AI Features',
        summary: 'Microsoft enhances Copilot with advanced code suggestions and natural language query capabilities for developers.',
        category: 'Developer Tools',
        source: 'Microsoft',
        timestamp: today,
        url: 'https://techcrunch.com/microsoft-copilot-update',
        impact: 'medium',
        tags: ['Microsoft', 'Copilot', 'AI', 'Developer Tools']
      }
    ];
  }
}

export default new TechUpdatesService();
export type { TechUpdate, CachedTechUpdates };
