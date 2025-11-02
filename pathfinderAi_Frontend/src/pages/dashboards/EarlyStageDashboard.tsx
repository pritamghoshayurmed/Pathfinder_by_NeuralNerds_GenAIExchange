import { BookOpen, Target, Lightbulb, GamepadIcon, Heart, TrendingUp, Brain, Award, Calendar, Users, BarChart3, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";

const EarlyStageDashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Aptitude Assessment",
      description: "Discover your natural strengths and learning style through interactive assessments",
      icon: Brain,
      color: "from-blue-500/20 to-purple-500/20",
      action: "Take Assessment",
      progress: 75,
      status: "In Progress",
      path: "/dashboard/early-stage/aptitude"
    },
    {
      title: "Career Explorer",
      description: "Interactive journey through different career fields with real-world examples",
      icon: BookOpen,
      color: "from-green-500/20 to-teal-500/20",
      action: "Start Exploring",
      progress: 40,
      status: "Started",
      path: "/dashboard/early-stage/careers"
    },
    {
      title: "Skill Building Games",
      description: "Fun coding, design, and problem-solving games that build real skills",
      icon: GamepadIcon,
      color: "from-orange-500/20 to-red-500/20",
      action: "Play Now",
      progress: 90,
      status: "Expert",
      path: "/dashboard/early-stage/games"
    },
    {
      title: "Study Smart Program",
      description: "Effective study techniques, time management, and stress-free learning methods",
      icon: Target,
      color: "from-pink-500/20 to-purple-500/20",
      action: "Learn Techniques",
      progress: 25,
      status: "New",
      path: "/dashboard/early-stage/study"
    }
  ];

  const upcomingEvents = [
    {
      title: "Career Discovery Workshop",
      time: "Today, 4:00 PM",
      type: "Workshop",
      color: "bg-blue-500"
    },
    {
      title: "Aptitude Test - Mathematics",
      time: "Tomorrow, 10:00 AM",
      type: "Assessment",
      color: "bg-green-500"
    },
    {
      title: "Peer Study Group",
      time: "Friday, 3:00 PM",
      type: "Social",
      color: "bg-purple-500"
    }
  ];

  const achievements = [
    { title: "First Assessment Complete", icon: Award, earned: true },
    { title: "Explorer Badge", icon: BookOpen, earned: true },
    { title: "Consistency Champion", icon: Target, earned: false },
    { title: "Skill Master", icon: Brain, earned: false }
  ];

  return (
    <DashboardLayout 
      title="Early Stage Explorer" 
      description="Discover your potential through exploration and fun learning"
    >
      <div className="p-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome back, Explorer! 🌟</h2>
              <p className="text-muted-foreground">Ready to discover something amazing about yourself today?</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Assessments Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">8</div>
              <div className="text-sm text-muted-foreground">Career Fields Explored</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">Level 3</div>
              <div className="text-sm text-muted-foreground">Explorer Level</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Activities */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Your Learning Journey</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card key={index} className="feature-card group hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <Badge variant={feature.status === "Expert" ? "default" : feature.status === "In Progress" ? "secondary" : "outline"}>
                            {feature.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <CardDescription className="text-muted-foreground text-sm">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{feature.progress}%</span>
                          </div>
                          <Progress value={feature.progress} className="h-2" />
                          <Button 
                            className="w-full btn-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            onClick={() => navigate(feature.path)}
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            {feature.action}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{event.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => {
                    const IconComponent = achievement.icon;
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          achievement.earned 
                            ? "bg-primary/10 border-primary/30 text-primary" 
                            : "bg-muted/30 border-border/50 text-muted-foreground"
                        }`}
                      >
                        <IconComponent className={`w-6 h-6 mx-auto mb-2 ${achievement.earned ? "text-primary" : "text-muted-foreground"}`} />
                        <p className="text-xs font-medium">{achievement.title}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Study Time</span>
                    <span className="font-medium">4.5 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Activities Done</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Streak</span>
                    <span className="font-medium text-primary">7 days 🔥</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );

};

export default EarlyStageDashboard;