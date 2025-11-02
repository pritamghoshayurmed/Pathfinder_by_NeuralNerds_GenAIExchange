import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Download, Code, Building, Sparkles, FileText, Clock, X, CheckCircle2, AlertCircle, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import { getProjectDocuments } from "@/data/projectDocuments";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";

interface Project {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  description: string;
  technologies: string[];
  domains: string[];
  themes: string[];
  duration: string;
  featured: boolean;
}

interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  cgpa: string;
  linkedinProfile: string;
  experience: string;
}

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    cgpa: "",
    linkedinProfile: "",
    experience: "",
  });

  // Get user ID on mount
  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUserId();
  }, []);

  const projects: Project[] = [
    { id: 1, title: "SportifyHub - Sports Event Management Backend", slug: "sportifyhub", difficulty: "Medium", description: "Develop a Spring Boot API for managing sports events, teams, and registrations. Implement role-based access, event scheduling, and notification features. Use PostgreSQL for persistence, Docker for deployment, and Maven for project management.", technologies: ["Java", "Springboot", "PostgreSQL", "Docker", "Maven"], domains: ["Sports"], themes: ["Entrepreneurship", "Education"], duration: "3-4 months", featured: true },
    { id: 2, title: "PropEase - Real Estate Listings & Booking API", slug: "propease", difficulty: "Medium", description: "Build a Spring Boot backend for managing real estate property listings, bookings, and user profiles. Implement search functionality, booking system, and payment integration.", technologies: ["Java", "Springboot", "MySQL", "Docker", "Maven"], domains: ["Real-Estate"], themes: ["Startup", "Open-Source"], duration: "3-4 months", featured: true },
    { id: 3, title: "Enerlytics - Energy Consumption Analytics Service", slug: "enerlytics", difficulty: "Medium", description: "Create a Spring Boot microservice for collecting and analyzing energy consumption data from smart meters. Build interactive dashboards and generate insights.", technologies: ["Java", "Springboot", "PostgreSQL", "Docker", "Maven"], domains: ["Energy"], themes: ["Research", "Futuristic"], duration: "4-5 months", featured: true },
    { id: 4, title: "CloudScale - Multi-Cloud Infrastructure Manager", slug: "cloudscale", difficulty: "Hard", description: "Build a comprehensive cloud infrastructure management platform supporting AWS, Azure, and GCP. Implement resource provisioning, monitoring, and cost optimization.", technologies: ["Python", "FastAPI", "Terraform", "Kubernetes", "PostgreSQL"], domains: ["Cloud", "Agriculture"], themes: ["Startup", "Education"], duration: "5-6 months", featured: false },
    { id: 5, title: "MediConnect - Healthcare Appointment System", slug: "mediconnect", difficulty: "Easy", description: "Develop a patient-doctor appointment booking system with real-time availability, notifications, and medical records management.", technologies: ["Node.js", "Express", "MongoDB", "React", "Socket.io"], domains: ["Healthcare"], themes: ["Open-Source", "Education"], duration: "2-3 months", featured: false },
    { id: 6, title: "EduLearn - Online Learning Platform", slug: "edulearn", difficulty: "Medium", description: "Create an interactive online learning platform with course management, video streaming, quizzes, and progress tracking.", technologies: ["React", "Node.js", "MongoDB", "AWS", "Redis"], domains: ["Education"], themes: ["Education", "Startup"], duration: "4-5 months", featured: false },
    { id: 7, title: "FarmTech - Agricultural IoT Platform", slug: "farmtech", difficulty: "Hard", description: "Build an IoT platform for smart farming with sensor data collection, weather integration, crop monitoring, and automated irrigation control.", technologies: ["Python", "Django", "PostgreSQL", "MQTT", "React"], domains: ["Agriculture"], themes: ["Research", "Futuristic"], duration: "5-6 months", featured: false },
    { id: 8, title: "LegalEase - Legal Document Automation", slug: "legalease", difficulty: "Medium", description: "Develop a platform for automating legal document generation, contract management, and compliance tracking with AI-powered suggestions.", technologies: ["Python", "FastAPI", "PostgreSQL", "React", "OpenAI"], domains: ["Legal"], themes: ["Entrepreneurship", "Startup"], duration: "3-4 months", featured: false },
    { id: 9, title: "TransitTrack - Transportation Management System", slug: "transittrack", difficulty: "Easy", description: "Build a fleet management system for tracking vehicles, optimizing routes, and managing deliveries with real-time GPS integration.", technologies: ["Node.js", "Express", "MongoDB", "React", "Google Maps API"], domains: ["Transportation"], themes: ["Startup", "Open-Source"], duration: "2-3 months", featured: false },
    { id: 10, title: "GovConnect - Government Services Portal", slug: "govconnect", difficulty: "Medium", description: "Create a citizen services portal for government applications, document verification, and service request tracking with secure authentication.", technologies: ["Java", "Spring Boot", "PostgreSQL", "React", "OAuth2"], domains: ["Government"], themes: ["Open-Source", "Research"], duration: "4-5 months", featured: false },
    { id: 11, title: "CharityChain - Non-Profit Donation Platform", slug: "charitychain", difficulty: "Easy", description: "Build a transparent donation platform for non-profits with campaign management, donor tracking, and impact reporting.", technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"], domains: ["Non-Profit"], themes: ["Open-Source", "Education"], duration: "2-3 months", featured: false },
    { id: 12, title: "HRPro - Human Resources Management System", slug: "hrpro", difficulty: "Medium", description: "Develop a comprehensive HR management system with employee onboarding, attendance tracking, payroll, and performance reviews.", technologies: ["Python", "Django", "PostgreSQL", "React", "Celery"], domains: ["Human-Resources"], themes: ["Startup", "Business"], duration: "4-5 months", featured: false }
  ];

  const project = projects.find(p => p.id === parseInt(projectId || "0"));
  const documents = project ? getProjectDocuments(project.slug) : null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "hard": return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSubmitError(null);
  };

  const generateOfferLetterPDF = (): Blob => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('PATHFINDER.AI', pageWidth / 2, 20, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    yPosition = 50;

    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Offer Letter', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    doc.text(`Date: ${dateStr}`, margin, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Dear ' + formData.fullName.split(' ')[0] + ',', margin, yPosition);
    yPosition += 12;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);

    const bodyText = `We are pleased to offer you an internship position for the project "${project?.title}".

Project Details:
• Project Name: ${project?.title}
• Duration: ${project?.duration}
• Difficulty Level: ${project?.difficulty}
• Project Domain: ${project?.domains.join(', ')}

Candidate Information:
• Name: ${formData.fullName}
• Email: ${formData.email}
• Phone: ${formData.phone}
• College: ${formData.college}
• Year: ${formData.year}
• CGPA: ${formData.cgpa}
• LinkedIn: ${formData.linkedinProfile || 'Not provided'}

Required Technologies:
${project?.technologies.map(t => `• ${t}`).join('\n')}

Project Description:
${project?.description}

This internship will provide you with valuable hands-on experience in real-world project development. You will have the opportunity to work with industry-standard technologies and best practices.

We are confident that you will make significant contributions to this project and look forward to working with you.

Please confirm your acceptance of this offer by replying to this email.

Best Regards,
Pathfinder.AI Team`;

    const splitText = doc.splitTextToSize(bodyText, pageWidth - 2 * margin);
    doc.text(splitText, margin, yPosition);

    yPosition = pageHeight - 30;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Pathfinder.AI | Internship & Project Management Platform', pageWidth / 2, yPosition, { align: 'center' });
    doc.text('This is an official offer letter generated from Pathfinder.AI', pageWidth / 2, yPosition + 5, { align: 'center' });

    return doc.output('blob');
  };

  const submitApplication = async () => {
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.college) {
      setSubmitError('Please fill all required fields (Name, Email, Phone, College)');
      return;
    }

    if (!userId) {
      setSubmitError('You must be logged in to apply');
      return;
    }

    if (!project) {
      setSubmitError('Project information not found');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log('🚀 Starting application submission...');

      // Step 1: Generate PDF
      console.log('📄 Generating PDF...');
      const pdfBlob = generateOfferLetterPDF();
      
      // Step 2: Upload to Supabase Storage
      const fileName = `${userId}/${project.id}_${Date.now()}.pdf`;
      const filePath = `offer-letters/${fileName}`;
      
      console.log('☁️ Uploading to Supabase Storage:', filePath);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('offer-letters')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw new Error(`Failed to upload offer letter: ${uploadError.message}`);
      }

      console.log('✅ Upload successful:', uploadData);

      // Step 3: Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('offer-letters')
        .getPublicUrl(fileName);

      console.log('🔗 Public URL:', publicUrl);

      // Step 4: Save to database
      console.log('💾 Saving to database...');
      
      const { data: dbData, error: dbError } = await supabase
        .from('project_applications')
        .insert({
          user_id: userId,
          project_id: project.id,
          project_title: project.title,
          project_slug: project.slug,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          college: formData.college,
          year: formData.year || null,
          cgpa: formData.cgpa || null,
          linkedin_profile: formData.linkedinProfile || null,
          experience: formData.experience || null,
          difficulty: project.difficulty,
          technologies: project.technologies,
          domains: project.domains,
          themes: project.themes,
          duration: project.duration,
          status: 'pending',
          offer_letter_url: publicUrl,
          offer_letter_path: filePath
        })
        .select()
        .single();

      if (dbError) {
        console.error('❌ Database error:', dbError);
        
        // If database insert fails, try to delete the uploaded file
        await supabase.storage.from('offer-letters').remove([fileName]);
        
        if (dbError.code === '23505') {
          throw new Error('You have already applied for this project');
        }
        throw new Error(`Failed to save application: ${dbError.message}`);
      }

      console.log('✅ Application saved:', dbData);

      // Step 5: Download PDF for user
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `Offer_Letter_${formData.fullName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      console.log('✅ Application process completed successfully');

      // Show success message
      setApplicationSubmitted(true);
      setTimeout(() => {
        setShowApplicationForm(false);
        setApplicationSubmitted(false);
        // Redirect to projects page
        navigate('/dashboard/skill-development/projects-internships');
      }, 3000);

    } catch (error: any) {
      console.error('❌ Application submission error:', error);
      setSubmitError(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!project) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Button onClick={() => navigate(-1)} variant="ghost" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Card className="border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
            <CardContent className="py-16 text-center">
              <h3 className="text-xl font-semibold text-slate-300 mb-2">Project not found</h3>
              <p className="text-slate-400">The project you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Back & Apply Buttons */}
        <div className="flex justify-between items-center">
          <Button onClick={() => navigate(-1)} variant="ghost" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
          </Button>
          <Button
            onClick={() => setShowApplicationForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold py-2.5 px-6"
          >
            <Send className="w-4 h-4 mr-2" />
            Apply Now
          </Button>
        </div>

        {/* Premium Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-10 shadow-2xl border border-purple-500/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/30 via-transparent to-transparent"></div>
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl"></div>
          <div className="absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <Badge className={`${getDifficultyColor(project.difficulty)} border px-3 py-1.5 mb-2`}>
                  {project.difficulty} Difficulty
                </Badge>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-cyan-100 bg-clip-text text-transparent">
                  {project.title}
                </h1>
              </div>
            </div>
            <p className="text-slate-200 text-lg leading-relaxed max-w-3xl">
              {project.description}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Section - Project Details (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tech Stack */}
            <Card className="border border-slate-700/50 shadow-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm hover:shadow-2xl transition-all">
              <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-slate-700/50 pb-3">
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <Code className="w-5 h-5 text-cyan-400" />
                  Tech Stack
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge 
                      key={index} 
                      className="bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-200 border-cyan-500/50 px-3 py-1.5 hover:from-cyan-500/50 hover:to-blue-500/50 transition-all cursor-default"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Domains & Themes */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border border-slate-700/50 shadow-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm hover:shadow-2xl transition-all">
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-slate-700/50 pb-3">
                  <CardTitle className="text-slate-100 flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4 text-blue-400" />
                    Domains
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {project.domains.map((domain, index) => (
                      <div key={index} className="px-3 py-1.5 bg-blue-500/20 rounded-lg border border-blue-500/30 text-blue-200 text-sm">
                        {domain}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-700/50 shadow-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm hover:shadow-2xl transition-all">
                <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-slate-700/50 pb-3">
                  <CardTitle className="text-slate-100 flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Themes
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {project.themes.map((theme, index) => (
                      <div key={index} className="px-3 py-1.5 bg-purple-500/20 rounded-lg border border-purple-500/30 text-purple-200 text-sm">
                        {theme}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Duration */}
            <Card className="border border-slate-700/50 shadow-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm hover:shadow-2xl transition-all">
              <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-slate-700/50 pb-3">
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Duration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-4">
                  <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text">
                    {project.duration}
                  </p>
                  <p className="text-slate-400 text-sm mt-2">Estimated Project Timeline</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Documentation (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Premium Documentation Card */}
            <Card className="border border-emerald-500/50 shadow-2xl bg-gradient-to-br from-emerald-900/30 to-teal-900/20 backdrop-blur-sm sticky top-6">
              <CardHeader className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-b border-emerald-500/30 pb-3">
                <CardTitle className="text-emerald-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  Project Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* PRD */}
                <div className="p-5 bg-gradient-to-br from-blue-900/40 to-cyan-900/30 rounded-xl border-2 border-blue-500/40 hover:border-blue-400/60 transition-all hover:shadow-lg hover:shadow-blue-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-blue-500/30 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">PRD Document</h4>
                      <p className="text-xs text-blue-300">Product Requirements</p>
                    </div>
                  </div>
                  {documents?.prd ? (
                    <a
                      href={documents.prd}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2.5 rounded-lg transition-all cursor-pointer no-underline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PRD
                    </a>
                  ) : (
                    <div className="w-full inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-2.5 rounded-lg opacity-50 cursor-not-allowed">
                      <Download className="w-4 h-4 mr-2" />
                      Download PRD
                    </div>
                  )}
                </div>

                {/* HLD */}
                <div className="p-5 bg-gradient-to-br from-purple-900/40 to-pink-900/30 rounded-xl border-2 border-purple-500/40 hover:border-purple-400/60 transition-all hover:shadow-lg hover:shadow-purple-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-purple-500/30 rounded-lg">
                      <FileText className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">HLD Document</h4>
                      <p className="text-xs text-purple-300">High Level Design</p>
                    </div>
                  </div>
                  {documents?.hld ? (
                    <a
                      href={documents.hld}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2.5 rounded-lg transition-all cursor-pointer no-underline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download HLD
                    </a>
                  ) : (
                    <div className="w-full inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2.5 rounded-lg opacity-50 cursor-not-allowed">
                      <Download className="w-4 h-4 mr-2" />
                      Download HLD
                    </div>
                  )}
                </div>

                {/* LLD */}
                <div className="p-5 bg-gradient-to-br from-emerald-900/40 to-teal-900/30 rounded-xl border-2 border-emerald-500/40 hover:border-emerald-400/60 transition-all hover:shadow-lg hover:shadow-emerald-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-emerald-500/30 rounded-lg">
                      <Code className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">LLD Document</h4>
                      <p className="text-xs text-emerald-300">Low Level Design</p>
                    </div>
                  </div>
                  {documents?.lld ? (
                    <a
                      href={documents.lld}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-2.5 rounded-lg transition-all cursor-pointer no-underline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download LLD
                    </a>
                  ) : (
                    <div className="w-full inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-2.5 rounded-lg opacity-50 cursor-not-allowed">
                      <Download className="w-4 h-4 mr-2" />
                      Download LLD
                    </div>
                  )}
                </div>

                {!documents && (
                  <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-500/30 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-200 text-sm font-semibold">Documents Pending</p>
                      <p className="text-amber-300 text-xs">Documentation will be available soon for this project.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="border border-slate-700/50 shadow-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <p className="text-slate-300 text-sm">
                    Ready to take on this challenge? Apply now and start your internship journey!
                  </p>
                  <Button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Apply for this Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Application Form Modal */}
        {showApplicationForm && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-purple-500/50 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-500/30 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Apply for {project.title}
                  </CardTitle>
                  <p className="text-slate-400 text-sm mt-1">Fill in your details to submit your application</p>
                </div>
                <button
                  onClick={() => {
                    setShowApplicationForm(false);
                    setSubmitError(null);
                  }}
                  className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
                  disabled={isSubmitting}
                >
                  <X className="w-6 h-6" />
                </button>
              </CardHeader>

              <CardContent className="pt-8 pb-8 space-y-5">
                {!applicationSubmitted ? (
                  <>
                    {submitError && (
                      <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/30 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-200 text-sm font-semibold">Error</p>
                          <p className="text-red-300 text-xs">{submitError}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-200">Full Name *</label>
                        <Input
                          name="fullName"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={handleFormChange}
                          disabled={isSubmitting}
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-200">Email *</label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleFormChange}
                          disabled={isSubmitting}
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-200">Phone *</label>
                        <Input
                          name="phone"
                          type="tel"
                          placeholder="+91 9876543210"
                          value={formData.phone}
                          onChange={handleFormChange}
                          disabled={isSubmitting}
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-200">College *</label>
                        <Input
                          name="college"
                          placeholder="Your University"
                          value={formData.college}
                          onChange={handleFormChange}
                          disabled={isSubmitting}
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-200">Year</label>
                        <Input
                          name="year"
                          placeholder="3rd Year / Final Year"
                          value={formData.year}
                          onChange={handleFormChange}
                          disabled={isSubmitting}
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-200">CGPA</label>
                        <Input
                          name="cgpa"
                          placeholder="3.8"
                          value={formData.cgpa}
                          onChange={handleFormChange}
                          disabled={isSubmitting}
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-200">LinkedIn Profile</label>
                        <Input
                          name="linkedinProfile"
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={formData.linkedinProfile}
                          onChange={handleFormChange}
                          disabled={isSubmitting}
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-200">Experience / Cover Letter</label>
                        <textarea
                          name="experience"
                          placeholder="Tell us about your experience and why you're interested in this project..."
                          value={formData.experience}
                          onChange={handleFormChange}
                          disabled={isSubmitting}
                          rows={4}
                          className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={submitApplication}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit & Generate Offer Letter
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-emerald-500/20 rounded-full">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-300">Application Submitted!</h3>
                    <p className="text-slate-300">
                      Your offer letter has been generated and downloaded. Check your downloads folder.
                    </p>
                    <p className="text-slate-400 text-sm">
                      You can view your application in the "My Applications" tab.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetail;
