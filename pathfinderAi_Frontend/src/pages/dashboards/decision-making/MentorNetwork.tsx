import { useState } from "react";
import { Users, MessageCircle, Star, MapPin, Briefcase, GraduationCap, Video, Calendar, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";

const MentorNetwork = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");

  const mentors = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      title: "Senior Software Engineer",
      company: "Google",
      experience: "8 years",
      field: "Engineering",
      specialization: ["Machine Learning", "AI", "Career Guidance"],
      education: "IIT Delhi, MS Stanford",
      rating: 4.9,
      reviews: 47,
      sessions: 156,
      responseTime: "< 2 hours",
      languages: ["English", "Hindi"],
      price: "₹2,000/hour",
      availability: "Weekends",
      bio: "Helping students navigate tech careers. Previously mentored 150+ engineers. Passionate about AI and career development.",
      achievements: ["Google AI Resident", "Published 15 papers", "TEDx Speaker"],
      location: "Bangalore",
      verified: true
    },
    {
      id: 2,
      name: "Rahul Patel",
      title: "Investment Banker",
      company: "Goldman Sachs",
      experience: "6 years",
      field: "Finance",
      specialization: ["Investment Banking", "Financial Modeling", "CFA Prep"],
      education: "IIM Ahmedabad, CFA",
      rating: 4.8,
      reviews: 32,
      sessions: 89,
      responseTime: "< 4 hours",
      languages: ["English", "Gujarati"],
      price: "₹3,000/hour",
      availability: "Evenings",
      bio: "Finance professional with expertise in investment banking. Helped 50+ students crack finance interviews.",
      achievements: ["Top Performer 3 years", "CFA Charter", "Finance Club President"],
      location: "Mumbai",
      verified: true
    },
    {
      id: 3,
      name: "Dr. Anita Singh",
      title: "Consultant Physician",
      company: "AIIMS Delhi",
      experience: "12 years",
      field: "Medical",
      specialization: ["NEET Guidance", "Medical Career", "Residency Prep"],
      education: "AIIMS Delhi, MD Internal Medicine",
      rating: 4.9,
      reviews: 68,
      sessions: 234,
      responseTime: "< 3 hours",
      languages: ["English", "Hindi"],
      price: "₹2,500/hour",
      availability: "Flexible",
      bio: "Experienced physician guiding medical students. Helped 200+ students with NEET and medical career planning.",
      achievements: ["Gold Medalist AIIMS", "Published 25+ papers", "Medical Education Award"],
      location: "Delhi",
      verified: true
    },
    {
      id: 4,
      name: "Arjun Mehta",
      title: "Startup Founder & CEO",
      company: "TechStart Inc.",
      experience: "10 years",
      field: "Entrepreneurship",
      specialization: ["Startup Strategy", "Product Management", "Fundraising"],
      education: "IIT Bombay, MBA Wharton",
      rating: 4.7,
      reviews: 25,
      sessions: 67,
      responseTime: "< 6 hours",
      languages: ["English"],
      price: "₹4,000/hour",
      availability: "Weekdays",
      bio: "Serial entrepreneur with 2 successful exits. Mentoring next-gen entrepreneurs and product managers.",
      achievements: ["$50M+ Raised", "2 Successful Exits", "Forbes 30 Under 30"],
      location: "Pune",
      verified: true
    },
    {
      id: 5,
      name: "Sneha Gupta",
      title: "Senior Advocate",
      company: "Supreme Court of India",
      experience: "15 years",
      field: "Law",
      specialization: ["CLAT Guidance", "Legal Career", "Judiciary Prep"],
      education: "NLSIU Bangalore, LLM Harvard",
      rating: 4.8,
      reviews: 41,
      sessions: 123,
      responseTime: "< 5 hours",
      languages: ["English", "Hindi"],
      price: "₹3,500/hour",
      availability: "Evenings",
      bio: "Senior advocate with expertise in constitutional law. Guiding law students for 8+ years.",
      achievements: ["Supreme Court Practice", "Landmark Cases", "Legal Education Pioneer"],
      location: "Delhi",
      verified: true
    },
    {
      id: 6,
      name: "Vikram Joshi",
      title: "Creative Director",
      company: "Ogilvy",
      experience: "9 years",
      field: "Creative",
      specialization: ["Design Thinking", "Creative Strategy", "Portfolio Development"],
      education: "NID Ahmedabad",
      rating: 4.6,
      reviews: 29,
      sessions: 78,
      responseTime: "< 4 hours",
      languages: ["English", "Hindi"],
      price: "₹2,200/hour",
      availability: "Flexible",
      bio: "Award-winning creative director helping students build creative careers. Expert in design and advertising.",
      achievements: ["Cannes Lions Winner", "Design Week Speaker", "Creative Mentor of Year"],
      location: "Mumbai",
      verified: true
    }
  ];

  const mentorshipPrograms = [
    {
      title: "1-on-1 Career Guidance",
      duration: "1 hour",
      price: "₹2,000-4,000",
      description: "Personalized career counseling session",
      features: ["Career roadmap", "Skill assessment", "Goal setting", "Q&A session"]
    },
    {
      title: "Interview Preparation",
      duration: "2 hours",
      price: "₹3,000-6,000",
      description: "Mock interviews and feedback",
      features: ["Mock interviews", "Detailed feedback", "Common questions", "Confidence building"]
    },
    {
      title: "Long-term Mentorship",
      duration: "3 months",
      price: "₹15,000-30,000",
      description: "Ongoing guidance and support",
      features: ["Weekly sessions", "Goal tracking", "Network access", "Career support"]
    },
    {
      title: "Group Mentorship",
      duration: "1 month",
      price: "₹5,000-8,000",
      description: "Learn with peers in small groups",
      features: ["Group sessions", "Peer learning", "Shared resources", "Community support"]
    }
  ];

  const upcomingEvents = [
    {
      title: "Engineering Career Expo",
      date: "Dec 30, 2024",
      time: "10:00 AM",
      type: "Virtual",
      mentors: 15,
      participants: 200
    },
    {
      title: "Medical Entrance Strategy",
      date: "Jan 2, 2025",
      time: "2:00 PM",
      type: "Webinar",
      mentors: 5,
      participants: 150
    },
    {
      title: "Startup Founder Panel",
      date: "Jan 5, 2025",
      time: "6:00 PM",
      type: "Panel Discussion",
      mentors: 8,
      participants: 300
    }
  ];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesField = selectedField === "all" || 
                        mentor.field.toLowerCase() === selectedField.toLowerCase();
    
    const experienceYears = parseInt(mentor.experience);
    const matchesExperience = selectedExperience === "all" ||
                             (selectedExperience === "junior" && experienceYears < 5) ||
                             (selectedExperience === "mid" && experienceYears >= 5 && experienceYears < 10) ||
                             (selectedExperience === "senior" && experienceYears >= 10);
    
    return matchesSearch && matchesField && matchesExperience;
  });

  return (
    <DashboardLayout 
      title="Mentor Network" 
      description="Connect with industry experts and experienced professionals for career guidance"
    >
      <div className="p-6 space-y-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search mentors by name, title, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={selectedField} onValueChange={setSelectedField}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="law">Law</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedExperience} onValueChange={setSelectedExperience}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Experience</SelectItem>
              <SelectItem value="junior">0-5 years</SelectItem>
              <SelectItem value="mid">5-10 years</SelectItem>
              <SelectItem value="senior">10+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="mentors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="my-sessions">My Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="mentors" className="space-y-6">
            <div className="grid gap-6">
              {filteredMentors.map((mentor) => (
                <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={`https://images.unsplash.com/photo-${1500000000000 + mentor.id}?w=100&h=100&fit=crop&crop=face`} />
                        <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              {mentor.name}
                              {mentor.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  <Award className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </h3>
                            <p className="text-muted-foreground">{mentor.title} at {mentor.company}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {mentor.location} • {mentor.experience} experience
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{mentor.rating}</span>
                              <span className="text-sm text-muted-foreground">({mentor.reviews})</span>
                            </div>
                            <div className="text-lg font-bold text-primary">{mentor.price}</div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mt-2">{mentor.bio}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Specialization</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {mentor.specialization.slice(0, 2).map((spec, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">{spec}</Badge>
                              ))}
                              {mentor.specialization.length > 2 && (
                                <Badge variant="outline" className="text-xs">+{mentor.specialization.length - 2}</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-muted-foreground">Education</div>
                            <div className="text-sm font-medium">{mentor.education}</div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div>
                              <div className="text-xs text-muted-foreground">Sessions</div>
                              <div className="font-semibold">{mentor.sessions}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Response</div>
                              <div className="font-semibold text-green-600">{mentor.responseTime}</div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="text-xs text-muted-foreground mb-1">Key Achievements</div>
                          <div className="flex flex-wrap gap-1">
                            {mentor.achievements.slice(0, 3).map((achievement, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{achievement}</Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Book Session
                          </Button>
                          <Button variant="outline">
                            <Video className="w-4 h-4 mr-2" />
                            Quick Call
                          </Button>
                          <Button variant="outline">View Profile</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="programs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentorshipPrograms.map((program, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      {program.title}
                    </CardTitle>
                    <CardDescription>
                      {program.duration} • {program.price}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{program.description}</p>
                    <div className="space-y-2">
                      {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4">Select Program</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid gap-4">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {event.date} at {event.time}
                          </span>
                          <Badge variant="outline">{event.type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm mt-2">
                          <span>{event.mentors} Mentors</span>
                          <span>{event.participants} Expected Participants</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">Learn More</Button>
                        <Button>Register</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-sessions" className="space-y-6">
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Sessions Yet</h3>
              <p className="text-muted-foreground mb-4">
                Book your first mentorship session to get started on your journey
              </p>
              <Button>Find a Mentor</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MentorNetwork;
