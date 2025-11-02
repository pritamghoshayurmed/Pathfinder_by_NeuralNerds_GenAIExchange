import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { BookOpen, Clock, Trophy, TrendingUp, Play, BarChart3, Target, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";

const MockTests = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [selectedExam, setSelectedExam] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const mockTests = [
    {
      id: 1,
      title: "JEE Main ",
      exam: "JEE Main",
      subject: "Physics, Chemistry, Mathematics",
      duration: "180 minutes",
      questions: 75,
      difficulty: "Medium",
      attempted: 1250,
      avgScore: 68,
      maxScore: 100,
      topics: ["Mechanics", "Electricity", "Optics", "Modern Physics"],
      type: "Full Syllabus",
      date: "Dec 25, 2024",
      route: "/jeemain"
    },
    {
      id: 2,
      title: "JEE Advanced ",
      exam: "JEE Advanced",
      subject: "Physics, Chemistry, Mathematics",
      duration: "180 minutes",
      questions: 54,
      difficulty: "Hard",
      attempted: 675,
      avgScore: 45,
      maxScore: 100,
      topics: ["Advanced Calculus", "Quantum Physics", "Organic Mechanisms", "Complex Analysis"],
      type: "Paper 1",
      date: "Dec 26, 2024",
      route: "/jeeadvanced"
    },
    {
      id: 3,
      title: "NEET ",
      exam: "NEET",
      subject: "Physics, Chemistry, Biology",
      duration: "200 minutes",
      questions: 180,
      difficulty: "Hard",
      attempted: 980,
      avgScore: 72,
      maxScore: 100,
      topics: ["Human Physiology", "Plant Physiology", "Genetics", "Ecology"],
      type: "Full Syllabus",
      date: "Dec 27, 2024",
      route: "/neet"
    },
    {
      id: 4,
      title: "CUET ",
      exam: "CUET",
      subject: "General Test",
      duration: "165 minutes",
      questions: 200,
      difficulty: "Medium",
      attempted: 1100,
      avgScore: 78,
      maxScore: 100,
      topics: ["General Knowledge", "Current Affairs", "Logical Reasoning", "Quantitative Aptitude"],
      type: "Full Syllabus",
      date: "Dec 28, 2024",
      route: "/cuet" // Add route for future implementation
    },
    {
      id: 5,
      title: "CLAT ",
      exam: "CLAT",
      subject: "Legal Reasoning",
      duration: "120 minutes",
      questions: 150,
      difficulty: "Medium",
      attempted: 450,
      avgScore: 65,
      maxScore: 100,
      topics: ["Legal Reasoning", "Logical Reasoning", "Reading Comprehension", "Current Affairs"],
      type: "Full Syllabus",
      date: "Dec 29, 2024",
      route: "/clat" // Add route for future implementation
    }
  ];

  const performanceStats = [
    {
      exam: "JEE Main",
      attempted: 15,
      avgScore: 72,
      bestScore: 94,
      rank: "AIR 2,450",
      improvement: "+12%",
      weakAreas: ["Organic Chemistry", "Rotational Motion"]
    },
    {
      exam: "NEET",
      attempted: 12,
      avgScore: 68,
      bestScore: 89,
      rank: "AIR 5,670",
      improvement: "+8%",
      weakAreas: ["Plant Physiology", "Atomic Structure"]
    },
    {
      exam: "CUET",
      attempted: 8,
      avgScore: 81,
      bestScore: 96,
      rank: "Zone 156",
      improvement: "+15%",
      weakAreas: ["Current Affairs", "Data Interpretation"]
    }
  ];

  const recentResults = [
    {
      test: "JEE Main Mock Test 14",
      date: "Dec 22, 2024",
      score: 89,
      rank: 1245,
      subjects: {
        Physics: 32,
        Chemistry: 28,
        Mathematics: 29
      },
      timeSpent: "2h 45m",
      accuracy: 74
    },
    {
      test: "NEET Practice Test 8",
      date: "Dec 20, 2024",
      score: 76,
      rank: 3420,
      subjects: {
        Physics: 42,
        Chemistry: 38,
        Biology: 44
      },
      timeSpent: "3h 10m",
      accuracy: 68
    },
    {
      test: "CUET Domain Test 5",
      date: "Dec 18, 2024",
      score: 93,
      rank: 245,
      subjects: {
        English: 48,
        Domain: 45,
        General: 47
      },
      timeSpent: "2h 30m",
      accuracy: 82
    }
  ];

  const upcomingTests = [
    {
      title: "JEE Main Full Test 16",
      date: "Dec 30, 2024",
      time: "9:00 AM",
      duration: "3 hours",
      registered: 2450
    },
    {
      title: "NEET All India Test 9",
      date: "Jan 2, 2025",
      time: "2:00 PM",
      duration: "3h 20m",
      registered: 1890
    },
    {
      title: "CUET Practice Series 6",
      date: "Jan 5, 2025",
      time: "10:00 AM",
      duration: "2h 45m",
      registered: 1250
    }
  ];

  const filteredTests = mockTests.filter(test => {
    const matchesExam = selectedExam === "all" || test.exam === selectedExam;
    const matchesDifficulty = selectedDifficulty === "all" || test.difficulty === selectedDifficulty;
    return matchesExam && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500";
      case "Medium": return "bg-yellow-500";
      case "Hard": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Function to handle Start Test button clicks
  const handleStartTest = (test: any) => {
    if (test.route) {
      navigate(test.route);
    } else {
      // For tests that don't have implementation yet, show an alert or navigate to a coming soon page
      alert(`${test.exam} test is coming soon!`);
    }
  };

  // Function to get button text and availability status
  const getTestButtonInfo = (test: any) => {
    const availableTests = ['/jeemain', '/neet', '/jeeadvanced', '/cuet', '/clat']; // Add CLAT
    const isAvailable = availableTests.includes(test.route);
    
    return {
      isAvailable,
      buttonText: isAvailable ? 'Start Test' : 'Coming Soon',
      buttonVariant: isAvailable ? 'default' : 'secondary'
    };
  };

  return (
    <DashboardLayout 
      title="Mock Tests Hub" 
      description="Practice with comprehensive mock tests and track your performance"
    >
      <div className="p-6 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">35</div>
                  <div className="text-sm text-muted-foreground">Tests Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">AIR 2,450</div>
                  <div className="text-sm text-muted-foreground">Best Rank</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">+12%</div>
                  <div className="text-sm text-muted-foreground">Avg Improvement</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">98h</div>
                  <div className="text-sm text-muted-foreground">Total Practice</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exams</SelectItem>
              <SelectItem value="JEE Main">JEE Main</SelectItem>
              <SelectItem value="JEE Advanced">JEE Advanced</SelectItem>
              <SelectItem value="NEET">NEET</SelectItem>
              <SelectItem value="CUET">CUET</SelectItem>
              <SelectItem value="CLAT">CLAT</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Difficulty level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="available">Available Tests</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="results">Recent Results</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            <div className="grid gap-4">
              {filteredTests.map((test) => {
                const buttonInfo = getTestButtonInfo(test);
                
                return (
                  <Card key={test.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{test.title}</h3>
                            <Badge 
                              className={`${getDifficultyColor(test.difficulty)} text-white`}
                            >
                              {test.difficulty}
                            </Badge>
                            <Badge variant="outline">{test.type}</Badge>
                            {buttonInfo.isAvailable && (
                              <Badge variant="default" className="bg-green-500">
                                Available
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Exam</div>
                              <div className="font-semibold">{test.exam}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Duration</div>
                              <div className="font-semibold">{test.duration}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Questions</div>
                              <div className="font-semibold">{test.questions}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Attempted by</div>
                              <div className="font-semibold">{test.attempted} students</div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="text-sm font-medium mb-2">Topics Covered</div>
                            <div className="flex flex-wrap gap-1">
                              {test.topics.map((topic, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">{topic}</Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mb-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Average Score</div>
                              <div className="flex items-center gap-2">
                                <Progress value={test.avgScore} className="w-20" />
                                <span className="font-semibold">{test.avgScore}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {/* Dynamic Start Test Button based on exam type */}
                          <Button 
                            className="w-32"
                            variant={buttonInfo.buttonVariant as any}
                            onClick={() => handleStartTest(test)}
                            disabled={!buttonInfo.isAvailable}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {buttonInfo.buttonText}
                          </Button>
                          <Button variant="outline" className="w-32">
                            <FileText className="w-4 h-4 mr-2" />
                            View Syllabus
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6">
              {performanceStats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{stat.exam} Performance</span>
                      <Badge variant="secondary">{stat.improvement}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Tests Taken</div>
                        <div className="text-2xl font-bold">{stat.attempted}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Average Score</div>
                        <div className={`text-2xl font-bold ${getScoreColor(stat.avgScore)}`}>
                          {stat.avgScore}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Best Score</div>
                        <div className={`text-2xl font-bold ${getScoreColor(stat.bestScore)}`}>
                          {stat.bestScore}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Best Rank</div>
                        <div className="text-2xl font-bold text-blue-600">{stat.rank}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Improvement</div>
                        <div className="text-2xl font-bold text-green-600">{stat.improvement}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Areas to Focus</div>
                      <div className="flex flex-wrap gap-1">
                        {stat.weakAreas.map((area, idx) => (
                          <Badge key={idx} variant="destructive" className="text-xs">{area}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="grid gap-4">
              {recentResults.map((result, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{result.test}</h3>
                        <p className="text-sm text-muted-foreground">{result.date}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                          {result.score}%
                        </div>
                        <div className="text-sm text-muted-foreground">Rank: {result.rank}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Time Spent</div>
                        <div className="font-semibold">{result.timeSpent}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Accuracy</div>
                        <div className="font-semibold">{result.accuracy}%</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Subject-wise Scores</div>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(result.subjects).map(([subject, score], idx) => (
                          <div key={idx} className="text-center p-2 bg-muted/50 rounded">
                            <div className="text-sm text-muted-foreground">{subject}</div>
                            <div className={`font-bold ${getScoreColor(score as number)}`}>
                              {score}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Detailed Analysis
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="grid gap-4">
              {upcomingTests.map((test, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{test.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{test.date} at {test.time}</span>
                          <span>Duration: {test.duration}</span>
                          <span>{test.registered} registered</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">Set Reminder</Button>
                        <Button>Register</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>JEE Main</span>
                        <span>72%</span>
                      </div>
                      <Progress value={72} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>NEET</span>
                        <span>68%</span>
                      </div>
                      <Progress value={68} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CUET</span>
                        <span>81%</span>
                      </div>
                      <Progress value={81} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Time Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Physics</span>
                      <span className="text-sm font-semibold">35h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Mathematics</span>
                      <span className="text-sm font-semibold">32h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Chemistry</span>
                      <span className="text-sm font-semibold">31h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Accuracy Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">This Week</span>
                      <span className="text-sm font-semibold text-green-600">+5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">This Month</span>
                      <span className="text-sm font-semibold text-green-600">+12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Overall</span>
                      <span className="text-sm font-semibold">74%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MockTests;
