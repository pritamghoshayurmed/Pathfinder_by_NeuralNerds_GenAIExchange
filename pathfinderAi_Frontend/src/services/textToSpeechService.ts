/**
 * Text-to-Speech Service
 * Wraps the Web Speech API for speaking questions and answers
 * Provides speaker control with pause, resume, and stop capabilities
 * Includes fallback and error handling for better cross-browser compatibility
 */

export interface SpeechOptions {
  rate?: number; // 0.1 to 10 (default 1)
  pitch?: number; // 0 to 2 (default 1)
  volume?: number; // 0 to 1 (default 1)
  lang?: string; // language code (default 'en-US')
}

export interface SpeechStatus {
  isPlaying: boolean;
  isPaused: boolean;
  currentText: string;
}

class TextToSpeechService {
  private synthesis: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private status: SpeechStatus = {
    isPlaying: false,
    isPaused: false,
    currentText: ''
  };
  private statusCallbacks: Array<(status: SpeechStatus) => void> = [];
  private defaultOptions: SpeechOptions = {
    rate: 1,
    pitch: 1,
    volume: 1,
    lang: 'en-US'
  };
  private isInitialized = false;
  private initError: string | null = null;

  constructor() {
    try {
      this.initializeSpeechSynthesis();
      this.isInitialized = true;
    } catch (error) {
      this.initError = error instanceof Error ? error.message : 'Failed to initialize Text-to-Speech';
      console.error('TTS Initialization Error:', this.initError);
    }
  }

  /**
   * Initialize Speech Synthesis with proper error handling
   */
  private initializeSpeechSynthesis(): void {
    const windowObj = window as any;
    
    // Try to get speech synthesis API
    this.synthesis = windowObj.speechSynthesis || windowObj.webkitSpeechSynthesis;

    if (!this.synthesis) {
      throw new Error('Text-to-Speech API is not supported in this browser');
    }

    // Ensure synthesis is ready
    if (this.synthesis.getVoices().length === 0) {
      // Voices might not be loaded yet
      const voicesChangedHandler = () => {
        console.log('Voices loaded:', this.synthesis?.getVoices().length);
        this.synthesis?.removeEventListener('voiceschanged', voicesChangedHandler);
      };
      this.synthesis.addEventListener('voiceschanged', voicesChangedHandler);
    }
  }

  /**
   * Check if Text-to-Speech is supported
   */
  isSupported(): boolean {
    return this.synthesis !== null && !this.initError;
  }

  /**
   * Get available voices
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    try {
      return this.synthesis.getVoices() || [];
    } catch (error) {
      console.error('Error getting voices:', error);
      return [];
    }
  }

  /**
   * Subscribe to status changes
   */
  onStatusChange(callback: (status: SpeechStatus) => void): () => void {
    this.statusCallbacks.push(callback);
    // Return unsubscribe function
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Clean text for better speech synthesis
   */
  private cleanTextForSpeech(text: string): string {
    if (!text) return '';
    
    return text
      // Remove markdown markers
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      // Remove code block markers
      .replace(/```.*?```/gs, '')
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Replace common abbreviations
      .replace(/&amp;/g, 'and')
      .replace(/&nbsp;/g, ' ')
      // Remove special characters that might cause issues
      .replace(/[^\w\s.,!?;:()\-'"]/g, '')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Speak text with full error handling
   */
  speak(text: string, options?: SpeechOptions): void {
    if (!this.synthesis) {
      this.notifyError('Text-to-Speech API is not supported in this browser');
      return;
    }

    if (!text || text.trim().length === 0) {
      this.notifyError('No text provided to speak');
      return;
    }

    try {
      // Stop any current speech
      this.stop();

      const mergedOptions = { ...this.defaultOptions, ...options };
      
      // Clean the text for better synthesis
      const cleanedText = this.cleanTextForSpeech(text);

      // Create utterance using proper constructor
      this.utterance = new SpeechSynthesisUtterance(cleanedText);
      
      // Set properties with validation
      this.utterance.rate = Math.max(0.1, Math.min(10, mergedOptions.rate || 1));
      this.utterance.pitch = Math.max(0, Math.min(2, mergedOptions.pitch || 1));
      this.utterance.volume = Math.max(0, Math.min(1, mergedOptions.volume || 1));
      this.utterance.lang = mergedOptions.lang || 'en-US';

      // Try to set a preferred voice
      const voices = this.getAvailableVoices();
      if (voices.length > 0) {
        // Prefer Google US English voice if available
        const preferredVoice = voices.find(
          (v) => v.lang === 'en-US' && v.name.includes('Google')
        ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];
        
        if (preferredVoice) {
          this.utterance.voice = preferredVoice;
        }
      }

      // Set up event handlers with proper binding
      this.utterance.onstart = this.handleSpeakStart.bind(this);
      this.utterance.onend = this.handleSpeakEnd.bind(this);
      this.utterance.onerror = this.handleSpeakError.bind(this);
      this.utterance.onpause = this.handleSpeakPause.bind(this);
      this.utterance.onresume = this.handleSpeakResume.bind(this);

      // Initiate speech
      this.synthesis.speak(this.utterance);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error during speech synthesis';
      this.notifyError(errorMsg);
    }
  }

  /**
   * Handle speak start event
   */
  private handleSpeakStart(): void {
    this.status = {
      isPlaying: true,
      isPaused: false,
      currentText: this.utterance?.text || ''
    };
    this.notifyStatusChange();
  }

  /**
   * Handle speak end event
   */
  private handleSpeakEnd(): void {
    this.status = { isPlaying: false, isPaused: false, currentText: '' };
    this.notifyStatusChange();
  }

  /**
   * Handle speak error event
   */
  private handleSpeakError(event: SpeechSynthesisErrorEvent): void {
    console.error('Speech synthesis error:', event.error);
    this.notifyError(`Speech error: ${event.error}`);
    this.status = { isPlaying: false, isPaused: false, currentText: '' };
    this.notifyStatusChange();
  }

  /**
   * Handle speak pause event
   */
  private handleSpeakPause(): void {
    this.status = {
      isPlaying: true,
      isPaused: true,
      currentText: this.utterance?.text || ''
    };
    this.notifyStatusChange();
  }

  /**
   * Handle speak resume event
   */
  private handleSpeakResume(): void {
    this.status = {
      isPlaying: true,
      isPaused: false,
      currentText: this.utterance?.text || ''
    };
    this.notifyStatusChange();
  }

  /**
   * Pause speech
   */
  pause(): void {
    if (!this.synthesis) {
      this.notifyError('Text-to-Speech API is not available');
      return;
    }
    try {
      this.synthesis.pause();
    } catch (error) {
      console.error('Error pausing speech:', error);
    }
  }

  /**
   * Resume speech
   */
  resume(): void {
    if (!this.synthesis) {
      this.notifyError('Text-to-Speech API is not available');
      return;
    }
    try {
      this.synthesis.resume();
    } catch (error) {
      console.error('Error resuming speech:', error);
    }
  }

  /**
   * Stop speech
   */
  stop(): void {
    if (!this.synthesis) return;
    try {
      this.synthesis.cancel();
      this.status = { isPlaying: false, isPaused: false, currentText: '' };
      this.notifyStatusChange();
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }

  /**
   * Get current status
   */
  getStatus(): SpeechStatus {
    return { ...this.status };
  }

  /**
   * Speak question and answer
   */
  speakQuestionAndAnswer(
    question: string,
    answer: string,
    options?: SpeechOptions
  ): void {
    const fullText = `Question: ${question}. Answer: ${answer}`;
    this.speak(fullText, options);
  }

  /**
   * Speak question only
   */
  speakQuestion(question: string, options?: SpeechOptions): void {
    this.speak(`Question: ${question}`, options);
  }

  /**
   * Speak answer only
   */
  speakAnswer(answer: string, options?: SpeechOptions): void {
    this.speak(`Answer: ${answer}`, options);
  }

  /**
   * Notify all subscribers of status change
   */
  private notifyStatusChange(): void {
    this.statusCallbacks.forEach(callback => {
      callback({ ...this.status });
    });
  }

  /**
   * Notify error (logs to console)
   */
  private notifyError(message: string): void {
    console.error('TTS Error:', message);
  }

  /**
   * Set default speech options
   */
  setDefaultOptions(options: Partial<SpeechOptions>): void {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  /**
   * Get default speech options
   */
  getDefaultOptions(): SpeechOptions {
    return { ...this.defaultOptions };
  }
}

// Export singleton instance
export default new TextToSpeechService();
