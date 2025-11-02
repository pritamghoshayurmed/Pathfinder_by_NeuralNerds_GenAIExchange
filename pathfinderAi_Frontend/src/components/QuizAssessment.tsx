import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, Trophy, RotateCcw } from 'lucide-react';
import { QuizQuestion, getQuestionsBySkill, getSkillById } from '@/data/skillsData';

interface QuizAssessmentProps {
  skillId: string;
  onComplete: (score: number, skillLevel: number) => void;
  onCancel: () => void;
}

interface QuizState {
  currentQuestionIndex: number;
  answers: number[];
  showResults: boolean;
  score: number;
  timeStarted: Date;
  timePerQuestion: number[];
}

const QuizAssessment: React.FC<QuizAssessmentProps> = ({
  skillId,
  onComplete,
  onCancel
}) => {
  const questions = getQuestionsBySkill(skillId);
  const skill = getSkillById(skillId);
  
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: [],
    showResults: false,
    score: 0,
    timeStarted: new Date(),
    timePerQuestion: []
  });

  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const currentQuestion = questions[quizState.currentQuestionIndex];
  const progress = ((quizState.currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = useCallback(() => {
    if (selectedAnswer === null) return;

    const timeSpent = new Date().getTime() - questionStartTime.getTime();
    const newTimePerQuestion = [...quizState.timePerQuestion, timeSpent / 1000];
    const newAnswers = [...quizState.answers, selectedAnswer];

    if (quizState.currentQuestionIndex === questions.length - 1) {
      // Quiz completed
      const totalScore = newAnswers.reduce((sum, answer, index) => {
        return sum + (answer === questions[index].correctAnswer ? questions[index].points : 0);
      }, 0);

      const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
      const scorePercentage = Math.round((totalScore / maxScore) * 100);
      
      // Calculate skill level based on performance
      const skillLevel = calculateSkillLevel(scorePercentage, newTimePerQuestion, questions);

      setQuizState(prev => ({
        ...prev,
        answers: newAnswers,
        showResults: true,
        score: scorePercentage,
        timePerQuestion: newTimePerQuestion
      }));

      onComplete(scorePercentage, skillLevel);
    } else {
      // Next question
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        answers: newAnswers,
        timePerQuestion: newTimePerQuestion
      }));
      
      setSelectedAnswer(null);
      setQuestionStartTime(new Date());
    }
  }, [selectedAnswer, questionStartTime, quizState, questions, onComplete]);

  const calculateSkillLevel = (score: number, times: number[], questions: QuizQuestion[]): number => {
    // Base skill level on score
    let skillLevel = score;

    // Adjust based on question difficulty and time taken
    const avgTimePerQuestion = times.reduce((sum, time) => sum + time, 0) / times.length;
    
    // Bonus for quick answers (under 30 seconds)
    if (avgTimePerQuestion < 30) {
      skillLevel += 5;
    }

    // Penalty for very slow answers (over 120 seconds)
    if (avgTimePerQuestion > 120) {
      skillLevel -= 5;
    }

    // Adjust based on difficulty distribution
    const difficultyBonus = questions.reduce((bonus, q, index) => {
      const isCorrect = quizState.answers[index] === q.correctAnswer;
      if (isCorrect) {
        switch (q.difficulty) {
          case 'advanced': return bonus + 3;
          case 'intermediate': return bonus + 2;
          case 'beginner': return bonus + 1;
          default: return bonus;
        }
      }
      return bonus;
    }, 0);

    skillLevel += difficultyBonus;

    return Math.min(Math.max(skillLevel, 0), 100);
  };

  const restartQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: [],
      showResults: false,
      score: 0,
      timeStarted: new Date(),
      timePerQuestion: []
    });
    setSelectedAnswer(null);
    setQuestionStartTime(new Date());
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Expert';
    if (score >= 75) return 'Advanced';
    if (score >= 60) return 'Intermediate';
    return 'Beginner';
  };

  if (!skill || questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No quiz questions available for this skill.</p>
          <Button onClick={onCancel} className="mt-4">Go Back</Button>
        </CardContent>
      </Card>
    );
  }

  if (quizState.showResults) {
    const totalTime = Math.round(
      quizState.timePerQuestion.reduce((sum, time) => sum + time, 0)
    );

    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
          <CardDescription>Here are your results for {skill.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Overview */}
          <div className="text-center space-y-4">
            <div className={`text-6xl font-bold ${getScoreColor(quizState.score)}`}>
              {quizState.score}%
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {getScoreLabel(quizState.score)} Level
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">
                {quizState.answers.filter((answer, i) => answer === questions[i].correctAnswer).length}
              </div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{questions.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{totalTime}s</div>
              <div className="text-sm text-muted-foreground">Time</div>
            </div>
          </div>

          {/* Question Review */}
          <div className="space-y-3">
            <h3 className="font-semibold">Question Review</h3>
            {questions.map((question, index) => {
              const isCorrect = quizState.answers[index] === question.correctAnswer;
              const userAnswer = quizState.answers[index];
              
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.question}</p>
                      <div className="text-sm space-y-1">
                        <p className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                          Your answer: {question.options[userAnswer]}
                        </p>
                        {!isCorrect && (
                          <p className="text-green-600">
                            Correct answer: {question.options[question.correctAnswer]}
                          </p>
                        )}
                        <p className="text-muted-foreground italic">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={restartQuiz} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
            <Button onClick={onCancel} className="flex-1">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{skill.name} Assessment</CardTitle>
            <CardDescription>
              Question {quizState.currentQuestionIndex + 1} of {questions.length}
            </CardDescription>
          </div>
          <Badge variant="outline">
            <Clock className="w-4 h-4 mr-1" />
            Quiz
          </Badge>
        </div>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Question */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={
              currentQuestion.difficulty === 'advanced' ? 'destructive' :
              currentQuestion.difficulty === 'intermediate' ? 'default' : 'secondary'
            }>
              {currentQuestion.difficulty}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {currentQuestion.points} points
            </span>
          </div>
          
          <h3 className="text-xl font-semibold mb-6">
            {currentQuestion.question}
          </h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  selectedAnswer === index
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-2 h-2 bg-current rounded-full" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
          >
            {quizState.currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizAssessment;