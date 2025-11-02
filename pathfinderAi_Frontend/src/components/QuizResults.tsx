import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  Star, 
  ExternalLink,
  Download,
  ArrowUp,
  ArrowDown,
  Minus,
  DollarSign,
  Calendar,
  Award,
  Brain,
  Lightbulb,
  FileText,
  Play
} from 'lucide-react';
import { GapAnalysisResult, SkillGap, MarketTrend, LearningPath } from '@/services/geminiService';
import LearningGoalsManager from './LearningGoalsManager';
import LearningScheduler from './LearningScheduler';

interface QuizResultsProps {
  results: GapAnalysisResult;
  role: string;
  onRetakeQuiz: () => void;
  onStartLearning: (path: LearningPath) => void;
  onClose: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  results,
  role,
  onRetakeQuiz,
  onStartLearning,
  onClose
}) => {
  const [showGoalsManager, setShowGoalsManager] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-400" />;
    if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
    return <AlertTriangle className="h-5 w-5 text-red-400" />;
  };

  const getPriorityColor = (priority: SkillGap['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
    }
  };

  const getDemandColor = (demand: MarketTrend['demand']) => {
    switch (demand) {
      case 'very-high': return 'text-green-400';
      case 'high': return 'text-blue-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-gray-400';
    }
  };

  const getDemandIcon = (demand: MarketTrend['demand']) => {
    switch (demand) {
      case 'very-high': return <ArrowUp className="h-4 w-4 text-green-400" />;
      case 'high': return <ArrowUp className="h-4 w-4 text-blue-400" />;
      case 'medium': return <Minus className="h-4 w-4 text-yellow-400" />;
      case 'low': return <ArrowDown className="h-4 w-4 text-gray-400" />;
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'certification': return <Award className="h-4 w-4" />;
      case 'project': return <Star className="h-4 w-4" />;
      case 'article': return <FileText className="h-4 w-4" />;
      case 'tutorial': return <Play className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Overall Score Header */}
      <Card className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 border-slate-700 text-white">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2 text-white">
                {getScoreIcon(results.overallScore)}
                {role} Skill Assessment Results
              </CardTitle>
              <CardDescription className="text-slate-300">
                Your comprehensive skill analysis and personalized recommendations
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-5xl font-bold ${
                results.overallScore >= 80 ? 'text-green-400' :
                results.overallScore >= 60 ? 'text-yellow-400' :
                'text-red-400'
              } drop-shadow-lg`}>
                {results.overallScore}%
              </div>
              <div className="text-sm text-slate-300">Overall Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Button onClick={onRetakeQuiz} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Target className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/10">
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="gaps" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gaps">Skill Gaps</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="learning">Learning Paths</TabsTrigger>
          <TabsTrigger value="recommendations">Action Plan</TabsTrigger>
        </TabsList>

        {/* Skill Gaps Tab */}
        <TabsContent value="gaps" className="space-y-4">
          <div className="grid gap-4">
            {results.skillGaps.map((gap, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {gap.skill}
                      </CardTitle>
                      <CardDescription>{gap.description}</CardDescription>
                    </div>
                    <Badge variant={getPriorityColor(gap.priority)}>
                      {gap.priority} priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Current Level</div>
                        <div className="text-2xl font-semibold text-blue-600">
                          {gap.currentLevel}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Required Level</div>
                        <div className="text-2xl font-semibold text-green-600">
                          {gap.requiredLevel}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Gap to Close</div>
                        <div className="text-2xl font-semibold text-red-600">
                          {gap.gap}%
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress to Target</span>
                        <span>{gap.currentLevel}% / {gap.requiredLevel}%</span>
                      </div>
                      <Progress value={(gap.currentLevel / gap.requiredLevel) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Market Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4">
            {results.marketTrends.map((trend, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        {trend.skill}
                      </CardTitle>
                      <CardDescription>{trend.futureOutlook}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getDemandIcon(trend.demand)}
                      <span className={`text-sm font-medium ${getDemandColor(trend.demand)}`}>
                        {trend.demand.replace('-', ' ')} demand
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="text-sm text-muted-foreground">Growth Rate</div>
                        <div className="font-semibold text-green-600">{trend.growth}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="text-sm text-muted-foreground">Salary Range</div>
                        <div className="font-semibold text-blue-600">{trend.salaryRange}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <div>
                        <div className="text-sm text-muted-foreground">Market Position</div>
                        <div className="font-semibold text-purple-600 capitalize">
                          {trend.demand.replace('-', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Learning Paths Tab */}
        <TabsContent value="learning" className="space-y-4">
          <div className="grid gap-4">
            {results.learningPaths.map((path, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {path.title}
                      </CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{path.difficulty}</Badge>
                      <Badge variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        {path.duration}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      {path.resources.map((resource, resourceIndex) => (
                        <div
                          key={resourceIndex}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
                          onClick={() => {
                            // Open resource in new tab or handle based on type
                            if (resource.url) {
                              window.open(resource.url, '_blank');
                            } else {
                              // For resources without URLs, show a message or handle differently
                              console.log(`Accessing ${resource.title} from ${resource.provider}`);
                            }
                          }}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {getResourceIcon(resource.type)}
                            <div className="flex-1">
                              <div className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {resource.title}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {resource.provider} • {resource.duration}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                              {resource.type}
                            </Badge>
                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => onStartLearning(path)} className="flex-1">
                        <Star className="h-4 w-4 mr-2" />
                        Start Learning Path
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View All Resources
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>
                  Personalized suggestions based on your assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium">{recommendation}</span>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            Learn More
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs">
                            Add to Goals
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Immediate Next Steps
                </CardTitle>
                <CardDescription>
                  Your action plan to get started right away
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium">{step}</span>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Mark Complete
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Progress Tracker
              </CardTitle>
              <CardDescription>
                Track your progress through recommended learning paths
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.learningPaths.slice(0, 1).map((path, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{path.title}</span>
                      <Badge variant="outline">0% Complete</Badge>
                    </div>
                    <Progress value={0} className="h-2" />
                    <div className="text-sm text-muted-foreground">
                      {path.resources.length} resources • {path.duration}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Button 
                  className="h-16 flex-col gap-2"
                  onClick={() => {
                    if (results.learningPaths.length > 0) {
                      onStartLearning(results.learningPaths[0]);
                    }
                  }}
                >
                  <BookOpen className="h-6 w-6" />
                  <span className="text-sm font-medium">Start Recommended Path</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-2"
                  onClick={() => setShowGoalsManager(true)}
                >
                  <Target className="h-6 w-6" />
                  <span className="text-sm font-medium">Set Learning Goals</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-2"
                  onClick={() => setShowScheduler(true)}
                >
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm font-medium">Schedule Learning</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Learning Goals Manager Modal */}
      {showGoalsManager && (
        <LearningGoalsManager 
          onClose={() => setShowGoalsManager(false)}
          skillGaps={results.skillGaps}
        />
      )}

      {/* Learning Scheduler Modal */}
      {showScheduler && (
        <LearningScheduler 
          onClose={() => setShowScheduler(false)}
          learningPaths={results.learningPaths}
        />
      )}
    </div>
  );
};

export default QuizResults;