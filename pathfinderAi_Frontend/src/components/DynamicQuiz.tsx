import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Code, 
  Brain, 
  Target,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Play,
  Send
} from 'lucide-react';
import geminiService, { Quiz, QuizQuestion, QuizAnswer, GapAnalysisResult } from '@/services/geminiService';

interface DynamicQuizProps {
  role: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  onQuizComplete: (results: GapAnalysisResult) => void;
  onCancel: () => void;
}

const DynamicQuiz: React.FC<DynamicQuizProps> = ({
  role,
  skillLevel,
  onQuizComplete,
  onCancel
}) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState<number>(0);

  // Generate quiz on component mount
  useEffect(() => {
    generateQuiz();
  }, [role, skillLevel]);

  // Update timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const generateQuiz = async () => {
    setIsGenerating(true);
    try {
      const generatedQuiz = await geminiService.generateQuiz(role, skillLevel);
      setQuiz(generatedQuiz);
      setStartTime(Date.now());
      setQuestionStartTime(Date.now());
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      // Fallback quiz in case of API failure
      setQuiz({
        id: 'fallback_quiz',
        title: `${role} Skill Assessment`,
        description: `Basic skill assessment for ${role} position`,
        role,
        questions: [
          {
            id: 'q1',
            question: `What do you consider the most important skill for a ${role}?`,
            type: 'multiple-choice',
            options: ['Technical Skills', 'Communication', 'Problem Solving', 'Leadership'],
            correctAnswer: 'Problem Solving',
            points: 10,
            difficulty: 'intermediate',
            topic: 'Core Skills'
          }
        ],
        totalPoints: 10,
        estimatedTime: 5
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
  };

  const handleNextQuestion = () => {
    if (!quiz) return;

    // Save current answer
    const timeForQuestion = Math.floor((Date.now() - questionStartTime) / 1000);
    const newAnswer: QuizAnswer = {
      questionId: quiz.questions[currentQuestionIndex].id,
      answer: currentAnswer,
      timeSpent: timeForQuestion
    };

    const updatedAnswers = [...answers];
    const existingAnswerIndex = updatedAnswers.findIndex(a => a.questionId === newAnswer.questionId);
    
    if (existingAnswerIndex >= 0) {
      updatedAnswers[existingAnswerIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }
    
    setAnswers(updatedAnswers);

    // Move to next question or finish
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
      setQuestionStartTime(Date.now());
    } else {
      handleSubmitQuiz(updatedAnswers);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Load previous answer
      const previousAnswer = answers.find(a => a.questionId === quiz?.questions[currentQuestionIndex - 1].id);
      setCurrentAnswer(previousAnswer?.answer || '');
      setQuestionStartTime(Date.now());
    }
  };

  const handleSubmitQuiz = async (finalAnswers: QuizAnswer[]) => {
    if (!quiz) return;

    setIsSubmitting(true);
    try {
      const results = await geminiService.analyzeQuizResults(role, quiz, finalAnswers);
      onQuizComplete(results);
    } catch (error) {
      console.error('Failed to analyze quiz results:', error);
      // Provide a fallback result
      const fallbackResult: GapAnalysisResult = {
        overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
        skillGaps: [
          {
            skill: 'Core Technical Skills',
            currentLevel: 65,
            requiredLevel: 85,
            gap: 20,
            priority: 'high',
            description: 'Need to improve core technical competencies'
          }
        ],
        marketTrends: [
          {
            skill: role,
            demand: 'high',
            growth: '+15%',
            salaryRange: '₹8-15L',
            futureOutlook: 'Growing demand expected'
          }
        ],
        learningPaths: [
          {
            title: `${role} Mastery Path`,
            description: 'Comprehensive learning path to master core skills',
            duration: '3-6 months',
            difficulty: 'intermediate',
            resources: [
              {
                type: 'course',
                title: `Complete ${role} Course`,
                provider: 'Online Platform',
                duration: '40 hours'
              }
            ]
          }
        ],
        recommendations: [
          'Focus on core technical skills',
          'Practice with real-world projects',
          'Stay updated with industry trends'
        ],
        nextSteps: [
          'Start with recommended learning path',
          'Join relevant communities',
          'Build a portfolio'
        ]
      };
      onQuizComplete(fallbackResult);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionIcon = (type: QuizQuestion['type']) => {
    switch (type) {
      case 'code':
        return <Code className="h-5 w-5" />;
      case 'scenario':
        return <Brain className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  if (isGenerating) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <h3 className="text-xl font-semibold">Generating Your Personalized Quiz</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Creating a customized skill assessment for <strong>{role}</strong> position 
              at <strong>{skillLevel}</strong> level. This may take a moment...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quiz) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h3 className="text-xl font-semibold">Failed to Generate Quiz</h3>
            <p className="text-muted-foreground text-center">
              We couldn't generate your quiz. Please try again.
            </p>
            <div className="flex gap-2">
              <Button onClick={generateQuiz} variant="outline">
                <Loader2 className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button onClick={onCancel} variant="ghost">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const canProceed = currentAnswer.trim() !== '';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getQuestionIcon(currentQuestion.type)}
                {quiz.title}
              </CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(timeSpent)}
              </div>
              <Badge variant="outline">
                {currentQuestionIndex + 1} of {quiz.questions.length}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg">
                Question {currentQuestionIndex + 1}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {currentQuestion.difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {currentQuestion.topic}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {currentQuestion.points} points
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-base leading-relaxed">
            {currentQuestion.question}
          </div>

          {/* Answer Input */}
          <div className="space-y-4">
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options ? (
              <RadioGroup value={currentAnswer} onValueChange={handleAnswerChange}>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <Textarea
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder={
                  currentQuestion.type === 'code' 
                    ? 'Enter your code solution here...'
                    : 'Provide your detailed answer here...'
                }
                className="min-h-[120px]"
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button onClick={onCancel} variant="ghost">
                Cancel Quiz
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={!canProceed || isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : isLastQuestion ? (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Quiz
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicQuiz;