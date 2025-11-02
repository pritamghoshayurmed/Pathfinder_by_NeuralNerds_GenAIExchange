import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Code2, MessageSquare, Layers, Users, TrendingUp, Award, Download, RotateCcw, Home, Sparkles, Target, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const InterviewSummary = () => {
  const navigate = useNavigate();

  const roundScores = [
    {
      icon: Code2,
      title: "Machine Coding",
      score: 85,
      feedback: "Good code quality with optimal solution. Strong use of hash maps and clear variable naming. Consider edge cases more thoroughly.",
      color: "text-blue-400",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageSquare,
      title: "Technical Discussion",
      score: 90,
      feedback: "Excellent explanation of concepts and trade-offs. Clear communication and deep understanding of algorithms. Well articulated complexity analysis.",
      color: "text-purple-400",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Layers,
      title: "System Design",
      score: 78,
      feedback: "Solid architecture design with good component breakdown. Could improve on scalability discussions and database choice justification.",
      color: "text-orange-400",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Users,
      title: "Behavioral",
      score: 88,
      feedback: "Great examples using STAR method. Shows good self-awareness and growth mindset. Strong leadership and collaboration skills.",
      color: "text-green-400",
      gradient: "from-green-500 to-emerald-500"
    },
  ];

  const overallScore = Math.round(
    roundScores.reduce((acc, round) => acc + round.score, 0) / roundScores.length
  );

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-orange-400";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 85) return { message: "Outstanding Performance!", emoji: "🎉", color: "text-green-400" };
    if (score >= 70) return { message: "Great Job!", emoji: "👏", color: "text-blue-400" };
    return { message: "Good Effort! Keep Practicing", emoji: "💪", color: "text-orange-400" };
  };

  const scoreMessage = getScoreMessage(overallScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-primary via-accent to-primary flex items-center justify-center shadow-2xl animate-pulse">
                <CheckCircle2 className="w-14 h-14 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-3">
              Interview Complete!
            </h1>
            <p className="text-muted-foreground text-lg">
              Congratulations! You've completed all four rounds. Here's your comprehensive performance summary.
            </p>
            <Badge className="mt-3" variant="secondary">
              <Brain className="w-3 h-3 mr-1" />
              AI-Powered Analysis
            </Badge>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="bg-card/50 backdrop-blur-sm border-border shadow-2xl">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Award className="w-7 h-7 text-primary" />
              Overall Performance Score
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="flex items-center justify-center gap-12 flex-wrap">
              {/* Circular Score */}
              <div className="relative inline-block">
                <svg className="w-48 h-48" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={`${overallScore * 2.83} 283`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}</div>
                    <div className="text-sm text-muted-foreground">/100</div>
                  </div>
                </div>
              </div>

              {/* Score Details */}
              <div className="text-left space-y-4">
                <div>
                  <p className={`text-3xl font-bold ${scoreMessage.color} mb-2`}>
                    {scoreMessage.message} {scoreMessage.emoji}
                  </p>
                  <p className="text-muted-foreground">
                    You've demonstrated strong skills across all interview rounds
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                    <div className="text-xs text-muted-foreground mb-1">Average Score</div>
                    <div className="text-2xl font-bold text-primary">{overallScore}%</div>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg border border-accent/30">
                    <div className="text-xs text-muted-foreground mb-1">Rounds Completed</div>
                    <div className="text-2xl font-bold text-accent">4/4</div>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                    <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
                    <div className="text-2xl font-bold text-green-400">100%</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Round-by-Round Breakdown */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Round-by-Round Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roundScores.map((round, idx) => {
              const Icon = round.icon;
              return (
                <Card key={idx} className="bg-card/50 backdrop-blur-sm border-border shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="pb-3 border-b border-border">
                    <CardTitle className="flex items-center gap-3 text-base">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${round.gradient}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div>{round.title}</div>
                        <div className="text-xs text-muted-foreground font-normal">Round {idx + 1}</div>
                      </div>
                      <Badge className={`${round.color} bg-transparent`}>
                        {round.score}/100
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${round.gradient} transition-all duration-1000 shadow-lg`}
                        style={{ width: `${round.score}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{round.feedback}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Key Strengths & Areas for Improvement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border shadow-xl">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="w-6 h-6 text-green-400" />
                Key Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Strong problem-solving approach with optimal solutions</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Clear and effective communication of technical concepts</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Good understanding of system design principles and architecture</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Well-structured behavioral responses using STAR method</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border shadow-xl">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="w-6 h-6 text-orange-400" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                  <div className="w-5 h-5 rounded-full border-2 border-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Practice more comprehensive edge case handling</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                  <div className="w-5 h-5 rounded-full border-2 border-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Deepen scalability and performance optimization discussions</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                  <div className="w-5 h-5 rounded-full border-2 border-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Focus on advanced time complexity optimization techniques</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                  <div className="w-5 h-5 rounded-full border-2 border-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">More detailed explanations of system component interactions</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center pt-6 flex-wrap">
          <Button
            onClick={() => navigate("/dashboard/skill-development/interview-prep")}
            className="bg-gradient-to-r from-primary via-accent to-primary hover:opacity-90 transition-opacity shadow-lg px-8 py-6 text-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Start New Interview
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="border-border px-8 py-6 text-lg hover:bg-muted"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/skill-development/interview-prep")}
            className="border-border px-8 py-6 text-lg hover:bg-muted"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSummary;
