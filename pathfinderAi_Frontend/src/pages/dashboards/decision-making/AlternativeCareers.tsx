import { useState } from "react";
import { Lightbulb, TrendingUp, Users, Globe, Palette, Camera, Music, Gamepad2, Heart, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";

const AlternativeCareers = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [skillLevel, setSkillLevel] = useState("all");
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const careerCategories = [
    {
      id: "creative",
      title: "Creative & Arts",
      icon: Palette,
      color: "from-purple-500 to-pink-500",
      careers: [
        {
          title: "UX/UI Designer",
          description: "Design user-friendly digital experiences",
          skills: ["Design Thinking", "Prototyping", "User Research"],
          salaryRange: "₹4-25 LPA",
          growth: "+22%",
          difficulty: "Medium",
          timeToStart: "6-12 months",
          education: "Any degree + Design course",
          prospects: "Excellent",
          companies: ["Google", "Microsoft", "Zomato", "Flipkart"]
        },
        {
          title: "Content Creator",
          description: "Create engaging content across platforms",
          skills: ["Storytelling", "Video Editing", "Social Media"],
          salaryRange: "₹3-50 LPA",
          growth: "+35%",
          difficulty: "Easy",
          timeToStart: "1-3 months",
          education: "Any background",
          prospects: "Very Good",
          companies: ["YouTube", "Instagram", "Brand Collaborations"]
        },
        {
          title: "Graphic Designer",
          description: "Create visual communications and branding",
          skills: ["Adobe Creative Suite", "Typography", "Branding"],
          salaryRange: "₹3-15 LPA",
          growth: "+15%",
          difficulty: "Medium",
          timeToStart: "3-6 months",
          education: "Design course preferred",
          prospects: "Good",
          companies: ["Advertising Agencies", "Startups", "Freelance"]
        }
      ]
    },
    {
      id: "digital",
      title: "Digital & Tech",
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      careers: [
        {
          title: "Digital Marketing Specialist",
          description: "Promote brands through digital channels",
          skills: ["SEO/SEM", "Analytics", "Content Marketing"],
          salaryRange: "₹3-20 LPA",
          growth: "+30%",
          difficulty: "Easy",
          timeToStart: "2-4 months",
          education: "Any degree + Certification",
          prospects: "Excellent",
          companies: ["All Industries", "Agencies", "Startups"]
        },
        {
          title: "App Developer",
          description: "Build mobile applications",
          skills: ["React Native", "Flutter", "Mobile Design"],
          salaryRange: "₹5-30 LPA",
          growth: "+25%",
          difficulty: "Hard",
          timeToStart: "6-12 months",
          education: "Programming course",
          prospects: "Excellent",
          companies: ["Tech Companies", "Startups", "Freelance"]
        },
        {
          title: "Social Media Manager",
          description: "Manage brand presence on social platforms",
          skills: ["Content Strategy", "Community Management", "Analytics"],
          salaryRange: "₹3-12 LPA",
          growth: "+28%",
          difficulty: "Easy",
          timeToStart: "1-3 months",
          education: "Any background",
          prospects: "Very Good",
          companies: ["All Industries", "Agencies"]
        }
      ]
    },
    {
      id: "entrepreneurship",
      title: "Entrepreneurship",
      icon: Lightbulb,
      color: "from-orange-500 to-red-500",
      careers: [
        {
          title: "E-commerce Business",
          description: "Start your own online store",
          skills: ["Business Planning", "Digital Marketing", "Customer Service"],
          salaryRange: "₹0-∞",
          growth: "+40%",
          difficulty: "Hard",
          timeToStart: "3-6 months",
          education: "Business knowledge helpful",
          prospects: "Variable",
          companies: ["Self-employed", "Amazon", "Flipkart Seller"]
        },
        {
          title: "Food Truck/Restaurant",
          description: "Start a food business",
          skills: ["Cooking", "Business Management", "Customer Service"],
          salaryRange: "₹2-20+ LPA",
          growth: "+20%",
          difficulty: "Hard",
          timeToStart: "6-12 months",
          education: "Culinary training helpful",
          prospects: "Good",
          companies: ["Self-employed", "Franchise"]
        },
        {
          title: "Consulting Services",
          description: "Offer expertise in your field",
          skills: ["Domain Expertise", "Communication", "Business Development"],
          salaryRange: "₹5-50+ LPA",
          growth: "+25%",
          difficulty: "Medium",
          timeToStart: "1-6 months",
          education: "Experience in field",
          prospects: "Very Good",
          companies: ["Self-employed", "Consulting Firms"]
        }
      ]
    },
    {
      id: "wellness",
      title: "Health & Wellness",
      icon: Heart,
      color: "from-green-500 to-teal-500",
      careers: [
        {
          title: "Fitness Trainer",
          description: "Help people achieve fitness goals",
          skills: ["Exercise Science", "Nutrition", "Motivation"],
          salaryRange: "₹2-15 LPA",
          growth: "+23%",
          difficulty: "Medium",
          timeToStart: "3-6 months",
          education: "Fitness certification",
          prospects: "Good",
          companies: ["Gyms", "Personal Training", "Online"]
        },
        {
          title: "Yoga Instructor",
          description: "Teach yoga and mindfulness",
          skills: ["Yoga Practice", "Teaching", "Anatomy"],
          salaryRange: "₹2-10 LPA",
          growth: "+18%",
          difficulty: "Medium",
          timeToStart: "6-12 months",
          education: "Yoga teacher training",
          prospects: "Good",
          companies: ["Studios", "Gyms", "Online Platforms"]
        },
        {
          title: "Nutritionist",
          description: "Provide dietary guidance and planning",
          skills: ["Nutrition Science", "Counseling", "Meal Planning"],
          salaryRange: "₹3-12 LPA",
          growth: "+20%",
          difficulty: "Medium",
          timeToStart: "6-24 months",
          education: "Nutrition course/degree",
          prospects: "Very Good",
          companies: ["Clinics", "Gyms", "Private Practice"]
        }
      ]
    },
    {
      id: "media",
      title: "Media & Entertainment",
      icon: Camera,
      color: "from-pink-500 to-purple-500",
      careers: [
        {
          title: "YouTuber/Podcaster",
          description: "Create video/audio content",
          skills: ["Content Creation", "Video Editing", "Audience Building"],
          salaryRange: "₹1-100+ LPA",
          growth: "+45%",
          difficulty: "Medium",
          timeToStart: "1-3 months",
          education: "Any background",
          prospects: "Variable",
          companies: ["Self-employed", "Media Companies"]
        },
        {
          title: "Photographer",
          description: "Capture moments and create visual stories",
          skills: ["Photography", "Photo Editing", "Business Skills"],
          salaryRange: "₹2-20 LPA",
          growth: "+17%",
          difficulty: "Medium",
          timeToStart: "3-6 months",
          education: "Photography course",
          prospects: "Good",
          companies: ["Freelance", "Studios", "Events"]
        },
        {
          title: "Gaming Streamer",
          description: "Stream gameplay and build gaming community",
          skills: ["Gaming", "Entertainment", "Community Building"],
          salaryRange: "₹1-50+ LPA",
          growth: "+38%",
          difficulty: "Medium",
          timeToStart: "1-6 months",
          education: "Gaming knowledge",
          prospects: "Variable",
          companies: ["Twitch", "YouTube", "Sponsorships"]
        }
      ]
    }
  ];

  const pathwaySteps = [
    {
      step: 1,
      title: "Skill Assessment",
      description: "Evaluate your current skills and interests",
      duration: "1 week"
    },
    {
      step: 2,
      title: "Research & Learning",
      description: "Study the field and acquire necessary skills",
      duration: "1-6 months"
    },
    {
      step: 3,
      title: "Build Portfolio",
      description: "Create projects to showcase your abilities",
      duration: "2-3 months"
    },
    {
      step: 4,
      title: "Network & Apply",
      description: "Connect with professionals and seek opportunities",
      duration: "1-2 months"
    },
    {
      step: 5,
      title: "Start Career",
      description: "Begin your new career journey",
      duration: "Ongoing"
    }
  ];

  const successStories = [
    {
      name: "Priya Sharma",
      career: "From Engineer to UX Designer",
      timeline: "8 months",
      outcome: "₹12 LPA at Razorpay",
      story: "Completed Google UX Design Certificate while working, built portfolio with 3 projects"
    },
    {
      name: "Rahul Patel",
      career: "From Finance to YouTube Creator",
      timeline: "2 years",
      outcome: "₹25 LPA through content",
      story: "Started tech review channel, grew to 500K subscribers, multiple revenue streams"
    },
    {
      name: "Sneha Gupta",
      career: "From Teaching to Digital Marketing",
      timeline: "6 months",
      outcome: "₹8 LPA at startup",
      story: "Took online courses, managed social media for local businesses as practice"
    }
  ];

  const filteredCategories = careerCategories.filter(category => 
    selectedCategory === "all" || category.id === selectedCategory
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500";
      case "Medium": return "bg-yellow-500";
      case "Hard": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <DashboardLayout 
      title="Alternative Career Pathways" 
      description="Explore unconventional career paths and opportunities beyond traditional routes"
    >
      <div className="p-6 space-y-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="creative">Creative & Arts</SelectItem>
              <SelectItem value="digital">Digital & Tech</SelectItem>
              <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
              <SelectItem value="wellness">Health & Wellness</SelectItem>
              <SelectItem value="media">Media & Entertainment</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={skillLevel} onValueChange={setSkillLevel}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Difficulty level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy to Start</SelectItem>
              <SelectItem value="medium">Medium Difficulty</SelectItem>
              <SelectItem value="hard">Challenging</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="explore" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="explore">Explore Careers</TabsTrigger>
            <TabsTrigger value="pathway">Transition Pathway</TabsTrigger>
            <TabsTrigger value="success">Success Stories</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${category.color} text-white`}>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="w-6 h-6" />
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    Innovative careers in {category.title.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-4">
                    {category.careers
                      .filter(
                        (career) =>
                          skillLevel === "all" || career.difficulty.toLowerCase() === skillLevel
                      )
                      .map((career, idx) => (
                      <Card key={idx} className="border-l-4 border-primary/20">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">{career.title}</h4>
                              <p className="text-muted-foreground text-sm">{career.description}</p>
                            </div>
                            <Badge
                              className={`${getDifficultyColor(career.difficulty)} text-white`}
                            >
                              {career.difficulty}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-xs text-muted-foreground">Salary Range</div>
                              <div className="font-semibold text-green-600">{career.salaryRange}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Growth Rate</div>
                              <div className="font-semibold text-blue-600">{career.growth}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Time to Start</div>
                              <div className="font-semibold">{career.timeToStart}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Job Prospects</div>
                              <div className="font-semibold">{career.prospects}</div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium mb-1">Key Skills Required</div>
                              <div className="flex flex-wrap gap-1">
                                {career.skills.map((skill, skillIdx) => (
                                  <Badge key={skillIdx} variant="outline">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm font-medium mb-1">Education/Training</div>
                              <div className="text-sm text-muted-foreground">{career.education}</div>
                            </div>

                            <div>
                              <div className="text-sm font-medium mb-1">Potential Employers</div>
                              <div className="flex flex-wrap gap-1">
                                {career.companies.map((company, companyIdx) => (
                                  <Badge key={companyIdx} variant="secondary">
                                    {company}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Updated Buttons */}
                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedCareer(career);
                                setShowModal(true);
                              }}
                            >
                              Learn More
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (career.title === "UX/UI Designer") {
                                  window.open("https://www.udemy.com/courses/search/?src=ukw&q=ui%2Fux+designer", "_blank");
                                } else if (career.title === "Content Creator") {
                                  window.open("https://www.udemy.com/courses/search/?src=ukw&q=content+creator", "_blank");
                                } else if (career.title === "Graphic Designer") {
                                  window.open("https://www.udemy.com/courses/search/?src=ukw&q=Graphic+Designer", "_blank");
                                } else if (career.title === "Digital Marketing Specialist") {
                                  window.open("https://www.udemy.com/courses/search/?src=ukw&q=digital+marketing", "_blank");
                                } else if (career.title === "App Developer") {
                                  window.open("https://www.udemy.com/courses/search/?src=ukw&q=app+developer", "_blank");
                                } else if (career.title === "Social Media Manager") {
                                  window.open("https://www.udemy.com/courses/search/?src=ukw&q=social+media+manager", "_blank");
                                } else if (career.title === "E-commerce Business") {
                                  window.open("https://www.udemy.com/courses/search/?src=ukw&q=e+commerce+buisness", "_blank");
                                } else if (career.title === "Food Truck/Restaurant") {
                                  window.open("https://www.udemy.com/course/the-ultimate-food-and-restaurant-business-course/?couponCode=KEEPLEARNING", "_blank");
                                } else if (career.title === "Consulting Services") {
                                  window.open("https://www.udemy.com/courses/search/?src=ukw&q=Consulting+services", "_blank");
                                } else if (career.title === "Fitness Trainer") {
                                  window.open("https://www.udemy.com/courses/search/?src=ukw&q=Fitness+trainer", "_blank");
                                } else if (career.title === "Yoga Instructor") {
                                  window.open("https://www.udemy.com/courses/search/?src=ukw&q=Yoga+instructor", "_blank");
                                } else if (career.title === "Nutritionist") {
                                  window.open("https://www.udemy.com/courses/search/?q=nutritionist&src=sgp", "_blank");
                                } else if (career.title === "YouTuber/Podcaster") {
                                  window.open("https://www.udemy.com/courses/search/?src=ukw&q=Youtuber+%2FPodcaster", "_blank");
                                } else if (career.title === "Photographer") {
                                  window.open("https://www.udemy.com/courses/search/?src=ukw&q=Photographer", "_blank");
                                } else if (career.title === "Gaming Streamer") {
                                  window.open("https://www.udemy.com/courses/search/?src=ukw&q=Gaming+Streamer", "_blank");
                                } else {
                                  alert(`Find courses for ${career.title}`);
                                }
                              }}
                            >
                              Find Courses
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (career.title === "UX/UI Designer") {
                                  window.open(
                                    "https://www.linkedin.com/search/results/people/?keywords=ui%2Fux%20designer&origin=SWITCH_SEARCH_VERTICAL&sid=YrF",
                                    "_blank"
                                  );
                                } else if (career.title === "Content Creator") {
                                  window.open(
                                    "https://www.linkedin.com/search/results/people/?keywords=Content%20Creator&origin=GLOBAL_SEARCH_HEADER&sid=WCs",
                                    "_blank"
                                  );
                                } else if (career.title === "Graphic Designer") {
                                  window.open(
                                    "https://www.linkedin.com/search/results/people/?keywords=Graphic%20Designer&origin=GLOBAL_SEARCH_HEADER&sid=oZl",
                                    "_blank"
                                  );
                                } else if (career.title === "Digital Marketing Specialist") {
                                  window.open(
                                    "https://www.linkedin.com/search/results/people/?keywords=digital%20marketing%20specialist&origin=SPELL_CHECK_DID_YOU_MEAN&sid=vkB&spellCorrectionEnabled=false",
                                    "_blank"
                                  );
                                } else if (career.title === "App Developer") {
                                  window.open(
                                    "https://www.linkedin.com/search/results/people/?keywords=App%20developer&origin=GLOBAL_SEARCH_HEADER&sid=O8a",
                                    "_blank"
                                  );
                                } else if (career.title === "Social Media Manager") {
                                  window.open(
                                    "https://www.linkedin.com/search/results/people/?keywords=Social%20Media%20manager&origin=GLOBAL_SEARCH_HEADER&sid=_e%2C",
                                    "_blank"
                                  );
                                } else if (career.title === "E-commerce Business") {
                                  window.open(
                                    "https://www.linkedin.com/search/results/people/?keywords=e%20commerce%20buisness&origin=GLOBAL_SEARCH_HEADER&sid=%3ACV",
                                    "_blank"
                                  );
                                } else if (career.title === "Food Truck/Restaurant") {
                                  window.open(
                                    "https://www.linkedin.com/search/results/people/?keywords=food%20restraunt&origin=GLOBAL_SEARCH_HEADER&sid=*!5",
                                    "_blank"
                                  );
                                } else if (career.title === "Consulting Services") {
                                  window.open(
                                    "https://www.linkedin.com/search/results/people/?keywords=Consulting%20Services&origin=GLOBAL_SEARCH_HEADER&sid=dSq",
                                    "_blank"
                                  );
                                } else if (career.title === "Fitness Trainer") {
                                  window.open(
                                    "https://www.linkedin.com/search/results/people/?keywords=Fitness%20Trainer&origin=GLOBAL_SEARCH_HEADER&sid=1c!",
                                    "_blank"
                                  );
                                } else if (career.title === "Yoga Instructor") {
                                  window.open(
                                    "https://www.linkedin.com/search/results/people/?keywords=yoga%20Instructor&origin=GLOBAL_SEARCH_HEADER&sid=gT6",
                                    "_blank"
                                  );
                                } else if (career.title === "Nutritionist") {
                                  window.open(
                                    "https://www.linkedin.com/search/results/people/?keywords=nutritionist&origin=GLOBAL_SEARCH_HEADER&sid=Z0g",
                                    "_blank"
                                  );
                                } else if (career.title === "YouTuber/Podcaster") {
                                  window.open(
                                    "https://www.linkedin.com/search/results/people/?keywords=youtuber%20%2F%20podcaster&origin=GLOBAL_SEARCH_HEADER&sid=S9r",
                                    "_blank"
                                  );
                                } else if (career.title === "Photographer") {
                                  window.open(
                                    "https://www.linkedin.com/search/results/people/?keywords=photographer&origin=GLOBAL_SEARCH_HEADER&sid=(l.",
                                    "_blank"
                                  );
                                } else if (career.title === "Gaming Streamer") {
                                  window.open(
                                    "https://www.linkedin.com/search/results/people/?keywords=streamer&origin=GLOBAL_SEARCH_HEADER&sid=J5m",
                                    "_blank"
                                  );
                                } else {
                                  alert(`Connect with professionals in ${career.title}`);
                                }
                              }}
                            >
                              Connect with Professionals
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pathway" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>5-Step Career Transition Pathway</CardTitle>
                <CardDescription>
                  A structured approach to transitioning into alternative careers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {pathwaySteps.map((step, index) => (
                    <div key={step.step} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-muted-foreground text-sm">{step.description}</p>
                        <Badge variant="outline" className="mt-1">{step.duration}</Badge>
                      </div>
                      {index < pathwaySteps.length - 1 && (
                        <div className="absolute left-7 mt-8 w-0.5 h-6 bg-border"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="success" className="space-y-6">
            <div className="grid gap-6">
              {successStories.map((story, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {story.name}
                    </CardTitle>
                    <CardDescription>{story.career}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Timeline</div>
                        <div className="font-semibold">{story.timeline}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Outcome</div>
                        <div className="font-semibold text-green-600">{story.outcome}</div>
                      </div>
                      <div>
                        <Button size="sm" variant="outline">Connect</Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{story.story}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Free Learning Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Coursera</span>
                      <Badge variant="secondary">Free Courses</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>YouTube</span>
                      <Badge variant="secondary">Tutorials</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Khan Academy</span>
                      <Badge variant="secondary">Fundamentals</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>FreeCodeCamp</span>
                      <Badge variant="secondary">Programming</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Community & Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Reddit Communities</span>
                      <Badge variant="secondary">Discussion</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Discord Servers</span>
                      <Badge variant="secondary">Real-time Chat</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>LinkedIn Groups</span>
                      <Badge variant="secondary">Networking</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Local Meetups</span>
                      <Badge variant="secondary">In-person</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Career Detail Modal */}
        {showModal && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg p-6 w-full max-w-lg border border-white">
              <h3 className="text-lg font-semibold text-white mb-4">{selectedCareer.title}</h3>
              <p className="text-sm text-gray-300 mb-4">{selectedCareer.description}</p>
              <div className="space-y-2 text-gray-300">
                <div>
                  <strong>Skills Required:</strong>
                  <ul className="list-disc list-inside text-sm">
                    {selectedCareer.skills.map((skill, idx) => (
                      <li key={idx}>{skill}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Salary Range:</strong> {selectedCareer.salaryRange}
                </div>
                <div>
                  <strong>Growth Rate:</strong> {selectedCareer.growth}
                </div>
                <div>
                  <strong>Education:</strong> {selectedCareer.education}
                </div>
                <div>
                  <strong>Job Prospects:</strong> {selectedCareer.prospects}
                </div>
                <div>
                  <strong>Potential Employers:</strong>
                  <ul className="list-disc list-inside text-sm">
                    {selectedCareer.companies.map((company, idx) => (
                      <li key={idx}>{company}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full text-white border-gray-300 hover:bg-gray-700"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AlternativeCareers;
