import { Briefcase, TrendingUp, Target, BookOpen, Code, Brain, Star, Calendar, Trophy, CheckCircle2, Monitor, Zap, Bot, Sparkles, Rocket, Eye, AlertCircle, ArrowRight, TrendingDown, Award, BarChart3, LineChart, Activity, Clock, Flame, Lock, Unlock, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";

const SkillDevelopmentDashboard = () => {
  const navigate = useNavigate();

  // Unique flagship features that set us apart
  const flagshipFeatures = [
    {
      title: "ATS Resume Scanner",
      description: "AI-powered resume analysis with 95% ATS compatibility scoring and real-time optimization suggestions",
      icon: Bot,
      color: "from-blue-600 via-purple-600 to-indigo-600",
      action: "Scan Resume",
      score: 78,
      status: "🔥 Most Popular",
      path: "/dashboard/skill-development/placement-kit",
      highlights: ["78% ATS Score", "15 Keywords Missing", "Real-time Analysis", "Industry Benchmarks"],
      isNew: false,
      isPremium: false
    },
    {
      title: "AI Interview Coach",
      description: "Revolutionary AI interviewer with voice analysis, real-time feedback, and personalized coaching sessions",
      icon: Brain,
      color: "from-emerald-600 via-teal-600 to-cyan-600",
      action: "Start Session",
      score: 85,
      status: "🚀 AI Powered",
      path: "/dashboard/skill-development/interview-prep",
      highlights: ["Voice Analysis", "Real-time Feedback", "Mock Interviews", "Success Tracking"],
      isNew: true,
      isPremium: false
    },
    {
      title: "Smart Job Matcher",
      description: "AI analyzes your profile and matches you with 90%+ compatible job opportunities from top companies",
      icon: Target,
      color: "from-orange-600 via-red-600 to-pink-600",
      action: "Find Jobs",
      score: 92,
      status: "⚡ High Match",
      path: "/dashboard/skill-development/placement-kit",
      highlights: ["92% Match Rate", "23 Active Jobs", "Salary Insights", "Application Tracking"],
      isNew: false,
      isPremium: false
    }
  ];

  const coreFeatures = [
    {
      title: "Career Advisor",
      description: "AI-curated career advice and learning journeys with industry-relevant curricula and hands-on projects",
      icon: Bot,
      color: "from-blue-500/20 to-purple-500/20",
      action: "Start Learning",
      progress: 75,
      status: "Active",
      path: "/dashboard/skill-development/career-advisor",
      features: ["Adaptive Learning Paths", "AI Mentor", "Real Projects", "Resources"]
    },
    {
      title: "Industry Trends",
      description: "Real-time insights into emerging skills, market demands, and salary trends",
      icon: TrendingUp,
      color: "from-green-500/20 to-teal-500/20",
      action: "View Trends",
      progress: 82,
      status: "Updated",
      path: "/dashboard/skill-development/industry-trends",
      features: ["Market Analysis", "Skill Demand", "Salary Insights", "Future Outlook"]
    },
    {
      title: "Projects & Internships",
      description: "Real-world opportunities to build your portfolio with mentorship and industry connections",
      icon: Code,
      color: "from-orange-500/20 to-red-500/20",
      action: "Find Opportunities",
      progress: 68,
      status: "Popular",
      path: "/dashboard/skill-development/projects-internships",
      features: ["Live Projects", "Mentorship", "Industry Connect", "Portfolio Building"]
    }
    
  ];

  const trendingSkills = [
    { skill: "Artificial Intelligence", demand: "Very High", growth: "+45%", jobs: "15K+", salary: "₹12-25L" },
    { skill: "Cloud Computing", demand: "High", growth: "+38%", jobs: "12K+", salary: "₹8-18L" },
    { skill: "Cybersecurity", demand: "Very High", growth: "+52%", jobs: "8K+", salary: "₹10-22L" },
    
  ];

  const upcomingOpportunities = [
    {
      title: "Frontend Developer Internship",
      company: "TechCorp",
      type: "Internship",
      duration: "3 months",
      stipend: "₹15K/month",
      skills: ["React", "TypeScript"],
      deadline: "3 days"
    },
    {
      title: "Data Analysis Project",
      company: "StartupXYZ",
      type: "Project",
      duration: "2 months",
      stipend: "₹25K total",
      skills: ["Python", "Pandas"],
      deadline: "1 week"
    },
    {
      title: "UI/UX Design Challenge",
      company: "DesignCo",
      type: "Challenge",
      duration: "1 month",
      stipend: "Portfolio building",
      skills: ["Figma", "Prototyping"],
      deadline: "5 days"
    }
  ];

  const achievements = [
    { title: "Code Master", description: "100+ coding problems solved", icon: Code, earned: true },
    { title: "Project Champion", description: "3 projects completed", icon: Trophy, earned: true },
    { title: "Skill Streak", description: "30 days continuous learning", icon: Target, earned: false },
    { title: "Industry Ready", description: "80% placement score", icon: Star, earned: false }
  ];

  // Gap Analysis Data - Enhanced
  const skillGaps = [
    {
      category: "Technical Skills",
      icon: Code,
      currentLevel: 65,
      targetLevel: 90,
      gap: 25,
      priority: "Critical",
      color: "from-rose-600 via-pink-600 to-fuchsia-600",
      bgGradient: "from-rose-950/40 via-pink-950/40 to-fuchsia-950/40",
      skills: [
        { name: "React.js", current: 75, target: 95, status: "In Progress", timeToClose: "2 months", locked: false },
        { name: "TypeScript", current: 60, target: 90, status: "Needs Focus", timeToClose: "3 months", locked: false },
        { name: "System Design", current: 40, target: 85, status: "Critical", timeToClose: "4 months", locked: false },
        { name: "Node.js", current: 55, target: 85, status: "Learning", timeToClose: "3 months", locked: false }
      ],
      recommendations: [
        "Complete Advanced React course",
        "Build 2 full-stack projects",
        "Practice system design problems"
      ],
      learningPath: {
        totalHours: 120,
        completedHours: 78,
        coursesCompleted: 3,
        totalCourses: 5,
        streak: 12
      },
      nextMilestone: "Complete System Design Fundamentals",
      estimatedCompletion: "3 months"
    },
    {
      category: "Soft Skills",
      icon: Brain,
      currentLevel: 70,
      targetLevel: 85,
      gap: 15,
      priority: "Medium",
      color: "from-cyan-600 via-blue-600 to-indigo-600",
      bgGradient: "from-cyan-950/40 via-blue-950/40 to-indigo-950/40",
      skills: [
        { name: "Communication", current: 75, target: 90, status: "Good", timeToClose: "2 months", locked: false },
        { name: "Leadership", current: 60, target: 80, status: "Developing", timeToClose: "3 months", locked: false },
        { name: "Problem Solving", current: 80, target: 90, status: "Strong", timeToClose: "1 month", locked: false },
        { name: "Teamwork", current: 72, target: 85, status: "Good", timeToClose: "2 months", locked: false }
      ],
      recommendations: [
        "Join public speaking workshops",
        "Lead a team project",
        "Participate in hackathons"
      ],
      learningPath: {
        totalHours: 80,
        completedHours: 56,
        coursesCompleted: 4,
        totalCourses: 6,
        streak: 8
      },
      nextMilestone: "Lead a team project presentation",
      estimatedCompletion: "2 months"
    },
    {
      category: "Industry Knowledge",
      icon: TrendingUp,
      currentLevel: 55,
      targetLevel: 80,
      gap: 25,
      priority: "High",
      color: "from-amber-600 via-orange-600 to-red-600",
      bgGradient: "from-amber-950/40 via-orange-950/40 to-red-950/40",
      skills: [
        { name: "Cloud Computing", current: 50, target: 85, status: "Learning", timeToClose: "3 months", locked: false },
        { name: "DevOps", current: 45, target: 75, status: "Beginner", timeToClose: "4 months", locked: false },
        { name: "Agile/Scrum", current: 70, target: 80, status: "Good", timeToClose: "1 month", locked: false },
        { name: "CI/CD", current: 40, target: 75, status: "Beginner", timeToClose: "4 months", locked: true }
      ],
      recommendations: [
        "Get AWS certification",
        "Learn Docker & Kubernetes",
        "Attend Agile workshops"
      ],
      learningPath: {
        totalHours: 100,
        completedHours: 55,
        coursesCompleted: 2,
        totalCourses: 5,
        streak: 5
      },
      nextMilestone: "Get AWS Cloud Practitioner Certification",
      estimatedCompletion: "3 months"
    }
  ];

  const careerReadiness = {
    overall: 73,
    categories: [
      { name: "Technical Proficiency", score: 75, trend: "up", change: "+8%", icon: Code },
      { name: "Project Experience", score: 68, trend: "up", change: "+12%", icon: Briefcase },
      { name: "Interview Skills", score: 70, trend: "neutral", change: "0%", icon: Brain },
      { name: "Industry Awareness", score: 65, trend: "up", change: "+5%", icon: TrendingUp },
      { name: "Professional Network", score: 60, trend: "down", change: "-3%", icon: Target }
    ]
  };

  const weeklyProgress = [
    { day: "Mon", hours: 3.5, completed: true },
    { day: "Tue", hours: 2.8, completed: true },
    { day: "Wed", hours: 4.2, completed: true },
    { day: "Thu", hours: 3.0, completed: true },
    { day: "Fri", hours: 2.5, completed: true },
    { day: "Sat", hours: 1.8, completed: false },
    { day: "Sun", hours: 0, completed: false }
  ];

  return (
    <DashboardLayout
      title="Skill Development Hub"
      description="Bridge the gap between learning and earning with industry-relevant skills"
    >
      <div className="p-6 space-y-8">
        {/* Hero Section with Flagship Features */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 border border-purple-500/20 shadow-2xl">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">AI-Powered Career Acceleration 🚀</h2>
                  <p className="text-purple-200">Unique features that set you apart from the competition</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2">
                  <Trophy className="w-4 h-4 mr-2" />
                  Level 3 Developer
                </Badge>
                <Badge className="bg-white/10 text-white border-white/20">
                  89% Placement Ready
                </Badge>
              </div>
            </div>

            {/* Flagship Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {flagshipFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          {feature.isNew && (
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs">
                              NEW
                            </Badge>
                          )}
                          <Badge className="bg-white/20 text-white border-white/30 text-xs">
                            {feature.status}
                          </Badge>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-purple-200 text-sm mb-4 leading-relaxed">{feature.description}</p>

                      {/* Score Display
                      {feature.score && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-purple-200 mb-2">
                            <span>Performance Score</span>
                            <span className="text-white font-bold">{feature.score}%</span>
                          </div>
                          <Progress value={feature.score} className="h-2 bg-white/20" />
                        </div>
                      )} */}

                      {/* Highlights */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {feature.highlights.map((highlight, idx) => (
                          <div key={idx} className="text-xs text-purple-200 flex items-center">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-green-400" />
                            {highlight}
                          </div>
                        ))}
                      </div>

                      <Button
                        className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                        onClick={() => navigate(feature.path)}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        {feature.action}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Stats */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="text-2xl font-bold text-white mb-1">12</div>
                <div className="text-xs text-purple-200">Skills Mastered</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="text-2xl font-bold text-white mb-1">3</div>
                <div className="text-xs text-purple-200">Active Projects</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="text-2xl font-bold text-white mb-1">23</div>
                <div className="text-xs text-purple-200">Job Matches</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="text-2xl font-bold text-white mb-1">₹8.5L</div>
                <div className="text-xs text-purple-200">Expected Package</div>
              </div>
            </div> */}
          </div>
        </div>

        
        {/* Enhanced Development Tools Section */}
        <div className="mb-6">
          <div className="text-center mb-6">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2 mb-3">
              <Rocket className="w-4 h-4 mr-2" />
              Complete Career Toolkit
            </Badge>
            <h2 className="text-2xl font-bold mb-2">Accelerate Your Career Growth</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and resources designed to help you master skills, land opportunities, and achieve your career goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 cursor-pointer"
                  onClick={() => navigate(feature.path)}
                >
                  {/* Gradient Background Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                  <CardContent className="relative z-10 p-5">
                    {/* Icon and Status */}
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <Badge
                        variant={feature.status === "Active" ? "default" : feature.status === "Popular" ? "secondary" : "outline"}
                        className="px-2.5 py-0.5 text-xs font-semibold"
                      >
                        {feature.status}
                      </Badge>
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed min-h-[48px]">
                      {feature.description}
                    </p>

                    {/* Feature Highlights */}
                    <div className="space-y-1.5 mb-3">
                      {feature.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                          <span className="text-muted-foreground">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg"
                      variant="outline"
                      size="sm"
                    >
                      <Sparkles className="w-4 h-4 mr-2 group-hover:animate-spin" />
                      {feature.action}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Three Column Section - Market Intelligence, Hot Opportunities, Achievement Showcase */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Market Intelligence */}
          <Card className="relative overflow-hidden border-2 border-emerald-700/30 bg-gradient-to-br from-slate-900 via-emerald-900/40 to-slate-900 shadow-xl">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>

            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center text-emerald-100">
                <TrendingUp className="w-5 h-5 mr-2" />
                Market Intelligence
                <Badge className="ml-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Live</Badge>
              </CardTitle>
              <CardDescription className="text-emerald-300/80">
                Real-time market insights powered by AI
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-3">
                {trendingSkills.map((skill, index) => (
                  <div key={index} className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-emerald-500/20 shadow-sm hover:bg-white/10 hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-sm text-emerald-100">{skill.skill}</div>
                      <Badge className={`text-xs ${skill.demand === 'Very High' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-orange-500/20 text-orange-300 border-orange-500/30'}`}>
                        {skill.demand}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                      <div className="text-center p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <div className="font-bold text-emerald-300">{skill.growth}</div>
                        <div className="text-emerald-400/70">Growth</div>
                      </div>
                      <div className="text-center p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="font-bold text-blue-300">{skill.salary}</div>
                        <div className="text-blue-400/70">Salary</div>
                      </div>
                    </div>

                    <div className="text-xs text-emerald-300/80 mb-3 flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {skill.jobs} active positions
                    </div>

                    <Button size="sm" 
                    onClick={() => navigate('/dashboard/skill-development/industry-trends')}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0 shadow-lg">
                      <Rocket className="w-3 h-3 mr-1" />
                      Start Learning
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hot Opportunities */}
          <Card className="relative overflow-hidden border-2 border-orange-700/30 bg-gradient-to-br from-slate-900 via-orange-900/40 to-slate-900 shadow-xl">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-red-600/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>

            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center text-orange-100">
                <Zap className="w-5 h-5 mr-2" />
                Hot Opportunities
                <Badge className="ml-2 bg-red-500/20 text-red-300 border-red-500/30 animate-pulse">🔥 Urgent</Badge>
              </CardTitle>
              <CardDescription className="text-orange-300/80">
                Time-sensitive opportunities matched to your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-3">
                {upcomingOpportunities.map((opportunity, index) => (
                  <div key={index} className={`p-4 rounded-xl border-2 shadow-sm hover:shadow-lg transition-all ${opportunity.deadline === '3 days' ? 'bg-red-500/10 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/15' :
                    opportunity.deadline === '1 week' ? 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50 hover:bg-yellow-500/15' :
                      'bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/15'
                    }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm text-orange-100">{opportunity.title}</h4>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge variant="outline" className={`text-xs font-bold ${opportunity.deadline === '3 days' ? 'border-red-400/50 text-red-300 bg-red-500/20' :
                          opportunity.deadline === '1 week' ? 'border-yellow-400/50 text-yellow-300 bg-yellow-500/20' :
                            'border-blue-400/50 text-blue-300 bg-blue-500/20'
                          }`}>
                          ⏰ {opportunity.deadline}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-xs text-orange-300/70 mb-3 space-y-1">
                      <div className="flex items-center">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {opportunity.company}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {opportunity.duration} • {opportunity.stipend}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {opportunity.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} className="text-xs px-2 py-1 bg-white/10 text-orange-200 border-white/20">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" 
                      onClick={() => navigate('/dashboard/skill-development/projects-internships')}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border-0 shadow-lg">
                        <Target className="w-3 h-3 mr-1" />
                        Apply Now
                      </Button>
                      <Button size="sm" className="px-3 bg-white/10 hover:bg-white/20 text-orange-200 border-white/20">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievement Showcase */}
          <Card className="relative overflow-hidden border-2 border-purple-700/30 bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900 shadow-xl">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-indigo-600/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>

            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center text-purple-100">
                <Trophy className="w-5 h-5 mr-2" />
                Achievement Showcase
                <Badge className="ml-2 bg-purple-500/20 text-purple-300 border-purple-500/30">2/4</Badge>
              </CardTitle>
              <CardDescription className="text-purple-300/80">
                Unlock badges as you progress in your career journey
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement, index) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-xl border-2 text-center transition-all duration-300 hover:scale-105 ${achievement.earned
                        ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/40 shadow-lg"
                        : "bg-white/10 border-purple-500/20 hover:border-purple-500/40"
                        }`}
                    >
                      <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${achievement.earned
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg"
                        : "bg-white/10"
                        }`}>
                        <IconComponent className={`w-5 h-5 ${achievement.earned ? "text-white" : "text-purple-400/50"
                          }`} />
                      </div>

                      <h4 className={`text-xs font-bold mb-1 ${achievement.earned ? "text-yellow-300" : "text-purple-300/70"
                        }`}>
                        {achievement.title}
                      </h4>

                      <p className={`text-[10px] ${achievement.earned ? "text-yellow-400/80" : "text-purple-400/50"
                        }`}>
                        {achievement.description}
                      </p>

                      {achievement.earned && (
                        <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-500/30 text-[10px] px-2 py-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                          Earned
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-purple-300/80 font-medium">Progress to next level:</span>
                  <span className="text-purple-200 font-bold">50%</span>
                </div>
                <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SkillDevelopmentDashboard;