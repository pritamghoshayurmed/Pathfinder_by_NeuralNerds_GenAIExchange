import { useState } from "react";
import { BookOpen, Target, Brain, Clock, Award, CheckCircle, Play, Code, Database, Palette, BarChart3, Monitor, Smartphone, Shield, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";

const SkillTraining = () => {
  const [selectedTrack, setSelectedTrack] = useState<string>("frontend");

  const trainingTracks = [
    {
      id: "frontend",
      title: "Frontend Development",
      icon: Monitor,
      description: "Master modern frontend technologies and frameworks",
      duration: "12-16 weeks",
      modules: 8,
      projects: 12,
      certificate: "Professional Certificate",
      difficulty: "Beginner to Advanced",
      color: "from-blue-500 to-cyan-500",
      skills: ["HTML/CSS", "JavaScript", "React", "TypeScript", "Next.js", "Tailwind CSS"],
      learners: "25K+",
      rating: 4.8,
      price: "₹12,999"
    },
    {
      id: "backend",
      title: "Backend Development",
      icon: Database,
      description: "Build scalable server-side applications and APIs",
      duration: "14-18 weeks",
      modules: 10,
      projects: 15,
      certificate: "Professional Certificate",
      difficulty: "Intermediate to Advanced",
      color: "from-green-500 to-emerald-500",
      skills: ["Node.js", "Python", "Databases", "APIs", "Cloud", "DevOps"],
      learners: "18K+",
      rating: 4.7,
      price: "₹15,999"
    },
    {
      id: "data-science",
      title: "Data Science & AI",
      icon: BarChart3,
      description: "Become an AI/ML expert with hands-on experience",
      duration: "16-20 weeks",
      modules: 12,
      projects: 18,
      certificate: "Professional Certificate",
      difficulty: "Intermediate to Advanced",
      color: "from-purple-500 to-pink-500",
      skills: ["Python", "Machine Learning", "Deep Learning", "Statistics", "TensorFlow", "MLOps"],
      learners: "22K+",
      rating: 4.9,
      price: "₹18,999"
    },
    {
      id: "mobile",
      title: "Mobile Development",
      icon: Smartphone,
      description: "Create cross-platform mobile applications",
      duration: "10-14 weeks",
      modules: 8,
      projects: 10,
      certificate: "Professional Certificate",
      difficulty: "Intermediate",
      color: "from-orange-500 to-red-500",
      skills: ["React Native", "Flutter", "iOS", "Android", "Firebase", "App Store"],
      learners: "15K+",
      rating: 4.6,
      price: "₹13,999"
    },
    {
      id: "design",
      title: "UI/UX Design",
      icon: Palette,
      description: "Design beautiful and user-friendly interfaces",
      duration: "8-12 weeks",
      modules: 6,
      projects: 8,
      certificate: "Professional Certificate",
      difficulty: "Beginner to Advanced",
      color: "from-pink-500 to-rose-500",
      skills: ["Design Thinking", "Figma", "Prototyping", "User Research", "Design Systems"],
      learners: "20K+",
      rating: 4.5,
      price: "₹10,999"
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity",
      icon: Shield,
      description: "Protect systems and data from cyber threats",
      duration: "18-22 weeks",
      modules: 14,
      projects: 20,
      certificate: "Professional Certificate",
      difficulty: "Advanced",
      color: "from-red-500 to-orange-500",
      skills: ["Ethical Hacking", "Network Security", "Cloud Security", "Forensics", "Compliance"],
      learners: "12K+",
      rating: 4.8,
      price: "₹22,999"
    }
  ];

  const detailedCurriculum = {
    frontend: [
      {
        module: "Web Fundamentals",
        week: "Week 1-2",
        topics: ["HTML5 Semantic Elements", "CSS3 & Flexbox/Grid", "Responsive Design", "Web Accessibility"],
        projects: ["Personal Portfolio", "Responsive Landing Page"],
        aiFeatures: ["Code review", "Real-time debugging", "Best practices suggestions"],
        status: "completed"
      },
      {
        module: "JavaScript Mastery",
        week: "Week 3-5",
        topics: ["ES6+ Features", "DOM Manipulation", "Async Programming", "Error Handling"],
        projects: ["Interactive Calculator", "Weather App", "To-Do Application"],
        aiFeatures: ["Algorithm explanation", "Code optimization", "Performance analysis"],
        status: "in-progress"
      },
      {
        module: "React Fundamentals",
        week: "Week 6-8",
        topics: ["Components & JSX", "State & Props", "Event Handling", "React Hooks"],
        projects: ["Task Manager", "Shopping Cart", "Blog Application"],
        aiFeatures: ["Component suggestions", "State management guidance", "Refactoring assistance"],
        status: "locked"
      },
      {
        module: "Advanced React",
        week: "Week 9-11",
        topics: ["Context API", "Custom Hooks", "Performance Optimization", "Testing"],
        projects: ["Social Media App", "E-commerce Platform"],
        aiFeatures: ["Advanced patterns", "Testing automation", "Performance monitoring"],
        status: "locked"
      },
      {
        module: "TypeScript & Next.js",
        week: "Week 12-14",
        topics: ["TypeScript Fundamentals", "Next.js Framework", "SSR/SSG", "API Routes"],
        projects: ["Full-Stack Blog", "Dashboard Application"],
        aiFeatures: ["Type inference", "Framework optimization", "SEO suggestions"],
        status: "locked"
      },
      {
        module: "Deployment & DevOps",
        week: "Week 15-16",
        topics: ["Git & GitHub", "CI/CD Pipelines", "Docker Basics", "Cloud Deployment"],
        projects: ["Portfolio Deployment", "Automated Testing Pipeline"],
        aiFeatures: ["Deployment automation", "Performance monitoring", "Security scanning"],
        status: "locked"
      }
    ]
  };

  const aiPoweredFeatures = [
    {
      title: "Intelligent Code Review",
      description: "AI analyzes your code and provides instant feedback on best practices, performance, and potential bugs",
      icon: CheckCircle,
      active: true
    },
    {
      title: "Personalized Learning Path",
      description: "AI adapts the curriculum based on your learning speed, strengths, and career goals",
      icon: Target,
      active: true
    },
    {
      title: "Smart Project Recommendations",
      description: "AI suggests projects that match your skill level and help you reach your learning objectives",
      icon: Brain,
      active: true
    },
    {
      title: "Real-time Debugging Assistant",
      description: "AI-powered debugging that helps you understand and fix errors as you code",
      icon: Code,
      active: true
    },
    {
      title: "Performance Analytics",
      description: "Track your learning progress with AI-generated insights and performance predictions",
      icon: BarChart3,
      active: false
    },
    {
      title: "Career Guidance",
      description: "AI provides personalized career advice based on industry trends and your skill development",
      icon: Award,
      active: false
    }
  ];

  const skillAssessments = [
    {
      skill: "JavaScript",
      level: "Intermediate",
      score: 75,
      lastTaken: "2 days ago",
      recommendations: ["Focus on async/await", "Practice ES6 modules", "Learn about closures"]
    },
    {
      skill: "React",
      level: "Beginner",
      score: 45,
      lastTaken: "1 week ago",
      recommendations: ["Complete hooks tutorial", "Practice component composition", "Learn state management"]
    },
    {
      skill: "CSS",
      level: "Advanced",
      score: 88,
      lastTaken: "3 days ago",
      recommendations: ["Explore CSS Grid", "Advanced animations", "CSS architecture patterns"]
    }
  ];

  const certificationPaths = [
    {
      title: "Google Cloud Professional",
      provider: "Google",
      duration: "3-6 months",
      difficulty: "Advanced",
      skills: ["Cloud Architecture", "GCP Services", "DevOps"],
      price: "₹8,999",
      examFee: "₹15,000",
      validityPeriod: "2 years"
    },
    {
      title: "AWS Certified Developer",
      provider: "Amazon",
      duration: "4-6 months",
      difficulty: "Intermediate",
      skills: ["AWS Services", "Lambda", "DynamoDB"],
      price: "₹9,999",
      examFee: "₹12,000",
      validityPeriod: "3 years"
    },
    {
      title: "Microsoft Azure Fundamentals",
      provider: "Microsoft",
      duration: "2-3 months",
      difficulty: "Beginner",
      skills: ["Azure Services", "Cloud Concepts", "Security"],
      price: "₹6,999",
      examFee: "₹8,000",
      validityPeriod: "2 years"
    }
  ];

  const practiceEnvironments = [
    {
      title: "Coding Playground",
      description: "Interactive coding environment with AI assistance",
      languages: ["JavaScript", "Python", "Java", "C++"],
      features: ["Real-time collaboration", "AI code completion", "Instant feedback"],
      access: "Free"
    },
    {
      title: "Project Sandbox",
      description: "Full development environment for building projects",
      technologies: ["React", "Node.js", "Docker", "MongoDB"],
      features: ["Version control", "Deployment tools", "Team collaboration"],
      access: "Premium"
    },
    {
      title: "Interview Prep Lab",
      description: "Practice coding interviews with AI interviewer",
      focus: ["Data Structures", "Algorithms", "System Design"],
      features: ["AI feedback", "Performance analytics", "Mock interviews"],
      access: "Premium"
    }
  ];

  const getModuleStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "locked": return "bg-gray-300";
      default: return "bg-gray-300";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-600">Skill Training</h1>
            <p className="text-gray-600 mt-2">AI-powered comprehensive training programs for in-demand skills</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-purple-300 text-purple-700">
              <Brain className="w-4 h-4 mr-1" />
              AI Enhanced
            </Badge>
            <Button>
              <Play className="w-4 h-4 mr-2" />
              Continue Learning
            </Button>
          </div>
        </div>

        {/* AI Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              AI-Powered Learning Features
            </CardTitle>
            <CardDescription>Advanced AI technology to accelerate your skill development</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiPoweredFeatures.map((feature, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-purple-300 to-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <feature.icon className="w-5 h-5 text-purple-600" />
                    <Badge variant={feature.active ? "default" : "secondary"} className="text-xs">
                      {feature.active ? "Active" : "Coming Soon"}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1v text-gray-800">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Training Tracks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingTracks.map((track) => (
            <Card key={track.id} className={`cursor-pointer transition-all duration-200 hover:scale-105 ${selectedTrack === track.id ? 'ring-2 ring-purple-500' : ''}`}
                  onClick={() => setSelectedTrack(track.id)}>
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${track.color} flex items-center justify-center mb-3`}>
                  <track.icon className="w-6 h-6 text-purple-50" />
                </div>
                <CardTitle className="text-lg">{track.title}</CardTitle>
                <CardDescription className="text-sm">{track.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-medium">{track.duration}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Projects:</span>
                    <p className="font-medium">{track.projects}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Modules:</span>
                    <p className="font-medium">{track.modules}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Learners:</span>
                    <p className="font-medium">{track.learners}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline">{track.difficulty}</Badge>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{track.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {track.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
                  ))}
                  {track.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">+{track.skills.length - 3}</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-lg font-bold text-green-600">{track.price}</span>
                  <Button size="sm">
                    {selectedTrack === track.id ? "Selected" : "Select"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Curriculum */}
        {selectedTrack === "frontend" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-blue-600" />
                Frontend Development - Detailed Curriculum
              </CardTitle>
              <CardDescription>Comprehensive curriculum with AI-powered assistance and real-world projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="curriculum" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="assessments">Assessments</TabsTrigger>
                  <TabsTrigger value="certifications">Certifications</TabsTrigger>
                  <TabsTrigger value="practice">Practice</TabsTrigger>
                </TabsList>

                <TabsContent value="curriculum" className="mt-6">
                  <div className="space-y-4">
                    {detailedCurriculum.frontend.map((module, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-gray-600 to-blue-400">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getModuleStatusColor(module.status)}`}>
                              {module.status === 'completed' ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <span className="text-sm font-bold">{index + 1}</span>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold">{module.module}</h3>
                              <p className="text-sm text-gray-600">{module.week}</p>
                            </div>
                          </div>
                          <Badge variant={module.status === 'completed' ? 'default' : module.status === 'in-progress' ? 'secondary' : 'outline'}>
                            {module.status === 'completed' ? 'Completed' : module.status === 'in-progress' ? 'In Progress' : 'Locked'}
                          </Badge>
                        </div>
                        
                        <div className="ml-11 space-y-3">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Topics Covered:</h4>
                            <div className="flex flex-wrap gap-1">
                              {module.topics.map((topic, topicIndex) => (
                                <Badge key={topicIndex} variant="outline" className="text-xs">{topic}</Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Projects:</h4>
                            <div className="flex flex-wrap gap-1">
                              {module.projects.map((project, projectIndex) => (
                                <Badge key={projectIndex} variant="secondary" className="text-xs bg-green-100 text-green-700">{project}</Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Brain className="w-4 h-4 text-purple-400" />
                              AI Features:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {module.aiFeatures.map((feature, featureIndex) => (
                                <Badge key={featureIndex} variant="outline" className="text-xs bg-purple-600 border-purple-200">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {module.status !== 'locked' && (
                            <Button size="sm" variant={module.status === 'completed' ? 'outline' : 'default'}>
                              {module.status === 'completed' ? 'Review' : 'Continue'}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="assessments" className="mt-6">
                  <div className="space-y-4">
                    {skillAssessments.map((assessment, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{assessment.skill}</h3>
                              <p className="text-sm text-gray-600">Last taken: {assessment.lastTaken}</p>
                            </div>
                            <div className="text-right">
                              <Badge className="mb-2">{assessment.level}</Badge>
                              <p className="text-2xl font-bold text-blue-600">{assessment.score}%</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span>Skill Level</span>
                              <span>{assessment.score}%</span>
                            </div>
                            <Progress value={assessment.score} className="h-2" />
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">AI Recommendations:</h4>
                            <ul className="space-y-1">
                              {assessment.recommendations.map((rec, recIndex) => (
                                <li key={recIndex} className="flex items-center gap-2 text-sm">
                                  <Target className="w-3 h-3 text-blue-500" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-4">
                            <Button size="sm">Retake Assessment</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="certifications" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificationPaths.map((cert, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{cert.title}</CardTitle>
                          <CardDescription>by {cert.provider}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-medium">{cert.duration}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Difficulty:</span>
                              <Badge variant="outline" className="text-xs">{cert.difficulty}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Validity:</span>
                              <span className="font-medium">{cert.validityPeriod}</span>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Key Skills:</h4>
                            <div className="flex flex-wrap gap-1">
                              {cert.skills.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="secondary" className="text-xs">{skill}</Badge>
                              ))}
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">Prep Course:</span>
                              <span className="font-bold text-green-600">{cert.price}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-sm text-gray-600">Exam Fee:</span>
                              <span className="font-medium">{cert.examFee}</span>
                            </div>
                            <Button className="w-full">Start Preparation</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="practice" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {practiceEnvironments.map((env, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{env.title}</CardTitle>
                          <CardDescription>{env.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">
                              {env.languages ? "Languages:" : env.technologies ? "Technologies:" : "Focus Areas:"}
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {(env.languages || env.technologies || env.focus || []).map((item, itemIndex) => (
                                <Badge key={itemIndex} variant="outline" className="text-xs">{item}</Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Features:</h4>
                            <ul className="space-y-1">
                              {env.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <Badge variant={env.access === "Free" ? "default" : "secondary"}>
                              {env.access}
                            </Badge>
                            <Button size="sm">
                              {env.access === "Free" ? "Try Now" : "Upgrade"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SkillTraining;
