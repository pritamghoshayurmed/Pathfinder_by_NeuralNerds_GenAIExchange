import { useState, useEffect } from "react";
import { DollarSign, Award, BookOpen, Filter, Search, Star, TrendingUp, Users, CheckCircle, ExternalLink, Loader2, Sparkles, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import GeminiScholarshipService, { type Scholarship, type ScholarshipSearchParams } from "@/services/geminiScholarshipService";
import DashboardLayout from "@/components/DashboardLayout";

const Scholarships = () => {
  const { toast } = useToast();
  
  const [filters, setFilters] = useState({
    category: "",
    eligibility: "",
    amount: "",
    deadline: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedScholarships, setSearchedScholarships] = useState<string[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<string[]>(["merit-1", "need-2"]);
  const [aiScholarships, setAiScholarships] = useState<Scholarship[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [showAIGenerated, setShowAIGenerated] = useState(false);

  const scholarships: Scholarship[] = [
    {
      id: "merit-1",
      name: "National Merit Scholarship",
      provider: "Government of India",
      type: "Merit-based",
      amount: "₹50,000/year",
      duration: "4 years",
      totalAmount: "₹2,00,000",
      eligibility: ["Class 12: 90%+", "Family Income < ₹8 LPA", "Indian Citizen"],
      deadline: "2024-12-30",
      status: "Active",
      applicants: "45,000+",
      successRate: 15,
      requirements: ["Academic transcripts", "Income certificate", "Caste certificate"],
      description: "Comprehensive scholarship for meritorious students from economically weaker sections",
      benefits: ["Full tuition coverage", "Monthly stipend", "Book allowance", "Laptop provided"],
      category: "Government",
      field: "All Streams",
      applicationUrl: "https://scholarships.gov.in/"
    },
    {
      id: "tech-2",
      name: "INSPIRE Scholarship",
      provider: "Department of Science & Technology",
      type: "Merit-based",
      amount: "₹80,000/year",
      duration: "5 years",
      totalAmount: "₹4,00,000",
      eligibility: ["Class 12: 85%+", "Science/Math stream", "Top 1% in board exams"],
      deadline: "2025-01-15",
      status: "Active",
      applicants: "25,000+",
      successRate: 25,
      requirements: ["Board exam marksheet", "Research proposal", "Recommendation letters"],
      description: "Scholarship for pursuing higher education in science and research",
      benefits: ["Tuition fees", "Research funding", "International exposure", "Mentorship"],
      category: "Government",
      field: "Science & Research",
      applicationUrl: "https://online-inspire.gov.in/"
    },
    {
      id: "need-2",
      name: "Aditya Birla Group Scholarship",
      provider: "Aditya Birla Group",
      type: "Need-based",
      amount: "₹1,50,000/year",
      duration: "4 years",
      totalAmount: "₹6,00,000",
      eligibility: ["Family Income < ₹4.5 LPA", "Class 12: 80%+", "Engineering/Medicine"],
      deadline: "2025-02-28",
      status: "Active",
      applicants: "15,000+",
      successRate: 40,
      requirements: ["Income proof", "Academic records", "Personal statement"],
      description: "Supporting underprivileged students in professional courses",
      benefits: ["Full tuition", "Living allowance", "Internship opportunity", "Job assistance"],
      category: "Corporate",
      field: "Engineering/Medical",
      applicationUrl: "https://scholarships.adityabirla.com/"
    },
    {
      id: "women-3",
      name: "Pragati Scholarship for Girls",
      provider: "AICTE",
      type: "Gender-specific",
      amount: "₹30,000/year",
      duration: "4 years",
      totalAmount: "₹1,20,000",
      eligibility: ["Female students", "Technical courses", "Family Income < ₹8 LPA"],
      deadline: "2025-01-31",
      status: "Active",
      applicants: "30,000+",
      successRate: 35,
      requirements: ["Gender certificate", "Income certificate", "Admission proof"],
      description: "Encouraging girl students in technical education",
      benefits: ["Tuition support", "Skill development", "Career guidance", "Networking"],
      category: "Government",
      field: "Technical Education",
      applicationUrl: "https://www.aicte-india.org/schemes"
    },
    {
      id: "minority-4",
      name: "Post Matric Scholarship",
      provider: "Ministry of Minority Affairs",
      type: "Community-based",
      amount: "₹20,000/year",
      duration: "Course duration",
      totalAmount: "₹80,000",
      eligibility: ["Minority community", "Class 12 passed", "Family Income < ₹2.5 LPA"],
      deadline: "2024-12-15",
      status: "Closing Soon",
      applicants: "1,00,000+",
      successRate: 60,
      requirements: ["Community certificate", "Income certificate", "Admission proof"],
      description: "Educational support for minority community students",
      benefits: ["Maintenance allowance", "Reader allowance", "Book allowance"],
      category: "Government",
      field: "All Streams",
      applicationUrl: "https://scholarships.gov.in/"
    },
    {
      id: "international-5",
      name: "Kishore Vaigyanik Protsahan Yojana",
      provider: "Indian Institute of Science",
      type: "Merit-based",
      amount: "₹7,000/month",
      duration: "5 years",
      totalAmount: "₹4,20,000",
      eligibility: ["KVPY qualified", "Science stream", "Age < 20 years"],
      deadline: "2025-03-15",
      status: "Active",
      applicants: "50,000+",
      successRate: 20,
      requirements: ["KVPY scorecard", "Academic transcripts", "Research aptitude"],
      description: "Fellowship for students with research aptitude in science",
      benefits: ["Monthly fellowship", "Contingency grant", "Research facilities", "PhD support"],
      category: "Government",
      field: "Basic Sciences"
    },
    {
      id: "state-6",
      name: "Chief Minister's Scholarship",
      provider: "State Government",
      type: "Merit-based",
      amount: "₹25,000/year",
      duration: "3 years",
      totalAmount: "₹75,000",
      eligibility: ["State domicile", "Class 12: 85%+", "Professional courses"],
      deadline: "2025-01-20",
      status: "Active",
      applicants: "20,000+",
      successRate: 30,
      requirements: ["Domicile certificate", "Merit certificate", "Course admission proof"],
      description: "State government initiative for meritorious students",
      benefits: ["Tuition assistance", "Study material", "Career counseling"],
      category: "State Government",
      field: "Professional Courses"
    },
    {
      id: "private-7",
      name: "Tata Scholarship",
      provider: "Tata Trusts",
      type: "Merit-cum-Need",
      amount: "₹2,00,000/year",
      duration: "4 years",
      totalAmount: "₹8,00,000",
      eligibility: ["Class 12: 90%+", "Family Income < ₹10 LPA", "Leadership qualities"],
      deadline: "2025-02-15",
      status: "Active",
      applicants: "10,000+",
      successRate: 10,
      requirements: ["Academic excellence", "Leadership portfolio", "Interview"],
      description: "Comprehensive scholarship for exceptional students",
      benefits: ["Full education cost", "Living expenses", "International exposure", "Mentorship"],
      category: "Private Foundation",
      field: "All Streams"
    }
  ];

  // AI-powered scholarship search
  const handleAISearch = async () => {
    if (!searchTerm.trim() && !filters.category && !filters.eligibility) {
      toast({
        title: "Search Query Required",
        description: "Please enter a search term or select filters to find scholarships.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setLastSearchQuery(searchTerm);

    try {
      console.log('🔍 Starting AI scholarship search...');
      
      const searchParams: ScholarshipSearchParams = {
        searchTerm: searchTerm.trim(),
        category: filters.category,
        eligibility: filters.eligibility,
        amount: filters.amount,
        deadline: filters.deadline
      };

      const result = await GeminiScholarshipService.searchScholarships(searchParams, scholarships);
      
      console.log('✅ Search completed:', result);

      if (result.aiGenerated.length > 0) {
        setAiScholarships(result.aiGenerated);
        setShowAIGenerated(true);
        
        toast({
          title: "AI Scholarships Found",
          description: `Found ${result.aiGenerated.length} additional scholarship opportunities using AI.`,
        });
      } else if (result.scholarships.length > 0) {
        toast({
          title: "Scholarships Found",
          description: `Found ${result.scholarships.length} matching scholarships from our database.`,
        });
      } else {
        toast({
          title: "No Scholarships Found",
          description: "Try adjusting your search criteria or filters.",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('❌ Error in AI search:', error);
      toast({
        title: "Search Error",
        description: "There was an error searching for scholarships. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Clear AI results
  const clearAIResults = () => {
    setAiScholarships([]);
    setShowAIGenerated(false);
    setLastSearchQuery("");
    
    toast({
      title: "AI Results Cleared",
      description: "Showing only database scholarships.",
    });
  };

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.field.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filters.category === "" || filters.category === "all-categories" || scholarship.category === filters.category;
    const matchesType = filters.eligibility === "" || filters.eligibility === "all-types" || scholarship.type === filters.eligibility;
    
    let matchesAmount = true;
    if (filters.amount && filters.amount !== "any-amount") {
      const amount = parseInt(scholarship.amount.replace(/[₹,/year]/g, ''));
      switch (filters.amount) {
        case "0-50k":
          matchesAmount = amount <= 50000;
          break;
        case "50k-1l":
          matchesAmount = amount > 50000 && amount <= 100000;
          break;
        case "1l-2l":
          matchesAmount = amount > 100000 && amount <= 200000;
          break;
        case "2l+":
          matchesAmount = amount > 200000;
          break;
      }
    }
    
    const matchesDeadline = filters.deadline === "" || filters.deadline === "all-deadlines" || 
      (filters.deadline === "urgent" && scholarship.status === "Closing Soon") ||
      (filters.deadline === "active" && scholarship.status === "Active");
    
    return matchesSearch && matchesCategory && matchesType && matchesAmount && matchesDeadline;
  });

  // Combine regular scholarships with AI scholarships
  const allScholarships = showAIGenerated ? [...filteredScholarships, ...aiScholarships] : filteredScholarships;
  const displayScholarships = allScholarships;

  const toggleApplied = (scholarshipId: string) => {
    setSearchedScholarships(prev => 
      prev.includes(scholarshipId)
        ? prev.filter(id => id !== scholarshipId)
        : [...prev, scholarshipId]
    );
  };

  const toggleSaved = (scholarshipId: string) => {
    setSavedScholarships(prev => 
      prev.includes(scholarshipId)
        ? prev.filter(id => id !== scholarshipId)
        : [...prev, scholarshipId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Closing Soon": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 50) return "text-green-600";
    if (rate >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const totalSavedValue = savedScholarships.reduce((total, id) => {
    const scholarship = scholarships.find(s => s.id === id);
    if (scholarship) {
      return total + parseInt(scholarship.totalAmount.replace(/[₹,]/g, ''));
    }
    return total;
  }, 0);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <DashboardLayout 
      title="Scholarship Finder" 
      description="Government schemes, private funding, and education loan optimization"
    >
      <div className="p-6 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="feature-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalSavedValue)}
              </div>
              <div className="text-sm text-muted-foreground">Potential Funding</div>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {displayScholarships.length}
              </div>
              <div className="text-sm text-muted-foreground">Available Scholarships</div>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {savedScholarships.length}
              </div>
              <div className="text-sm text-muted-foreground">Saved Applications</div>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {searchedScholarships.length}
              </div>
              <div className="text-sm text-muted-foreground">Scholarships Searched</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Find Scholarships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search scholarships by name, provider, or field..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAISearch();
                      }
                    }}
                    className="w-full"
                  />
                </div>
                <Button 
                  className="btn-secondary" 
                  onClick={handleAISearch}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  {isSearching ? 'Searching...' : 'AI-Powered Search'}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-categories">All Categories</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Private Foundation">Private Foundation</SelectItem>
                    <SelectItem value="State Government">State Government</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.eligibility} onValueChange={(value) => setFilters({...filters, eligibility: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">All Types</SelectItem>
                    <SelectItem value="Merit-based">Merit-based</SelectItem>
                    <SelectItem value="Need-based">Need-based</SelectItem>
                    <SelectItem value="Gender-specific">Gender-specific</SelectItem>
                    <SelectItem value="Community-based">Community-based</SelectItem>
                    <SelectItem value="Merit-cum-Need">Merit-cum-Need</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.amount} onValueChange={(value) => setFilters({...filters, amount: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Amount Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any-amount">Any Amount</SelectItem>
                    <SelectItem value="0-50k">₹0 - ₹50,000</SelectItem>
                    <SelectItem value="50k-1l">₹50,000 - ₹1 Lakh</SelectItem>
                    <SelectItem value="1l-2l">₹1 Lakh - ₹2 Lakh</SelectItem>
                    <SelectItem value="2l+">₹2 Lakh+</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.deadline} onValueChange={(value) => setFilters({...filters, deadline: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Deadline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-deadlines">All Deadlines</SelectItem>
                    <SelectItem value="urgent">Closing Soon</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Search Results Section */}
        {showAIGenerated && aiScholarships.length > 0 && (
          <Card className="border-2 border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Bot className="w-5 h-5" />
                  AI-Generated Scholarships
                  <Badge className="bg-primary/20 text-primary">
                    {aiScholarships.length} new
                  </Badge>
                </CardTitle>
                <Button variant="outline" size="sm" onClick={clearAIResults}>
                  Clear AI Results
                </Button>
              </div>
              <CardDescription>
                AI discovered these additional scholarship opportunities for "{lastSearchQuery}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                💡 These scholarships were generated using AI based on your search criteria. 
                Please verify details and eligibility before applying.
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scholarship Listings */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">
              All Scholarships ({displayScholarships.length})
              {aiScholarships.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  +{aiScholarships.length} AI
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="saved">Saved ({savedScholarships.length})</TabsTrigger>
            <TabsTrigger value="applied">Searched ({searchedScholarships.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-6">
            {isSearching && (
              <Card className="border-dashed border-2 border-primary/30">
                <CardContent className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold text-primary mb-2">Searching with AI...</h3>
                  <p className="text-muted-foreground">
                    Finding scholarships that match your criteria: "{searchTerm}"
                  </p>
                </CardContent>
              </Card>
            )}
            
            {displayScholarships.map((scholarship) => (
              <Card key={scholarship.id} className="feature-card hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{scholarship.name}</CardTitle>
                        <Badge className={getStatusColor(scholarship.status)}>
                          {scholarship.status}
                        </Badge>
                        <Badge variant="outline">{scholarship.type}</Badge>
                        {scholarship.isAIGenerated && (
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            <Bot className="w-3 h-3 mr-1" />
                            AI Generated
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        {scholarship.provider} • {scholarship.field}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{scholarship.amount}</div>
                      <div className="text-sm text-muted-foreground">
                        Total: {scholarship.totalAmount}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground">{scholarship.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Eligibility</div>
                      <div className="space-y-1">
                        {scholarship.eligibility.map((req, index) => (
                          <div key={index} className="text-sm flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {req}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Benefits</div>
                      <div className="flex flex-wrap gap-1">
                        {scholarship.benefits.map((benefit, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Application Stats</div>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Applicants: </span>
                          <span>{scholarship.applicants}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Success Rate: </span>
                          <span className={getSuccessRateColor(scholarship.successRate)}>
                            {scholarship.successRate}%
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Deadline: </span>
                          <span className="font-medium">{scholarship.deadline}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Required Documents</div>
                    <div className="flex flex-wrap gap-1">
                      {scholarship.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-4 border-t">
                    <Button 
                      size="sm" 
                      className="btn-primary"
                      onClick={() => {
                        if (searchedScholarships.includes(scholarship.id)) {
                          return; // Already searched
                        }
                        
                        // Generate Google search URL with scholarship name and provider
                        const searchQuery = `${scholarship.name} ${scholarship.provider} scholarship application 2025`;
                        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
                        
                        // Open Google search in new tab
                        window.open(googleSearchUrl, '_blank');
                        
                        // Mark as searched after opening the search
                        setSearchedScholarships(prev => [...prev, scholarship.id]);
                      }}
                      disabled={searchedScholarships.includes(scholarship.id)}
                      title={`Search for "${scholarship.name}" on Google to find application details`}
                    >
                      {searchedScholarships.includes(scholarship.id) ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Searched
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Search & Apply
                        </>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toggleSaved(scholarship.id)}
                    >
                      <Star className={`w-4 h-4 mr-2 ${savedScholarships.includes(scholarship.id) ? 'fill-current' : ''}`} />
                      {savedScholarships.includes(scholarship.id) ? 'Saved' : 'Save'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Get Help
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-4 mt-6">
            {displayScholarships.filter(s => savedScholarships.includes(s.id)).map((scholarship) => (
              <Card key={scholarship.id} className="feature-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{scholarship.name}</h3>
                      <p className="text-muted-foreground">{scholarship.provider}</p>
                      <div className="mt-2">
                        <Badge className={getStatusColor(scholarship.status)}>
                          {scholarship.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">{scholarship.amount}</div>
                      <div className="text-sm text-muted-foreground">Deadline: {scholarship.deadline}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="applied" className="space-y-4 mt-6">
            {displayScholarships.filter(s => searchedScholarships.includes(s.id)).map((scholarship) => (
              <Card key={scholarship.id} className="feature-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{scholarship.name}</h3>
                      <p className="text-muted-foreground">{scholarship.provider}</p>
                      <div className="mt-2">
                        <Badge className="bg-blue-100 text-blue-800">Application Submitted</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">{scholarship.amount}</div>
                      <div className="text-sm text-muted-foreground">Applied on: Dec 20, 2024</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {filteredScholarships.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Scholarships Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters to find suitable scholarships
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Scholarships;
