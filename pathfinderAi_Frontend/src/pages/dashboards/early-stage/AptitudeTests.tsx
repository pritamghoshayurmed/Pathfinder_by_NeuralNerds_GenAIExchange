import { useState, useEffect } from "react";
import { Brain, Clock, Star, Play, CheckCircle, ArrowLeft, ArrowRight, RotateCcw, Timer, AlertTriangle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DashboardLayout from "@/components/DashboardLayout";

const AptitudeTests = () => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [testDuration] = useState(30 * 60); // 30 minutes total

  const logicalReasoningQuestions = [
    {
      id: 1,
      question: "If all roses are flowers and some flowers fade quickly, can we conclude that some roses fade quickly?",
      options: [
        "Yes",
        "No", 
        "Cannot be concluded",
        "All roses fade quickly"
      ],
      correctAnswer: "Cannot be concluded"
    },
    {
      id: 2,
      question: "A train leaves at 8:00 AM traveling at 60 km/h. Another leaves at 9:00 AM at 90 km/h. At what time will the second train catch up?",
      options: [
        "11:00 AM",
        "11:30 AM",
        "12:00 PM",
        "12:30 PM"
      ],
      correctAnswer: "11:30 AM"
    },
    {
      id: 3,
      question: "Which number comes next in the sequence: 2, 6, 12, 20, 30, ?",
      options: [
        "36",
        "40",
        "42",
        "44"
      ],
      correctAnswer: "42"
    },
    {
      id: 4,
      question: "If \"PAPER\" is coded as \"OZODQ,\" how would \"PENCIL\" be coded?",
      options: [
        "ODMBHK",
        "ODMZHK",
        "ODMCHK",
        "ODNCHK"
      ],
      correctAnswer: "ODMZHK"
    },
    {
      id: 5,
      question: "Two friends are standing back-to-back. One faces north, the other south. If the first turns 90° left, and the second turns 90° right, are they facing the same direction?",
      options: [
        "Yes",
        "No",
        "Sometimes",
        "Cannot be determined"
      ],
      correctAnswer: "Yes"
    },
    {
      id: 6,
      question: "All cats are animals. Some animals are not dogs. Can we conclude that some cats are not dogs?",
      options: [
        "Yes",
        "No",
        "Cannot be concluded",
        "All cats are dogs"
      ],
      correctAnswer: "Yes"
    },
    {
      id: 7,
      question: "Rearrange the letters \"CIFAIPC\" to form a meaningful word.",
      options: [
        "PACIFIC",
        "PACIFCI",
        "CIFAPIC",
        "PICAFIC"
      ],
      correctAnswer: "PACIFIC"
    },
    {
      id: 8,
      question: "Which shape is different: Square, Rectangle, Circle, Triangle?",
      options: [
        "Square",
        "Rectangle",
        "Circle",
        "Triangle"
      ],
      correctAnswer: "Circle"
    },
    {
      id: 9,
      question: "If yesterday was Wednesday, what day will it be 15 days from now?",
      options: [
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      correctAnswer: "Thursday"
    },
    {
      id: 10,
      question: "Spot the odd one out: 2, 3, 5, 7, 11, 15.",
      options: [
        "2",
        "7",
        "11",
        "15"
      ],
      correctAnswer: "15"
    },
    {
      id: 11,
      question: "Which number is missing: 7, 14, 28, ?, 112.",
      options: [
        "42",
        "48",
        "54",
        "56"
      ],
      correctAnswer: "42"
    },
    {
      id: 12,
      question: "If five pencils cost as much as two pens, and each pen costs $1.50, how much does one pencil cost?",
      options: [
        "$0.30",
        "$0.50",
        "$0.60",
        "$0.75"
      ],
      correctAnswer: "$0.60"
    },
    {
      id: 13,
      question: "Arrange in logical order: Seed, Plant, Fruit, Flower, Tree.",
      options: [
        "Seed → Plant → Flower → Tree → Fruit",
        "Seed → Plant → Tree → Flower → Fruit",
        "Seed → Plant → Fruit → Flower → Tree",
        "Seed → Flower → Plant → Fruit → Tree"
      ],
      correctAnswer: "Seed → Plant → Tree → Flower → Fruit"
    },
    {
      id: 14,
      question: "If all Zips are Zaps, and some Zaps are Zups, can we say all Zips are Zups?",
      options: [
        "Yes",
        "No",
        "Sometimes",
        "Cannot be concluded"
      ],
      correctAnswer: "Cannot be concluded"
    },
    {
      id: 15,
      question: "Which day is three days before the day immediately after tomorrow if today is Monday?",
      options: [
        "Friday",
        "Saturday",
        "Sunday",
        "Monday"
      ],
      correctAnswer: "Sunday"
    },
    {
      id: 16,
      question: "Find the odd one: Dog, Cat, Tiger, Whale.",
      options: [
        "Dog",
        "Cat",
        "Tiger",
        "Whale"
      ],
      correctAnswer: "Whale"
    },
    {
      id: 17,
      question: "A cube has all faces painted. If it's cut into 64 small cubes, how many small cubes will have exactly one painted face?",
      options: [
        "16",
        "24",
        "32",
        "48"
      ],
      correctAnswer: "48"
    },
    {
      id: 18,
      question: "Which of these is a logical pair:",
      options: [
        "Pen–Ink",
        "Knife–Bread",
        "Book–Page",
        "Fish–Water"
      ],
      correctAnswer: "Pen–Ink"
    },
    {
      id: 19,
      question: "If 5 workers can build a wall in 20 days, how long will 10 workers take?",
      options: [
        "5 days",
        "10 days",
        "15 days",
        "20 days"
      ],
      correctAnswer: "10 days"
    },
    {
      id: 20,
      question: "Which letter replaces the question mark: A, C, F, J, O, ?",
      options: [
        "R",
        "S",
        "T",
        "U"
      ],
      correctAnswer: "T"
    },
    {
      id: 21,
      question: "Which is heavier: 1 kg of iron or 1 kg of cotton?",
      options: [
        "Iron",
        "Cotton",
        "Both weigh the same",
        "Cannot be compared"
      ],
      correctAnswer: "Both weigh the same"
    },
    {
      id: 22,
      question: "If John is taller than Mike, and Mike is taller than Sam, who is the shortest?",
      options: [
        "John",
        "Mike",
        "Sam",
        "Cannot be determined"
      ],
      correctAnswer: "Sam"
    },
    {
      id: 23,
      question: "Which number is missing: 81, 64, 49, 36, 25, ?",
      options: [
        "9",
        "12",
        "16",
        "20"
      ],
      correctAnswer: "16"
    },
    {
      id: 24,
      question: "If \"EARTH\" is written as \"RAETH,\" how is \"PLANT\" written?",
      options: [
        "ALPNT",
        "LAPNT",
        "LPA NT",
        "LAPTN"
      ],
      correctAnswer: "LAPNT"
    },
    {
      id: 25,
      question: "If every child has 2 pencils and there are 20 children, how many pencils are there?",
      options: [
        "20",
        "30",
        "40",
        "50"
      ],
      correctAnswer: "40"
    }
  ];

  const creativeThinkingQuestions = [
    {
      id: 1,
      question: "If humans had wings, how would cities be designed differently?",
      options: [
        "Houses would be taller with landing platforms",
        "Roads would be replaced by sky lanes",
        "Buildings would have rooftop parking for people",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 2,
      question: "Imagine you are tasked with creating a new sport. What would it look like?",
      options: [
        "A mix of football and basketball in water",
        "A zero-gravity obstacle race",
        "A drone-controlled racing league",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 3,
      question: "How would you use a paperclip in 10 different ways besides holding paper?",
      options: [
        "As a key holder",
        "As a phone SIM ejector",
        "As jewelry or art",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 4,
      question: "If colors had personalities, what kind of person would \"blue\" be?",
      options: [
        "Calm and thoughtful",
        "Sad and quiet",
        "Loyal and trustworthy",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 5,
      question: "How would you redesign a school classroom to make learning more fun?",
      options: [
        "Use VR and AR for lessons",
        "Circular seating instead of rows",
        "Outdoor learning zones",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 6,
      question: "Invent a gadget that could help people save time in daily life.",
      options: [
        "Self-cooking lunchbox",
        "Automatic bed maker",
        "Hologram meeting device",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 7,
      question: "If you could merge two animals to create a new species, which ones would you choose?",
      options: [
        "Lion + Eagle (Sky King)",
        "Dolphin + Horse (Aqua Rider)",
        "Cat + Owl (Night Hunter)",
        "Any of the above"
      ],
      correctAnswer: "Any of the above"
    },
    {
      id: 8,
      question: "What alternative use could a smartphone have if it wasn't used for communication?",
      options: [
        "Personal medical scanner",
        "Portable 3D printer",
        "Universal translator",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 9,
      question: "Imagine a future where cars no longer exist. How would people travel?",
      options: [
        "Flying pods",
        "Teleportation booths",
        "High-speed underground rails",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 10,
      question: "If you had to describe the internet as a living creature, what would it look like?",
      options: [
        "A giant spider web",
        "A brain with glowing neurons",
        "A shapeshifting octopus",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 11,
      question: "What product would you create if you had unlimited resources?",
      options: [
        "A cure for all diseases",
        "A pollution-eating machine",
        "A happiness generator",
        "Any of the above"
      ],
      correctAnswer: "Any of the above"
    },
    {
      id: 12,
      question: "How could a restaurant attract customers without serving food?",
      options: [
        "Virtual food experiences",
        "Mood-based music and art dining",
        "Robot chef performances",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 13,
      question: "If you could redesign the calendar, how would you structure it?",
      options: [
        "10 months with 36 days each",
        "Equal 4-day weeks for balance",
        "A floating \"holiday month\"",
        "Any of the above"
      ],
      correctAnswer: "Any of the above"
    },
    {
      id: 14,
      question: "How would you design shoes for someone living on the moon?",
      options: [
        "Gravity-adjusted soles",
        "Oxygen storage units",
        "Magnetic grip boots",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 15,
      question: "What could a library of the future look like?",
      options: [
        "A hologram knowledge hub",
        "A brain-to-book download station",
        "An AI-driven virtual librarian",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 16,
      question: "How would you make a boring object, like a spoon, exciting?",
      options: [
        "Self-stirring with sensors",
        "Color-changing with temperature",
        "Musical spoons that play sounds",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 17,
      question: "If laughter was a form of currency, what would the economy look like?",
      options: [
        "Comedians would be billionaires",
        "Sad people would be poor",
        "Happiness banks would exist",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 18,
      question: "What new festival would you introduce to celebrate creativity?",
      options: [
        "Global Invention Day",
        "Art in the Streets Festival",
        "DIY World Challenge",
        "Any of the above"
      ],
      correctAnswer: "Any of the above"
    },
    {
      id: 19,
      question: "How would you reinvent the concept of a chair?",
      options: [
        "A floating anti-gravity chair",
        "A chair that adapts to mood",
        "A chair that charges devices",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 20,
      question: "If you could invent a new sense for humans, what would it be?",
      options: [
        "Sense of detecting lies",
        "Sense of time travel",
        "Sense of emotions around you",
        "Any of the above"
      ],
      correctAnswer: "Any of the above"
    },
    {
      id: 21,
      question: "How would you turn a desert into a place of fun and joy?",
      options: [
        "Sand surfing parks",
        "Solar-powered resorts",
        "Oasis theme parks",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 22,
      question: "What changes would you make if you were designing a house for underwater living?",
      options: [
        "Oxygen recycling walls",
        "Transparent dome windows",
        "Submarine-style transport pods",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 23,
      question: "If time could be paused, how would people use it creatively?",
      options: [
        "Finish tasks instantly",
        "Explore the world safely",
        "Play long-lasting pranks",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 24,
      question: "What could replace books if they no longer existed?",
      options: [
        "Hologram stories",
        "Memory implants",
        "AI-narrated experiences",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 25,
      question: "How would you design a city powered entirely by music?",
      options: [
        "Roads made of sound-absorbing tiles",
        "Energy from musical vibrations",
        "Traffic signals that sing instructions",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    }
  ];

  const analyticalSkillsQuestions = [
    {
      id: 1,
      question: "A company's profit increased by 25% in 2024 compared to 2023. If the profit in 2023 was $80,000, what was it in 2024?",
      options: [
        "$90,000",
        "$95,000",
        "$100,000",
        "$105,000"
      ],
      correctAnswer: "$100,000"
    },
    {
      id: 2,
      question: "You have 10 liters of water and two empty jugs: one 7 liters, one 3 liters. How do you measure exactly 5 liters?",
      options: [
        "Fill 7L, pour into 3L, then refill 7L and pour until 3L is full → 5L left",
        "Fill 3L twice and subtract from 10L",
        "Pour randomly until balance achieved",
        "Impossible"
      ],
      correctAnswer: "Fill 7L, pour into 3L, then refill 7L and pour until 3L is full → 5L left"
    },
    {
      id: 3,
      question: "A store sells an item for $120 after a 20% discount. What was the original price?",
      options: [
        "$130",
        "$150",
        "$160",
        "$170"
      ],
      correctAnswer: "$150"
    },
    {
      id: 4,
      question: "If a project deadline is shortened by 5 days, what strategies would you use?",
      options: [
        "Work longer hours",
        "Add more resources",
        "Reduce scope",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 5,
      question: "What assumptions must you check before accepting survey data as accurate?",
      options: [
        "Sample size and representation",
        "Survey length only",
        "Number of questions only",
        "Who paid for survey"
      ],
      correctAnswer: "Sample size and representation"
    },
    {
      id: 6,
      question: "A factory produces 500 units in 8 hours. What is the production rate per hour?",
      options: [
        "50",
        "55",
        "62.5",
        "70"
      ],
      correctAnswer: "62.5"
    },
    {
      id: 7,
      question: "If a train takes 3 hours to cover 180 km, what is its average speed?",
      options: [
        "50 km/h",
        "60 km/h",
        "65 km/h",
        "70 km/h"
      ],
      correctAnswer: "60 km/h"
    },
    {
      id: 8,
      question: "You have data showing sales dropped for 3 months in a row. What might be the possible causes?",
      options: [
        "Seasonal demand change",
        "Poor marketing",
        "Competitor activity",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 9,
      question: "How would you test the claim that \"drinking coffee increases productivity\"?",
      options: [
        "Survey coffee drinkers only",
        "Random controlled experiment",
        "Observe workplace casually",
        "Assume true from experience"
      ],
      correctAnswer: "Random controlled experiment"
    },
    {
      id: 10,
      question: "What is the opportunity cost of attending a 4-year college?",
      options: [
        "Tuition fees only",
        "Forgone earnings + time + alternative opportunities",
        "Books and supplies only",
        "Nothing if you get a scholarship"
      ],
      correctAnswer: "Forgone earnings + time + alternative opportunities"
    },
    {
      id: 11,
      question: "If the price of apples doubles and your income remains the same, what economic effect occurs?",
      options: [
        "Substitution effect",
        "Income effect",
        "Giffen paradox",
        "No effect"
      ],
      correctAnswer: "Substitution effect"
    },
    {
      id: 12,
      question: "Which graph best shows a company's market share changes over 10 years?",
      options: [
        "Pie chart",
        "Line graph",
        "Bar chart",
        "Scatter plot"
      ],
      correctAnswer: "Line graph"
    },
    {
      id: 13,
      question: "If demand rises while supply falls, what happens to price?",
      options: [
        "Price increases",
        "Price decreases",
        "Price stays same",
        "Cannot be determined"
      ],
      correctAnswer: "Price increases"
    },
    {
      id: 14,
      question: "A student scored 60, 75, 80, and 85. What is the average score?",
      options: [
        "74",
        "75",
        "76",
        "78"
      ],
      correctAnswer: "75"
    },
    {
      id: 15,
      question: "How many different ways can you arrange the letters in \"BOOK\"?",
      options: [
        "12",
        "12",
        "16",
        "20"
      ],
      correctAnswer: "12"
    },
    {
      id: 16,
      question: "If the probability of rain tomorrow is 40%, what is the probability of no rain?",
      options: [
        "30%",
        "60%",
        "70%",
        "80%"
      ],
      correctAnswer: "60%"
    },
    {
      id: 17,
      question: "You are given a dataset with missing values. How would you handle it?",
      options: [
        "Delete all missing data",
        "Replace with averages",
        "Use advanced imputation techniques",
        "Any of the above depending on context"
      ],
      correctAnswer: "Any of the above depending on context"
    },
    {
      id: 18,
      question: "If a shopkeeper sells a bicycle at a 15% profit for $230, what was the cost price?",
      options: [
        "$190",
        "$195",
        "$200",
        "$210"
      ],
      correctAnswer: "$200"
    },
    {
      id: 19,
      question: "Which factors would you analyze before recommending a new business location?",
      options: [
        "Customer demand",
        "Competitor presence",
        "Accessibility",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 20,
      question: "If two dice are rolled, what is the probability of getting a sum of 8?",
      options: [
        "5/36",
        "6/36",
        "4/36",
        "7/36"
      ],
      correctAnswer: "5/36"
    },
    {
      id: 21,
      question: "How would you identify bias in a research study?",
      options: [
        "Check sample size",
        "Look at funding source",
        "Review methodology",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      id: 22,
      question: "A company's expenses increased by 10% while revenue increased by only 5%. What does this imply?",
      options: [
        "Profit margin improves",
        "Profit margin declines",
        "No change in profit margin",
        "Cannot be concluded"
      ],
      correctAnswer: "Profit margin declines"
    },
    {
      id: 23,
      question: "If a product costs $200 and is sold with a 25% margin, what is the selling price?",
      options: [
        "$220",
        "$225",
        "$250",
        "$275"
      ],
      correctAnswer: "$250"
    },
    {
      id: 24,
      question: "What logical steps would you take to evaluate competing job offers?",
      options: [
        "Compare salaries only",
        "Compare benefits only",
        "Compare growth opportunities only",
        "All of the above holistically"
      ],
      correctAnswer: "All of the above holistically"
    },
    {
      id: 25,
      question: "How can correlation and causation be distinguished in analysis?",
      options: [
        "By assuming correlation = causation",
        "By conducting controlled experiments",
        "By increasing sample size only",
        "By using more graphs"
      ],
      correctAnswer: "By conducting controlled experiments"
    }
  ];

  const communicationStyleQuestions = [
    {
      id: 1,
      question: "How do you adjust your tone when speaking to a friend versus your boss?",
      options: [
        "Speak casually with both",
        "Use informal tone with a friend, professional tone with a boss",
        "Always use formal tone with everyone",
        "Avoid changing tone"
      ],
      correctAnswer: "Use informal tone with a friend, professional tone with a boss"
    },
    {
      id: 2,
      question: "Give an example of when listening was more important than speaking.",
      options: [
        "During a conflict resolution meeting",
        "When teaching a concept",
        "While giving instructions",
        "While presenting on stage"
      ],
      correctAnswer: "During a conflict resolution meeting"
    },
    {
      id: 3,
      question: "How do you ensure your message is clear when writing an email?",
      options: [
        "Write long, detailed paragraphs",
        "Use technical jargon frequently",
        "Be concise, structured, and check for clarity",
        "Avoid subject lines"
      ],
      correctAnswer: "Be concise, structured, and check for clarity"
    },
    {
      id: 4,
      question: "What's your approach when explaining complex ideas to a non-expert?",
      options: [
        "Use all technical terms",
        "Simplify with analogies/examples",
        "Speak faster to save time",
        "Skip details"
      ],
      correctAnswer: "Simplify with analogies/examples"
    },
    {
      id: 5,
      question: "How do you handle interruptions during a presentation?",
      options: [
        "Ignore the person",
        "Get defensive",
        "Politely acknowledge and return to main point",
        "Stop the presentation"
      ],
      correctAnswer: "Politely acknowledge and return to main point"
    },
    {
      id: 6,
      question: "Describe a time when body language influenced communication.",
      options: [
        "Smiling to build rapport",
        "Using technical terms",
        "Writing an email",
        "Speaking louder"
      ],
      correctAnswer: "Smiling to build rapport"
    },
    {
      id: 7,
      question: "How do you balance being assertive and respectful in conversations?",
      options: [
        "Speak aggressively to be heard",
        "Avoid expressing opinions",
        "Express views clearly while respecting others",
        "Always agree with others"
      ],
      correctAnswer: "Express views clearly while respecting others"
    },
    {
      id: 8,
      question: "What strategies do you use to resolve misunderstandings?",
      options: [
        "Ignore the issue",
        "Argue until proven right",
        "Clarify, restate, and seek common ground",
        "Change the topic"
      ],
      correctAnswer: "Clarify, restate, and seek common ground"
    },
    {
      id: 9,
      question: "How do you adapt communication when speaking to someone from another culture?",
      options: [
        "Assume they think the same way",
        "Respect cultural norms and adjust tone",
        "Avoid communication",
        "Use slang frequently"
      ],
      correctAnswer: "Respect cultural norms and adjust tone"
    },
    {
      id: 10,
      question: "What role does empathy play in effective communication?",
      options: [
        "Helps understand others' perspectives",
        "Makes communication longer",
        "Creates unnecessary emotions",
        "Has no role"
      ],
      correctAnswer: "Helps understand others' perspectives"
    },
    {
      id: 11,
      question: "How do you adjust your communication for an introverted team member?",
      options: [
        "Force them to speak in meetings",
        "Give them space, use one-on-one or written channels",
        "Avoid talking to them",
        "Speak over them"
      ],
      correctAnswer: "Give them space, use one-on-one or written channels"
    },
    {
      id: 12,
      question: "How do you make sure feedback sounds constructive rather than critical?",
      options: [
        "Use positive language and suggest improvements",
        "Focus only on mistakes",
        "Be vague about improvements",
        "Avoid giving feedback"
      ],
      correctAnswer: "Use positive language and suggest improvements"
    },
    {
      id: 13,
      question: "How do you use storytelling to make a point more memorable?",
      options: [
        "Share relatable real-life examples",
        "Use only data and numbers",
        "Add irrelevant jokes",
        "Avoid stories"
      ],
      correctAnswer: "Share relatable real-life examples"
    },
    {
      id: 14,
      question: "When do you prefer written communication over verbal?",
      options: [
        "When documentation or record is needed",
        "Always, regardless of context",
        "Never, verbal is better",
        "Only when avoiding direct talk"
      ],
      correctAnswer: "When documentation or record is needed"
    },
    {
      id: 15,
      question: "How do you confirm the other person has understood your message?",
      options: [
        "Ask them to summarize or acknowledge",
        "Assume they understood",
        "Repeat louder",
        "End conversation quickly"
      ],
      correctAnswer: "Ask them to summarize or acknowledge"
    },
    {
      id: 16,
      question: "What non-verbal cues do you use to show engagement?",
      options: [
        "Eye contact, nodding, open posture",
        "Looking away",
        "Checking phone",
        "Crossing arms"
      ],
      correctAnswer: "Eye contact, nodding, open posture"
    },
    {
      id: 17,
      question: "How do you simplify jargon-heavy information?",
      options: [
        "Replace jargon with plain words",
        "Use more acronyms",
        "Skip explanation",
        "Add complex terms"
      ],
      correctAnswer: "Replace jargon with plain words"
    },
    {
      id: 18,
      question: "How do you communicate disagreement without escalating conflict?",
      options: [
        "Shout to prove your point",
        "Avoid saying anything",
        "State reasons calmly and respectfully",
        "Mock the other side"
      ],
      correctAnswer: "State reasons calmly and respectfully"
    },
    {
      id: 19,
      question: "When is it better to remain silent in a conversation?",
      options: [
        "When emotions are high and listening is needed",
        "Always",
        "Never",
        "Only when you don't care"
      ],
      correctAnswer: "When emotions are high and listening is needed"
    },
    {
      id: 20,
      question: "How do you use questioning to encourage dialogue?",
      options: [
        "Ask closed yes/no questions",
        "Ask open-ended questions",
        "Avoid questions",
        "Interrupt with multiple questions"
      ],
      correctAnswer: "Ask open-ended questions"
    },
    {
      id: 21,
      question: "What's the difference between active listening and passive listening?",
      options: [
        "Active = engaging & responding; Passive = hearing without feedback",
        "Active = louder hearing; Passive = softer hearing",
        "Active = ignoring speaker; Passive = attentive",
        "No difference"
      ],
      correctAnswer: "Active = engaging & responding; Passive = hearing without feedback"
    },
    {
      id: 22,
      question: "How do you adapt communication when working remotely?",
      options: [
        "Use clear emails, video calls, and structured updates",
        "Avoid regular communication",
        "Only chat casually",
        "Rely only on phone calls"
      ],
      correctAnswer: "Use clear emails, video calls, and structured updates"
    },
    {
      id: 23,
      question: "How do you handle giving bad news professionally?",
      options: [
        "Be direct, empathetic, and supportive",
        "Delay the message",
        "Use humor to soften",
        "Avoid telling at all"
      ],
      correctAnswer: "Be direct, empathetic, and supportive"
    },
    {
      id: 24,
      question: "What strategies do you use for persuasive communication?",
      options: [
        "Speak louder than others",
        "Use logic, emotion, and credibility (ethos, pathos, logos)",
        "Repeat the same point",
        "Avoid evidence"
      ],
      correctAnswer: "Use logic, emotion, and credibility (ethos, pathos, logos)"
    },
    {
      id: 25,
      question: "How do you maintain clarity when speaking under pressure?",
      options: [
        "Speak quickly to finish",
        "Avoid eye contact",
        "Stay calm, pause, and structure thoughts",
        "Skip key details"
      ],
      correctAnswer: "Stay calm, pause, and structure thoughts"
    }
  ];

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testStarted && !showResults && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitTest(); // Auto-submit when time expires
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testStarted, showResults, timeLeft]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get time color based on remaining time
  const getTimeColor = () => {
    const percentage = (timeLeft / testDuration) * 100;
    if (percentage <= 10) return "text-red-600";
    if (percentage <= 25) return "text-yellow-600";
    return "text-green-600";
  };

  const aptitudeTests = [
    {
      id: "logical",
      title: "Logical Reasoning",
      description: "Test your problem-solving and analytical thinking abilities",
      duration: "30 minutes",
      questions: 25,
      difficulty: "Easy",
      completed: false,
      score: null,
      icon: Brain,
      color: "from-blue-500 to-purple-500"
    },
    {
      id: "creative",
      title: "Creative Thinking",
      description: "Discover your creative potential and innovative thinking style",
      duration: "30 minutes",
      questions: 25,
      difficulty: "Medium",
      completed: false,
      score: null,
      icon: Star,
      color: "from-pink-500 to-orange-500"
    },
    {
      id: "analytical",
      title: "Analytical Skills",
      description: "Measure your ability to analyze data and solve complex problems",
      duration: "30 minutes",
      questions: 25,
      difficulty: "Medium",
      completed: false,
      score: null,
      icon: Brain,
      color: "from-green-500 to-teal-500"
    },
    {
      id: "communication",
      title: "Communication Style",
      description: "Understand your communication preferences and strengths",
      duration: "30 minutes",
      questions: 25,
      difficulty: "Medium",
      completed: false,
      score: null,
      icon: Star,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const personalityTraits = [
    { trait: "Logical Thinker", score: 85, color: "bg-blue-500" },
    { trait: "Creative Mind", score: 72, color: "bg-pink-500" },
    { trait: "Detail Oriented", score: 90, color: "bg-green-500" },
    { trait: "Team Player", score: 68, color: "bg-purple-500" },
    { trait: "Problem Solver", score: 88, color: "bg-orange-500" }
  ];

  const handleStartTest = (testId: string) => {
    if (testId === "logical" || testId === "creative" || testId === "analytical" || testId === "communication") {
      let selectedTestType = "";
      if (testId === "logical") selectedTestType = "logical-reasoning";
      if (testId === "creative") selectedTestType = "creative-thinking";
      if (testId === "analytical") selectedTestType = "analytical-skills";
      if (testId === "communication") selectedTestType = "communication-style";
      
      setSelectedTest(selectedTestType);
      setShowInstructions(true);
    } else {
      setSelectedTest(testId);
      // In a real app, this would navigate to the test interface for other tests
      console.log(`Starting test: ${testId}`);
    }
  };

  const getSelectedQuestions = () => {
    switch (selectedTest) {
      case 'logical-reasoning':
        return logicalReasoningQuestions;
      case 'creative-thinking':
        return creativeThinkingQuestions;
      case 'analytical-skills':
        return analyticalSkillsQuestions;
      case 'communication-style':
        return communicationStyleQuestions;
      default:
        return [];
    }
  };

  const getCurrentTestName = () => {
    switch (selectedTest) {
      case 'logical-reasoning':
        return 'Logical Reasoning & Analytical Skills';
      case 'creative-thinking':
        return 'Creative Thinking';
      case 'analytical-skills':
        return 'Analytical Skills';
      case 'communication-style':
        return 'Communication Style';
      default:
        return '';
    }
  };

  const questions = getSelectedQuestions();

  const handleConfirmStartTest = () => {
    setShowInstructions(false);
    setTestStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTimeLeft(30 * 60); // Reset timer to 30 minutes
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const handleSubmitTest = () => {
    setShowResults(true);
  };

  const handleRetakeTest = () => {
    setShowInstructions(true);
    setTestStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTimeLeft(30 * 60);
  };

  const handleBackToTests = () => {
    setTestStarted(false);
    setSelectedTest(null);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setShowInstructions(false);
    setTimeLeft(30 * 60);
  };

  // If test is started, show the test interface
  if (testStarted && (selectedTest === "logical-reasoning" || selectedTest === "creative-thinking" || selectedTest === "analytical-skills" || selectedTest === "communication-style")) {
    if (showResults) {
      const score = calculateScore();
      const correctAnswers = Object.entries(answers).filter(([index, answer]) => 
        answer === questions[parseInt(index)].correctAnswer
      ).length;

      return (
        <DashboardLayout 
          title={`${getCurrentTestName()} Test Results`}
          description="Your test has been completed"
        >
          <div className="p-6 space-y-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleBackToTests}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tests
              </Button>
            </div>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Test Completed!</CardTitle>
                <CardDescription>Here are your results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">{score}%</div>
                  <div className="text-xl text-muted-foreground">
                    {correctAnswers} out of {questions.length} correct
                  </div>
                </div>

                <Progress value={score} className="h-4" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                    <div className="text-sm text-green-600">Correct</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{questions.length - correctAnswers}</div>
                    <div className="text-sm text-red-600">Incorrect</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{score >= 70 ? "Good" : score >= 50 ? "Average" : "Needs Improvement"}</div>
                    <div className="text-sm text-blue-600">Performance</div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={handleRetakeTest} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake Test
                  </Button>
                  <Button onClick={handleBackToTests}>
                    Back to Tests
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analysis</CardTitle>
                <CardDescription>Review your answers for each question</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {questions.map((question, index) => {
                    const userAnswer = answers[index];
                    const isUnanswered = !userAnswer || userAnswer === "";
                    const isCorrect = !isUnanswered && userAnswer === question.correctAnswer;
                    
                    // Determine the visual state
                    const getCardStyle = () => {
                      if (isUnanswered) return 'border-yellow-200 bg-yellow-50';
                      if (isCorrect) return 'border-green-200 bg-green-50';
                      return 'border-red-200 bg-red-50';
                    };
                    
                    const getIconStyle = () => {
                      if (isUnanswered) return 'bg-yellow-500';
                      if (isCorrect) return 'bg-green-500';
                      return 'bg-red-500';
                    };
                    
                    return (
                      <div key={question.id} className={`p-6 rounded-lg border-2 ${getCardStyle()}`}>
                        <div className="space-y-4">
                          {/* Question Header */}
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getIconStyle()}`}>
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-relaxed">
                                Question {index + 1}: {question.question}
                              </h3>
                              
                              {/* Answer Options */}
                              <div className="grid gap-2 mb-4">
                                {question.options.map((option, optionIndex) => {
                                  const isUserAnswer = option === userAnswer;
                                  const isCorrectAnswer = option === question.correctAnswer;
                                  
                                  return (
                                    <div 
                                      key={optionIndex}
                                      className={`p-3 rounded-lg border text-sm font-medium ${
                                        isCorrectAnswer 
                                          ? 'bg-green-100 border-green-300 text-green-800' 
                                          : isUserAnswer && !isCorrect
                                          ? 'bg-red-100 border-red-300 text-red-800'
                                          : 'bg-gray-50 border-gray-200 text-gray-600'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold">
                                          {String.fromCharCode(97 + optionIndex)})
                                        </span>
                                        <span>{option}</span>
                                        {isCorrectAnswer && (
                                          <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                                        )}
                                        {isUserAnswer && !isCorrect && !isUnanswered && (
                                          <span className="text-red-600 ml-auto text-xs font-bold">Your Answer</span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              
                              {/* Answer Summary */}
                              <div className="border-t pt-3">
                                <div className="flex items-center justify-between text-sm">
                                  <div className={`font-semibold ${
                                    isUnanswered ? 'text-yellow-600' : 
                                    isCorrect ? 'text-green-600' : 
                                    'text-red-600'
                                  }`}>
                                    {isUnanswered ? '○ Unanswered' : 
                                     isCorrect ? '✓ Correct' : 
                                     '✗ Incorrect'}
                                  </div>
                                  <div className="text-gray-600">
                                    {userAnswer ? `You selected: ${userAnswer}` : 'Not answered'}
                                  </div>
                                </div>
                                {(isUnanswered || !isCorrect) && (
                                  <div className="text-green-600 font-medium text-sm mt-1">
                                    Correct answer: {question.correctAnswer}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      );
    }

    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const currentQ = questions[currentQuestion];

    return (
      <DashboardLayout 
        title={`${getCurrentTestName()} Test - Question ${currentQuestion + 1}`}
        description={`${questions.length} questions • 30 minutes`}
      >
        <div className="p-6 space-y-8">
          {/* Header with Timer and Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleBackToTests}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tests
            </Button>
            
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              
              {/* Timer */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                timeLeft <= 300 ? 'bg-red-50 border-red-200' : 
                timeLeft <= 900 ? 'bg-yellow-50 border-yellow-200' : 
                'bg-green-50 border-green-200'
              }`}>
                <Timer className={`w-4 h-4 ${getTimeColor()}`} />
                <span className={`font-mono font-semibold ${getTimeColor()}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              
              {/* Submit Button */}
              <Button 
                onClick={handleSubmitTest}
                variant="destructive"
                disabled={Object.keys(answers).length === 0}
              >
                Submit Test
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Main Content with Question Navigator on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Question Content - Left Side */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-lg font-medium leading-relaxed">
                    {currentQ.question}
                  </div>

                  <RadioGroup 
                    value={answers[currentQuestion] || ""} 
                    onValueChange={handleAnswerSelect}
                    className="space-y-3"
                  >
                    {currentQ.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-medium">
                          {String.fromCharCode(97 + index)}) {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline" 
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestion === 0}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    
                    {currentQuestion === questions.length - 1 ? (
                      <Button 
                        onClick={handleSubmitTest}
                        disabled={Object.keys(answers).length < questions.length}
                      >
                        Submit Test
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleNextQuestion}
                        disabled={!answers[currentQuestion]}
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Question Navigator - Right Side */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-sm">Question Navigator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {questions.map((_, index) => (
                      <Button
                        key={index}
                        variant={
                          index === currentQuestion 
                            ? "default" 
                            : answers[index] 
                            ? "secondary" 
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentQuestion(index)}
                        className="h-8 w-8 p-0 text-xs"
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                  <div className="space-y-2 mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded"></div>
                      <span>Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-secondary rounded"></div>
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-border rounded"></div>
                      <span>Unanswered</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Aptitude & Personality Tests" 
      description="Discover your natural strengths and learning style"
    >
      <div className="p-6 space-y-8">
        {/* Instructions Dialog */}
        <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                {getCurrentTestName()} Test Instructions
              </DialogTitle>
              <DialogDescription className="text-center">
                Please read the instructions carefully before starting the test
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Test Overview */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">30 min</div>
                  <div className="text-sm text-blue-600">Duration</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{questions.length}</div>
                  <div className="text-sm text-green-600">Questions</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{questions.length * 4}</div>
                  <div className="text-sm text-purple-600">Total Marks</div>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Instructions:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Each correct answer carries 4 marks
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Each wrong answer has negative marking of 1 mark
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    You can navigate between questions and change your answers
                  </li>
                  <li className="flex items-start gap-2">
                    <Timer className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    Test will auto-submit when time expires
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Make sure you have stable internet connection
                  </li>
                </ul>
              </div>

              {/* Subject Distribution */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Subject Distribution:</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Logical Reasoning</span>
                    <span className="text-sm font-semibold">25 questions</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={handleBackToTests} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleConfirmStartTest} className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Start Test
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="tests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tests">Available Tests</TabsTrigger>
            <TabsTrigger value="insights">Personality Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="space-y-6">
            {/* Available Tests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aptitudeTests.map((test) => (
                <Card key={test.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${test.color} flex items-center justify-center`}>
                        <test.icon className="w-6 h-6 text-white" />
                      </div>
                      {test.completed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{test.title}</CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {test.duration}
                        </span>
                        <span>{test.questions} questions</span>
                        <Badge variant="outline">{test.difficulty}</Badge>
                      </div>
                      
                      {test.completed && test.score && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Your Score</span>
                            <span className="text-lg font-bold text-primary">{test.score}%</span>
                          </div>
                          <Progress value={test.score} className="h-2" />
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => handleStartTest(test.id)}
                        className="w-full"
                        variant={test.completed ? "outline" : "default"}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {test.completed ? "Retake Test" : "Start Test"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tips for Better Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Before Taking Tests:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Find a quiet, comfortable place</li>
                      <li>• Take breaks between different tests</li>
                      <li>• Answer honestly, not what you think is "right"</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Understanding Results:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• No result is "bad" - they show your unique strengths</li>
                      <li>• Use results to explore matching career paths</li>
                      <li>• Discuss results with parents or teachers</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* Personality Insights */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6" />
                Your Personality Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personalityTraits.map((trait) => (
                  <div key={trait.trait} className="bg-white/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{trait.trait}</span>
                      <span className="text-sm font-bold">{trait.score}%</span>
                    </div>
                    <Progress value={trait.score} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AptitudeTests;