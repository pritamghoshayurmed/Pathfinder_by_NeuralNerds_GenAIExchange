import React, { useState, useEffect, useCallback } from 'react';
import { Clock, ChevronLeft, ChevronRight, Flag, BookOpen, CheckCircle, XCircle, AlertTriangle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from "react-router-dom";

// Real CLAT Questions Database
const clatQuestions = {
  "English Language": [
    {
      question: "Choose the word that is most similar in meaning to 'PROLIFIC':",
      options: ["Productive", "Lazy", "Destructive", "Slow"],
      correctAnswer: 0,
      topic: "Vocabulary",
      difficulty: "Medium"
    },
    {
      question: "Identify the grammatically correct sentence:",
      options: [
        "Neither of the boys have completed their homework",
        "Neither of the boys has completed his homework", 
        "Neither of the boys have completed his homework",
        "Neither of the boys has completed their homework"
      ],
      correctAnswer: 1,
      topic: "Grammar",
      difficulty: "Hard"
    },
    {
      question: "Choose the antonym of 'AMELIORATE':",
      options: ["Improve", "Worsen", "Maintain", "Stabilize"],
      correctAnswer: 1,
      topic: "Vocabulary",
      difficulty: "Hard"
    },
    {
      question: "Fill in the blank: 'The lawyer's argument was so _____ that the jury was completely convinced.'",
      options: ["Fallacious", "Persuasive", "Confusing", "Irrelevant"],
      correctAnswer: 1,
      topic: "Contextual Usage",
      difficulty: "Medium"
    },
    {
      question: "Identify the figure of speech: 'The pen is mightier than the sword'",
      options: ["Metaphor", "Simile", "Personification", "Metonymy"],
      correctAnswer: 3,
      topic: "Figures of Speech",
      difficulty: "Hard"
    },
    {
      question: "Choose the correctly spelled word:",
      options: ["Bureaucracy", "Beaurocracy", "Burocracy", "Bureacracy"],
      correctAnswer: 0,
      topic: "Spelling",
      difficulty: "Medium"
    },
    {
      question: "The phrase 'To beat about the bush' means:",
      options: ["To speak directly", "To avoid the main topic", "To be aggressive", "To work in garden"],
      correctAnswer: 1,
      topic: "Idioms and Phrases",
      difficulty: "Easy"
    },
    {
      question: "Choose the passive voice of: 'The judge will deliver the verdict tomorrow'",
      options: [
        "The verdict will be delivered by the judge tomorrow",
        "The verdict would be delivered by the judge tomorrow",
        "The verdict is delivered by the judge tomorrow",
        "The verdict was delivered by the judge tomorrow"
      ],
      correctAnswer: 0,
      topic: "Voice",
      difficulty: "Medium"
    },
    {
      question: "Identify the error in: 'The number of lawyers in the court are increasing'",
      options: ["number", "lawyers", "are", "increasing"],
      correctAnswer: 2,
      topic: "Subject-Verb Agreement",
      difficulty: "Medium"
    },
    {
      question: "Choose the word that best completes: 'The defendant's _____ was evident from his nervous behavior'",
      options: ["Innocence", "Guilt", "Anxiety", "Confidence"],
      correctAnswer: 2,
      topic: "Contextual Usage",
      difficulty: "Easy"
    }
  ],
  "Current Affairs": [
    {
      question: "Who is the current Chief Justice of India (as of 2024)?",
      options: ["D.Y. Chandrachud", "N.V. Ramana", "S.A. Bobde", "Ranjan Gogoi"],
      correctAnswer: 0,
      topic: "Judiciary",
      difficulty: "Easy"
    },
    {
      question: "The G20 Summit 2023 was held under which country's presidency?",
      options: ["Indonesia", "India", "Italy", "Saudi Arabia"],
      correctAnswer: 1,
      topic: "International Relations",
      difficulty: "Easy"
    },
    {
      question: "Which article of the Indian Constitution deals with the Right to Constitutional Remedies?",
      options: ["Article 30", "Article 31", "Article 32", "Article 33"],
      correctAnswer: 2,
      topic: "Constitutional Law",
      difficulty: "Medium"
    },
    {
      question: "The term 'Basic Structure' of the Constitution was established in which landmark case?",
      options: ["Golaknath Case", "Kesavananda Bharati Case", "Minerva Mills Case", "Maneka Gandhi Case"],
      correctAnswer: 1,
      topic: "Constitutional Law",
      difficulty: "Hard"
    },
    {
      question: "Which Indian state recently implemented the Uniform Civil Code?",
      options: ["Uttarakhand", "Himachal Pradesh", "Goa", "Gujarat"],
      correctAnswer: 0,
      topic: "Legal Developments",
      difficulty: "Medium"
    },
    {
      question: "The doctrine of 'Separation of Powers' is borrowed from which country?",
      options: ["USA", "UK", "France", "Germany"],
      correctAnswer: 2,
      topic: "Political Science",
      difficulty: "Medium"
    },
    {
      question: "Which UN body is responsible for maintaining international peace and security?",
      options: ["General Assembly", "Security Council", "Economic and Social Council", "Trusteeship Council"],
      correctAnswer: 1,
      topic: "International Law",
      difficulty: "Easy"
    },
    {
      question: "The concept of 'Judicial Review' in India is borrowed from:",
      options: ["UK", "USA", "Australia", "Canada"],
      correctAnswer: 1,
      topic: "Constitutional Law",
      difficulty: "Medium"
    },
    {
      question: "Which amendment is known as the 'Mini Constitution'?",
      options: ["42nd Amendment", "44th Amendment", "73rd Amendment", "74th Amendment"],
      correctAnswer: 0,
      topic: "Constitutional Amendments",
      difficulty: "Hard"
    },
    {
      question: "The International Court of Justice is located in:",
      options: ["Geneva", "New York", "The Hague", "Vienna"],
      correctAnswer: 2,
      topic: "International Organizations",
      difficulty: "Medium"
    }
  ],
  "Logical Reasoning": [
    {
      question: "If all lawyers are educated and some educated people are honest, which conclusion follows?",
      options: [
        "All lawyers are honest",
        "Some lawyers may be honest", 
        "No lawyers are honest",
        "All honest people are lawyers"
      ],
      correctAnswer: 1,
      topic: "Syllogism",
      difficulty: "Medium"
    },
    {
      question: "In a certain code, JUDGE is written as MXGJH. How is COURT written in that code?",
      options: ["FRXUW", "FRXUV", "ERXUW", "GRXUV"],
      correctAnswer: 0,
      topic: "Coding-Decoding",
      difficulty: "Medium"
    },
    {
      question: "If the day before yesterday was Wednesday, what day will it be day after tomorrow?",
      options: ["Saturday", "Sunday", "Monday", "Tuesday"],
      correctAnswer: 1,
      topic: "Calendar Reasoning",
      difficulty: "Easy"
    },
    {
      question: "Find the odd one out: Contract, Tort, Crime, Evidence",
      options: ["Contract", "Tort", "Crime", "Evidence"],
      correctAnswer: 3,
      topic: "Classification",
      difficulty: "Medium"
    },
    {
      question: "Complete the series: LAW, MBX, NCY, ?",
      options: ["ODZ", "PEA", "OEZ", "PDZ"],
      correctAnswer: 0,
      topic: "Letter Series",
      difficulty: "Hard"
    },
    {
      question: "If A is older than B, and C is younger than B, then:",
      options: [
        "A is older than C",
        "C is older than A",
        "A and C are of same age",
        "Cannot be determined"
      ],
      correctAnswer: 0,
      topic: "Ordering and Ranking",
      difficulty: "Easy"
    },
    {
      question: "Statement: 'All courts have judges.' Which assumption is implicit?",
      options: [
        "Judges are necessary for courts",
        "Courts cannot function without judges",
        "Both A and B",
        "Neither A nor B"
      ],
      correctAnswer: 2,
      topic: "Assumptions",
      difficulty: "Medium"
    },
    {
      question: "Blood Relation: A is B's father. C is A's mother. D is C's son. How is D related to B?",
      options: ["Father", "Uncle", "Brother", "Grandfather"],
      correctAnswer: 1,
      topic: "Blood Relations",
      difficulty: "Medium"
    },
    {
      question: "Which number should replace the question mark: 2, 6, 12, 20, 30, ?",
      options: ["40", "42", "44", "45"],
      correctAnswer: 1,
      topic: "Number Series",
      difficulty: "Medium"
    },
    {
      question: "If South-East becomes North, North-East becomes West, then what does West become?",
      options: ["North-West", "South-West", "South-East", "North-East"],
      correctAnswer: 2,
      topic: "Direction Sense",
      difficulty: "Hard"
    }
  ],
  "Legal Reasoning": [
    {
      question: "Principle: Whoever voluntarily has carnal intercourse against the order of nature shall be punished.\nFact: A has consensual intercourse with B, an adult of the same gender.\nConclusion:",
      options: [
        "A is liable under Section 377",
        "A is not liable as it was consensual", 
        "A is not liable due to recent legal changes",
        "Both A and B are liable"
      ],
      correctAnswer: 2,
      topic: "Criminal Law",
      difficulty: "Hard"
    },
    {
      question: "Principle: An agreement without consideration is void.\nFact: A promises to give Rs. 1000 to B for B's kindness to A's son.\nConclusion:",
      options: [
        "The agreement is valid",
        "The agreement is void due to lack of consideration",
        "The agreement is voidable",
        "The agreement is illegal"
      ],
      correctAnswer: 1,
      topic: "Contract Law",
      difficulty: "Medium"
    },
    {
      question: "Principle: Consent given under coercion is not valid consent.\nFact: X signs a contract after Y threatens to harm X's family.\nConclusion:",
      options: [
        "The contract is valid",
        "The contract is void due to coercion",
        "The contract is voidable at X's option",
        "The contract is illegal"
      ],
      correctAnswer: 2,
      topic: "Contract Law",
      difficulty: "Medium"
    },
    {
      question: "Principle: No one can transfer better title than he himself has.\nFact: A thief sells stolen goods to B, who buys in good faith.\nConclusion:",
      options: [
        "B gets good title",
        "B does not get good title",
        "B gets voidable title",
        "The sale is void"
      ],
      correctAnswer: 1,
      topic: "Property Law",
      difficulty: "Medium"
    },
    {
      question: "Principle: Volenti non fit injuria (To a willing person, no injury is done).\nFact: A spectator is injured while watching a cricket match due to a ball hit by a batsman.\nConclusion:",
      options: [
        "The batsman is liable",
        "The stadium is liable",
        "No one is liable due to voluntary assumption of risk",
        "Both batsman and stadium are liable"
      ],
      correctAnswer: 2,
      topic: "Tort Law",
      difficulty: "Hard"
    },
    {
      question: "Principle: Ignorance of law is no excuse.\nFact: A foreign tourist violates an Indian law claiming ignorance.\nConclusion:",
      options: [
        "A can be excused due to being a foreigner",
        "A cannot be excused",
        "A can be given a warning",
        "The law doesn't apply to foreigners"
      ],
      correctAnswer: 1,
      topic: "Legal Maxims",
      difficulty: "Easy"
    },
    {
      question: "Principle: Right to privacy is a fundamental right under Article 21.\nFact: Police conduct surveillance without warrant on private property.\nConclusion:",
      options: [
        "It is valid police action",
        "It violates right to privacy",
        "It is valid if done for security reasons",
        "It is valid during daytime only"
      ],
      correctAnswer: 1,
      topic: "Constitutional Law",
      difficulty: "Medium"
    },
    {
      question: "Principle: Doctrine of Res Ipsa Loquitur applies when the thing speaks for itself.\nFact: A passenger is injured when an aircraft crashes during normal weather.\nConclusion:",
      options: [
        "Airline is not liable without proof of negligence",
        "Airline is liable under Res Ipsa Loquitur",
        "Only the pilot is liable",
        "No one is liable due to act of God"
      ],
      correctAnswer: 1,
      topic: "Tort Law",
      difficulty: "Hard"
    },
    {
      question: "Principle: A minor's agreement is void ab initio.\nFact: A 17-year-old enters into a contract to buy a car.\nConclusion:",
      options: [
        "The contract is valid",
        "The contract is void",
        "The contract is voidable",
        "The contract is valid if parents consent"
      ],
      correctAnswer: 1,
      topic: "Contract Law",
      difficulty: "Easy"
    },
    {
      question: "Principle: Actus non facit reum nisi mens sit rea (Act does not make one guilty unless the mind is guilty).\nFact: A kills B while sleepwalking.\nConclusion:",
      options: [
        "A is guilty of murder",
        "A is not guilty due to lack of mens rea",
        "A is guilty of culpable homicide",
        "A is guilty but can claim insanity"
      ],
      correctAnswer: 1,
      topic: "Criminal Law",
      difficulty: "Medium"
    }
  ],
  "Quantitative Techniques": [
    {
      question: "If 20% of A's income is equal to 25% of B's income, and B's income is Rs. 4000, what is A's income?",
      options: ["Rs. 5000", "Rs. 4500", "Rs. 3200", "Rs. 6000"],
      correctAnswer: 0,
      topic: "Percentage",
      difficulty: "Medium"
    },
    {
      question: "The average age of a law firm's 10 partners is 45 years. If the oldest partner retires at age 65, what is the new average age?",
      options: ["42.22 years", "43.33 years", "44.44 years", "41.11 years"],
      correctAnswer: 0,
      topic: "Average",
      difficulty: "Medium"
    },
    {
      question: "A legal document has 120 pages. If a paralegal can review 8 pages per hour, how long will it take to review the entire document?",
      options: ["12 hours", "15 hours", "18 hours", "20 hours"],
      correctAnswer: 1,
      topic: "Time and Work",
      difficulty: "Easy"
    },
    {
      question: "In a law school, the ratio of male to female students is 3:2. If there are 150 female students, how many male students are there?",
      options: ["225", "200", "250", "300"],
      correctAnswer: 0,
      topic: "Ratio and Proportion",
      difficulty: "Easy"
    },
    {
      question: "A lawyer charges Rs. 500 per hour. If he gives a 20% discount for a bulk booking of 10 hours, what is the total amount?",
      options: ["Rs. 4000", "Rs. 4500", "Rs. 3500", "Rs. 5000"],
      correctAnswer: 0,
      topic: "Percentage and Discount",
      difficulty: "Medium"
    },
    {
      question: "The compound interest on Rs. 10,000 for 2 years at 10% per annum is:",
      options: ["Rs. 2000", "Rs. 2100", "Rs. 2200", "Rs. 1900"],
      correctAnswer: 1,
      topic: "Compound Interest",
      difficulty: "Medium"
    },
    {
      question: "If log₂ 8 = 3, then log₂ 32 = ?",
      options: ["4", "5", "6", "7"],
      correctAnswer: 1,
      topic: "Logarithms",
      difficulty: "Hard"
    },
    {
      question: "The area of a rectangular court hall is 240 sq.m. If the length is 20m, what is the perimeter?",
      options: ["64m", "68m", "72m", "76m"],
      correctAnswer: 1,
      topic: "Mensuration",
      difficulty: "Medium"
    },
    {
      question: "If x + y = 10 and xy = 21, find x² + y²:",
      options: ["52", "58", "64", "46"],
      correctAnswer: 1,
      topic: "Algebra",
      difficulty: "Hard"
    },
    {
      question: "A dice is thrown. What is the probability of getting an even number?",
      options: ["1/2", "1/3", "2/3", "1/6"],
      correctAnswer: 0,
      topic: "Probability",
      difficulty: "Easy"
    }
  ]
};

// Mock API function with real CLAT questions
const mockAPI = {
  getQuestions: (examId) => {
    const examPatterns = {
      'CLAT': {
        name: 'CLAT (UG)',
        duration: 120, // 2 hours
        sections: [
          { subject: 'English Language', questions: 28 },
          { subject: 'Current Affairs', questions: 35 },
          { subject: 'Legal Reasoning', questions: 35 },
          { subject: 'Logical Reasoning', questions: 28 },
          { subject: 'Quantitative Techniques', questions: 14 }
        ]
      }
    };

    const pattern = examPatterns[examId] || examPatterns['CLAT'];
    const questions = [];
    let questionId = 1;

    pattern.sections.forEach(section => {
      const subjectQuestions = clatQuestions[section.subject] || [];
      
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
      'English Language': 'bg-blue-100 text-blue-800',
      'Current Affairs': 'bg-green-100 text-green-800',
      'Legal Reasoning': 'bg-purple-100 text-purple-800',
      'Logical Reasoning': 'bg-orange-100 text-orange-800',
      'Quantitative Techniques': 'bg-red-100 text-red-800'
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
          <p className="text-lg leading-relaxed text-white whitespace-pre-line">{question.question}</p>
          
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
    if (percent >= 75) return 'text-green-600';
    if (percent >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const estimatedRank = Math.floor(Math.random() * 500) + 50; // Mock rank for CLAT

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

// Main CLAT Test Page Component
const CLATTestPage = () => {
  const [examId] = useState('CLAT');
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
      'English Language': { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 28, score: 0, maxScore: 28, percentage: 0 },
      'Current Affairs': { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 35, score: 0, maxScore: 35, percentage: 0 },
      'Legal Reasoning': { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 35, score: 0, maxScore: 35, percentage: 0 },
      'Logical Reasoning': { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 28, score: 0, maxScore: 28, percentage: 0 },
      'Quantitative Techniques': { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 14, score: 0, maxScore: 14, percentage: 0 }
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
            <p className="text-muted-foreground">Common Law Admission Test - Mock Test Instructions</p>
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
                  <li>• CLAT is conducted for admission to National Law Universities</li>
                  <li>• Focus areas: Legal reasoning, logical reasoning, and current affairs</li>
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

export default CLATTestPage;