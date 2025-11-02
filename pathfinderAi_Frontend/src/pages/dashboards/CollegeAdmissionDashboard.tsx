import { GraduationCap, Calculator, Target, DollarSign, BookOpen, Award, TrendingUp, Star, AlertCircle, CheckCircle2, Clock, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";

const CollegeAdmissionDashboard = () => {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      title: "College Comparison Tool",
      description: "AI-powered college analysis with placement data, fees, and ROI calculations",
      icon: Target,
      color: "from-blue-500/20 to-purple-500/20",
      action: "Compare Colleges",
      progress: 85,
      status: "Active",
      path: "/dashboard/college-admission/compare"
    },
    {
      title: "Branch Selection AI",
      description: "Smart matching for Engineering, Medical, Commerce specialties based on interests",
      icon: GraduationCap,
      color: "from-green-500/20 to-teal-500/20",
      action: "Find Matches",
      progress: 70,
      status: "Popular",
      path: "/dashboard/college-admission/matcher"
    },
    {
      title: "ROI Calculator Pro",
      description: "Advanced cost-benefit analysis with career trajectory predictions",
      icon: Calculator,
      color: "from-orange-500/20 to-red-500/20",
      action: "Calculate ROI",
      progress: 60,
      status: "Updated",
      path: "/dashboard/college-admission/roi"
    },
    {
      title: "Scholarship Finder",
      description: "Government schemes, private funding, and education loan optimization",
      icon: DollarSign,
      color: "from-purple-500/20 to-pink-500/20",
      action: "Find Funding",
      progress: 45,
      status: "New",
      path: "/dashboard/college-admission/scholarships"
    }
  ];

  const collegeShortlist = [
    { name: "IIT Delhi", branch: "Computer Science", rank: "#1", fees: "₹2.5L/year", placement: "₹25L avg", roi: "8.5x", status: "applied" },
    { name: "BITS Pilani", branch: "Electronics", rank: "#8", fees: "₹4.5L/year", placement: "₹18L avg", roi: "5.2x", status: "shortlisted" },
    { name: "IIIT Bangalore", branch: "Information Technology", rank: "#12", fees: "₹3.2L/year", placement: "₹22L avg", roi: "6.8x", status: "applied" },
    { name: "VIT Vellore", branch: "Computer Science", rank: "#18", fees: "₹2.8L/year", placement: "₹12L avg", roi: "4.1x", status: "pending" }
  ];

  const recentUpdates = [
    { title: "New Scholarship Available", amount: "₹50K", type: "Merit-based", priority: "high" },
    { title: "Placement Data Updated", college: "IIIT Hyderabad", change: "+12%", priority: "medium" },
    { title: "Fee Structure Change", college: "VIT", impact: "Reduced by 8%", priority: "low" }
  ];

  return (
    <DashboardLayout 
      title="College Admission Hub" 
      description="Strategic guidance for your higher education journey"
    >
      <div className="p-6 space-y-8">
        {/* Performance Overview */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Your Admission Dashboard 🎯</h2>
                <p className="text-muted-foreground">Smart college selection and application tracking</p>
              </div>
            </div>
            <Badge className="bg-primary/20 text-primary">
              4 Active Applications
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">18</div>
              <div className="text-sm text-muted-foreground">Colleges Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">₹45L</div>
              <div className="text-sm text-muted-foreground">Scholarships Found</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">8.5x</div>
              <div className="text-sm text-muted-foreground">Best ROI Option</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">85%</div>
              <div className="text-sm text-muted-foreground">Profile Match Score</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* College Shortlist */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Your Shortlisted Colleges</h3>
              <div className="space-y-4">
                {collegeShortlist.map((college, index) => (
                  <Card key={index} className="feature-card">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        <div>
                          <div className="font-semibold text-lg">{college.name}</div>
                          <div className="text-muted-foreground text-sm">{college.branch}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">NIRF Rank</div>
                          <div className="font-semibold">{college.rank}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Annual Fees</div>
                          <div className="font-semibold">{college.fees}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Avg Package</div>
                          <div className="font-semibold text-primary">{college.placement}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">ROI</div>
                          <div className="font-semibold text-secondary">{college.roi}</div>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant={college.status === 'applied' ? 'default' : college.status === 'shortlisted' ? 'secondary' : 'outline'} className="text-xs">
                            {college.status}
                          </Badge>
                          <Button size="sm" className="btn-secondary">Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Strategic Tools */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Strategic Tools</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {mainFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card key={index} className="feature-card group hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <Badge variant={feature.status === "Active" ? "default" : feature.status === "Popular" ? "secondary" : "outline"}>
                            {feature.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <CardDescription className="text-muted-foreground text-sm">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Usage</span>
                            <span>{feature.progress}%</span>
                          </div>
                          <Progress value={feature.progress} className="h-2" />
                          <Button 
                            className="w-full btn-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            onClick={() => navigate(feature.path)}
                          >
                            {feature.action}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Updates */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUpdates.map((update, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Star className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{update.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {update.amount && `Worth: ${update.amount}`}
                          {update.college && `${update.college}: ${update.change}`}
                          {update.impact && `${update.college}: ${update.impact}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full btn-secondary text-left justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Schedule Counselor Call
                  </Button>
                  <Button className="w-full btn-secondary text-left justify-start">
                    <Trophy className="w-4 h-4 mr-2" />
                    Check Scholarship Status
                  </Button>
                  <Button className="w-full btn-secondary text-left justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Download Brochures
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CollegeAdmissionDashboard;