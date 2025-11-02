import { useState } from "react";
import { BarChart3, Target, Award, TrendingUp, Calendar, Star, Trophy, CheckCircle, Clock, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";

const ProgressTracking = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("week");

  const overallStats = {
    assessmentsCompleted: 12,
    careerFieldsExplored: 8,
    skillGamesPlayed: 25,
    studyTechniquesLearned: 4,
    currentLevel: 3,
    totalXP: 1250,
    nextLevelXP: 1500
  };

  const weeklyProgress = [
    { day: "Mon", assessments: 2, games: 3, study: 1 },
    { day: "Tue", assessments: 1, games: 4, study: 2 },
    { day: "Wed", assessments: 3, games: 2, study: 1 },
    { day: "Thu", assessments: 1, games: 5, study: 3 },
    { day: "Fri", assessments: 2, games: 3, study: 2 },
    { day: "Sat", assessments: 0, games: 6, study: 1 },
    { day: "Sun", assessments: 1, games: 2, study: 0 }
  ];

  const achievements = [
    {
      id: "first-assessment",
      title: "First Steps",
      description: "Completed your first aptitude test",
      icon: Brain,
      color: "text-blue-500",
      earned: true,
      earnedDate: "2 weeks ago",
      xp: 50
    },
    {
      id: "explorer",
      title: "Career Explorer",
      description: "Explored 5 different career fields",
      icon: Target,
      color: "text-green-500",
      earned: true,
      earnedDate: "1 week ago",
      xp: 100
    },
    {
      id: "game-master",
      title: "Game Master",
      description: "Played 20 skill-building games",
      icon: Trophy,
      color: "text-purple-500",
      earned: true,
      earnedDate: "3 days ago",
      xp: 150
    },
    {
      id: "study-smart",
      title: "Study Smart",
      description: "Learned 3 study techniques",
      icon: Star,
      color: "text-yellow-500",
      earned: false,
      progress: 75,
      xp: 200
    },
    {
      id: "consistent",
      title: "Consistency Champion",
      description: "Use the platform for 14 days straight",
      icon: Calendar,
      color: "text-orange-500",
      earned: false,
      progress: 60,
      xp: 300
    },
    {
      id: "well-rounded",
      title: "Well-Rounded Explorer",
      description: "Complete activities in all 4 main areas",
      icon: Award,
      color: "text-red-500",
      earned: false,
      progress: 85,
      xp: 250
    }
  ];

  const skillProgress = [
    { skill: "Logical Reasoning", level: 85, improvement: "+15", trend: "up" },
    { skill: "Creative Thinking", level: 72, improvement: "+8", trend: "up" },
    { skill: "Communication", level: 68, improvement: "+12", trend: "up" },
    { skill: "Problem Solving", level: 78, improvement: "+5", trend: "up" },
    { skill: "Time Management", level: 45, improvement: "+20", trend: "up" },
    { skill: "Stress Management", level: 55, improvement: "+10", trend: "up" }
  ];

  const monthlyGoals = [
    {
      title: "Complete 5 more aptitude tests",
      progress: 60,
      current: 3,
      target: 5,
      deadline: "End of month",
      category: "Assessment"
    },
    {
      title: "Explore 3 new career fields",
      progress: 33,
      current: 1,
      target: 3,
      deadline: "3 weeks left",
      category: "Career"
    },
    {
      title: "Master 2 study techniques",
      progress: 50,
      current: 1,
      target: 2,
      deadline: "2 weeks left",
      category: "Study"
    },
    {
      title: "Play 30 skill games",
      progress: 80,
      current: 24,
      target: 30,
      deadline: "1 week left",
      category: "Games"
    }
  ];

  const learningPath = [
    { 
      phase: "Foundation Building", 
      status: "completed", 
      activities: ["Basic aptitude tests", "Career awareness", "Study habits"],
      completedDate: "2 weeks ago"
    },
    { 
      phase: "Skill Development", 
      status: "in-progress", 
      activities: ["Advanced assessments", "Skill games", "Time management"],
      progress: 65
    },
    { 
      phase: "Specialization", 
      status: "locked", 
      activities: ["Deep career exploration", "Advanced techniques", "Goal setting"],
      unlockRequirement: "Complete Skill Development phase"
    },
    { 
      phase: "Mastery", 
      status: "locked", 
      activities: ["Mentorship", "Leadership skills", "Future planning"],
      unlockRequirement: "Complete Specialization phase"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "locked": return "bg-gray-300";
      default: return "bg-gray-300";
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? <TrendingUp className="w-3 h-3 text-green-500" /> : null;
  };

  return (
    <DashboardLayout 
      title="Your Progress Journey" 
      description="Track your learning achievements and growth over time"
    >
      <div className="p-6 space-y-8">
        {/* Overall Progress */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Your Learning Journey 🚀
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-blue-500">{overallStats.assessmentsCompleted}</div>
              <div className="text-sm text-muted-foreground">Assessments</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-green-500">{overallStats.careerFieldsExplored}</div>
              <div className="text-sm text-muted-foreground">Career Fields</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-purple-500">{overallStats.skillGamesPlayed}</div>
              <div className="text-sm text-muted-foreground">Skill Games</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-orange-500">Level {overallStats.currentLevel}</div>
              <div className="text-sm text-muted-foreground">Explorer Level</div>
            </div>
          </div>
          
          {/* XP Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Progress to Level {overallStats.currentLevel + 1}</span>
              <span className="text-sm text-muted-foreground">
                {overallStats.totalXP} / {overallStats.nextLevelXP} XP
              </span>
            </div>
            <Progress value={(overallStats.totalXP / overallStats.nextLevelXP) * 100} className="h-3" />
          </div>
        </div>

        <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="skills">Skill Growth</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="roadmap">Learning Path</TabsTrigger>
          </TabsList>

          <TabsContent value="week" className="space-y-6">
            {/* Weekly Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Your daily learning activities this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyProgress.map((day, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium">{day.day}</div>
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <div className="text-xs text-muted-foreground">Tests: {day.assessments}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded"></div>
                          <div className="text-xs text-muted-foreground">Games: {day.games}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <div className="text-xs text-muted-foreground">Study: {day.study}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        Total: {day.assessments + day.games + day.study}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Goals</CardTitle>
                <CardDescription>Track your progress towards monthly targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyGoals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{goal.title}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{goal.category}</Badge>
                          <span className="text-sm text-muted-foreground">{goal.deadline}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Progress value={goal.progress} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{goal.current}/{goal.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Development</CardTitle>
                <CardDescription>See how your skills are improving over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillProgress.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.skill}</span>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(skill.trend)}
                          <span className="text-sm font-medium text-green-600">{skill.improvement}</span>
                          <span className="text-sm text-muted-foreground">{skill.level}%</span>
                        </div>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800">Focus Area: Time Management</h4>
                    <p className="text-sm text-blue-600 mt-1">
                      Your time management skill shows the most room for improvement. 
                      Try the Study Smart techniques to boost this area.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800">Strength: Logical Reasoning</h4>
                    <p className="text-sm text-green-600 mt-1">
                      Great job! Your logical reasoning skills are well-developed. 
                      Consider exploring STEM career fields that use these strengths.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id}
                  className={`${achievement.earned ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : ''}`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${
                        achievement.earned ? 'bg-yellow-100' : 'bg-gray-100'
                      } flex items-center justify-center`}>
                        <achievement.icon className={`w-6 h-6 ${
                          achievement.earned ? achievement.color : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {achievement.title}
                          {achievement.earned && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </CardTitle>
                        <CardDescription>{achievement.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {achievement.earned ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Earned {achievement.earnedDate}</span>
                          <Badge variant="secondary">+{achievement.xp} XP</Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          Reward: +{achievement.xp} XP when completed
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Learning Roadmap</CardTitle>
                <CardDescription>Follow the structured path to mastery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {learningPath.map((phase, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full ${getStatusColor(phase.status)} flex items-center justify-center`}>
                          {phase.status === "completed" && <CheckCircle className="w-5 h-5 text-white" />}
                          {phase.status === "in-progress" && <Clock className="w-5 h-5 text-white" />}
                          {phase.status === "locked" && <span className="text-white text-sm font-bold">{index + 1}</span>}
                        </div>
                        {index < learningPath.length - 1 && (
                          <div className="w-px h-16 bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{phase.phase}</h3>
                          <Badge variant={
                            phase.status === "completed" ? "default" :
                            phase.status === "in-progress" ? "secondary" : "outline"
                          }>
                            {phase.status === "completed" ? "Completed" :
                             phase.status === "in-progress" ? "In Progress" : "Locked"}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-2">
                          {phase.activities.join(" • ")}
                        </div>
                        
                        {phase.status === "completed" && (
                          <div className="text-xs text-green-600">
                            Completed {phase.completedDate}
                          </div>
                        )}
                        
                        {phase.status === "in-progress" && (
                          <div className="mt-2">
                            <Progress value={phase.progress} className="h-2" />
                            <div className="text-xs text-muted-foreground mt-1">
                              {phase.progress}% complete
                            </div>
                          </div>
                        )}
                        
                        {phase.status === "locked" && (
                          <div className="text-xs text-muted-foreground">
                            🔒 {phase.unlockRequirement}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProgressTracking;
