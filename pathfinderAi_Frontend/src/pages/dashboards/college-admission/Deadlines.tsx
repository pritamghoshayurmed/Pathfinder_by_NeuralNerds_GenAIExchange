import { useState } from "react";
import { Calendar, Clock, AlertTriangle, CheckCircle, Plus, Filter, Bell, BookOpen, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import DashboardLayout from "@/components/DashboardLayout";

const Deadlines = () => {
  const [deadlines, setDeadlines] = useState([
    {
      id: 1,
      title: "IIT JEE Advanced Registration",
      type: "Exam Registration",
      date: "2024-12-30",
      time: "23:59",
      priority: "Critical",
      status: "Upcoming",
      description: "Last date for JEE Advanced 2025 registration",
      college: "IITs",
      course: "Engineering",
      requirements: ["Class 12 marksheet", "JEE Main scorecard", "Category certificate"],
      fees: "₹2,800",
      reminderSet: true,
      reminderTime: "1 day before",
      completionChecklist: [
        { task: "Prepare documents", completed: true },
        { task: "Arrange fee payment", completed: true },
        { task: "Complete online form", completed: false },
        { task: "Submit application", completed: false }
      ],
      link: "https://jeeadv.ac.in",
      notes: "Registration closes at 11:59 PM. Keep backup payment methods ready."
    },
    {
      id: 2,
      title: "NEET Application Form",
      type: "Exam Registration",
      date: "2024-12-28",
      time: "17:00",
      priority: "Critical",
      status: "Upcoming",
      description: "NEET-UG 2025 application form submission deadline",
      college: "Medical Colleges",
      course: "MBBS/BDS",
      requirements: ["Class 12 marksheet", "Photo", "Signature", "Category certificate"],
      fees: "₹1,600",
      reminderSet: true,
      reminderTime: "2 days before",
      completionChecklist: [
        { task: "Gather documents", completed: true },
        { task: "Take passport photo", completed: true },
        { task: "Fill application", completed: false },
        { task: "Pay fees", completed: false }
      ],
      link: "https://neet.nta.nic.in",
      notes: "Application correction window will be available later."
    },
    {
      id: 3,
      title: "BITS Admission Form",
      type: "College Application",
      date: "2025-01-10",
      time: "23:59",
      priority: "High",
      status: "Upcoming",
      description: "BITS Pilani admission form submission deadline",
      college: "BITS Pilani",
      course: "Engineering",
      requirements: ["Class 12 marksheet", "BITSAT scorecard", "Medical certificate"],
      fees: "₹3,400",
      reminderSet: true,
      reminderTime: "3 days before",
      completionChecklist: [
        { task: "BITSAT registration", completed: true },
        { task: "Document preparation", completed: false },
        { task: "Form filling", completed: false },
        { task: "Fee payment", completed: false }
      ],
      link: "https://www.bitsadmission.com",
      notes: "BITSAT score required for admission form."
    },
    {
      id: 4,
      title: "State Counselling Registration",
      type: "Counselling",
      date: "2025-02-01",
      time: "18:00",
      priority: "Medium",
      status: "Upcoming",
      description: "State engineering counselling registration",
      college: "State Engineering Colleges",
      course: "Engineering",
      requirements: ["JEE Main scorecard", "Domicile certificate", "Class 12 marksheet"],
      fees: "₹1,000",
      reminderSet: false,
      reminderTime: "1 week before",
      completionChecklist: [
        { task: "Check eligibility", completed: true },
        { task: "Prepare documents", completed: false },
        { task: "Online registration", completed: false },
        { task: "Document verification", completed: false }
      ],
      link: "https://statecouncelling.gov.in",
      notes: "Keep multiple college preferences ready."
    },
    {
      id: 5,
      title: "Scholarship Application",
      type: "Scholarship",
      date: "2025-01-15",
      time: "23:59",
      priority: "Medium",
      status: "Upcoming",
      description: "National Merit Scholarship application deadline",
      college: "All Eligible Colleges",
      course: "All Streams",
      requirements: ["Income certificate", "Merit certificate", "Bank details"],
      fees: "Free",
      reminderSet: true,
      reminderTime: "1 week before",
      completionChecklist: [
        { task: "Income certificate", completed: true },
        { task: "Merit certificate", completed: true },
        { task: "Bank account opening", completed: false },
        { task: "Online application", completed: false }
      ],
      link: "https://scholarships.gov.in",
      notes: "Merit-based scholarship for economically weaker sections."
    },
    {
      id: 6,
      title: "Document Submission - IIT Delhi",
      type: "Document Submission",
      date: "2024-12-25",
      time: "17:00",
      priority: "High",
      status: "Overdue",
      description: "Physical document submission for IIT Delhi admission",
      college: "IIT Delhi",
      course: "Computer Science",
      requirements: ["Original certificates", "Attested copies", "Medical certificate"],
      fees: "₹500",
      reminderSet: true,
      reminderTime: "1 day before",
      completionChecklist: [
        { task: "Arrange documents", completed: true },
        { task: "Get attestation", completed: true },
        { task: "Book appointment", completed: false },
        { task: "Submit documents", completed: false }
      ],
      link: "https://iitd.ac.in",
      notes: "URGENT: Already overdue! Contact admission office immediately."
    }
  ]);

  const [newDeadline, setNewDeadline] = useState({
    title: "",
    type: "Exam Registration",
    date: "",
    time: "",
    priority: "Medium",
    description: "",
    college: "",
    course: "",
    fees: "",
    link: "",
    notes: ""
  });

  const [filters, setFilters] = useState({
    type: "",
    priority: "",
    status: "",
    college: ""
  });

  const [searchTerm, setSearchTerm] = useState("");

  const getStatusInfo = (date: string, time: string) => {
    const now = new Date();
    const deadlineDateTime = new Date(`${date}T${time}`);
    const timeDiff = deadlineDateTime.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const hoursDiff = Math.ceil(timeDiff / (1000 * 3600));

    if (timeDiff < 0) {
      return { status: "Overdue", color: "bg-red-100 text-red-800", urgency: "overdue" };
    } else if (daysDiff <= 1) {
      return { status: "Critical", color: "bg-red-100 text-red-800", urgency: "critical" };
    } else if (daysDiff <= 3) {
      return { status: "Urgent", color: "bg-orange-100 text-orange-800", urgency: "urgent" };
    } else if (daysDiff <= 7) {
      return { status: "Upcoming", color: "bg-yellow-100 text-yellow-800", urgency: "upcoming" };
    } else {
      return { status: "Future", color: "bg-blue-100 text-blue-800", urgency: "future" };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-500 text-white";
      case "High": return "bg-orange-500 text-white";
      case "Medium": return "bg-yellow-500 text-white";
      case "Low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getTimeRemaining = (date: string, time: string) => {
    const now = new Date();
    const deadlineDateTime = new Date(`${date}T${time}`);
    const timeDiff = deadlineDateTime.getTime() - now.getTime();

    if (timeDiff < 0) {
      return "Overdue";
    }

    const days = Math.floor(timeDiff / (1000 * 3600 * 24));
    const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const filteredDeadlines = deadlines.filter(deadline => {
    const matchesSearch = deadline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deadline.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deadline.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filters.type === "" || filters.type === "all-types" || deadline.type === filters.type;
    const matchesPriority = filters.priority === "" || filters.priority === "all-priorities" || deadline.priority === filters.priority;
    const matchesCollege = filters.college === "" || filters.college === "all-institutions" || deadline.college === filters.college;
    
    const statusInfo = getStatusInfo(deadline.date, deadline.time);
    const matchesStatus = filters.status === "" || filters.status === "all-status" || statusInfo.urgency === filters.status;
    
    return matchesSearch && matchesType && matchesPriority && matchesCollege && matchesStatus;
  });

  const addDeadline = () => {
    if (newDeadline.title && newDeadline.date && newDeadline.time) {
      const deadline = {
        id: deadlines.length + 1,
        ...newDeadline,
        status: "Upcoming",
        reminderSet: false,
        reminderTime: "1 day before",
        requirements: [],
        completionChecklist: [
          { task: "Prepare documents", completed: false },
          { task: "Complete application", completed: false },
          { task: "Submit on time", completed: false }
        ]
      };
      setDeadlines([...deadlines, deadline]);
      setNewDeadline({
        title: "",
        type: "Exam Registration",
        date: "",
        time: "",
        priority: "Medium",
        description: "",
        college: "",
        course: "",
        fees: "",
        link: "",
        notes: ""
      });
    }
  };

  const toggleReminder = (id: number) => {
    setDeadlines(deadlines.map(deadline => 
      deadline.id === id ? { ...deadline, reminderSet: !deadline.reminderSet } : deadline
    ));
  };

  const updateChecklistItem = (deadlineId: number, taskIndex: number) => {
    setDeadlines(deadlines.map(deadline => 
      deadline.id === deadlineId 
        ? {
            ...deadline,
            completionChecklist: deadline.completionChecklist.map((item, index) =>
              index === taskIndex ? { ...item, completed: !item.completed } : item
            )
          }
        : deadline
    ));
  };

  const criticalDeadlines = deadlines.filter(d => {
    const statusInfo = getStatusInfo(d.date, d.time);
    return statusInfo.urgency === "critical" || statusInfo.urgency === "overdue";
  });

  const upcomingDeadlines = deadlines.filter(d => {
    const statusInfo = getStatusInfo(d.date, d.time);
    return statusInfo.urgency === "urgent" || statusInfo.urgency === "upcoming";
  });

  return (
    <DashboardLayout 
      title="Deadlines Manager" 
      description="Track important dates, deadlines, and submission requirements"
    >
      <div className="p-6 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="feature-card border-red-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">
                {criticalDeadlines.length}
              </div>
              <div className="text-sm text-muted-foreground">Critical/Overdue</div>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {upcomingDeadlines.length}
              </div>
              <div className="text-sm text-muted-foreground">Upcoming</div>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {deadlines.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Deadlines</div>
            </CardContent>
          </Card>

          <Card className="feature-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {deadlines.filter(d => d.reminderSet).length}
              </div>
              <div className="text-sm text-muted-foreground">Reminders Set</div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        {criticalDeadlines.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                Critical Deadlines - Immediate Action Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalDeadlines.map((deadline) => {
                  const statusInfo = getStatusInfo(deadline.date, deadline.time);
                  return (
                    <div key={deadline.id} className="flex justify-between items-center p-4 bg-white rounded-lg border border-red-600">
                      <div>
                        <div className="font-medium text-red-800">{deadline.title}</div>
                        <div className="text-sm text-red-600">{deadline.college} - {deadline.course}</div>
                        <div className="text-xs text-red-500 mt-1">
                          {statusInfo.urgency === "overdue" ? "OVERDUE" : `Due in ${getTimeRemaining(deadline.date, deadline.time)}`}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-red-500 text-white">
                          {deadline.date} at {deadline.time}
                        </Badge>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Take Action
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search deadlines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="btn-secondary">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Deadline
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Deadline</DialogTitle>
                      <DialogDescription>
                        Add a new important deadline to track
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newDeadline.title}
                          onChange={(e) => setNewDeadline({...newDeadline, title: e.target.value})}
                          placeholder="e.g., JEE Main Registration"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select value={newDeadline.type} onValueChange={(value) => setNewDeadline({...newDeadline, type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Exam Registration">Exam Registration</SelectItem>
                            <SelectItem value="College Application">College Application</SelectItem>
                            <SelectItem value="Document Submission">Document Submission</SelectItem>
                            <SelectItem value="Counselling">Counselling</SelectItem>
                            <SelectItem value="Scholarship">Scholarship</SelectItem>
                            <SelectItem value="Interview">Interview</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newDeadline.date}
                          onChange={(e) => setNewDeadline({...newDeadline, date: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={newDeadline.time}
                          onChange={(e) => setNewDeadline({...newDeadline, time: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="college">College/Institution</Label>
                        <Input
                          id="college"
                          value={newDeadline.college}
                          onChange={(e) => setNewDeadline({...newDeadline, college: e.target.value})}
                          placeholder="e.g., IIT Delhi"
                        />
                      </div>
                      <div>
                        <Label htmlFor="course">Course</Label>
                        <Input
                          id="course"
                          value={newDeadline.course}
                          onChange={(e) => setNewDeadline({...newDeadline, course: e.target.value})}
                          placeholder="e.g., Computer Science"
                        />
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={newDeadline.priority} onValueChange={(value) => setNewDeadline({...newDeadline, priority: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Critical">Critical</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="fees">Fees</Label>
                        <Input
                          id="fees"
                          value={newDeadline.fees}
                          onChange={(e) => setNewDeadline({...newDeadline, fees: e.target.value})}
                          placeholder="e.g., ₹2,800"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newDeadline.description}
                          onChange={(e) => setNewDeadline({...newDeadline, description: e.target.value})}
                          placeholder="Brief description of the deadline"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="link">Official Link</Label>
                        <Input
                          id="link"
                          value={newDeadline.link}
                          onChange={(e) => setNewDeadline({...newDeadline, link: e.target.value})}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <Button onClick={addDeadline} className="w-full mt-4">
                      Add Deadline
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">All Types</SelectItem>
                    <SelectItem value="Exam Registration">Exam Registration</SelectItem>
                    <SelectItem value="College Application">College Application</SelectItem>
                    <SelectItem value="Document Submission">Document Submission</SelectItem>
                    <SelectItem value="Counselling">Counselling</SelectItem>
                    <SelectItem value="Scholarship">Scholarship</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.priority} onValueChange={(value) => setFilters({...filters, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-priorities">All Priorities</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="future">Future</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.college} onValueChange={(value) => setFilters({...filters, college: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Institution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-institutions">All Institutions</SelectItem>
                    {Array.from(new Set(deadlines.map(d => d.college))).map((college) => (
                      <SelectItem key={college} value={college}>{college}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deadlines List */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Deadlines ({filteredDeadlines.length})</TabsTrigger>
            <TabsTrigger value="critical">Critical ({criticalDeadlines.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingDeadlines.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-6">
            {filteredDeadlines.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()).map((deadline) => {
              const statusInfo = getStatusInfo(deadline.date, deadline.time);
              const completedTasks = deadline.completionChecklist.filter(task => task.completed).length;
              const totalTasks = deadline.completionChecklist.length;
              const completionPercentage = (completedTasks / totalTasks) * 100;
              
              return (
                <Card key={deadline.id} className={`feature-card ${statusInfo.urgency === 'overdue' ? 'border-red-300' : statusInfo.urgency === 'critical' ? 'border-orange-300' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{deadline.title}</CardTitle>
                          <Badge className={statusInfo.color}>
                            {statusInfo.status}
                          </Badge>
                          <Badge className={getPriorityColor(deadline.priority)}>
                            {deadline.priority}
                          </Badge>
                          <Badge variant="outline">{deadline.type}</Badge>
                        </div>
                        <CardDescription>
                          {deadline.college} • {deadline.course}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{deadline.date}</div>
                        <div className="text-sm text-muted-foreground">at {deadline.time}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {getTimeRemaining(deadline.date, deadline.time)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <p className="text-sm text-muted-foreground">{deadline.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Requirements</div>
                        <div className="space-y-1">
                          {deadline.requirements.map((req, index) => (
                            <div key={index} className="text-xs p-2 bg-gray-600 rounded">
                              {req}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Details</div>
                        <div className="space-y-1 text-sm">
                          <div><span className="text-muted-foreground">Fees:</span> {deadline.fees}</div>
                          <div><span className="text-muted-foreground">Reminder:</span> {deadline.reminderSet ? `Set (${deadline.reminderTime})` : 'Not set'}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Progress</div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Tasks completed</span>
                            <span>{completedTasks}/{totalTasks}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all" 
                              style={{ width: `${completionPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground mb-3">Completion Checklist</div>
                      <div className="space-y-2">
                        {deadline.completionChecklist.map((task, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => updateChecklistItem(deadline.id, index)}
                              className="rounded"
                            />
                            <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.task}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {deadline.notes && (
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-sm font-medium text-yellow-800 mb-1">Notes</div>
                        <div className="text-sm text-yellow-700">{deadline.notes}</div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex gap-4">
                        <Button size="sm" className="btn-secondary">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Official Link
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Documents
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="w-4 h-4 mr-2" />
                          Add to Calendar
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={deadline.reminderSet}
                          onCheckedChange={() => toggleReminder(deadline.id)}
                        />
                        <Label className="text-sm">
                          <Bell className="w-3 h-3 inline mr-1" />
                          Reminder
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
          
          <TabsContent value="critical" className="space-y-4 mt-6">
            {criticalDeadlines.map((deadline) => (
              <Card key={deadline.id} className="feature-card border-red-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-red-600">{deadline.title}</h3>
                      <p className="text-red-500">{deadline.college} - {deadline.course}</p>
                      <div className="text-sm text-red-400 mt-2">
                        {getStatusInfo(deadline.date, deadline.time).urgency === "overdue" ? "OVERDUE!" : `Critical - ${getTimeRemaining(deadline.date, deadline.time)} remaining`}
                      </div>
                    </div>
                    <Badge className="bg-red-500 text-white">
                      {deadline.date} at {deadline.time}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {upcomingDeadlines.map((deadline) => (
              <Card key={deadline.id} className="feature-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{deadline.title}</h3>
                      <p className="text-muted-foreground">{deadline.college} - {deadline.course}</p>
                      <div className="text-sm text-blue-600 mt-2">
                        {getTimeRemaining(deadline.date, deadline.time)} remaining
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {deadline.date} at {deadline.time}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {filteredDeadlines.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Deadlines Found</h3>
              <p className="text-muted-foreground">
                Add your important deadlines to stay organized and never miss important dates
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Deadlines;
