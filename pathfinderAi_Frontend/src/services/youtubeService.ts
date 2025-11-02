// YouTube Data API Service
// Note: You'll need to add your YouTube API key in .env file as VITE_YOUTUBE_API_KEY

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  position: number;
}

interface PlaylistData {
  videos: YouTubeVideo[];
  totalVideos: number;
  playlistTitle: string;
}

class YouTubeService {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor() {
    this.apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || '';
  }

  // Extract playlist ID from various YouTube URL formats
  extractPlaylistId(url: string): string | null {
    const patterns = [
      /[?&]list=([^&]+)/,
      /playlist\?list=([^&]+)/,
      /embed\/videoseries\?list=([^&]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  }

  // Fetch playlist items from YouTube API
  async fetchPlaylistVideos(playlistUrl: string): Promise<PlaylistData> {
    const playlistId = this.extractPlaylistId(playlistUrl);
    
    if (!playlistId) {
      throw new Error('Invalid playlist URL');
    }

    // If no API key, return mock data
    if (!this.apiKey) {
      console.warn('YouTube API key not found. Using mock data.');
      return this.getMockPlaylistData(playlistId);
    }

    try {
      // Fetch playlist details
      const playlistResponse = await fetch(
        `${this.baseUrl}/playlists?part=snippet&id=${playlistId}&key=${this.apiKey}`
      );
      const playlistData = await playlistResponse.json();

      // Fetch playlist items (videos)
      const itemsResponse = await fetch(
        `${this.baseUrl}/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${this.apiKey}`
      );
      const itemsData = await itemsResponse.json();

      if (!itemsData.items) {
        throw new Error('No videos found in playlist');
      }

      // Fetch video durations
      const videoIds = itemsData.items.map((item: any) => item.contentDetails.videoId).join(',');
      const videosResponse = await fetch(
        `${this.baseUrl}/videos?part=contentDetails&id=${videoIds}&key=${this.apiKey}`
      );
      const videosData = await videosResponse.json();

      // Map videos with duration
      const videos: YouTubeVideo[] = itemsData.items.map((item: any, index: number) => {
        const videoDetails = videosData.items?.find((v: any) => v.id === item.contentDetails.videoId);
        const duration = videoDetails ? this.parseDuration(videoDetails.contentDetails.duration) : 'N/A';

        return {
          id: item.contentDetails.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
          duration: duration,
          position: item.snippet.position || index
        };
      });

      return {
        videos: videos.sort((a, b) => a.position - b.position),
        totalVideos: videos.length,
        playlistTitle: playlistData.items?.[0]?.snippet?.title || 'Playlist'
      };
    } catch (error) {
      console.error('Error fetching YouTube playlist:', error);
      // Fallback to mock data
      return this.getMockPlaylistData(playlistId);
    }
  }

  // Parse ISO 8601 duration format (PT1H2M10S) to readable format
  private parseDuration(duration: string): string {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 'N/A';

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Mock data for when API key is not available
  private getMockPlaylistData(playlistId: string): PlaylistData {
    const mockVideos: YouTubeVideo[] = [];
    const videoCount = 15; // Default mock video count

    for (let i = 0; i < videoCount; i++) {
      mockVideos.push({
        id: `mock-video-${i}`,
        title: `Video ${i + 1}: Introduction to Topic ${i + 1}`,
        description: `Learn about the fundamentals and advanced concepts in this comprehensive tutorial.`,
        thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg`,
        duration: `${Math.floor(Math.random() * 30 + 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        position: i
      });
    }

    return {
      videos: mockVideos,
      totalVideos: videoCount,
      playlistTitle: 'Learning Playlist'
    };
  }

  // Get embed URL for a specific video
  getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;
  }

  // Get embed URL for playlist starting at specific video
  getPlaylistEmbedUrl(playlistId: string, videoId?: string): string {
    const baseUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}&enablejsapi=1&rel=0`;
    return videoId ? `${baseUrl}&index=${videoId}` : baseUrl;
  }
}

export default new YouTubeService();
