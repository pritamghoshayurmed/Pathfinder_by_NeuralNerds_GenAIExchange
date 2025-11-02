import { useState } from "react";
import { FileText, Plus, Calendar, CheckCircle, Clock, AlertTriangle, Filter, Search, Upload, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DashboardLayout from "@/components/DashboardLayout";

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      college: "IIT Delhi",
      course: "Computer Science Engineering",
      applicationId: "IITD2024CSE001",
      submissionDate: "2024-12-15",
      deadline: "2024-12-30",
      status: "Under Review",
      stage: "Document Verification",
      fees: 250000,
      priority: "High",
      documents: {
        submitted: ["Academic Transcripts", "SOP", "LOR", "Application Form"],
        pending: ["Medical Certificate"],
        verified: ["Academic Transcripts", "Application Form"]
      },
      timeline: [
        { stage: "Application Submitted", date: "2024-12-15", completed: true },
        { stage: "Document Verification", date: "2024-12-18", completed: true },
        { stage: "Entrance Test", date: "2025-01-05", completed: false },
        { stage: "Interview", date: "2025-01-15", completed: false },
        { stage: "Final Result", date: "2025-01-25", completed: false }
      ],
      counselor: {
        name: "Dr. Rajesh Kumar",
        email: "rajesh.kumar@iitd.ac.in",
        phone: "+91-11-2659-1234"
      },
      notes: "Strong application, good academic record. Focus on technical interview preparation."
    },
    {
      id: 2,
      college: "BITS Pilani",
      course: "Electronics Engineering",
      applicationId: "BITS2024ECE002",
      submissionDate: "2024-12-10",
      deadline: "2024-12-25",
      status: "Accepted",
      stage: "Admission Confirmed",
      fees: 450000,
      priority: "Medium",
      documents: {
        submitted: ["Academic Transcripts", "SOP", "Application Form", "Fee Receipt"],
        pending: [],
        verified: ["Academic Transcripts", "SOP", "Application Form", "Fee Receipt"]
      },
      timeline: [
        { stage: "Application Submitted", date: "2024-12-10", completed: true },
        { stage: "Document Verification", date: "2024-12-12", completed: true },
        { stage: "Entrance Test", date: "2024-12-20", completed: true },
        { stage: "Interview", date: "2024-12-22", completed: true },
        { stage: "Final Result", date: "2024-12-24", completed: true }
      ],
      counselor: {
        name: "Prof. Priya Sharma",
        email: "priya.sharma@bits-pilani.ac.in",
        phone: "+91-1596-242-200"
      },
      notes: "Admission confirmed! Need to pay first semester fees by Jan 10, 2025."
    },
    {
      id: 3,
      college: "NIT Trichy",
      course: "Mechanical Engineering",
      applicationId: "NITT2024ME003",
      submissionDate: "2024-12-20",
      deadline: "2025-01-15",
      status: "In Progress",
      stage: "Application Submitted",
      fees: 180000,
      priority: "Low",
      documents: {
        submitted: ["Academic Transcripts", "Application Form"],
        pending: ["SOP", "LOR", "Caste Certificate"],
        verified: ["Academic Transcripts"]
      },
      timeline: [
        { stage: "Application Submitted", date: "2024-12-20", completed: true },
        { stage: "Document Verification", date: "2024-12-25", completed: false },
        { stage: "Entrance Test", date: "2025-01-10", completed: false },
        { stage: "Interview", date: "2025-01-18", completed: false },
        { stage: "Final Result", date: "2025-01-30", completed: false }
      ],
      counselor: {
        name: "Dr. Ramesh Babu",
        email: "ramesh.babu@nitt.edu",
        phone: "+91-431-250-3000"
      },
      notes: "Backup option. Complete document submission by Dec 25."
    }
  ]);

  const [newApplication, setNewApplication] = useState({
    college: "",
    course: "",
    deadline: "",
    priority: "Medium",
    notes: ""
  });

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    college: ""
  });

  const [searchTerm, setSearchTerm] = useState("");

  const statusColors = {
    "In Progress": "bg-blue-100 text-blue-800",
    "Under Review": "bg-yellow-100 text-yellow-800",
    "Accepted": "bg-green-100 text-green-800",
    "Rejected": "bg-red-100 text-red-800",
    "Waitlisted": "bg-purple-100 text-purple-800"
  };

  const priorityColors = {
    "High": "bg-red-100 text-red-800",
    "Medium": "bg-yellow-100 text-yellow-800",
    "Low": "bg-green-100 text-green-800"
  };

  const getCompletionPercentage = (timeline: any[]) => {
    const completed = timeline.filter(stage => stage.completed).length;
    return (completed / timeline.length) * 100;
  };

  const getUpcomingDeadlines = () => {
    const now = new Date();
    const upcoming = applications.filter(app => {
      const deadline = new Date(app.deadline);
      const timeDiff = deadline.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff <= 7 && daysDiff > 0;
    });
    return upcoming;
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicationId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === "" || filters.status === "all-status" || app.status === filters.status;
    const matchesPriority = filters.priority === "" || filters.priority === "all-priorities" || app.priority === filters.priority;
    const matchesCollege = filters.college === "" || filters.college === "all-colleges" || app.college === filters.college;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCollege;
  });

  const addApplication = () => {
    if (newApplication.college && newApplication.course) {
      const application = {
        id: applications.length + 1,
        ...newApplication,
        applicationId: `${newApplication.college.replace(/\s+/g, '').toUpperCase()}2024${Date.now()}`,
        submissionDate: new Date().toISOString().split('T')[0],
        status: "In Progress",
        stage: "Application Submitted",
        fees: 200000,
        documents: {
          submitted: [],
          pending: ["Academic Transcripts", "SOP", "LOR", "Application Form"],
          verified: []
        },
        timeline: [
          { stage: "Application Submitted", date: new Date().toISOString().split('T')[0], completed: true },
          { stage: "Document Verification", date: "", completed: false },
          { stage: "Entrance Test", date: "", completed: false },
          { stage: "Interview", date: "", completed: false },
          { stage: "Final Result", date: "", completed: false }
        ],
        counselor: {
          name: "TBD",
          email: "",
          phone: ""
        }
      };
      setApplications([...applications, application]);
      setNewApplication({
        college: "",
        course: "",
        deadline: "",
        priority: "Medium",
        notes: ""
      });
    }
  };

  const updateApplicationStatus = (id: number, newStatus: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  const upcomingDeadlines = getUpcomingDeadlines();

  return (
    <DashboardLayout 
      title="Application Tracker" 
      description="Track and manage your college applications, deadlines, and documents"
    >
      <div className="p-6 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="feature-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {applications.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Applications</div>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === "Accepted").length}
              </div>
              <div className="text-sm text-muted-foreground">Accepted</div>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter(app => app.status === "Under Review" || app.status === "In Progress").length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">
                {upcomingDeadlines.length}
              </div>
              <div className="text-sm text-muted-foreground">Urgent Deadlines</div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Deadlines Alert */}
        {upcomingDeadlines.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                Urgent Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingDeadlines.map((app) => (
                  <div key={app.id} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <div>
                      <span className="font-medium">{app.college}</span>
                      <span className="text-muted-foreground"> - {app.course}</span>
                    </div>
                    <Badge className="bg-red-100 text-red-800">
                      Due: {app.deadline}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by college, course, or application ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="btn-secondary">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Application
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Application</DialogTitle>
                      <DialogDescription>
                        Add a new college application to track
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="college">College Name</Label>
                        <Input
                          id="college"
                          value={newApplication.college}
                          onChange={(e) => setNewApplication({...newApplication, college: e.target.value})}
                          placeholder="e.g., IIT Bombay"
                        />
                      </div>
                      <div>
                        <Label htmlFor="course">Course</Label>
                        <Input
                          id="course"
                          value={newApplication.course}
                          onChange={(e) => setNewApplication({...newApplication, course: e.target.value})}
                          placeholder="e.g., Computer Science Engineering"
                        />
                      </div>
                      <div>
                        <Label htmlFor="deadline">Application Deadline</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={newApplication.deadline}
                          onChange={(e) => setNewApplication({...newApplication, deadline: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={newApplication.priority} onValueChange={(value) => setNewApplication({...newApplication, priority: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={newApplication.notes}
                          onChange={(e) => setNewApplication({...newApplication, notes: e.target.value})}
                          placeholder="Any additional notes..."
                        />
                      </div>
                      <Button onClick={addApplication} className="w-full">
                        Add Application
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Waitlisted">Waitlisted</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.priority} onValueChange={(value) => setFilters({...filters, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-priorities">All Priorities</SelectItem>
                    <SelectItem value="High">High Priority</SelectItem>
                    <SelectItem value="Medium">Medium Priority</SelectItem>
                    <SelectItem value="Low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.college} onValueChange={(value) => setFilters({...filters, college: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="College" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-colleges">All Colleges</SelectItem>
                    {Array.from(new Set(applications.map(app => app.college))).map((college) => (
                      <SelectItem key={college} value={college}>{college}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Applications</h2>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-6">
              {filteredApplications.map((app) => (
                <Card key={app.id} className="feature-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{app.college}</CardTitle>
                          <Badge className={statusColors[app.status as keyof typeof statusColors]}>
                            {app.status}
                          </Badge>
                          <Badge className={priorityColors[app.priority as keyof typeof priorityColors]}>
                            {app.priority} Priority
                          </Badge>
                        </div>
                        <CardDescription>
                          {app.course} • Application ID: {app.applicationId}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Annual Fees</div>
                        <div className="text-lg font-semibold">₹{app.fees.toLocaleString()}</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Submission Date</div>
                        <div className="font-medium">{app.submissionDate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Deadline</div>
                        <div className="font-medium">{app.deadline}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Current Stage</div>
                        <div className="font-medium">{app.stage}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Application Progress</span>
                        <span>{getCompletionPercentage(app.timeline).toFixed(0)}%</span>
                      </div>
                      <Progress value={getCompletionPercentage(app.timeline)} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Document Status</div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Submitted: {app.documents.submitted.length}</span>
                            <span>Pending: {app.documents.pending.length}</span>
                          </div>
                          <Progress 
                            value={(app.documents.submitted.length / (app.documents.submitted.length + app.documents.pending.length)) * 100} 
                            className="h-1" 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Counselor Contact</div>
                        <div className="text-sm">
                          <div className="font-medium">{app.counselor.name}</div>
                          <div className="text-muted-foreground">{app.counselor.email}</div>
                        </div>
                      </div>
                    </div>
                    
                    {app.notes && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Notes</div>
                        <div className="text-sm bg-gray-50 p-3 rounded-lg">{app.notes}</div>
                      </div>
                    )}
                    
                    <div className="flex gap-4 pt-4 border-t">
                      <Button size="sm" className="btn-secondary">
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Form
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        College Portal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-4 mt-6">
              {filteredApplications.map((app) => (
                <Card key={app.id} className="feature-card">
                  <CardHeader>
                    <CardTitle>{app.college} - Documents</CardTitle>
                    <CardDescription>{app.course}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">✓ Submitted ({app.documents.submitted.length})</h4>
                        <div className="space-y-1">
                          {app.documents.submitted.map((doc, index) => (
                            <div key={index} className="text-sm p-2 bg-green-50 rounded border-l-2 border-green-200">
                              {doc}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-yellow-600 mb-2">○ Pending ({app.documents.pending.length})</h4>
                        <div className="space-y-1">
                          {app.documents.pending.map((doc, index) => (
                            <div key={index} className="text-sm p-2 bg-yellow-50 rounded border-l-2 border-yellow-200">
                              {doc}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-blue-600 mb-2">✓ Verified ({app.documents.verified.length})</h4>
                        <div className="space-y-1">
                          {app.documents.verified.map((doc, index) => (
                            <div key={index} className="text-sm p-2 bg-blue-50 rounded border-l-2 border-blue-200">
                              {doc}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="timeline" className="space-y-4 mt-6">
              {filteredApplications.map((app) => (
                <Card key={app.id} className="feature-card">
                  <CardHeader>
                    <CardTitle>{app.college} - Timeline</CardTitle>
                    <CardDescription>{app.course}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {app.timeline.map((stage, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            stage.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {stage.completed ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{stage.stage}</div>
                            <div className="text-sm text-muted-foreground">
                              {stage.date || 'Date TBD'}
                            </div>
                          </div>
                          <div>
                            {stage.completed && (
                              <Badge className="bg-green-100 text-green-800">Completed</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {filteredApplications.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
              <p className="text-muted-foreground">
                Start by adding your college applications to track their progress
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ApplicationTracker;
