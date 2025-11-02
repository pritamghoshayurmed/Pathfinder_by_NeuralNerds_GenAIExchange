import { useState } from "react";
import { Heart, Smile, Cloud, Zap, Music, Sun, Moon, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";

const StressRelief = () => {
  const [currentMood, setCurrentMood] = useState<string>("neutral");
  const [breathingActive, setBreathingActive] = useState(false);

  const moodOptions = [
    { id: "happy", emoji: "😊", label: "Happy", color: "bg-green-500" },
    { id: "neutral", emoji: "😐", label: "Neutral", color: "bg-yellow-500" },
    { id: "stressed", emoji: "😰", label: "Stressed", color: "bg-orange-500" },
    { id: "anxious", emoji: "😟", label: "Anxious", color: "bg-red-500" },
    { id: "tired", emoji: "😴", label: "Tired", color: "bg-blue-500" }
  ];

  const relaxationTechniques = [
    {
      id: "breathing",
      title: "4-7-8 Breathing",
      description: "Simple breathing technique to calm your mind instantly",
      duration: "5 minutes",
      difficulty: "Beginner",
      icon: Cloud,
      color: "from-blue-400 to-blue-600",
      steps: [
        "Inhale through nose for 4 counts",
        "Hold breath for 7 counts",
        "Exhale through mouth for 8 counts",
        "Repeat 4-6 times"
      ],
      benefits: ["Reduces anxiety", "Improves sleep", "Lowers stress", "Increases focus"]
    },
    {
      id: "progressive",
      title: "Progressive Muscle Relaxation",
      description: "Tense and relax muscle groups to release physical tension",
      duration: "10-15 minutes",
      difficulty: "Beginner",
      icon: Activity,
      color: "from-green-400 to-green-600",
      steps: [
        "Start with toes, tense for 5 seconds",
        "Release and notice the relaxation",
        "Move up to calves, thighs, etc.",
        "End with facial muscles"
      ],
      benefits: ["Releases tension", "Improves body awareness", "Better sleep", "Reduces pain"]
    },
    {
      id: "visualization",
      title: "Guided Visualization",
      description: "Use your imagination to visit peaceful places",
      duration: "10 minutes",
      difficulty: "Medium",
      icon: Sun,
      color: "from-yellow-400 to-orange-500",
      steps: [
        "Close eyes and breathe deeply",
        "Imagine a peaceful place",
        "Engage all five senses",
        "Stay there as long as you like"
      ],
      benefits: ["Reduces worry", "Improves mood", "Enhances creativity", "Builds confidence"]
    },
    {
      id: "mindfulness",
      title: "5-4-3-2-1 Grounding",
      description: "Ground yourself using your five senses",
      duration: "3-5 minutes",
      difficulty: "Beginner",
      icon: Zap,
      color: "from-purple-400 to-purple-600",
      steps: [
        "5 things you can see",
        "4 things you can touch",
        "3 things you can hear",
        "2 things you can smell",
        "1 thing you can taste"
      ],
      benefits: ["Stops panic", "Brings awareness", "Reduces overwhelm", "Instant relief"]
    }
  ];

  const quickActivities = [
    {
      title: "Take 10 Deep Breaths",
      icon: Cloud,
      duration: "1 min",
      type: "Breathing"
    },
    {
      title: "Listen to Calming Music",
      icon: Music,
      duration: "5 min",
      type: "Audio"
    },
    {
      title: "Gentle Stretching",
      icon: Activity,
      duration: "3 min",
      type: "Movement"
    },
    {
      title: "Positive Affirmations",
      icon: Heart,
      duration: "2 min",
      type: "Mental"
    }
  ];

  const stressSignals = [
    { signal: "Difficulty concentrating", severity: "medium", tips: "Take regular breaks, try the Pomodoro technique" },
    { signal: "Feeling overwhelmed", severity: "high", tips: "Break tasks into smaller steps, prioritize important ones" },
    { signal: "Physical tension", severity: "medium", tips: "Try progressive muscle relaxation, gentle stretching" },
    { signal: "Sleep problems", severity: "high", tips: "Practice bedtime routine, avoid screens before sleep" },
    { signal: "Irritability", severity: "low", tips: "Take deep breaths, go for a short walk" }
  ];

  const dailyWellnessTips = [
    "Start your day with 3 deep breaths",
    "Take a 5-minute walk between study sessions",
    "Listen to your favorite song when feeling down",
    "Write down 3 things you're grateful for",
    "Do 5 minutes of gentle stretching",
    "Call a friend or family member",
    "Practice the 5-4-3-2-1 grounding technique"
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <DashboardLayout 
      title="Stress Relief & Wellness" 
      description="Take care of your mental health with mindfulness and relaxation"
    >
      <div className="p-6 space-y-8">
        {/* Mood Check-in */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6" />
            How are you feeling today? 💝
          </h2>
          <p className="text-muted-foreground mb-4">
            Check in with yourself. It's okay to not feel perfect - we're here to help you feel better.
          </p>
          <div className="flex gap-3 flex-wrap">
            {moodOptions.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setCurrentMood(mood.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  currentMood === mood.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="font-medium">{mood.label}</span>
              </button>
            ))}
          </div>
          {currentMood && (
            <div className="mt-4 p-4 bg-white/50 rounded-lg">
              <p className="text-sm">
                {currentMood === "happy" && "That's wonderful! Keep that positive energy going. Maybe try some gratitude exercises to maintain this feeling."}
                {currentMood === "neutral" && "That's perfectly normal. Everyone has neutral days. Why not try a quick mood-boosting activity?"}
                {currentMood === "stressed" && "It's okay to feel stressed sometimes. Let's try some relaxation techniques to help you feel calmer."}
                {currentMood === "anxious" && "Anxiety can be tough, but you're not alone. Breathing exercises and grounding techniques can really help."}
                {currentMood === "tired" && "Rest is important! Consider some gentle stretching or a short mindfulness exercise before your next break."}
              </p>
            </div>
          )}
        </div>

        <Tabs defaultValue="techniques" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="techniques">Relaxation</TabsTrigger>
            <TabsTrigger value="quick">Quick Relief</TabsTrigger>
            <TabsTrigger value="signals">Stress Signals</TabsTrigger>
            <TabsTrigger value="daily">Daily Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="techniques" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relaxationTechniques.map((technique) => (
                <Card key={technique.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${technique.color} flex items-center justify-center`}>
                        <technique.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="outline">{technique.difficulty}</Badge>
                    </div>
                    <CardTitle className="text-lg">{technique.title}</CardTitle>
                    <CardDescription>{technique.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Duration: {technique.duration}</span>
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
                    
                    <Button className="w-full">Try This Technique</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quick" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stress Relief (Under 5 minutes)</CardTitle>
                <CardDescription>When you need immediate help feeling better</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActivities.map((activity, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <activity.icon className="w-5 h-5 text-primary" />
                        <span className="font-medium">{activity.title}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground mb-3">
                        <span>{activity.duration}</span>
                        <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                      </div>
                      <Button size="sm" className="w-full">Start Now</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Breathing Exercise Widget */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Breathing Exercise</CardTitle>
                <CardDescription>Follow the circle to breathe in sync</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className={`w-32 h-32 rounded-full border-4 border-primary transition-all duration-4000 ${
                    breathingActive ? 'scale-125 bg-primary/20' : 'scale-100 bg-primary/10'
                  }`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {breathingActive ? 'Breathe' : 'Ready?'}
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={() => setBreathingActive(!breathingActive)}
                  className="w-full"
                >
                  {breathingActive ? 'Stop' : 'Start'} Breathing Exercise
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recognize Your Stress Signals</CardTitle>
                <CardDescription>Learn to identify when you need to take a break</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stressSignals.map((item, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(item.severity)}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{item.signal}</span>
                        <Badge variant="outline" className={`${getSeverityColor(item.severity)} border-0`}>
                          {item.severity}
                        </Badge>
                      </div>
                      <p className="text-sm">{item.tips}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>When to Seek Help</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">It's important to talk to someone if you experience:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Persistent feelings of sadness or anxiety</li>
                    <li>• Sleep problems lasting more than a week</li>
                    <li>• Difficulty concentrating on daily activities</li>
                    <li>• Physical symptoms like headaches or stomach aches</li>
                    <li>• Feeling overwhelmed most of the time</li>
                  </ul>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      Remember: Asking for help is a sign of strength, not weakness. 
                      Talk to a parent, teacher, counselor, or trusted adult.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Wellness Tips</CardTitle>
                <CardDescription>Small actions that make a big difference</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dailyWellnessTips.map((tip, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {index + 1}
                      </div>
                      <span className="text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Create Your Calm Corner</CardTitle>
                <CardDescription>Design a space for relaxation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Physical Space:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Comfortable seating (chair, cushion, or bed)</li>
                      <li>• Soft lighting or natural light</li>
                      <li>• Keep it clean and clutter-free</li>
                      <li>• Add something that makes you happy</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Relaxation Tools:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Calming music playlist</li>
                      <li>• Essential oils or pleasant scents</li>
                      <li>• Stress ball or fidget toy</li>
                      <li>• Journal for writing thoughts</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StressRelief;
