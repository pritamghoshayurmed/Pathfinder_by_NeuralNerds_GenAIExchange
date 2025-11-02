import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, CheckCircle2, Bot, User, Send, Sparkles, MessageCircle, AlertCircle, Video, VideoOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import LiveKitWidget from "@/components/ai_avatar/LiveKitWidget";
import dynamicInterviewService from "@/services/dynamicInterviewService";
import { supabase } from "@/lib/supabase";

const Behavioral = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contextData, setContextData] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    "Tell me about a time when you had to work with a difficult team member.",
    "Describe a situation where you had to meet a tight deadline.",
    "How do you handle disagreements with your team?",
    "Tell me about a project you're most proud of.",
    "Describe a time when you failed and what you learned from it.",
    "Tell me about a time when you had to learn something new quickly.",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("Time's up!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loadBehavioralData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          toast.error("Please log in first");
          navigate("/auth");
          return;
        }
        setUserId(session.user.id);

        if (!sessionId) {
          toast.error("No interview session found");
          navigate("/interview/setup");
          return;
        }

        // Fetch all context from previous rounds
        const allContext = await dynamicInterviewService.getInterviewContext(sessionId, 4);
        setContextData(allContext);

        // Initialize with behavioral greeting
        setMessages([{
          role: "ai",
          content: `Welcome to the behavioral interview round! I've reviewed your technical performance so far - great work! Now let's discuss your past experiences and how you handle different situations. Remember to use the STAR method (Situation, Task, Action, Result) when answering. Let's start with: ${questions[0]}`,
          timestamp: new Date(),
        }]);

        setLoading(false);
      } catch (error) {
        console.error("Error loading behavioral data:", error);
        toast.error("Failed to load behavioral interview data");
        setLoading(false);
      }
    };
    loadBehavioralData();
  }, [sessionId, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      
      // Store behavioral context
      await dynamicInterviewService.storeInterviewContext(
        sessionId!,
        4,
        "behavioral",
        `Behavioral Discussion: ${messages.map(m => `${m.role}: ${m.content}`).join("\n")}`
      );

      toast.success("Behavioral round completed!");
      setTimeout(() => {
        navigate(`/interview/summary?sessionId=${sessionId}`);
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to complete interview");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: currentMessage,
        timestamp: new Date(),
      },
    ]);

    setCurrentMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const followUps = [
        "That's a great example! Can you tell me more about how you resolved that situation and what specific actions you took?",
        "Interesting approach. What was the outcome, and how did you measure success?",
        "How did that experience change the way you work in teams? What did you learn from it?",
        "What would you do differently if you faced a similar situation again? Have you applied these learnings?",
        "Excellent! Can you elaborate on the challenges you faced and how you overcame them?",
      ];
      
      let response;
      const progress = messages.filter(m => m.role === "user").length;
      
      if (progress >= 2 && currentQuestion < questions.length - 1) {
        // Move to next question after 2 user responses
        setCurrentQuestion((prev) => prev + 1);
        response = "Thank you for sharing that. Let's move on to the next question: " + questions[currentQuestion + 1];
      } else {
        response = followUps[Math.floor(Math.random() * followUps.length)];
      }
      
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: response,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const quickResponses = [
    "I used the STAR method to approach this...",
    "The situation was challenging because...",
    "I took responsibility and...",
    "The key learning was...",
  ];

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Round 4: Behavioral Interview</h1>
                <p className="text-sm text-muted-foreground">Past Experiences & Soft Skills</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-mono text-lg font-semibold">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <Button
            onClick={handleComplete}
            disabled={isSubmitting || loading}
            className="bg-gradient-to-r from-primary via-accent to-primary hover:opacity-90 transition-opacity shadow-lg"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Completing...</>
            ) : (
              <>Complete Interview</>
            )}
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-140px)]">
          {/* Left Panel - Info & Progress */}
          <div className="space-y-4">
            {/* AI Interviewer Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-border shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  Behavioral AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-green-500/20 rounded-lg flex items-center justify-center relative overflow-hidden border border-green-500/30">
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-2 shadow-lg">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm font-semibold">HR Specialist</p>
                    <p className="text-xs text-muted-foreground">AI Agent</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowAvatar(!showAvatar)}
                  className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500"
                  size="sm"
                >
                  {showAvatar ? (
                    <>
                      <VideoOff className="w-4 h-4 mr-2" />
                      End Video Call
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 mr-2" />
                      Start Video Interview
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Progress Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-border shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Question Progress</CardTitle>
                  <Badge variant="secondary">{currentQuestion + 1}/{questions.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={progress} className="h-2" />
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {questions.map((question, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 p-2.5 rounded-lg transition-all ${
                        idx === currentQuestion
                          ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
                          : idx < currentQuestion
                          ? "bg-muted/50 text-muted-foreground"
                          : "bg-muted/30 text-muted-foreground"
                      }`}
                    >
                      <div className="mt-0.5">
                        {idx < currentQuestion ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                            idx === currentQuestion ? "border-green-400 text-green-400" : "border-muted-foreground"
                          }`}>
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <p className="text-xs flex-1 leading-relaxed">{question}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* STAR Method Guide */}
            <Card className="bg-card/50 backdrop-blur-sm border-border shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  STAR Method Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="p-2 bg-primary/10 rounded border border-primary/30">
                  <p className="font-semibold text-primary">S - Situation</p>
                  <p className="text-muted-foreground">Set the context</p>
                </div>
                <div className="p-2 bg-accent/10 rounded border border-accent/30">
                  <p className="font-semibold text-accent">T - Task</p>
                  <p className="text-muted-foreground">Describe your role</p>
                </div>
                <div className="p-2 bg-green-500/10 rounded border border-green-500/30">
                  <p className="font-semibold text-green-400">A - Action</p>
                  <p className="text-muted-foreground">What did you do?</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded border border-blue-500/30">
                  <p className="font-semibold text-blue-400">R - Result</p>
                  <p className="text-muted-foreground">What was the outcome?</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Chat Interface */}
          <Card className="lg:col-span-3 bg-card/50 backdrop-blur-sm border-border shadow-xl flex flex-col">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Interview Conversation
                <Badge variant="outline" className="ml-2">Question {currentQuestion + 1} of {questions.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        message.role === "user" 
                          ? "bg-gradient-to-r from-accent to-primary" 
                          : "bg-gradient-to-r from-green-500 to-emerald-500"
                      }`}>
                        {message.role === "user" ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Users className="w-5 h-5 text-white" />
                        )}
                      </div>
                      
                      {/* Message bubble */}
                      <div
                        className={`rounded-2xl p-4 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-accent to-primary text-white"
                            : "bg-muted/50 border border-border"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.role === "user" ? "opacity-80" : "text-muted-foreground"
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-muted/50 border border-border rounded-2xl p-4">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Responses */}
              <div className="px-6 py-3 border-t border-border bg-muted/30">
                <p className="text-xs text-muted-foreground mb-2">Quick response starters:</p>
                <div className="flex flex-wrap gap-2">
                  {quickResponses.map((response, idx) => (
                    <Button
                      key={idx}
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentMessage(response)}
                      className="text-xs border-border hover:border-primary hover:bg-primary/10"
                    >
                      {response}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-6 border-t border-border bg-muted/50">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Share your experience using the STAR method..."
                    className="flex-1 px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!currentMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 px-6"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" />
                  Tip: Use the STAR method to structure your answers effectively
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Avatar Modal */}
      {showAvatar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">AI HR Specialist</h3>
                  <p className="text-xs text-muted-foreground">Behavioral Interview Session</p>
                </div>
              </div>
              <Button
                onClick={() => setShowAvatar(false)}
                variant="outline"
                size="sm"
              >
                <VideoOff className="w-4 h-4 mr-2" />
                End Call
              </Button>
            </div>
            <div className="p-6">
              <LiveKitWidget 
                setShowAvatar={setShowAvatar}
                onDisconnected={() => setShowAvatar(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Behavioral;
