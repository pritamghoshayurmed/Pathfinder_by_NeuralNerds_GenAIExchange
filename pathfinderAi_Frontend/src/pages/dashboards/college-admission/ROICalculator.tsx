import { useState, useEffect } from "react";
import { Calculator, TrendingUp, DollarSign, GraduationCap, Building, Target, BarChart3, PieChart, AlertTriangle, Download, Save, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import DashboardLayout from "@/components/DashboardLayout";

interface ROIResults {
  totalInvestment: number;
  totalEarnings: number;
  netReturn: number;
  roiRatio: number;
  roiPercentage: number;
  paybackPeriod: number;
  breakevenYear: number;
  educationCost: number;
  opportunityCost: number;
  monthlyROI: number;
}

interface ComparisonOption {
  id: string;
  courseName: string;
  college: string;
  totalInvestment: number;
  roiPercentage: number;
  breakevenYear: number;
  saved?: boolean;
}

const ROICalculator = () => {
  const { toast } = useToast();
  
  const [courseData, setCourseData] = useState({
    courseName: "",
    college: "",
    duration: 4,
    totalFees: 0,
    livingCosts: 0,
    otherExpenses: 0
  });

  const [careerData, setCareerData] = useState({
    startingSalary: 0,
    salaryGrowthRate: [8],
    careerDuration: [35],
    alternativeIncome: 0
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [savedAnalyses, setSavedAnalyses] = useState<ComparisonOption[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Load saved analyses on component mount
  useEffect(() => {
    const existingAnalyses = JSON.parse(localStorage.getItem('roiAnalyses') || '[]');
    setSavedAnalyses(existingAnalyses);
  }, []);

  const colleges = [
    { name: "IIT Delhi", fees: 250000, avgSalary: 1800000, type: "Government" },
    { name: "BITS Pilani", fees: 450000, avgSalary: 1500000, type: "Private" },
    { name: "NIT Trichy", fees: 180000, avgSalary: 1200000, type: "Government" },
    { name: "VIT Vellore", fees: 280000, avgSalary: 800000, type: "Private" },
    { name: "IIIT Hyderabad", fees: 320000, avgSalary: 2200000, type: "Government" },
    { name: "Manipal Institute", fees: 380000, avgSalary: 800000, type: "Private" }
  ];

  const courses = [
    { name: "Computer Science Engineering", avgSalary: 1500000, growth: 12 },
    { name: "Electronics Engineering", avgSalary: 1200000, growth: 8 },
    { name: "Mechanical Engineering", avgSalary: 800000, growth: 6 },
    { name: "MBA", avgSalary: 1800000, growth: 10 },
    { name: "MBBS", avgSalary: 1000000, growth: 5 },
    { name: "Data Science", avgSalary: 1600000, growth: 15 }
  ];

  const calculateROI = () => {
    const totalEducationCost = (courseData.totalFees + courseData.livingCosts + courseData.otherExpenses) * courseData.duration;
    const opportunityCost = careerData.alternativeIncome * courseData.duration;
    const totalInvestment = totalEducationCost + opportunityCost;

    let totalEarnings = 0;
    let currentSalary = careerData.startingSalary;
    const annualGrowthRate = careerData.salaryGrowthRate[0] / 100;
    const workingYears = careerData.careerDuration[0];

    for (let year = 1; year <= workingYears; year++) {
      totalEarnings += currentSalary;
      currentSalary *= (1 + annualGrowthRate);
    }

    const netReturn = totalEarnings - totalInvestment;
    const roiRatio = totalInvestment > 0 ? (netReturn / totalInvestment) : 0;
    const roiPercentage = roiRatio * 100;
    const paybackPeriod = totalInvestment > 0 ? totalInvestment / careerData.startingSalary : 0;

    // Calculate breakeven point
    let breakevenYear = 0;
    let cumulativeEarnings = 0;
    currentSalary = careerData.startingSalary;
    
    for (let year = 1; year <= workingYears; year++) {
      cumulativeEarnings += currentSalary;
      if (cumulativeEarnings >= totalInvestment && breakevenYear === 0) {
        breakevenYear = year;
      }
      currentSalary *= (1 + annualGrowthRate);
    }

    setResults({
      totalInvestment,
      totalEarnings,
      netReturn,
      roiRatio,
      roiPercentage,
      paybackPeriod,
      breakevenYear,
      educationCost: totalEducationCost,
      opportunityCost,
      monthlyROI: netReturn / (workingYears * 12)
    });
  };

  const handleCollegeSelect = (collegeName: string) => {
    const college = colleges.find(c => c.name === collegeName);
    if (college) {
      setCourseData({
        ...courseData,
        college: collegeName,
        totalFees: college.fees
      });
      setCareerData({
        ...careerData,
        startingSalary: college.avgSalary
      });
    }
  };

  const handleCourseSelect = (courseName: string) => {
    const course = courses.find(c => c.name === courseName);
    if (course) {
      setCourseData({
        ...courseData,
        courseName
      });
      setCareerData({
        ...careerData,
        startingSalary: course.avgSalary,
        salaryGrowthRate: [course.growth]
      });
    }
  };

  const getROIRating = (percentage: number) => {
    if (percentage > 500) return { label: "Excellent", color: "text-green-600", bg: "bg-green-100" };
    if (percentage > 300) return { label: "Very Good", color: "text-blue-600", bg: "bg-blue-100" };
    if (percentage > 200) return { label: "Good", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (percentage > 100) return { label: "Average", color: "text-orange-600", bg: "bg-orange-100" };
    return { label: "Poor", color: "text-red-600", bg: "bg-red-100" };
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString()}`;
  };

  const generateDetailedReport = () => {
    if (!results) {
      toast({
        title: "No Data Available",
        description: "Please calculate ROI first before generating report.",
        variant: "destructive"
      });
      return;
    }

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    let yPosition = 30;

    // Header
    pdf.setFontSize(24);
    pdf.setTextColor(59, 130, 246); // Blue color
    pdf.text('ROI Analysis Report', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 25;

    // Course Information
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Course & College Information', margin, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(11);
    pdf.text(`Course: ${courseData.courseName || 'Not specified'}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`College: ${courseData.college || 'Not specified'}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Duration: ${courseData.duration} years`, margin, yPosition);
    yPosition += 15;

    // Investment Breakdown
    pdf.setFontSize(16);
    pdf.text('Investment Breakdown', margin, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(11);
    pdf.text(`Education Costs: ${formatCurrency(results.educationCost)}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Opportunity Costs: ${formatCurrency(results.opportunityCost)}`, margin, yPosition);
    yPosition += 7;
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text(`Total Investment: ${formatCurrency(results.totalInvestment)}`, margin, yPosition);
    pdf.setFont(undefined, 'normal');
    yPosition += 20;

    // ROI Metrics
    pdf.setFontSize(16);
    pdf.text('ROI Analysis', margin, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(11);
    pdf.text(`Lifetime Earnings: ${formatCurrency(results.totalEarnings)}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Net Return: ${formatCurrency(results.netReturn)}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`ROI Percentage: ${results.roiPercentage.toFixed(1)}%`, margin, yPosition);
    yPosition += 7;
    pdf.text(`ROI Multiple: ${results.roiRatio.toFixed(1)}x`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Breakeven Period: ${results.breakevenYear} years`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Monthly ROI: ${formatCurrency(results.monthlyROI)}`, margin, yPosition);
    yPosition += 20;

    // Rating and Recommendations
    const rating = getROIRating(results.roiPercentage);
    pdf.setFontSize(16);
    pdf.text('Investment Rating', margin, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text(`Rating: ${rating.label}`, margin, yPosition);
    pdf.setFont(undefined, 'normal');
    yPosition += 15;

    // Recommendations
    pdf.setFontSize(16);
    pdf.text('Recommendations', margin, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(11);
    if (results.roiPercentage > 400) {
      pdf.text('• This investment shows excellent returns with strong career prospects.', margin, yPosition);
      yPosition += 7;
      pdf.text('• The high ROI indicates strong market demand for this field.', margin, yPosition);
      yPosition += 7;
      pdf.text('• Consider proceeding with this educational investment.', margin, yPosition);
    } else if (results.roiPercentage < 150) {
      pdf.text('• The ROI is below industry standards.', margin, yPosition);
      yPosition += 7;
      pdf.text('• Consider exploring other courses or colleges with better placement records.', margin, yPosition);
      yPosition += 7;
      pdf.text('• Research alternative career paths with higher growth potential.', margin, yPosition);
    } else {
      pdf.text('• This investment shows moderate returns.', margin, yPosition);
      yPosition += 7;
      pdf.text('• Consider factors beyond ROI such as passion and aptitude.', margin, yPosition);
      yPosition += 7;
      pdf.text('• Monitor industry trends for better timing of investment.', margin, yPosition);
    }

    // Save the PDF
    pdf.save(`ROI_Analysis_${courseData.courseName || 'Report'}_${new Date().getTime()}.pdf`);
    
    toast({
      title: "Report Generated",
      description: "Your detailed ROI analysis report has been downloaded.",
    });
  };

  const saveAnalysis = () => {
    if (!results) {
      toast({
        title: "No Data Available",
        description: "Please calculate ROI first before saving analysis.",
        variant: "destructive"
      });
      return;
    }

    const analysisId = `analysis_${new Date().getTime()}`;
    const newAnalysis: ComparisonOption = {
      id: analysisId,
      courseName: courseData.courseName || 'Unnamed Course',
      college: courseData.college || 'Unnamed College',
      totalInvestment: results.totalInvestment,
      roiPercentage: results.roiPercentage,
      breakevenYear: results.breakevenYear,
      saved: true
    };

    setSavedAnalyses(prev => [...prev, newAnalysis]);
    
    // Also save to localStorage for persistence
    const existingAnalyses = JSON.parse(localStorage.getItem('roiAnalyses') || '[]');
    existingAnalyses.push(newAnalysis);
    localStorage.setItem('roiAnalyses', JSON.stringify(existingAnalyses));

    toast({
      title: "Analysis Saved",
      description: `ROI analysis for ${newAnalysis.courseName} has been saved for comparison.`,
    });
  };

  const compareWithOthers = () => {
    if (!results) {
      toast({
        title: "No Data Available",
        description: "Please calculate ROI first before comparing.",
        variant: "destructive"
      });
      return;
    }

    // Load saved analyses from localStorage
    const existingAnalyses = JSON.parse(localStorage.getItem('roiAnalyses') || '[]');
    setSavedAnalyses(existingAnalyses);
    
    if (existingAnalyses.length === 0) {
      toast({
        title: "No Saved Analyses",
        description: "Save your current analysis or calculate ROI for other options to start comparing.",
        variant: "destructive"
      });
      return;
    }
    
    setShowComparison(true);

    toast({
      title: "Comparison Mode",
      description: `Comparing with ${existingAnalyses.length} saved analyses.`,
    });
  };

  return (
    <DashboardLayout 
      title="ROI Calculator Pro" 
      description="Advanced cost-benefit analysis with career trajectory predictions"
    >
      <div className="p-6 space-y-8">
        {/* Input Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Education Costs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education Investment
              </CardTitle>
              <CardDescription>Enter your course and college details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="course">Course</Label>
                  <Select value={courseData.courseName} onValueChange={handleCourseSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.name} value={course.name}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="college">College</Label>
                  <Select value={courseData.college} onValueChange={handleCollegeSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select college" />
                    </SelectTrigger>
                    <SelectContent>
                      {colleges.map((college) => (
                        <SelectItem key={college.name} value={college.name}>
                          <div className="flex justify-between w-full">
                            <span>{college.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatCurrency(college.fees)}/year
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Course Duration (years)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={courseData.duration}
                    onChange={(e) => setCourseData({...courseData, duration: Number(e.target.value)})}
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <Label htmlFor="fees">Annual Tuition Fees (₹)</Label>
                  <Input
                    id="fees"
                    type="number"
                    value={courseData.totalFees}
                    onChange={(e) => setCourseData({...courseData, totalFees: Number(e.target.value)})}
                    placeholder="250000"
                  />
                </div>

                <div>
                  <Label htmlFor="living">Annual Living Costs (₹)</Label>
                  <Input
                    id="living"
                    type="number"
                    value={courseData.livingCosts}
                    onChange={(e) => setCourseData({...courseData, livingCosts: Number(e.target.value)})}
                    placeholder="100000"
                  />
                </div>

                <div>
                  <Label htmlFor="other">Other Annual Expenses (₹)</Label>
                  <Input
                    id="other"
                    type="number"
                    value={courseData.otherExpenses}
                    onChange={(e) => setCourseData({...courseData, otherExpenses: Number(e.target.value)})}
                    placeholder="50000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Projections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Career Projections
              </CardTitle>
              <CardDescription>Expected career and salary growth</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="starting-salary">Starting Salary (₹/year)</Label>
                  <Input
                    id="starting-salary"
                    type="number"
                    value={careerData.startingSalary}
                    onChange={(e) => setCareerData({...careerData, startingSalary: Number(e.target.value)})}
                    placeholder="800000"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Annual Salary Growth Rate</Label>
                    <span className="text-sm font-medium">{careerData.salaryGrowthRate[0]}%</span>
                  </div>
                  <Slider
                    value={careerData.salaryGrowthRate}
                    onValueChange={(value) => setCareerData({...careerData, salaryGrowthRate: value})}
                    max={20}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Industry average: 5-12%
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Career Duration (years)</Label>
                    <span className="text-sm font-medium">{careerData.careerDuration[0]} years</span>
                  </div>
                  <Slider
                    value={careerData.careerDuration}
                    onValueChange={(value) => setCareerData({...careerData, careerDuration: value})}
                    max={45}
                    min={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="alternative">Alternative Income (₹/year)</Label>
                  <Input
                    id="alternative"
                    type="number"
                    value={careerData.alternativeIncome}
                    onChange={(e) => setCareerData({...careerData, alternativeIncome: Number(e.target.value)})}
                    placeholder="300000"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Income you could earn during study years
                  </div>
                </div>
              </div>

              <Button onClick={calculateROI} className="w-full btn-primary">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate ROI
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">ROI Analysis Results</h2>
              <Badge className={getROIRating(results.roiPercentage).bg + " " + getROIRating(results.roiPercentage).color}>
                {getROIRating(results.roiPercentage).label} ROI
              </Badge>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="feature-card">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {results.roiRatio.toFixed(1)}x
                  </div>
                  <div className="text-sm text-muted-foreground">ROI Multiple</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {results.roiPercentage.toFixed(0)}% return
                  </div>
                </CardContent>
              </Card>

              <Card className="feature-card">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(results.netReturn)}
                  </div>
                  <div className="text-sm text-muted-foreground">Net Return</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Lifetime earnings minus investment
                  </div>
                </CardContent>
              </Card>

              <Card className="feature-card">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {results.breakevenYear} years
                  </div>
                  <div className="text-sm text-muted-foreground">Breakeven Period</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Time to recover investment
                  </div>
                </CardContent>
              </Card>

              <Card className="feature-card">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(results.monthlyROI)}
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly ROI</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Average monthly return
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Education Costs</span>
                    <span className="font-semibold">{formatCurrency(results.educationCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Opportunity Cost</span>
                    <span className="font-semibold">{formatCurrency(results.opportunityCost)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Investment</span>
                      <span>{formatCurrency(results.totalInvestment)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Education Costs</span>
                      <span>{((results.educationCost / results.totalInvestment) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={(results.educationCost / results.totalInvestment) * 100} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Opportunity Costs</span>
                      <span>{((results.opportunityCost / results.totalInvestment) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={(results.opportunityCost / results.totalInvestment) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Returns Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Lifetime Earnings</span>
                    <span className="font-semibold">{formatCurrency(results.totalEarnings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Investment</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(results.totalInvestment)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Net Profit</span>
                      <span className={results.netReturn > 0 ? "text-green-600" : "text-red-600"}>
                        {formatCurrency(results.netReturn)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 mt-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">ROI Percentage</div>
                      <div className={`text-3xl font-bold ${getROIRating(results.roiPercentage).color}`}>
                        {results.roiPercentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Every ₹1 invested returns ₹{(1 + results.roiRatio).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.roiPercentage > 400 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                        <Badge className="bg-green-100 text-green-800">Excellent Choice</Badge>
                      </div>
                      <p className="text-sm text-green-700">
                        This investment shows excellent returns. The high ROI indicates strong career prospects and market demand.
                      </p>
                    </div>
                  )}
                  
                  {results.roiPercentage < 150 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800 font-medium mb-2">
                        <Badge className="bg-yellow-100 text-yellow-800">Consider Alternatives</Badge>
                      </div>
                      <p className="text-sm text-yellow-700">
                        The ROI is below industry standards. Consider exploring other courses or colleges with better placement records.
                      </p>
                    </div>
                  )}
                  
                  {results.breakevenYear > 8 && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2 text-orange-800 font-medium mb-2">
                        <Badge className="bg-orange-100 text-orange-800">Long Payback Period</Badge>
                      </div>
                      <p className="text-sm text-orange-700">
                        It will take {results.breakevenYear} years to recover your investment. Consider courses with faster career progression.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex gap-4">
                  <Button onClick={generateDetailedReport}>
                    <Download className="w-4 h-4 mr-2" />
                    Generate Detailed Report
                  </Button>
                  <Button variant="outline" onClick={compareWithOthers}>
                    <GitCompare className="w-4 h-4 mr-2" />
                    Compare with Other Options
                    {savedAnalyses.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {savedAnalyses.length}
                      </Badge>
                    )}
                  </Button>
                  <Button variant="outline" onClick={saveAnalysis}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Comparison View */}
        {showComparison && savedAnalyses.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <GitCompare className="w-5 h-5" />
                  ROI Comparison Analysis
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowComparison(false)}>
                  Close Comparison
                </Button>
              </div>
              <CardDescription>
                Compare your current analysis with previously saved analyses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Current Analysis Card */}
              {results && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-primary">Current Analysis</h4>
                  <Card className="border-2 border-primary/30 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <div className="font-medium">{courseData.courseName || 'Current Course'}</div>
                          <div className="text-muted-foreground">{courseData.college || 'Current College'}</div>
                        </div>
                        <div>
                          <div className="font-medium">Investment</div>
                          <div className="text-muted-foreground">{formatCurrency(results.totalInvestment)}</div>
                        </div>
                        <div>
                          <div className="font-medium">ROI</div>
                          <div className={`font-semibold ${getROIRating(results.roiPercentage).color}`}>
                            {results.roiPercentage.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Breakeven</div>
                          <div className="text-muted-foreground">{results.breakevenYear} years</div>
                        </div>
                        <div>
                          <div className="font-medium">Rating</div>
                          <Badge className={`${getROIRating(results.roiPercentage).bg} ${getROIRating(results.roiPercentage).color}`}>
                            {getROIRating(results.roiPercentage).label}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Saved Analyses */}
              <div>
                <h4 className="font-semibold mb-3">Saved Analyses</h4>
                <div className="space-y-3">
                  {savedAnalyses.map((analysis) => (
                    <Card key={analysis.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                          <div>
                            <div className="font-medium">{analysis.courseName}</div>
                            <div className="text-muted-foreground">{analysis.college}</div>
                          </div>
                          <div>
                            <div className="font-medium">Investment</div>
                            <div className="text-muted-foreground">{formatCurrency(analysis.totalInvestment)}</div>
                          </div>
                          <div>
                            <div className="font-medium">ROI</div>
                            <div className={`font-semibold ${getROIRating(analysis.roiPercentage).color}`}>
                              {analysis.roiPercentage.toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">Breakeven</div>
                            <div className="text-muted-foreground">{analysis.breakevenYear} years</div>
                          </div>
                          <div>
                            <div className="font-medium">Rating</div>
                            <Badge className={`${getROIRating(analysis.roiPercentage).bg} ${getROIRating(analysis.roiPercentage).color}`}>
                              {getROIRating(analysis.roiPercentage).label}
                            </Badge>
                          </div>
                          <div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                const updatedAnalyses = savedAnalyses.filter(a => a.id !== analysis.id);
                                setSavedAnalyses(updatedAnalyses);
                                localStorage.setItem('roiAnalyses', JSON.stringify(updatedAnalyses));
                                toast({
                                  title: "Analysis Deleted",
                                  description: "Saved analysis has been removed.",
                                });
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {savedAnalyses.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <GitCompare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No saved analyses found. Save your current analysis to start comparing options.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ROICalculator;
