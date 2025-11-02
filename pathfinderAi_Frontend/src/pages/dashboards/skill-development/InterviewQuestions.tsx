import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Plus,
  Volume2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Award,
  Clock,
  Download,
  Loader,
  AlertCircle,
  Pause,
  Play,
  X,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import geminiInterviewService, {
  InterviewQuestion,
  InterviewSession,
} from "@/services/geminiInterviewService";
import interviewPdfService from "@/services/interviewPdfService";
import textToSpeechService from "@/services/textToSpeechService";
import { useNavigate } from "react-router-dom";

const InterviewQuestions = () => {
  const navigate = useNavigate();
  // State for form
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);

  // State for loading and errors
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for interview session
  const [interviewSession, setInterviewSession] = useState<InterviewSession | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  // State for filters
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // State for text-to-speech
  const [speechStatus, setSpeechStatus] = useState({
    isPlaying: false,
    isPaused: false,
    currentText: "",
  });
  const [speakingQuestionId, setSpeakingQuestionId] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  // Subscribe to speech status changes
  useEffect(() => {
    if (!textToSpeechService.isSupported()) {
      console.warn("Text-to-Speech not supported in this browser");
      toast.error("Text-to-Speech is not supported in your browser. PDF download and text copy features are still available.");
    }

    const unsubscribe = textToSpeechService.onStatusChange(setSpeechStatus);
    return unsubscribe;
  }, []);

  const roles = [
    {
      name: "Software Engineer",
      icon: "💻",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Full Stack Developer",
      icon: "🔄",
      color: "from-purple-500 to-pink-500",
    },
    { name: "Product Manager", icon: "📊", color: "from-orange-500 to-red-500" },
    { name: "Data Scientist", icon: "📈", color: "from-green-500 to-teal-500" },
    { name: "DevOps Engineer", icon: "⚙️", color: "from-indigo-500 to-blue-500" },
    { name: "UX Designer", icon: "🎨", color: "from-pink-500 to-purple-500" },
  ];

  const categories = ["All", "Technical", "Behavioral", "System Design", "Situational", "Domain-Specific"];

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
      case "medium":
        return "bg-amber-500/20 border-amber-500/40 text-amber-300";
      case "hard":
        return "bg-red-500/20 border-red-500/40 text-red-300";
      default:
        return "bg-slate-500/20 border-slate-500/40 text-slate-300";
    }
  };

  const handleGenerateQuestions = async () => {
    setError(null);

    if (!selectedRole.trim()) {
      setError("Please select a role");
      toast.error("Please select a role");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please provide a job description");
      toast.error("Please provide a job description");
      return;
    }

    if (numberOfQuestions < 5 || numberOfQuestions > 20) {
      setError("Number of questions should be between 5 and 20");
      toast.error("Number of questions should be between 5 and 20");
      return;
    }

    setIsGenerating(true);
    try {
      toast.loading("Generating interview questions...");
      const session = await geminiInterviewService.generateInterviewQuestions(
        selectedRole,
        jobDescription,
        numberOfQuestions
      );
      setInterviewSession(session);
      setSelectedQuestion(null);
      setDifficulty("all");
      setSelectedCategory("All");
      toast.success("Interview questions generated successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate questions";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredQuestions = interviewSession
    ? interviewSession.questions.filter((q) => {
        const difficultyMatch = difficulty === "all" || q.difficulty === difficulty;
        const categoryMatch = selectedCategory === "All" || q.category === selectedCategory;
        return difficultyMatch && categoryMatch;
      })
    : [];

  const handleSpeakQuestion = (question: InterviewQuestion) => {
    if (!textToSpeechService.isSupported()) {
      toast.error("Text-to-Speech is not available in your browser");
      return;
    }

    try {
      if (speakingQuestionId === question.id && speechStatus.isPlaying) {
        if (speechStatus.isPaused) {
          textToSpeechService.resume();
        } else {
          textToSpeechService.pause();
        }
      } else {
        setSpeakingQuestionId(question.id);
        textToSpeechService.speakQuestion(question.question, { rate: 0.9 });
        toast.success("Playing question...");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to speak question";
      toast.error(errorMsg);
      console.error("TTS Error:", error);
    }
  };

  const handleSpeakAnswer = (question: InterviewQuestion) => {
    if (!textToSpeechService.isSupported()) {
      toast.error("Text-to-Speech is not available in your browser");
      return;
    }

    try {
      setSpeakingQuestionId(question.id);
      textToSpeechService.speakAnswer(question.sampleAnswer, { rate: 0.85 });
      toast.success("Playing answer...");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to speak answer";
      toast.error(errorMsg);
      console.error("TTS Error:", error);
    }
  };

  const handleStopSpeech = () => {
    textToSpeechService.stop();
    setSpeakingQuestionId(null);
  };

  const handleCopyQuestion = (question: InterviewQuestion) => {
    const text = `Q: ${question.question}\n\nA: ${question.sampleAnswer}`;
    navigator.clipboard.writeText(text);
    toast.success("Question and answer copied to clipboard!");
  };

  const handleDownloadPDF = () => {
    if (!interviewSession) {
      toast.error("No interview session to download");
      return;
    }

    try {
      interviewPdfService.generateInterviewPDF(interviewSession, {
        includeJobDescription: true,
        includeTips: true,
        includeFollowUpQuestions: true,
      });
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate PDF";
      toast.error(errorMessage);
    }
  };

  return (
    <DashboardLayout
      title="Interview Questions Generator"
      description="Prepare for interviews with AI-powered role-specific questions"
    >
      <div className="p-6 space-y-8 bg-slate-950">
        {/* Back to Placement Kit Button */}
        <Button
          onClick={() => navigate('/dashboard/skill-development/placement-kit')}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-orange-500/40 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Placement Kit
        </Button>
        {/* ============ Header Section ============ */}
        <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl border border-transparent">
          {/* Premium Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/5 via-blue-600/5 to-purple-600/5 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-3xl"></div>

          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-blue-500/0 to-purple-500/0 hover:from-cyan-500/5 hover:via-blue-500/5 hover:to-purple-500/5 transition-all duration-700 rounded-3xl"></div>

          {/* Premium Accent Elements */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-cyan-600/5 to-transparent rounded-full -translate-x-32 -translate-y-32 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-600/5 to-transparent rounded-full translate-x-32 translate-y-32 blur-3xl"></div>

          <div className="relative z-10 space-y-6">
            {/* Header Title Row */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-cyan-500/30 to-blue-500/20 rounded-xl backdrop-blur-sm border border-cyan-400/40 shadow-lg">
                    <MessageSquare className="w-8 h-8 text-cyan-300" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-100 bg-clip-text text-transparent">
                      Interview Questions Generator
                    </h1>
                    <p className="text-cyan-300 text-lg font-medium">
                      Master Your Interview Preparation with AI
                    </p>
                  </div>
                </div>

                {interviewSession && (
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <Badge className="bg-gradient-to-r from-cyan-500/40 to-cyan-600/30 border-cyan-400/60 text-cyan-100 backdrop-blur-sm shadow-md">
                      <MessageSquare className="w-3 h-3 mr-2" />
                      {interviewSession.questions.length} Questions
                    </Badge>
                    <Badge className="bg-gradient-to-r from-blue-500/40 to-blue-600/30 border-blue-400/60 text-blue-100 backdrop-blur-sm shadow-md">
                      <Award className="w-3 h-3 mr-2" />
                      {interviewSession.role}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-purple-500/40 to-purple-600/30 border-purple-400/60 text-purple-100 backdrop-blur-sm shadow-md">
                      <Clock className="w-3 h-3 mr-2" />
                      {interviewSession.estimatedPreparationTime} mins prep
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ============ Error Display ============ */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/40 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* ============ Input Form Section ============ */}
        {!interviewSession && (
          <div ref={formRef} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">1. Select Your Role</h2>
                <p className="text-slate-400 text-sm">Choose the position you're preparing for</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {roles.map((role) => (
                  <div
                    key={role.name}
                    onClick={() => setSelectedRole(role.name)}
                    className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 cursor-pointer ${
                      selectedRole === role.name
                        ? "border-cyan-500/60 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 scale-105"
                        : "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-cyan-500/40 hover:scale-105"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${role.color} opacity-0 ${
                        selectedRole === role.name ? "opacity-10" : "group-hover:opacity-10"
                      } transition-all`}
                    ></div>

                    <div className="relative z-10 space-y-2 text-center">
                      <div className="text-3xl">{role.icon}</div>
                      <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {role.name}
                      </p>
                      {selectedRole === role.name && (
                        <div className="pt-1">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mx-auto"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Description Input */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">2. Paste Job Description</h2>
                <p className="text-slate-400 text-sm">
                  Provide the job description for accurate, role-specific questions
                </p>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here. Include responsibilities, requirements, skills, qualifications, etc."
                className="w-full h-48 px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none"
              />
              <div className="text-xs text-slate-400">
                {jobDescription.length} characters entered
              </div>
            </div>

            {/* Number of Questions */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">3. Number of Questions</h2>
                <p className="text-slate-400 text-sm">Choose how many questions you want (5-20)</p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="w-16 px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-center text-white font-semibold">
                  {numberOfQuestions}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex gap-4">
              <Button
                onClick={handleGenerateQuestions}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-base"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Interview Questions
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ============ Generated Questions Section ============ */}
        {interviewSession && (
          <div className="space-y-6">
            {/* Back and Download Buttons */}
            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={() => {
                  setInterviewSession(null);
                  setSelectedQuestion(null);
                  textToSpeechService.stop();
                  setSpeakingQuestionId(null);
                }}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                <Plus className="w-4 h-4 mr-2 rotate-45" />
                Generate New
              </Button>
              <Button
                onClick={handleDownloadPDF}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 font-semibold shadow-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>

            {/* Filter Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Filter Questions</h3>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <p className="text-sm text-slate-400">Category:</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      className={
                        selectedCategory === cat
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0"
                          : "border-slate-600 text-slate-300 hover:bg-slate-700/50"
                      }
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="space-y-2">
                <p className="text-sm text-slate-400">Difficulty:</p>
                <div className="flex gap-2">
                  {["all", "easy", "medium", "hard"].map((diff) => (
                    <Button
                      key={diff}
                      size="sm"
                      onClick={() => setDifficulty(diff as any)}
                      variant={difficulty === diff ? "default" : "outline"}
                      className={
                        difficulty === diff
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0"
                          : "border-slate-600 text-slate-300 hover:bg-slate-700/50"
                      }
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                Showing {filteredQuestions.length} of {interviewSession.questions.length} questions
              </p>
              {filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-300 border border-slate-700/50 hover:border-cyan-500/40"
                >
                  {/* Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300"></div>

                  {/* Content */}
                  <div className="relative z-10 p-6 space-y-4">
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() =>
                          setSelectedQuestion(
                            selectedQuestion === question.id ? null : question.id
                          )
                        }
                      >
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                          Q{question.questionNumber}. {question.question}
                        </h3>
                      </div>
                      <Badge className={`${getDifficultyColor(question.difficulty)} whitespace-nowrap`}>
                        {question.difficulty.charAt(0).toUpperCase() +
                          question.difficulty.slice(1)}
                      </Badge>
                    </div>

                    {/* Category and Dropdown */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300">
                        {question.category}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          selectedQuestion === question.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {/* Answer - Expanded View */}
                    {selectedQuestion === question.id && (
                      <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* Sample Answer */}
                        <div className="space-y-2">
                          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                            Sample Answer
                          </p>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {question.sampleAnswer}
                          </p>
                        </div>

                        {/* Key Points */}
                        {question.keyPoints && question.keyPoints.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                              Key Points
                            </p>
                            <ul className="space-y-1">
                              {question.keyPoints.map((point, idx) => (
                                <li key={idx} className="text-sm text-slate-300 flex gap-2">
                                  <span className="text-cyan-400">•</span>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Tips */}
                        {question.tips && question.tips.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                              💡 Tips for Answering
                            </p>
                            <ul className="space-y-1">
                              {question.tips.map((tip, idx) => (
                                <li key={idx} className="text-sm text-slate-300 flex gap-2">
                                  <span className="text-amber-400">◆</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Follow-up Questions */}
                        {question.followUpQuestions && question.followUpQuestions.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                              Possible Follow-up Questions
                            </p>
                            <ul className="space-y-1">
                              {question.followUpQuestions.map((followUp, idx) => (
                                <li key={idx} className="text-sm text-slate-300 flex gap-2">
                                  <span className="text-blue-400">{idx + 1}.</span>
                                  {followUp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700/50">
                          <Button
                            size="sm"
                            onClick={() => handleSpeakQuestion(question)}
                            className={
                              speakingQuestionId === question.id && speechStatus.isPlaying
                                ? "bg-cyan-500/30 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/40"
                                : "border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20"
                            }
                            variant="outline"
                          >
                            {speakingQuestionId === question.id && speechStatus.isPlaying ? (
                              <>
                                {speechStatus.isPaused ? (
                                  <Play className="w-3 h-3 mr-1" />
                                ) : (
                                  <Pause className="w-3 h-3 mr-1" />
                                )}
                                {speechStatus.isPaused ? "Resume" : "Pause"}
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3 mr-1" />
                                Speak Question
                              </>
                            )}
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleSpeakAnswer(question)}
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700/50 text-xs"
                          >
                            <Volume2 className="w-3 h-3 mr-1" />
                            Speak Answer
                          </Button>

                          {(speakingQuestionId === question.id && speechStatus.isPlaying) && (
                            <Button
                              size="sm"
                              onClick={handleStopSpeech}
                              variant="outline"
                              className="border-red-500/40 text-red-300 hover:bg-red-500/20 text-xs"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Stop
                            </Button>
                          )}

                          <Button
                            size="sm"
                            onClick={() => handleCopyQuestion(question)}
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700/50 text-xs"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 text-xs"
                          >
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Helpful
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No questions match your filters. Try adjusting them.</p>
              </div>
            )}
          </div>
        )}

        {/* ============ Interview Tips Section ============ */}
        {!interviewSession && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Interview Preparation Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Provide a Complete Job Description",
                  description:
                    "Paste the full job posting to ensure questions are tailored to the exact role requirements",
                  icon: "📋",
                },
                {
                  title: "Practice with Text-to-Speech",
                  description: "Use the speaker button to hear questions and answers aloud for better retention",
                  icon: "🔊",
                },
                {
                  title: "Review All Materials Before Interview",
                  description: "Download the PDF and review it multiple times to internalize key points",
                  icon: "📖",
                },
                {
                  title: "Record Mock Answers",
                  description:
                    "Practice answering each question out loud and record yourself to improve delivery",
                  icon: "🎬",
                },
              ].map((tip, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-cyan-500/40 p-6 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all"></div>

                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{tip.icon}</span>
                      <h3 className="font-semibold text-white">{tip.title}</h3>
                    </div>
                    <p className="text-sm text-slate-400">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InterviewQuestions;
