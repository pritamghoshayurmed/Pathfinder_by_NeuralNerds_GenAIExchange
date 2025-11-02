import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, CheckCircle2, Bot, User, Sparkles, MessageCircle, AlertCircle, Video, VideoOff, Loader2, PhoneOff } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import LiveKitWidget from "@/components/ai_avatar/LiveKitWidget";
import { TranscriptionDisplay } from "@/components/interview/TranscriptionDisplay";
import { markRoundComplete, isRoundAccessible } from "@/services/interviewProgressService";
import { AgentType } from "@/services/agentTokenService";

const Behavioral = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAvatar, setShowAvatar] = useState(false);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      toast.success("Interview completed! Great job!");
      markRoundComplete(4);
      setTimeout(() => {
        navigate("/interview/summary");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to complete interview");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user can access this round
  useEffect(() => {
    if (!isRoundAccessible(4)) {
      toast.error("Please complete Round 3 first!");
      navigate("/interview/round/3");
    }
  }, [navigate]);

  // sendMessage removed (input disabled for behavioral round)

  // quickResponses removed

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
            disabled={isSubmitting}
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
              <CardContent className="space-y-4">
                {/* Avatar Area with Animation or Static Display */}
                <div className="aspect-square bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-green-500/20 rounded-lg flex items-center justify-center relative overflow-hidden border border-green-500/30">
                  {showAvatar ? (
                    // Show LiveKit widget directly in the card
                    <div className="w-full h-full">
                      <LiveKitWidget 
                        agentType={AgentType.BEHAVIORAL}
                        setShowSupport={setShowAvatar}
                        onDisconnected={() => setShowAvatar(false)}
                      />
                    </div>
                  ) : (
                    // Show static avatar
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-2 shadow-lg">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-semibold">HR Specialist</p>
                      <p className="text-xs text-muted-foreground">AI Agent</p>
                    </div>
                  )}
                </div>

                {/* Start/End Interview Button */}
                <Button
                  onClick={() => setShowAvatar(!showAvatar)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
                  size="sm"
                >
                  {showAvatar ? (
                    <>
                      <VideoOff className="w-4 h-4 mr-2" />
                      End Interview
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 mr-2" />
                      Start Video Interview
                    </>
                  )}
                </Button>

                {/* Interview Control Panel - Only visible when active */}
                {showAvatar && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <Button
                      onClick={() => {
                        setShowAvatar(false);
                        toast.info("Interview ended");
                      }}
                      variant="outline"
                      className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10"
                      size="sm"
                    >
                      <PhoneOff className="w-4 h-4 mr-2" />
                      End Conversation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Question Progress and STAR Method Guide removed per request */}
          </div>

          {/* Right Panel - Chat Interface */}
          <Card className="lg:col-span-3 bg-card/50 backdrop-blur-sm border-border shadow-xl flex flex-col">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Interview Conversation
                {/* <Badge variant="outline" className="ml-2">Question {currentQuestion + 1} of {questions.length}</Badge> */}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
              {/* Live Transcriptions */}
              <TranscriptionDisplay />

              {/* Quick responses removed */}

              {/* Chat input removed per request */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Behavioral;
