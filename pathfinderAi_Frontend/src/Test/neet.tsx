import React, { useState, useEffect, useCallback } from 'react';
import { Clock, ChevronLeft, ChevronRight, Flag, BookOpen, CheckCircle, XCircle, AlertTriangle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from "react-router-dom";

// Real NEET Questions Database
const neetQuestions = {
  Physics: [
    {
      question: "A projectile is fired at an angle of 45° with the horizontal. The ratio of maximum height to the horizontal range is:",
      options: ["1:4", "1:2", "1:1", "2:1"],
      correctAnswer: 0,
      topic: "Projectile Motion"
    },
    {
      question: "The electric potential at a point due to a point charge is 20V. If the distance is doubled, the new potential will be:",
      options: ["10V", "5V", "40V", "80V"],
      correctAnswer: 0,
      topic: "Electrostatics"
    },
    {
      question: "A wire of resistance R is stretched to double its length. Its new resistance becomes:",
      options: ["4R", "2R", "R/2", "R/4"],
      correctAnswer: 0,
      topic: "Current Electricity"
    },
    {
      question: "The half-life of a radioactive substance is 20 minutes. In how much time will 7/8th of the substance decay?",
      options: ["60 minutes", "40 minutes", "80 minutes", "100 minutes"],
      correctAnswer: 0,
      topic: "Nuclear Physics"
    },
    {
      question: "A spring of force constant k is cut into two equal parts. The force constant of each part is:",
      options: ["2k", "k", "k/2", "k/4"],
      correctAnswer: 0,
      topic: "Simple Harmonic Motion"
    },
    {
      question: "The efficiency of a Carnot engine operating between 27°C and 127°C is:",
      options: ["25%", "30%", "33.3%", "50%"],
      correctAnswer: 0,
      topic: "Thermodynamics"
    },
    {
      question: "When a ray of light passes from air to glass, which of the following remains unchanged?",
      options: ["Frequency", "Wavelength", "Speed", "Amplitude"],
      correctAnswer: 0,
      topic: "Optics"
    },
    {
      question: "The magnetic field at the center of a circular coil of radius r carrying current I is:",
      options: ["μ₀I/2r", "μ₀I/4r", "μ₀I/r", "2μ₀I/r"],
      correctAnswer: 0,
      topic: "Magnetism"
    },
    {
      question: "A particle moving in a circle of radius r with uniform speed v has acceleration:",
      options: ["v²/r directed towards center", "v²/r directed outwards", "v/r directed towards center", "zero"],
      correctAnswer: 0,
      topic: "Circular Motion"
    },
    {
      question: "The dimensional formula of magnetic flux is:",
      options: ["[ML²T⁻²A⁻¹]", "[ML²T⁻²A⁻²]", "[MLT⁻²A⁻¹]", "[M⁰L²T⁻²A⁻¹]"],
      correctAnswer: 0,
      topic: "Units and Dimensions"
    },
    {
      question: "Two waves of same frequency and amplitude superpose. The resultant amplitude is maximum when the phase difference is:",
      options: ["0 or 2π", "π/2", "π", "3π/2"],
      correctAnswer: 0,
      topic: "Wave Motion"
    },
    {
      question: "A ball is dropped from a height h. The time taken to reach the ground is proportional to:",
      options: ["√h", "h", "h²", "1/h"],
      correctAnswer: 0,
      topic: "Kinematics"
    },
    {
      question: "The work function of a metal is 4 eV. The maximum kinetic energy of photoelectrons when light of wavelength 200 nm falls on it is:",
      options: ["2.2 eV", "1.8 eV", "6.2 eV", "4 eV"],
      correctAnswer: 0,
      topic: "Photoelectric Effect"
    },
    {
      question: "A uniform rod of mass M and length L is pivoted at one end. Its moment of inertia about the pivot is:",
      options: ["ML²/3", "ML²/12", "ML²/4", "ML²/2"],
      correctAnswer: 0,
      topic: "Rotational Motion"
    },
    {
      question: "The potential energy of a stretched spring is proportional to:",
      options: ["x²", "x", "√x", "1/x"],
      correctAnswer: 0,
      topic: "Elasticity"
    },
    {
      question: "An ideal gas undergoes an isothermal process. Which quantity remains constant?",
      options: ["Temperature", "Pressure", "Volume", "Density"],
      correctAnswer: 0,
      topic: "Kinetic Theory"
    },
    {
      question: "The phase difference between displacement and velocity in SHM is:",
      options: ["π/2", "π", "0", "3π/2"],
      correctAnswer: 0,
      topic: "Oscillations"
    },
    {
      question: "A convex mirror always forms an image which is:",
      options: ["Virtual, erect and diminished", "Real, inverted and magnified", "Virtual, erect and magnified", "Real, erect and diminished"],
      correctAnswer: 0,
      topic: "Ray Optics"
    },
    {
      question: "The de Broglie wavelength is inversely proportional to:",
      options: ["Momentum", "Mass", "Velocity", "Energy"],
      correctAnswer: 0,
      topic: "Dual Nature of Matter"
    },
    {
      question: "In an AC circuit containing only capacitance, the current:",
      options: ["Leads voltage by π/2", "Lags voltage by π/2", "Is in phase with voltage", "Leads voltage by π"],
      correctAnswer: 0,
      topic: "AC Circuits"
    },
    {
      question: "The escape velocity from Earth is 11.2 km/s. The escape velocity from a planet having twice the mass and same radius would be:",
      options: ["15.84 km/s", "22.4 km/s", "11.2 km/s", "7.92 km/s"],
      correctAnswer: 0,
      topic: "Gravitation"
    },
    {
      question: "A charged particle moving perpendicular to a magnetic field follows a:",
      options: ["Circular path", "Straight line", "Parabolic path", "Helical path"],
      correctAnswer: 0,
      topic: "Motion in Magnetic Field"
    },
    {
      question: "The refractive index of a medium is √2. The critical angle for total internal reflection is:",
      options: ["45°", "30°", "60°", "90°"],
      correctAnswer: 0,
      topic: "Total Internal Reflection"
    },
    {
      question: "In a transformer, the power loss is mainly due to:",
      options: ["Eddy currents and hysteresis", "Resistance of windings", "Magnetic saturation", "Leakage flux"],
      correctAnswer: 0,
      topic: "Electromagnetic Induction"
    },
    {
      question: "The binding energy per nucleon is maximum for:",
      options: ["Iron (Fe-56)", "Helium (He-4)", "Uranium (U-238)", "Hydrogen (H-1)"],
      correctAnswer: 0,
      topic: "Nuclear Physics"
    }
  ],
  Chemistry: [
    {
      question: "The IUPAC name of CH₃CH₂CH(CH₃)CH₂CH₃ is:",
      options: ["3-methylpentane", "2-methylpentane", "1-methylpentane", "3-ethylbutane"],
      correctAnswer: 0,
      topic: "IUPAC Nomenclature"
    },
    {
      question: "Which of the following has maximum ionic character?",
      options: ["CsF", "NaCl", "LiF", "KBr"],
      correctAnswer: 0,
      topic: "Chemical Bonding"
    },
    {
      question: "The hybridization of carbon in diamond is:",
      options: ["sp³", "sp²", "sp", "sp³d"],
      correctAnswer: 0,
      topic: "Hybridization"
    },
    {
      question: "Which of the following is most acidic?",
      options: ["CCl₃COOH", "CHCl₂COOH", "CH₂ClCOOH", "CH₃COOH"],
      correctAnswer: 0,
      topic: "Carboxylic Acids"
    },
    {
      question: "The number of moles of KMnO₄ required to oxidize 1 mole of FeC₂O₄ in acidic medium is:",
      options: ["0.6", "1.0", "1.5", "2.0"],
      correctAnswer: 0,
      topic: "Redox Reactions"
    },
    {
      question: "Which of the following molecules has zero dipole moment?",
      options: ["BF₃", "NF₃", "ClF₃", "H₂O"],
      correctAnswer: 0,
      topic: "Molecular Structure"
    },
    {
      question: "The pH of 0.1 M NH₄Cl solution (Kb for NH₃ = 1.8 × 10⁻⁵) is:",
      options: ["5.1", "4.6", "8.9", "9.4"],
      correctAnswer: 0,
      topic: "Ionic Equilibrium"
    },
    {
      question: "Which of the following has the highest melting point?",
      options: ["NaCl", "MgO", "CaO", "BaO"],
      correctAnswer: 1,
      topic: "Ionic Compounds"
    },
    {
      question: "The rate of reaction is doubled when temperature is increased from 298K to 308K. The activation energy is:",
      options: ["53.6 kJ/mol", "26.8 kJ/mol", "107.2 kJ/mol", "80.4 kJ/mol"],
      correctAnswer: 0,
      topic: "Chemical Kinetics"
    },
    {
      question: "Which of the following is a nucleophile?",
      options: ["OH⁻", "BF₃", "AlCl₃", "H⁺"],
      correctAnswer: 0,
      topic: "Organic Mechanisms"
    },
    {
      question: "The coordination number of central metal ion in [Co(NH₃)₆]³⁺ is:",
      options: ["6", "4", "8", "2"],
      correctAnswer: 0,
      topic: "Coordination Chemistry"
    },
    {
      question: "Which of the following has maximum number of unpaired electrons?",
      options: ["Fe³⁺", "Mn²⁺", "Cr³⁺", "Ni²⁺"],
      correctAnswer: 1,
      topic: "Transition Elements"
    },
    {
      question: "The molecular formula of glucose is C₆H₁₂O₆. Its molecular weight is:",
      options: ["180", "162", "198", "342"],
      correctAnswer: 0,
      topic: "Biomolecules"
    },
    {
      question: "Which of the following is not a reducing sugar?",
      options: ["Sucrose", "Glucose", "Fructose", "Maltose"],
      correctAnswer: 0,
      topic: "Carbohydrates"
    },
    {
      question: "The oxidation state of sulfur in H₂SO₅ is:",
      options: ["+6", "+4", "+2", "+8"],
      correctAnswer: 0,
      topic: "Oxidation States"
    },
    {
      question: "Which of the following is most basic?",
      options: ["Methylamine", "Dimethylamine", "Trimethylamine", "Ammonia"],
      correctAnswer: 1,
      topic: "Amines"
    },
    {
      question: "The shape of ClF₃ molecule is:",
      options: ["T-shaped", "Trigonal planar", "Trigonal bipyramidal", "Linear"],
      correctAnswer: 0,
      topic: "VSEPR Theory"
    },
    {
      question: "Which of the following polymer is biodegradable?",
      options: ["PHBV", "PVC", "Polystyrene", "Polyethylene"],
      correctAnswer: 0,
      topic: "Polymers"
    },
    {
      question: "The number of π bonds in benzene is:",
      options: ["3", "6", "9", "12"],
      correctAnswer: 0,
      topic: "Aromatic Compounds"
    },
    {
      question: "Which of the following shows optical isomerism?",
      options: ["Lactic acid", "Acetic acid", "Formic acid", "Oxalic acid"],
      correctAnswer: 0,
      topic: "Isomerism"
    },
    {
      question: "The gas evolved when zinc reacts with dilute HCl is:",
      options: ["H₂", "Cl₂", "ZnCl₂", "O₂"],
      correctAnswer: 0,
      topic: "Hydrogen"
    },
    {
      question: "Which of the following is amphoteric oxide?",
      options: ["Al₂O₃", "Na₂O", "SO₃", "CO₂"],
      correctAnswer: 0,
      topic: "Oxides"
    },
    {
      question: "The electronic configuration of Cu²⁺ is:",
      options: ["[Ar] 3d⁹", "[Ar] 3d¹⁰ 4s¹", "[Ar] 3d⁸ 4s¹", "[Ar] 3d¹⁰"],
      correctAnswer: 0,
      topic: "Electronic Configuration"
    },
    {
      question: "Which of the following halides is most ionic?",
      options: ["CsI", "LiI", "NaI", "KI"],
      correctAnswer: 0,
      topic: "Halides"
    },
    {
      question: "The entropy change for the melting of ice at 0°C is:",
      options: ["22 J/mol·K", "44 J/mol·K", "11 J/mol·K", "33 J/mol·K"],
      correctAnswer: 0,
      topic: "Thermodynamics"
    }
  ],
  Biology: [
    {
      question: "The powerhouse of the cell is:",
      options: ["Mitochondria", "Ribosome", "Golgi apparatus", "Endoplasmic reticulum"],
      correctAnswer: 0,
      topic: "Cell Biology"
    },
    {
      question: "Photosynthesis in plants occurs in:",
      options: ["Chloroplasts", "Mitochondria", "Nucleus", "Vacuoles"],
      correctAnswer: 0,
      topic: "Photosynthesis"
    },
    {
      question: "The process by which plants lose water through their leaves is called:",
      options: ["Transpiration", "Respiration", "Photosynthesis", "Absorption"],
      correctAnswer: 0,
      topic: "Plant Physiology"
    },
    {
      question: "DNA replication occurs during which phase of cell cycle?",
      options: ["S phase", "G1 phase", "G2 phase", "M phase"],
      correctAnswer: 0,
      topic: "Cell Cycle"
    },
    {
      question: "The genetic material in most viruses is:",
      options: ["DNA or RNA", "Only DNA", "Only RNA", "Protein"],
      correctAnswer: 0,
      topic: "Molecular Biology"
    },
    {
      question: "Insulin is produced by:",
      options: ["Beta cells of pancreas", "Alpha cells of pancreas", "Liver", "Kidney"],
      correctAnswer: 0,
      topic: "Endocrine System"
    },
    {
      question: "The site of protein synthesis in a cell is:",
      options: ["Ribosome", "Mitochondria", "Nucleus", "Golgi apparatus"],
      correctAnswer: 0,
      topic: "Protein Synthesis"
    },
    {
      question: "Which of the following is not a greenhouse gas?",
      options: ["Nitrogen", "Carbon dioxide", "Methane", "Nitrous oxide"],
      correctAnswer: 0,
      topic: "Environmental Biology"
    },
    {
      question: "The term 'biodiversity' refers to:",
      options: ["Variety of life forms", "Number of species", "Genetic variation", "Ecosystem diversity"],
      correctAnswer: 0,
      topic: "Biodiversity"
    },
    {
      question: "Mendel's law of independent assortment is applicable when genes are located on:",
      options: ["Different chromosomes", "Same chromosome", "X chromosome", "Y chromosome"],
      correctAnswer: 0,
      topic: "Genetics"
    },
    {
      question: "The liquid part of blood is called:",
      options: ["Plasma", "Serum", "Lymph", "Hemoglobin"],
      correctAnswer: 0,
      topic: "Circulatory System"
    },
    {
      question: "Which enzyme is responsible for joining DNA fragments?",
      options: ["DNA ligase", "DNA polymerase", "DNA helicase", "Restriction enzyme"],
      correctAnswer: 0,
      topic: "Biotechnology"
    },
    {
      question: "The smallest unit of life is:",
      options: ["Cell", "Atom", "Molecule", "Organ"],
      correctAnswer: 0,
      topic: "Basic Biology"
    },
    {
      question: "Artificial selection has been used by humans to develop:",
      options: ["Crop varieties", "Wild animals", "Natural ecosystems", "Climate"],
      correctAnswer: 0,
      topic: "Evolution"
    },
    {
      question: "The study of heredity and variation is called:",
      options: ["Genetics", "Evolution", "Ecology", "Taxonomy"],
      correctAnswer: 0,
      topic: "Genetics"
    },
    {
      question: "Which of the following is a vestigial organ in humans?",
      options: ["Appendix", "Heart", "Lungs", "Brain"],
      correctAnswer: 0,
      topic: "Human Anatomy"
    },
    {
      question: "The process of breakdown of glucose to release energy is called:",
      options: ["Cellular respiration", "Photosynthesis", "Fermentation", "Digestion"],
      correctAnswer: 0,
      topic: "Respiration"
    },
    {
      question: "Which hormone regulates blood sugar levels?",
      options: ["Insulin", "Thyroxine", "Adrenaline", "Growth hormone"],
      correctAnswer: 0,
      topic: "Endocrine System"
    },
    {
      question: "The basic unit of classification is:",
      options: ["Species", "Genus", "Family", "Order"],
      correctAnswer: 0,
      topic: "Taxonomy"
    },
    {
      question: "Bacterial cell walls are made up of:",
      options: ["Peptidoglycan", "Cellulose", "Chitin", "Lignin"],
      correctAnswer: 0,
      topic: "Microbiology"
    },
    {
      question: "The theory of natural selection was proposed by:",
      options: ["Charles Darwin", "Gregor Mendel", "Watson and Crick", "Lamarck"],
      correctAnswer: 0,
      topic: "Evolution"
    },
    {
      question: "Which of the following is a communicable disease?",
      options: ["Tuberculosis", "Diabetes", "Cancer", "Hypertension"],
      correctAnswer: 0,
      topic: "Human Health"
    },
    {
      question: "The functional unit of kidney is:",
      options: ["Nephron", "Neuron", "Alveoli", "Villi"],
      correctAnswer: 0,
      topic: "Excretory System"
    },
    {
      question: "Photosynthesis is an example of:",
      options: ["Anabolic reaction", "Catabolic reaction", "Neutral reaction", "Reversible reaction"],
      correctAnswer: 0,
      topic: "Biochemistry"
    },
    {
      question: "The scientific name of human beings is:",
      options: ["Homo sapiens", "Homo erectus", "Homo habilis", "Homo neanderthalensis"],
      correctAnswer: 0,
      topic: "Human Evolution"
    },
    {
      question: "Which organelle is known as the 'suicide bag' of the cell?",
      options: ["Lysosome", "Ribosome", "Mitochondria", "Golgi apparatus"],
      correctAnswer: 0,
      topic: "Cell Organelles"
    },
    {
      question: "The process by which organisms maintain constant internal conditions is called:",
      options: ["Homeostasis", "Metabolism", "Reproduction", "Growth"],
      correctAnswer: 0,
      topic: "Physiology"
    },
    {
      question: "Which blood group is called universal donor?",
      options: ["O negative", "AB positive", "A positive", "B negative"],
      correctAnswer: 0,
      topic: "Blood Groups"
    },
    {
      question: "The male reproductive part of a flower is:",
      options: ["Stamen", "Pistil", "Sepal", "Petal"],
      correctAnswer: 0,
      topic: "Plant Reproduction"
    },
    {
      question: "Ozone layer depletion is primarily caused by:",
      options: ["CFCs", "Carbon dioxide", "Methane", "Nitrogen oxides"],
      correctAnswer: 0,
      topic: "Environmental Issues"
    }
  ]
};

// Mock API function with real NEET questions
const mockAPI = {
  getQuestions: (examId) => {
    const examPatterns = {
      'NEET': {
        name: 'NEET (National Eligibility cum Entrance Test)',
        duration: 200, // 3 hours 20 minutes
        sections: [
          { subject: 'Physics', questions: 45 },
          { subject: 'Chemistry', questions: 45 },
          { subject: 'Biology', questions: 90 }
        ]
      }
    };

    const pattern = examPatterns[examId] || examPatterns['NEET'];
    const questions = [];
    let questionId = 1;

    pattern.sections.forEach(section => {
      const subjectQuestions = neetQuestions[section.subject] || [];
      
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

  const isLowTime = timeLeft < 600; // Last 10 minutes

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
      Biology: 'bg-purple-100 text-purple-800'
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
        <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto">
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

  const estimatedRank = Math.floor(Math.random() * 15000) + 5000; // Mock rank for NEET

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

// Main NEET Test Page Component
const NEETTestPage = () => {
  const [examId] = useState('NEET');
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
      Physics: { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 45, score: 0, maxScore: 180, percentage: 0 },
      Chemistry: { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 45, score: 0, maxScore: 180, percentage: 0 },
      Biology: { correct: 0, wrong: 0, unattempted: 0, attempted: 0, total: 90, score: 0, maxScore: 360, percentage: 0 }
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
                  <li>• Each correct answer carries 4 marks</li>
                  <li>• Each wrong answer has negative marking of 1 mark</li>
                  <li>• You can navigate between questions and change your answers</li>
                  <li>• Test will auto-submit when time expires</li>
                  <li>• Make sure you have stable internet connection</li>
                  <li>• Biology section has 90 questions (Botany + Zoology)</li>
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
              <p className="mb-4">
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

export default NEETTestPage;