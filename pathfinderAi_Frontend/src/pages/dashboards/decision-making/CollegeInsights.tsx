import { useEffect, useState, useRef } from "react";
import { Building, MapPin, Star, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const trends = [
    {
        title: "Engineering Demand",
        data: [
            { field: "Computer Science", demand: "Very High", growth: "+12%", top: "IIT Bombay", avg: "₹22 LPA" },
            { field: "Mechanical", demand: "Moderate", growth: "+5%", top: "IIT Delhi", avg: "₹12 LPA" },
        ],
    },
    {
        title: "Medical Trends",
        data: [
            { field: "MBBS", demand: "High", growth: "+8%", top: "AIIMS Delhi", avg: "₹15 LPA" },
            { field: "Dentistry", demand: "Stable", growth: "+2%", top: "Maulana Azad", avg: "₹8 LPA" },
        ],
    },
    {
        title: "Management Placements",
        data: [
            { field: "MBA", demand: "Very High", growth: "+15%", top: "IIM Ahmedabad", avg: "₹28 LPA" },
            { field: "BBA", demand: "Growing", growth: "+7%", top: "NMIMS Mumbai", avg: "₹6 LPA" },
        ],
    },
];

const CollegeInsights = () => {
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [colleges, setColleges] = useState<any[]>([]);
    const [initialColleges, setInitialColleges] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [selectedColleges, setSelectedColleges] = useState<any[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Load colleges directly from JSON file
    useEffect(() => {
        const loadColleges = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch directly from public folder
                const response = await fetch('/data/colleges_500.json');
                
                if (!response.ok) {
                    throw new Error(`Failed to load colleges: ${response.status}`);
                }
                
                const data = await response.json();
                
                console.log(`✅ Loaded ${data.length} colleges from JSON file`);
                
                // Take top 10 colleges by default
                const topColleges = data.slice(0, 10);
                setColleges(topColleges);
                setInitialColleges(data); // Store all colleges for search
                
            } catch (err) {
                console.error("Error loading colleges:", err);
                setError("Failed to load colleges from file");
                
                // Fallback data
                const fallbackData = [
                    {
                        id: 1,
                        name: "IIT Delhi",
                        location: "New Delhi",
                        type: "Government",
                        category: "Engineering",
                        ranking: 1,
                        fees: "₹2.5 LPA",
                        averagePlacement: "₹18 LPA",
                        highestPlacement: "₹45 LPA",
                        placementRate: 95,
                        rating: 4.8,
                        infrastructure: 4.9,
                        faculty: 4.8,
                        placements: 4.9,
                        campusLife: 4.7,
                        courses: ["B.Tech CSE", "B.Tech Mechanical"],
                        topRecruiters: ["Google", "Microsoft", "Amazon", "Goldman Sachs"],
                        website: "https://home.iitd.ac.in",
                        applyLink: "https://josaa.nic.in"
                    },
                    {
                        id: 2,
                        name: "AIIMS Delhi",
                        location: "New Delhi",
                        type: "Government",
                        category: "Medical",
                        ranking: 1,
                        fees: "₹5,000/year",
                        averagePlacement: "₹15 LPA",
                        highestPlacement: "₹25 LPA",
                        placementRate: 100,
                        rating: 4.9,
                        infrastructure: 4.8,
                        faculty: 4.9,
                        placements: 5.0,
                        campusLife: 4.6,
                        courses: ["MBBS", "MD", "MS"],
                        topRecruiters: ["AIIMS", "Max Hospital", "Apollo", "Fortis"],
                        website: "https://www.aiims.edu",
                        applyLink: "https://www.nta.ac.in/neet"
                    },
                    {
                        id: 3,
                        name: "IIT Bombay",
                        location: "Mumbai",
                        type: "Government",
                        category: "Engineering",
                        ranking: 2,
                        fees: "₹2.5 LPA",
                        averagePlacement: "₹20 LPA",
                        highestPlacement: "₹1.8 Cr",
                        placementRate: 96,
                        rating: 4.8,
                        infrastructure: 4.9,
                        faculty: 4.9,
                        placements: 4.9,
                        campusLife: 4.8,
                        courses: ["B.Tech CSE", "B.Tech Mechanical", "B.Tech Chemical"],
                        topRecruiters: ["Google", "Microsoft", "Goldman Sachs", "Apple"],
                        website: "https://www.iitb.ac.in",
                        applyLink: "https://josaa.nic.in"
                    }
                ];
                
                setColleges(fallbackData);
                setInitialColleges(fallbackData);
            } finally {
                setLoading(false);
            }
        };

        loadColleges();
    }, []);

    // Client-side search with debounce
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            setShowDropdown(false);
            setIsSearchMode(false);
            setColleges(initialColleges.slice(0, 10)); // Show top 10 when search is cleared
            return;
        }

        setIsSearchMode(true);
        const timer = setTimeout(() => {
            // Perform local search on initialColleges
            const query = searchTerm.toLowerCase();
            const results = initialColleges.filter(college =>
                college.name.toLowerCase().includes(query) ||
                (college.location && college.location.toLowerCase().includes(query)) ||
                (college.category && college.category.toLowerCase().includes(query))
            );
            
            console.log(`🔍 Found ${results.length} results for "${searchTerm}"`);
            setSearchResults(results.slice(0, 10)); // Show top 10 results
            setShowDropdown(true);
        }, 300);
        
        return () => clearTimeout(timer);
    }, [searchTerm, initialColleges]);

    // Handle dropdown selection
    const handleSelectCollege = (college: any) => {
        setColleges([college]);
        setSearchTerm(college.name);
        setShowDropdown(false);
        setIsSearchMode(true);
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (!value.trim() && searchResults.length > 0) {
            setShowDropdown(true);
        }
    };

    // Handle clearing search manually
    const handleClearSearch = () => {
        setSearchTerm("");
        setSearchResults([]);
        setShowDropdown(false);
        setIsSearchMode(false);
        setColleges(initialColleges.slice(0, 10)); // Show top 10
        if (searchRef.current) {
            searchRef.current.focus();
        }
    };

    // Filter logic
    const filteredColleges = (isSearchMode ? colleges : colleges).filter((college) => {
        const matchesSearch = isSearchMode 
            ? (college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (college.location && college.location.toLowerCase().includes(searchTerm.toLowerCase())))
            : true;

        if (selectedFilter === "all") return matchesSearch;
        if (selectedFilter === "engineering")
            return (
                matchesSearch &&
                college.courses?.some((course: string) => 
                    course.toLowerCase().includes("computer") || 
                    course.toLowerCase().includes("electrical") || 
                    course.toLowerCase().includes("mechanical") ||
                    course.toLowerCase().includes("tech") ||
                    course.toLowerCase().includes("engineering")
                )
            );
        if (selectedFilter === "medical") 
            return matchesSearch && college.courses?.some((course: string) => 
                course.toLowerCase().includes("mbbs") || 
                course.toLowerCase().includes("md") ||
                course.toLowerCase().includes("medical") ||
                course.toLowerCase().includes("medicine")
            );
        if (selectedFilter === "management") 
            return matchesSearch && college.courses?.some((course: string) => 
                course.toLowerCase().includes("mba") ||
                course.toLowerCase().includes("bba") ||
                course.toLowerCase().includes("management")
            );
        if (selectedFilter === "law") 
            return matchesSearch && college.courses?.some((course: string) => 
                course.toLowerCase().includes("llb") || 
                course.toLowerCase().includes("llm") ||
                course.toLowerCase().includes("law")
            );
        return matchesSearch;
    });

    return (
        <DashboardLayout
            title="College Insights Hub"
            description="Comprehensive college analysis, trends, and placement insights"
        >
            <div className="p-6 space-y-8">
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 relative">
                    <div className="flex-1 relative">
                        <div className="relative">
                            <Input
                                ref={searchRef}
                                placeholder="Search colleges by name or location..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full pr-10"
                                autoComplete="off"
                                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            />
                            {/* Clear button */}
                            {searchTerm && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    type="button"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        
                        {/* Animated Dropdown */}
                        <AnimatePresence>
                            {showDropdown && searchResults.length > 0 && (
                                <motion.ul
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute z-10 w-full bg-white/70 backdrop-blur-md border rounded-lg shadow-lg mt-2 max-h-64 overflow-auto"
                                >
                                    {searchResults.map((college, idx) => (
                                        <li
                                            key={college.id || idx}
                                            className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-black border-b border-gray-100 last:border-b-0"
                                            onMouseDown={() => handleSelectCollege(college)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="font-medium">{college.name}</span>
                                                    <div className="text-xs text-muted-foreground">{college.location}</div>
                                                </div>
                                                <Badge variant="outline" className="text-xs">
                                                    #{college.ranking || 'N/A'}
                                                </Badge>
                                            </div>
                                        </li>
                                    ))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Filter by stream" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Streams</SelectItem>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="medical">Medical</SelectItem>
                            <SelectItem value="management">Management</SelectItem>
                            <SelectItem value="law">Law</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Search Status Indicator */}
                {isSearchMode && searchTerm && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-blue-700">
                                Showing search results for "{searchTerm}" • {filteredColleges.length} colleges found
                            </span>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleClearSearch}
                            className="text-blue-700 border-blue-300 hover:bg-blue-100"
                        >
                            Show All Colleges
                        </Button>
                    </div>
                )}

                <Tabs defaultValue="colleges" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="colleges">Top Colleges</TabsTrigger>
                        <TabsTrigger value="trends">Market Trends</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="colleges" className="space-y-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                <span className="ml-4">Loading colleges...</span>
                            </div>
                        ) : error ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <div className="text-center">
                                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Colleges</h3>
                                        <p className="text-gray-600 mb-4">{error}</p>
                                        <p className="text-sm text-muted-foreground mb-4">Showing fallback data</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : filteredColleges.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <div className="text-center">
                                        <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No colleges found</h3>
                                        <p className="text-gray-600 mb-4">
                                            {isSearchMode 
                                                ? `No colleges match your search for "${searchTerm}"`
                                                : "Try adjusting your filters or search criteria"
                                            }
                                        </p>
                                        {isSearchMode && (
                                            <Button onClick={handleClearSearch} variant="outline">
                                                Clear Search
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-6">
                                {filteredColleges.map((college) => (
                                    <motion.div
                                        key={college.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="hover:shadow-lg transition-shadow">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <CardTitle className="flex items-center gap-2">
                                                            <Building className="w-5 h-5" />
                                                            {college.name}
                                                            <Badge variant="secondary">#{college.ranking}</Badge>
                                                        </CardTitle>
                                                        <CardDescription className="flex items-center gap-2 mt-1">
                                                            <MapPin className="w-4 h-4" />
                                                            {college.location} • {college.type}
                                                        </CardDescription>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="font-semibold">{college.rating}</span>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                                    <div className="space-y-1">
                                                        <div className="text-sm text-muted-foreground">Annual Fees</div>
                                                        <div className="font-semibold">{college.fees}</div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="text-sm text-muted-foreground">Avg Package</div>
                                                        <div className="font-semibold text-green-600">{college.averagePlacement}</div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="text-sm text-muted-foreground">Highest Package</div>
                                                        <div className="font-semibold text-blue-600">{college.highestPlacement}</div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="text-sm text-muted-foreground">Placement Rate</div>
                                                        <div className="flex items-center gap-2">
                                                            <Progress value={college.placementRate} className="flex-1" />
                                                            <span className="text-sm font-semibold">{college.placementRate}%</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                    <div className="text-center">
                                                        <div className="text-sm text-muted-foreground">Infrastructure</div>
                                                        <div className="font-semibold">{college.infrastructure}/5</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-sm text-muted-foreground">Faculty</div>
                                                        <div className="font-semibold">{college.faculty}/5</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-sm text-muted-foreground">Placements</div>
                                                        <div className="font-semibold">{college.placements}/5</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-sm text-muted-foreground">Campus Life</div>
                                                        <div className="font-semibold">{college.campusLife}/5</div>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <div className="text-sm font-medium mb-1">Popular Courses</div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {college.courses?.map((course: string, idx: number) => (
                                                                <Badge key={idx} variant="outline">
                                                                    {course}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium mb-1">Top Recruiters</div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {college.topRecruiters?.slice(0, 4).map((recruiter: string, idx: number) => (
                                                                <Badge key={idx} variant="secondary">
                                                                    {recruiter}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 mt-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(college.website, "_blank")}
                                                    >
                                                        View Details
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(college.applyLink, "_blank")}
                                                    >
                                                        Apply Now
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (selectedColleges.length === 0) {
                                                                setSelectedColleges([college]);
                                                                alert("Select another college to compare.");
                                                            } else if (selectedColleges.length === 1) {
                                                                setSelectedColleges([...selectedColleges, college]);
                                                                setShowPopup(true);
                                                            } else {
                                                                alert("You can only compare two colleges at a time.");
                                                            }
                                                        }}
                                                    >
                                                        Compare
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="trends" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {trends.map((trend, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5" />
                                            {trend.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {trend.data.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                                    <div>
                                                        <div className="font-medium">{item.field}</div>
                                                        {item.demand && (
                                                            <div className="text-sm text-muted-foreground">Demand: {item.demand}</div>
                                                        )}
                                                        {item.avg && (
                                                            <div className="text-sm text-muted-foreground">Average: {item.avg}</div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        {item.growth && <div className="font-semibold text-green-600">{item.growth}</div>}
                                                        {item.top && <div className="text-sm font-medium text-blue-600">{item.top}</div>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Placement Success Rate</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-green-600 mb-2">94.2%</div>
                                    <div className="text-sm text-muted-foreground">Average across top 100 colleges</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Average Package Growth</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-blue-600 mb-2">+18.5%</div>
                                    <div className="text-sm text-muted-foreground">Year-over-year increase</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Top Hiring Sectors</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Technology</span>
                                            <span className="text-sm font-semibold">42%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Consulting</span>
                                            <span className="text-sm font-semibold">28%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Finance</span>
                                            <span className="text-sm font-semibold">18%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Comparison Popup */}
                {showPopup && selectedColleges.length === 2 && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg p-6 w-full max-w-4xl border border-white">
                            <h3 className="text-lg font-semibold mb-4 text-center text-white">Detailed Comparison</h3>
                            <div className="grid grid-cols-3 gap-4 text-white">
                                <div>
                                    <div className="text-sm font-medium">Metric</div>
                                    <ul className="space-y-2">
                                        <li>Annual Fees</li>
                                        <li>Average Package</li>
                                        <li>Highest Package</li>
                                        <li>Placement %</li>
                                        <li>Infrastructure</li>
                                        <li>Campus Life</li>
                                    </ul>
                                </div>
                                {selectedColleges.map((college, idx) => (
                                    <div key={idx}>
                                        <div className="text-sm font-medium text-center">{college.name}</div>
                                        <ul className="space-y-2 text-center">
                                            <li>{college.fees}</li>
                                            <li className="text-green-400">{college.averagePlacement}</li>
                                            <li className="text-blue-400">{college.highestPlacement}</li>
                                            <li>{college.placementRate}%</li>
                                            <li>{college.infrastructure}/5</li>
                                            <li>{college.campusLife}/5</li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-4 mt-6 justify-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const doc = new jsPDF();
                                        doc.setFont("helvetica", "bold");
                                        doc.setFontSize(20);
                                        doc.setTextColor("#333");
                                        doc.text("Detailed Comparison", 105, 15, { align: "center" });

                                        const headers = [
                                            ["Metric", selectedColleges[0].name, selectedColleges[1].name],
                                        ];

                                        const rows = [
                                            ["Annual Fees", selectedColleges[0].fees, selectedColleges[1].fees],
                                            ["Average Package", selectedColleges[0].averagePlacement, selectedColleges[1].averagePlacement],
                                            ["Highest Package", selectedColleges[0].highestPlacement, selectedColleges[1].highestPlacement],
                                            ["Placement %", `${selectedColleges[0].placementRate}%`, `${selectedColleges[1].placementRate}%`],
                                            ["Infrastructure", `${selectedColleges[0].infrastructure}/5`, `${selectedColleges[1].infrastructure}/5`],
                                            ["Campus Life", `${selectedColleges[0].campusLife}/5`, `${selectedColleges[1].campusLife}/5`],
                                        ];

                                        autoTable(doc, {
                                            head: headers,
                                            body: rows,
                                            startY: 60,
                                            theme: "grid",
                                            styles: { fontSize: 12, halign: "center" },
                                            headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
                                        });

                                        doc.save("College_Comparison.pdf");
                                    }}
                                >
                                    Save Comparison
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => alert("Sharing results...")}>
                                    Share Results
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedColleges([]);
                                        setShowPopup(false);
                                    }}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default CollegeInsights;
