import React, { useState, useEffect, useCallback } from 'react';
import { Clock, ChevronLeft, ChevronRight, Flag, BookOpen, CheckCircle, XCircle, AlertTriangle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from "react-router-dom";

// Real CUET Questions Database
const cuetQuestions = {
  "General Test": [
    {
      question: "Who was the first woman Prime Minister of India?",
      options: ["Sarojini Naidu", "Indira Gandhi", "Sonia Gandhi", "Pratibha Patil"],
      correctAnswer: 1,
      topic: "Indian History",
      difficulty: "Easy"
    },
    {
      question: "Which of the following is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      correctAnswer: 2,
      topic: "World Geography",
      difficulty: "Medium"
    },
    {
      question: "The book 'Wings of Fire' is the autobiography of:",
      options: ["Vikram Sarabhai", "A.P.J. Abdul Kalam", "Homi Bhabha", "C.V. Raman"],
      correctAnswer: 1,
      topic: "Literature",
      difficulty: "Easy"
    },
    {
      question: "Which Indian state has the longest coastline?",
      options: ["Maharashtra", "Gujarat", "Tamil Nadu", "Andhra Pradesh"],
      correctAnswer: 1,
      topic: "Indian Geography",
      difficulty: "Medium"
    },
    {
      question: "The headquarters of UNESCO is located in:",
      options: ["New York", "Geneva", "Paris", "Vienna"],
      correctAnswer: 2,
      topic: "International Organizations",
      difficulty: "Medium"
    },
    {
      question: "Who composed the national anthem of India?",
      options: ["Bankim Chandra Chattopadhyay", "Rabindranath Tagore", "Subhash Chandra Bose", "Mahatma Gandhi"],
      correctAnswer: 1,
      topic: "National Symbols",
      difficulty: "Easy"
    },
    {
      question: "The Chipko movement was primarily associated with:",
      options: ["Forest conservation", "Women's rights", "Nuclear disarmament", "Child labor"],
      correctAnswer: 0,
      topic: "Environmental Movements",
      difficulty: "Medium"
    },
    {
      question: "Which planet is known as the 'Red Planet'?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1,
      topic: "Astronomy",
      difficulty: "Easy"
    },
    {
      question: "The currency of Japan is:",
      options: ["Yuan", "Won", "Yen", "Ringgit"],
      correctAnswer: 2,
      topic: "World Economics",
      difficulty: "Easy"
    },
    {
      question: "Who was the first Indian to win a Nobel Prize?",
      options: ["C.V. Raman", "Rabindranath Tagore", "Mother Teresa", "Amartya Sen"],
      correctAnswer: 1,
      topic: "Nobel Laureates",
      difficulty: "Medium"
    }
  ],
  "English": [
    {
      question: "Choose the correct synonym for 'Abundant':",
      options: ["Scarce", "Plentiful", "Limited", "Rare"],
      correctAnswer: 1,
      topic: "Vocabulary",
      difficulty: "Easy"
    },
    {
      question: "Identify the figure of speech in: 'The wind whispered through the trees'",
      options: ["Metaphor", "Simile", "Personification", "Alliteration"],
      correctAnswer: 2,
      topic: "Figures of Speech",
      difficulty: "Medium"
    },
    {
      question: "Choose the correct passive voice for: 'She writes a letter'",
      options: ["A letter is written by her", "A letter was written by her", "A letter has been written by her", "A letter will be written by her"],
      correctAnswer: 0,
      topic: "Grammar",
      difficulty: "Medium"
    },
    {
      question: "Which of the following is a compound sentence?",
      options: ["I went to the store.", "I went to the store, but it was closed.", "Going to the store.", "The closed store."],
      correctAnswer: 1,
      topic: "Sentence Structure",
      difficulty: "Medium"
    },
    {
      question: "The antonym of 'Optimistic' is:",
      options: ["Hopeful", "Pessimistic", "Confident", "Positive"],
      correctAnswer: 1,
      topic: "Vocabulary",
      difficulty: "Easy"
    },
    {
      question: "Identify the error in: 'Neither of the boys have completed their homework'",
      options: ["Neither", "boys", "have", "their"],
      correctAnswer: 2,
      topic: "Subject-Verb Agreement",
      difficulty: "Hard"
    },
    {
      question: "Choose the correct spelling:",
      options: ["Accomodate", "Accommodate", "Acommodate", "Acomodate"],
      correctAnswer: 1,
      topic: "Spelling",
      difficulty: "Medium"
    },
    {
      question: "The phrase 'Beat around the bush' means:",
      options: ["To be direct", "To avoid the topic", "To be violent", "To garden"],
      correctAnswer: 1,
      topic: "Idioms",
      difficulty: "Medium"
    },
    {
      question: "Which is the correct preposition: 'She is good ___ mathematics'",
      options: ["in", "at", "on", "for"],
      correctAnswer: 1,
      topic: "Prepositions",
      difficulty: "Easy"
    },
    {
      question: "Identify the part of speech of 'quickly' in: 'She ran quickly'",
      options: ["Noun", "Verb", "Adjective", "Adverb"],
      correctAnswer: 3,
      topic: "Parts of Speech",
      difficulty: "Easy"
    }
  ],
  "Quantitative Aptitude": [
    {
      question: "If the ratio of two numbers is 3:4 and their sum is 35, find the larger number.",
      options: ["15", "20", "21", "28"],
      correctAnswer: 1,
      topic: "Ratio and Proportion",
      difficulty: "Medium"
    },
    {
      question: "What is 25% of 200?",
      options: ["25", "50", "75", "100"],
      correctAnswer: 1,
      topic: "Percentage",
      difficulty: "Easy"
    },
    {
      question: "A train travels 120 km in 2 hours. What is its speed in km/hr?",
      options: ["40", "50", "60", "70"],
      correctAnswer: 2,
      topic: "Speed, Time, Distance",
      difficulty: "Easy"
    },
    {
      question: "The compound interest on Rs. 1000 for 2 years at 10% per annum is:",
      options: ["Rs. 200", "Rs. 210", "Rs. 220", "Rs. 230"],
      correctAnswer: 1,
      topic: "Compound Interest",
      difficulty: "Medium"
    },
    {
      question: "If log₁₀ 2 = 0.3010, then log₁₀ 20 = ?",
      options: ["0.6020", "1.3010", "3.010", "0.3010"],
      correctAnswer: 1,
      topic: "Logarithms",
      difficulty: "Hard"
    },
    {
      question: "The area of a circle with radius 7 cm is:",
      options: ["154 cm²", "144 cm²", "168 cm²", "176 cm²"],
      correctAnswer: 0,
      topic: "Mensuration",
      difficulty: "Medium"
    },
    {
      question: "Solve: 2x + 5 = 15",
      options: ["5", "10", "7.5", "2.5"],
      correctAnswer: 0,
      topic: "Linear Equations",
      difficulty: "Easy"
    },
    {
      question: "The HCF of 48 and 18 is:",
      options: ["6", "8", "12", "18"],
      correctAnswer: 0,
      topic: "Number Theory",
      difficulty: "Medium"
    },
    {
      question: "If sin θ = 3/5, then cos θ = ?",
      options: ["4/5", "3/4", "5/4", "5/3"],
      correctAnswer: 0,
      topic: "Trigonometry",
      difficulty: "Medium"
    },
    {
      question: "The next term in the series 2, 6, 12, 20, 30, ? is:",
      options: ["40", "42", "45", "48"],
      correctAnswer: 1,
      topic: "Number Series",
      difficulty: "Hard"
    }
  ],
  "Logical Reasoning": [
    {
      question: "If CODING is written as DPEJOH, how is FLOWER written?",
      options: ["GMPXFS", "GMPWER", "FLOWES", "GKPVDQ"],
      correctAnswer: 0,
      topic: "Coding-Decoding",
      difficulty: "Medium"
    },
    {
      question: "Find the odd one out: Dog, Cat, Cow, Lion",
      options: ["Dog", "Cat", "Cow", "Lion"],
      correctAnswer: 2,
      topic: "Classification",
      difficulty: "Easy"
    },
    {
      question: "If today is Wednesday, what day will it be after 100 days?",
      options: ["Monday", "Tuesday", "Wednesday", "Friday"],
      correctAnswer: 3,
      topic: "Calendar",
      difficulty: "Medium"
    },
    {
      question: "Complete the series: ACE, BDF, CEG, ?",
      options: ["DFH", "DEF", "CFH", "DGI"],
      correctAnswer: 0,
      topic: "Letter Series",
      difficulty: "Medium"
    },
    {
      question: "If A = 1, B = 2, C = 3, then FACE = ?",
      options: ["21", "22", "23", "24"],
      correctAnswer: 1,
      topic: "Number-Letter Coding",
      difficulty: "Easy"
    },
    {
      question: "Mirror image of AMBULANCE as seen in a rear-view mirror:",
      options: ["ECNALUBMA", "AMBULANCE", "ƎƆИA⅃UᙠMA", "AMBULANƆƎ"],
      correctAnswer: 0,
      topic: "Mirror Images",
      difficulty: "Hard"
    },
    {
      question: "If North becomes East, East becomes South, then West becomes:",
      options: ["North", "South", "East", "West"],
      correctAnswer: 0,
      topic: "Direction Sense",
      difficulty: "Medium"
    },
    {
      question: "Find the missing number: 2, 6, 12, 20, ?",
      options: ["28", "30", "32", "35"],
      correctAnswer: 1,
      topic: "Number Patterns",
      difficulty: "Medium"
    },
    {
      question: "If FRIEND is coded as HUMJTK, then MOTHER is coded as:",
      options: ["OQVJGT", "ORVJGS", "OQWJGT", "PRUJGS"],
      correctAnswer: 0,
      topic: "Coding-Decoding",
      difficulty: "Hard"
    },
    {
      question: "Blood relation: A is B's sister. B is C's mother. D is C's brother. How is A related to D?",
      options: ["Mother", "Sister", "Aunt", "Daughter"],
      correctAnswer: 2,
      topic: "Blood Relations",
      difficulty: "Medium"
    }
  ],
  "Current Affairs": [
    {
      question: "Who is the current President of India (as of 2024)?",
      options: ["Ram Nath Kovind", "Draupadi Murmu", "Pranab Mukherjee", "A.P.J. Abdul Kalam"],
      correctAnswer: 1,
      topic: "Indian Politics",
      difficulty: "Easy"
    },
    {
      question: "Which country hosted the 2024 Olympics?",
      options: ["Japan", "France", "USA", "Australia"],
      correctAnswer: 1,
      topic: "Sports",
      difficulty: "Easy"
    },
    {
      question: "The G20 Summit 2023 was held in:",
      options: ["New Delhi", "Bali", "Rome", "Riyadh"],
      correctAnswer: 0,
      topic: "International Relations",
      difficulty: "Medium"
    },
    {
      question: "Which Indian state recently became the 29th state?",
      options: ["Telangana", "Uttarakhand", "Jharkhand", "Chhattisgarh"],
      correctAnswer: 0,
      topic: "Indian States",
      difficulty: "Medium"
    },
    {
      question: "The mission to study the Sun launched by India is:",
      options: ["Mangalyaan", "Chandrayaan", "Aditya L1", "Gaganyaan"],
      correctAnswer: 2,
      topic: "Space Missions",
      difficulty: "Medium"
    },
    {
      question: "Which payment system was launched by India for international transactions?",
      options: ["BHIM", "UPI", "RuPay", "CBDC"],
      correctAnswer: 3,
      topic: "Economy",
      difficulty: "Hard"
    },
    {
      question: "The UN Climate Change Conference COP28 was held in:",
      options: ["Egypt", "UK", "UAE", "Poland"],
      correctAnswer: 2,
      topic: "Environment",
      difficulty: "Medium"
    },
    {
      question: "Who won the Nobel Prize in Literature 2023?",
      options: ["Annie Ernaux", "Jon Fosse", "Abdulrazak Gurnah", "Louise Glück"],
      correctAnswer: 1,
      topic: "Awards",
      difficulty: "Hard"
    },
    {
      question: "India's rank in the Global Hunger Index 2023:",
      options: ["107", "111", "116", "121"],
      correctAnswer: 1,
      topic: "Global Rankings",
      difficulty: "Hard"
    },
    {
      question: "Which Indian city was declared as the world's most polluted city in 2023?",
      options: ["Delhi", "Mumbai", "Begusarai", "Ghaziabad"],
      correctAnswer: 2,
      topic: "Environment",
      difficulty: "Medium"
    }
  ]
};

// Mock API function with real CUET questions
const mockAPI = {
  getQuestions: (examId) => {
    const examPatterns = {
      'CUET': {
        name: 'CUET (UG)',
        duration: 165, // 2 hours 45 minutes
        sections: [
          { subject: 'General Test', questions: 50 },
          { subject: 'English', questions: 40 },
          { subject: 'Quantitative Aptitude', questions: 50 },
          { subject: 'Logical Reasoning', questions: 50 },
          { subject: 'Current Affairs', questions: 10 }
        ]
      }
    };

    const pattern = examPatterns[examId] || examPatterns['CUET'];
    const questions = [];
    let questionId = 1;

    pattern.sections.forEach(section => {
      const subjectQuestions = cuetQuestions[section.subject] || [];
      
      for (let i = 0; i < section.questions; i++) {
        const questionData = subjectQuestions[i % subjectQuestions.length];
        questions.push({
          id: questionId++,
          subject: section.subject,
          question: questionData.question,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
          topic: questionData.topic,
          difficulty: questionData.difficulty,
          marks: 1,
          negativeMarks: 0.25
        });
      }
    });

    return {
      exam: pattern,
      questions: questions,
      totalQuestions: questions.length,
      totalMarks: questions.length * 1
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
      'General Test': 'bg-blue-100 text-blue-800',
      'English': 'bg-green-100 text-green-800',
      'Quantitative Aptitude': 'bg-purple-100 text-purple-800',
      'Logical Reasoning': 'bg-orange-100 text-orange-800',
      'Current Affairs': 'bg-red-100 text-red-800'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: 'bg-green-200 text-green-800',
      Medium: 'bg-yellow-200 text-yellow-800',
      Hard: 'bg-red-200 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-200 text-gray-800';
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
            <Badge className={getDifficultyColor(question.difficulty)}>
              {question.difficulty}
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
        <div className="grid grid-cols-6 gap-2 max-h-96 overflow-y-auto">
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
  const navigate = useNavigate();

  const { totalQuestions, correctAnswers, wrongAnswers, unattempted, score, percentage, timeSpent, subjectWiseResults } = results;

  const getScoreColor = (percent) => {
    if (percent >= 80) return 'text-green-600';
    if (percent >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const estimatedRank = Math.floor(Math.random() * 1000) + 100; // Mock rank for CUET

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
            <Button onClick={() => navigate('/dashboard/decision-making/mock-tests')}>
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main CUET Test Page Component
const CUETTestPage = () => {
  const [examId] = useState('CUET');
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
      'General Test': { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 50, score: 0, maxScore: 50, percentage: 0 },
      'English': { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 40, score: 0, maxScore: 40, percentage: 0 },
      'Quantitative Aptitude': { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 50, score: 0, maxScore: 50, percentage: 0 },
      'Logical Reasoning': { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 50, score: 0, maxScore: 50, percentage: 0 },
      'Current Affairs': { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 10, score: 0, maxScore: 10, percentage: 0 }
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
            <p className="text-muted-foreground">Common University Entrance Test - Mock Test Instructions</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-800">{examData.exam.duration} min</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-800">{examData.totalQuestions}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-800">{examData.totalMarks}</div>
                  <div className="text-sm text-muted-foreground">Total Marks</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Instructions:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Each correct answer carries 1 mark</li>
                  <li>• Each wrong answer has negative marking of 0.25 marks</li>
                  <li>• CUET is conducted for admission to central universities</li>
                  <li>• Test includes General Test, English, and reasoning abilities</li>
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

            <Card className="mt-4">
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

export default CUETTestPage;