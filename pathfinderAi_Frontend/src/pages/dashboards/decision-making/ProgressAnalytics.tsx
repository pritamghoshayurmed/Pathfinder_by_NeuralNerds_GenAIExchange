import { useState } from "react";
import { BarChart3, TrendingUp, Target, Calendar, Clock, Award, Brain, Zap, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";

const ProgressAnalytics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const overallProgress = {
    studyHours: 156,
    testsCompleted: 47,
    averageScore: 74,
    rank: "AIR 2,450",
    improvement: "+18%",
    streak: 15,
    goals: {
      daily: { target: 4, current: 3.2, unit: "hours" },
      weekly: { target: 3, current: 4, unit: "tests" },
      monthly: { target: 80, current: 74, unit: "avg score" }
    }
  };

  const subjectProgress = [
    {
      name: "Physics",
      progress: 78,
      timeSpent: 52,
      testsCompleted: 16,
      avgScore: 76,
      improvement: "+12%",
      weakTopics: ["Wave Optics", "Modern Physics"],
      strongTopics: ["Mechanics", "Thermodynamics"],
      nextMilestone: "Complete Electromagnetism"
    },
    {
      name: "Chemistry",
      progress: 71,
      timeSpent: 48,
      testsCompleted: 15,
      avgScore: 72,
      improvement: "+8%",
      weakTopics: ["Organic Reactions", "Coordination Chemistry"],
      strongTopics: ["Physical Chemistry", "Atomic Structure"],
      nextMilestone: "Master Organic Chemistry"
    },
    {
      name: "Mathematics",
      progress: 74,
      timeSpent: 56,
      testsCompleted: 16,
      avgScore: 74,
      improvement: "+15%",
      weakTopics: ["Calculus", "3D Geometry"],
      strongTopics: ["Algebra", "Trigonometry"],
      nextMilestone: "Advanced Calculus Practice"
    }
  ];

  const weeklyData = [
    { week: "Week 1", studyHours: 28, tests: 3, avgScore: 68 },
    { week: "Week 2", studyHours: 32, tests: 4, avgScore: 72 },
    { week: "Week 3", studyHours: 30, tests: 3, avgScore: 75 },
    { week: "Week 4", studyHours: 35, tests: 5, avgScore: 78 }
  ];

  const achievements = [
    {
      title: "Study Streak Master",
      description: "Maintained 15-day study streak",
      date: "Dec 22, 2024",
      type: "consistency",
      icon: Award,
      points: 150
    },
    {
      title: "Score Improver",
      description: "Improved average score by 15%",
      date: "Dec 20, 2024",
      type: "performance",
      icon: TrendingUp,
      points: 200
    },
    {
      title: "Quick Learner",
      description: "Completed 5 tests in a week",
      date: "Dec 18, 2024",
      type: "activity",
      icon: Zap,
      points: 100
    },
    {
      title: "Physics Master",
      description: "Scored 90%+ in Physics test",
      date: "Dec 15, 2024",
      type: "subject",
      icon: Target,
      points: 175
    }
  ];

  const studyPatterns = [
    {
      pattern: "Peak Performance Time",
      value: "2:00 PM - 6:00 PM",
      description: "Your highest scoring tests are taken during this time",
      recommendation: "Schedule important topics during this window"
    },
    {
      pattern: "Optimal Study Duration",
      value: "45-60 minutes",
      description: "Best focus and retention in sessions of this length",
      recommendation: "Break longer study sessions into chunks"
    },
    {
      pattern: "Weekly Pattern",
      value: "Tuesday & Thursday",
      description: "Highest productivity on these days",
      recommendation: "Plan challenging topics on these days"
    },
    {
      pattern: "Subject Rotation",
      value: "Physics → Math → Chemistry",
      description: "This sequence shows best performance",
      recommendation: "Follow this order for daily study plans"
    }
  ];

  const goals = [
    {
      title: "JEE Main Target",
      target: "AIR 1000",
      current: "AIR 2,450",
      progress: 60,
      deadline: "Jan 30, 2025",
      status: "on-track"
    },
    {
      title: "Daily Study Goal",
      target: "4 hours",
      current: "3.2 hours",
      progress: 80,
      deadline: "Daily",
      status: "improving"
    },
    {
      title: "Mock Test Target",
      target: "85% average",
      current: "74% average",
      progress: 87,
      deadline: "Jan 15, 2025",
      status: "on-track"
    },
    {
      title: "Physics Mastery",
      target: "90% score",
      current: "76% score",
      progress: 84,
      deadline: "Jan 20, 2025",
      status: "ahead"
    }
  ];

  const recommendations = [
    {
      type: "urgent",
      title: "Focus on Wave Optics",
      description: "Your score in this topic is below average. Recommend 5 hours of focused study.",
      action: "Start Practice",
      priority: "High"
    },
    {
      type: "suggestion",
      title: "Increase Math Practice",
      description: "You're doing well but can improve calculus. 2-3 more practice sessions recommended.",
      action: "View Resources",
      priority: "Medium"
    },
    {
      type: "positive",
      title: "Maintain Chemistry Momentum",
      description: "Great progress in Physical Chemistry! Keep up the current pace.",
      action: "Continue",
      priority: "Low"
    }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ahead": return "text-green-600";
      case "on-track": return "text-blue-600";
      case "improving": return "text-yellow-600";
      case "behind": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <DashboardLayout 
      title="Progress Analytics" 
      description="Comprehensive insights into your learning journey and performance trends"
    >
      <div className="p-6 space-y-8">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{overallProgress.studyHours}h</div>
                  <div className="text-sm text-muted-foreground">Study Hours</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{overallProgress.testsCompleted}</div>
                  <div className="text-sm text-muted-foreground">Tests Done</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">{overallProgress.averageScore}%</div>
                  <div className="text-sm text-muted-foreground">Avg Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{overallProgress.rank}</div>
                  <div className="text-sm text-muted-foreground">Best Rank</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-500" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{overallProgress.improvement}</div>
                  <div className="text-sm text-muted-foreground">Improvement</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">{overallProgress.streak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="recommendations">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Performance Trend</CardTitle>
                  <CardDescription>Your progress over the last 4 weeks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyData.map((week, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-semibold">{week.week}</div>
                          <div className="text-sm text-muted-foreground">
                            {week.studyHours}h • {week.tests} tests
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{week.avgScore}%</div>
                          <div className="text-sm text-muted-foreground">Avg Score</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Goals Progress</CardTitle>
                  <CardDescription>Track your key objectives</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Daily Study ({overallProgress.goals.daily.unit})</span>
                        <span>{overallProgress.goals.daily.current}/{overallProgress.goals.daily.target}</span>
                      </div>
                      <Progress value={(overallProgress.goals.daily.current / overallProgress.goals.daily.target) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Weekly Tests ({overallProgress.goals.weekly.unit})</span>
                        <span>{overallProgress.goals.weekly.current}/{overallProgress.goals.weekly.target}</span>
                      </div>
                      <Progress value={(overallProgress.goals.weekly.current / overallProgress.goals.weekly.target) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Monthly Average ({overallProgress.goals.monthly.unit})</span>
                        <span>{overallProgress.goals.monthly.current}/{overallProgress.goals.monthly.target}</span>
                      </div>
                      <Progress value={(overallProgress.goals.monthly.current / overallProgress.goals.monthly.target) * 100} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <div className="grid gap-6">
              {subjectProgress.map((subject, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{subject.name}</span>
                      <Badge variant="secondary">{subject.improvement}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-muted-foreground">Progress</div>
                        <div className="flex items-center gap-2">
                          <Progress value={subject.progress} className="flex-1" />
                          <span className="font-semibold">{subject.progress}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Time Spent</div>
                        <div className="font-semibold">{subject.timeSpent}h</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Tests</div>
                        <div className="font-semibold">{subject.testsCompleted}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Avg Score</div>
                        <div className="font-semibold">{subject.avgScore}%</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-2">Strong Topics</div>
                        <div className="space-y-1">
                          {subject.strongTopics.map((topic, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs mr-1">{topic}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Weak Topics</div>
                        <div className="space-y-1">
                          {subject.weakTopics.map((topic, idx) => (
                            <Badge key={idx} variant="destructive" className="text-xs mr-1">{topic}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Next Milestone</div>
                        <div className="text-sm text-muted-foreground">{subject.nextMilestone}</div>
                        <Button size="sm" className="mt-2">Start Working</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{goal.title}</span>
                      <Badge className={getStatusColor(goal.status)}>
                        {goal.status.replace('-', ' ')}
                      </Badge>
                    </CardTitle>
                    <CardDescription>Deadline: {goal.deadline}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Current: {goal.current}</span>
                        <span>Target: {goal.target}</span>
                      </div>
                      <Progress value={goal.progress} />
                      <div className="text-sm text-muted-foreground">
                        {goal.progress}% complete
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <div className="grid gap-4">
              {studyPatterns.map((pattern, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{pattern.pattern}</h3>
                        <div className="text-2xl font-bold text-primary my-2">{pattern.value}</div>
                        <p className="text-muted-foreground text-sm mb-2">{pattern.description}</p>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-blue-900">Recommendation:</div>
                          <div className="text-sm text-blue-800">{pattern.recommendation}</div>
                        </div>
                      </div>
                      <Brain className="w-8 h-8 text-blue-500 ml-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <achievement.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">{achievement.date}</span>
                          <Badge variant="outline">+{achievement.points} points</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid gap-4">
              {recommendations.map((rec, index) => (
                <Card key={index} className={`border-l-4 ${
                  rec.type === 'urgent' ? 'border-red-500' :
                  rec.type === 'suggestion' ? 'border-yellow-500' :
                  'border-green-500'
                }`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{rec.title}</h3>
                          <Badge variant={
                            rec.priority === 'High' ? 'destructive' :
                            rec.priority === 'Medium' ? 'default' :
                            'secondary'
                          }>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">{rec.description}</p>
                      </div>
                      <Button variant="outline">{rec.action}</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProgressAnalytics;
