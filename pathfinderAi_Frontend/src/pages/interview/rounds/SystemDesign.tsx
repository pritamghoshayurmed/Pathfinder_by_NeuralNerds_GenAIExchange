import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Layers, Sparkles, AlertCircle, Loader } from "lucide-react";
import { toast } from "sonner";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { SystemDesignIconLibrary } from "@/components/SystemDesignIconLibrary";
import { Badge } from "@/components/ui/badge";
import { markRoundComplete, isRoundAccessible } from "@/services/interviewProgressService";
import geminiSystemDesignService, { SystemDesignQuestion } from "@/services/geminiSystemDesignService";

const SystemDesign = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [question, setQuestion] = useState<SystemDesignQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Load system design question from Gemini
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setLoading(true);
        setError(null);
        const generatedQuestion = await geminiSystemDesignService.generateSystemDesignQuestionWithCache();
        setQuestion(generatedQuestion);
        toast.success("System design question loaded!");
      } catch (err) {
        console.error('Failed to load question:', err);
        setError('Failed to load system design question. Please try again.');
        toast.error("Failed to load question");
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    toast.success("System design submitted successfully!");
    markRoundComplete(3);
    setTimeout(() => {
      navigate("/interview/round/4");
    }, 1500);
  };

  // Check if user can access this round
  useEffect(() => {
    if (!isRoundAccessible(3)) {
      toast.error("Please complete Round 2 first!");
      navigate("/interview/round/2");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-[1800px] mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Round 3: System Design</h1>
                <p className="text-sm text-muted-foreground">Design Scalable Architecture</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-mono text-lg font-semibold">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-primary via-accent to-primary hover:opacity-90 transition-opacity shadow-lg"
          >
            Submit & Continue
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-140px)]">
          {/* Left Sidebar - Problem Description */}
          <Card className="lg:col-span-1 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-md border-border shadow-xl flex flex-col overflow-hidden">
            <CardHeader className="pb-3 flex-shrink-0 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
              <CardTitle className="text-sm flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 text-primary" />
                Problem
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-3 p-3">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 py-6">
                    <Loader className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">Generating your system design question...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                    <p className="text-sm text-red-400">{error}</p>
                    <Button 
                      onClick={() => {
                        setLoading(true);
                        geminiSystemDesignService.generateSystemDesignQuestionWithCache()
                          .then(q => setQuestion(q))
                          .catch(err => setError('Failed to reload'));
                      }}
                      className="mt-2"
                      size="sm"
                    >
                      Retry
                    </Button>
                  </div>
                ) : question ? (
                  <>
                    <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-3 rounded-lg border-2 border-primary/40">
                      <h3 className="font-bold mb-2 text-base text-primary">{question.title}</h3>
                      <p className="text-foreground/90 text-xs leading-relaxed">
                        {question.description}
                      </p>
                    </div>

                    <div className="p-3 bg-gradient-to-br from-primary/15 to-primary/5 rounded-lg border border-primary/40">
                      <h4 className="font-bold mb-2 text-primary flex items-center gap-1.5 text-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                        Functional Requirements
                      </h4>
                      <ul className="space-y-1.5 ml-1">
                        {question.functionalRequirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs">
                            <span className="text-primary font-bold">✓</span>
                            <span className="text-foreground/90">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-gradient-to-br from-accent/15 to-accent/5 rounded-lg border border-accent/40">
                      <h4 className="font-bold mb-2 text-accent text-xs">Non-Functional Requirements</h4>
                      <ul className="space-y-1.5 ml-1">
                        {question.nonFunctionalRequirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs">
                            <span className="text-accent font-bold">⚡</span>
                            <span className="text-foreground/90">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {question.constraints && question.constraints.length > 0 && (
                      <div className="p-3 bg-gradient-to-br from-yellow-500/15 to-yellow-500/5 rounded-lg border border-yellow-500/40">
                        <h4 className="font-bold mb-2 text-yellow-600 dark:text-yellow-400 text-xs">Constraints</h4>
                        <ul className="space-y-1.5 ml-1">
                          {question.constraints.map((constraint, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs">
                              <span className="text-yellow-600 dark:text-yellow-400 font-bold">•</span>
                              <span className="text-foreground/90">{constraint}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="p-3 bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 rounded-lg border border-primary/50">
                      <p className="text-xs font-bold mb-1.5 flex items-center gap-1.5 text-primary">
                        <Sparkles className="w-3 h-3" />
                        Pro Tip
                      </p>
                      <p className="text-xs text-foreground/90 leading-relaxed">
                        Start with <strong>high-level architecture</strong>, identify <strong>bottlenecks</strong>, discuss <strong>trade-offs</strong> using the CAP theorem.
                      </p>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>

          {/* Canvas - Center (Takes most space) */}
          <Card className="lg:col-span-3 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-md border-border shadow-xl overflow-hidden flex flex-col">
            <CardHeader className="pb-2 border-b border-border bg-gradient-to-r from-accent/10 to-primary/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 font-bold">
                  <Layers className="w-5 h-5 text-accent" />
                  Design Canvas
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Drag & Drop
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Professional Mode
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-3 overflow-hidden">
              <DrawingCanvas />
            </CardContent>
          </Card>

          {/* Icon Library - Right Sidebar */}
          <div className="lg:col-span-1 space-y-4 flex flex-col min-h-0 max-h-full overflow-hidden">
            <SystemDesignIconLibrary 
              onIconSelect={(iconType, icon) => {
                toast.info(`Drag ${icon} to canvas`, {
                  description: "Click and drag the icon onto the canvas",
                  duration: 2000,
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDesign;
