import { useState, useEffect } from "react";
import { Target, Clock, BookOpen, Brain, Calendar, CheckCircle, Star, Timer, Award, Play, Pause, RotateCcw, X, Upload, Zap, Trophy, TrendingUp, Mic, Volume2, BarChart3, Users, Bell, MapPin, Lightbulb, FileText, Eye, MessageSquare, Repeat, Activity, Settings, Shield, Coffee, Flame, Moon, Sun, Heart, Battery, Smile, Frown, Meh, TreePine, Sparkles, Calculator, Microscope, Download, Share2, Calendar as CalendarIcon, ChevronRight, ChevronLeft, Volume1, Camera, Filter, Layers, BarChart2, PieChart, Calendar as CalendarIconSecond, Clock4, RefreshCw, Cpu, Database, Cloud, Smartphone, Globe, VolumeX, ArrowRight, GitBranch, Network, Map, Megaphone, MessageCircle, ThumbsUp, ThumbsDown, BarChart, Target as TargetIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import DashboardLayout from "@/components/DashboardLayout";

const StudySmart = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [showPomodoroPopup, setShowPomodoroPopup] = useState(false);
  const [showActiveRecallDialog, setShowActiveRecallDialog] = useState(false);
  const [showAdvancedPomodoro, setShowAdvancedPomodoro] = useState(false);
  const [showSpacedRepetitionCenter, setShowSpacedRepetitionCenter] = useState(false);
  const [showFeynmanCenter, setShowFeynmanCenter] = useState(false);
  const [pomodoroSession, setPomodoroSession] = useState({
    timeLeft: 25 * 60, // 25 minutes in seconds
    isActive: false,
    isBreak: false,
    sessionCount: 0
  });

  const studyTechniques = [
    {
      id: "pomodoro",
      title: "Pomodoro Technique",
      description: "Break study time into focused 25-minute sessions",
      difficulty: "Beginner",
      timeRequired: "25 min sessions",
      icon: Timer,
      color: "from-red-500 to-pink-500",
      benefits: ["Better focus", "Reduced fatigue", "Time awareness", "Regular breaks"],
      steps: [
        "Set timer for 25 minutes",
        "Study without any distractions",
        "Take a 5-minute break",
        "Repeat 3-4 times, then take longer break"
      ],
      completed: true,
      rating: 4.8
    },
    {
      id: "active-recall",
      title: "Active Recall",
      description: "Test yourself frequently instead of just re-reading",
      difficulty: "Medium",
      timeRequired: "Varies",
      icon: Brain,
      color: "from-blue-500 to-purple-500",
      benefits: ["Better retention", "Identifies weak spots", "Builds confidence", "Efficient learning"],
      steps: [
        "Read the material once",
        "Close your book/notes",
        "Try to recall key points",
        "Check and fill gaps"
      ],
      completed: false,
      rating: 4.9
    },
    {
      id: "spaced-repetition",
      title: "Spaced Repetition",
      description: "Review material at increasing intervals",
      difficulty: "Medium",
      timeRequired: "15-30 min daily",
      icon: Calendar,
      color: "from-green-500 to-teal-500",
      benefits: ["Long-term retention", "Efficient review", "Prevents forgetting", "Builds mastery"],
      steps: [
        "Learn new material",
        "Review after 1 day",
        "Review after 3 days",
        "Review after 1 week, 2 weeks, 1 month"
      ],
      completed: false,
      rating: 4.7
    },
    {
      id: "feynman",
      title: "Feynman Technique",
      description: "Explain concepts in simple terms as if teaching someone",
      difficulty: "Advanced",
      timeRequired: "30-45 min",
      icon: BookOpen,
      color: "from-orange-500 to-yellow-500",
      benefits: ["Deep understanding", "Identifies gaps", "Improves communication", "Builds mastery"],
      steps: [
        "Choose a concept to learn",
        "Explain it in simple terms",
        "Identify gaps in understanding",
        "Go back and re-learn weak areas"
      ],
      completed: false,
      rating: 4.6
    }
  ];

  const timeManagementTips = [
    {
      title: "Plan Your Day",
      description: "Use a daily planner to organize tasks by priority",
      icon: Calendar,
      difficulty: "Easy"
    },
    {
      title: "Use the 2-Minute Rule",
      description: "If a task takes less than 2 minutes, do it immediately",
      icon: Clock,
      difficulty: "Easy"
    },
    {
      title: "Time Blocking",
      description: "Assign specific time slots to different subjects",
      icon: Target,
      difficulty: "Medium"
    },
    {
      title: "Eliminate Distractions",
      description: "Keep your phone away and use website blockers",
      icon: Brain,
      difficulty: "Medium"
    }
  ];

  const studyHabits = [
    { habit: "Study at the same time daily", completed: true, streak: 12 },
    { habit: "Take notes by hand", completed: true, streak: 8 },
    { habit: "Review previous day's work", completed: false, streak: 0 },
    { habit: "Use active recall techniques", completed: false, streak: 0 },
    { habit: "Take regular breaks", completed: true, streak: 15 }
  ];

  return (
    <DashboardLayout 
      title="Study Smart Program" 
      description="Master effective study techniques and time management skills"
    >
      <div className="p-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Smart Study Techniques 🧠
          </h2>
          <p className="text-muted-foreground mb-4">
            Learn scientifically-proven study methods that will make your learning more efficient and effective.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Techniques Mastered</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-secondary">25%</div>
              <div className="text-sm text-muted-foreground">Study Time Saved</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-accent">15</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="techniques" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="techniques">Study Techniques</TabsTrigger>
            <TabsTrigger value="time-management">Time Management</TabsTrigger>
            <TabsTrigger value="habits">Study Habits</TabsTrigger>
          </TabsList>

          <TabsContent value="techniques" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studyTechniques.map((technique) => (
                <Card 
                  key={technique.id}
                  className={`hover:shadow-lg transition-all cursor-pointer ${
                    selectedTechnique === technique.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedTechnique(selectedTechnique === technique.id ? null : technique.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${technique.color} flex items-center justify-center`}>
                        <technique.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex gap-2">
                        {technique.completed && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mastered
                          </Badge>
                        )}
                        <Badge variant="outline">{technique.difficulty}</Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{technique.title}</CardTitle>
                    <CardDescription>{technique.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {technique.timeRequired}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {technique.rating}
                        </span>
                      </div>
                      
                      {selectedTechnique === technique.id && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Benefits:</h4>
                            <div className="flex flex-wrap gap-1">
                              {technique.benefits.map((benefit, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">How to do it:</h4>
                            <ol className="text-sm space-y-1">
                              {technique.steps.map((step, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-primary font-medium">{index + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full" 
                        variant={technique.completed ? "outline" : "default"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (technique.id === "pomodoro") {
                            // Open Advanced Pomodoro Center directly
                            setSelectedTechnique(technique.id);
                            setShowAdvancedPomodoro(true);
                          } else if (technique.id === "active-recall") {
                            // Open Active Recall Center directly
                            setSelectedTechnique(technique.id);
                            setShowActiveRecallDialog(true);
                          } else if (technique.id === "spaced-repetition") {
                            // Open Spaced Repetition Center directly
                            setSelectedTechnique(technique.id);
                            setShowSpacedRepetitionCenter(true);
                          } else if (technique.id === "feynman") {
                            // Open Feynman Technique Center directly
                            setSelectedTechnique(technique.id);
                            setShowFeynmanCenter(true);
                          }
                        }}
                      >
                        {technique.completed && technique.id === "pomodoro" && selectedTechnique === technique.id 
                          ? "Start" 
                          : technique.completed && technique.id === "active-recall" && selectedTechnique === technique.id
                          ? "Start Learning"
                          : technique.completed 
                          ? "Practice Again" 
                          : "Start Learning"
                        }
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="time-management" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {timeManagementTips.map((tip, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <tip.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{tip.title}</CardTitle>
                        <Badge variant="outline" className="mt-1">{tip.difficulty}</Badge>
                      </div>
                    </div>
                    <CardDescription className="mt-2">{tip.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Learn This Technique</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Daily Schedule Template</CardTitle>
                <CardDescription>A suggested schedule for effective study planning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: "6:00 AM", activity: "Wake up & Morning routine", color: "bg-blue-100" },
                    { time: "7:00 AM", activity: "Breakfast & Review yesterday's notes", color: "bg-green-100" },
                    { time: "8:00 AM", activity: "School/Classes", color: "bg-purple-100" },
                    { time: "4:00 PM", activity: "Lunch & Break", color: "bg-yellow-100" },
                    { time: "5:00 PM", activity: "Homework & New topics", color: "bg-blue-100" },
                    { time: "7:00 PM", activity: "Dinner & Family time", color: "bg-green-100" },
                    { time: "8:00 PM", activity: "Practice & Problem solving", color: "bg-purple-100" },
                    { time: "9:30 PM", activity: "Review & Next day planning", color: "bg-orange-100" },
                    { time: "10:00 PM", activity: "Relax & Sleep", color: "bg-gray-100" }
                  ].map((item, index) => (
                    <div key={index} className={`p-3 rounded-lg ${item.color} flex justify-between`}>
                      <span className="font-medium">{item.time}</span>
                      <span>{item.activity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="habits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Study Habits Progress</CardTitle>
                <CardDescription>Track and build consistent study habits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studyHabits.map((habit, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          habit.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {habit.completed && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                        <span className="font-medium">{habit.habit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {habit.streak > 0 && (
                          <Badge variant="secondary">
                            <Award className="w-3 h-3 mr-1" />
                            {habit.streak} days
                          </Badge>
                        )}
                        <Button size="sm" variant="outline">
                          {habit.completed ? "Reset" : "Start"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Study Environment Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Perfect Study Space:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Good lighting (natural light preferred)</li>
                      <li>• Comfortable chair and desk height</li>
                      <li>• Minimal distractions</li>
                      <li>• All materials within reach</li>
                      <li>• Comfortable temperature</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">What to Avoid:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Studying on bed (makes you sleepy)</li>
                      <li>• Background music with lyrics</li>
                      <li>• Phone within easy reach</li>
                      <li>• Studying when hungry or tired</li>
                      <li>• Cramming before exams</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Advanced Pomodoro Learning Center */}
        <Dialog open={showAdvancedPomodoro} onOpenChange={setShowAdvancedPomodoro}>
          <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-red-500" />
                Advanced Pomodoro Center
              </DialogTitle>
              <DialogDescription>
                Master your focus with AI-powered Pomodoro techniques and productivity analytics
              </DialogDescription>
            </DialogHeader>
            <AdvancedPomodoroCenter onClose={() => setShowAdvancedPomodoro(false)} />
          </DialogContent>
        </Dialog>

        {/* Spaced Repetition Center Dialog */}
        <Dialog open={showSpacedRepetitionCenter} onOpenChange={setShowSpacedRepetitionCenter}>
          <DialogContent className="max-w-7xl h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Repeat className="w-5 h-5 text-green-500" />
                Advanced Spaced Repetition Center
              </DialogTitle>
              <DialogDescription>
                Master long-term retention with AI-powered spaced repetition and adaptive flashcards
              </DialogDescription>
            </DialogHeader>
            <SpacedRepetitionCenter onClose={() => setShowSpacedRepetitionCenter(false)} />
          </DialogContent>
        </Dialog>

        {/* Feynman Technique Center Dialog */}
        <Dialog open={showFeynmanCenter} onOpenChange={setShowFeynmanCenter}>
          <DialogContent className="max-w-7xl h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Advanced Feynman Technique Center
              </DialogTitle>
              <DialogDescription>
                Master deep understanding by teaching concepts in simple terms with AI-powered feedback
              </DialogDescription>
            </DialogHeader>
            <FeynmanCenter onClose={() => setShowFeynmanCenter(false)} />
          </DialogContent>
        </Dialog>

        {/* Active Recall Learning Dialog */}
        <Dialog open={showActiveRecallDialog} onOpenChange={setShowActiveRecallDialog}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                Active Recall Learning Center
              </DialogTitle>
              <DialogDescription>
                Boost your memory retention with scientifically-proven active recall techniques
              </DialogDescription>
            </DialogHeader>
            <ActiveRecallCenter onClose={() => setShowActiveRecallDialog(false)} />
          </DialogContent>
        </Dialog>

        {/* Pomodoro Practice Popup */}
        <Dialog open={showPomodoroPopup} onOpenChange={setShowPomodoroPopup}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-red-500" />
                Pomodoro Session
              </DialogTitle>
              <DialogDescription>
                {pomodoroSession.isBreak ? "Take a short break!" : "Focus time - stay concentrated!"}
              </DialogDescription>
            </DialogHeader>
            <PomodoroTimer 
              session={pomodoroSession}
              setSession={setPomodoroSession}
              onClose={() => setShowPomodoroPopup(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

// Feynman Technique Center Component
const FeynmanCenter = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("teach-back");
  const [currentConcept, setCurrentConcept] = useState("photosynthesis");
  const [explanation, setExplanation] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [clarityScore, setClarityScore] = useState(null);
  const [analogy, setAnalogy] = useState("");
  const [gaps, setGaps] = useState([]);
  const [peerFeedback, setPeerFeedback] = useState([]);
  const [mindMapData, setMindMapData] = useState(null);
  const [challengeMode, setChallengeMode] = useState(false);
  const [challengeConcept, setChallengeConcept] = useState("");

  // Sample concepts for teaching
  const concepts = [
    { id: "photosynthesis", name: "Photosynthesis", difficulty: "Medium", subject: "Biology" },
    { id: "gravity", name: "Gravity", difficulty: "Easy", subject: "Physics" },
    { id: "democracy", name: "Democracy", difficulty: "Hard", subject: "Social Studies" },
    { id: "calculus", name: "Calculus Derivatives", difficulty: "Hard", subject: "Mathematics" },
    { id: "dna", name: "DNA Replication", difficulty: "Medium", subject: "Biology" },
    { id: "economics", name: "Supply and Demand", difficulty: "Medium", subject: "Economics" }
  ];

  // Sample AI analysis results
  const sampleAnalysis = {
    clarityScore: 72,
    readabilityLevel: "Grade 10",
    targetLevel: "Grade 6",
    missingPoints: [
      "Didn't mention chlorophyll as the key molecule",
      "Failed to explain why sunlight is necessary",
      "Missing the role of carbon dioxide"
    ],
    jargonDetected: ["glucose", "chloroplasts", "photons"],
    suggestions: [
      "Replace 'glucose' with 'plant sugar'",
      "Explain 'chloroplasts' as 'tiny green factories'",
      "Use 'light energy' instead of 'photons'"
    ],
    analogies: [
      "Photosynthesis is like a solar panel that makes food for the plant",
      "Think of leaves as tiny green kitchens cooking with sunlight",
      "It's like a plant breathing in bad air and breathing out fresh air while making its own lunch"
    ]
  };

  // Sample peer feedback
  const samplePeerFeedback = [
    {
      id: 1,
      peer: "Sarah Chen",
      rating: 4,
      feedback: "Great explanation! The solar panel analogy really helped me understand. Maybe add more about why plants need this process?",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      peer: "Alex Rivera", 
      rating: 5,
      feedback: "Perfect! You explained it so simply that my little brother understood it too. Loved the 'plant kitchen' metaphor.",
      timestamp: "1 day ago"
    },
    {
      id: 3,
      peer: "Maya Patel",
      rating: 3,
      feedback: "Good start but you could explain chlorophyll better. What exactly makes plants green?",
      timestamp: "2 days ago"
    }
  ];

  // Challenge concepts for gamification
  const challengeConcepts = [
    "Quantum Entanglement",
    "Economic Inflation", 
    "Mitochondrial Respiration",
    "Electromagnetic Induction",
    "Neural Plasticity"
  ];

  const handleAnalyzeExplanation = () => {
    // Simulate AI analysis
    setClarityScore(sampleAnalysis.clarityScore);
    setGaps(sampleAnalysis.missingPoints);
    setAnalogy(sampleAnalysis.analogies[0]);
  };

  const startChallenge = () => {
    const randomConcept = challengeConcepts[Math.floor(Math.random() * challengeConcepts.length)];
    setChallengeConcept(randomConcept);
    setChallengeMode(true);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-8 mb-6">
          <TabsTrigger value="teach-back" className="text-xs">
            <Lightbulb className="w-3 h-3 mr-1" />
            Teach-Back
          </TabsTrigger>
          <TabsTrigger value="clarity" className="text-xs">
            <BarChart className="w-3 h-3 mr-1" />
            AI Clarity
          </TabsTrigger>
          <TabsTrigger value="analogies" className="text-xs">
            <ArrowRight className="w-3 h-3 mr-1" />
            Analogies
          </TabsTrigger>
          <TabsTrigger value="gaps" className="text-xs">
            <TargetIcon className="w-3 h-3 mr-1" />
            Gap Finder
          </TabsTrigger>
          <TabsTrigger value="voice" className="text-xs">
            <Mic className="w-3 h-3 mr-1" />
            Voice Teach
          </TabsTrigger>
          <TabsTrigger value="peer" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            Peer Mode
          </TabsTrigger>
          <TabsTrigger value="mindmap" className="text-xs">
            <Network className="w-3 h-3 mr-1" />
            Mind Map
          </TabsTrigger>
          <TabsTrigger value="challenge" className="text-xs">
            <Trophy className="w-3 h-3 mr-1" />
            Challenge
          </TabsTrigger>
        </TabsList>

        {/* Teach-Back Mode Tab */}
        <TabsContent value="teach-back" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Concept Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Choose Concept</CardTitle>
                <CardDescription>Select what you want to explain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {concepts.map((concept) => (
                  <div
                    key={concept.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentConcept === concept.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentConcept(concept.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm">{concept.name}</h3>
                      <Badge variant={concept.difficulty === 'Hard' ? 'destructive' : 
                                   concept.difficulty === 'Medium' ? 'secondary' : 'default'}>
                        {concept.difficulty}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">{concept.subject}</div>
                  </div>
                ))}
                
                <div className="border-t pt-3">
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="w-3 h-3 mr-1" />
                    Upload Your Own
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Main Teaching Interface */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Explain: {concepts.find(c => c.id === currentConcept)?.name}
                </CardTitle>
                <CardDescription>
                  Explain this concept as if you're teaching it to a 6th grader
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Explanation Input */}
                <div>
                  <Label>Your Explanation</Label>
                  <Textarea
                    placeholder="Start explaining the concept in simple terms. Imagine you're teaching a young student who has never heard of this before..."
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    className="min-h-[200px] mt-2"
                  />
                </div>

                {/* Word Count & Reading Level */}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Words: {explanation.split(' ').filter(word => word.length > 0).length}</span>
                  <span>Est. Reading Level: Grade {Math.floor(Math.random() * 6) + 6}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button onClick={handleAnalyzeExplanation} className="flex-1">
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Explanation
                  </Button>
                  <Button variant="outline" onClick={() => setExplanation("")}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>

                {/* Real-time AI Feedback */}
                {clarityScore && (
                  <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">AI Analysis Results</h3>
                      <Badge variant={clarityScore >= 80 ? "default" : clarityScore >= 60 ? "secondary" : "destructive"}>
                        {clarityScore}/100 Clarity Score
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-gray-700">Reading Level</div>
                        <div className="text-sm">Current: {sampleAnalysis.readabilityLevel} → Target: {sampleAnalysis.targetLevel}</div>
                        <Progress value={(6/10) * 100} className="h-2 mt-1" />
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Suggestions for Improvement</div>
                        <div className="space-y-1">
                          {sampleAnalysis.suggestions.slice(0, 2).map((suggestion, index) => (
                            <div key={index} className="text-xs bg-yellow-50 border border-yellow-200 rounded p-2">
                              💡 {suggestion}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Clarity Scoring Tab */}
        <TabsContent value="clarity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-blue-500" />
                  Clarity Analysis
                </CardTitle>
                <CardDescription>AI-powered simplicity scoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-2">{sampleAnalysis.clarityScore}</div>
                  <div className="text-lg text-gray-600">Clarity Score</div>
                  <Progress value={sampleAnalysis.clarityScore} className="h-3 mt-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-orange-600">{sampleAnalysis.readabilityLevel}</div>
                    <div className="text-sm text-gray-600">Current Level</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">{sampleAnalysis.targetLevel}</div>
                    <div className="text-sm text-gray-600">Target Level</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Score Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Simplicity</span>
                      <span className="font-medium">78/100</span>
                    </div>
                    <Progress value={78} className="h-1" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Clarity</span>
                      <span className="font-medium">82/100</span>
                    </div>
                    <Progress value={82} className="h-1" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Completeness</span>
                      <span className="font-medium">68/100</span>
                    </div>
                    <Progress value={68} className="h-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
                <CardDescription>AI recommendations for clearer explanations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">🚨 Jargon Detected</h4>
                  <div className="space-y-2">
                    {sampleAnalysis.jargonDetected.map((jargon, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded p-2 text-sm">
                        <span className="font-medium text-red-700">"{jargon}"</span> is too technical
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">💡 Simplification Tips</h4>
                  <div className="space-y-2">
                    {sampleAnalysis.suggestions.map((suggestion, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded p-2 text-sm">
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-purple-600">🎯 Target Metrics</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Sentence length:</span>
                      <span>15-20 words</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Syllables per word:</span>
                      <span>1-2 syllables</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Technical terms:</span>
                      <span>Less than 5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analogy Generator Tab */}
        <TabsContent value="analogies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-green-500" />
                AI Analogy Generator
              </CardTitle>
              <CardDescription>
                Transform complex concepts into relatable analogies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Current Concept: {concepts.find(c => c.id === currentConcept)?.name}</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                      {explanation || "Your explanation will appear here..."}
                    </div>
                  </div>

                  <Button className="w-full">
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Analogies
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">AI-Generated Analogies</h3>
                  <div className="space-y-3">
                    {sampleAnalysis.analogies.map((analogy, index) => (
                      <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <div className="text-green-500 mt-1">💡</div>
                          <div className="text-sm">{analogy}</div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Use This
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Analogy Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-sm">
                    <div className="font-medium text-blue-800">🏠 Use Familiar Things</div>
                    <div className="text-blue-600 mt-1">Compare to everyday objects and experiences</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-sm">
                    <div className="font-medium text-purple-800">🔗 Show Relationships</div>
                    <div className="text-purple-600 mt-1">Highlight how parts connect and work together</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-sm">
                    <div className="font-medium text-orange-800">⚡ Keep It Simple</div>
                    <div className="text-orange-600 mt-1">Use analogies your audience already understands</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gap Finder Tab */}
        <TabsContent value="gaps" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TargetIcon className="w-5 h-5 text-red-500" />
                  Knowledge Gap Analysis
                </CardTitle>
                <CardDescription>AI detects missing elements in your explanation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-3">🚨 Missing Key Points</h4>
                  <div className="space-y-2">
                    {sampleAnalysis.missingPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <div className="text-sm text-red-700">{point}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Reference Material
                </Button>

                <div className="text-xs text-gray-500">
                  💡 Upload textbooks, notes, or articles to improve gap detection accuracy
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Targeted Review Questions</CardTitle>
                <CardDescription>Practice questions for identified gaps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "What molecule in plants captures sunlight for photosynthesis?",
                    "Why do plants need carbon dioxide during photosynthesis?", 
                    "What gas do plants release as a byproduct of photosynthesis?",
                    "Where exactly in the plant cell does photosynthesis occur?"
                  ].map((question, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="text-sm font-medium mb-2">Question {index + 1}</div>
                      <div className="text-sm mb-3">{question}</div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Answer</Button>
                        <Button size="sm" variant="outline">Skip</Button>
                        <Button size="sm" variant="outline">
                          <Lightbulb className="w-3 h-3 mr-1" />
                          Hint
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate More Questions
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Voice-to-Teach Tab */}
        <TabsContent value="voice" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-purple-500" />
                  Voice Teaching Mode
                </CardTitle>
                <CardDescription>Record yourself explaining concepts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <div className={`w-24 h-24 rounded-full border-4 mx-auto flex items-center justify-center ${
                    isRecording ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}>
                    <Mic className={`w-8 h-8 ${isRecording ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>

                  <div>
                    <div className="text-lg font-medium">
                      {isRecording ? 'Recording...' : 'Ready to Record'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {isRecording ? `${recordingDuration}s` : 'Click to start explaining'}
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <Button
                      onClick={() => setIsRecording(!isRecording)}
                      className={isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
                    >
                      {isRecording ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>
                    
                    {!isRecording && (
                      <Button variant="outline">
                        <Volume2 className="w-4 h-4 mr-2" />
                        Play Last
                      </Button>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Recording Tips</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• Speak clearly and at a natural pace</div>
                    <div>• Pretend you're teaching a friend</div>
                    <div>• Use simple words and avoid jargon</div>
                    <div>• Include examples and analogies</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Voice Analysis Results</CardTitle>
                <CardDescription>AI analysis of your recorded explanation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">📝 Transcription</h4>
                  <div className="text-sm text-blue-700">
                    "Photosynthesis is when plants make their own food using sunlight. They take in carbon dioxide from the air and water from their roots, and with the help of sunlight, they create glucose which is like plant sugar..."
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-sm text-gray-600">Clarity Score</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">125</div>
                    <div className="text-sm text-gray-600">Words/Min</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Speech Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Pace</span>
                      <span className="text-green-600">Good ✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Clarity</span>
                      <span className="text-green-600">Excellent ✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Filler words</span>
                      <span className="text-yellow-600">3 detected</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence</span>
                      <span className="text-green-600">High ✓</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Save Recording
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Peer Teaching Mode Tab */}
        <TabsContent value="peer" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  Peer Teaching Sessions
                </CardTitle>
                <CardDescription>Learn by teaching and being taught by peers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Start Teaching Session
                </Button>

                <div className="space-y-3">
                  <h4 className="font-semibold">Active Sessions</h4>
                  {[
                    { topic: "Photosynthesis", peer: "Sarah Chen", status: "Waiting for explanation", time: "2 min" },
                    { topic: "Gravity", peer: "Alex Rivera", status: "Teaching in progress", time: "5 min" },
                    { topic: "Democracy", peer: "Maya Patel", status: "Feedback pending", time: "8 min" }
                  ].map((session, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{session.topic}</div>
                          <div className="text-sm text-gray-500">with {session.peer}</div>
                        </div>
                        <Badge variant={
                          session.status.includes('progress') ? 'default' :
                          session.status.includes('Waiting') ? 'secondary' : 'outline'
                        }>
                          {session.time}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">{session.status}</div>
                      <Button size="sm" variant="outline">Join Session</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peer Feedback</CardTitle>
                <CardDescription>Reviews from your teaching sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">4.3</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                  <div className="flex justify-center gap-1 mt-1">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className={`w-4 h-4 ${star <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {samplePeerFeedback.map((feedback) => (
                    <div key={feedback.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-sm">{feedback.peer}</div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < feedback.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">{feedback.feedback}</div>
                      <div className="text-xs text-gray-500">{feedback.timestamp}</div>
                    </div>
                  ))}
                </div>

                <Button className="w-full" variant="outline">
                  View All Feedback
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Concept Breakdown Mind Map Tab */}
        <TabsContent value="mindmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-500" />
                Concept Breakdown Mind Map
              </CardTitle>
              <CardDescription>
                Visual representation of your explanation with gap identification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 min-h-[400px] border">
                    {/* Mind Map Visualization */}
                    <div className="text-center">
                      <div className="relative">
                        {/* Central concept */}
                        <div className="bg-blue-500 text-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 font-semibold">
                          Photosynthesis
                        </div>
                        
                        {/* Connected nodes */}
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <div className="bg-green-500 text-white rounded-lg p-3 font-medium">
                              ✓ Sunlight
                            </div>
                            <div className="bg-green-500 text-white rounded-lg p-3 font-medium">
                              ✓ Water
                            </div>
                            <div className="bg-red-500 text-white rounded-lg p-3 font-medium">
                              ❌ Chlorophyll
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-green-500 text-white rounded-lg p-3 font-medium">
                              ✓ Glucose
                            </div>
                            <div className="bg-red-500 text-white rounded-lg p-3 font-medium">
                              ❌ Oxygen
                            </div>
                            <div className="bg-yellow-500 text-white rounded-lg p-3 font-medium">
                              ? CO₂
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Legend</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span>Covered in explanation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span>Missing from explanation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <span>Partially explained</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-semibold text-red-800 mb-2">🎯 Areas to Study</h4>
                    <div className="space-y-1 text-sm text-red-700">
                      <div>• Role of chlorophyll</div>
                      <div>• Oxygen as byproduct</div>
                      <div>• CO₂ absorption process</div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Update Mind Map
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Simplify Challenge Tab */}
        <TabsContent value="challenge" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Simplify Challenge
                </CardTitle>
                <CardDescription>Explain complex concepts in 3 sentences at child level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!challengeMode ? (
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🏆</div>
                    <div>
                      <h3 className="font-semibold text-lg">Ready for the Challenge?</h3>
                      <p className="text-sm text-gray-600">
                        You'll get a random complex concept to explain in simple terms
                      </p>
                    </div>
                    <Button onClick={startChallenge} className="bg-yellow-500 hover:bg-yellow-600">
                      <Zap className="w-4 h-4 mr-2" />
                      Start Challenge
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border">
                      <h3 className="font-semibold text-lg mb-2">Your Challenge:</h3>
                      <div className="text-xl font-bold text-yellow-700">{challengeConcept}</div>
                      <div className="text-sm text-gray-600 mt-2">
                        Explain this in 3 sentences using words a 6th grader would understand
                      </div>
                    </div>

                    <div>
                      <Label>Your Explanation (3 sentences max)</Label>
                      <Textarea
                        placeholder="Type your simple explanation here..."
                        className="min-h-[120px] mt-2"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Challenge
                      </Button>
                      <Button variant="outline" onClick={() => setChallengeMode(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Exit
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Challenge Leaderboard</CardTitle>
                <CardDescription>Top performers in simplification challenges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "Sarah Chen", score: 2847, challenges: 23, avatar: "🏆" },
                    { rank: 2, name: "You", score: 2650, challenges: 18, avatar: "👤" },
                    { rank: 3, name: "Alex Rivera", score: 2543, challenges: 19, avatar: "🥉" },
                    { rank: 4, name: "Maya Patel", score: 2401, challenges: 15, avatar: "📚" },
                    { rank: 5, name: "Jordan Kim", score: 2298, challenges: 12, avatar: "⭐" }
                  ].map((player, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                      player.name === "You" ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{player.avatar}</div>
                        <div>
                          <div className={`font-medium ${player.name === "You" ? "text-blue-700" : ""}`}>
                            #{player.rank} {player.name}
                          </div>
                          <div className="text-sm text-gray-500">{player.challenges} challenges</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{player.score.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Your Stats</h4>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-green-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-green-600">18</div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-blue-600">89%</div>
                      <div className="text-xs text-gray-600">Success Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-4">
        <Button variant="outline" onClick={onClose}>
          Close Feynman Center
        </Button>
      </div>
    </div>
  );
};

// Spaced Repetition Center Component
const SpacedRepetitionCenter = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("flashcards");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState("medium");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState("mathematics");
  const [reviewMode, setReviewMode] = useState("adaptive");
  const [importMode, setImportMode] = useState("file");

  // Sample flashcard data
  const flashcardDecks = [
    {
      id: "mathematics",
      name: "Advanced Calculus",
      cards: 156,
      dueToday: 23,
      mastery: 78,
      lastReviewed: "2 hours ago",
      difficulty: "Hard",
      streak: 12
    },
    {
      id: "physics",
      name: "Quantum Mechanics",
      cards: 89,
      dueToday: 15,
      mastery: 65,
      lastReviewed: "1 day ago",
      difficulty: "Expert",
      streak: 8
    },
    {
      id: "chemistry", 
      name: "Organic Chemistry",
      cards: 203,
      dueToday: 31,
      mastery: 82,
      lastReviewed: "6 hours ago",
      difficulty: "Medium",
      streak: 15
    },
    {
      id: "biology",
      name: "Cell Biology", 
      cards: 127,
      dueToday: 18,
      mastery: 71,
      lastReviewed: "3 hours ago",
      difficulty: "Medium",
      streak: 10
    }
  ];

  const currentCard = {
    id: 1,
    front: "What is the derivative of sin(x) with respect to x?",
    back: "cos(x)",
    difficulty: "medium",
    reviewCount: 3,
    successRate: 75,
    nextReview: "2024-09-20T10:00:00Z",
    tags: ["calculus", "derivatives", "trigonometry"],
    memoryStrength: 78
  };

  const studyStats = {
    totalCards: 575,
    cardsReviewed: 1247,
    averageAccuracy: 84,
    dailyStreak: 15,
    weeklyGoal: 50,
    todayProgress: 23,
    memoryRetention: 87
  };

  const forgettingCurveData = [
    { time: "1 hour", retention: 100 },
    { time: "1 day", retention: 67 },
    { time: "2 days", retention: 58 },
    { time: "6 days", retention: 44 },
    { time: "31 days", retention: 25 }
  ];

  const collaborativeDecks = [
    { name: "Physics Study Group", members: 12, cards: 89, shared: true },
    { name: "Med School Prep", members: 8, cards: 234, shared: true },
    { name: "Chemistry Finals", members: 15, cards: 156, shared: false }
  ];

  const handleCardAnswer = (confidence) => {
    setConfidenceLevel(confidence);
    // Simulate next card scheduling based on confidence
    setCurrentCardIndex(prev => prev + 1);
    setShowAnswer(false);
    setUserAnswer("");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 mb-6">
          <TabsTrigger value="flashcards" className="text-xs">
            <BookOpen className="w-3 h-3 mr-1" />
            Cards
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="text-xs">
            <CalendarIcon className="w-3 h-3 mr-1" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs">
            <BarChart3 className="w-3 h-3 mr-1" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="import" className="text-xs">
            <Upload className="w-3 h-3 mr-1" />
            Import
          </TabsTrigger>
          <TabsTrigger value="gamification" className="text-xs">
            <Trophy className="w-3 h-3 mr-1" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="collaborative" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            Groups
          </TabsTrigger>
          <TabsTrigger value="planner" className="text-xs">
            <Target className="w-3 h-3 mr-1" />
            Planner
          </TabsTrigger>
        </TabsList>

        {/* Adaptive Flashcards Tab */}
        <TabsContent value="flashcards" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Deck Selection */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Decks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {flashcardDecks.map((deck) => (
                    <div
                      key={deck.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedDeck === deck.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedDeck(deck.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-sm">{deck.name}</h3>
                        <Badge variant={deck.difficulty === 'Expert' ? 'destructive' : 
                                     deck.difficulty === 'Hard' ? 'secondary' : 'default'}>
                          {deck.difficulty}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Cards:</span>
                          <span>{deck.cards}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Due today:</span>
                          <span className="text-red-600 font-medium">{deck.dueToday}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mastery:</span>
                          <span className="text-green-600 font-medium">{deck.mastery}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Streak:</span>
                          <span className="text-orange-600 font-medium">{deck.streak} days</span>
                        </div>
                      </div>
                      <Progress value={deck.mastery} className="h-1 mt-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Flashcard Interface */}
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-green-500" />
                      Adaptive Flashcard Review
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge>Card {currentCardIndex + 1} of {flashcardDecks.find(d => d.id === selectedDeck)?.dueToday}</Badge>
                      <Badge variant="outline">Strength: {currentCard.memoryStrength}%</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Card Display */}
                  <div className="min-h-[300px] flex flex-col justify-center">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 text-center">
                      <div className="text-xl font-medium mb-4">
                        {currentCard.front}
                      </div>
                      
                      {/* Tags */}
                      <div className="flex justify-center gap-2 mb-4">
                        {currentCard.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Active Recall Input */}
                      {!showAnswer && (
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Type your answer here before revealing..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className="min-h-[100px]"
                          />
                          
                          <div className="flex justify-center gap-3">
                            <Button
                              variant="outline"
                              onClick={() => setIsRecording(!isRecording)}
                              className={isRecording ? "bg-red-50 border-red-300" : ""}
                            >
                              <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'text-red-500' : ''}`} />
                              {isRecording ? 'Stop Recording' : 'Voice Answer'}
                            </Button>
                            
                            <Button onClick={() => setShowAnswer(true)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Reveal Answer
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Answer Revealed */}
                      {showAnswer && (
                        <div className="space-y-4">
                          <div className="border-t pt-4">
                            <div className="text-lg font-semibold text-green-700 mb-2">Answer:</div>
                            <div className="text-xl">{currentCard.back}</div>
                          </div>
                          
                          {userAnswer && (
                            <div className="bg-blue-50 rounded-lg p-3">
                              <div className="text-sm font-medium text-blue-700 mb-1">Your Answer:</div>
                              <div className="text-sm">{userAnswer}</div>
                            </div>
                          )}

                          {/* Confidence Rating */}
                          <div className="space-y-3">
                            <Label className="text-base font-medium">How confident were you?</Label>
                            <div className="flex justify-center gap-3">
                              <Button
                                variant={confidenceLevel === "hard" ? "destructive" : "outline"}
                                onClick={() => handleCardAnswer("hard")}
                                className="flex-1"
                              >
                                <Frown className="w-4 h-4 mr-1" />
                                Hard (1 day)
                              </Button>
                              <Button
                                variant={confidenceLevel === "medium" ? "secondary" : "outline"}
                                onClick={() => handleCardAnswer("medium")}
                                className="flex-1"
                              >
                                <Meh className="w-4 h-4 mr-1" />
                                Medium (3 days)
                              </Button>
                              <Button
                                variant={confidenceLevel === "easy" ? "default" : "outline"}
                                onClick={() => handleCardAnswer("easy")}
                                className="flex-1"
                              >
                                <Smile className="w-4 h-4 mr-1" />
                                Easy (7 days)
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Stats */}
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{currentCard.reviewCount}</div>
                      <div className="text-xs text-gray-500">Reviews</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{currentCard.successRate}%</div>
                      <div className="text-xs text-gray-500">Success Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{currentCard.memoryStrength}%</div>
                      <div className="text-xs text-gray-500">Memory Strength</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">2 days</div>
                      <div className="text-xs text-gray-500">Next Review</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Smart Review Scheduling Tab */}
        <TabsContent value="scheduling" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-500" />
                  Review Calendar
                </CardTitle>
                <CardDescription>AI-optimized scheduling based on forgetting curves</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <div key={day} className="font-semibold text-gray-600">{day}</div>
                    ))}
                    
                    {Array.from({ length: 35 }, (_, i) => {
                      const reviews = Math.floor(Math.random() * 50);
                      const intensity = reviews > 30 ? 'bg-red-500' : 
                                      reviews > 20 ? 'bg-orange-500' :
                                      reviews > 10 ? 'bg-yellow-500' :
                                      reviews > 0 ? 'bg-green-500' : 'bg-gray-100';
                      
                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded ${intensity} text-white text-xs flex items-center justify-center cursor-pointer hover:opacity-80`}
                          title={`${reviews} reviews`}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-gray-100 rounded"></div>
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                    </div>
                    <span>More</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock4 className="w-5 h-5 text-purple-500" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>Personalized review timeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: "9:00 AM", deck: "Calculus", cards: 15, urgency: "high" },
                    { time: "11:30 AM", deck: "Physics", cards: 8, urgency: "medium" },
                    { time: "2:00 PM", deck: "Chemistry", cards: 12, urgency: "high" },
                    { time: "4:30 PM", deck: "Biology", cards: 6, urgency: "low" },
                    { time: "7:00 PM", deck: "New Cards", cards: 10, urgency: "new" }
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          session.urgency === 'high' ? 'bg-red-500' :
                          session.urgency === 'medium' ? 'bg-yellow-500' :
                          session.urgency === 'low' ? 'bg-green-500' :
                          'bg-blue-500'
                        }`}></div>
                        <div>
                          <div className="font-medium">{session.deck}</div>
                          <div className="text-sm text-gray-500">{session.cards} cards</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">{session.time}</div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Smart Reminders
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Progress Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{studyStats.totalCards}</div>
                <div className="text-sm text-gray-500">Total Cards</div>
                <div className="text-xs text-green-600">+23 this week</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{studyStats.averageAccuracy}%</div>
                <div className="text-sm text-gray-500">Accuracy</div>
                <div className="text-xs text-blue-600">+5% this month</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{studyStats.dailyStreak}</div>
                <div className="text-sm text-gray-500">Day Streak</div>
                <div className="text-xs text-purple-600">Personal best!</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{studyStats.memoryRetention}%</div>
                <div className="text-sm text-gray-500">Retention</div>
                <div className="text-xs text-orange-600">Excellent!</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Memory Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-red-500" />
                  Memory Strength Heatmap
                </CardTitle>
                <CardDescription>Visual representation of topic mastery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 25 }, (_, i) => {
                    const strength = Math.floor(Math.random() * 100);
                    const color = strength > 80 ? 'bg-green-500' :
                                strength > 60 ? 'bg-yellow-500' :
                                strength > 40 ? 'bg-orange-500' :
                                'bg-red-500';
                    
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded ${color} flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-80`}
                        title={`Topic ${i + 1}: ${strength}% mastery`}
                      >
                        {strength}
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Weak</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                    </div>
                    <span>Strong</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Forgetting Curve */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Forgetting Curve Analysis
                </CardTitle>
                <CardDescription>Memory retention over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forgettingCurveData.map((point, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm w-16">{point.time}</span>
                      <div className="flex-1 mx-3">
                        <Progress value={point.retention} className="h-3" />
                      </div>
                      <span className="text-sm font-medium w-12">{point.retention}%</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-800">AI Insight</div>
                  <div className="text-xs text-blue-600 mt-1">
                    Your retention curve shows optimal spacing. Consider increasing intervals for well-learned cards.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Smart Import Tab */}
        <TabsContent value="import" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-green-500" />
                  Auto-Generate Flashcards
                </CardTitle>
                <CardDescription>Upload content and let AI create optimized flashcards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={importMode} onValueChange={setImportMode}>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="file">File Upload</TabsTrigger>
                    <TabsTrigger value="text">Text Input</TabsTrigger>
                    <TabsTrigger value="url">Web Import</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="file" className="space-y-3">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Drag & drop or click to upload</p>
                      <p className="text-xs text-gray-500">Supports: PDF, DOCX, TXT, PPT</p>
                      <Button size="sm" className="mt-2">Choose Files</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="text" className="space-y-3">
                    <Textarea 
                      placeholder="Paste your notes, textbook content, or study material here..."
                      className="min-h-[150px]"
                    />
                    <Button className="w-full">
                      <Brain className="w-4 h-4 mr-2" />
                      Generate Flashcards
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="url" className="space-y-3">
                    <Input placeholder="Enter URL to import (Wikipedia, course pages, etc.)" />
                    <Button className="w-full">
                      <Globe className="w-4 h-4 mr-2" />
                      Import from Web
                    </Button>
                  </TabsContent>
                </Tabs>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Integration Options</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-1" />
                      Google Docs
                    </Button>
                    <Button variant="outline" size="sm">
                      <Database className="w-4 h-4 mr-1" />
                      Notion
                    </Button>
                    <Button variant="outline" size="sm">
                      <Cloud className="w-4 h-4 mr-1" />
                      Obsidian
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-1" />
                      Anki
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Imports</CardTitle>
                <CardDescription>AI-generated flashcard previews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { 
                      source: "Chapter 5 - Calculus.pdf",
                      cards: 23,
                      quality: 92,
                      topics: ["Derivatives", "Chain Rule", "Applications"]
                    },
                    {
                      source: "Quantum Physics Notes",
                      cards: 18,
                      quality: 88,
                      topics: ["Wave Function", "Uncertainty", "Entanglement"]
                    },
                    {
                      source: "Biology Lecture 12",
                      cards: 31,
                      quality: 95,
                      topics: ["Cell Division", "Mitosis", "DNA Replication"]
                    }
                  ].map((import_, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{import_.source}</h4>
                        <Badge variant="outline">{import_.cards} cards</Badge>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">Quality Score:</span>
                        <span className="text-xs font-medium text-green-600">{import_.quality}%</span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {import_.topics.map((topic, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{topic}</Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Preview</Button>
                        <Button size="sm">Add to Deck</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gamification Tab */}
        <TabsContent value="gamification" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Memory Master", description: "Review 1000 cards", progress: 847, total: 1000, icon: Brain },
                  { name: "Streak Champion", description: "30-day review streak", progress: 15, total: 30, icon: Flame },
                  { name: "Perfect Recall", description: "100% accuracy for 10 cards", progress: 7, total: 10, icon: Star },
                  { name: "Speed Learner", description: "Review 50 cards in 10 minutes", progress: 0, total: 1, icon: Zap }
                ].map((achievement, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <achievement.icon className="w-4 h-4 text-yellow-500" />
                        <div>
                          <div className="font-medium text-sm">{achievement.name}</div>
                          <div className="text-xs text-gray-500">{achievement.description}</div>
                        </div>
                      </div>
                      <Badge variant={achievement.progress === achievement.total ? "default" : "outline"}>
                        {achievement.progress}/{achievement.total}
                      </Badge>
                    </div>
                    <Progress value={(achievement.progress / achievement.total) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-500" />
                  Level Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <div className="text-3xl font-bold text-blue-600">Level 12</div>
                  <div className="text-sm text-gray-500">Memory Scholar</div>
                </div>
                <Progress value={68} className="h-3" />
                <div className="text-xs text-gray-500">2,040 / 3,000 XP to Level 13</div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">XP Breakdown</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Card Reviews</span>
                      <span>+1,850 XP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Streaks</span>
                      <span>+150 XP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Achievements</span>
                      <span>+40 XP</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Streaks & Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{studyStats.dailyStreak}</div>
                  <div className="text-sm text-gray-500">Day Streak</div>
                  <div className="text-xs text-orange-600 mt-1">Personal Best!</div>
                </div>
                
                <Progress value={(studyStats.todayProgress / studyStats.weeklyGoal) * 100} className="h-3" />
                <div className="text-xs text-center text-gray-500">
                  {studyStats.todayProgress}/{studyStats.weeklyGoal} weekly goal
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Rewards Earned</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span>10 Day Streak Badge</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-blue-500" />
                      <span>1000 Cards Reviewed</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Brain className="w-4 h-4 text-purple-500" />
                      <span>Perfect Week Scholar</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Collaborative Learning Tab */}
        <TabsContent value="collaborative" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  Study Groups
                </CardTitle>
                <CardDescription>Learn together with shared flashcard decks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Create New Study Group
                </Button>
                
                <div className="space-y-3">
                  {collaborativeDecks.map((deck, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{deck.name}</h4>
                        <Badge variant={deck.shared ? "default" : "secondary"}>
                          {deck.shared ? "Public" : "Private"}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{deck.members} members</span>
                        <span>{deck.cards} cards</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Join</Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Group Leaderboard
                </CardTitle>
                <CardDescription>Weekly study group rankings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "Sarah Chen", score: 2847, streak: 23, avatar: "🎓" },
                    { rank: 2, name: "You", score: 2650, streak: 15, avatar: "👤" },
                    { rank: 3, name: "Alex Rivera", score: 2543, streak: 19, avatar: "📚" },
                    { rank: 4, name: "Maya Patel", score: 2401, streak: 12, avatar: "🧠" },
                    { rank: 5, name: "Jordan Kim", score: 2298, streak: 8, avatar: "⭐" }
                  ].map((member, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                      member.name === "You" ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{member.avatar}</div>
                        <div>
                          <div className={`font-medium ${member.name === "You" ? "text-blue-700" : ""}`}>
                            #{member.rank} {member.name}
                          </div>
                          <div className="text-sm text-gray-500">{member.streak} day streak</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{member.score.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4" variant="outline">
                  View Full Leaderboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Personalized Study Planner Tab */}
        <TabsContent value="planner" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  AI Study Planner
                </CardTitle>
                <CardDescription>Intelligent scheduling combining spaced repetition and focus techniques</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Study Duration</Label>
                    <Select defaultValue="120">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="180">3 hours</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Focus Technique</Label>
                    <Select defaultValue="pomodoro">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pomodoro">Pomodoro (25/5)</SelectItem>
                        <SelectItem value="deepwork">Deep Work (90/20)</SelectItem>
                        <SelectItem value="timeblocking">Time Blocking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button className="w-full">
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Smart Study Plan
                </Button>

                <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50">
                  <h3 className="font-semibold mb-3">Today's Recommended Schedule</h3>
                  <div className="space-y-3">
                    {[
                      { time: "9:00-9:25", activity: "High-priority reviews (Calculus)", type: "review" },
                      { time: "9:25-9:30", activity: "Short break", type: "break" },
                      { time: "9:30-9:55", activity: "New cards (Physics)", type: "learning" },
                      { time: "9:55-10:10", activity: "Long break", type: "break" },
                      { time: "10:10-10:35", activity: "Medium-priority reviews (Chemistry)", type: "review" },
                      { time: "10:35-10:40", activity: "Short break", type: "break" }
                    ].map((slot, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          slot.type === 'review' ? 'bg-red-500' :
                          slot.type === 'learning' ? 'bg-blue-500' :
                          'bg-green-500'
                        }`}></div>
                        <div className="flex-1 flex justify-between">
                          <span className="text-sm font-medium">{slot.time}</span>
                          <span className="text-sm">{slot.activity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Priority Topics</CardTitle>
                <CardDescription>AI-suggested focus areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { topic: "Calculus Derivatives", urgency: "High", due: "12 cards due", color: "red" },
                    { topic: "Physics Momentum", urgency: "Medium", due: "8 cards due", color: "yellow" },
                    { topic: "Chemistry Bonds", urgency: "Low", due: "3 cards due", color: "green" },
                    { topic: "Biology Cells", urgency: "New", due: "15 new cards", color: "blue" }
                  ].map((topic, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{topic.topic}</h4>
                        <Badge variant={
                          topic.urgency === "High" ? "destructive" :
                          topic.urgency === "Medium" ? "secondary" :
                          topic.urgency === "Low" ? "outline" : "default"
                        }>
                          {topic.urgency}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">{topic.due}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-800">💡 AI Suggestion</div>
                  <div className="text-xs text-blue-600 mt-1">
                    Focus on Calculus first - you have a test in 3 days and retention is dropping.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-4">
        <Button variant="outline" onClick={onClose}>
          Close Spaced Repetition Center
        </Button>
      </div>
    </div>
  );
};

// Advanced Pomodoro Center Component
const AdvancedPomodoroCenter = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("session");
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [currentMood, setCurrentMood] = useState("neutral");
  const [currentEnergy, setCurrentEnergy] = useState(3);
  const [selectedSubject, setSelectedSubject] = useState("mathematics");
  const [distractionBlocker, setDistractionBlocker] = useState(true);
  const [groupSession, setGroupSession] = useState(false);
  const [activePomodoro, setActivePomodoro] = useState({
    timeLeft: 25 * 60,
    isActive: false,
    isBreak: false,
    sessionCount: 0,
    currentSubject: "mathematics",
    mood: "neutral",
    energy: 3
  });

  const moodOptions = [
    { value: "happy", icon: Smile, color: "text-green-500", label: "Happy" },
    { value: "neutral", icon: Meh, color: "text-yellow-500", label: "Neutral" },
    { value: "tired", icon: Frown, color: "text-red-500", label: "Tired" }
  ];

  const subjects = [
    { value: "mathematics", label: "Mathematics", icon: Calculator },
    { value: "science", label: "Science", icon: Microscope },
    { value: "history", label: "History", icon: BookOpen },
    { value: "language", label: "Language Arts", icon: FileText }
  ];

  const pomodoroPresets = [
    { name: "Classic", work: 25, break: 5, longBreak: 15, description: "Traditional Pomodoro" },
    { name: "Deep Work", work: 50, break: 10, longBreak: 30, description: "For complex tasks" },
    { name: "Ultra Focus", work: 90, break: 20, longBreak: 45, description: "Maximum concentration" },
    { name: "Quick Burst", work: 15, break: 3, longBreak: 10, description: "Short attention spans" }
  ];

  const achievements = [
    { name: "Focus Master", description: "Complete 5 Pomodoros in a row", progress: 3, total: 5, icon: Trophy },
    { name: "Early Bird", description: "Complete morning session", progress: 1, total: 1, icon: Sun },
    { name: "Night Owl", description: "Complete evening session", progress: 0, total: 1, icon: Moon },
    { name: "Tree Grower", description: "Complete 50 total sessions", progress: 23, total: 50, icon: TreePine }
  ];

  const groupMembers = [
    { name: "You", status: "working", timeLeft: "22:30", subject: "Math" },
    { name: "Sarah", status: "break", timeLeft: "3:45", subject: "Science" },
    { name: "Alex", status: "working", timeLeft: "18:12", subject: "History" },
    { name: "Maya", status: "offline", timeLeft: null, subject: null }
  ];

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activePomodoro.isActive && activePomodoro.timeLeft > 0) {
      interval = setInterval(() => {
        setActivePomodoro(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (activePomodoro.timeLeft === 0 && activePomodoro.isActive) {
      // Auto-switch to break or work
      if (activePomodoro.isBreak) {
        // End break, start new work session
        setActivePomodoro(prev => ({
          ...prev,
          timeLeft: workDuration * 60,
          isBreak: false,
          isActive: false
        }));
      } else {
        // End work session, start break
        const newSessionCount = activePomodoro.sessionCount + 1;
        const isLongBreak = newSessionCount % 4 === 0;
        setActivePomodoro(prev => ({
          ...prev,
          timeLeft: isLongBreak ? longBreakDuration * 60 : breakDuration * 60,
          isBreak: true,
          isActive: false,
          sessionCount: newSessionCount
        }));
      }
    }

    return () => clearInterval(interval);
  }, [activePomodoro.isActive, activePomodoro.timeLeft, workDuration, breakDuration, longBreakDuration]);

  // Timer control functions
  const startStopTimer = () => {
    setActivePomodoro(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const resetTimer = () => {
    setActivePomodoro(prev => ({
      ...prev,
      isActive: false,
      timeLeft: prev.isBreak ? breakDuration * 60 : workDuration * 60
    }));
  };

  const skipSession = () => {
    if (activePomodoro.isBreak) {
      // End break, start new work session
      setActivePomodoro(prev => ({
        ...prev,
        timeLeft: workDuration * 60,
        isBreak: false,
        isActive: false
      }));
    } else {
      // End work session, start break
      const newSessionCount = activePomodoro.sessionCount + 1;
      const isLongBreak = newSessionCount % 4 === 0;
      setActivePomodoro(prev => ({
        ...prev,
        timeLeft: isLongBreak ? longBreakDuration * 60 : breakDuration * 60,
        isBreak: true,
        isActive: false,
        sessionCount: newSessionCount
      }));
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="session" className="text-xs">
            <Timer className="w-3 h-3 mr-1" />
            Session
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs">
            <BarChart3 className="w-3 h-3 mr-1" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">
            <Settings className="w-3 h-3 mr-1" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="group" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            Group Study
          </TabsTrigger>
          <TabsTrigger value="gamification" className="text-xs">
            <Trophy className="w-3 h-3 mr-1" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="insights" className="text-xs">
            <Brain className="w-3 h-3 mr-1" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        {/* Main Session Tab */}
        <TabsContent value="session" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pre-Session Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Subject/Topic</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.value} value={subject.value}>
                          <div className="flex items-center gap-2">
                            <subject.icon className="w-4 h-4" />
                            {subject.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Current Mood</Label>
                  <div className="flex gap-2 mt-2">
                    {moodOptions.map((mood) => (
                      <Button
                        key={mood.value}
                        variant={currentMood === mood.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentMood(mood.value)}
                        className="flex-1"
                      >
                        <mood.icon className={`w-4 h-4 ${mood.color}`} />
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Energy Level ({currentEnergy}/5)</Label>
                  <Slider
                    value={[currentEnergy]}
                    onValueChange={(value) => setCurrentEnergy(value[0])}
                    max={5}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Distraction Blocker</Label>
                  <Switch 
                    checked={distractionBlocker} 
                    onCheckedChange={setDistractionBlocker}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Main Timer */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pomodoro Timer</span>
                  <div className="flex gap-2">
                    <Badge variant={activePomodoro.isBreak ? "secondary" : "default"}>
                      {activePomodoro.isBreak ? "Break Time" : "Focus Time"}
                    </Badge>
                    <Badge variant="outline">
                      Session {activePomodoro.sessionCount + 1}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timer Display */}
                <div className="text-center">
                  <div className="text-8xl font-mono font-bold text-primary mb-4">
                    {Math.floor(activePomodoro.timeLeft / 60).toString().padStart(2, '0')}:
                    {(activePomodoro.timeLeft % 60).toString().padStart(2, '0')}
                  </div>
                  
                  {/* Progress Ring */}
                  <div className="relative w-48 h-48 mx-auto mb-6">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke={activePomodoro.isBreak ? "#10b981" : "#ef4444"}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - (activePomodoro.timeLeft / ((activePomodoro.isBreak ? breakDuration : workDuration) * 60)))}`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {activePomodoro.isBreak ? "🍃" : "🍅"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={startStopTimer}
                      className={`${activePomodoro.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                      {activePomodoro.isActive ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start
                        </>
                      )}
                    </Button>
                    
                    <Button variant="outline" onClick={resetTimer}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    
                    <Button variant="outline" onClick={skipSession}>
                      Skip Session
                    </Button>
                  </div>
                </div>

                {/* Active Recall During Break */}
                {activePomodoro.isBreak && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-5 h-5 text-blue-500" />
                      <h3 className="font-semibold text-blue-800">Quick Recall Challenge</h3>
                      <Badge variant="secondary" className="ml-auto">Break Time Activity</Badge>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 mb-4 border border-blue-100">
                      <div className="text-xs text-blue-600 font-medium mb-1">QUESTION:</div>
                      <p className="text-base font-medium text-gray-800 mb-2">
                        "What is the quadratic formula and when do you use it?"
                      </p>
                      <div className="text-xs text-gray-600">
                        Context: Mathematics • Algebra • Solving quadratic equations
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 flex-1">
                        <Brain className="w-4 h-4 mr-1" />
                        Answer Challenge
                      </Button>
                      <Button size="sm" variant="outline">
                        Skip for Now
                      </Button>
                    </div>
                    
                    <div className="text-xs text-blue-600 mt-2 text-center">
                      Boost retention with quick recall during breaks!
                    </div>
                  </div>
                )}

                {/* Distraction Blocker Status */}
                {distractionBlocker && activePomodoro.isActive && !activePomodoro.isBreak && (
                  <div className="bg-red-50 rounded-lg p-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600">
                      Distraction blocker active - Social media blocked
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">47</div>
                <div className="text-sm text-gray-500">Total Sessions</div>
                <div className="text-xs text-green-600">+5 this week</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">19.5h</div>
                <div className="text-sm text-gray-500">Focus Time</div>
                <div className="text-xs text-blue-600">87% efficiency</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-sm text-gray-500">Day Streak</div>
                <div className="text-xs text-purple-600">Personal best!</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">92%</div>
                <div className="text-sm text-gray-500">Completion Rate</div>
                <div className="text-xs text-orange-600">Above average</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Productivity Heatmap</CardTitle>
                <CardDescription>Your best focus times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-24 gap-1">
                  {Array.from({ length: 24 }, (_, hour) => (
                    <div
                      key={hour}
                      className={`aspect-square rounded-sm text-xs flex items-center justify-center ${
                        hour >= 9 && hour <= 11 ? "bg-green-500 text-white" :
                        hour >= 14 && hour <= 16 ? "bg-green-400 text-white" :
                        hour >= 7 && hour <= 8 ? "bg-green-300" :
                        hour >= 19 && hour <= 21 ? "bg-green-200" :
                        "bg-gray-100"
                      }`}
                    >
                      {hour}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <strong>Peak hours:</strong> 9-11 AM, 2-4 PM
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject Distribution</CardTitle>
                <CardDescription>Time spent per subject this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { subject: "Mathematics", time: "5.5h", percentage: 35, color: "bg-blue-500" },
                    { subject: "Science", time: "4.2h", percentage: 27, color: "bg-green-500" },
                    { subject: "History", time: "3.8h", percentage: 24, color: "bg-purple-500" },
                    { subject: "Language", time: "2.1h", percentage: 14, color: "bg-orange-500" }
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.subject}</span>
                        <span>{item.time}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Timer Presets</CardTitle>
                <CardDescription>Choose or customize your Pomodoro cycles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {pomodoroPresets.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="p-4 h-auto flex-col items-start"
                      onClick={() => {
                        setWorkDuration(preset.work);
                        setBreakDuration(preset.break);
                        setLongBreakDuration(preset.longBreak);
                      }}
                    >
                      <div className="font-semibold">{preset.name}</div>
                      <div className="text-xs text-gray-500">{preset.description}</div>
                      <div className="text-xs mt-1">
                        {preset.work}m work + {preset.break}m break
                      </div>
                    </Button>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-semibold">Custom Settings</h3>
                  
                  <div>
                    <Label>Work Duration: {workDuration} minutes</Label>
                    <Slider
                      value={[workDuration]}
                      onValueChange={(value) => setWorkDuration(value[0])}
                      max={120}
                      min={5}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Break Duration: {breakDuration} minutes</Label>
                    <Slider
                      value={[breakDuration]}
                      onValueChange={(value) => setBreakDuration(value[0])}
                      max={30}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Long Break Duration: {longBreakDuration} minutes</Label>
                    <Slider
                      value={[longBreakDuration]}
                      onValueChange={(value) => setLongBreakDuration(value[0])}
                      max={60}
                      min={10}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure alerts and reminders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { label: "Session start reminders", checked: true },
                    { label: "Break reminders", checked: true },
                    { label: "Daily goal notifications", checked: false },
                    { label: "Achievement unlocks", checked: true },
                    { label: "Productivity insights", checked: true }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Label>{item.label}</Label>
                      <Switch defaultChecked={item.checked} />
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Distraction Blocker</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Enable blocking</Label>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div>
                      <Label className="text-sm">Blocked websites:</Label>
                      <div className="mt-2 space-y-1">
                        {["facebook.com", "twitter.com", "instagram.com", "youtube.com"].map((site, index) => (
                          <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                            <span>{site}</span>
                            <Button size="sm" variant="ghost">
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button size="sm" variant="outline" className="mt-2">
                        Add Website
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Group Study Tab */}
        <TabsContent value="group" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Virtual Study Room
              </CardTitle>
              <CardDescription>
                Study together with friends in synchronized Pomodoro sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Group Session Mode</Label>
                    <Switch 
                      checked={groupSession} 
                      onCheckedChange={setGroupSession}
                    />
                  </div>

                  {groupSession && (
                    <div className="space-y-3">
                      <div>
                        <Label>Room Code</Label>
                        <div className="flex gap-2 mt-2">
                          <Input value="STUDY-2024" readOnly />
                          <Button size="sm" variant="outline">Copy</Button>
                        </div>
                      </div>

                      <div>
                        <Label>Group Members ({groupMembers.length}/8)</Label>
                        <div className="mt-2 space-y-2">
                          {groupMembers.map((member, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  member.status === 'working' ? 'bg-red-500' :
                                  member.status === 'break' ? 'bg-green-500' :
                                  'bg-gray-400'
                                }`} />
                                <span className={member.name === 'You' ? 'font-semibold' : ''}>
                                  {member.name}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {member.status === 'offline' ? 'Offline' :
                                 `${member.subject} • ${member.timeLeft}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full">
                        <Bell className="w-4 h-4 mr-2" />
                        Sync Session Start
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Chat (Break Time Only)</h3>
                  <div className="bg-gray-50 rounded-lg p-3 h-64 overflow-y-auto">
                    <div className="space-y-2 text-sm">
                      <div className="text-gray-500 text-center">
                        Chat will be enabled during break time
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Input placeholder="Type a message..." disabled />
                    <Button size="sm" disabled>Send</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gamification Tab */}
        <TabsContent value="gamification" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <achievement.icon className="w-5 h-5 text-yellow-500" />
                        <div>
                          <div className="font-semibold">{achievement.name}</div>
                          <div className="text-xs text-gray-500">{achievement.description}</div>
                        </div>
                      </div>
                      <Badge variant={achievement.progress === achievement.total ? "default" : "outline"}>
                        {achievement.progress}/{achievement.total}
                      </Badge>
                    </div>
                    <Progress value={(achievement.progress / achievement.total) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TreePine className="w-5 h-5 text-green-500" />
                  Focus Forest
                </CardTitle>
                <CardDescription>Watch your forest grow with each completed session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-6xl">🌳🌲🌱🍃</div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">23 Trees</div>
                    <div className="text-sm text-gray-500">23 completed sessions</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-green-800">Next Milestone</div>
                    <div className="text-xs text-green-600">Complete 27 more sessions to unlock the Golden Tree!</div>
                    <Progress value={46} className="h-2 mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Level & Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">Level 8</div>
                  <div className="text-sm text-gray-500">Focus Master</div>
                  <Progress value={75} className="h-2 mt-2" />
                  <div className="text-xs text-gray-500 mt-1">750/1000 XP to Level 9</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">2,350</div>
                  <div className="text-sm text-gray-500">Total Points</div>
                  <div className="text-xs text-yellow-600 mt-1">+150 this week</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">47</div>
                  <div className="text-sm text-gray-500">Rank</div>
                  <div className="text-xs text-orange-600 mt-1">Top 15%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on your study patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-sm">Optimal Schedule</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      You're most productive between 9-11 AM. Schedule challenging subjects during this time.
                    </p>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-sm">Performance Trend</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Your focus duration has improved by 23% this month. Great progress!
                    </p>
                  </div>

                  <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Battery className="w-4 h-4 text-orange-500" />
                      <span className="font-medium text-sm">Energy Correlation</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      High energy sessions have 34% better completion rates. Consider morning exercise.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span className="font-medium text-sm">Adaptive Suggestion</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      Based on your mood patterns, try 50-minute sessions when feeling energetic.
                    </p>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="font-medium text-sm">Wellbeing Alert</span>
                    </div>
                    <p className="text-sm text-red-700">
                      You've had 3 consecutive low-energy sessions. Consider taking a longer break.
                    </p>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-sm">Goal Adjustment</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      You're exceeding daily targets. Consider increasing to 8 sessions per day.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Daily Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Today's Performance:</strong> You completed 6 Pomodoros (3 hours of deep focus) across 3 subjects. 
                    Your average energy was 4.2/5, and you maintained a 95% completion rate. 
                    <strong>Tomorrow's recommendation:</strong> Start with Mathematics at 9 AM when your focus is peak, 
                    and consider using the 50-minute Deep Work preset for complex problem solving.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-4">
        <Button variant="outline" onClick={onClose}>
          Close Pomodoro Center
        </Button>
      </div>
    </div>
  );
};

// Active Recall Learning Center Component
const ActiveRecallCenter = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("flashcards");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [confidence, setConfidence] = useState(3);
  const [blankRecall, setBlankRecall] = useState("");
  const [teachBackRecording, setTeachBackRecording] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");

  // Sample flashcard data
  const flashcards = [
    {
      id: 1,
      front: "What is the capital of France?",
      back: "Paris",
      difficulty: "easy",
      nextReview: "2024-01-15",
      streak: 3
    },
    {
      id: 2,
      front: "Define photosynthesis",
      back: "The process by which plants convert light energy into chemical energy",
      difficulty: "medium",
      nextReview: "2024-01-16", 
      streak: 1
    },
    {
      id: 3,
      front: "Solve: 2x + 5 = 15",
      back: "x = 5",
      difficulty: "medium",
      nextReview: "2024-01-17",
      streak: 2
    }
  ];

  const quizQuestions = [
    {
      id: 1,
      question: "What is the powerhouse of the cell?",
      options: ["Nucleus", "Mitochondria", "Ribosome", "Vacuole"],
      correct: 1,
      type: "mcq"
    },
    {
      id: 2,
      question: "The formula for calculating area of a circle is ______",
      answer: "πr²",
      type: "fill-blank"
    }
  ];

  const recallChallenges = [
    { name: "Quick Fire", description: "Answer 10 questions in 2 minutes", icon: Zap, time: 120 },
    { name: "Memory Marathon", description: "Recall as many facts as possible in 5 minutes", icon: Trophy, time: 300 },
    { name: "Confidence Builder", description: "Practice with easy questions", icon: TrendingUp, time: 180 }
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 mb-6">
          <TabsTrigger value="flashcards" className="text-xs">
            <Repeat className="w-3 h-3 mr-1" />
            Flashcards
          </TabsTrigger>
          <TabsTrigger value="quiz" className="text-xs">
            <FileText className="w-3 h-3 mr-1" />
            Quiz Gen
          </TabsTrigger>
          <TabsTrigger value="blank-recall" className="text-xs">
            <Eye className="w-3 h-3 mr-1" />
            Blank Recall
          </TabsTrigger>
          <TabsTrigger value="teach-back" className="text-xs">
            <Mic className="w-3 h-3 mr-1" />
            Teach-Back
          </TabsTrigger>
          <TabsTrigger value="challenges" className="text-xs">
            <Trophy className="w-3 h-3 mr-1" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="text-xs">
            <BarChart3 className="w-3 h-3 mr-1" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="reminders" className="text-xs">
            <Bell className="w-3 h-3 mr-1" />
            Reminders
          </TabsTrigger>
        </TabsList>

        {/* Smart Flashcards Tab */}
        <TabsContent value="flashcards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-blue-500" />
                  Smart Flashcards with Spaced Repetition
                </CardTitle>
                <CardDescription>
                  AI-powered flashcards that adapt to your learning pace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload your notes or PDFs</p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>

                {/* Current Flashcard */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
                  <div className="text-center">
                    <Badge className="mb-4">{flashcards[currentFlashcard]?.difficulty}</Badge>
                    <h3 className="text-lg font-semibold mb-4">
                      {flashcards[currentFlashcard]?.front}
                    </h3>
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentFlashcard(prev => (prev + 1) % flashcards.length)}
                    >
                      Reveal Answer
                    </Button>
                  </div>
                </div>

                {/* Confidence Rating */}
                <div className="space-y-3">
                  <Label>How confident are you with this answer?</Label>
                  <Slider
                    value={[confidence]}
                    onValueChange={(value) => setConfidence(value[0])}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Not sure</span>
                    <span>Very confident</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-red-500 hover:bg-red-600">
                    Wrong (Review soon)
                  </Button>
                  <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600">
                    Okay (Review in 1 day)
                  </Button>
                  <Button className="flex-1 bg-green-500 hover:bg-green-600">
                    Perfect (Review in 3 days)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-gray-500">Retention Rate</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cards Mastered</span>
                    <span>42/60</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Today's Reviews</span>
                    <span>8/12</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <Badge className="w-full justify-center bg-green-100 text-green-800">
                  <Zap className="w-3 h-3 mr-1" />
                  5-day streak!
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quiz Generator Tab */}
        <TabsContent value="quiz" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                Self-Quiz Generator
              </CardTitle>
              <CardDescription>
                Automatically generate quizzes from your study materials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <FileText className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Upload notes to generate quiz</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Upload Notes
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Quiz Type</Label>
                    <Select defaultValue="mixed">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mcq">Multiple Choice</SelectItem>
                        <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                        <SelectItem value="short-answer">Short Answer</SelectItem>
                        <SelectItem value="mixed">Mixed Format</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Difficulty Level</Label>
                    <RadioGroup value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="easy" id="easy" />
                        <Label htmlFor="easy">Easy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hard" id="hard" />
                        <Label htmlFor="hard">Hard</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button className="w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Quiz
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Sample Question:</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium mb-3">{quizQuestions[0]?.question}</p>
                    <div className="space-y-2">
                      {quizQuestions[0]?.options?.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Checkbox />
                          <Label>{option}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <Badge>Confidence-based answering enabled</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blank Page Recall Tab */}
        <TabsContent value="blank-recall" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-500" />
                Blank Page Recall Mode
              </CardTitle>
              <CardDescription>
                Test your memory by recalling everything from a blank page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label>Select topic to recall:</Label>
                    <Select defaultValue="photosynthesis">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="photosynthesis">Photosynthesis</SelectItem>
                        <SelectItem value="world-war-2">World War 2</SelectItem>
                        <SelectItem value="calculus">Calculus Basics</SelectItem>
                        <SelectItem value="chemistry">Organic Chemistry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Context Hints */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm font-medium text-blue-800 mb-2">🧠 Context & Hints for "Photosynthesis":</div>
                    <div className="space-y-1 text-xs text-blue-700">
                      <p>• <strong>Definition:</strong> What is photosynthesis?</p>
                      <p>• <strong>Location:</strong> Where does it occur in plants?</p>
                      <p>• <strong>Inputs:</strong> What does the plant need?</p>
                      <p>• <strong>Outputs:</strong> What does it produce?</p>
                      <p>• <strong>Equation:</strong> Can you write the chemical formula?</p>
                      <p>• <strong>Importance:</strong> Why is it crucial for life?</p>
                      <p>• <strong>Process:</strong> Light-dependent vs light-independent reactions</p>
                    </div>
                    <div className="mt-2 text-xs text-blue-600 italic">
                      Try to recall as much as possible about each point above!
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Write everything you remember about this topic:</Label>
                    <Textarea
                      placeholder="Start typing everything you can recall about photosynthesis... Include definitions, processes, equations, examples, etc."
                      value={blankRecall}
                      onChange={(e) => setBlankRecall(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Mic className="w-4 h-4 mr-2" />
                      Voice Record
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Analyze Recall
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">AI Analysis Results:</h3>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium">Memory Accuracy: 78%</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>✅ Correctly recalled: Light reaction, Calvin cycle</p>
                      <p>⚠️ Partially correct: Chlorophyll function</p>
                      <p>❌ Missing concepts: ATP synthesis, Stomata role</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Suggestions for improvement:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Review the role of stomata in gas exchange</li>
                      <li>• Focus on ATP synthesis process</li>
                      <li>• Practice drawing the photosynthesis diagram</li>
                    </ul>
                  </div>

                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Compare with Original Notes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teach-Back Feature Tab */}
        <TabsContent value="teach-back" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-orange-500" />
                Teach-Back Feature
              </CardTitle>
              <CardDescription>
                Explain topics out loud to test your understanding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label>Choose a topic to explain:</Label>
                    <Select defaultValue="newton-laws">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newton-laws">Newton's Laws of Motion</SelectItem>
                        <SelectItem value="cell-division">Cell Division</SelectItem>
                        <SelectItem value="french-revolution">French Revolution</SelectItem>
                        <SelectItem value="quadratic-equations">Quadratic Equations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="bg-orange-50 rounded-full w-32 h-32 mx-auto flex items-center justify-center">
                      {teachBackRecording ? (
                        <div className="animate-pulse">
                          <Volume2 className="w-16 h-16 text-orange-500" />
                        </div>
                      ) : (
                        <Mic className="w-16 h-16 text-orange-500" />
                      )}
                    </div>

                    <div>
                      <Button
                        onClick={() => setTeachBackRecording(!teachBackRecording)}
                        className={`${teachBackRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                      >
                        {teachBackRecording ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start Explaining
                          </>
                        )}
                      </Button>
                    </div>

                    {teachBackRecording && (
                      <div className="text-sm text-orange-600">
                        Recording... Try explaining as if teaching a friend!
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Explanation Analysis:</h3>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Clarity Score</span>
                      <Badge className="bg-blue-100 text-blue-800">8.5/10</Badge>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">Strengths:</h4>
                    <ul className="text-sm space-y-1 text-green-700">
                      <li>✅ Clear introduction to the topic</li>
                      <li>✅ Good use of examples</li>
                      <li>✅ Logical flow of explanation</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Areas to improve:</h4>
                    <ul className="text-sm space-y-1 text-yellow-700">
                      <li>⚠️ Missing key formula: F = ma</li>
                      <li>⚠️ Could use more specific examples</li>
                      <li>⚠️ Conclusion could be stronger</li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <Badge className="bg-gold-100 text-gold-800">
                      <Star className="w-3 h-3 mr-1" />
                      +50 Explanation Points!
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gamified Challenges Tab */}
        <TabsContent value="challenges" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recallChallenges.map((challenge, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-2">
                    <challenge.icon className="w-8 h-8 text-purple-500" />
                  </div>
                  <CardTitle className="text-lg">{challenge.name}</CardTitle>
                  <CardDescription className="text-sm">{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Challenge Context Preview */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
                      <div className="text-xs font-medium text-blue-600 mb-1">SAMPLE QUESTIONS:</div>
                      {challenge.name === "Quick Fire" && (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-700">• What is 2 + 2? (Math)</p>
                          <p className="text-xs text-gray-700">• Capital of Spain? (Geography)</p>
                          <p className="text-xs text-gray-700">• H2O formula represents? (Chemistry)</p>
                        </div>
                      )}
                      {challenge.name === "Memory Marathon" && (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-700">• List periodic table elements</p>
                          <p className="text-xs text-gray-700">• Name historical events 1900-2000</p>
                          <p className="text-xs text-gray-700">• Recall mathematical formulas</p>
                        </div>
                      )}
                      {challenge.name === "Confidence Builder" && (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-700">• Basic multiplication tables</p>
                          <p className="text-xs text-gray-700">• Common vocabulary words</p>
                          <p className="text-xs text-gray-700">• Simple science facts</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        Duration: {Math.floor(challenge.time / 60)} minutes
                      </div>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        <Zap className="w-4 h-4 mr-1" />
                        Start Challenge
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Social Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-3">Leaderboard</h3>
                  <div className="space-y-2">
                    {[
                      { name: "You", score: 1250, rank: 3 },
                      { name: "Sarah M.", score: 1340, rank: 1 },
                      { name: "Alex K.", score: 1290, rank: 2 },
                      { name: "Maya P.", score: 1180, rank: 4 }
                    ].map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <Badge variant={user.rank <= 3 ? "default" : "outline"}>
                            #{user.rank}
                          </Badge>
                          <span className={user.name === "You" ? "font-bold" : ""}>{user.name}</span>
                        </div>
                        <span className="text-sm font-medium">{user.score} pts</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Your Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Current Streak</span>
                      <Badge className="bg-orange-100 text-orange-800">
                        <Activity className="w-3 h-3 mr-1" />
                        12 days
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Points</span>
                      <span className="font-semibold">1,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Challenges Completed</span>
                      <span className="font-semibold">47</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Score</span>
                      <span className="font-semibold">87%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Knowledge Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">87%</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "87%" }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">+5% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Today's Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">15/20</div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-gray-500 mt-2">5 more to complete</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-orange-500" />
                  12 days
                </div>
                <p className="text-xs text-gray-500">Best streak: 28 days</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Knowledge Heatmap</CardTitle>
              <CardDescription>Visual representation of your learning progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 49 }, (_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-sm ${
                      Math.random() > 0.7
                        ? "bg-green-500"
                        : Math.random() > 0.4
                        ? "bg-green-300"
                        : Math.random() > 0.2
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Less</span>
                <span>More</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">Review Chemistry Chapter 3</p>
                    <p className="text-xs text-gray-600">Due for review in 2 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <Brain className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-sm">Practice Math formulas</p>
                    <p className="text-xs text-gray-600">Accuracy dropped to 75%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">Great job on History!</p>
                    <p className="text-xs text-gray-600">Maintained 90% accuracy</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contextual Reminders Tab */}
        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                Contextual Recall Reminders
              </CardTitle>
              <CardDescription>
                Smart notifications to reinforce learning throughout your day
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label>Notification Frequency</Label>
                    <Select defaultValue="moderate">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light (3-5 per day)</SelectItem>
                        <SelectItem value="moderate">Moderate (6-10 per day)</SelectItem>
                        <SelectItem value="intensive">Intensive (11-15 per day)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Active Hours</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Start time</span>
                        <Input type="time" value="08:00" className="w-24" />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">End time</span>
                        <Input type="time" value="22:00" className="w-24" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Reminder Types</Label>
                    <div className="space-y-2">
                      {[
                        { id: "quick-quiz", label: "Quick Quiz Questions", checked: true },
                        { id: "concept-review", label: "Concept Reviews", checked: true },
                        { id: "formula-recall", label: "Formula Recall", checked: false },
                        { id: "vocab-practice", label: "Vocabulary Practice", checked: true }
                      ].map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox defaultChecked={item.checked} />
                          <Label>{item.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Sample Notifications:</h3>
                  
                  <div className="space-y-3">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Bell className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-sm">Quick Recall Challenge</span>
                        <Badge variant="outline" className="text-xs">Active</Badge>
                      </div>
                      
                      <div className="bg-white rounded p-3 mb-3 border border-blue-100">
                        <div className="text-xs text-blue-600 font-medium mb-1">PHYSICS QUESTION:</div>
                        <p className="text-sm font-medium text-gray-800 mb-2">
                          "What is Newton's 2nd Law and provide a real-world example?"
                        </p>
                        <div className="text-xs text-gray-600">
                          Context: Classical Mechanics • Force and Motion • F = ma
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="default" className="flex-1">
                          <Brain className="w-3 h-3 mr-1" />
                          Answer Now
                        </Button>
                        <Button size="sm" variant="ghost">Skip</Button>
                      </div>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-sm">Location-based</span>
                      </div>
                      <p className="text-sm">"Since you're at the library, here's a quick chemistry review!"</p>
                    </div>

                    <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span className="font-medium text-sm">Time-based</span>
                      </div>
                      <p className="text-sm">"Good morning! Ready for today's math practice?"</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-2">Smart Features:</h4>
                    <ul className="text-xs space-y-1 text-gray-600">
                      <li>• Adapts to your schedule and location</li>
                      <li>• Focuses on topics you're struggling with</li>
                      <li>• Avoids interrupting during busy times</li>
                      <li>• Tracks your response patterns</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  Save Reminder Settings
                </Button>
                <Button variant="outline" className="flex-1">
                  Test Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-4">
        <Button variant="outline" onClick={onClose}>
          Close Learning Center
        </Button>
      </div>
    </div>
  );
};

// Pomodoro Timer Component
const PomodoroTimer = ({ session, setSession, onClose }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setSession(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const resetTimer = () => {
    setSession(prev => ({
      ...prev,
      timeLeft: prev.isBreak ? 5 * 60 : 25 * 60,
      isActive: false
    }));
  };

  const skipSession = () => {
    if (session.isBreak) {
      // End break, start new work session
      setSession(prev => ({
        ...prev,
        timeLeft: 25 * 60,
        isBreak: false,
        isActive: false
      }));
    } else {
      // End work session, start break
      const newSessionCount = session.sessionCount + 1;
      const isLongBreak = newSessionCount % 4 === 0;
      setSession(prev => ({
        ...prev,
        timeLeft: isLongBreak ? 15 * 60 : 5 * 60,
        isBreak: true,
        isActive: false,
        sessionCount: newSessionCount
      }));
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (session.isActive && session.timeLeft > 0) {
      interval = setInterval(() => {
        setSession(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (session.timeLeft === 0 && session.isActive) {
      // Auto-switch to break or work
      skipSession();
    }

    return () => clearInterval(interval);
  }, [session.isActive, session.timeLeft]);

  const progress = session.isBreak 
    ? ((5 * 60 - session.timeLeft) / (5 * 60)) * 100
    : ((25 * 60 - session.timeLeft) / (25 * 60)) * 100;

  return (
    <div className="space-y-6 py-4">
      {/* Timer Display */}
      <div className="text-center">
        <div className="text-6xl font-mono font-bold text-primary mb-2">
          {formatTime(session.timeLeft)}
        </div>
        <div className="text-sm text-muted-foreground">
          Session {session.sessionCount + 1} • {session.isBreak ? 'Break Time' : 'Focus Time'}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="text-xs text-center text-muted-foreground">
          {session.isBreak ? 'Break Progress' : 'Focus Progress'}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTimer}
          className="flex items-center gap-2"
        >
          {session.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {session.isActive ? 'Pause' : 'Start'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={resetTimer}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={skipSession}
          className="flex items-center gap-2"
        >
          Skip
        </Button>
      </div>

      {/* Session Stats */}
      <div className="text-center text-sm text-muted-foreground">
        <div>Completed Sessions: {session.sessionCount}</div>
        <div className="mt-2">
          Next: {session.isBreak ? 'Focus Session' : 'Break Time'}
        </div>
      </div>

      {/* Close Button */}
      <div className="text-center pt-2">
        <Button variant="ghost" size="sm" onClick={onClose}>
          End Session
        </Button>
      </div>
    </div>
  );
};

export default StudySmart;