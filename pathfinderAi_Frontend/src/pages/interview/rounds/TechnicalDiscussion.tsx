import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MessageSquare, Bot, User, Brain, Video, VideoOff, Loader2, PhoneOff } from "lucide-react";
import { toast } from "sonner";
// Badge removed (previous solution summary removed)
import LiveKitWidget from "@/components/ai_avatar/LiveKitWidget";
import { TranscriptionDisplay } from "@/components/interview/TranscriptionDisplay";
import { markRoundComplete, isRoundAccessible } from "@/services/interviewProgressService";
import { AgentType } from "@/services/agentTokenService";

const TechnicalDiscussion = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [showAvatar, setShowAvatar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      toast.success("Round completed successfully!");
      markRoundComplete(2);
      setTimeout(() => {
        navigate("/interview/round/3");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to complete round");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user can access this round
  useEffect(() => {
    if (!isRoundAccessible(2)) {
      toast.error("Please complete Round 1 first!");
      navigate("/interview/round/1");
    }
  }, [navigate]);

  // sendMessage removed (no chat input)

  // quickResponses removed per request

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Round 2: Technical Discussion</h1>
                <p className="text-sm text-muted-foreground">Code Review & Technical Q&A</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-mono text-lg font-semibold">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-primary via-accent to-primary hover:opacity-90 transition-opacity shadow-lg"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Completing...</>
            ) : (
              <>Complete Round</>
            )}
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-140px)]">
          {/* Left Panel - Context & Info */}
          <div className="space-y-4">
            {/* AI Interviewer Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-border shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  AI Interviewer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar Area with Animation or Static Display */}
                <div className="aspect-square bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-lg flex items-center justify-center relative overflow-hidden border border-primary/30">
                  {showAvatar ? (
                    // Show LiveKit widget directly in the card
                    <div className="w-full h-full">
                      <LiveKitWidget 
                        agentType={AgentType.TECHNICAL}
                        setShowSupport={setShowAvatar}
                        onDisconnected={() => setShowAvatar(false)}
                      />
                    </div>
                  ) : (
                    // Show static avatar
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mx-auto mb-2 shadow-lg">
                        <Bot className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-semibold">Technical Expert</p>
                      <p className="text-xs text-muted-foreground">AI Agent</p>
                    </div>
                  )}
                </div>

                {/* Start/End Interview Button */}
                <Button
                  onClick={() => setShowAvatar(!showAvatar)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
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
          </div>

          {/* Right Panel - Chat Interface */}
          <Card className="lg:col-span-3 bg-card/50 backdrop-blur-sm border-border shadow-xl flex flex-col">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Technical Discussion
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

export default TechnicalDiscussion;
