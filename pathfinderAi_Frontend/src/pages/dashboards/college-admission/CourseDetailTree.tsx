import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Briefcase, TrendingUp, Users, Award, Globe, Loader2, RefreshCw, ExternalLink, ChevronDown, Play, GraduationCap, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import DashboardLayout from "@/components/DashboardLayout";
import GeminiCourseService, { type AICourseData, type AISubCourse } from "@/services/geminiCourseService";
import { getCourseNameById } from "@/data/courseData";

const CourseDetailTree = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedSubcourse, setSelectedSubcourse] = useState<AISubCourse | null>(null);
  const [isTreeVisible, setIsTreeVisible] = useState(false);
  const [visibleSubcourses, setVisibleSubcourses] = useState<string[]>([]);
  const [courseData, setCourseData] = useState<AICourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get course name from URL parameter (primary) or from courseData by ID (fallback)
  const courseNameFromUrl = searchParams.get('courseName');
  const courseNameFromData = courseId ? getCourseNameById(parseInt(courseId)) : undefined;
  
  const courseName = courseNameFromUrl || courseNameFromData || "Computer Science Engineering";

  // Learning resource configurations
  const learningResources = {
    wikipedia: {
      name: "Wikipedia",
      icon: Book,
      color: "#000000",
      getUrl: (searchTerm: string) => {
        const cleanTerm = searchTerm.replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
        return `https://en.wikipedia.org/wiki/${encodeURIComponent(cleanTerm)}`;
      }
    },
    coursera: {
      name: "Coursera",
      icon: GraduationCap,
      color: "#0056D3",
      getUrl: (searchTerm: string) => {
        const cleanTerm = searchTerm.replace(/[^\w\s]/g, '').replace(/\s+/g, '%20');
        return `https://www.coursera.org/search?query=${encodeURIComponent(cleanTerm)}`;
      }
    },
    khanacademy: {
      name: "Khan Academy",
      icon: Users,
      color: "#14BF96",
      getUrl: (searchTerm: string) => {
        const cleanTerm = searchTerm.replace(/[^\w\s]/g, '').replace(/\s+/g, '%20');
        return `https://www.khanacademy.org/search?referer=%2F&page_search_query=${encodeURIComponent(cleanTerm)}`;
      }
    },
    youtube: {
      name: "YouTube",
      icon: Play,
      color: "#FF0000",
      getUrl: (searchTerm: string) => {
        const cleanTerm = searchTerm.replace(/[^\w\s]/g, '').replace(/\s+/g, '+');
        return `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanTerm)}+tutorial`;
      }
    },
    edx: {
      name: "edX",
      icon: Globe,
      color: "#02262B",
      getUrl: (searchTerm: string) => {
        const cleanTerm = searchTerm.replace(/[^\w\s]/g, '').replace(/\s+/g, '%20');
        return `https://www.edx.org/search?q=${encodeURIComponent(cleanTerm)}`;
      }
    }
  };

  // Open learning resource
  const openLearningResource = (resourceKey: string, searchTerm: string) => {
    const resource = learningResources[resourceKey];
    if (resource) {
      const url = resource.getUrl(searchTerm);
      console.log(`🌐 Opening ${resource.name} for: ${searchTerm}`);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Quick Wikipedia access (for main clicks)
  const openWikipedia = (searchTerm: string) => {
    openLearningResource('wikipedia', searchTerm);
  };

  // Enhanced click handler for course nodes (main course)
  const handleCourseClick = (courseName: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    openWikipedia(courseName);
  };

  // Enhanced click handler for subcourse nodes
  const handleSubcourseClick = (subcourse: AISubCourse, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Set as selected for detailed view
    setSelectedSubcourse(subcourse);
    
    // Quick access to Wikipedia
    openWikipedia(subcourse.name);
  };

  // Resource dropdown click handler
  const handleResourceClick = (resourceKey: string, searchTerm: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    openLearningResource(resourceKey, searchTerm);
  };

  // Load course data from AI
  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await GeminiCourseService.generateSubcourses(courseName);
        setCourseData(data);
      } catch (err) {
        setError('Failed to load course data. Please try again.');
        console.error('Error loading course data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseName]);

  // Animation logic
  useEffect(() => {
    if (!courseData || loading) return;

    // Reset animations when course changes
    setIsTreeVisible(false);
    setVisibleSubcourses([]);
    setSelectedSubcourse(null);
    
    // Trigger tree animation after component mounts
    const timer = setTimeout(() => {
      setIsTreeVisible(true);
    }, 100);

    // Animate subcourses one by one
    courseData.subcourses.forEach((subcourse, index) => {
      setTimeout(() => {
        setVisibleSubcourses(prev => [...prev, subcourse.id]);
      }, 300 + (index * 100));
    });

    return () => clearTimeout(timer);
  }, [courseData, loading]);

  const handleRegenerateContent = async () => {
    GeminiCourseService.clearCache();
    setLoading(true);
    setError(null);
    
    try {
      const data = await GeminiCourseService.generateSubcourses(courseName);
      setCourseData(data);
    } catch (err) {
      setError('Failed to regenerate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Generating Course Tree</h2>
            <p className="text-gray-600">AI is creating personalized subcourses for {courseName}...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !courseData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || "Course Not Found"}
            </h2>
            <div className="space-y-2">
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              {error && (
                <Button onClick={handleRegenerateContent} className="ml-2">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <style>
          {`
            @keyframes float-in {
              0% { 
                transform: translateY(30px) scale(0.8); 
                opacity: 0; 
              }
              100% { 
                transform: translateY(0) scale(1); 
                opacity: 1; 
              }
            }
            
            @keyframes pulse-glow {
              0%, 100% { 
                box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
              }
              50% { 
                box-shadow: 0 0 30px rgba(147, 51, 234, 0.6);
              }
            }
            
            @keyframes branch-grow {
              0% { 
                transform: scaleY(0) translateY(20px);
                opacity: 0;
              }
              50% {
                transform: scaleY(0.5) translateY(10px);
                opacity: 0.5;
              }
              100% { 
                transform: scaleY(1) translateY(0);
                opacity: 1;
              }
            }
            
            @keyframes node-pop {
              0% { 
                transform: scale(0) rotate(-180deg); 
                opacity: 0; 
              }
              50% { 
                transform: scale(1.2) rotate(-90deg); 
                opacity: 0.8; 
              }
              100% { 
                transform: scale(1) rotate(0deg); 
                opacity: 1; 
              }
            }
            
            @keyframes gradient-shift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            
            @keyframes connection-flow {
              0% { stroke-dashoffset: 100; }
              100% { stroke-dashoffset: 0; }
            }
            
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              33% { transform: translateY(-10px) rotate(120deg); }
              66% { transform: translateY(5px) rotate(240deg); }
            }
            
            .main-node {
              animation: float-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
              background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
              background-size: 400% 400%;
              animation: float-in 0.8s ease-out, gradient-shift 4s ease infinite;
            }
            
            .main-node:hover {
              animation: pulse-glow 2s infinite, gradient-shift 2s ease infinite;
            }
            
            .branch-line {
              animation: branch-grow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .branch-node {
              animation: node-pop 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55);
              transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .branch-node:hover {
              transform: translateY(-8px) scale(1.05);
              box-shadow: 0 15px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.08);
            }
            
            .selected-node {
              animation: pulse-glow 2s infinite;
              transform: translateY(-5px) scale(1.02);
            }
            
            .floating-particles {
              position: absolute;
              width: 4px;
              height: 4px;
              background: radial-gradient(circle, #667eea, transparent);
              border-radius: 50%;
              animation: float 6s ease-in-out infinite;
            }
          `}
        </style>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course Matcher
            </Button>
            <h1 className="text-3xl font-bold text-blue-400 ml-3">{courseData.mainCourse}</h1>
            <p className="text-lg text-gray-200 mt-2 ml-3">{courseData.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline">AI Generated</Badge>
              <Badge variant="secondary">Last Updated: {new Date(courseData.lastUpdated).toLocaleDateString()}</Badge>
              <Button size="sm" variant="ghost" onClick={handleRegenerateContent}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>
        </div>

        {/* Animated Tree */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Course Specializations Tree
            </CardTitle>
            <CardDescription>
              Click on any specialization to view detailed information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="min-h-[500px] p-12 relative overflow-hidden"
              style={{ 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
                backgroundSize: "400% 400%",
                animation: "gradient-shift 8s ease infinite"
              }}
            >
              {/* Floating Background Particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="floating-particles"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 6}s`,
                      animationDuration: `${4 + Math.random() * 4}s`
                    }}
                  />
                ))}
              </div>

              {/* Main Course Node */}
              <div className="text-center mb-20 relative z-10">
                <div className="relative inline-block">
                  <div 
                    className={`main-node inline-block px-12 py-6 rounded-3xl text-white font-bold text-2xl shadow-2xl cursor-pointer relative overflow-hidden group ${
                      isTreeVisible ? 'scale-100 opacity-100' : 'scale-100 opacity-50'
                    }`}
                    style={{ 
                      transformOrigin: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255,255,255,0.2)'
                    }}
                    onClick={(e) => handleCourseClick(courseData.mainCourse, e)}
                    title="Click to open Wikipedia page"
                  >
                    <div className="absolute inset-0 bg-white/10 rounded-3xl" />
                    <div className="relative z-10 flex items-center gap-3">
                      <span>{courseData.mainCourse}</span>
                      <ExternalLink className="w-6 h-6 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {/* Ripple Effect */}
                    <div className="absolute inset-0 rounded-3xl opacity-30">
                      <div className="absolute inset-2 bg-white/20 rounded-3xl animate-ping" style={{ animationDuration: '3s' }} />
                    </div>
                  </div>

                  {/* Learning Resources Dropdown for Main Course */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md border-white/20 hover:bg-white text-gray-700 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Learn More
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 bg-white backdrop-blur-md border-gray-200 shadow-lg">
                      {Object.entries(learningResources).map(([key, resource]) => {
                        const IconComponent = resource.icon;
                        return (
                          <DropdownMenuItem 
                            key={key}
                            onClick={(e) => handleResourceClick(key, courseData.mainCourse, e)}
                            className="cursor-pointer hover:bg-gray-100 text-gray-800 font-medium"
                          >
                            <IconComponent className="w-4 h-4 mr-2" style={{ color: resource.color }} />
                            <span className="text-gray-800">{resource.name}</span>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Instruction text */}
                <p className="text-white/80 text-sm mt-16 max-w-md mx-auto">
                  Click any node for Wikipedia or use "Learn More" for additional resources
                </p>
              </div>

              {/* Subcourse Branches */}
              <div className="flex flex-wrap justify-center gap-12 relative z-10">
                {courseData.subcourses.map((subcourse, index) => (
                  <div key={subcourse.id} className="relative group">
                    {/* Modern Connection Line with SVG */}
                    <svg 
                      className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-1 h-20"
                      style={{ 
                        animationDelay: `${index * 200}ms`,
                        opacity: visibleSubcourses.includes(subcourse.id) ? 1 : 0.3
                      }}
                    >
                      <defs>
                        <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.8)', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: courseData.color, stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                      <line 
                        x1="50%" y1="0%" x2="50%" y2="100%" 
                        stroke={`url(#gradient-${index})`}
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        className="branch-line"
                        style={{ animationDelay: `${index * 150}ms` }}
                      />
                    </svg>
                    
                    {/* Enhanced Subcourse Node */}
                    <div className="relative">
                      <div 
                        className={`branch-node relative bg-white/95 backdrop-blur-md border-2 rounded-2xl p-6 max-w-56 min-h-28 flex flex-col items-center justify-center text-center font-semibold cursor-pointer group-hover:scale-105 ${
                          visibleSubcourses.includes(subcourse.id) 
                            ? 'translate-y-0 opacity-100 scale-100' 
                            : 'translate-y-0 opacity-50 scale-100'
                        } ${
                          selectedSubcourse?.id === subcourse.id 
                            ? 'selected-node' 
                            : 'shadow-lg hover:shadow-2xl'
                        }`}
                        style={{ 
                          borderColor: courseData.color,
                          color: courseData.color,
                          animationDelay: `${index * 100}ms`,
                          boxShadow: selectedSubcourse?.id === subcourse.id 
                            ? `0 20px 60px ${courseData.color}30, 0 8px 25px ${courseData.color}20` 
                            : '0 10px 30px rgba(0,0,0,0.1), 0 4px 15px rgba(0,0,0,0.05)'
                        }}
                        onClick={(e) => handleSubcourseClick(subcourse, e)}
                        title="Click to open Wikipedia page"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `linear-gradient(135deg, ${courseData.color}, ${courseData.color}dd)`;
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                          e.currentTarget.style.color = courseData.color;
                          e.currentTarget.style.transform = selectedSubcourse?.id === subcourse.id 
                            ? 'translateY(-5px) scale(1.02)' 
                            : 'translateY(0) scale(1)';
                        }}
                      >
                        {/* Content */}
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-sm font-bold">{subcourse.name}</div>
                            <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-xs opacity-75">{subcourse.description?.slice(0, 50)}...</div>
                        </div>

                        {/* Hover glow effect */}
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                             style={{ 
                               background: `radial-gradient(circle at center, ${courseData.color}20, transparent 70%)`,
                               filter: 'blur(10px)'
                             }} 
                        />
                      </div>

                      {/* Learning Resources Dropdown for Subcourse */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md border-gray-300 hover:bg-white text-gray-700 shadow-md text-xs px-2 py-1 h-6"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <BookOpen className="w-3 h-3 mr-1" />
                            Resources
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-44 bg-white backdrop-blur-md border-gray-200 shadow-lg">
                          {Object.entries(learningResources).map(([key, resource]) => {
                            const IconComponent = resource.icon;
                            return (
                              <DropdownMenuItem 
                                key={key}
                                onClick={(e) => handleResourceClick(key, subcourse.name, e)}
                                className="cursor-pointer hover:bg-gray-100 text-gray-800 font-medium text-sm"
                              >
                                <IconComponent className="w-3 h-3 mr-2" style={{ color: resource.color }} />
                                <span className="text-gray-800">{resource.name}</span>
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )) || []}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subcourse Details */}
        {selectedSubcourse && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                {selectedSubcourse.name} - Detailed Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{selectedSubcourse.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Duration</h4>
                      <p className="text-gray-600">{selectedSubcourse.duration}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Difficulty</h4>
                      <p className="text-gray-600">{selectedSubcourse.difficulty}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Average Salary</h4>
                    <p className="text-green-600 font-semibold">{selectedSubcourse.averageSalary}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Market Demand</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                          style={{ width: `${selectedSubcourse.marketDemand}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{selectedSubcourse.marketDemand}%</span>
                    </div>
                  </div>

                  {selectedSubcourse.prerequisites && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Prerequisites</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSubcourse.prerequisites.map((prereq, index) => (
                          <Badge key={index} variant="outline">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSubcourse.certification && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Popular Certification</h4>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                        <Award className="w-3 h-3 mr-1" />
                        {selectedSubcourse.certification}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Career Opportunities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubcourse.jobRoles.map((role, index) => (
                        <Badge key={index} variant="secondary">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Industry Applications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubcourse.industryApplications.map((industry, index) => (
                        <Badge key={index} className="bg-purple-100 text-purple-800 border-purple-300">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Key Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubcourse.skills.map((skill, index) => (
                        <Badge key={index} style={{ backgroundColor: `${courseData.color}20`, color: courseData.color }}>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="w-full" style={{ backgroundColor: courseData.color }}>
                      <Users className="w-4 h-4 mr-2" />
                      Find Courses & Colleges
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CourseDetailTree;
