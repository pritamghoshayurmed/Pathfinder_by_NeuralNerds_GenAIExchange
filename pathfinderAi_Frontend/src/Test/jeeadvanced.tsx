import React, { useState, useEffect, useCallback } from 'react';
import { Clock, ChevronLeft, ChevronRight, Flag, BookOpen, CheckCircle, XCircle, AlertTriangle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from "react-router-dom";

// Real JEE Advanced Questions Database
const jeeAdvancedQuestions = {
  Physics: [
    {
      question: "A particle of mass m is moving in a vertical circle of radius R. If the tension in the string at the lowest point is 6mg, what is the speed of the particle at the lowest point?",
      options: ["√(5gR)", "√(6gR)", "√(4gR)", "√(3gR)"],
      correctAnswer: 0,
      topic: "Circular Motion",
      difficulty: "Hard"
    },
    {
      question: "Two identical conducting spheres A and B carry charges QA = +Q and QB = -Q respectively. They are separated by a distance much larger than their radii. A third identical uncharged conducting sphere C is first touched to A, then to B, and finally removed. What is the final charge on sphere B?",
      options: ["-Q/4", "-Q/2", "-3Q/4", "-Q/8"],
      correctAnswer: 0,
      topic: "Electrostatics",
      difficulty: "Hard"
    },
    {
      question: "A uniform rod of mass M and length L is pivoted at one end. A particle of mass m moving horizontally with velocity v strikes the rod at distance L/2 from the pivot and sticks to it. Find the angular velocity of the system immediately after collision.",
      options: ["3mv/(4ML)", "6mv/(7ML)", "mv/(2ML)", "2mv/(3ML)"],
      correctAnswer: 1,
      topic: "Rotational Mechanics",
      difficulty: "Hard"
    },
    {
      question: "A parallel plate capacitor is connected to a battery. A dielectric slab of dielectric constant K is inserted between the plates. Which of the following quantities remains constant?",
      options: ["Energy stored", "Charge on plates", "Electric field", "Potential difference"],
      correctAnswer: 3,
      topic: "Capacitance",
      difficulty: "Medium"
    },
    {
      question: "In Young's double slit experiment, the distance between slits is d and distance from slits to screen is D. If wavelength of light is λ, what is the width of central bright fringe?",
      options: ["λD/d", "2λD/d", "λD/2d", "3λD/2d"],
      correctAnswer: 1,
      topic: "Wave Optics",
      difficulty: "Medium"
    },
    {
      question: "A gas undergoes a process PV^n = constant. For what value of n will the molar heat capacity of the gas be zero?",
      options: ["γ", "1", "0", "∞"],
      correctAnswer: 0,
      topic: "Thermodynamics",
      difficulty: "Hard"
    },
    {
      question: "A charged particle moves in a combined electric and magnetic field. Under what condition will the particle move in a straight line?",
      options: ["E ⊥ B and v ⊥ E", "E || B", "E ⊥ B and E = vB", "E = B"],
      correctAnswer: 2,
      topic: "Electromagnetic Fields",
      difficulty: "Hard"
    },
    {
      question: "In a photoelectric experiment, if the frequency of incident light is doubled, the maximum kinetic energy of emitted electrons:",
      options: ["Doubles", "More than doubles", "Less than doubles", "Remains same"],
      correctAnswer: 1,
      topic: "Modern Physics",
      difficulty: "Medium"
    },
    {
      question: "A uniform magnetic field B exists in a region. A square loop of side a moves with velocity v perpendicular to B. The induced EMF in the loop is:",
      options: ["Bav", "2Bav", "0", "Ba²v"],
      correctAnswer: 2,
      topic: "Electromagnetic Induction",
      difficulty: "Medium"
    },
    {
      question: "For a damped harmonic oscillator with damping coefficient γ, mass m, and spring constant k, the condition for critical damping is:",
      options: ["γ = 2√(mk)", "γ = √(mk)", "γ = 2√(k/m)", "γ = √(k/m)"],
      correctAnswer: 0,
      topic: "Oscillations",
      difficulty: "Hard"
    },
    {
      question: "An object is placed at distance u from a concave mirror of focal length f. For what value of u will the magnification be -2?",
      options: ["3f/2", "2f/3", "f/2", "2f"],
      correctAnswer: 0,
      topic: "Geometrical Optics",
      difficulty: "Medium"
    },
    {
      question: "In a potentiometer circuit, the balance point is obtained at 60 cm from one end. If the EMF of the standard cell is 1.02 V, what is the EMF of the unknown cell if balance is obtained at 40 cm?",
      options: ["0.68 V", "1.53 V", "0.408 V", "2.55 V"],
      correctAnswer: 0,
      topic: "Current Electricity",
      difficulty: "Medium"
    },
    {
      question: "A particle executes SHM with amplitude A. At what displacement from mean position is the kinetic energy equal to potential energy?",
      options: ["A/√2", "A/2", "A/√3", "A/4"],
      correctAnswer: 0,
      topic: "Simple Harmonic Motion",
      difficulty: "Medium"
    },
    {
      question: "Two waves y₁ = A sin(ωt - kx) and y₂ = A sin(ωt + kx) superpose. The resultant wave is:",
      options: ["Progressive wave", "Standing wave", "Beats", "No wave"],
      correctAnswer: 1,
      topic: "Wave Motion",
      difficulty: "Medium"
    },
    {
      question: "A satellite orbits Earth at height h above surface. If Earth's radius is R, what is the orbital velocity?",
      options: ["√(gR²/(R+h))", "√(gR)", "√(g(R+h))", "√(gh)"],
      correctAnswer: 0,
      topic: "Gravitation",
      difficulty: "Medium"
    },
    {
      question: "In Compton scattering, the wavelength shift depends on:",
      options: ["Scattering angle only", "Initial wavelength only", "Both scattering angle and initial wavelength", "Energy of incident photon only"],
      correctAnswer: 0,
      topic: "Quantum Physics",
      difficulty: "Hard"
    },
    {
      question: "A conducting rod of length L moves with velocity v in a magnetic field B. The maximum EMF induced is:",
      options: ["BLv", "BLv sin θ", "BLv cos θ", "BL²v"],
      correctAnswer: 0,
      topic: "Motional EMF",
      difficulty: "Medium"
    },
    {
      question: "For a transistor in CE configuration, if β = 100 and IE = 1 mA, then IB is:",
      options: ["0.01 mA", "0.001 mA", "0.1 mA", "10 mA"],
      correctAnswer: 0,
      topic: "Semiconductor Electronics",
      difficulty: "Medium"
    }
  ],
  Chemistry: [
    {
      question: "Which of the following represents the correct order of increasing atomic radii?",
      options: ["F < O < N < C", "F < N < O < C", "C < N < O < F", "O < F < N < C"],
      correctAnswer: 0,
      topic: "Periodic Properties",
      difficulty: "Medium"
    },
    {
      question: "The hybridization of xenon in XeF₄ is:",
      options: ["sp³d²", "sp³d", "sp²d²", "sp³"],
      correctAnswer: 0,
      topic: "Chemical Bonding",
      difficulty: "Hard"
    },
    {
      question: "Which of the following complexes shows optical isomerism?",
      options: ["[Co(en)₃]³⁺", "[PtCl₄]²⁻", "[Ni(CN)₄]²⁻", "[CuCl₄]²⁻"],
      correctAnswer: 0,
      topic: "Coordination Chemistry",
      difficulty: "Hard"
    },
    {
      question: "The reaction 2A → B follows first order kinetics. If the rate constant is 0.693 min⁻¹, the half-life is:",
      options: ["1 minute", "2 minutes", "0.5 minutes", "1.5 minutes"],
      correctAnswer: 0,
      topic: "Chemical Kinetics",
      difficulty: "Medium"
    },
    {
      question: "Which of the following alcohols will give a positive iodoform test?",
      options: ["CH₃CH₂OH", "CH₃CH(OH)CH₃", "(CH₃)₃COH", "CH₃OH"],
      correctAnswer: 1,
      topic: "Organic Chemistry",
      difficulty: "Medium"
    },
    {
      question: "The number of stereoisomers possible for the compound CH₃CHBrCHBrCOOH is:",
      options: ["4", "3", "2", "6"],
      correctAnswer: 0,
      topic: "Stereochemistry",
      difficulty: "Hard"
    },
    {
      question: "Which of the following has maximum bond angle?",
      options: ["NH₃", "H₂O", "CH₄", "H₂S"],
      correctAnswer: 2,
      topic: "Molecular Geometry",
      difficulty: "Medium"
    },
    {
      question: "The IUPAC name of [Co(NH₃)₄Cl₂]Cl is:",
      options: ["Tetraamminedichlorocobalt(III) chloride", "Dichlorotetraamminecobalt(III) chloride", "Tetraamminecobalt(III) dichloride", "Cobalt(III) tetraamminedichloride"],
      correctAnswer: 0,
      topic: "Coordination Compounds",
      difficulty: "Hard"
    },
    {
      question: "Which of the following is most acidic?",
      options: ["CH₃COOH", "CCl₃COOH", "CHCl₂COOH", "CH₂ClCOOH"],
      correctAnswer: 1,
      topic: "Carboxylic Acids",
      difficulty: "Medium"
    },
    {
      question: "The order of stability of carbocations is:",
      options: ["3° > 2° > 1° > CH₃⁺", "CH₃⁺ > 1° > 2° > 3°", "1° > 2° > 3° > CH₃⁺", "2° > 3° > 1° > CH₃⁺"],
      correctAnswer: 0,
      topic: "Reaction Mechanisms",
      difficulty: "Medium"
    },
    {
      question: "Which of the following elements has the highest first ionization energy?",
      options: ["N", "O", "F", "Ne"],
      correctAnswer: 3,
      topic: "Atomic Structure",
      difficulty: "Medium"
    },
    {
      question: "The crystal field splitting energy (Δ) is maximum for:",
      options: ["[Co(H₂O)₆]³⁺", "[Co(NH₃)₆]³⁺", "[Co(CN)₆]³⁻", "[CoF₆]³⁻"],
      correctAnswer: 2,
      topic: "Crystal Field Theory",
      difficulty: "Hard"
    },
    {
      question: "Which of the following reactions is an example of disproportionation?",
      options: ["2H₂O₂ → 2H₂O + O₂", "Cl₂ + 2NaOH → NaCl + NaClO + H₂O", "2KMnO₄ → K₂MnO₄ + MnO₂ + O₂", "All of the above"],
      correctAnswer: 3,
      topic: "Redox Reactions",
      difficulty: "Hard"
    },
    {
      question: "The solubility product of AgCl is 1.8 × 10⁻¹⁰. The solubility of AgCl in mol/L is:",
      options: ["1.34 × 10⁻⁵", "1.8 × 10⁻¹⁰", "3.24 × 10⁻²⁰", "1.8 × 10⁻⁵"],
      correctAnswer: 0,
      topic: "Ionic Equilibrium",
      difficulty: "Medium"
    },
    {
      question: "Which of the following polymers is thermosetting?",
      options: ["Polyethylene", "PVC", "Bakelite", "Teflon"],
      correctAnswer: 2,
      topic: "Polymers",
      difficulty: "Medium"
    },
    {
      question: "The product formed when benzene reacts with CH₃COCl in presence of AlCl₃ is:",
      options: ["Acetophenone", "Benzoic acid", "Benzyl acetate", "Phenylacetic acid"],
      correctAnswer: 0,
      topic: "Aromatic Chemistry",
      difficulty: "Medium"
    },
    {
      question: "Which of the following is not a characteristic of enzyme catalysis?",
      options: ["High specificity", "Mild reaction conditions", "Very high catalytic activity", "Independent of temperature"],
      correctAnswer: 3,
      topic: "Biomolecules",
      difficulty: "Medium"
    },
    {
      question: "The lanthanide contraction is responsible for:",
      options: ["Similar radii of Zr and Hf", "High density of third transition series", "Both A and B", "None of these"],
      correctAnswer: 2,
      topic: "d and f Block Elements",
      difficulty: "Hard"
    }
  ],
  Mathematics: [
    {
      question: "If f(x) = |x|³, then f'(0) is:",
      options: ["0", "1", "-1", "Does not exist"],
      correctAnswer: 0,
      topic: "Differential Calculus",
      difficulty: "Medium"
    },
    {
      question: "The value of ∫₀^∞ e^(-x²) dx is:",
      options: ["√π/2", "√π", "π/2", "π"],
      correctAnswer: 0,
      topic: "Integral Calculus",
      difficulty: "Hard"
    },
    {
      question: "If z₁ and z₂ are complex numbers such that |z₁ + z₂| = |z₁| + |z₂|, then:",
      options: ["arg(z₁) = arg(z₂)", "z₁ = z₂", "|z₁| = |z₂|", "z₁z₂ = 0"],
      correctAnswer: 0,
      topic: "Complex Numbers",
      difficulty: "Hard"
    },
    {
      question: "The equation of the ellipse with foci at (±3, 0) and vertices at (±5, 0) is:",
      options: ["x²/25 + y²/16 = 1", "x²/16 + y²/25 = 1", "x²/25 + y²/9 = 1", "x²/9 + y²/25 = 1"],
      correctAnswer: 0,
      topic: "Conic Sections",
      difficulty: "Medium"
    },
    {
      question: "If the vectors a⃗ = î + 2ĵ + 3k̂ and b⃗ = 3î + 2ĵ + k̂, then the angle between them is:",
      options: ["cos⁻¹(10/14)", "cos⁻¹(5/7)", "cos⁻¹(10/√196)", "cos⁻¹(1/2)"],
      correctAnswer: 1,
      topic: "Vector Algebra",
      difficulty: "Medium"
    },
    {
      question: "The number of real solutions of the equation x³ - 3x + 2 = 0 is:",
      options: ["3", "2", "1", "0"],
      correctAnswer: 0,
      topic: "Theory of Equations",
      difficulty: "Medium"
    },
    {
      question: "If A = [2 1; 3 2], then A⁻¹ is:",
      options: ["[2 -1; -3 2]", "[-2 1; 3 -2]", "[2 -1; -3 2]/(-1)", "None of these"],
      correctAnswer: 0,
      topic: "Matrices and Determinants",
      difficulty: "Medium"
    },
    {
      question: "The sum of the series 1 + 1/2² + 1/3² + 1/4² + ... is:",
      options: ["π²/6", "π²/8", "π²/4", "π²/12"],
      correctAnswer: 0,
      topic: "Sequences and Series",
      difficulty: "Hard"
    },
    {
      question: "The general solution of the differential equation dy/dx = y/x is:",
      options: ["y = cx", "y = c/x", "xy = c", "x + y = c"],
      correctAnswer: 0,
      topic: "Differential Equations",
      difficulty: "Medium"
    },
    {
      question: "The probability that a randomly selected number from {1, 2, 3, ..., 100} is divisible by 3 or 5 is:",
      options: ["47/100", "33/100", "20/100", "53/100"],
      correctAnswer: 0,
      topic: "Probability",
      difficulty: "Medium"
    },
    {
      question: "If sin⁻¹x + sin⁻¹y = π/2, then cos⁻¹x + cos⁻¹y is:",
      options: ["π/2", "π", "0", "π/4"],
      correctAnswer: 0,
      topic: "Inverse Trigonometry",
      difficulty: "Medium"
    },
    {
      question: "The area bounded by the curve y = x², the x-axis, and the lines x = 1 and x = 2 is:",
      options: ["7/3", "8/3", "5/3", "2"],
      correctAnswer: 0,
      topic: "Applications of Integration",
      difficulty: "Medium"
    },
    {
      question: "If the lines x/1 = y/2 = z/3 and x/2 = y/3 = z/4 intersect, then they intersect at:",
      options: ["Origin", "(1, 2, 3)", "(2, 3, 4)", "They don't intersect"],
      correctAnswer: 3,
      topic: "3D Geometry",
      difficulty: "Hard"
    },
    {
      question: "The coefficient of x⁷ in the expansion of (1 + x)¹⁰ is:",
      options: ["120", "210", "252", "336"],
      correctAnswer: 0,
      topic: "Binomial Theorem",
      difficulty: "Medium"
    },
    {
      question: "If f(x) is continuous at x = a, then lim(h→0) [f(a+h) - f(a-h)]/h is:",
      options: ["2f'(a)", "0", "f'(a)", "Does not exist"],
      correctAnswer: 1,
      topic: "Limits and Continuity",
      difficulty: "Hard"
    },
    {
      question: "The equation of the plane passing through (1, 2, 3) and perpendicular to the line joining (1, 2, 3) and (2, 3, 4) is:",
      options: ["x + y + z = 6", "x - y - z = -4", "x + y + z = 0", "x - y + z = 2"],
      correctAnswer: 0,
      topic: "3D Coordinate Geometry",
      difficulty: "Medium"
    },
    {
      question: "The maximum value of sin x + cos x is:",
      options: ["√2", "2", "1", "√3"],
      correctAnswer: 0,
      topic: "Trigonometry",
      difficulty: "Medium"
    },
    {
      question: "If the function f(x) = x³ + ax² + bx + c has local maximum at x = -1 and local minimum at x = 3, then a + b is:",
      options: ["-15", "-9", "15", "9"],
      correctAnswer: 1,
      topic: "Application of Derivatives",
      difficulty: "Hard"
    }
  ]
};

// Mock API function with real JEE Advanced questions
const mockAPI = {
  getQuestions: (examId) => {
    const examPatterns = {
      'JEE_ADVANCED': {
        name: 'JEE Advanced',
        duration: 180, // 3 hours per paper
        sections: [
          { subject: 'Physics', questions: 18 },
          { subject: 'Chemistry', questions: 18 },
          { subject: 'Mathematics', questions: 18 }
        ]
      }
    };

    const pattern = examPatterns[examId] || examPatterns['JEE_ADVANCED'];
    const questions = [];
    let questionId = 1;

    pattern.sections.forEach(section => {
      const subjectQuestions = jeeAdvancedQuestions[section.subject] || [];
      
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
          marks: 3,
          negativeMarks: 1
        });
      }
    });

    return {
      exam: pattern,
      questions: questions,
      totalQuestions: questions.length,
      totalMarks: questions.length * 3
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
    if (percent >= 70) return 'text-green-600';
    if (percent >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const estimatedRank = Math.floor(Math.random() * 2000) + 500; // Mock rank for JEE Advanced

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

// Main JEE Advanced Test Page Component
const JEEAdvancedTestPage = () => {
  const [examId] = useState('JEE_ADVANCED');
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
      Physics: { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 18, score: 0, maxScore: 54, percentage: 0 },
      Chemistry: { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 18, score: 0, maxScore: 54, percentage: 0 },
      Mathematics: { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 18, score: 0, maxScore: 54, percentage: 0 }
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
            <p className="text-muted-foreground">Paper 1 - Mock Test Instructions</p>
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
                  <li>• Each correct answer carries 3 marks</li>
                  <li>• Each wrong answer has negative marking of 1 mark</li>
                  <li>• This is Paper 1 of JEE Advanced (Paper 2 is separate)</li>
                  <li>• Questions are of higher difficulty than JEE Main</li>
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
              <h1 className="text-xl font-bold text-white">{examData.exam.name} - Paper 1</h1>
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

export default JEEAdvancedTestPage;