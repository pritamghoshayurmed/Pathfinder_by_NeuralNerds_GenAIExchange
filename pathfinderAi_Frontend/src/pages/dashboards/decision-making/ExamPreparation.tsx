import { useState } from "react";
import { BookOpen, Calendar, Clock, Target, TrendingUp, Award, Brain, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";

const ExamPreparation = () => {
  const [selectedExam, setSelectedExam] = useState("jee-main");
  const navigate = useNavigate(); // Add this line

  const exams = [
    {
      id: "jee-main",
      name: "JEE Main",
      fullName: "Joint Entrance Examination Main",
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      progress: 78,
      nextTest: "Mock Test 15",
      rank: "All India: 2,450",
      subjects: [
        { name: "Mathematics", progress: 85, score: 92, topics: 45, completed: 38 },
        { name: "Physics", progress: 72, score: 78, topics: 40, completed: 29 },
        { name: "Chemistry", progress: 80, score: 88, topics: 35, completed: 28 }
      ],
      upcomingTests: [
        { name: "Full Syllabus Test 5", date: "Aug 26", time: "3:00 PM", duration: "3 hrs" },
        { name: "Mathematics Chapter Test", date: "Aug 28", time: "4:00 PM", duration: "1.5 hrs" }
      ]
    },
    {
      id: "neet",
      name: "NEET",
      fullName: "National Eligibility cum Entrance Test",
      icon: Brain,
      color: "from-green-500 to-teal-500",
      progress: 65,
      nextTest: "Biology Quiz",
      rank: "State: 890",
      subjects: [
        { name: "Biology", progress: 70, score: 85, topics: 50, completed: 35 },
        { name: "Chemistry", progress: 65, score: 75, topics: 35, completed: 23 },
        { name: "Physics", progress: 60, score: 70, topics: 40, completed: 24 }
      ],
      upcomingTests: [
        { name: "Biology Full Test", date: "Aug 27", time: "2:00 PM", duration: "3 hrs" },
        { name: "Organic Chemistry Test", date: "Aug 29", time: "5:00 PM", duration: "2 hrs" }
      ]
    },
    {
      id: "cuet",
      name: "CUET",
      fullName: "Common University Entrance Test",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
      progress: 82,
      nextTest: "English Test",
      rank: "Zone: 156",
      subjects: [
        { name: "English", progress: 90, score: 95, topics: 25, completed: 22 },
        { name: "General Test", progress: 75, score: 80, topics: 30, completed: 22 },
        { name: "Domain Subject", progress: 80, score: 88, topics: 35, completed: 28 }
      ],
      upcomingTests: [
        { name: "English Comprehension", date: "Aug 25", time: "10:00 AM", duration: "2 hrs" },
        { name: "General Knowledge Test", date: "Aug 30", time: "3:00 PM", duration: "1 hr" }
      ]
    }
  ];

  const studyPlan = [
    { day: "Monday", subjects: ["Mathematics - Calculus", "Physics - Mechanics"], hours: 6, completed: true },
    { day: "Tuesday", subjects: ["Chemistry - Organic", "Mathematics - Algebra"], hours: 5, completed: true },
    { day: "Wednesday", subjects: ["Physics - Waves", "Chemistry - Inorganic"], hours: 6, completed: false },
    { day: "Thursday", subjects: ["Mathematics - Coordinate Geometry", "Physics - Optics"], hours: 5, completed: false }
  ];

  const selectedExamData = exams.find(exam => exam.id === selectedExam);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Exam Preparation Hub
          </h1>
          <p className="text-muted-foreground">
            Comprehensive preparation for JEE, NEET, CUET with personalized study plans and analytics
          </p>
        </div>

        {/* Exam Selection */}
        <Tabs value={selectedExam} onValueChange={setSelectedExam} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {exams.map((exam) => (
              <TabsTrigger key={exam.id} value={exam.id} className="flex items-center gap-2">
                <exam.icon className="h-4 w-4" />
                {exam.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {exams.map((exam) => (
            <TabsContent key={exam.id} value={exam.id} className="space-y-6">
              {/* Exam Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <exam.icon className="h-5 w-5" />
                      Overall Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion</span>
                        <span>{exam.progress}%</span>
                      </div>
                      <Progress value={exam.progress} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        Current Rank: {exam.rank}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Next Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{exam.nextTest}</p>
                    <p className="text-sm text-muted-foreground">
                      {exam.upcomingTests[0]?.date} at {exam.upcomingTests[0]?.time}
                    </p>
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => navigate("/dashboard/decision-making/mock-tests")}
                    >
                      Take Test
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Score:</span>
                        <Badge variant="secondary">
                          {Math.round(exam.subjects.reduce((acc, sub) => acc + sub.score, 0) / exam.subjects.length)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Trend:</span>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Subject-wise Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Subject-wise Progress</CardTitle>
                  <CardDescription>Track your preparation across all subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {exam.subjects.map((subject, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{subject.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{subject.completed}/{subject.topics} topics</Badge>
                            <Badge>{subject.score}%</Badge>
                          </div>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                        <p className="text-sm text-muted-foreground">
                          {subject.progress}% complete • Last score: {subject.score}%
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Tests */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tests</CardTitle>
                  <CardDescription>Schedule and manage your practice tests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {exam.upcomingTests.map((test, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{test.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {test.date} • {test.time} • {test.duration}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate("/dashboard/decision-making/mock-tests")}
                        >
                          Start Test
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Study Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Study Plan</CardTitle>
            <CardDescription>Your personalized study schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studyPlan.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {day.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium">{day.day}</p>
                      <p className="text-sm text-muted-foreground">
                        {day.subjects.join(" • ")}
                      </p>
                    </div>
                  </div>
                  <Badge variant={day.completed ? "default" : "outline"}>
                    {day.hours} hours
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ExamPreparation;
