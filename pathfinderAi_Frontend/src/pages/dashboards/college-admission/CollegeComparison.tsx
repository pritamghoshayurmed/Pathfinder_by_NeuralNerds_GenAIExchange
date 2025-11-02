import { useState, useEffect } from "react";
import { Building, MapPin, Star, DollarSign, Users, TrendingUp, Award, Filter, Download, Save, Share2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { CollegeService, type College } from "@/data/collegeService";
import jsPDF from 'jspdf';

const CollegeComparison = () => {
  const { toast } = useToast();
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    fees: "",
    rating: "",
    search: ""
  });
  const [appliedFilters, setAppliedFilters] = useState({
    location: "",
    type: "",
    fees: "",
    rating: "",
    search: ""
  });
  const [searchSuggestions, setSearchSuggestions] = useState<College[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load initial colleges (only 8) on component mount
  useEffect(() => {
    const loadColleges = async () => {
      try {
        setLoading(true);
        const allColleges = await CollegeService.getAllColleges();
        const initialColleges = await CollegeService.getInitialColleges();
        setColleges(allColleges);
        setFilteredColleges(initialColleges); // Show only first 8 initially
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load colleges. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadColleges();
  }, [toast]);

  // Search function
  const performSearch = async () => {
    if (!filters.search.trim()) {
      // If search is empty, reset to initial colleges
      const initialColleges = await CollegeService.getInitialColleges();
      setFilteredColleges(initialColleges);
      return;
    }

    try {
      setFilterLoading(true);
      const searchResult = await CollegeService.getFilteredColleges({ search: filters.search });
      setFilteredColleges(searchResult);
      
      toast({
        title: "Search Complete",
        description: `Found ${searchResult.length} colleges matching "${filters.search}".`
      });
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search colleges. Please try again.",
        variant: "destructive"
      });
    } finally {
      setFilterLoading(false);
    }
  };

  // Handle Enter key press in search
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
      setShowSuggestions(false);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Handle search input change with suggestions
  const handleSearchChange = async (value: string) => {
    setFilters({...filters, search: value});
    
    if (value.length > 0) {
      // Get suggestions from all colleges
      const suggestions = colleges.filter(college => 
        college.name.toLowerCase().includes(value.toLowerCase()) ||
        college.location.toLowerCase().includes(value.toLowerCase()) ||
        college.courses.some(course => course.toLowerCase().includes(value.toLowerCase()))
      ).slice(0, 5); // Limit to 5 suggestions
      
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (college: College) => {
    setFilters({...filters, search: college.name});
    setShowSuggestions(false);
    // Automatically perform search when suggestion is selected
    setTimeout(() => performSearch(), 100);
  };

  // Apply filters function
  const applyFilters = async () => {
    try {
      setFilterLoading(true);
      const filtered = await CollegeService.getFilteredColleges(filters);
      setFilteredColleges(filtered);
      setAppliedFilters({...filters});
      
      toast({
        title: "Filters Applied",
        description: `Found ${filtered.length} colleges matching your criteria.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply filters. Please try again.",
        variant: "destructive"
      });
    } finally {
      setFilterLoading(false);
    }
  };

  // Clear filters function
  const clearFilters = async () => {
    setFilters({
      location: "",
      type: "",
      fees: "",
      rating: "",
      search: ""
    });
    setAppliedFilters({
      location: "",
      type: "",
      fees: "",
      rating: "",
      search: ""
    });
    
    // Reset to initial 8 colleges
    const initialColleges = await CollegeService.getInitialColleges();
    setFilteredColleges(initialColleges);
    
    toast({
      title: "Filters Cleared",
      description: `Showing initial ${initialColleges.length} colleges.`
    });
  };

  const comparisonMetrics = [
    { name: "Faculty Quality", key: "faculty" },
    { name: "Infrastructure", key: "infrastructure" },
    { name: "Placements", key: "placements" },
    { name: "Campus Life", key: "campusLife" },
    { name: "Overall Rating", key: "rating" }
  ] as const;

  const toggleCollegeSelection = (collegeId: string) => {
    setSelectedColleges(prev => 
      prev.includes(collegeId)
        ? prev.filter(id => id !== collegeId)
        : prev.length < 3 ? [...prev, collegeId] : prev
    );
  };

  // Fix: Use original colleges array for comparison, not filtered colleges
  const selectedCollegeData = colleges.filter(college => selectedColleges.includes(college.id));

  // Generate PDF report
  const generatePDFReport = () => {
    if (selectedCollegeData.length === 0) {
      toast({
        title: "No colleges selected",
        description: "Please select at least one college to generate a report.",
        variant: "destructive"
      });
      return;
    }

    // Create a comprehensive report content
    const reportContent = `
<!DOCTYPE html>
<html>
<head>
    <title>College Comparison Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .college-section { margin-bottom: 30px; border: 1px solid #ddd; padding: 20px; }
        .college-name { color: #2563eb; font-size: 24px; font-weight: bold; }
        .metrics-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .metrics-table th, .metrics-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .metrics-table th { background-color: #f5f5f5; }
        .comparison-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .comparison-table th, .comparison-table td { border: 1px solid #ddd; padding: 10px; text-align: center; }
        .comparison-table th { background-color: #2563eb; color: white; }
    </style>
</head>
<body>
    <div class="header">
        <h1>College Comparison Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
        <p>Comparing ${selectedCollegeData.length} colleges</p>
    </div>

    ${selectedCollegeData.map(college => `
    <div class="college-section">
        <h2 class="college-name">${college.name}</h2>
        <p><strong>Location:</strong> ${college.location}</p>
        <p><strong>Type:</strong> ${college.type}</p>
        <p><strong>Rating:</strong> ${college.rating}/5</p>
        <p><strong>Annual Fees:</strong> ${college.fees}</p>
        
        <h3>Placement Details</h3>
        <table class="metrics-table">
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Average Package</td><td>${college.placement?.average || college.averagePlacement}</td></tr>
            <tr><td>Highest Package</td><td>${college.placement?.highest || college.highestPlacement}</td></tr>
            <tr><td>Placement Percentage</td><td>${college.placement?.percentage || college.placementRate}%</td></tr>
        </table>

        <h3>Academic & Infrastructure Ratings</h3>
        <table class="metrics-table">
            <tr><th>Category</th><th>Rating</th></tr>
            <tr><td>Faculty</td><td>${college.faculty}/10</td></tr>
            <tr><td>Infrastructure</td><td>${college.infrastructure}/10</td></tr>
            <tr><td>Placements</td><td>${college.placements}/10</td></tr>
            <tr><td>Campus Life</td><td>${college.campusLife}/10</td></tr>
            <tr><td>Overall Rating</td><td>${college.rating}/5</td></tr>
        </table>

        <h3>Available Courses</h3>
        <p>${college.courses.join(", ")}</p>

        <h3>Top Recruiters</h3>
        <ul>
            ${(college.highlights || college.topRecruiters?.slice(0, 5) || []).map(item => `<li>${item}</li>`).join('')}
        </ul>
    </div>
    `).join('')}

    ${selectedCollegeData.length > 1 ? `
    <div class="college-section">
        <h2>Side-by-Side Comparison</h2>
        <table class="comparison-table">
            <tr>
                <th>Metric</th>
                ${selectedCollegeData.map(college => `<th>${college.name}</th>`).join('')}
            </tr>
            <tr>
                <td><strong>Annual Fees</strong></td>
                ${selectedCollegeData.map(college => `<td>${college.fees}</td>`).join('')}
            </tr>
            <tr>
                <td><strong>Average Package</strong></td>
                ${selectedCollegeData.map(college => `<td>${college.placement.average}</td>`).join('')}
            </tr>
            <tr>
                <td><strong>Highest Package</strong></td>
                ${selectedCollegeData.map(college => `<td>${college.placement.highest}</td>`).join('')}
            </tr>
            <tr>
                <td><strong>Placement %</strong></td>
                ${selectedCollegeData.map(college => `<td>${college.placement.percentage}%</td>`).join('')}
            </tr>
            <tr>
                <td><strong>Faculty Rating</strong></td>
                ${selectedCollegeData.map(college => `<td>${college.faculty}/5</td>`).join('')}
            </tr>
            <tr>
                <td><strong>Infrastructure</strong></td>
                ${selectedCollegeData.map(college => `<td>${college.infrastructure}/5</td>`).join('')}
            </tr>
            <tr>
                <td><strong>Research</strong></td>
                ${selectedCollegeData.map(college => `<td>${college.research}/5</td>`).join('')}
            </tr>
            <tr>
                <td><strong>Alumni Network</strong></td>
                ${selectedCollegeData.map(college => `<td>${college.alumni}/5</td>`).join('')}
            </tr>
            <tr>
                <td><strong>Campus Life</strong></td>
                ${selectedCollegeData.map(college => `<td>${college.hostel}/5</td>`).join('')}
            </tr>
        </table>
    </div>
    ` : ''}

    <div class="college-section">
        <h2>Report Summary</h2>
        <p>This report provides a comprehensive comparison of the selected colleges based on various parameters including academics, infrastructure, placements, and campus life. Use this information to make an informed decision about your college choice.</p>
        <p><em>Generated by PathfinderAI College Comparison Tool</em></p>
    </div>

</body>
</html>
    `;

    // Create and download the PDF
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `College_Comparison_Report_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Generated!",
      description: "Your college comparison report has been downloaded as an HTML file.",
    });
  };

  // Save comparison to localStorage
  const saveComparison = () => {
    if (selectedCollegeData.length === 0) {
      toast({
        title: "No colleges selected",
        description: "Please select at least one college to save the comparison.",
        variant: "destructive"
      });
      return;
    }

    const comparisonData = {
      colleges: selectedCollegeData,
      timestamp: new Date().toISOString(),
      appliedFilters
    };

    const savedComparisons = JSON.parse(localStorage.getItem('savedCollegeComparisons') || '[]');
    savedComparisons.push(comparisonData);
    localStorage.setItem('savedCollegeComparisons', JSON.stringify(savedComparisons));

    toast({
      title: "Comparison Saved!",
      description: "Your college comparison has been saved locally.",
    });
  };

  // Share results
  const shareResults = async () => {
    if (selectedCollegeData.length === 0) {
      toast({
        title: "No colleges selected",
        description: "Please select at least one college to share the comparison.",
        variant: "destructive"
      });
      return;
    }

    const shareText = `🎓 College Comparison Results\n\nComparing: ${selectedCollegeData.map(c => c.name).join(', ')}\n\n${selectedCollegeData.map(college => 
      `${college.name} (${college.location})\n• Fees: ${college.fees}\n• Avg Package: ${college.placement?.average || college.averagePlacement}\n• Rating: ${college.rating}/5`
    ).join('\n\n')}\n\nGenerated by PathfinderAI College Comparison Tool`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'College Comparison Results',
          text: shareText,
        });
        toast({
          title: "Shared Successfully!",
          description: "Your comparison results have been shared.",
        });
      } catch (error) {
        // Fallback to clipboard
        fallbackShare(shareText);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      fallbackShare(shareText);
    }
  };

  const fallbackShare = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to Clipboard!",
        description: "Comparison results have been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Share Failed",
        description: "Unable to share or copy the results. Please try again.",
        variant: "destructive"
      });
    });
  };

  return (
    <DashboardLayout 
      title="College Comparison Tool" 
      description="Compare colleges based on placements, fees, alumni network, and more"
    >
      <div className="p-6 space-y-8">
        {/* Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Colleges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    placeholder="Search colleges by name, location, or courses..."
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    onFocus={() => filters.search.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="pl-10"
                  />
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                      {searchSuggestions.map((college) => (
                        <div
                          key={college.id}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleSuggestionSelect(college)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm text-gray-900">{college.name}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                {college.location}
                                <span className="text-gray-300">•</span>
                                <Building className="w-3 h-3" />
                                {college.type}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {college.rating}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button 
                  onClick={performSearch}
                  variant="outline"
                  size="default"
                  disabled={filterLoading}
                  className="shrink-0"
                >
                  {filterLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Search
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="tamil nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="College Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="deemed">Deemed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.fees} onValueChange={(value) => setFilters({...filters, fees: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Fee Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">₹0-2 Lakhs</SelectItem>
                    <SelectItem value="2-5">₹2-5 Lakhs</SelectItem>
                    <SelectItem value="5-10">₹5-10 Lakhs</SelectItem>
                    <SelectItem value="10+">₹10+ Lakhs</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.rating} onValueChange={(value) => setFilters({...filters, rating: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Minimum Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0">4.0+ Stars</SelectItem>
                    <SelectItem value="3.5">3.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button onClick={applyFilters} disabled={filterLoading} className="flex items-center gap-2">
                  {filterLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                {Object.values(appliedFilters).some(value => value !== "") && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Filters applied:</span>
                    <span className="font-medium">{filteredColleges.length} colleges found</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* College Cards */}
        {loading ? (
          <Card>
            <CardContent className="text-center py-12">
              <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">Loading Colleges...</h3>
              <p className="text-muted-foreground">Please wait while we fetch college data</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Select Colleges to Compare</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Selected: {selectedColleges.length}/3
              </span>
              {selectedColleges.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  ({selectedCollegeData.map(c => c.name).join(", ")})
                </div>
              )}
            </div>
          </div>
          
          {/* Show notification if selected colleges are hidden by filters */}
          {selectedColleges.length > 0 && selectedColleges.some(id => !filteredColleges.find(c => c.id === id)) && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-orange-800">
                  <Award className="w-4 h-4" />
                  <span className="text-sm">
                    Some of your selected colleges are hidden by the current filters but will still appear in the comparison below.
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredColleges.length > 0 ? (
              filteredColleges.map((college) => (
                <Card 
                  key={college.id}
                  className={`hover:shadow-lg transition-all cursor-pointer ${
                    selectedColleges.includes(college.id) ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Checkbox 
                            checked={selectedColleges.includes(college.id)}
                            onCheckedChange={() => toggleCollegeSelection(college.id)}
                          />
                          <CardTitle className="text-xl">{college.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {college.location}
                          </span>
                          <Badge variant="outline">{college.type}</Badge>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {college.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Annual Fees</div>
                        <div className="font-semibold">{college.fees}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Avg. Package</div>
                        <div className="font-semibold text-green-600">
                          {college.placement?.average || college.averagePlacement}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Placement Rate</span>
                        <span>{college.placement?.percentage || college.placementRate}%</span>
                      </div>
                      <Progress value={college.placement?.percentage || college.placementRate} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Top Recruiters:</div>
                      <div className="flex flex-wrap gap-1">
                        {(college.highlights || college.topRecruiters?.slice(0, 3) || []).map((highlight, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Card>
                  <CardContent className="text-center py-12">
                    <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Colleges Found</h3>
                    <p className="text-muted-foreground mb-4">
                      No colleges match your current filter criteria. Try adjusting your filters or clearing them.
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Comparison Table */}
        {selectedColleges.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Comparison</CardTitle>
              <CardDescription>Side-by-side comparison of selected colleges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Metric</th>
                      {selectedCollegeData.map((college) => (
                        <th key={college.id} className="text-center p-3 min-w-[150px]">
                          {college.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Annual Fees</td>
                      {selectedCollegeData.map((college) => (
                        <td key={college.id} className="p-3 text-center">{college.fees}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Average Package</td>
                      {selectedCollegeData.map((college) => (
                        <td key={college.id} className="p-3 text-center text-green-600 font-semibold">
                          {college.placement?.average || college.averagePlacement}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Highest Package</td>
                      {selectedCollegeData.map((college) => (
                        <td key={college.id} className="p-3 text-center text-blue-600 font-semibold">
                          {college.placement?.highest || college.highestPlacement}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Placement %</td>
                      {selectedCollegeData.map((college) => (
                        <td key={college.id} className="p-3 text-center">
                          {college.placement?.percentage || college.placementRate}%
                        </td>
                      ))}
                    </tr>
                    {comparisonMetrics.map((metric) => (
                      <tr key={metric.key} className="border-b">
                        <td className="p-3 font-medium">{metric.name}</td>
                        {selectedCollegeData.map((college) => (
                          <td key={college.id} className="p-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span>{college[metric.key as keyof Pick<College, 'faculty' | 'infrastructure' | 'research' | 'alumni' | 'hostel'>]}/5</span>
                              <div className="w-16">
                                <Progress 
                                  value={(college[metric.key as keyof Pick<College, 'faculty' | 'infrastructure' | 'research' | 'alumni' | 'hostel'>] as number) * 20} 
                                  className="h-1" 
                                />
                              </div>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex gap-4">
                <Button onClick={generatePDFReport} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Generate Detailed Report
                </Button>
                <Button variant="outline" onClick={saveComparison} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Comparison
                </Button>
                <Button variant="outline" onClick={shareResults} className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Results
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedColleges.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Start Your Comparison</h3>
              <p className="text-muted-foreground">Select up to 3 colleges to compare their features, placements, and costs</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CollegeComparison;
