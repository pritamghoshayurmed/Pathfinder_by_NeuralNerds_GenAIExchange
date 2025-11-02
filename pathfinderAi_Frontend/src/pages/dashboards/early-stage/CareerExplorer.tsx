import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, Code, Palette, Microscope, Calculator, Globe, Music, Wrench, Users, Lightbulb, ArrowLeft, CheckCircle, Timer, TrendingUp, Briefcase, GraduationCap, MapPin, Building, Clock, Calendar, Award, Target, Star, Loader2, Sparkles, Brain, Network, TreePine, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import geminiRecommendationService, { type UserProfile, type RecommendationResult } from "@/services/geminiRecommendationService";
import careerPathwaysService, { type CareerPathwaysResult } from "@/services/careerPathwaysService";
import { testGeminiAPI } from "@/services/testGeminiAPI";
import { courseRecommendations } from "@/data/courseData";

const CareerExplorer = () => {
  const navigate = useNavigate();
  const { fieldId } = useParams<{ fieldId: string }>();
  const { toast } = useToast();
  const [selectedField, setSelectedField] = useState<string | null>(fieldId || null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCareerProgression, setShowCareerProgression] = useState(!!fieldId);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loadingPathways, setLoadingPathways] = useState<string | null>(null); // Track which field is loading
  
  // Gemini API integration states
  const [showSpecializationsTree, setShowSpecializationsTree] = useState(false);
  const [isLoadingSpecializations, setIsLoadingSpecializations] = useState(false);
  const [specializationsData, setSpecializationsData] = useState<RecommendationResult | null>(null);
  const [careerPathwaysData, setCareerPathwaysData] = useState<CareerPathwaysResult | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    interests: [],
    skills: [],
    careerGoals: [],
    preferences: {
      jobMarket: 70,
      salary: 60,
      workLifeBalance: 80,
      growth: 75
    }
  });

  // Effect to handle URL parameter changes
  useEffect(() => {
    if (fieldId && careerFields.find(field => field.id === fieldId)) {
      setSelectedField(fieldId);
      setShowCareerProgression(true);
    }
  }, [fieldId]);

  const careerFields = [
    {
      id: "stem",
      name: "STEM",
      icon: Microscope,
      color: "from-blue-500 to-cyan-500",
      description: "Science, Technology, Engineering & Mathematics",
      careers: ["Software Engineer", "Doctor", "Research Scientist", "Data Analyst", "Aerospace Engineer"],
      skills: ["Problem Solving", "Analytical Thinking", "Mathematical Skills", "Research"],
      story: "Imagine creating the next breakthrough in medicine or developing apps that millions use daily!",
      pathways: [
        {
          id: "cs-degree",
          title: "Computer Science Degree",
          institution: "Various Universities",
          duration: "4 years",
          level: "Bachelor's",
          cost: 50000,
          compatibility: 95,
          description: "Comprehensive program covering programming, algorithms, and software engineering",
          skills: ["Programming", "Data Structures", "Software Design", "Problem Solving"],
          careerOutcomes: ["Software Engineer", "Data Scientist", "Product Manager", "Tech Lead"],
          entryRequirements: "High school diploma, strong math background",
          jobPlacement: 92,
          avgSalary: 85000
        },
        {
          id: "engineering-bootcamp",
          title: "Software Engineering Bootcamp",
          institution: "Tech Academies",
          duration: "6 months",
          level: "Certificate",
          cost: 15000,
          compatibility: 88,
          description: "Intensive hands-on training in web development and programming",
          skills: ["Web Development", "JavaScript", "React", "Node.js"],
          careerOutcomes: ["Frontend Developer", "Full Stack Developer", "Web Developer"],
          entryRequirements: "Basic computer literacy",
          jobPlacement: 78,
          avgSalary: 65000
        },
        {
          id: "data-science",
          title: "Data Science Master's",
          institution: "Top Universities",
          duration: "2 years",
          level: "Master's",
          cost: 80000,
          compatibility: 90,
          description: "Advanced program in data analysis, machine learning, and statistics",
          skills: ["Python", "Machine Learning", "Statistics", "Data Visualization"],
          careerOutcomes: ["Data Scientist", "ML Engineer", "Research Scientist", "Data Analyst"],
          entryRequirements: "Bachelor's in related field, programming experience",
          jobPlacement: 94,
          avgSalary: 95000
        }
      ]
    },
    {
      id: "arts",
      name: "Arts & Creative",
      icon: Palette,
      color: "from-pink-500 to-purple-500",
      description: "Visual Arts, Performing Arts & Creative Expression",
      careers: ["Graphic Designer", "Filmmaker", "Writer", "Animator", "Art Director"],
      skills: ["Creativity", "Visual Communication", "Storytelling", "Innovation"],
      story: "Turn your imagination into reality through visual arts, stories, and creative expression!",
      pathways: [
        {
          id: "graphic-design",
          title: "Graphic Design Degree",
          institution: "Art Colleges",
          duration: "4 years",
          level: "Bachelor's",
          cost: 45000,
          compatibility: 92,
          description: "Comprehensive training in visual design, branding, and digital media",
          skills: ["Adobe Creative Suite", "Typography", "Branding", "Layout Design"],
          careerOutcomes: ["Graphic Designer", "Art Director", "Brand Designer", "UI/UX Designer"],
          entryRequirements: "High school diploma, portfolio submission",
          jobPlacement: 85,
          avgSalary: 52000
        },
        {
          id: "digital-media",
          title: "Digital Media Certificate",
          institution: "Online Platforms",
          duration: "1 year",
          level: "Certificate",
          cost: 8000,
          compatibility: 85,
          description: "Focused training in digital content creation and social media",
          skills: ["Video Editing", "Social Media", "Content Creation", "Photography"],
          careerOutcomes: ["Content Creator", "Social Media Manager", "Video Editor"],
          entryRequirements: "Basic computer skills",
          jobPlacement: 75,
          avgSalary: 40000
        },
        {
          id: "fine-arts",
          title: "Fine Arts Master's",
          institution: "Art Universities",
          duration: "2 years",
          level: "Master's",
          cost: 60000,
          compatibility: 88,
          description: "Advanced artistic training with focus on personal expression and technique",
          skills: ["Drawing", "Painting", "Sculpture", "Art History"],
          careerOutcomes: ["Professional Artist", "Art Teacher", "Gallery Curator", "Art Critic"],
          entryRequirements: "Bachelor's in arts, strong portfolio",
          jobPlacement: 70,
          avgSalary: 45000
        }
      ]
    },
    {
      id: "business",
      name: "Business & Commerce",
      icon: Calculator,
      color: "from-green-500 to-emerald-500",
      description: "Finance, Management & Entrepreneurship",
      careers: ["Business Analyst", "Marketing Manager", "Entrepreneur", "Accountant", "Consultant"],
      skills: ["Leadership", "Communication", "Strategic Thinking", "Financial Literacy"],
      story: "Lead teams, start your own company, or help businesses grow and succeed!",
      pathways: [
        {
          id: "business-admin",
          title: "Business Administration",
          institution: "Business Schools",
          duration: "4 years",
          level: "Bachelor's",
          cost: 55000,
          compatibility: 94,
          description: "Comprehensive business education covering all aspects of management",
          skills: ["Management", "Finance", "Marketing", "Operations"],
          careerOutcomes: ["Business Manager", "Consultant", "Operations Manager", "Entrepreneur"],
          entryRequirements: "High school diploma, strong analytical skills",
          jobPlacement: 89,
          avgSalary: 68000
        },
        {
          id: "mba",
          title: "Master of Business Administration",
          institution: "Top Business Schools",
          duration: "2 years",
          level: "Master's",
          cost: 120000,
          compatibility: 96,
          description: "Advanced business education for leadership roles",
          skills: ["Strategic Planning", "Leadership", "Finance", "Negotiations"],
          careerOutcomes: ["CEO", "Vice President", "Director", "Senior Consultant"],
          entryRequirements: "Bachelor's degree, work experience, GMAT scores",
          jobPlacement: 95,
          avgSalary: 125000
        },
        {
          id: "digital-marketing",
          title: "Digital Marketing Bootcamp",
          institution: "Marketing Institutes",
          duration: "3 months",
          level: "Certificate",
          cost: 5000,
          compatibility: 82,
          description: "Intensive training in online marketing and social media",
          skills: ["SEO", "Social Media Marketing", "Google Ads", "Analytics"],
          careerOutcomes: ["Digital Marketer", "Social Media Manager", "SEO Specialist"],
          entryRequirements: "Basic computer skills",
          jobPlacement: 80,
          avgSalary: 48000
        }
      ]
    },
    {
      id: "communication",
      name: "Communication & Media",
      icon: Globe,
      color: "from-orange-500 to-red-500",
      description: "Journalism, Public Relations & Digital Media",
      careers: ["Journalist", "Content Creator", "PR Specialist", "Social Media Manager", "News Anchor"],
      skills: ["Writing", "Public Speaking", "Research", "Digital Literacy"],
      story: "Share important stories with the world and shape public opinion through media!",
      pathways: [
        {
          id: "journalism",
          title: "Journalism Degree",
          institution: "Communication Schools",
          duration: "4 years",
          level: "Bachelor's",
          cost: 48000,
          compatibility: 93,
          description: "Comprehensive training in news writing, reporting, and media ethics",
          skills: ["News Writing", "Interviewing", "Research", "Media Law"],
          careerOutcomes: ["Journalist", "News Reporter", "Editor", "Correspondent"],
          entryRequirements: "High school diploma, strong writing skills",
          jobPlacement: 82,
          avgSalary: 45000
        },
        {
          id: "public-relations",
          title: "Public Relations Certificate",
          institution: "PR Institutes",
          duration: "8 months",
          level: "Certificate",
          cost: 12000,
          compatibility: 87,
          description: "Specialized training in brand communication and reputation management",
          skills: ["Press Relations", "Crisis Communication", "Event Planning", "Brand Management"],
          careerOutcomes: ["PR Specialist", "Communications Manager", "Brand Manager"],
          entryRequirements: "Bachelor's degree preferred",
          jobPlacement: 84,
          avgSalary: 55000
        }
      ]
    },
    {
      id: "sports",
      name: "Sports & Fitness",
      icon: Users,
      color: "from-teal-500 to-green-500",
      description: "Athletics, Coaching & Sports Management",
      careers: ["Professional Athlete", "Sports Coach", "Fitness Trainer", "Sports Journalist", "Sports Manager"],
      skills: ["Physical Fitness", "Teamwork", "Discipline", "Leadership"],
      story: "Combine your love for sports with a career that keeps you active and competitive!",
      pathways: [
        {
          id: "sports-science",
          title: "Sports Science Degree",
          institution: "Sports Universities",
          duration: "4 years",
          level: "Bachelor's",
          cost: 42000,
          compatibility: 91,
          description: "Scientific approach to sports performance and health",
          skills: ["Exercise Physiology", "Biomechanics", "Nutrition", "Psychology"],
          careerOutcomes: ["Sports Scientist", "Performance Coach", "Athletic Trainer"],
          entryRequirements: "High school diploma, sports background",
          jobPlacement: 86,
          avgSalary: 58000
        },
        {
          id: "fitness-certification",
          title: "Personal Training Certification",
          institution: "Fitness Organizations",
          duration: "3 months",
          level: "Certificate",
          cost: 2000,
          compatibility: 85,
          description: "Professional certification for personal training",
          skills: ["Exercise Programming", "Anatomy", "Nutrition", "Client Relations"],
          careerOutcomes: ["Personal Trainer", "Fitness Coach", "Gym Manager"],
          entryRequirements: "High school diploma, fitness background",
          jobPlacement: 88,
          avgSalary: 42000
        }
      ]
    },
    {
      id: "social",
      name: "Social Impact",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      description: "Education, Social Work & Community Service",
      careers: ["Teacher", "Social Worker", "NGO Leader", "Counselor", "Community Developer"],
      skills: ["Empathy", "Communication", "Problem Solving", "Patience"],
      story: "Make a difference in people's lives and contribute to building a better society!",
      pathways: [
        {
          id: "education",
          title: "Education Degree",
          institution: "Education Schools",
          duration: "4 years",
          level: "Bachelor's",
          cost: 40000,
          compatibility: 92,
          description: "Training for teaching and educational leadership",
          skills: ["Curriculum Design", "Classroom Management", "Child Development", "Assessment"],
          careerOutcomes: ["Teacher", "Principal", "Education Coordinator", "Curriculum Developer"],
          entryRequirements: "High school diploma, passion for teaching",
          jobPlacement: 90,
          avgSalary: 50000
        },
        {
          id: "social-work",
          title: "Social Work Master's",
          institution: "Social Work Schools",
          duration: "2 years",
          level: "Master's",
          cost: 50000,
          compatibility: 89,
          description: "Advanced training in social services and community work",
          skills: ["Counseling", "Case Management", "Community Organizing", "Policy Analysis"],
          careerOutcomes: ["Social Worker", "Therapist", "Program Director", "Policy Analyst"],
          entryRequirements: "Bachelor's degree, field experience",
          jobPlacement: 87,
          avgSalary: 52000
        }
      ]
    }
  ];

  // Function to handle pathway loading with loading state
  const handleViewPathways = async (fieldId: string) => {
    setLoadingPathways(fieldId);
    
    // Simulate loading time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to the pathways page
    navigate(`/dashboard/early-stage/career-pathways/${fieldId}`);
    
    // Reset loading state after navigation
    setLoadingPathways(null);
  };

  // Function to handle getting specializations from Gemini API
  const handleGetSpecializations = async (fieldId: string) => {
    console.log('🎯 Starting career pathway analysis for field:', fieldId);
    
    // Test API first
    try {
      console.log('🧪 Testing Gemini API connection...');
      await testGeminiAPI();
      console.log('✅ API test successful');
    } catch (testError) {
      console.error('❌ API test failed:', testError);
      toast({
        title: "API Connection Failed",
        description: "Unable to connect to AI service. Please check your internet connection.",
        variant: "destructive"
      });
      return;
    }
    
    const field = careerFields.find(f => f.id === fieldId);
    if (!field) {
      toast({
        title: "Error",
        description: "Career field not found",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingSpecializations(true);
    setShowSpecializationsTree(true);
    
    try {
      console.log('🚀 Calling Career Pathways API service...');
      
      const pathwaysResult = await careerPathwaysService.getCareerPathways(fieldId);
      
      console.log('✅ Received career pathways data:', pathwaysResult);
      
      setCareerPathwaysData(pathwaysResult);
      
      toast({
        title: "Career Pathways Loaded!",
        description: `Found ${pathwaysResult.pathways.length} career pathways in ${pathwaysResult.fieldName}`,
      });
      
      console.log('🎉 Career pathway analysis completed successfully');
      
    } catch (error) {
      console.error('❌ Error in handleGetSpecializations:', error);
      
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unable to fetch career pathways. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingSpecializations(false);
    }
  };

  const careerQuizQuestions = [
    {
      id: 1,
      question: "What type of environment do you prefer to work in?",
      options: [
        "A quiet office with computers and technology",
        "A creative studio with art supplies and inspiration",
        "A busy office with meetings and presentations",
        "Outdoors or in different locations"
      ],
      category: ["STEM", "Arts", "Business", "Sports"]
    },
    {
      id: 2,
      question: "Which activity sounds most interesting to you?",
      options: [
        "Solving complex math problems",
        "Creating digital artwork or videos",
        "Leading a team project",
        "Writing articles or stories"
      ],
      category: ["STEM", "Arts", "Business", "Communication"]
    },
    {
      id: 3,
      question: "What motivates you the most?",
      options: [
        "Making scientific discoveries",
        "Expressing creativity and imagination",
        "Building successful businesses",
        "Helping people in need"
      ],
      category: ["STEM", "Arts", "Business", "Social"]
    },
    {
      id: 4,
      question: "How do you prefer to spend your free time?",
      options: [
        "Learning new programming languages",
        "Drawing, painting, or designing",
        "Reading business magazines",
        "Playing sports or exercising"
      ],
      category: ["STEM", "Arts", "Business", "Sports"]
    },
    {
      id: 5,
      question: "What type of problem-solving appeals to you?",
      options: [
        "Technical and analytical challenges",
        "Creative and artistic challenges",
        "Strategic business challenges",
        "Social and community challenges"
      ],
      category: ["STEM", "Arts", "Business", "Social"]
    },
    {
      id: 6,
      question: "Which school subject do you enjoy most?",
      options: [
        "Mathematics and Science",
        "Art and Design",
        "Economics and Business Studies",
        "English and Literature"
      ],
      category: ["STEM", "Arts", "Business", "Communication"]
    },
    {
      id: 7,
      question: "What kind of impact do you want to make?",
      options: [
        "Innovate and create new technologies",
        "Inspire people through creative work",
        "Build and grow successful companies",
        "Make a positive difference in society"
      ],
      category: ["STEM", "Arts", "Business", "Social"]
    },
    {
      id: 8,
      question: "How do you prefer to communicate with others?",
      options: [
        "Through data and logical presentations",
        "Through visual and creative mediums",
        "Through persuasive and strategic discussions",
        "Through public speaking and media"
      ],
      category: ["STEM", "Arts", "Business", "Communication"]
    },
    {
      id: 9,
      question: "What type of skills would you like to develop?",
      options: [
        "Programming and technical skills",
        "Artistic and design skills",
        "Leadership and management skills",
        "Physical fitness and athletic skills"
      ],
      category: ["STEM", "Arts", "Business", "Sports"]
    },
    {
      id: 10,
      question: "Which work schedule appeals to you most?",
      options: [
        "Regular hours with deep focus time",
        "Flexible hours with creative freedom",
        "Varied schedule with meetings and travel",
        "Active schedule with physical activity"
      ],
      category: ["STEM", "Arts", "Business", "Sports"]
    },
    {
      id: 11,
      question: "What type of recognition do you value?",
      options: [
        "Recognition for technical innovation",
        "Recognition for creative excellence",
        "Recognition for business success",
        "Recognition for helping others"
      ],
      category: ["STEM", "Arts", "Business", "Social"]
    },
    {
      id: 12,
      question: "Which tool would you most like to master?",
      options: [
        "Advanced software and programming tools",
        "Design software and artistic tools",
        "Business analytics and strategy tools",
        "Communication and media tools"
      ],
      category: ["STEM", "Arts", "Business", "Communication"]
    },
    {
      id: 13,
      question: "What type of challenges excite you?",
      options: [
        "Debugging code and solving technical issues",
        "Creating something beautiful from nothing",
        "Growing a business from idea to success",
        "Improving community wellness and health"
      ],
      category: ["STEM", "Arts", "Business", "Social"]
    },
    {
      id: 14,
      question: "How do you prefer to learn new things?",
      options: [
        "Through experimentation and testing",
        "Through hands-on creative practice",
        "Through case studies and real examples",
        "Through interactive and social activities"
      ],
      category: ["STEM", "Arts", "Business", "Sports"]
    },
    {
      id: 15,
      question: "What type of workspace inspires you?",
      options: [
        "A high-tech lab or development environment",
        "A colorful studio with creative materials",
        "A modern office with meeting rooms",
        "Various locations and outdoor spaces"
      ],
      category: ["STEM", "Arts", "Business", "Communication"]
    },
    {
      id: 16,
      question: "Which achievement would make you proudest?",
      options: [
        "Developing a breakthrough technology",
        "Creating award-winning creative content",
        "Building a successful startup company",
        "Making a positive impact on people's lives"
      ],
      category: ["STEM", "Arts", "Business", "Social"]
    },
    {
      id: 17,
      question: "What type of collaboration do you prefer?",
      options: [
        "Working with other technical specialists",
        "Collaborating with creative professionals",
        "Leading diverse business teams",
        "Working directly with community members"
      ],
      category: ["STEM", "Arts", "Business", "Social"]
    },
    {
      id: 18,
      question: "Which type of research interests you most?",
      options: [
        "Scientific and technical research",
        "Cultural and artistic research",
        "Market and consumer research",
        "Social and behavioral research"
      ],
      category: ["STEM", "Arts", "Business", "Social"]
    },
    {
      id: 19,
      question: "What type of events would you enjoy attending?",
      options: [
        "Technology conferences and hackathons",
        "Art exhibitions and creative workshops",
        "Business networking and trade shows",
        "Sports competitions and fitness events"
      ],
      category: ["STEM", "Arts", "Business", "Sports"]
    },
    {
      id: 20,
      question: "Which skill comes most naturally to you?",
      options: [
        "Logical thinking and analysis",
        "Creative expression and imagination",
        "Persuasion and influence",
        "Physical coordination and athletics"
      ],
      category: ["STEM", "Arts", "Business", "Sports"]
    },
    {
      id: 21,
      question: "What type of media do you consume most?",
      options: [
        "Tech blogs and scientific journals",
        "Art magazines and creative content",
        "Business news and entrepreneurship stories",
        "News and current affairs"
      ],
      category: ["STEM", "Arts", "Business", "Communication"]
    },
    {
      id: 22,
      question: "Which type of mentor would you choose?",
      options: [
        "A successful engineer or scientist",
        "A renowned artist or designer",
        "A successful entrepreneur or CEO",
        "A respected teacher or social worker"
      ],
      category: ["STEM", "Arts", "Business", "Social"]
    },
    {
      id: 23,
      question: "What type of legacy do you want to leave?",
      options: [
        "Technological innovations that change the world",
        "Creative works that inspire future generations",
        "Successful businesses that create opportunities",
        "Positive changes in communities and society"
      ],
      category: ["STEM", "Arts", "Business", "Social"]
    },
    {
      id: 24,
      question: "Which type of competition appeals to you?",
      options: [
        "Coding competitions and tech challenges",
        "Art contests and creative competitions",
        "Business plan competitions and pitch contests",
        "Athletic competitions and sports tournaments"
      ],
      category: ["STEM", "Arts", "Business", "Sports"]
    },
    {
      id: 25,
      question: "What would be your ideal work-life balance?",
      options: [
        "Focused work periods with tech projects",
        "Flexible schedule with creative inspiration time",
        "Dynamic schedule with business networking",
        "Active lifestyle with physical challenges"
      ],
      category: ["STEM", "Arts", "Business", "Sports"]
    }
  ];

  const interactiveModules = [
    {
      title: "Day in the Life",
      description: "Experience a typical day in different careers through interactive simulations",
      status: "Available",
      progress: 0
    },
    {
      title: "Career Matching Quiz",
      description: "Answer fun questions to discover careers that match your interests",
      status: "In Progress",
      progress: 60
    },
    {
      title: "Industry Spotlight",
      description: "Learn about trending industries and emerging career opportunities",
      status: "Available",
      progress: 0
    },
    {
      title: "Success Stories",
      description: "Read inspiring stories from young professionals in various fields",
      status: "Completed",
      progress: 100
    }
  ];

  return (
    <DashboardLayout 
      title="Career Explorer" 
      description="Discover exciting career possibilities through interactive exploration"
    >
      {showCareerProgression ? (
        <div className="p-6 space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowCareerProgression(false);
                navigate('/dashboard/early-stage/careers');
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Career Fields
            </Button>
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <GitBranch className="w-6 h-6" />
                {selectedField && careerFields.find(f => f.id === selectedField)?.name} Career Progression
              </h2>
              <p className="text-muted-foreground">
                From entry-level to executive leadership in your chosen field
              </p>
            </div>
          </div>

          {/* Career Progression Flowchart */}
          <Card>
            <CardContent className="py-8">
              {/* Flowchart Header */}
              <div className="text-center mb-8">
                <Network className="w-16 h-16 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Career Progression Path</h3>
                <p className="text-muted-foreground">
                  Discover how your career can grow from entry-level to leadership
                </p>
              </div>

              {/* Selected Field Display */}
              {selectedField && (
                <div className="relative max-w-5xl mx-auto">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                      {(() => {
                        const field = careerFields.find(f => f.id === selectedField);
                        const IconComponent = field?.icon;
                        return IconComponent ? <IconComponent className="w-6 h-6 text-primary" /> : null;
                      })()}
                      <h4 className="text-lg font-semibold text-primary">
                        {careerFields.find(f => f.id === selectedField)?.name} Career Path
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      From entry-level to executive leadership
                    </p>
                  </div>

                  {/* Career Progression Levels - Field Specific */}
                  {selectedField === 'stem' && (
                    <>
                      {/* Level 1: Beginner Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-green-300 bg-green-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🌱</div>
                              <h4 className="font-semibold text-green-700 text-lg mb-2">Beginner-Level</h4>
                              <p className="text-sm text-green-600 mb-3">Entry Jobs / Internships / Technician Roles</p>
                              <div className="text-sm text-green-700 space-y-2 text-left">
                                <div>• STEM Internships (all domains)</div>
                                <div>• Lab Technician / Research Assistant</div>
                                <div>• IT Support / Help Desk Technician</div>
                                <div>• Junior Engineer / CAD Technician</div>
                                <div>• Data Entry / Junior Analyst</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-green-400 to-blue-400"></div>
                          <div className="text-3xl text-blue-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-blue-400 to-blue-600"></div>
                        </div>
                      </div>

                      {/* Level 2: Intermediate Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-blue-300 bg-blue-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">📈</div>
                              <h4 className="font-semibold text-blue-700 text-lg mb-2">Intermediate-Level</h4>
                              <p className="text-sm text-blue-600 mb-3">Professional & Applied Roles</p>
                              <div className="text-sm text-blue-700 space-y-2 text-left">
                                <div>• Research Associate / Scientist I</div>
                                <div>• Software Developer / Web Developer</div>
                                <div>• Civil / Mechanical / Electrical Engineer</div>
                                <div>• Data Analyst / BI Analyst</div>
                                <div>• Statistician / Operations Analyst</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-blue-400 to-purple-400"></div>
                          <div className="text-3xl text-purple-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-purple-400 to-purple-600"></div>
                        </div>
                      </div>

                      {/* Level 3: Advanced Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-purple-300 bg-purple-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🚀</div>
                              <h4 className="font-semibold text-purple-700 text-lg mb-2">Advanced-Level</h4>
                              <p className="text-sm text-purple-600 mb-3">Specialized & Leadership Roles</p>
                              <div className="text-sm text-purple-700 space-y-2 text-left">
                                <div>• Principal Scientist / R&D Scientist</div>
                                <div>• AI/ML Engineer / Cybersecurity Specialist</div>
                                <div>• Project Engineer / Robotics Engineer</div>
                                <div>• Data Scientist / ML Researcher</div>
                                <div>• Quantitative Analyst / Actuary</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-purple-400 to-amber-400"></div>
                          <div className="text-3xl text-amber-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-amber-400 to-amber-600"></div>
                        </div>
                      </div>

                      {/* Level 4: Expert Level */}
                      <div className="text-center mb-8">
                        <div className="inline-block">
                          <Card className="border-2 border-amber-300 bg-amber-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🏆</div>
                              <h4 className="font-semibold text-amber-700 text-lg mb-2">Expert-Level</h4>
                              <p className="text-sm text-amber-600 mb-3">Leadership, Innovation & Academia</p>
                              <div className="text-sm text-amber-700 space-y-2 text-left">
                                <div>• Chief Scientific Officer / Lead Researcher</div>
                                <div>• CTO / IT Director</div>
                                <div>• Chief Engineer / Engineering Manager</div>
                                <div>• Chief Data Scientist / Head of Analytics</div>
                                <div>• University Professor / Policy Advisor</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Arts & Creative specific progression */}
                  {selectedField === 'arts' && (
                    <>
                      {/* Level 1: Beginner Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-green-300 bg-green-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🌱</div>
                              <h4 className="font-semibold text-green-700 text-lg mb-2">Beginner-Level</h4>
                              <p className="text-sm text-green-600 mb-3">Entry Jobs / Assistant Roles</p>
                              <div className="text-sm text-green-700 space-y-2 text-left">
                                <div>• Art / Design Internships</div>
                                <div>• Gallery Assistant / Studio Assistant</div>
                                <div>• Junior Graphic Designer / Illustrator</div>
                                <div>• Content Creator / Social Media Assistant</div>
                                <div>• Photography Assistant / Film Crew Trainee</div>
                                <div>• Theatre Crew / Stagehand / Production Assistant</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-green-400 to-pink-400"></div>
                          <div className="text-3xl text-pink-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-pink-400 to-pink-600"></div>
                        </div>
                      </div>

                      {/* Level 2: Intermediate Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-pink-300 bg-pink-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">📈</div>
                              <h4 className="font-semibold text-pink-700 text-lg mb-2">Intermediate-Level</h4>
                              <p className="text-sm text-pink-600 mb-3">Professional & Applied Roles</p>
                              <div className="text-sm text-pink-700 space-y-2 text-left">
                                <div>• Graphic Designer / UX Designer</div>
                                <div>• Animator / Video Editor / Motion Graphics Artist</div>
                                <div>• Photographer / Cinematographer</div>
                                <div>• Writer / Copywriter / Scriptwriter</div>
                                <div>• Actor / Musician / Performer</div>
                                <div>• Game Designer / Concept Artist</div>
                                <div>• Curator / Art Teacher / Creative Educator</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-pink-400 to-purple-400"></div>
                          <div className="text-3xl text-purple-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-purple-400 to-purple-600"></div>
                        </div>
                      </div>

                      {/* Level 3: Advanced Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-purple-300 bg-purple-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🚀</div>
                              <h4 className="font-semibold text-purple-700 text-lg mb-2">Advanced-Level</h4>
                              <p className="text-sm text-purple-600 mb-3">Specialized & Leadership Roles</p>
                              <div className="text-sm text-purple-700 space-y-2 text-left">
                                <div>• Art Director / Creative Director</div>
                                <div>• Senior Illustrator / Lead Animator / VFX Supervisor</div>
                                <div>• Film Director / Producer</div>
                                <div>• Music Producer / Composer / Conductor</div>
                                <div>• Senior UX/UI Designer / Product Designer</div>
                                <div>• Playwright / Novelist / Screenwriter</div>
                                <div>• Gallery Curator / Museum Director</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-purple-400 to-rose-400"></div>
                          <div className="text-3xl text-rose-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-rose-400 to-rose-600"></div>
                        </div>
                      </div>

                      {/* Level 4: Expert Level */}
                      <div className="text-center mb-8">
                        <div className="inline-block">
                          <Card className="border-2 border-rose-300 bg-rose-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-rose-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🏆</div>
                              <h4 className="font-semibold text-rose-700 text-lg mb-2">Expert-Level</h4>
                              <p className="text-sm text-rose-600 mb-3">Leadership, Innovation & Academia</p>
                              <div className="text-sm text-rose-700 space-y-2 text-left">
                                <div>• Chief Creative Officer (CCO)</div>
                                <div>• Renowned Artist / International Performer</div>
                                <div>• Film Festival Director / Theatre Director</div>
                                <div>• Cultural Policy Advisor / Arts Consultant</div>
                                <div>• Professor of Arts / Fine Arts Researcher</div>
                                <div>• Founder of a Creative Studio / Production House</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Business & Commerce specific progression */}
                  {selectedField === 'business' && (
                    <>
                      {/* Level 1: Beginner Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-green-300 bg-green-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🌱</div>
                              <h4 className="font-semibold text-green-700 text-lg mb-2">Beginner-Level</h4>
                              <p className="text-sm text-green-600 mb-3">Entry Jobs / Internships / Assistant Roles</p>
                              <div className="text-sm text-green-700 space-y-2 text-left">
                                <div>• Business Internships (Finance, Marketing, HR, Sales)</div>
                                <div>• Administrative Assistant / Office Clerk</div>
                                <div>• Customer Service Representative / Sales Assistant</div>
                                <div>• Accounting Assistant / Bookkeeper</div>
                                <div>• Junior Analyst (Market, Finance, or Operations)</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-green-400 to-emerald-400"></div>
                          <div className="text-3xl text-emerald-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-emerald-400 to-emerald-600"></div>
                        </div>
                      </div>

                      {/* Level 2: Intermediate Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-emerald-300 bg-emerald-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">📈</div>
                              <h4 className="font-semibold text-emerald-700 text-lg mb-2">Intermediate-Level</h4>
                              <p className="text-sm text-emerald-600 mb-3">Professional & Applied Roles</p>
                              <div className="text-sm text-emerald-700 space-y-2 text-left">
                                <div>• Business Analyst / Financial Analyst</div>
                                <div>• Marketing Executive / Digital Marketing Specialist</div>
                                <div>• Accountant / Auditor</div>
                                <div>• Human Resource Specialist / Recruiter</div>
                                <div>• Sales Executive / Relationship Manager</div>
                                <div>• Operations Coordinator / Supply Chain Analyst</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-emerald-400 to-teal-400"></div>
                          <div className="text-3xl text-teal-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-teal-400 to-teal-600"></div>
                        </div>
                      </div>

                      {/* Level 3: Advanced Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-teal-300 bg-teal-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🚀</div>
                              <h4 className="font-semibold text-teal-700 text-lg mb-2">Advanced-Level</h4>
                              <p className="text-sm text-teal-600 mb-3">Specialized & Leadership Roles</p>
                              <div className="text-sm text-teal-700 space-y-2 text-left">
                                <div>• Project Manager / Product Manager</div>
                                <div>• Investment Banker / Portfolio Manager</div>
                                <div>• Chartered Accountant / CPA / Management Accountant</div>
                                <div>• Business Development Manager</div>
                                <div>• Management Consultant / Strategy Consultant</div>
                                <div>• Supply Chain Manager / Operations Manager</div>
                                <div>• Marketing Manager / Brand Manager</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-teal-400 to-blue-400"></div>
                          <div className="text-3xl text-blue-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-blue-400 to-blue-600"></div>
                        </div>
                      </div>

                      {/* Level 4: Expert Level */}
                      <div className="text-center mb-8">
                        <div className="inline-block">
                          <Card className="border-2 border-blue-300 bg-blue-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🏆</div>
                              <h4 className="font-semibold text-blue-700 text-lg mb-2">Expert-Level</h4>
                              <p className="text-sm text-blue-600 mb-3">Leadership, Innovation & Academia</p>
                              <div className="text-sm text-blue-700 space-y-2 text-left">
                                <div>• Chief Executive Officer (CEO)</div>
                                <div>• Chief Financial Officer (CFO)</div>
                                <div>• Chief Marketing Officer (CMO)</div>
                                <div>• Chief Operating Officer (COO)</div>
                                <div>• Entrepreneur / Startup Founder</div>
                                <div>• Venture Capitalist / Angel Investor</div>
                                <div>• Professor of Business / Economics / Management</div>
                                <div>• Policy Advisor (Economic, Trade, or Business Policy)</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Communication & Media specific progression */}
                  {selectedField === 'communication' && (
                    <>
                      {/* Level 1: Beginner Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-green-300 bg-green-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🌱</div>
                              <h4 className="font-semibold text-green-700 text-lg mb-2">Beginner-Level</h4>
                              <p className="text-sm text-green-600 mb-3">Entry Jobs / Assistant Roles</p>
                              <div className="text-sm text-green-700 space-y-2 text-left">
                                <div>• Media Internships (TV, Radio, Journalism, PR, Advertising)</div>
                                <div>• Editorial Assistant / Production Assistant</div>
                                <div>• Junior Reporter / Copywriter / Content Writer</div>
                                <div>• Social Media Assistant / Community Manager</div>
                                <div>• Broadcast Assistant / Camera Crew Trainee</div>
                                <div>• Public Relations Assistant</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-green-400 to-orange-400"></div>
                          <div className="text-3xl text-orange-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-orange-400 to-orange-600"></div>
                        </div>
                      </div>

                      {/* Level 2: Intermediate Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-orange-300 bg-orange-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">📈</div>
                              <h4 className="font-semibold text-orange-700 text-lg mb-2">Intermediate-Level</h4>
                              <p className="text-sm text-orange-600 mb-3">Professional & Applied Roles</p>
                              <div className="text-sm text-orange-700 space-y-2 text-left">
                                <div>• Journalist / News Reporter / Correspondent</div>
                                <div>• Social Media Manager / Digital Content Specialist</div>
                                <div>• Public Relations Specialist / Corporate Communications Officer</div>
                                <div>• Broadcast Journalist / Radio Host / TV Presenter</div>
                                <div>• Video Editor / Multimedia Producer</div>
                                <div>• Advertising Executive / Marketing Communications Specialist</div>
                                <div>• Speechwriter / Media Analyst</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-orange-400 to-red-400"></div>
                          <div className="text-3xl text-red-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-red-400 to-red-600"></div>
                        </div>
                      </div>

                      {/* Level 3: Advanced Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-red-300 bg-red-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🚀</div>
                              <h4 className="font-semibold text-red-700 text-lg mb-2">Advanced-Level</h4>
                              <p className="text-sm text-red-600 mb-3">Specialized & Leadership Roles</p>
                              <div className="text-sm text-red-700 space-y-2 text-left">
                                <div>• Senior Journalist / Foreign Correspondent</div>
                                <div>• PR Manager / Corporate Communications Manager</div>
                                <div>• Media Producer / Documentary Filmmaker / Director</div>
                                <div>• Advertising/Creative Director</div>
                                <div>• Brand Strategist / Campaign Manager</div>
                                <div>• Investigative Journalist / Editor</div>
                                <div>• Broadcast Anchor / News Director</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-red-400 to-amber-400"></div>
                          <div className="text-3xl text-amber-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-amber-400 to-amber-600"></div>
                        </div>
                      </div>

                      {/* Level 4: Expert Level */}
                      <div className="text-center mb-8">
                        <div className="inline-block">
                          <Card className="border-2 border-amber-300 bg-amber-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🏆</div>
                              <h4 className="font-semibold text-amber-700 text-lg mb-2">Expert-Level</h4>
                              <p className="text-sm text-amber-600 mb-3">Leadership, Innovation & Academia</p>
                              <div className="text-sm text-amber-700 space-y-2 text-left">
                                <div>• Chief Communications Officer (CCO)</div>
                                <div>• Editor-in-Chief / Media Director</div>
                                <div>• Head of Public Relations / Global Communications Lead</div>
                                <div>• Founder of Media Agency / Production Company</div>
                                <div>• University Professor of Media & Communications</div>
                                <div>• Policy Advisor (Media, Culture, Information)</div>
                                <div>• Renowned Journalist / Public Figure / Thought Leader</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Sports & Fitness specific progression */}
                  {selectedField === 'sports' && (
                    <>
                      {/* Level 1: Beginner Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-green-300 bg-green-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🌱</div>
                              <h4 className="font-semibold text-green-700 text-lg mb-2">Beginner-Level</h4>
                              <p className="text-sm text-green-600 mb-3">Entry Jobs / Assistant Roles</p>
                              <div className="text-sm text-green-700 space-y-2 text-left">
                                <div>• Sports Internships (Clubs, Fitness Centers, Sports Organizations)</div>
                                <div>• Fitness Assistant / Gym Attendant</div>
                                <div>• Assistant Coach / Team Assistant</div>
                                <div>• Recreation Leader / Sports Camp Counselor</div>
                                <div>• Physical Education Assistant</div>
                                <div>• Retail Assistant (Sportswear, Equipment)</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-green-400 to-teal-400"></div>
                          <div className="text-3xl text-teal-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-teal-400 to-teal-600"></div>
                        </div>
                      </div>

                      {/* Level 2: Intermediate Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-teal-300 bg-teal-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">📈</div>
                              <h4 className="font-semibold text-teal-700 text-lg mb-2">Intermediate-Level</h4>
                              <p className="text-sm text-teal-600 mb-3">Professional & Applied Roles</p>
                              <div className="text-sm text-teal-700 space-y-2 text-left">
                                <div>• Personal Trainer / Fitness Instructor</div>
                                <div>• Athletic Trainer / Strength & Conditioning Coach</div>
                                <div>• Sports Coach (School/Community Teams)</div>
                                <div>• Sports Official / Referee / Umpire</div>
                                <div>• Kinesiologist / Exercise Specialist</div>
                                <div>• Sports Journalist / Commentator</div>
                                <div>• Recreation Manager / Wellness Coordinator</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-teal-400 to-cyan-400"></div>
                          <div className="text-3xl text-cyan-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-cyan-400 to-cyan-600"></div>
                        </div>
                      </div>

                      {/* Level 3: Advanced Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-cyan-300 bg-cyan-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🚀</div>
                              <h4 className="font-semibold text-cyan-700 text-lg mb-2">Advanced-Level</h4>
                              <p className="text-sm text-cyan-600 mb-3">Specialized & Leadership Roles</p>
                              <div className="text-sm text-cyan-700 space-y-2 text-left">
                                <div>• Head Coach / Professional Team Coach</div>
                                <div>• Sports Scientist / Performance Analyst</div>
                                <div>• Physiotherapist (Sports Medicine)</div>
                                <div>• Athlete Manager / Sports Agent</div>
                                <div>• Sports Psychologist</div>
                                <div>• Event Manager (Sports Events, Tournaments, Fitness Expos)</div>
                                <div>• Strength & Conditioning Director (Collegiate/Pro Teams)</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-cyan-400 to-sky-400"></div>
                          <div className="text-3xl text-sky-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-sky-400 to-sky-600"></div>
                        </div>
                      </div>

                      {/* Level 4: Expert Level */}
                      <div className="text-center mb-8">
                        <div className="inline-block">
                          <Card className="border-2 border-sky-300 bg-sky-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-sky-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🏆</div>
                              <h4 className="font-semibold text-sky-700 text-lg mb-2">Expert-Level</h4>
                              <p className="text-sm text-sky-600 mb-3">Leadership, Innovation & Academia</p>
                              <div className="text-sm text-sky-700 space-y-2 text-left">
                                <div>• Director of Athletics / Head of Sports Programs</div>
                                <div>• Sports Federation Executive / National Team Manager</div>
                                <div>• Owner / Founder of Sports Academy or Fitness Chain</div>
                                <div>• Chief Wellness Officer (Corporate/Institutional)</div>
                                <div>• Professor of Sports Science / Kinesiology</div>
                                <div>• International Athlete / Olympian / Sports Icon</div>
                                <div>• Policy Advisor (National Sports Development, Health & Fitness Policy)</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Social Impact specific progression */}
                  {selectedField === 'social' && (
                    <>
                      {/* Level 1: Beginner Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-green-300 bg-green-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🌱</div>
                              <h4 className="font-semibold text-green-700 text-lg mb-2">Beginner-Level</h4>
                              <p className="text-sm text-green-600 mb-3">Entry Jobs / Assistant Roles</p>
                              <div className="text-sm text-green-700 space-y-2 text-left">
                                <div>• Internships (NGOs, Nonprofits, Social Enterprises)</div>
                                <div>• Community Outreach Assistant</div>
                                <div>• Fundraising / Donor Relations Assistant</div>
                                <div>• Volunteer Coordinator (Entry-level)</div>
                                <div>• Program Assistant / Administrative Support</div>
                                <div>• Campaign Supporter (Awareness, Advocacy, Grassroots Work)</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-green-400 to-purple-400"></div>
                          <div className="text-3xl text-purple-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-purple-400 to-purple-600"></div>
                        </div>
                      </div>

                      {/* Level 2: Intermediate Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-purple-300 bg-purple-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">📈</div>
                              <h4 className="font-semibold text-purple-700 text-lg mb-2">Intermediate-Level</h4>
                              <p className="text-sm text-purple-600 mb-3">Professional & Applied Roles</p>
                              <div className="text-sm text-purple-700 space-y-2 text-left">
                                <div>• Program Officer / Project Coordinator</div>
                                <div>• Policy Analyst / Research Associate</div>
                                <div>• Corporate Social Responsibility (CSR) Specialist</div>
                                <div>• Fundraising / Development Officer</div>
                                <div>• Community Organizer / Advocacy Specialist</div>
                                <div>• Social Worker / Case Manager</div>
                                <div>• Education & Training Specialist (Nonprofit Sector)</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-purple-400 to-pink-400"></div>
                          <div className="text-3xl text-pink-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-pink-400 to-pink-600"></div>
                        </div>
                      </div>

                      {/* Level 3: Advanced Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-pink-300 bg-pink-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🚀</div>
                              <h4 className="font-semibold text-pink-700 text-lg mb-2">Advanced-Level</h4>
                              <p className="text-sm text-pink-600 mb-3">Specialized & Leadership Roles</p>
                              <div className="text-sm text-pink-700 space-y-2 text-left">
                                <div>• Program Manager / Project Manager (NGOs & Nonprofits)</div>
                                <div>• Policy Advisor / Advocacy Manager</div>
                                <div>• Impact Measurement & Evaluation Specialist</div>
                                <div>• CSR Manager / Sustainability Manager</div>
                                <div>• Grant Manager / Partnerships Manager</div>
                                <div>• Humanitarian Aid Coordinator / Relief Operations Manager</div>
                                <div>• Director of Community Development / Social Innovation Lead</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Connecting Arrow */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-px h-8 bg-gradient-to-b from-pink-400 to-violet-400"></div>
                          <div className="text-3xl text-violet-600">⬇️</div>
                          <div className="w-px h-8 bg-gradient-to-b from-violet-400 to-violet-600"></div>
                        </div>
                      </div>

                      {/* Level 4: Expert Level */}
                      <div className="text-center mb-8">
                        <div className="inline-block">
                          <Card className="border-2 border-violet-300 bg-violet-50">
                            <CardContent className="p-6 text-center min-w-[300px]">
                              <div className="w-12 h-12 mx-auto bg-violet-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">🏆</div>
                              <h4 className="font-semibold text-violet-700 text-lg mb-2">Expert-Level</h4>
                              <p className="text-sm text-violet-600 mb-3">Leadership, Innovation & Academia</p>
                              <div className="text-sm text-violet-700 space-y-2 text-left">
                                <div>• Executive Director / CEO of NGO or Social Enterprise</div>
                                <div>• Chief Impact Officer / Head of Sustainability</div>
                                <div>• International Development Director (UN, World Bank, etc.)</div>
                                <div>• Founder of NGO / Social Enterprise</div>
                                <div>• Global Policy Advisor / Diplomat (Human Rights, Environment, Equity)</div>
                                <div>• Professor of Social Policy / Development Studies</div>
                                <div>• Thought Leader / Activist recognized internationally</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Generic progression for other fields (temporarily) */}
                  {selectedField !== 'stem' && selectedField !== 'arts' && selectedField !== 'business' && selectedField !== 'communication' && selectedField !== 'sports' && selectedField !== 'social' && (
                    <>
                      {/* Level 1: Entry Level */}
                      <div className="text-center mb-6">
                        <div className="inline-block">
                          <Card className="border-2 border-green-300 bg-green-50">
                            <CardContent className="p-4 text-center min-w-[250px]">
                              <div className="w-10 h-10 mx-auto bg-green-600 rounded-full flex items-center justify-center text-white font-bold mb-2">1</div>
                              <h4 className="font-semibold text-green-700 text-lg">Entry Level</h4>
                              <p className="text-sm text-green-600 mb-2">Starting Point</p>
                              <div className="text-sm text-green-700 space-y-1">
                                <div className="flex items-center justify-center gap-2">
                                  <GraduationCap className="w-4 h-4" />
                                  <span>Fresh Graduate</span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                  <Award className="w-4 h-4" />
                                  <span>$35K - $55K</span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  <span>0-2 years experience</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Continue with similar structure for other levels... */}
                      {/* This is a placeholder - we'll create specific flowcharts for each field */}
                      <div className="text-center mb-6">
                        <Card className="bg-slate-100 border-dashed border-2">
                          <CardContent className="p-6">
                            <div className="text-muted-foreground">
                              <Building className="w-8 h-8 mx-auto mb-2" />
                              <p>Field-specific career progression</p>
                              <p className="text-sm">for {careerFields.find(f => f.id === selectedField)?.name}</p>
                              <p className="text-xs mt-2">Coming soon...</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}

                  {/* Field-Specific Career Examples */}
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-6 mb-6">
                    <h5 className="font-semibold text-center mb-4">
                      {careerFields.find(f => f.id === selectedField)?.name} Career Growth Path
                    </h5>
                    <div className="text-center text-sm text-muted-foreground">
                      {selectedField === 'stem' && (
                        <p>From lab assistant to chief scientist - your STEM journey awaits!</p>
                      )}
                      {selectedField === 'arts' && (
                        <p>From studio assistant to creative director - unleash your artistic potential!</p>
                      )}
                      {selectedField === 'business' && (
                        <p>From business intern to CEO - build your entrepreneurial empire!</p>
                      )}
                      {selectedField === 'communication' && (
                        <p>From media intern to chief communications officer - shape public discourse!</p>
                      )}
                      {selectedField === 'sports' && (
                        <p>From fitness assistant to athletics director - champion excellence in sports!</p>
                      )}
                      {selectedField === 'social' && (
                        <p>From community volunteer to social impact leader - change the world for good!</p>
                      )}
                      {selectedField !== 'stem' && selectedField !== 'arts' && selectedField !== 'business' && selectedField !== 'communication' && selectedField !== 'sports' && selectedField !== 'social' && (
                        <p>Explore detailed career progressions specific to your chosen field.</p>
                      )}
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="text-center">
                    <Card className="border-2 border-primary bg-primary/5 inline-block">
                      <CardContent className="p-6">
                        <Lightbulb className="w-12 h-12 mx-auto text-primary mb-4" />
                        <h4 className="font-semibold text-lg mb-2">Ready to Begin Your Journey?</h4>
                        <p className="text-muted-foreground mb-4">
                          Start building your career roadmap in {careerFields.find(f => f.id === selectedField)?.name}
                        </p>
                        <div className="space-y-3">
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={() => {
                              setShowCareerProgression(false);
                              setShowQuiz(true);
                            }}
                          >
                            <Target className="w-4 h-4 mr-2" />
                            Take Career Quiz
                          </Button>
                          <Button 
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              setShowCareerProgression(false);
                              navigate('/dashboard/early-stage/careers');
                            }}
                          >
                            Explore Other Fields
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : showSpecializationsTree ? (
        <div className="p-6 space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowSpecializationsTree(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Fields
            </Button>
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <GitBranch className="w-6 h-6" />
                {careerPathwaysData ? `${careerPathwaysData.fieldName} Career Pathways` : 
                 selectedField ? `${careerFields.find(f => f.id === selectedField)?.name} Career Pathways` : 
                 'Career Pathways'}
              </h2>
              <p className="text-muted-foreground">
                AI-powered career pathways and real industry data
              </p>
            </div>
          </div>

          {isLoadingSpecializations ? (
            <div className="space-y-6">
              {/* Loading Animation */}
              <Card className="border-2 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <Loader2 className="w-12 h-12 animate-spin text-primary" />
                      <Sparkles className="w-6 h-6 absolute top-3 left-3 animate-pulse text-primary" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold">Analyzing Career Specializations</h3>
                      <p className="text-muted-foreground">
                        Our AI is generating personalized course recommendations...
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Loading States for Different Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : specializationsData ? (
            <div className="space-y-6">
              {/* AI Analysis Results */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">AI-Powered Specialization Analysis</h2>
                    <p className="text-muted-foreground">Personalized course recommendations for your career path</p>
                  </div>
                </div>

                {/* Profile Summary */}
                {specializationsData.profileSummary && (
                  <Alert className="mb-6 bg-blue-50 border-blue-200">
                    <Brain className="h-4 w-4" />
                    <AlertDescription className="text-sm text-black">
                      <strong className="text-blue-800">Analysis:</strong> {specializationsData.profileSummary}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Overall Insights */}
                {specializationsData.overallInsights && specializationsData.overallInsights.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-black">Key Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {specializationsData.overallInsights.map((insight, index) => (
                        <div key={index} className="bg-white/50 rounded-lg p-4 border">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-black">{insight}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* AI Career Pathways from API */}
              {careerPathwaysData && careerPathwaysData.pathways && careerPathwaysData.pathways.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                      <TreePine className="w-5 h-5" />
                      {careerPathwaysData.fieldName} Career Pathways
                    </h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {careerPathwaysData.totalOpportunities} Career Opportunities
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground">
                    {careerPathwaysData.fieldDescription}
                  </p>
                  
                  <div className="space-y-6">
                    {careerPathwaysData.pathways.map((pathway, index) => (
                      <Card key={pathway.id} className="feature-card hover:shadow-lg transition-all border-2 border-purple-200">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className="bg-primary/20 text-primary">#{index + 1}</Badge>
                                <CardTitle className="text-xl">{pathway.title}</CardTitle>
                                <Badge variant="outline">{careerPathwaysData.fieldName}</Badge>
                              </div>
                              <CardDescription>{pathway.description}</CardDescription>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Market Demand</div>
                              <div className="text-2xl font-bold text-purple-600">{pathway.marketDemand}%</div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Average Salary</div>
                              <div className="font-semibold text-green-600">{pathway.averageSalary}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Job Outlook</div>
                              <div className="font-semibold">{pathway.jobOutlook}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Growth Rate</div>
                              <div className="font-semibold text-blue-600">{pathway.growth}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Work-Life Balance</div>
                              <div className="flex items-center gap-2">
                                <Progress value={pathway.workLifeBalance} className="h-2 flex-1" />
                                <span className="text-sm">{pathway.workLifeBalance}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <div className="text-sm text-muted-foreground mb-2">Required Skills</div>
                              <div className="flex flex-wrap gap-1">
                                {pathway.requiredSkills.map((skill, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-muted-foreground mb-2">Career Progression</div>
                              <div className="flex flex-wrap gap-1">
                                {pathway.careerProgression.slice(0, 3).map((level, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {level}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Education Requirements */}
                          <div>
                            <div className="text-sm text-muted-foreground mb-2">Education Requirements</div>
                            <div className="bg-blue-50 p-3 rounded-lg border">
                              <p className="text-sm text-black">{pathway.educationRequirements}</p>
                            </div>
                          </div>

                          {/* Related Careers */}
                          {pathway.relatedCareers && pathway.relatedCareers.length > 0 && (
                            <div>
                              <div className="text-sm text-muted-foreground mb-2">Related Career Options</div>
                              <div className="flex flex-wrap gap-2">
                                {pathway.relatedCareers.map((career, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {career}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-4">
                            <Button size="sm" className="btn-secondary">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Explore Path
                            </Button>
                            <Button size="sm" variant="outline">
                              <Star className="w-4 h-4 mr-2" />
                              Save Career
                            </Button>
                            <Button size="sm" variant="outline">
                              <Users className="w-4 h-4 mr-2" />
                              Connect with Professionals
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Trending Opportunities Section */}
                  {careerPathwaysData.trendingOpportunities && careerPathwaysData.trendingOpportunities.length > 0 && (
                    <div className="mt-6 bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Trending Opportunities in {careerPathwaysData.fieldName}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {careerPathwaysData.trendingOpportunities.map((opportunity, i) => (
                          <Badge key={i} className="bg-green-200 text-green-800">
                            {opportunity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Emerging Roles Section */}
                  {careerPathwaysData.emergingRoles && careerPathwaysData.emergingRoles.length > 0 && (
                    <div className="mt-4 bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Emerging Roles (Next 5 Years)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {careerPathwaysData.emergingRoles.map((role, i) => (
                          <Badge key={i} className="bg-purple-200 text-purple-800">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                    <TreePine className="w-5 h-5" />
                    {selectedField ? `${careerFields.find(f => f.id === selectedField)?.name || 'Career'} Pathways` : 'Career Pathways'}
                  </h3>
                  <div className="space-y-6">
                    {specializationsData.recommendations.map((rec, index) => {
                      // Find the actual course from our database
                      const course = courseRecommendations.find(c => c.id === rec.courseId);
                      const fieldName = careerFields.find(f => f.id === selectedField)?.name || 'Career';
                      
                      return (
                        <Card key={`${rec.courseId}-${index}`} className="feature-card hover:shadow-lg transition-all border-2 border-purple-200">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge className="bg-primary/20 text-primary">#{index + 1}</Badge>
                                  <CardTitle className="text-xl">{rec.courseName}</CardTitle>
                                  <Badge variant="outline">{fieldName} Field</Badge>
                                  {rec.isNewCourse && (
                                    <Badge className="bg-gradient-to-r from-pink-500 to-violet-500 text-white animate-pulse">
                                      🚀 AI Created Pathway
                                    </Badge>
                                  )}
                                </div>
                                <CardDescription>{rec.reasoning}</CardDescription>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">Career Match</div>
                                <div className="text-2xl font-bold text-purple-600">{rec.matchScore}%</div>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <div className="text-sm text-muted-foreground">Average Salary</div>
                                <div className="font-semibold text-green-600">{course?.avgSalary || '$65K - $120K'}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Career Outlook</div>
                                <div className="font-semibold">{course?.jobOutlook || 'Excellent'}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Growth Rate</div>
                                <div className="font-semibold text-blue-600">{course?.growth || '15-25%'}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Match Score</div>
                                <div className="flex items-center gap-2">
                                  <Progress value={rec.matchScore} className="h-2 flex-1" />
                                  <span className="text-sm">{rec.matchScore}%</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <div className="text-sm text-muted-foreground mb-2">Key Pathway Alignments</div>
                                <div className="flex flex-wrap gap-1">
                                  {rec.keyAlignments?.map((alignment, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {alignment}
                                    </Badge>
                                  )) || []}
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-sm text-muted-foreground mb-2">Career Opportunities</div>
                                <div className="flex flex-wrap gap-1">
                                  {course?.careers?.slice(0, 3).map((career, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {career}
                                    </Badge>
                                  )) || rec.nextSteps?.slice(0, 2).map((step, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {step.substring(0, 20)}...
                                    </Badge>
                                  )) || []}
                                </div>
                              </div>
                            </div>

                            {/* Career Learning Path Section */}
                            {rec.suggestedPath && (
                              <div>
                                <div className="text-sm text-muted-foreground mb-2">Suggested Career Path</div>
                                <div className="bg-blue-50 p-3 rounded-lg border">
                                  <p className="text-sm text-black">{rec.suggestedPath}</p>
                                </div>
                              </div>
                            )}

                            {/* Required Skills for Career */}
                            {course?.skills && course.skills.length > 0 && (
                              <div>
                                <div className="text-sm text-muted-foreground mb-2">Required Skills</div>
                                <div className="flex flex-wrap gap-1">
                                  {course.skills.map((skill, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs bg-green-100 text-green-700">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                              <Button size="sm" className="btn-secondary">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Explore Career Path
                              </Button>
                              <Button size="sm" variant="outline">
                                <Star className="w-4 h-4 mr-2" />
                                Save Pathway
                              </Button>
                              <Button size="sm" variant="outline">
                                <Users className="w-4 h-4 mr-2" />
                                Connect with Professionals
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No specializations data</h3>
                <p className="text-muted-foreground mb-4">
                  Unable to load specialization recommendations. Please try again.
                </p>
                <Button 
                  onClick={() => selectedField && handleGetSpecializations(selectedField)}
                  disabled={!selectedField}
                >
                  Retry Analysis
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      ) : !showQuiz ? (
        <div className="p-6 space-y-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Explore Your Future 🚀
            </h2>
            <p className="text-muted-foreground mb-4">
              Discover different career fields through engaging stories and real-world examples. 
              No pressure - just explore what excites you!
            </p>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6"
              onClick={() => setShowQuiz(true)}
            >
              Take Career Interest Quiz
            </Button>
          </div>

          <Tabs defaultValue="fields" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fields">Career Fields</TabsTrigger>
              <TabsTrigger value="modules">Interactive Modules</TabsTrigger>
            </TabsList>

            <TabsContent value="fields" className="space-y-6">
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative transition-all duration-500 ${
                loadingPathways ? 'opacity-90' : ''
              }`}>
                {/* Loading overlay when any pathway is loading */}
                {loadingPathways && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 rounded-lg pointer-events-none z-10 animate-gradient-shift"></div>
                )}
                
                {careerFields.map((field) => (
                  <Card 
                    key={field.id} 
                    className={`hover:shadow-lg transition-all duration-500 cursor-pointer transform hover:scale-[1.02] ${
                      selectedField === field.id ? 'ring-2 ring-primary shadow-primary/20 bg-gradient-to-br from-purple-50/5 to-blue-50/5' : ''
                    } ${
                      loadingPathways === field.id 
                        ? 'animate-pulse ring-2 ring-purple-400 bg-gradient-to-r from-purple-50/10 via-blue-50/10 to-purple-50/10 shadow-lg shadow-purple-500/30' 
                        : ''
                    }`}
                    onClick={() => setSelectedField(selectedField === field.id ? null : field.id)}
                  >
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${field.color} flex items-center justify-center mb-2 transition-all duration-300 ${
                        loadingPathways === field.id ? 'animate-pulse scale-110 shadow-lg' : 'hover:scale-105'
                      }`}>
                        <field.icon className={`w-6 h-6 text-white transition-transform duration-300 ${
                          loadingPathways === field.id ? 'animate-bounce' : ''
                        }`} />
                      </div>
                      <CardTitle className={`text-lg transition-all duration-300 ${
                        loadingPathways === field.id ? 'animate-pulse text-purple-400' : ''
                      }`}>{field.name}</CardTitle>
                      <CardDescription className={loadingPathways === field.id ? 'animate-pulse opacity-70' : ''}>{field.description}</CardDescription>
                    </CardHeader>
                    
                    {selectedField === field.id && (
                      <CardContent className={`space-y-4 transition-all duration-500 ${
                        loadingPathways === field.id ? 'animate-pulse opacity-80' : ''
                      }`}>
                        <div className={loadingPathways === field.id ? 'animate-shimmer' : ''}>
                          <h4 className="font-semibold mb-2">💡 {field.story}</h4>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Popular Careers:</h4>
                          <div className="flex flex-wrap gap-1">
                            {field.careers.map((career, index) => (
                              <Badge 
                                key={career} 
                                variant="secondary" 
                                className={`text-xs transition-all duration-300 ${
                                  loadingPathways === field.id 
                                    ? 'animate-pulse opacity-70' 
                                    : 'hover:scale-105'
                                }`}
                                style={{
                                  animationDelay: loadingPathways === field.id ? `${index * 50}ms` : '0ms'
                                }}
                              >
                                {career}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Key Skills:</h4>
                          <div className="flex flex-wrap gap-1">
                            {field.skills.map((skill, index) => (
                              <Badge 
                                key={skill} 
                                variant="outline" 
                                className={`text-xs transition-all duration-300 ${
                                  loadingPathways === field.id 
                                    ? 'animate-pulse opacity-70' 
                                    : 'hover:scale-105'
                                }`}
                                style={{
                                  animationDelay: loadingPathways === field.id ? `${(index + field.careers.length) * 50}ms` : '0ms'
                                }}
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <Button 
                          size="sm"
                          onClick={() => handleViewPathways(field.id)}
                          disabled={loadingPathways === field.id}
                          className={`w-full text-white flex items-center gap-2 transition-all duration-500 ease-in-out transform ${
                            loadingPathways === field.id 
                              ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-[length:200%_100%] animate-gradient-shift scale-95 shadow-lg shadow-purple-500/30' 
                              : 'bg-purple-600 hover:bg-purple-700 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20'
                          }`}
                        >
                          <div className={`flex items-center gap-2 transition-all duration-300 ${
                            loadingPathways === field.id ? 'animate-pulse' : ''
                          }`}>
                            {loadingPathways === field.id ? (
                              <>
                                <div className="relative">
                                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                                  <div className="absolute inset-0 w-4 h-4 border-2 border-transparent border-t-white/30 rounded-full animate-spin animation-delay-150"></div>
                                </div>
                                <span className="animate-bounce animation-delay-75">Loading Pathways...</span>
                                {/* Loading progress bar */}
                                <div className="ml-2 w-8 h-1 bg-white/20 rounded-full overflow-hidden">
                                  <div className="h-full bg-white rounded-full animate-gradient-shift bg-gradient-to-r from-transparent via-white to-transparent"></div>
                                </div>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                                <span>View Pathways</span>
                              </>
                            )}
                          </div>
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="modules" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {interactiveModules.map((module, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <Badge 
                          variant={module.status === 'Completed' ? 'default' : 
                                  module.status === 'In Progress' ? 'secondary' : 'outline'}
                        >
                          {module.status}
                        </Badge>
                      </div>
                      <CardDescription>{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {module.progress > 0 && (
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{module.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all" 
                              style={{ width: `${module.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      <Button className="w-full" variant={module.status === 'Completed' ? 'outline' : 'default'}>
                        {module.status === 'Completed' ? 'Review' : 
                         module.status === 'In Progress' ? 'Continue' : 'Start'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Fun Fact Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Did You Know?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">65%</div>
                  <div className="text-sm text-muted-foreground">of future jobs don't exist today</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">7</div>
                  <div className="text-sm text-muted-foreground">average career changes in a lifetime</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">15+</div>
                  <div className="text-sm text-muted-foreground">new skills learned every year</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : !showResults ? (
        <div className="p-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowQuiz(false)}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <CardTitle className="text-2xl">Career Interest Quiz</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowQuiz(false)}
                  className="text-gray-600"
                >
                  Exit Quiz
                </Button>
              </div>
              <Progress value={(currentQuestion / careerQuizQuestions.length) * 100} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {careerQuizQuestions.length}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-6">
                  {careerQuizQuestions[currentQuestion].question}
                </h3>

                <RadioGroup
                  value={answers[currentQuestion] || ""}
                  onValueChange={(value) => {
                    const newAnswers = [...answers];
                    newAnswers[currentQuestion] = value;
                    setAnswers(newAnswers);
                  }}
                  className="space-y-4"
                >
                  {careerQuizQuestions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="flex-1 cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                
                {currentQuestion === careerQuizQuestions.length - 1 ? (
                  <Button
                    onClick={() => {
                      if (answers[currentQuestion]) {
                        setShowResults(true);
                      }
                    }}
                    disabled={!answers[currentQuestion]}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    View Results
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      if (answers[currentQuestion]) {
                        setCurrentQuestion(currentQuestion + 1);
                      }
                    }}
                    disabled={!answers[currentQuestion]}
                  >
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="p-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-between items-center mb-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowQuiz(false);
                    setShowResults(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Explorer
                </Button>
                <div></div> {/* Spacer for center alignment */}
              </div>
              <CardTitle className="text-3xl mb-4">Your Career Interest Results</CardTitle>
              <CardDescription className="text-lg">
                Based on your responses, here are your career field recommendations:
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {(() => {
                // Calculate scores for each category
                const categoryScores = {
                  STEM: 0,
                  Arts: 0,
                  Business: 0,
                  Social: 0,
                  Sports: 0,
                  Communication: 0
                };

                answers.forEach((answer, index) => {
                  if (answer !== undefined && answer !== "") {
                    const answerIndex = parseInt(answer);
                    const category = careerQuizQuestions[index].category[answerIndex];
                    categoryScores[category] = (categoryScores[category] || 0) + 1;
                  }
                });

                // Sort categories by score
                const sortedCategories = Object.entries(categoryScores)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3);

                return (
                  <div className="space-y-6">
                    {sortedCategories.map(([category, score], index) => (
                      <div key={category} className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-lg border">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-semibold">
                            #{index + 1} {category} Fields
                          </h3>
                          <Badge variant="secondary">
                            {score} matches
                          </Badge>
                        </div>
                        <Progress value={(score / 25) * 100} className="h-2 mb-3" />
                        <p className="text-muted-foreground">
                          You show strong interest in {category.toLowerCase()}-related careers.
                        </p>
                      </div>
                    ))}
                  </div>
                );
              })()}

              <div className="flex justify-center space-x-4 pt-6">
                <Button
                  onClick={() => {
                    setShowResults(false);
                    setCurrentQuestion(0);
                    setAnswers([]);
                  }}
                  variant="outline"
                >
                  Retake Quiz
                </Button>
                <Button
                  onClick={() => {
                    setShowQuiz(false);
                    setShowResults(false);
                    setCurrentQuestion(0);
                    setAnswers([]);
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Explore Career Fields
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CareerExplorer;