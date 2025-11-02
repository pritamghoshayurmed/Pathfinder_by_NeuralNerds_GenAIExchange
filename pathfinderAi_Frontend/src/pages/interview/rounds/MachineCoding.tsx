import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Play, Code2, FileText, Settings, Loader2, CheckCircle2, XCircle, Sparkles, TrendingUp, AlertCircle, Brain, ChevronLeft, ChevronRight, Zap, Target } from "lucide-react";
import { toast } from "sonner";
import Editor from "@monaco-editor/react";
import { analyzeAndExecuteCode, CodeExecutionResult } from "@/services/geminiCodeService";
import { generateCodingQuestions, CodingQuestion } from "@/services/geminiCodingQuestionService";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { markRoundComplete, isRoundAccessible } from "@/services/interviewProgressService";

const MachineCoding = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CodeExecutionResult | null>(null);
  const [questions, setQuestions] = useState<CodingQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHint, setSelectedHint] = useState<number>(-1);

  // Fetch dynamic questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        // You can customize these based on user profile
        const role = "Software Engineer";
        const company = "Tech Company";
        const level = "Mid";
        
        const generatedQuestions = await generateCodingQuestions(role, company, level as any);
        setQuestions(generatedQuestions);
        
        // Set initial code template
        if (generatedQuestions.length > 0) {
          const template = generatedQuestions[0].templates.find(t => t.language === language);
          if (template) {
            setCode(template.code);
          }
        }
        
        toast.success("Coding questions loaded successfully!");
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Failed to load questions. Using fallback questions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

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

  // Update code template when language or question changes
  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const template = currentQuestion.templates.find(t => t.language === language);
      if (template) {
        setCode(template.code);
        setOutput("");
        setAnalysisResult(null);
      }
    }
  }, [language, currentQuestionIndex, questions]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    toast.success("Code submitted successfully!");
    markRoundComplete(1);
    setTimeout(() => {
      navigate("/interview/round/2");
    }, 1500);
  };

  const handleRunCode = async () => {
    if (questions.length === 0) {
      toast.error("No questions loaded yet!");
      return;
    }

    setIsRunning(true);
    setOutput("🔄 Analyzing and executing your code with Gemini AI...\n\nThis may take a few seconds...");
    toast.info("Running code analysis...");

    try {
      const currentQuestion = questions[currentQuestionIndex];
      const problemDescription = `${currentQuestion.title}: ${currentQuestion.description}`;
      
      // Get test cases for validation
      const testCases = currentQuestion.testCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput
      }));

      // Get optimal complexity
      const optimalComplexity = {
        time: currentQuestion.timeComplexity.optimal,
        space: currentQuestion.spaceComplexity.optimal
      };
      
      const result = await analyzeAndExecuteCode(
        code, 
        language, 
        problemDescription,
        testCases,
        optimalComplexity
      );
      setAnalysisResult(result);
      
      if (result.success) {
        let outputText = `✓ Code Analysis Complete\n\n`;
        outputText += `📊 Overall Score: ${result.analysis?.overallScore}%\n\n`;
        outputText += `🔍 Execution Output:\n${result.output}\n\n`;
        
        if (result.analysis) {
          // Complexity Analysis
          if (result.analysis.timeComplexity || result.analysis.spaceComplexity) {
            outputText += `⏱️ Complexity Analysis:\n`;
            outputText += `• Your Time Complexity: ${result.analysis.timeComplexity}\n`;
            outputText += `• Your Space Complexity: ${result.analysis.spaceComplexity}\n`;
            if (result.analysis.optimalTimeComplexity) {
              outputText += `• Optimal Time Complexity: ${result.analysis.optimalTimeComplexity}\n`;
              outputText += `• Optimal Space Complexity: ${result.analysis.optimalSpaceComplexity}\n`;
            }
            if (result.analysis.complexityAnalysis) {
              outputText += `• Analysis: ${result.analysis.complexityAnalysis}\n`;
            }
            outputText += `\n`;
          }

          // Test Case Results
          if (result.testCaseResults) {
            outputText += `🧪 Test Cases: ${result.testCaseResults.passed}/${result.testCaseResults.total} Passed\n`;
            result.testCaseResults.details.forEach((tc, idx) => {
              outputText += `  ${tc.passed ? '✓' : '✗'} Test ${idx + 1}: `;
              outputText += `Input: ${tc.input} `;
              outputText += `Expected: ${tc.expectedOutput} `;
              outputText += `Got: ${tc.actualOutput}\n`;
            });
            outputText += `\n`;
          }

          outputText += `📈 Detailed Scores:\n`;
          outputText += `• Code Quality: ${result.analysis.codeQuality}%\n`;
          outputText += `• Correctness: ${result.analysis.correctness}%\n`;
          outputText += `• Efficiency: ${result.analysis.efficiency}%\n`;
          outputText += `• Best Practices: ${result.analysis.bestPractices}%\n\n`;
          
          if (result.analysis.strengths.length > 0) {
            outputText += `✅ Strengths:\n${result.analysis.strengths.map(s => `  • ${s}`).join('\n')}\n\n`;
          }
          
          if (result.analysis.bugs.length > 0) {
            outputText += `🐛 Bugs Found:\n${result.analysis.bugs.map(b => `  • ${b}`).join('\n')}\n\n`;
          }

          if (result.analysis.suggestions.length > 0) {
            outputText += `💡 Suggestions:\n${result.analysis.suggestions.map(s => `  • ${s}`).join('\n')}\n\n`;
          }
        }
        
        setOutput(outputText);
        toast.success("Code analysis completed!");
      } else {
        setOutput(`✗ Error\n\n${result.error || "Unknown error occurred"}\n\n${result.output || ""}`);
        toast.error("Code execution failed!");
      }
    } catch (error) {
      setOutput(`✗ Execution Error\n\n${error instanceof Error ? error.message : "Failed to analyze code"}`);
      toast.error("Failed to analyze code");
    } finally {
      setIsRunning(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setOutput("");
      setAnalysisResult(null);
      setSelectedHint(-1);
      toast.info(`Switched to Question ${currentQuestionIndex + 2}`);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setOutput("");
      setAnalysisResult(null);
      setSelectedHint(-1);
      toast.info(`Switched to Question ${currentQuestionIndex}`);
    }
  };

  const getLanguageForMonaco = (lang: string) => {
    const map: Record<string, string> = {
      javascript: "javascript",
      python: "python",
      typescript: "typescript",
      java: "java",
      cpp: "cpp",
    };
    return map[lang] || "javascript";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-lg font-semibold">Loading Coding Questions...</p>
          <p className="text-sm text-muted-foreground">Powered by Gemini AI</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <CardContent className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-red-400" />
            <p className="text-lg font-semibold">Failed to load questions</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-[1800px] mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Round 1: Machine Coding</h1>
                <p className="text-sm text-muted-foreground">Powered by Gemini AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-mono text-lg font-semibold">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
                <Target className="w-5 h-5 text-accent" />
                <span className="font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</span>
              </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-140px)]">
          {/* Left Panel - Question */}
          <Card className="bg-card/50 backdrop-blur-sm border-border shadow-xl overflow-hidden">
            <Tabs defaultValue="problem" className="h-full flex flex-col">
              <CardHeader className="pb-0">
                <TabsList className="grid w-full grid-cols-2 bg-muted">
                  <TabsTrigger value="problem">
                    <FileText className="w-4 h-4 mr-2" />
                    Problem
                  </TabsTrigger>
                  <TabsTrigger value="approach">
                    <Brain className="w-4 h-4 mr-2" />
                    Approach
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <TabsContent value="problem" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{currentQuestion.title}</h3>
                    <div className="flex gap-2 mb-4">
                      <Badge className={
                        currentQuestion.difficulty === "Easy" 
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : currentQuestion.difficulty === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }>
                        {currentQuestion.difficulty}
                      </Badge>
                      {currentQuestion.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-sm">
                    <p className="text-muted-foreground">
                      {currentQuestion.description}
                    </p>
                    
                    {currentQuestion.examples.map((example, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold mb-2">Example {idx + 1}:</h4>
                        <div className="bg-muted p-3 rounded space-y-1 font-mono text-xs">
                          <p><span className="text-muted-foreground">Input:</span> {example.input}</p>
                          <p><span className="text-muted-foreground">Output:</span> {example.output}</p>
                          <p><span className="text-muted-foreground">Explanation:</span> {example.explanation}</p>
                        </div>
                      </div>
                    ))}

                    <div>
                      <h4 className="font-semibold mb-2">Constraints:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {currentQuestion.constraints.map((constraint, idx) => (
                          <li key={idx}>{constraint}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Hints Section */}
                    {currentQuestion.hints && currentQuestion.hints.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">💡 Hints:</h4>
                        <div className="space-y-2">
                          {currentQuestion.hints.map((hint, idx) => (
                            <div key={idx}>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedHint(selectedHint === idx ? -1 : idx)}
                                className="w-full justify-start text-left"
                              >
                                Hint {idx + 1}
                              </Button>
                              {selectedHint === idx && (
                                <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                                  {hint}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="approach" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Solution Approaches</h3>
                    <div className="space-y-4 text-sm">
                      {currentQuestion.approaches.map((approach, idx) => (
                        <div 
                          key={idx}
                          className={`p-3 rounded-lg border ${
                            approach.recommended 
                              ? 'bg-primary/10 border-primary/30' 
                              : 'bg-muted/50 border-border'
                          }`}
                        >
                          <h4 className="font-semibold mb-2 text-primary flex items-center gap-2">
                            <span className="text-lg">{idx + 1}️⃣</span> 
                            {approach.name} 
                            ({approach.timeComplexity})
                            {approach.recommended && ' ⭐'}
                          </h4>
                          <p className="text-muted-foreground mb-2">{approach.description}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Time: {approach.timeComplexity}</span>
                            <span>Space: {approach.spaceComplexity}</span>
                          </div>
                        </div>
                      ))}

                      {/* Complexity Info */}
                      <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-4 rounded-lg border border-accent/30">
                        <p className="text-xs font-semibold mb-2 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-accent" />
                          Target Complexity
                        </p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Time: {currentQuestion.timeComplexity.optimal}</p>
                          <p>Space: {currentQuestion.spaceComplexity.optimal}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          {/* Middle Panel - Code Editor */}
          <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-border shadow-xl overflow-hidden flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  Code Editor
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[150px] bg-muted border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    {isRunning ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Run & Analyze
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-hidden">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(language)}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                  }}
                />
              </div>
              <div className="h-48 p-4 bg-muted/50 border-t border-border overflow-y-auto">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-semibold flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    AI Analysis & Output
                  </span>
                  {isRunning ? (
                    <span className="text-yellow-400 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Analyzing...
                    </span>
                  ) : analysisResult ? (
                    <span className={analysisResult.success ? "text-green-400 flex items-center gap-1" : "text-red-400 flex items-center gap-1"}>
                      {analysisResult.success ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {analysisResult.success ? "Analysis Complete" : "Error"}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Ready</span>
                  )}
                </div>
                <pre className="text-xs font-mono whitespace-pre-wrap">{output || "Click 'Run & Analyze' to execute your code and get AI-powered feedback..."}</pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Panel - Analysis Results */}
        {analysisResult?.analysis && (
          <div className="space-y-4">
            {/* Complexity Analysis */}
            {(analysisResult.analysis.timeComplexity || analysisResult.analysis.spaceComplexity) && (
              <Card className="bg-card/50 backdrop-blur-sm border-border shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" />
                    Complexity Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Your Time Complexity:</span>
                        <span className="font-mono font-semibold">{analysisResult.analysis.timeComplexity}</span>
                      </div>
                      {analysisResult.analysis.optimalTimeComplexity && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Optimal Time:</span>
                          <span className="font-mono font-semibold text-green-400">{analysisResult.analysis.optimalTimeComplexity}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Your Space Complexity:</span>
                        <span className="font-mono font-semibold">{analysisResult.analysis.spaceComplexity}</span>
                      </div>
                      {analysisResult.analysis.optimalSpaceComplexity && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Optimal Space:</span>
                          <span className="font-mono font-semibold text-green-400">{analysisResult.analysis.optimalSpaceComplexity}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {analysisResult.analysis.complexityAnalysis && (
                    <p className="text-xs text-muted-foreground mt-3 p-2 bg-muted/50 rounded">
                      {analysisResult.analysis.complexityAnalysis}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Test Case Results */}
            {analysisResult.testCaseResults && (
              <Card className="bg-card/50 backdrop-blur-sm border-border shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Test Cases: {analysisResult.testCaseResults.passed}/{analysisResult.testCaseResults.total} Passed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysisResult.testCaseResults.details.map((tc, idx) => (
                      <div key={idx} className={`p-2 rounded text-xs ${tc.passed ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {tc.passed ? (
                            <CheckCircle2 className="w-3 h-3 text-green-400" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-400" />
                          )}
                          <span className="font-semibold">Test {idx + 1}</span>
                        </div>
                        <div className="ml-5 space-y-1 text-muted-foreground">
                          <p>Input: {tc.input}</p>
                          <p>Expected: {tc.expectedOutput}</p>
                          <p>Got: {tc.actualOutput}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card/50 backdrop-blur-sm border-border shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Overall Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-4xl font-bold ${getScoreColor(analysisResult.analysis.overallScore)}`}>
                    {analysisResult.analysis.overallScore}%
                  </div>
                  <Progress value={analysisResult.analysis.overallScore} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-1">
                  {analysisResult.analysis.strengths.map((strength, idx) => (
                    <p key={idx} className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-muted-foreground">{strength}</span>
                    </p>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    Improvements
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-1">
                  {analysisResult.analysis.improvements.map((improvement, idx) => (
                    <p key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-400">!</span>
                      <span className="text-muted-foreground">{improvement}</span>
                    </p>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4 text-accent" />
                    Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quality</span>
                    <span className={`font-semibold ${getScoreColor(analysisResult.analysis.codeQuality)}`}>
                      {analysisResult.analysis.codeQuality}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Correctness</span>
                    <span className={`font-semibold ${getScoreColor(analysisResult.analysis.correctness)}`}>
                      {analysisResult.analysis.correctness}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Efficiency</span>
                    <span className={`font-semibold ${getScoreColor(analysisResult.analysis.efficiency)}`}>
                      {analysisResult.analysis.efficiency}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Question Navigation */}
        {questions.length > 1 && (
          <div className="flex justify-center gap-4">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Question
            </Button>
            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              variant="outline"
              className="gap-2"
            >
              Next Question
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MachineCoding;
