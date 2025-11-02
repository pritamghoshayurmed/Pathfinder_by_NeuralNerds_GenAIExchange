import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Clock, Target, Award, Star, Play, RotateCcw, CheckCircle, AlertCircle, TrendingUp, Download, Sparkles, Code, MessageSquare, Layers, Zap, Mic, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";
import { resetInterviewProgress } from "@/services/interviewProgressService";

const InterviewPrep = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>("frontend-developer");
  const [selectedRounds, setSelectedRounds] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedLabel, setSelectedLabel] = useState<string>("sde1");

  const mockInterviews = [
    {
      id: 1,
      company: "Google",
      role: "Frontend Developer",
      type: "Technical",
      difficulty: "Hard",
      duration: "60 minutes",
      questions: 8,
      completed: true,
      score: 85,
      feedback: "Strong in React concepts but needs improvement in algorithms",
      aiInsights: "Focus on dynamic programming and tree traversal problems"
    },
    {
      id: 2,
      company: "Microsoft",
      role: "Software Engineer",
      type: "Behavioral",
      difficulty: "Medium",
      duration: "45 minutes",
      questions: 6,
      completed: true,
      score: 92,
      feedback: "Excellent communication and leadership examples",
      aiInsights: "Well-prepared with specific examples from experience"
    },
    {
      id: 3,
      company: "Amazon",
      role: "Full Stack Developer",
      type: "System Design",
      difficulty: "Hard",
      duration: "75 minutes",
      questions: 3,
      completed: false,
      score: null,
      feedback: null,
      aiInsights: null
    }
  ];

  const interviewAnalytics = {
    totalInterviews: 12,
    averageScore: 78,
    improvement: "+23%",
    strongAreas: ["React", "JavaScript", "Problem Solving"],
    weakAreas: ["System Design", "Algorithms", "Database Design"],
    successProbability: 85,
    recommendedPractice: ["Dynamic Programming", "System Design Fundamentals", "Behavioral Questions"]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "Hard": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const interviewRounds = [
    { id: 'machine-coding', name: 'Machine Coding', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { id: 'technical', name: 'Technical Discussion', icon: Brain, color: 'from-purple-500 to-pink-500' },
    { id: 'system-design', name: 'System Design', icon: Layers, color: 'from-orange-500 to-red-500' },
    { id: 'behavioral', name: 'Behavioral', icon: MessageSquare, color: 'from-green-500 to-emerald-500' }
  ];

  const toggleRound = (roundId: string) => {
    setSelectedRounds(prev =>
      prev.includes(roundId)
        ? prev.filter(id => id !== roundId)
        : [...prev, roundId]
    );
  };

  const handleStartInterview = () => {
    // Reset interview progress when starting a new interview
    resetInterviewProgress();
    navigate("/interview/round/1");
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8 bg-slate-950 min-h-screen">
        {/* ============ Premium Header Section ============ */}
        <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl border border-transparent">
          {/* Premium Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-3xl"></div>

          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-indigo-500/0 hover:from-blue-500/5 hover:via-purple-500/5 hover:to-indigo-500/5 transition-all duration-700 rounded-3xl"></div>

          {/* Glowing Border Effect */}
          <div className="absolute inset-0 rounded-3xl border border-gradient-to-r from-purple-500/30 via-blue-500/20 to-indigo-500/30"></div>

          {/* Premium Accent Elements */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-600/5 to-transparent rounded-full -translate-x-32 -translate-y-32 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-600/5 to-transparent rounded-full translate-x-32 translate-y-32 blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500/30 to-blue-500/20 rounded-xl backdrop-blur-sm border border-purple-400/40 shadow-lg">
                <Brain className="w-8 h-8 text-purple-300" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-100 bg-clip-text text-transparent">
                  AI Interview Preparation
                </h1>
                <p className="text-purple-300 text-lg font-medium">Master Your Interview Skills</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-gradient-to-r from-purple-500/40 to-purple-600/30 border-purple-400/60 text-purple-100 backdrop-blur-sm shadow-md">
                <Sparkles className="w-3 h-3 mr-2" />
                AI-Powered
              </Badge>
              <Badge className="bg-gradient-to-r from-blue-500/40 to-blue-600/30 border-blue-400/60 text-blue-100 backdrop-blur-sm shadow-md">
                <Target className="w-3 h-3 mr-2" />
                Real-time Feedback
              </Badge>
              <Badge className="bg-gradient-to-r from-emerald-500/40 to-emerald-600/30 border-emerald-400/60 text-emerald-100 backdrop-blur-sm shadow-md">
                <Award className="w-3 h-3 mr-2" />
                Performance Tracking
              </Badge>
            </div>
          </div>
        </div>

        {/* ============ Main Interview Setup Section (Following Wireframe) ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Role Selection & Rounds */}
          <div className="space-y-6">
            {/* Role Selection Card */}
            <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 border-slate-700/50 shadow-xl backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Select Role
                </CardTitle>
                <CardDescription className="text-slate-400">Choose the role you're applying for</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50 transition-colors">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="frontend-developer" className="text-white hover:bg-slate-700">Frontend Developer</SelectItem>
                    <SelectItem value="backend-developer" className="text-white hover:bg-slate-700">Backend Developer</SelectItem>
                    <SelectItem value="fullstack-developer" className="text-white hover:bg-slate-700">Full Stack Developer</SelectItem>
                    <SelectItem value="devops-engineer" className="text-white hover:bg-slate-700">DevOps Engineer</SelectItem>
                    <SelectItem value="data-scientist" className="text-white hover:bg-slate-700">Data Scientist</SelectItem>
                    <SelectItem value="ml-engineer" className="text-white hover:bg-slate-700">ML Engineer</SelectItem>
                  </SelectContent>
                </Select>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-sm text-slate-300 block mb-1">Select Company</label>
                    <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-white">
                        <SelectValue placeholder="All Companies" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all" className="text-white hover:bg-slate-700">All Companies</SelectItem>
                        <SelectItem value="google" className="text-white hover:bg-slate-700">Google</SelectItem>
                        <SelectItem value="microsoft" className="text-white hover:bg-slate-700">Microsoft</SelectItem>
                        <SelectItem value="amazon" className="text-white hover:bg-slate-700">Amazon</SelectItem>
                        <SelectItem value="meta" className="text-white hover:bg-slate-700">Meta</SelectItem>
                        <SelectItem value="apple" className="text-white hover:bg-slate-700">Apple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-slate-300 block mb-1">Position / Level</label>
                    <Select value={selectedLabel} onValueChange={setSelectedLabel}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-white">
                        <SelectValue placeholder="SDE1" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="sde1" className="text-white hover:bg-slate-700">SDE1</SelectItem>
                        <SelectItem value="sde2" className="text-white hover:bg-slate-700">SDE2</SelectItem>
                        <SelectItem value="sde3" className="text-white hover:bg-slate-700">SDE3</SelectItem>
                        <SelectItem value="junior" className="text-white hover:bg-slate-700">Junior</SelectItem>
                        <SelectItem value="mid" className="text-white hover:bg-slate-700">Mid-level</SelectItem>
                        <SelectItem value="senior" className="text-white hover:bg-slate-700">Senior</SelectItem>
                        <SelectItem value="lead" className="text-white hover:bg-slate-700">Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interview Rounds Card */}
            <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 border-slate-700/50 shadow-xl backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  Interview Rounds
                </CardTitle>
                <CardDescription className="text-slate-400">Complete all 4 rounds in sequential order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {interviewRounds.map((round, index) => (
                  <div
                    key={round.id}
                    className={`p-4 rounded-xl transition-all duration-300 border bg-gradient-to-r ${round.color} border-transparent shadow-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/20">
                        <round.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-white">
                          Round {index + 1}: {round.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-xs text-blue-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Rounds must be completed in order (1 → 2 → 3 → 4)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Start Interview Button */}
            <Button
              className="w-full h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-950 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleStartInterview}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Mock Interview
            </Button>
          </div>

          {/* Right Column - Rules & Guidelines */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 border-slate-700/50 shadow-xl backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  Interview Rules & Guidelines
                </CardTitle>
                <CardDescription className="text-slate-400">Important information before you start</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* General Rules */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    General Guidelines
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <p className="font-medium text-white text-sm">Time Management</p>
                      </div>
                      <p className="text-xs text-slate-400">Each round has a specific time limit. Manage your time wisely.</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <p className="font-medium text-white text-sm">Think Aloud</p>
                      </div>
                      <p className="text-xs text-slate-400">Explain your thought process as you solve problems.</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Mic className="w-4 h-4 text-green-400" />
                        <p className="font-medium text-white text-sm">Clear Communication</p>
                      </div>
                      <p className="text-xs text-slate-400">Speak clearly and articulate your ideas effectively.</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        <p className="font-medium text-white text-sm">Ask Questions</p>
                      </div>
                      <p className="text-xs text-slate-400">Don't hesitate to ask clarifying questions.</p>
                    </div>
                  </div>
                </div>

                {/* Round-Specific Tips */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Round-Specific Tips
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="w-4 h-4 text-blue-400" />
                        <p className="font-semibold text-white">Machine Coding</p>
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1 ml-6 list-disc">
                        <li>Write clean, modular, and well-documented code</li>
                        <li>Focus on code quality and best practices</li>
                        <li>Test your code with edge cases</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <p className="font-semibold text-white">Technical Discussion</p>
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1 ml-6 list-disc">
                        <li>Demonstrate deep understanding of concepts</li>
                        <li>Discuss trade-offs and alternatives</li>
                        <li>Share real-world experiences</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Layers className="w-4 h-4 text-orange-400" />
                        <p className="font-semibold text-white">System Design</p>
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1 ml-6 list-disc">
                        <li>Start with high-level architecture</li>
                        <li>Consider scalability and reliability</li>
                        <li>Discuss data flow and API design</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-green-400" />
                        <p className="font-semibold text-white">Behavioral</p>
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1 ml-6 list-disc">
                        <li>Use the STAR method (Situation, Task, Action, Result)</li>
                        <li>Provide specific examples from your experience</li>
                        <li>Show leadership and problem-solving skills</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* AI Features */}
                <div className="p-4 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-lg border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <p className="font-semibold text-white">AI-Powered Features</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      Real-time feedback
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      Voice analysis
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      Code review
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      Performance tracking
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 border-slate-700/50 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl">
                  <Award className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{interviewAnalytics.totalInterviews}</p>
                  <p className="text-sm text-slate-400">Mock Interviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 border-slate-700/50 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{interviewAnalytics.averageScore}%</p>
                  <p className="text-sm text-slate-400">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 border-slate-700/50 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{interviewAnalytics.improvement}</p>
                  <p className="text-sm text-slate-400">Improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 border-slate-700/50 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl">
                  <Star className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{interviewAnalytics.successProbability}%</p>
                  <p className="text-sm text-slate-400">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-1 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">Analytics & Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              {/* Performance Overview & AI Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 border-slate-700/50 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      Performance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2 text-slate-300">
                        <span>Overall Performance</span>
                        <span className="text-white font-semibold">{interviewAnalytics.averageScore}%</span>
                      </div>
                      <Progress value={interviewAnalytics.averageScore} className="h-2 bg-slate-700" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2 text-slate-300">
                        <span>Success Probability</span>
                        <span className="text-white font-semibold">{interviewAnalytics.successProbability}%</span>
                      </div>
                      <Progress value={interviewAnalytics.successProbability} className="h-2 bg-slate-700" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-white">Strong Areas:</h4>
                      <div className="flex flex-wrap gap-1">
                        {interviewAnalytics.strongAreas.map((area, index) => (
                          <Badge key={index} variant="default" className="bg-green-500/20 text-green-300 border-green-500/30">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-white">Areas for Improvement:</h4>
                      <div className="flex flex-wrap gap-1">
                        {interviewAnalytics.weakAreas.map((area, index) => (
                          <Badge key={index} variant="outline" className="border-red-500/30 text-red-300">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 border-slate-700/50 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Brain className="w-5 h-5 text-purple-400" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-lg border border-purple-500/30">
                      <h4 className="font-medium mb-2 text-white">Recommended Practice Areas:</h4>
                      <ul className="space-y-2">
                        {interviewAnalytics.recommendedPractice.map((practice, index) => (
                          <li key={index} className="flex items-center gap-2 text-slate-300">
                            <Target className="w-4 h-4 text-purple-400" />
                            <span className="text-sm">{practice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/30">
                      <h4 className="font-medium mb-2 text-white">Next Steps:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2 text-slate-300">
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                          Complete 3 more system design interviews
                        </li>
                        <li className="flex items-center gap-2 text-slate-300">
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                          Practice dynamic programming problems
                        </li>
                        <li className="flex items-center gap-2 text-slate-300">
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                          Review behavioral question templates
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Mock Interviews removed */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
