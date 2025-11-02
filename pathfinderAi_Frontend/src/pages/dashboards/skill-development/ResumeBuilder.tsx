import React from "react";
import { useState, useRef, useEffect } from "react";
import { FileText, Plus, Eye, Settings, Download, Trash2, Copy, Lock, X, Eye as EyeIcon, Loader, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import PdfPreview from "@/components/PdfPreview";
import ResumeForm from "@/components/ResumeForm";
import { compileLatexToPdf, initializeLatexCompiler } from "@/services/latexCompilerService";
import { getTemplate, ResumeData, sampleResumeData } from "@/services/latexTemplates";
import { generateResumeHtml } from "@/services/resumeHtmlGenerator";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface Resume {
  id: string;
  name: string;
  template: string;
  lastModified: string;
  status: "draft" | "completed";
  data?: ResumeData;
  latexCode?: string;
  pdfBlob?: Blob;
  pdf_url?: string;
  user_id?: string;
  created_at?: string;
}

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);

  // Editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);
  const [editorTemplate, setEditorTemplate] = useState("modern");
  const [resumeData, setResumeData] = useState<ResumeData>(sampleResumeData);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationError, setCompilationError] = useState<string | null>(null);
  const [activeEditorTab, setActiveEditorTab] = useState("form");
  const [isSaving, setIsSaving] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  // Initialize compiler on mount
  useEffect(() => {
    const initCompiler = async () => {
      try {
        await initializeLatexCompiler();
        console.log("Compiler initialized");
      } catch (error) {
        console.warn("Compiler initialization:", error);
      }
    };
    initCompiler();
  }, []);

  // Get user and load resumes on mount
  useEffect(() => {
    const getUserAndLoadResumes = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          await loadUserResumes(user.id);
        } else {
          toast.error("Please log in to access your resumes");
          setIsLoadingResumes(false);
        }
      } catch (error) {
        console.error("Error getting user:", error);
        toast.error("Failed to load user data");
        setIsLoadingResumes(false);
      }
    };

    getUserAndLoadResumes();
  }, []);

  // Load user's resumes from Supabase
  const loadUserResumes = async (uid: string) => {
    setIsLoadingResumes(true);
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Transform database records to Resume interface
        const loadedResumes: Resume[] = data.map(record => ({
          id: record.id,
          name: record.name,
          template: record.template,
          lastModified: getTimeAgo(record.updated_at || record.created_at),
          status: record.status as "draft" | "completed",
          data: record.resume_data as ResumeData,
          pdf_url: record.pdf_url,
          user_id: record.user_id,
          created_at: record.created_at
        }));

        setResumes(loadedResumes);
        console.log(`✅ Loaded ${loadedResumes.length} resumes`);
      }
    } catch (error: any) {
      console.error('Error loading resumes:', error);
      toast.error("Failed to load your resumes. Please try again.");
    } finally {
      setIsLoadingResumes(false);
    }
  };

  // Helper function to calculate time ago
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return "just now";
    if (diffInMins < 60) return `${diffInMins} minute${diffInMins !== 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // ==================== HANDLERS ====================

  const handleOpenEditor = (templateId: string, resume?: Resume) => {
    setEditorTemplate(templateId);
    
    if (resume && resume.data) {
      // Editing existing resume
      setEditingResume(resume);
      setResumeData(resume.data);
      // If PDF exists, fetch it
      if (resume.pdf_url) {
        fetchPdfFromUrl(resume.pdf_url);
      }
    } else {
      // Creating new resume
      setEditingResume(null);
      setResumeData(sampleResumeData);
      setPdfBlob(null);
    }
    
    setCompilationError(null);
    setActiveEditorTab("form");
    setIsEditorOpen(true);
  };

  const fetchPdfFromUrl = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      setPdfBlob(blob);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setPdfBlob(null);
    setEditingResume(null);
  };

  const handleResumeDataChange = (newData: ResumeData) => {
    setResumeData(newData);
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    setCompilationError(null);

    try {
      const htmlContent = generateResumeHtml(resumeData, editorTemplate);
      console.log("Generated HTML content length:", htmlContent.length);
      
      const pdf = await compileLatexToPdf(htmlContent);
      setPdfBlob(pdf);
      setActiveEditorTab("preview");
      toast.success("PDF compiled successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setCompilationError(errorMessage);
      toast.error(`Compilation failed: ${errorMessage}`);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!pdfBlob) {
      toast.error("No PDF to download. Please compile first.");
      return;
    }

    const url = URL.createObjectURL(pdfBlob);
    const link = downloadLinkRef.current;
    if (link) {
      link.href = url;
      link.download = `${resumeData.fullName || "resume"}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully!");
    }
  };

  const handleSaveResume = async () => {
    if (!pdfBlob) {
      toast.error("Please compile your resume first");
      return;
    }

    if (!userId) {
      toast.error("You must be logged in to save resumes");
      return;
    }

    setIsSaving(true);

    try {
      // 1. Upload PDF to Supabase Storage
      const fileName = `${userId}/${Date.now()}_${resumeData.fullName?.replace(/\s+/g, '_') || 'resume'}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 2. Get public URL for the uploaded PDF
      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      const pdfUrl = urlData.publicUrl;

      // 3. Save resume metadata to database
      const resumeRecord = {
        user_id: userId,
        name: resumeData.fullName || "Untitled Resume",
        template: editorTemplate.charAt(0).toUpperCase() + editorTemplate.slice(1),
        status: "completed" as const,
        resume_data: resumeData,
        pdf_url: pdfUrl,
        pdf_path: fileName,
        updated_at: new Date().toISOString()
      };

      let savedResume;

      if (editingResume) {
        // Update existing resume
        const { data, error } = await supabase
          .from('resumes')
          .update(resumeRecord)
          .eq('id', editingResume.id)
          .select()
          .single();

        if (error) throw error;
        savedResume = data;
        toast.success("Resume updated successfully!");
      } else {
        // Insert new resume
        const { data, error } = await supabase
          .from('resumes')
          .insert([resumeRecord])
          .select()
          .single();

        if (error) throw error;
        savedResume = data;
        toast.success("Resume saved successfully!");
      }

      // 4. Reload resumes from database
      if (userId) {
        await loadUserResumes(userId);
      }

      // 5. Close editor
      handleCloseEditor();

    } catch (error: any) {
      console.error('Error saving resume:', error);
      toast.error(`Failed to save resume: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!userId) {
      toast.error("You must be logged in to delete resumes");
      return;
    }

    try {
      // Find the resume to get the PDF path
      const resume = resumes.find(r => r.id === id);
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (dbError) throw dbError;

      // Delete PDF from storage (if exists)
      if (resume?.pdf_url) {
        const fileName = resume.pdf_url.split('/resumes/')[1];
        if (fileName) {
          await supabase.storage
            .from('resumes')
            .remove([fileName]);
        }
      }

      // Update local state
      setResumes(resumes.filter(r => r.id !== id));
      toast.success("Resume deleted successfully!");

    } catch (error: any) {
      console.error('Error deleting resume:', error);
      toast.error(`Failed to delete resume: ${error.message}`);
    }
  };

  const handleDuplicateResume = async (resume: Resume) => {
    if (!userId) {
      toast.error("You must be logged in to duplicate resumes");
      return;
    }

    try {
      // Create a copy of the resume data
      const duplicateRecord = {
        user_id: userId,
        name: `${resume.name} (Copy)`,
        template: resume.template,
        status: "draft" as const,
        resume_data: resume.data,
        pdf_url: null, // Don't copy the PDF URL
        pdf_path: null
      };

      const { data, error } = await supabase
        .from('resumes')
        .insert([duplicateRecord])
        .select()
        .single();

      if (error) throw error;

      // Reload resumes
      if (userId) {
        await loadUserResumes(userId);
      }

      toast.success("Resume duplicated successfully!");

    } catch (error: any) {
      console.error('Error duplicating resume:', error);
      toast.error(`Failed to duplicate resume: ${error.message}`);
    }
  };

  const handleEditResume = (resume: Resume) => {
    handleOpenEditor(resume.template.toLowerCase(), resume);
  };

  // Template list - ATS-friendly templates
  const templates = [
    {
      id: "modern",
      name: "Modern",
      description: "Clean, professional design with blue accents",
      color: "from-blue-500 to-purple-500",
      icon: "✨"
    },
    {
      id: "minimalist",
      name: "Minimalist",
      description: "Simple and elegant - ATS optimized",
      color: "from-slate-500 to-gray-500",
      icon: "⚡"
    },
    {
      id: "professional",
      name: "Professional",
      description: "Corporate formal with serif fonts",
      color: "from-indigo-500 to-blue-500",
      icon: "💼"
    },
    {
      id: "creative",
      name: "Creative",
      description: "Modern colorful design with accent lines",
      color: "from-pink-500 to-orange-500",
      icon: "🎨"
    },
    {
      id: "compact",
      name: "Compact",
      description: "Maximum content density for ATS systems",
      color: "from-green-500 to-emerald-500",
      icon: "📊"
    },
    {
      id: "twocolumn",
      name: "Two Column",
      description: "Sidebar layout with skills column",
      color: "from-violet-500 to-fuchsia-500",
      icon: "📋"
    }
  ];

  // ==================== RENDER ====================

  if (isEditorOpen) {
    return (
      <DashboardLayout
        title="Resume Editor"
        description="Edit your resume with LaTeX templates"
      >
        <div className="p-6 space-y-6 bg-slate-950 min-h-screen">
         
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl p-6 text-white border border-slate-700/50">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 via-teal-600/5 to-blue-600/5 rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-2xl"></div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500/30 to-teal-500/20 rounded-lg border border-emerald-400/40">
                    <FileText className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-emerald-200 to-teal-100 bg-clip-text text-transparent">
                      Resume Editor
                    </h1>
                    <p className="text-sm text-emerald-300">
                      {editorTemplate.charAt(0).toUpperCase() + editorTemplate.slice(1)} Template
                      {editingResume && <span className="ml-2 text-slate-400">(Editing: {editingResume.name})</span>}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleCloseEditor}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Template Selector */}
              <div className="flex gap-2 flex-wrap">
                {templates.map((t) => (
                  <Button
                    key={t.id}
                    onClick={() => setEditorTemplate(t.id)}
                    variant={editorTemplate === t.id ? "default" : "outline"}
                    size="sm"
                    className={
                      editorTemplate === t.id
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0"
                        : "border-slate-600 text-slate-300 hover:bg-slate-700/50 text-xs"
                    }
                  >
                    {t.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Editor Tabs */}
          <Tabs value={activeEditorTab} onValueChange={setActiveEditorTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/50 rounded-lg p-1 h-auto">
              <TabsTrigger
                value="form"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/30 data-[state=active]:to-teal-500/20 data-[state=active]:text-emerald-300 rounded-md py-2 text-xs"
              >
                <FileText className="w-3 h-3 mr-2" />
                Form
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/30 data-[state=active]:to-teal-500/20 data-[state=active]:text-emerald-300 rounded-md py-2 text-xs"
                disabled={!pdfBlob}
              >
                <EyeIcon className="w-3 h-3 mr-2" />
                PDF Preview
              </TabsTrigger>
            </TabsList>

            {/* Form Tab */}
            <TabsContent value="form" className="space-y-4 mt-4">
              <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50">
                <ResumeForm initialData={resumeData} onChange={handleResumeDataChange} />
              </div>

              <Button
                onClick={handleCompile}
                disabled={isCompiling}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 font-semibold h-12"
              >
                {isCompiling ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Compiling...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Compile & Preview
                  </>
                )}
              </Button>
            </TabsContent>

            {/* PDF Preview Tab */}
            <TabsContent value="preview" className="space-y-4 mt-4">
              <PdfPreview
                pdfBlob={pdfBlob}
                isLoading={isCompiling}
                error={compilationError}
                onDownload={handleDownloadPdf}
              />

              {pdfBlob && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleDownloadPdf}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 font-semibold h-12"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    onClick={handleSaveResume}
                    disabled={isSaving}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 font-semibold h-12 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        {editingResume ? "Update Resume" : "Save Resume"}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Hidden download link */}
          <a ref={downloadLinkRef} style={{ display: "none" }} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Resume Builder"
      description="Create professional resumes with AI assistance"
    >
      <div className="p-6 space-y-8 bg-slate-950">
         {/* Back to Placement Kit Button */}
        <Button
          onClick={() => navigate('/dashboard/skill-development/placement-kit')}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-orange-500/40 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Placement Kit
        </Button>
        
        {/* ============ Header Section ============ */}
        <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl border border-transparent">
          {/* Premium Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 via-teal-600/5 to-blue-600/5 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-3xl"></div>

          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-teal-500/0 to-blue-500/0 hover:from-emerald-500/5 hover:via-teal-500/5 hover:to-blue-500/5 transition-all duration-700 rounded-3xl"></div>

          {/* Glowing Border Effect */}
          <div className="absolute inset-0 rounded-3xl border border-gradient-to-r from-emerald-500/30 via-teal-500/20 to-blue-500/30"></div>

          {/* Premium Accent Elements */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-emerald-600/5 to-transparent rounded-full -translate-x-32 -translate-y-32 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-teal-600/5 to-transparent rounded-full translate-x-32 translate-y-32 blur-3xl"></div>

          <div className="relative z-10 space-y-6">
            {/* Header Title Row */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500/30 to-teal-500/20 rounded-xl backdrop-blur-sm border border-emerald-400/40 shadow-lg">
                    <FileText className="w-8 h-8 text-emerald-300" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-teal-100 bg-clip-text text-transparent">Resume Builder</h1>
                    <p className="text-emerald-300 text-lg font-medium">Professional Resumes with LaTeX & AI Assistance</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <Badge className="bg-gradient-to-r from-emerald-500/40 to-emerald-600/30 border-emerald-400/60 text-emerald-100 backdrop-blur-sm shadow-md">
                    <FileText className="w-3 h-3 mr-2" />
                    {resumes.length} Resume{resumes.length !== 1 ? 's' : ''}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-teal-500/40 to-teal-600/30 border-teal-400/60 text-teal-100 backdrop-blur-sm shadow-md">
                    <Settings className="w-3 h-3 mr-2" />
                    6 Professional Templates
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ Your Resumes Section ============ */}
        {isLoadingResumes ? (
          <div className="text-center py-12">
            <Loader className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" />
            <p className="text-slate-400">Loading your resumes...</p>
          </div>
        ) : resumes.length > 0 ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Your Resumes ({resumes.length})</h2>
              <p className="text-slate-400 mt-1">Manage and edit your saved resumes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-slate-700/50 hover:border-emerald-500/40"
                >
                  {/* Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300"></div>

                  {/* Content */}
                  <div className="relative z-10 p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">{resume.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-gradient-to-r from-slate-700 to-slate-800 border-slate-600 text-slate-300 text-xs">
                            {resume.template}
                          </Badge>
                          <Badge className={resume.status === "completed" ? "bg-gradient-to-r from-emerald-500/40 to-emerald-600/30 border-emerald-400/60 text-emerald-100" : "bg-gradient-to-r from-amber-500/40 to-amber-600/30 border-amber-400/60 text-amber-100"}>
                            {resume.status === "completed" ? "Complete" : "Draft"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400">Modified {resume.lastModified}</p>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleEditResume(resume)}
                        size="sm"
                        variant="outline"
                        className="flex-1 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDuplicateResume(resume)}
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700/50 text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Duplicate
                      </Button>
                      <Button
                        onClick={() => handleDeleteResume(resume.id)}
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-500/40 text-red-300 hover:bg-red-500/20 text-xs"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-700/50">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Resumes Yet</h3>
            <p className="text-slate-400 mb-6">Create your first professional resume using our templates</p>
          </div>
        )}

        {/* ============ Templates Section ============ */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Choose a Template</h2>
            <p className="text-slate-400 mt-1">Start with a professionally designed resume template</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                {/* Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-20`}></div>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90"></div>
                <div className={`absolute inset-0 bg-gradient-to-r ${template.color} opacity-0 group-hover:opacity-10 transition-all duration-300`}></div>

                {/* Border */}
                <div className={`absolute inset-0 rounded-2xl border bg-gradient-to-r ${template.color} opacity-20 group-hover:opacity-60 transition-opacity duration-300`}></div>

                {/* Content */}
                <div className="relative z-10 p-6 space-y-4 text-center h-full flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-3xl">{template.icon}</p>
                    <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text transition-all">
                      {template.name}
                    </h3>
                    <p className="text-sm text-slate-400">{template.description}</p>
                  </div>

                  <Button
                    onClick={() => handleOpenEditor(template.id)}
                    className={`w-full bg-gradient-to-r ${template.color} hover:shadow-lg text-white border-0 transition-all`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============ Features Section ============ */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Why Use Our Builder?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "6 ATS-Optimized Templates", description: "Professional templates designed to pass applicant tracking systems", icon: "✨" },
              { title: "Cloud Storage", description: "Your resumes are safely stored and accessible anywhere", icon: "☁️" },
              { title: "Live PDF Preview", description: "See your resume instantly in PDF format", icon: "👁️" },
              { title: "Format Flexibility", description: "Switch between formats instantly without losing data", icon: "🔄" },
              { title: "Professional Designs", description: "From minimalist to creative - choose your style", icon: "🎨" },
              { title: "Easy Editing", description: "Update and modify your resumes anytime", icon: "✏️" }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-emerald-500/40 p-4 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all"></div>
                <div className="relative z-10 space-y-2">
                  <div className="text-2xl">{feature.icon}</div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-xs text-slate-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============ Premium Features ============ */}
        <div className="relative overflow-hidden rounded-2xl p-8 border border-purple-500/40 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"></div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-purple-300" />
              <h3 className="text-xl font-bold text-white">Advanced Features Coming Soon</h3>
            </div>
            <p className="text-slate-300">Upcoming enhancements:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "AI-powered content suggestions",
                "Cover letter generator",
                "Multi-language support",
                "Version history tracking",
                "Portfolio integration",
                "Interview prep insights"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span className="text-sm text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeBuilder;