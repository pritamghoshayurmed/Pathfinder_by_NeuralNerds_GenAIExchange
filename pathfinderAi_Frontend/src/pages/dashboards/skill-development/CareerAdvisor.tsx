import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Brain, Sparkles, MessageSquare, Zap, Send, User, Bot, Loader2, CheckCircle2, BookOpen, Target, Code, Rocket, Trophy, Lightbulb, History, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";
import { LearningPath } from "@/components/LearningPath";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

// ✅ Import from careerAdvisorService
import { 
  careerAdvisorService,
  type Message,
  type CareerSummary,
  type DetailedLearningPath,
  type SavedLearningPath
} from "@/services/careerAdvisorService";

const CareerAdvisor = () => {
  const { toast } = useToast();
  
  // State management
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm PathFinder AI, your personal career advisor. I'm here to help you navigate your career journey, develop new skills, and achieve your professional goals. What would you like to discuss today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasSpokenGreeting, setHasSpokenGreeting] = useState(false);
  const [conversationEnded, setConversationEnded] = useState(false);
  const [careerSummary, setCareerSummary] = useState<CareerSummary | null>(null);
  const [detailedPath, setDetailedPath] = useState<DetailedLearningPath | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingPreviousPath, setIsLoadingPreviousPath] = useState(true);
  const [hasPreviousPath, setHasPreviousPath] = useState(false);
  const [showAllPaths, setShowAllPaths] = useState(false);
  const [allPaths, setAllPaths] = useState<SavedLearningPath[]>([]);
  const [showPathsSection, setShowPathsSection] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Speak text
  const speakText = (text: string) => {
    if (!synthRef.current || isMuted) return;

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.name.includes('Natural')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      console.log('🎤 Started speaking:', text.substring(0, 50) + '...');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      console.log('🎤 Finished speaking');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  // Toggle voice listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  // Handle send message - Updated to use service
  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();

    if (!textToSend || conversationEnded) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // ✅ Use service method
    if (careerAdvisorService.isThankYouMessage(textToSend)) {
      setIsProcessing(true);

      const farewellMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "You're very welcome! Let me prepare a comprehensive learning path for you. This will take just a moment...",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, farewellMessage]);

      if (!isMuted) {
        speakText(farewellMessage.content);
      }

      setTimeout(async () => {
        setIsProcessing(false);
        setConversationEnded(true);
        setIsGeneratingSummary(true);

        const statusMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: "Analyzing our conversation to understand your career goals...",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, statusMessage]);

        // ✅ Use service method
        const summary = await careerAdvisorService.generateCareerSummary(messages);
        setCareerSummary(summary);
        setIsGeneratingSummary(false);

        const summaryMessage: Message = {
          id: (Date.now() + 3).toString(),
          role: 'assistant',
          content: `Perfect! I've identified your goal to become a ${summary.targetRole}. Now generating a detailed learning path...`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, summaryMessage]);

        setIsGeneratingPath(true);

        // ✅ Use service method
        const detailedLearningPath = await careerAdvisorService.generateDetailedLearningPath(summary);
        setDetailedPath(detailedLearningPath);
        setIsGeneratingPath(false);

        const finalMessage: Message = {
          id: (Date.now() + 4).toString(),
          role: 'assistant',
          content: `Excellent! I've created your personalized ${detailedLearningPath.phases.length}-phase learning roadmap. Scroll down to see all the details! 🚀`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, finalMessage]);

        if (!isMuted) {
          speakText(finalMessage.content);
        }

        // ✅ Use service method to save
        if (userId) {
          console.log('💾 Saving learning path to database...');
          const allMessages = [...messages, userMessage, farewellMessage, statusMessage, summaryMessage, finalMessage];
          
          const saveResult = await careerAdvisorService.saveLearningPath(
            userId,
            summary,
            detailedLearningPath,
            allMessages
          );

          if (saveResult.success) {
            console.log('✅ Learning path saved successfully!');
            setHasPreviousPath(true);
            
            toast({
              title: "Learning Path Saved! 🎉",
              description: "Your personalized career roadmap has been saved",
              variant: "default"
            });

            const saveConfirmation: Message = {
              id: (Date.now() + 5).toString(),
              role: 'assistant',
              content: "Your learning path has been saved! You can return anytime to continue your journey.",
              timestamp: new Date()
            };
            setMessages(prev => [...prev, saveConfirmation]);
          } else {
            console.error('❌ Failed to save learning path:', saveResult.error);
            toast({
              title: "Save Failed",
              description: saveResult.error || "Couldn't save your learning path",
              variant: "destructive"
            });
          }
        }
      }, 2000);

      return;
    }

    setIsProcessing(true);

    try {
      // ✅ Use service method
      const aiResponse = await careerAdvisorService.generateAIResponse(textToSend, messages);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (!isMuted) {
        speakText(aiResponse);
      }
    } catch (error) {
      console.error('Error in conversation:', error);
      toast({
        title: "Communication Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Initialize speech services
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Initialize and load previous learning path
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          console.log('👤 User ID:', user.id);
          
          // ✅ Use service method
          const result = await careerAdvisorService.getLatestLearningPath(user.id);
          
          if (result.success && result.data) {
            console.log('📚 Previous learning path found!');
            setHasPreviousPath(true);
            
            if (messages.length === 1 && messages[0].role === 'assistant' && !conversationEnded) {
              const savedPath = result.data;
              
              setCareerSummary({
                careerGoal: savedPath.career_goal,
                keyInterests: savedPath.key_interests,
                currentLevel: savedPath.current_level,
                targetRole: savedPath.target_role,
                timeframe: savedPath.timeframe,
                learningPath: []
              });
              
              setDetailedPath({
                career: savedPath.target_role,
                overview: savedPath.career_overview,
                totalDuration: savedPath.total_duration,
                difficulty: savedPath.difficulty,
                prerequisites: savedPath.prerequisites,
                outcomes: savedPath.outcomes,
                phases: savedPath.phases,
                certifications: savedPath.certifications,
                jobMarket: savedPath.job_market
              });
              
              if (savedPath.conversation_messages && savedPath.conversation_messages.length > 0) {
                setMessages(savedPath.conversation_messages.map(msg => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp)
                })));
              }
              
              setConversationEnded(true);
              setHasSpokenGreeting(true);
              
              const welcomeBackMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: `Welcome back! I've loaded your previous learning path for ${savedPath.target_role}. You can continue from where you left off, or start a new conversation.`,
                timestamp: new Date()
              };
              
              setMessages(prev => [...prev, welcomeBackMessage]);
              
              if (!isMuted) {
                speakText(welcomeBackMessage.content);
              }
            }
          } else {
            console.log('📝 No previous learning path found');
          }
        } else {
          console.warn('⚠️ No user logged in');
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        toast({
          title: "Initialization Error",
          description: "Failed to load previous learning paths",
          variant: "destructive"
        });
      } finally {
        setIsLoadingPreviousPath(false);
      }
    };

    initializeUser();
  }, []);

  // Auto-speak greeting on component mount
  useEffect(() => {
    if (synthRef.current && !hasSpokenGreeting && messages.length > 0) {
      const speakGreeting = () => {
        if (synthRef.current) {
          const voices = synthRef.current.getVoices();
          if (voices.length > 0 && !hasSpokenGreeting) {
            const greetingMessage = messages[0].content;
            speakText(greetingMessage);
            setHasSpokenGreeting(true);
          }
        }
      };

      speakGreeting();

      const timer = setTimeout(() => {
        if (!hasSpokenGreeting) {
          speakGreeting();
        }
      }, 500);

      if (synthRef.current) {
        synthRef.current.onvoiceschanged = () => {
          if (!hasSpokenGreeting) {
            speakGreeting();
          }
        };
      }

      return () => {
        clearTimeout(timer);
      };
    }
  }, [hasSpokenGreeting, messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load all saved learning paths - Updated to use service
  const loadAllPaths = async () => {
    if (!userId) return;
    
    // ✅ Use service method
    const result = await careerAdvisorService.getAllLearningPaths(userId);
    
    if (result.success && result.data) {
      setAllPaths(result.data);
      setShowPathsSection(true);
    } else {
      toast({
        title: "Load Failed",
        description: result.error || "Couldn't load learning paths",
        variant: "destructive"
      });
    }
  };

  // Load a specific saved path
  const loadSavedPath = (savedPath: SavedLearningPath) => {
    setCareerSummary({
      careerGoal: savedPath.career_goal,
      keyInterests: savedPath.key_interests,
      currentLevel: savedPath.current_level,
      targetRole: savedPath.target_role,
      timeframe: savedPath.timeframe,
      learningPath: []
    });
    
    setDetailedPath({
      career: savedPath.target_role,
      overview: savedPath.career_overview,
      totalDuration: savedPath.total_duration,
      difficulty: savedPath.difficulty,
      prerequisites: savedPath.prerequisites,
      outcomes: savedPath.outcomes,
      phases: savedPath.phases,
      certifications: savedPath.certifications,
      jobMarket: savedPath.job_market
    });
    
    if (savedPath.conversation_messages && savedPath.conversation_messages.length > 0) {
      setMessages(savedPath.conversation_messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
    
    setConversationEnded(true);
    setShowAllPaths(false);
    setShowPathsSection(false);

    toast({
      title: "Path Loaded! ✅",
      description: `Loaded: ${savedPath.target_role}`,
      variant: "default"
    });
  };

  // Start a new conversation
  const handleNewConversation = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm PathFinder AI, your personal career advisor. I'm here to help you navigate your career journey, develop new skills, and achieve your professional goals. What would you like to discuss today?",
        timestamp: new Date()
      }
    ]);
    setConversationEnded(false);
    setCareerSummary(null);
    setDetailedPath(null);
    setHasSpokenGreeting(false);
    setIsGeneratingSummary(false);
    setIsGeneratingPath(false);
    setShowPathsSection(false);
    
    setTimeout(() => {
      if (!isMuted && synthRef.current) {
        speakText("Hello! I'm PathFinder AI. What would you like to discuss today?");
      }
    }, 500);
  };

  // Quick action buttons
  const quickActions = [
    "How do I improve my resume?",
    "What skills are in demand?",
    "Career change guidance",
    "Interview preparation tips",
    "Salary negotiation advice"
  ];

  return (
    <DashboardLayout
      title="AI Career Advisor"
      description="Voice-enabled personal career counselor powered by AI"
    >
      {isLoadingPreviousPath ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
              <p className="text-slate-300 text-lg">Loading your learning path...</p>
            </div>
          </Card>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Previous path indicator */}
            {hasPreviousPath && !conversationEnded && (
              <Card className="border-emerald-800 bg-emerald-900/20 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <History className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-sm font-medium text-emerald-300">Previous Learning Paths Available</p>
                        <p className="text-xs text-slate-400">You have saved learning paths from previous sessions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Saved
                      </Badge>
                      <Button
                        onClick={loadAllPaths}
                        size="sm"
                        variant="outline"
                        className="border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/20"
                      >
                        <History className="w-4 h-4 mr-2" />
                        View All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Show all saved paths modal */}
            {showAllPaths && allPaths.length > 0 && (
              <Card className="border-purple-800 bg-purple-900/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <History className="w-5 h-5 text-purple-400" />
                        Your Saved Learning Paths
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {allPaths.length} saved career path{allPaths.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setShowAllPaths(false)}
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                    >
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allPaths.map((path) => (
                      <Card
                        key={path.id}
                        className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer"
                        onClick={() => loadSavedPath(path)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-lg font-bold text-white mb-1">{path.target_role}</h4>
                              <p className="text-sm text-slate-400 line-clamp-2">{path.career_overview}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {path.total_duration}
                              </Badge>
                              <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                                {path.difficulty}
                              </Badge>
                              <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                                {path.phases.length} Phases
                              </Badge>
                            </div>
                            <div className="text-xs text-slate-500">
                              Created: {new Date(path.created_at).toLocaleDateString()}
                            </div>
                            <Button
                              size="sm"
                              className="w-full bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30"
                            >
                              Load This Path
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Chat Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* AI Avatar & Controls */}
              <Card className="lg:col-span-1 border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* AI Robot Avatar */}
                    <div className="relative">
                      <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 flex items-center justify-center overflow-hidden border-2 border-purple-500/30">
                        <div className="relative">
                          {/* Robot Head */}
                          <div className="w-32 h-32 bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl relative shadow-2xl">
                            {/* Antenna */}
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-purple-400">
                              <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full ${
                                isProcessing ? 'bg-yellow-400 animate-pulse' : 
                                isSpeaking ? 'bg-green-400 animate-pulse' : 
                                isListening ? 'bg-blue-400 animate-pulse' : 
                                'bg-purple-400'
                              }`}></div>
                            </div>
                            
                            {/* Eyes */}
                            <div className="absolute top-8 left-6 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
                              <div className={`w-3 h-3 bg-slate-900 rounded-full ${isSpeaking ? 'animate-blink' : ''}`}></div>
                            </div>
                            <div className="absolute top-8 right-6 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
                              <div className={`w-3 h-3 bg-slate-900 rounded-full ${isSpeaking ? 'animate-blink' : ''}`}></div>
                            </div>
                            
                            {/* Mouth/Speaker */}
                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-8 border-2 border-purple-400 rounded-full flex items-center justify-center gap-1">
                              {isSpeaking && (
                                <>
                                  <div className="w-1 h-2 bg-purple-400 animate-pulse"></div>
                                  <div className="w-1 h-4 bg-purple-400 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-1 h-3 bg-purple-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                  <div className="w-1 h-5 bg-purple-400 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                                  <div className="w-1 h-2 bg-purple-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                        <Badge className={`${
                          isProcessing ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' :
                          isSpeaking ? 'bg-green-500/20 text-green-300 border-green-500/50' :
                          isListening ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' :
                          'bg-purple-500/20 text-purple-300 border-purple-500/50'
                        } backdrop-blur-sm px-4 py-1`}>
                          {isProcessing ? 'Thinking...' :
                           isSpeaking ? 'Speaking' :
                           isListening ? 'Listening' :
                           'Ready'}
                        </Badge>
                      </div>
                    </div>

                    {/* Voice Controls */}
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button
                          onClick={toggleListening}
                          disabled={conversationEnded || isProcessing}
                          className={`flex-1 ${
                            isListening 
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700' 
                              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                          } text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                        >
                          {isListening ? (
                            <>
                              <MicOff className="w-4 h-4 mr-2 animate-pulse" />
                              Stop Listening
                            </>
                          ) : (
                            <>
                              <Mic className="w-4 h-4 mr-2" />
                              Voice Input
                            </>
                          )}
                        </Button>

                        <Button
                          onClick={toggleMute}
                          variant="outline"
                          className={`${
                            isMuted 
                              ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' 
                              : 'border-slate-600 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {isMuted ? (
                            <VolumeX className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      {conversationEnded && (
                        <Button
                          onClick={handleNewConversation}
                          className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white shadow-lg"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Start New Conversation
                        </Button>
                      )}
                    </div>

                    {/* Status Info */}
                    <div className="space-y-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Voice Recognition</span>
                        <Badge variant="outline" className={isListening ? 'border-blue-500 text-blue-400' : 'border-slate-600 text-slate-400'}>
                          {isListening ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Speech Output</span>
                        <Badge variant="outline" className={isMuted ? 'border-red-500 text-red-400' : 'border-green-500 text-green-400'}>
                          {isMuted ? 'Muted' : 'Enabled'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">AI Status</span>
                        <Badge variant="outline" className={isProcessing ? 'border-yellow-500 text-yellow-400' : 'border-emerald-500 text-emerald-400'}>
                          {isProcessing ? 'Processing' : 'Ready'}
                        </Badge>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        Features
                      </h3>
                      <div className="space-y-1 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <Brain className="w-3 h-3 text-purple-400" />
                          <span>AI-Powered Career Guidance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          <span>Personalized Learning Paths</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-3 h-3 text-green-400" />
                          <span>Goal-Oriented Planning</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Rocket className="w-3 h-3 text-blue-400" />
                          <span>Career Advancement Tips</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chat Area */}
              <Card className="lg:col-span-2 border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-2xl">
                <CardHeader className="border-b border-slate-800 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-purple-400" />
                        Career Conversation
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {conversationEnded 
                          ? 'Conversation completed - Learning path generated!' 
                          : 'Discuss your career goals and aspirations'}
                      </CardDescription>
                    </div>
                    {conversationEnded && (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {/* Messages Area */}
                  <ScrollArea className="h-[500px] p-6">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {message.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                              <Bot className="w-5 h-5 text-white" />
                            </div>
                          )}

                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              message.role === 'user'
                                ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
                                : 'bg-slate-800 text-slate-100 border border-slate-700'
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                            <span className="text-xs opacity-70 mt-2 block">
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>

                          {message.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Processing Indicator */}
                      {isProcessing && (
                        <div className="flex gap-3 justify-start">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                          <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3">
                            <div className="flex gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Generating Summary Indicator */}
                      {isGeneratingSummary && (
                        <div className="flex gap-3 justify-start">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          </div>
                          <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3">
                            <p className="text-sm text-slate-300">
                              Analyzing conversation and extracting career goals...
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Generating Path Indicator */}
                      {isGeneratingPath && (
                        <div className="flex gap-3 justify-start">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          </div>
                          <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3">
                            <p className="text-sm text-slate-300">
                              Creating your personalized learning roadmap...
                            </p>
                            <Progress value={66} className="mt-2 h-1" />
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  {!conversationEnded && (
                    <div className="border-t border-slate-800 p-4 bg-slate-900/50">
                      {/* Quick Actions */}
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2">
                          {quickActions.map((action, index) => (
                            <Button
                              key={index}
                              onClick={() => handleSendMessage(action)}
                              disabled={isProcessing || isListening}
                              size="sm"
                              variant="outline"
                              className="text-xs border-slate-700 text-slate-300 hover:bg-purple-500/10 hover:text-purple-300 hover:border-purple-500/50 transition-all"
                            >
                              {action}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Text Input */}
                      <div className="flex gap-2">
                        <Textarea
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          placeholder="Type your message or use voice input..."
                          disabled={isProcessing || isListening}
                          className="flex-1 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/50 resize-none"
                          rows={2}
                        />
                        <Button
                          onClick={() => handleSendMessage()}
                          disabled={!inputMessage.trim() || isProcessing || isListening}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-auto"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-xs text-slate-500 mt-2">
                        Press <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400">Enter</kbd> to send, 
                        <kbd className="ml-1 px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400">Shift + Enter</kbd> for new line
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* All Learning Paths Dropdown Section */}
            {hasPreviousPath && (
              <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-2xl">
                <CardHeader 
                  className="cursor-pointer hover:bg-slate-800/30 transition-colors"
                  onClick={() => {
                    if (!showPathsSection && allPaths.length === 0) {
                      loadAllPaths();
                    } else {
                      setShowPathsSection(!showPathsSection);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${showPathsSection ? 'bg-purple-500/20' : 'bg-slate-800'} transition-colors`}>
                        <History className={`w-5 h-5 ${showPathsSection ? 'text-purple-400' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">My Learning Paths</CardTitle>
                        <CardDescription className="text-slate-400">
                          {allPaths.length > 0 
                            ? `${allPaths.length} saved career path${allPaths.length !== 1 ? 's' : ''}`
                            : 'View all your saved learning paths'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {allPaths.length > 0 && (
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {allPaths.length} Saved
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-white"
                      >
                        {showPathsSection ? (
                          <>
                            Hide
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </>
                        ) : (
                          <>
                            View All
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Collapsible Content */}
                {showPathsSection && (
                  <CardContent className="pt-0 animate-slideDown">
                    {allPaths.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
                        <p className="text-slate-400">Loading your learning paths...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4 border-b border-slate-800">
                          <Card className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-purple-400">{allPaths.length}</div>
                              <div className="text-xs text-slate-400 mt-1">Total Paths</div>
                            </CardContent>
                          </Card>
                          <Card className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-blue-400">
                                {allPaths.reduce((sum, path) => sum + path.phases.length, 0)}
                              </div>
                              <div className="text-xs text-slate-400 mt-1">Total Phases</div>
                            </CardContent>
                          </Card>
                          <Card className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-emerald-400">
                                {new Set(allPaths.map(p => p.target_role)).size}
                              </div>
                              <div className="text-xs text-slate-400 mt-1">Career Goals</div>
                            </CardContent>
                          </Card>
                          <Card className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-amber-400">
                                {allPaths.filter(p => {
                                  const weekAgo = new Date();
                                  weekAgo.setDate(weekAgo.getDate() - 7);
                                  return new Date(p.created_at) > weekAgo;
                                }).length}
                              </div>
                              <div className="text-xs text-slate-400 mt-1">This Week</div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Learning Paths Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {allPaths.map((path) => (
                            <Card
                              key={path.id}
                              className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer group"
                              onClick={() => loadSavedPath(path)}
                            >
                              <CardContent className="p-5">
                                <div className="space-y-4">
                                  <div>
                                    <div className="flex items-start justify-between mb-2">
                                      <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                                        {path.target_role}
                                      </h4>
                                      <Rocket className="w-5 h-5 text-purple-400 flex-shrink-0 ml-2" />
                                    </div>
                                    <p className="text-sm text-slate-400 line-clamp-3">{path.career_overview}</p>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                      <Clock className="w-3 h-3" />
                                      <span>{path.total_duration}</span>
                                      <span className="text-slate-600">•</span>
                                      <span>{path.difficulty}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5">
                                      {path.key_interests.slice(0, 3).map((interest, idx) => (
                                        <Badge key={idx} variant="outline" className="border-slate-600 text-slate-400 text-xs">
                                          {interest}
                                        </Badge>
                                      ))}
                                      {path.key_interests.length > 3 && (
                                        <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                                          +{path.key_interests.length - 3}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>

                                  <div className="pt-3 border-t border-slate-700">
                                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                                      <span>{path.phases.length} Phases</span>
                                      <span>{new Date(path.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <Button
                                      size="sm"
                                      className="w-full bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 group-hover:bg-purple-500/40 transition-all"
                                    >
                                      <Target className="w-3 h-3 mr-2" />
                                      Load Path
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )}

            {/* Learning Path Section */}
            {conversationEnded && detailedPath && (
              <div className="animate-fadeIn">
                <LearningPath 
                  path={detailedPath} 
                  onStartNew={handleNewConversation}
                />
              </div>
            )}

            {/* Bottom Info Bar */}
            <Card className="border-slate-800 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span>Powered by Gemini 2.0 Flash</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span>Real-time AI Analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Personalized Roadmaps</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                    v2.0
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 2000px;
          }
        }

        @keyframes blink {
          0%, 100% {
            height: 100%;
          }
          50% {
            height: 10%;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }

        .animate-blink {
          animation: blink 0.3s ease-in-out infinite;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default CareerAdvisor;