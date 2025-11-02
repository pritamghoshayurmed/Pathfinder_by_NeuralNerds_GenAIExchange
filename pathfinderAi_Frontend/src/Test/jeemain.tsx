import React, { useState, useEffect, useCallback } from 'react';
import { Clock, ChevronLeft, ChevronRight, Flag, BookOpen, CheckCircle, XCircle, AlertTriangle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from "react-router-dom";

// Real JEE Main Questions Database
const jeeMainQuestions = {
  Physics: [
    {
      question: "A particle of mass m moves in a circular path of radius r. If the centripetal force is F, what is the velocity of the particle?",
      options: ["√(Fr/m)", "√(F/mr)", "√(Fm/r)", "√(Frm)"],
      correctAnswer: 0,
      topic: "Circular Motion"
    },
    {
      question: "The electric field at a distance r from a point charge Q is E. What is the electric field at distance 2r?",
      options: ["E/4", "E/2", "2E", "4E"],
      correctAnswer: 0,
      topic: "Electrostatics"
    },
    {
      question: "A convex lens of focal length 20 cm forms a real image at a distance of 60 cm from the lens. The object distance is:",
      options: ["30 cm", "15 cm", "12 cm", "10 cm"],
      correctAnswer: 0,
      topic: "Optics"
    },
    {
      question: "The de Broglie wavelength of an electron accelerated through a potential difference V is:",
      options: ["h/√(2meV)", "h√(2meV)", "h/(2meV)", "2h/√(meV)"],
      correctAnswer: 0,
      topic: "Modern Physics"
    },
    {
      question: "A simple pendulum has a time period T. If the length is increased by 21%, the new time period is:",
      options: ["1.1T", "1.21T", "0.9T", "0.81T"],
      correctAnswer: 0,
      topic: "Simple Harmonic Motion"
    },
    {
      question: "The coefficient of restitution for a perfectly elastic collision is:",
      options: ["1", "0", "0.5", "∞"],
      correctAnswer: 0,
      topic: "Collision"
    },
    {
      question: "In a uniform magnetic field B, a charged particle moves in a circle of radius r. If the charge is doubled, the radius becomes:",
      options: ["2r", "r/2", "r", "4r"],
      correctAnswer: 0,
      topic: "Magnetic Effects"
    },
    {
      question: "The escape velocity from Earth's surface is approximately:",
      options: ["11.2 km/s", "7.9 km/s", "9.8 km/s", "15.0 km/s"],
      correctAnswer: 0,
      topic: "Gravitation"
    },
    {
      question: "In an AC circuit, the power factor is the cosine of the phase difference between:",
      options: ["Voltage and current", "Voltage and resistance", "Current and resistance", "Voltage and impedance"],
      correctAnswer: 0,
      topic: "AC Circuits"
    },
    {
      question: "The work function of a metal is 2.5 eV. The threshold frequency for photoelectric effect is:",
      options: ["6.05 × 10¹⁴ Hz", "3.78 × 10¹⁴ Hz", "4.2 × 10¹⁴ Hz", "5.1 × 10¹⁴ Hz"],
      correctAnswer: 0,
      topic: "Photoelectric Effect"
    }
  ],
  Chemistry: [
    {
      question: "The IUPAC name of CH₃-CH(CH₃)-CH₂-CH₃ is:",
      options: ["2-methylbutane", "3-methylbutane", "pentane", "2-ethylpropane"],
      correctAnswer: 0,
      topic: "Organic Chemistry"
    },
    {
      question: "The oxidation state of chromium in K₂Cr₂O₇ is:",
      options: ["+6", "+3", "+2", "+7"],
      correctAnswer: 0,
      topic: "Inorganic Chemistry"
    },
    {
      question: "According to Le Chatelier's principle, increasing pressure favors the formation of:",
      options: ["Fewer moles of gas", "More moles of gas", "Equal moles of gas", "No effect on equilibrium"],
      correctAnswer: 0,
      topic: "Chemical Equilibrium"
    },
    {
      question: "The pH of 0.01 M HCl solution is:",
      options: ["2", "1", "0.01", "12"],
      correctAnswer: 0,
      topic: "Ionic Equilibrium"
    },
    {
      question: "Which of the following has the highest boiling point?",
      options: ["H₂O", "H₂S", "H₂Se", "H₂Te"],
      correctAnswer: 0,
      topic: "Hydrogen Bonding"
    },
    {
      question: "The electronic configuration of Cu²⁺ ion is:",
      options: ["[Ar] 3d⁹", "[Ar] 3d¹⁰ 4s¹", "[Ar] 3d⁸ 4s¹", "[Ar] 3d¹⁰"],
      correctAnswer: 0,
      topic: "Atomic Structure"
    },
    {
      question: "In the reaction: 2A + B → C, if the rate of disappearance of A is 4 × 10⁻³ M/s, the rate of disappearance of B is:",
      options: ["2 × 10⁻³ M/s", "4 × 10⁻³ M/s", "8 × 10⁻³ M/s", "1 × 10⁻³ M/s"],
      correctAnswer: 0,
      topic: "Chemical Kinetics"
    },
    {
      question: "The hybridization of carbon in CH₄ is:",
      options: ["sp³", "sp²", "sp", "sp³d"],
      correctAnswer: 0,
      topic: "Chemical Bonding"
    },
    {
      question: "Which of the following is an aldol condensation product?",
      options: ["CH₃CH=CHCHO", "CH₃COCH₃", "CH₃CH₂OH", "CH₃COOH"],
      correctAnswer: 0,
      topic: "Aldehydes and Ketones"
    },
    {
      question: "The number of unpaired electrons in Fe³⁺ (Z=26) is:",
      options: ["5", "3", "1", "0"],
      correctAnswer: 0,
      topic: "Coordination Chemistry"
    }
  ],
  Mathematics: [
    {
      question: "If f(x) = x³ - 3x + 1, then f'(1) is:",
      options: ["0", "3", "-3", "1"],
      correctAnswer: 0,
      topic: "Differentiation"
    },
    {
      question: "The value of ∫₀^π sin²x dx is:",
      options: ["π/2", "π", "0", "2π"],
      correctAnswer: 0,
      topic: "Integration"
    },
    {
      question: "If the roots of x² - px + q = 0 are α and β, then α + β equals:",
      options: ["p", "-p", "q", "-q"],
      correctAnswer: 0,
      topic: "Quadratic Equations"
    },
    {
      question: "The number of ways to arrange the letters of 'MATHEMATICS' is:",
      options: ["4989600", "39916800", "1663200", "831600"],
      correctAnswer: 0,
      topic: "Permutations and Combinations"
    },
    {
      question: "If |z₁| = 3 and |z₂| = 4, then the maximum value of |z₁ + z₂| is:",
      options: ["7", "1", "5", "12"],
      correctAnswer: 0,
      topic: "Complex Numbers"
    },
    {
      question: "The eccentricity of the hyperbola x²/16 - y²/9 = 1 is:",
      options: ["5/4", "3/4", "4/5", "9/16"],
      correctAnswer: 0,
      topic: "Conic Sections"
    },
    {
      question: "If A = [1 2; 3 4], then det(A) is:",
      options: ["-2", "2", "10", "-10"],
      correctAnswer: 0,
      topic: "Matrices and Determinants"
    },
    {
      question: "The sum of first n natural numbers is:",
      options: ["n(n+1)/2", "n(n-1)/2", "n²", "(n+1)²/2"],
      correctAnswer: 0,
      topic: "Sequences and Series"
    },
    {
      question: "In a triangle ABC, if a = 5, b = 7, c = 8, then cos A is:",
      options: ["5/7", "7/8", "1/2", "√3/2"],
      correctAnswer: 0,
      topic: "Trigonometry"
    },
    {
      question: "The probability of getting exactly 2 heads in 4 tosses of a fair coin is:",
      options: ["3/8", "1/4", "1/2", "1/8"],
      correctAnswer: 0,
      topic: "Probability"
    }
  ]
};

// Mock API function with real questions
const mockAPI = {
  getQuestions: (examId) => {
    const examPatterns = {
      'JEE_MAIN': {
        name: 'JEE Main',
        duration: 180, // 3 hours in minutes
        sections: [
          { subject: 'Physics', questions: 25 },
          { subject: 'Chemistry', questions: 25 },
          { subject: 'Mathematics', questions: 25 }
        ]
      }
    };

    const pattern = examPatterns[examId] || examPatterns['JEE_MAIN'];
    const questions = [];
    let questionId = 1;

    pattern.sections.forEach(section => {
      const subjectQuestions = jeeMainQuestions[section.subject] || [];
      
      for (let i = 0; i < section.questions; i++) {
        // Cycle through available questions and repeat if necessary
        const questionData = subjectQuestions[i % subjectQuestions.length];
        questions.push({
          id: questionId++,
          subject: section.subject,
          question: questionData.question,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
          topic: questionData.topic,
          marks: 4,
          negativeMarks: 1
        });
      }
    });

    return {
      exam: pattern,
      questions: questions,
      totalQuestions: questions.length,
      totalMarks: questions.length * 4
    };
  }
};

// Timer Component
const Timer = ({ timeLeft, onTimeUp }) => {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatTime = (time) => time.toString().padStart(2, '0');

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  const isLowTime = timeLeft < 300; // Last 5 minutes

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        isLowTime ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
      }`}
    >
      <Clock className={`w-5 h-5 ${isLowTime ? 'animate-pulse' : ''}`} />
      <span className="font-mono text-lg font-bold">
        {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
      </span>
    </div>
  );
};

// Question Card Component
const QuestionCard = ({ question, selectedAnswer, onAnswerSelect, questionNumber }) => {
  const getSubjectColor = (subject) => {
    const colors = {
      Physics: 'bg-blue-100 text-blue-800',
      Chemistry: 'bg-green-100 text-green-800',
      Mathematics: 'bg-purple-100 text-purple-800'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-lg px-3 py-1">
              Q{questionNumber}
            </Badge>
            <Badge className={getSubjectColor(question.subject)}>
              {question.subject}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {question.topic}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Marks: +{question.marks} | -{question.negativeMarks}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Change question text color to white */}
          <p className="text-lg leading-relaxed text-white">{question.question}</p>
          
          <div className="grid gap-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => onAnswerSelect(index)}
                className={`p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50 text-black'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-black'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  {/* Keep option text color black */}
                  <span className="text-black">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Question Navigation Grid
const QuestionNavGrid = ({ totalQuestions, currentQuestion, answers, onQuestionSelect }) => {
  const getQuestionStatus = (index) => {
    const questionNum = index + 1;
    const isAnswered = answers[questionNum] !== undefined;
    const isCurrent = questionNum === currentQuestion;

    if (isCurrent) return 'bg-blue-500 text-white';
    if (isAnswered) return 'bg-green-500 text-white';
    return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Question Navigation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }, (_, index) => (
            <button
              key={index}
              onClick={() => onQuestionSelect(index + 1)}
              className={`w-10 h-10 rounded text-sm font-bold transition-all ${getQuestionStatus(index)}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded border"></div>
            <span>Not Visited</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Results Page Component
const ResultsPage = ({ results, examData, onRestart }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const { totalQuestions, correctAnswers, wrongAnswers, unattempted, score, percentage, timeSpent, subjectWiseResults } = results;

  const getScoreColor = (percent) => {
    if (percent >= 80) return 'text-green-600';
    if (percent >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const estimatedRank = Math.floor(Math.random() * 5000) + 1000; // Mock rank

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Test Completed!
          </CardTitle>
          <p className="text-muted-foreground">{examData.exam.name} Results</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
                {percentage.toFixed(1)}%
              </div>
              <div className="text-muted-foreground">Overall Score</div>
              <div className="text-2xl font-bold text-blue-600">{score}/{examData.totalMarks}</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">#{estimatedRank}</div>
              <div className="text-muted-foreground">Estimated Rank</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-600">{timeSpent}</div>
              <div className="text-muted-foreground">Time Taken</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{wrongAnswers}</div>
              <div className="text-sm text-muted-foreground">Wrong</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-600">{unattempted}</div>
              <div className="text-sm text-muted-foreground">Unattempted</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>

          {/* Subject-wise breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Subject-wise Performance</h3>
            {Object.entries(subjectWiseResults).map(([subject, result]) => {
              const subjectResult = result as {
                correct: number;
                wrong: number;
                unattempted: number;
                attempted: number;
                total: number;
                score: number;
                maxScore: number;
                percentage: number;
              };

              return (
                <div key={subject} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-semibold">{subject}</div>
                    <div className="text-sm text-muted-foreground">
                      {subjectResult.correct}/{subjectResult.total} correct • Score: {subjectResult.score}/{subjectResult.maxScore}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Attempted: {subjectResult.attempted} • Wrong: {subjectResult.wrong} • Unattempted: {subjectResult.unattempted}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={subjectResult.percentage} className="w-24" />
                    <span className={`font-bold ${getScoreColor(subjectResult.percentage)}`}>
                      {subjectResult.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button onClick={onRestart} variant="outline">
              Take Another Test
            </Button>
            {/* Change button text and link to MockTests */}
            <Button onClick={() => navigate('/dashboard/decision-making/mock-tests')}>
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Mock Test Page Component
const MockTestPage = () => {
  const [examId] = useState('JEE_MAIN');
  const [examData, setExamData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [results, setResults] = useState(null);

  // Initialize exam data
  useEffect(() => {
    const data = mockAPI.getQuestions(examId);
    setExamData(data);
    setTimeLeft(data.exam.duration * 60); // Convert minutes to seconds
  }, [examId]);

  // Timer countdown
  useEffect(() => {
    if (!isTestStarted || isTestCompleted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestStarted, isTestCompleted, timeLeft]);

  const handleStartTest = () => {
    setIsTestStarted(true);
  };

  const handleAnswerSelect = useCallback((answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  }, [currentQuestion]);

  const handleQuestionNavigation = (direction) => {
    if (direction === 'next' && currentQuestion < examData.totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
    } else if (direction === 'prev' && currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleQuestionSelect = (questionNumber) => {
    setCurrentQuestion(questionNumber);
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let score = 0;
    
    // Initialize subject-wise results
    const subjectWiseResults = {
      Physics: { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 25, score: 0, maxScore: 100, percentage: 0 },
      Chemistry: { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 25, score: 0, maxScore: 100, percentage: 0 },
      Mathematics: { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 25, score: 0, maxScore: 100, percentage: 0 }
    };

    // Calculate results for each question
    examData.questions.forEach((question, index) => {
      const questionId = index + 1;
      const selectedAnswer = answers[questionId];
      const subject = question.subject;
      
      if (selectedAnswer !== undefined) {
        subjectWiseResults[subject].attempted++;
        
        if (question.correctAnswer === selectedAnswer) {
          correctAnswers++;
          subjectWiseResults[subject].correct++;
          score += question.marks;
          subjectWiseResults[subject].score += question.marks;
        } else {
          wrongAnswers++;
          subjectWiseResults[subject].wrong++;
          score -= question.negativeMarks;
          subjectWiseResults[subject].score -= question.negativeMarks;
        }
      } else {
        subjectWiseResults[subject].unattempted++;
      }
    });

    // Calculate percentages for each subject
    Object.keys(subjectWiseResults).forEach(subject => {
      const subjectData = subjectWiseResults[subject];
      subjectData.score = Math.max(0, subjectData.score); // No negative scores
      subjectData.percentage = (subjectData.score / subjectData.maxScore) * 100;
    });

    const unattempted = examData.totalQuestions - Object.keys(answers).length;
    const percentage = (Math.max(0, score) / examData.totalMarks) * 100;
    const timeSpentMinutes = Math.floor((examData.exam.duration * 60 - timeLeft) / 60);
    const timeSpentSeconds = (examData.exam.duration * 60 - timeLeft) % 60;
    const timeSpent = `${timeSpentMinutes}m ${timeSpentSeconds}s`;

    return {
      totalQuestions: examData.totalQuestions,
      correctAnswers,
      wrongAnswers,
      unattempted,
      score: Math.max(0, score),
      percentage: Math.max(0, percentage),
      timeSpent,
      subjectWiseResults
    };
  };

  const handleSubmitTest = () => {
    const testResults = calculateResults();
    setResults(testResults);
    setIsTestCompleted(true);
    setShowSubmitConfirm(false);
  };

  const handleRestart = () => {
    setCurrentQuestion(1);
    setAnswers({});
    setIsTestStarted(false);
    setIsTestCompleted(false);
    setResults(null);
    setShowSubmitConfirm(false);
    if (examData) {
      setTimeLeft(examData.exam.duration * 60);
    }
  };

  if (!examData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (isTestCompleted && results) {
    return <ResultsPage results={results} examData={examData} onRestart={handleRestart} />;
  }

  if (!isTestStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">{examData.exam.name}</CardTitle>
            <p className="text-muted-foreground">Mock Test Instructions</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  {/* Change duration text color to dark blue */}
                  <div className="text-2xl font-bold text-blue-800">{examData.exam.duration} min</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  {/* Change questions text color to dark green */}
                  <div className="text-2xl font-bold text-green-800">{examData.totalQuestions}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  {/* Change total marks text color to dark yellow */}
                  <div className="text-2xl font-bold text-yellow-800">{examData.totalMarks}</div>
                  <div className="text-sm text-muted-foreground">Total Marks</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Instructions:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Each correct answer carries 4 marks</li>
                  <li>• Each wrong answer has negative marking of 1 mark</li>
                  <li>• You can navigate between questions and change your answers</li>
                  <li>• Test will auto-submit when time expires</li>
                  <li>• Make sure you have stable internet connection</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Subject Distribution:</h3>
                {examData.exam.sections.map((section, index) => (
                  <div key={index} className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>{section.subject}</span>
                    <span className="font-semibold">{section.questions} questions</span>
                  </div>
                ))}
              </div>

              <Button onClick={handleStartTest} className="w-full" size="lg">
                Start Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestionData = examData.questions[currentQuestion - 1];

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Add animated rectangles */}
      <div className="absolute inset-0 z-0">
        <div className="animate-pulse bg-gray-700 opacity-50 w-32 h-32 rounded-lg absolute top-10 left-10"></div>
        <div className="animate-pulse bg-gray-700 opacity-50 w-40 h-40 rounded-lg absolute bottom-20 right-20"></div>
        <div className="animate-pulse bg-gray-700 opacity-50 w-24 h-24 rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Header */}
      <div className="bg-gray-800 border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">{examData.exam.name}</h1>
              <p className="text-sm text-gray-400">
                Question {currentQuestion} of {examData.totalQuestions}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Timer timeLeft={timeLeft} onTimeUp={handleSubmitTest} />
              <Button
                variant="destructive"
                onClick={() => setShowSubmitConfirm(true)}
              >
                Submit Test
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Area */}
          <div className="lg:col-span-3 backdrop-blur-md bg-gray-800/50 rounded-lg p-6 shadow-lg">
            <QuestionCard
              question={currentQuestionData}
              selectedAnswer={answers[currentQuestion]}
              onAnswerSelect={handleAnswerSelect}
              questionNumber={currentQuestion}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => handleQuestionNavigation('prev')}
                disabled={currentQuestion === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Mark for review functionality can be added here
                  }}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Mark for Review
                </Button>

                <Button
                  onClick={() => handleQuestionNavigation('next')}
                  disabled={currentQuestion === examData.totalQuestions}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="backdrop-blur-md bg-gray-800/50 rounded-lg p-6 shadow-lg">
            <QuestionNavGrid
              totalQuestions={examData.totalQuestions}
              currentQuestion={currentQuestion}
              answers={answers}
              onQuestionSelect={handleQuestionSelect}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-white">Test Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Answered:</span>
                    <span className="font-semibold text-green-400">
                      {Object.keys(answers).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Remaining:</span>
                    <span className="font-semibold text-red-400">
                      {examData.totalQuestions - Object.keys(answers).length}
                    </span>
                  </div>
                  <Progress 
                    value={(Object.keys(answers).length / examData.totalQuestions) * 100} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Submit Test</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-white">
                Are you sure you want to submit the test? You have answered{' '}
                <strong>{Object.keys(answers).length}</strong> out of{' '}
                <strong>{examData.totalQuestions}</strong> questions.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitTest}
                  className="flex-1"
                >
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const JEEAdvancedTestPage = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    // Update test completion count
    fetch("http://localhost:3001/api/jeemain/test-completed", {
      method: "POST",
    }).catch((error) => console.error("Error updating test completion:", error));
  };

  const handleSubmitTest = (score, rank) => {
    const result = {
      exam: "JEE Main",
      score,
      rank,
      date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
    };

    // Send result to backend
    fetch("http://localhost:3001/api/results/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Result added:", data);
        navigate("/dashboard/decision-making/mock-tests");
      })
      .catch((error) => console.error("Error adding result:", error));
  };

  return (
    <div>
      {/* Start Test Button */}
      <button onClick={handleStartTest}>Start Test</button>

      {/* Submit Test Button */}
      <button onClick={() => handleSubmitTest(85, 1245)}>Submit Test</button>
    </div>
  );
};

export default MockTestPage;