import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Target, BookOpen, Users, Calculator, Award, TrendingUp, Brain, Calendar, Clock, AlertCircle, CheckCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";

const DecisionMakingDashboard = () => {
  const navigate = useNavigate();
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mainFeatures = [
    {
      title: "Career Pathway Analysis",
      description: "AI-powered analysis of Engineering, Medical, Commerce, and other career paths",
      icon: Target,
      color: "from-blue-500/20 to-purple-500/20",
      action: "Analyze Paths",
      status: "Active",
      path: "/dashboard/decision-making/pathways"
    },
    {
      title: "Exam Preparation Hub",
      description: "Comprehensive prep for JEE, NEET, CUET, CLAT with personalized study plans",
      icon: BookOpen,
      color: "from-green-500/20 to-teal-500/20",
      action: "Start Prep",
      status: "In Progress",
      path: "/dashboard/decision-making/exams"
    },
    {
      title: "College Insights",
      description: "Detailed analysis of colleges, branches, placements, and ROI calculations",
      icon: Calculator,
      color: "from-purple-500/20 to-pink-500/20",
      action: "Explore Colleges",
      status: "New",
      path: "/dashboard/decision-making/college-insights"
    },
    {
      title: "Alternative Careers",
      description: "Explore unconventional career paths and emerging opportunities",
      icon: Brain,
      color: "from-indigo-500/20 to-blue-500/20",
      action: "Discover Paths",
      status: "Trending",
      path: "/dashboard/decision-making/alternative-careers"
    },
    {
      title: "Mentor Network",
      description: "Connect with seniors, professionals, and subject experts for guidance",
      icon: Users,
      color: "from-orange-500/20 to-red-500/20",
      action: "Find Mentors",
      status: "Popular",
      path: "/dashboard/decision-making/mentors"
    },
    {
      title: "Mock Tests",
      description: "Practice with comprehensive mock tests and improve your performance",
      icon: Trophy,
      color: "from-yellow-500/20 to-orange-500/20",
      action: "Take Tests",
      status: "Active",
      path: "/dashboard/decision-making/mock-tests"
    },
    {
      title: "Progress Analytics",
      description: "Track your learning journey with detailed insights and recommendations",
      icon: TrendingUp,
      color: "from-teal-500/20 to-green-500/20",
      action: "View Analytics",
      status: "Updated",
      path: "/dashboard/decision-making/analytics"
    }
  ];

  const examProgress = [
    { exam: "JEE Main", progress: 78, color: "bg-blue-500", nextTest: "Mock Test 15", rank: "All India: 2,450" },
    { exam: "NEET", progress: 65, color: "bg-green-500", nextTest: "Biology Quiz", rank: "State: 890" },
    { exam: "CUET", progress: 82, color: "bg-purple-500", nextTest: "English Test", rank: "Zone: 156" },
    { exam: "CLAT", progress: 45, color: "bg-orange-500", nextTest: "Legal Reasoning", rank: "National: 5,670" }
  ];

  // Fetch deadlines using Gemini AI
  useEffect(() => {
    const loadDeadlines = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        
        if (!apiKey) {
          throw new Error("Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const currentDate = new Date().toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });

        const prompt = `You are an educational assistant. Today's date is ${currentDate}.

Please provide the upcoming important exam deadlines for Indian competitive exams in 2024-2025 for the following categories:
- JEE Main (Registration, Application, Exam dates)
- NEET (Registration, Application, Exam dates)
- CUET (Registration, Application, Exam dates)
- CLAT (Registration, Application, Exam dates)
- GATE (Registration, Application, Exam dates)
- CAT (Registration, Application, Exam dates)

Return ONLY a valid JSON array with this EXACT format (no markdown, no backticks, no explanation):
[
  {
    "name": "JEE Main Registration",
    "date": "2025-02-15",
    "category": "Engineering",
    "importance": "high"
  },
  {
    "name": "NEET Application Deadline",
    "date": "2025-03-20",
    "category": "Medical",
    "importance": "high"
  }
]

Important: 
- Use ONLY future dates from ${currentDate}
- Use ISO date format (YYYY-MM-DD)
- Include 8-10 upcoming deadlines
- Do not include any markdown formatting
- Return raw JSON only`;

        console.log("🤖 Fetching deadlines from Gemini AI...");
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("📝 Gemini Response:", text);

        // Clean the response - remove markdown code blocks if present
        let cleanedText = text.trim();
        cleanedText = cleanedText.replace(/```json\n?/g, '');
        cleanedText = cleanedText.replace(/```\n?/g, '');
        cleanedText = cleanedText.trim();

        const deadlinesData = JSON.parse(cleanedText);
        
        if (!Array.isArray(deadlinesData)) {
          throw new Error("Invalid response format from Gemini AI");
        }

        // Process deadlines
        const today = new Date();
        const formatted = deadlinesData.map((item: any) => {
          const deadlineDate = new Date(item.date);
          const diffTime = deadlineDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          let status = "upcoming";
          if (diffDays < 0) status = "expired";
          else if (diffDays === 0) status = "today";
          else if (diffDays <= 7) status = "urgent";

          return {
            ...item,
            status,
            timeLeft:
              status === "expired"
                ? "Expired"
                : status === "today"
                ? "Today!"
                : diffDays === 1
                ? "Tomorrow"
                : diffDays <= 7
                ? `${diffDays} days left`
                : `${diffDays} days`,
            formattedDate: deadlineDate.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            daysRemaining: diffDays
          };
        });

        // Sort by date (nearest first) and filter out expired
        const sortedDeadlines = formatted
          .filter((dl: any) => dl.status !== "expired")
          .sort((a: any, b: any) => a.daysRemaining - b.daysRemaining);

        console.log(`✅ Loaded ${sortedDeadlines.length} upcoming deadlines from Gemini AI`);
        setDeadlines(sortedDeadlines);

      } catch (err: any) {
        console.error("❌ Error loading deadlines from Gemini:", err);
        setError(err.message || "Failed to load deadlines from AI");
        
        // Fallback data
        const today = new Date();
        const fallbackDeadlines = [
          {
            name: "JEE Main Registration",
            date: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            category: "Engineering",
            importance: "high",
            status: "upcoming",
            timeLeft: "15 days left",
            formattedDate: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          },
          {
            name: "NEET Application",
            date: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            category: "Medical",
            importance: "high",
            status: "upcoming",
            timeLeft: "30 days left",
            formattedDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          },
          {
            name: "CUET Registration",
            date: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            category: "University",
            importance: "medium",
            status: "upcoming",
            timeLeft: "45 days",
            formattedDate: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          },
        ];
        setDeadlines(fallbackDeadlines);
      } finally {
        setLoading(false);
      }
    };

    loadDeadlines();
  }, []);

  const recentAchievements = [
    { title: "Mock Test Champion", score: "95%", subject: "Physics", icon: Trophy },
    { title: "Consistency Master", streak: "15 days", type: "Study Streak", icon: CheckCircle },
    { title: "Top Performer", rank: "Top 5%", exam: "JEE Mock", icon: Award }
  ];

  return (
    <DashboardLayout 
      title="Decision Maker's Hub" 
      description="Strategic preparation for your crucial academic decisions"
    >
      <div className="p-6 space-y-8">
        {/* Performance Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Your Preparation Dashboard 🎯</h2>
                <p className="text-muted-foreground">Track your progress across all competitive exams</p>
              </div>
            </div>
            <Badge className="bg-primary/20 text-primary">
              Rank: Top 8%
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-primary">156</div>
              <div className="text-sm text-muted-foreground">Mock Tests Taken</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-secondary">89.2%</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-accent">45hrs</div>
              <div className="text-sm text-muted-foreground">This Month</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Mentor Sessions</div>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exam Progress Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-4">Exam Preparation Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {examProgress.map((exam, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="feature-card">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-semibold text-lg">{exam.exam}</div>
                          <Badge variant={exam.progress >= 70 ? "default" : exam.progress >= 50 ? "secondary" : "destructive"}>
                            {exam.progress >= 70 ? "Excellent" : exam.progress >= 50 ? "Good" : "Focus Needed"}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{exam.progress}%</span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Next Test:</span>
                              <span className="font-medium">{exam.nextTest}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Current Rank:</span>
                              <span className="font-medium text-primary">{exam.rank}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Main Features - UPDATED: Removed Progress Bars */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-4">Strategic Tools</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {mainFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className="feature-card group hover:shadow-lg transition-all duration-300 cursor-pointer">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                            <Badge variant={feature.status === "Active" ? "default" : feature.status === "Popular" ? "secondary" : "outline"}>
                              {feature.status}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <CardDescription className="text-muted-foreground text-sm">
                            {feature.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button 
                            className="w-full btn-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            onClick={() => navigate(feature.path)}
                          >
                            {feature.action}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Critical Deadlines - AI Powered */}
            <Card className="feature-card border-2 border-red-200/50 dark:border-red-800/50">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-red-600 dark:text-red-400">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Critical Deadlines
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                    🤖 AI Powered
                  </Badge>
                </div>
                <CardDescription className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Real-time updates from Gemini AI
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-8"
                    >
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <Brain className="w-6 h-6 absolute top-3 left-3 text-primary animate-pulse" />
                      </div>
                      <span className="ml-2 mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Fetching from Gemini AI...
                      </span>
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                      <p className="text-red-600 dark:text-red-400 text-sm mb-2 font-medium">{error}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">Showing fallback data</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => window.location.reload()}
                        className="text-xs border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                      >
                        Retry
                      </Button>
                    </motion.div>
                  ) : deadlines.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-500" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No urgent deadlines</p>
                      <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">You&apos;re all caught up! 🎉</p>
                    </motion.div>
                  ) : (
                    <AnimatePresence>
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                        {deadlines.slice(0, 8).map((dl: any, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: 0.05 * idx }}
                            className={`flex items-start justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                              dl.status === 'today' 
                                ? 'bg-red-100 border-red-400 dark:bg-red-900/50 dark:border-red-600 shadow-lg' 
                                : dl.status === 'urgent'
                                ? 'bg-orange-100 border-orange-400 dark:bg-orange-900/40 dark:border-orange-600'
                                : dl.status === 'expired'
                                ? 'bg-gray-100 border-gray-300 dark:bg-gray-800/40 dark:border-gray-600 opacity-60'
                                : 'bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-bold text-base text-gray-900 dark:text-black">{dl.name}</p>
                                {dl.importance === 'high' && (
                                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0"></span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 flex-shrink-0 text-primary dark:text-primary-light" />
                                <span className="font-bold text-base text-primary dark:text-primary-light">{dl.formattedDate}</span>
                              </div>
                              {dl.category && (
                                <Badge variant="outline" className="mt-1 text-xs border-2 border-gray-600 dark:border-gray-400 text-gray-900 dark:text-gray-100 font-semibold">
                                  {dl.category}
                                </Badge>
                              )}
                            </div>
                            <Badge 
                              variant={
                                dl.status === 'today' ? 'destructive' : 
                                dl.status === 'urgent' ? 'default' :
                                dl.status === 'expired' ? 'secondary' : 
                                'outline'
                              }
                              className={`text-xs whitespace-nowrap ml-2 flex-shrink-0 font-bold ${
                                dl.status === 'today' ? 'animate-pulse bg-red-600 text-white border-0 text-sm' : 
                                dl.status === 'urgent' ? 'bg-orange-600 text-white border-0 text-sm' :
                                dl.status === 'expired' ? 'bg-gray-600 text-white border-0 text-sm' :
                                 'bg-blue-600 text-white border-0 text-sm'
                                                          
                              }`}
                            >
                              {dl.timeLeft}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </AnimatePresence>
                  )}
                </div>
              </CardContent>
            </Card>

          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DecisionMakingDashboard;
