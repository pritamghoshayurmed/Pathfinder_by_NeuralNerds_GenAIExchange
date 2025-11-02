import { useState, useEffect } from "react";
import { Edit, Plus, Eye, Download, RefreshCw, Sparkles, Target, Copy, Trash2, Save, X, Check, Lightbulb, AlertCircle, FileText, Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { coverLetterService, GeneratedCoverLetter, CoverLetterTemplate } from "@/services/coverLetterService";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ViewState {
  type: 'list' | 'preview' | 'edit' | 'generate' | 'analyze' | 'view-detail';
  letterId?: string;
}

const CoverLetter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Core state
  const [coverLetters, setCoverLetters] = useState<GeneratedCoverLetter[]>([]);
  const [viewState, setViewState] = useState<ViewState>({ type: 'list' });
  const [selectedLetter, setSelectedLetter] = useState<GeneratedCoverLetter | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingLetters, setIsLoadingLetters] = useState(true);
  
  // Form states
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [userBackground, setUserBackground] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("Professional");
  
  // Generated content
  const [generatedContent, setGeneratedContent] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Suggestions and analysis
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [alignmentAnalysis, setAlignmentAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [templates, setTemplates] = useState<CoverLetterTemplate[]>([]);
  const [refinementFeedback, setRefinementFeedback] = useState("");

  // Load user and fetch cover letters from Supabase
  useEffect(() => {
    const loadUserAndLetters = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          await fetchCoverLetters(user.id);
        } else {
          toast({
            title: "Authentication Required",
            description: "Please log in to access cover letters",
            variant: "destructive",
          });
        }

        // Load templates from service
        const loadedTemplates = coverLetterService.getTemplates();
        setTemplates(loadedTemplates);
      } catch (err) {
        console.error("Error loading data:", err);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setIsLoadingLetters(false);
      }
    };

    loadUserAndLetters();
  }, []);

  // Fetch cover letters from Supabase
  const fetchCoverLetters = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map Supabase data to component format
      const mapped: GeneratedCoverLetter[] = data.map(letter => ({
        id: letter.id,
        company: letter.company,
        position: letter.position,
        content: letter.content,
        template: letter.template || 'Professional',
        lastModified: new Date(letter.updated_at).toLocaleDateString(),
        createdAt: letter.created_at,
      }));

      setCoverLetters(mapped);
      console.log(`✅ Loaded ${mapped.length} cover letters from database`);
    } catch (error: any) {
      console.error('Error fetching cover letters:', error);
      toast({
        title: "Error",
        description: "Failed to load cover letters",
        variant: "destructive",
      });
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleGenerateCoverLetter = async () => {
    if (!company.trim() || !position.trim()) {
      setError("Please fill in company name and job position");
      return;
    }

    setIsGenerating(true);
    setError("");
    try {
      const content = await coverLetterService.generateCoverLetter(
        company,
        position,
        jobDescription,
        userBackground,
        selectedTemplate
      );
      
      setGeneratedContent(content);
      setEditedContent(content);
      setViewState({ type: 'preview' });
      setSuccess("Cover letter generated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate cover letter");
    } finally {
      setIsGenerating(false);
    }
  };

  // Save cover letter to Supabase database
  const handleSaveCoverLetter = async () => {
    if (!editedContent.trim()) {
      setError("Cover letter cannot be empty");
      return;
    }

    if (!userId) {
      setError("Please log in to save cover letters");
      toast({
        title: "Authentication Required",
        description: "Please log in to save cover letters",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const newLetter = {
        user_id: userId,
        company: company || "Unnamed Company",
        position: position || "Position",
        content: editedContent,
        template: selectedTemplate,
        job_description: jobDescription || null,
        user_background: userBackground || null,
        status: 'final',
      };

      const { data, error } = await supabase
        .from('cover_letters')
        .insert([newLetter])
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const mapped: GeneratedCoverLetter = {
        id: data.id,
        company: data.company,
        position: data.position,
        content: data.content,
        template: data.template,
        lastModified: new Date(data.updated_at).toLocaleDateString(),
        createdAt: data.created_at,
      };

      setCoverLetters([mapped, ...coverLetters]);
      
      // Reset form
      setCompany("");
      setPosition("");
      setJobDescription("");
      setUserBackground("");
      setGeneratedContent("");
      setEditedContent("");
      setRefinementFeedback("");
      
      setViewState({ type: 'list' });
      setSuccess("Cover letter saved successfully!");
      
      toast({
        title: "Success",
        description: "Cover letter saved to database",
      });

      console.log(`✅ Cover letter saved: ${data.company} - ${data.position}`);
    } catch (err: any) {
      console.error('Error saving cover letter:', err);
      setError("Failed to save cover letter");
      toast({
        title: "Error",
        description: err.message || "Failed to save to database",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete cover letter from Supabase
  const handleDeleteCoverLetter = async (id: string) => {
    if (!userId) {
      setError("Please log in to delete cover letters");
      return;
    }

    try {
      const { error } = await supabase
        .from('cover_letters')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      // Remove from local state
      const updated = coverLetters.filter(letter => letter.id !== id);
      setCoverLetters(updated);
      setSuccess("Cover letter deleted successfully!");
      
      if (selectedLetter?.id === id) {
        setSelectedLetter(null);
        setViewState({ type: 'list' });
      }

      toast({
        title: "Deleted",
        description: "Cover letter removed successfully",
      });

      console.log(`✅ Cover letter deleted: ${id}`);
    } catch (err: any) {
      console.error('Error deleting cover letter:', err);
      setError("Failed to delete cover letter");
      toast({
        title: "Error",
        description: "Failed to delete from database",
        variant: "destructive",
      });
    }
  };

  // Update cover letter in Supabase
  const handleUpdateCoverLetter = async () => {
    if (!selectedLetter || !userId) {
      setError("Unable to update cover letter");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cover_letters')
        .update({ 
          content: editedContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedLetter.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      const updated = coverLetters.map(letter =>
        letter.id === selectedLetter.id
          ? { 
              ...letter, 
              content: editedContent, 
              lastModified: new Date(data.updated_at).toLocaleDateString() 
            }
          : letter
      );
      setCoverLetters(updated);
      setSelectedLetter(updated.find(l => l.id === selectedLetter.id) || null);
      setSuccess("Changes saved!");
      setViewState({ type: 'view-detail' });

      toast({
        title: "Updated",
        description: "Cover letter updated successfully",
      });

      console.log(`✅ Cover letter updated: ${selectedLetter.id}`);
    } catch (err: any) {
      console.error('Error updating cover letter:', err);
      setError("Failed to update cover letter");
      toast({
        title: "Error",
        description: "Failed to update in database",
        variant: "destructive",
      });
    }
  };

  const handleViewLetter = (letter: GeneratedCoverLetter) => {
    setSelectedLetter(letter);
    setEditedContent(letter.content);
    setViewState({ type: 'view-detail' });
  };

  const handleEditLetter = () => {
    if (selectedLetter) {
      setEditedContent(selectedLetter.content);
      setViewState({ type: 'edit' });
    }
  };

  const handleDuplicateLetter = (letter: GeneratedCoverLetter) => {
    setCompany(letter.company);
    setPosition(letter.position);
    setSelectedTemplate(letter.template);
    setGeneratedContent(letter.content);
    setEditedContent(letter.content);
    setViewState({ type: 'preview' });
    setSuccess("Letter loaded for editing!");
  };

  const handleGetSuggestions = async () => {
    if (!editedContent.trim()) {
      setError("No content to analyze");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    try {
      const subs = await coverLetterService.getCoverLetterSuggestions(
        company || "the company",
        position || "the position",
        editedContent
      );
      setSuggestions(subs);
      setViewState({ type: 'analyze' });
      setSuccess("Suggestions generated!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get suggestions");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeAlignment = async () => {
    if (!editedContent.trim() || !jobDescription.trim()) {
      setError("Please provide both cover letter and job description");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    try {
      const analysis = await coverLetterService.analyzeAlignment(
        editedContent,
        jobDescription
      );
      setAlignmentAnalysis(analysis);
      setSuccess("Analysis complete!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRefineContent = async () => {
    if (!refinementFeedback.trim()) {
      setError("Please provide feedback for refinement");
      return;
    }

    setIsRefining(true);
    setError("");
    try {
      const refined = await coverLetterService.refineCoverLetter(
        editedContent,
        refinementFeedback
      );
      setEditedContent(refined);
      setRefinementFeedback("");
      setSuccess("Content refined successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refine content");
    } finally {
      setIsRefining(false);
    }
  };

  const handleDownloadPDF = () => {
    try {
      const element = document.createElement("a");
      const file = new Blob([editedContent], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${company}_${position}_CoverLetter.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setSuccess("Cover letter downloaded!");
    } catch (err) {
      setError("Failed to download");
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(editedContent);
    setSuccess("Copied to clipboard!");
  };

  // ==== RENDER SECTIONS ====

  if (viewState.type === 'generate') {
    return (
      <DashboardLayout
        title="Generate Cover Letter"
        description="Create a personalized cover letter"
      >
        <div className="p-6 space-y-6 bg-slate-950">
          {/* Error/Success Messages */}
          {error && (
            <div className="rounded-lg p-4 bg-red-500/10 border border-red-500/40 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}
          {success && (
            <div className="rounded-lg p-4 bg-green-500/10 border border-green-500/40 flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-green-300 text-sm">{success}</span>
            </div>
          )}

          {/* Back Button */}
          <Button
            onClick={() => {
              setViewState({ type: 'list' });
              setCompany("");
              setPosition("");
              setJobDescription("");
              setUserBackground("");
            }}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Letters
          </Button>

          {/* Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Letter Details</h2>
              
              <div className="space-y-4 rounded-2xl p-6 border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g., Google, Microsoft"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-orange-500/40 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">
                    Job Position *
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g., Senior Engineer"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-orange-500/40 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">
                    Template Style
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-orange-500/40 focus:outline-none transition-all"
                  >
                    {templates.map((t) => (
                      <option key={t.name} value={t.name}>
                        {t.name} - {t.style}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">
                    Job Description (Optional)
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description for better personalization"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-orange-500/40 focus:outline-none transition-all h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">
                    Your Background (Optional)
                  </label>
                  <textarea
                    value={userBackground}
                    onChange={(e) => setUserBackground(e.target.value)}
                    placeholder="Brief summary of your experience and skills"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-orange-500/40 focus:outline-none transition-all h-20 resize-none"
                  />
                </div>

                <Button
                  onClick={handleGenerateCoverLetter}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 font-semibold shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Templates Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Available Templates</h2>
              <div className="grid grid-cols-1 gap-3">
                {templates.map((template) => (
                  <div
                    key={template.name}
                    onClick={() => setSelectedTemplate(template.name)}
                    className={`relative overflow-hidden rounded-xl p-4 transition-all cursor-pointer border ${
                      selectedTemplate === template.name
                        ? "border-orange-500/60 bg-orange-500/10"
                        : "border-slate-700/50 bg-slate-800/50 hover:border-orange-500/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{template.icon}</span>
                      <div>
                        <p className="font-semibold text-white">{template.name}</p>
                        <p className="text-xs text-slate-400">{template.style}</p>
                      </div>
                      {selectedTemplate === template.name && (
                        <Check className="w-4 h-4 text-orange-400 ml-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (viewState.type === 'preview') {
    return (
      <DashboardLayout
        title="Preview & Edit"
        description="Review and customize your cover letter"
      >
        <div className="p-6 space-y-6 bg-slate-950">
          {/* Error/Success Messages */}
          {error && (
            <div className="rounded-lg p-4 bg-red-500/10 border border-red-500/40 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}
          {success && (
            <div className="rounded-lg p-4 bg-green-500/10 border border-green-500/40 flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-green-300 text-sm">{success}</span>
            </div>
          )}

          {/* Header with Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{company} - {position}</h2>
              <p className="text-slate-400 mt-1">Template: {selectedTemplate}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setViewState({ type: 'generate' })}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleGetSuggestions}
                disabled={isAnalyzing}
                variant="outline"
                className="border-orange-500/40 text-orange-300 hover:bg-orange-500/20"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {isAnalyzing ? "Analyzing..." : "Get Suggestions"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Content Editor */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl p-6 border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-orange-500/40 focus:outline-none transition-all h-96 resize-none font-mono text-sm"
                  placeholder="Your cover letter will appear here..."
                />
              </div>

              {/* Refinement Feedback */}
              <div className="rounded-2xl p-6 border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  Refine Content
                </h3>
                <textarea
                  value={refinementFeedback}
                  onChange={(e) => setRefinementFeedback(e.target.value)}
                  placeholder="Tell AI how to improve this letter (e.g., 'Make it more enthusiastic', 'Add more technical details')"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-orange-500/40 focus:outline-none transition-all h-20 resize-none text-sm"
                />
                <Button
                  onClick={handleRefineContent}
                  disabled={isRefining || !refinementFeedback.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isRefining ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Refining...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Refine with AI
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="space-y-4">
              <div className="rounded-2xl p-6 border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 space-y-3">
                <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
                
                <Button
                  onClick={handleCopyToClipboard}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>

                <Button
                  onClick={handleDownloadPDF}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>

                <Button
                  onClick={handleSaveCoverLetter}
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>

                {jobDescription && (
                  <Button
                    onClick={handleAnalyzeAlignment}
                    disabled={isAnalyzing}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Analyze Alignment
                      </>
                    )}
                  </Button>
                )}
              </div>

              {alignmentAnalysis && (
                <div className="rounded-2xl p-6 border border-blue-500/40 bg-blue-500/5 space-y-3">
                  <h3 className="font-semibold text-white">Alignment Analysis</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Match Score:</span>
                      <Badge className="bg-blue-600">{alignmentAnalysis.alignmentScore}%</Badge>
                    </div>
                    {alignmentAnalysis.matchedSkills?.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-400 mb-2">Matched Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {alignmentAnalysis.matchedSkills.map((skill: string, i: number) => (
                            <Badge key={i} className="bg-green-600/50 text-green-200 text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {alignmentAnalysis.missingSkills?.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-400 mb-2">Missing Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {alignmentAnalysis.missingSkills.map((skill: string, i: number) => (
                            <Badge key={i} className="bg-red-600/50 text-red-200 text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Improvement Suggestions */}
              {suggestions.length > 0 && (
                <div className="rounded-2xl p-6 border border-orange-500/40 bg-orange-500/5 space-y-3">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-orange-400" />
                    Improvement Suggestions
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="rounded-lg p-3 border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/15 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-orange-500/40 flex items-center justify-center text-orange-300 text-xs font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-slate-300 text-sm">{suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => setViewState({ type: 'analyze' })}
                    variant="outline"
                    className="w-full border-orange-500/40 text-orange-300 hover:bg-orange-500/10 text-sm"
                  >
                    View All Suggestions
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (viewState.type === 'analyze') {
    return (
      <DashboardLayout
        title="AI Suggestions"
        description="Recommendations to improve your cover letter"
      >
        <div className="p-6 space-y-6 bg-slate-950">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Improvement Suggestions</h2>
            <Button
              onClick={() => setViewState({ type: 'preview' })}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
          </div>

          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="rounded-xl p-4 border border-orange-500/40 bg-orange-500/5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500/30 flex items-center justify-center text-orange-300 text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-slate-300">{suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (viewState.type === 'edit' && selectedLetter) {
    return (
      <DashboardLayout
        title="Edit Cover Letter"
        description="Modify your saved cover letter"
      >
        <div className="p-6 space-y-6 bg-slate-950">
          {error && (
            <div className="rounded-lg p-4 bg-red-500/10 border border-red-500/40 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}
          {success && (
            <div className="rounded-lg p-4 bg-green-500/10 border border-green-500/40 flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-green-300 text-sm">{success}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedLetter.company}</h2>
              <p className="text-slate-400 mt-1">{selectedLetter.position}</p>
            </div>
            <Button
              onClick={() => setViewState({ type: 'view-detail' })}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="rounded-2xl p-6 border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-orange-500/40 focus:outline-none transition-all h-96 resize-none font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleUpdateCoverLetter}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>

              <Button
                onClick={() => setViewState({ type: 'view-detail' })}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                <X className="w-4 h-4 mr-2" />
                Discard
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (viewState.type === 'view-detail' && selectedLetter) {
    return (
      <DashboardLayout
        title="View Cover Letter"
        description="Review your saved cover letter"
      >
        <div className="p-6 space-y-6 bg-slate-950">
          {success && (
            <div className="rounded-lg p-4 bg-green-500/10 border border-green-500/40 flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-green-300 text-sm">{success}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedLetter.company}</h2>
              <p className="text-slate-400 mt-1">
                {selectedLetter.position} • Template: {selectedLetter.template}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Modified: {selectedLetter.lastModified}
              </p>
            </div>
            <Button
              onClick={() => {
                setViewState({ type: 'list' });
                setSelectedLetter(null);
              }}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Content */}
            <div className="lg:col-span-2 rounded-2xl p-8 border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
                  {selectedLetter.content}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <div className="rounded-2xl p-6 border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 space-y-3">
                <h3 className="font-semibold text-white">Actions</h3>

                <Button
                  onClick={() => handleEditLetter()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>

                <Button
                  onClick={() => handleDuplicateLetter(selectedLetter)}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>

                <Button
                  onClick={() => handleCopyToClipboard()}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Text
                </Button>

                <Button
                  onClick={() => handleDownloadPDF()}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>

                <Button
                  onClick={() => handleDeleteCoverLetter(selectedLetter.id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Default - LIST VIEW
  return (
    <DashboardLayout
      title="Cover Letter Generator"
      description="Create personalized cover letters tailored to specific jobs"
    >
      <div className="p-6 space-y-8 bg-slate-950">
        <Button
                  onClick={() => navigate('/dashboard/skill-development/placement-kit')}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-orange-500/40 transition-all"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Placement Kit
                </Button>
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl border border-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 via-red-600/5 to-pink-600/5 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-3xl"></div>

          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-red-500/0 to-pink-500/0 hover:from-orange-500/5 hover:via-red-500/5 hover:to-pink-500/5 transition-all duration-700 rounded-3xl"></div>

          <div className="absolute inset-0 rounded-3xl border border-gradient-to-r from-orange-500/30 via-red-500/20 to-pink-500/30"></div>

          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-orange-600/5 to-transparent rounded-full -translate-x-32 -translate-y-32 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-red-600/5 to-transparent rounded-full translate-x-32 translate-y-32 blur-3xl"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500/30 to-red-500/20 rounded-xl backdrop-blur-sm border border-orange-400/40 shadow-lg">
                    <Edit className="w-8 h-8 text-orange-300" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-orange-200 to-red-100 bg-clip-text text-transparent">Cover Letter Generator</h1>
                    <p className="text-orange-300 text-lg font-medium">Personalized for Every Opportunity</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <Badge className="bg-gradient-to-r from-orange-500/40 to-orange-600/30 border-orange-400/60 text-orange-100 backdrop-blur-sm shadow-md">
                    <Sparkles className="w-3 h-3 mr-2" />
                    AI-Powered Generation
                  </Badge>
                  <Badge className="bg-gradient-to-r from-red-500/40 to-red-600/30 border-red-400/60 text-red-100 backdrop-blur-sm shadow-md">
                    <Target className="w-3 h-3 mr-2" />
                    Job-Specific
                  </Badge>
                </div>
              </div>

              <Button
                onClick={() => setViewState({ type: 'generate' })}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 h-12"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Letter
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingLetters && (
          <div className="flex items-center justify-center p-12">
            <RefreshCw className="w-8 h-8 text-orange-400 animate-spin" />
          </div>
        )}

        {/* Your Cover Letters */}
        {!isLoadingLetters && coverLetters.length > 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Your Cover Letters ({coverLetters.length})</h2>
              <p className="text-slate-400 mt-1">Browse and manage your saved cover letters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coverLetters.map((letter) => (
                <div
                  key={letter.id}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] border border-slate-700/50 hover:border-orange-500/40"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-red-500/0 group-hover:from-orange-500/5 group-hover:to-red-500/5 transition-all duration-300"></div>

                  <div className="relative z-10 p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                        {letter.company}
                      </h3>
                      <p className="text-sm text-orange-300 mt-1">{letter.position}</p>
                      <Badge className="mt-2 bg-slate-700/50 text-slate-300 text-xs">
                        {letter.template}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-400">Modified {letter.lastModified}</p>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleViewLetter(letter)}
                        size="sm"
                        variant="outline"
                        className="flex-1 border-orange-500/40 text-orange-300 hover:bg-orange-500/20 text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        onClick={() => handleDuplicateLetter(letter)}
                        size="sm"
                        variant="outline"
                        className="flex-1 border-orange-500/40 text-orange-300 hover:bg-orange-500/20 text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Duplicate
                      </Button>
                      <Button
                        onClick={() => handleDeleteCoverLetter(letter.id)}
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
        )}

        {/* Empty State */}
        {!isLoadingLetters && coverLetters.length === 0 && (
          <div className="rounded-2xl p-12 border border-dashed border-slate-700 bg-slate-900/30 flex flex-col items-center justify-center text-center">
            <FileText className="w-16 h-16 text-slate-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Cover Letters Yet</h3>
            <p className="text-slate-400 mb-6">Create your first personalized cover letter using AI</p>
            <Button
              onClick={() => setViewState({ type: 'generate' })}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Letter
            </Button>
          </div>
        )}

        {/* Templates Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Available Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.name}
                onClick={() => {
                  setSelectedTemplate(template.name);
                  setViewState({ type: 'generate' });
                }}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-orange-500/40 p-4 transition-all duration-300 cursor-pointer hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-red-500/0 group-hover:from-orange-500/5 group-hover:to-red-500/5 transition-all"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{template.icon}</span>
                    <div>
                      <p className="font-semibold text-white">{template.name}</p>
                      <p className="text-xs text-slate-400">{template.style}</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-orange-400 group-hover:scale-150 transition-transform"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="relative overflow-hidden rounded-2xl p-8 border border-orange-500/40 bg-gradient-to-br from-orange-500/5 to-red-500/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl"></div>

          <div className="relative z-10 space-y-4">
            <h3 className="text-xl font-bold text-white">Pro Tips for Great Cover Letters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Personalize each letter with specific details about the company",
                "Use the same keywords from the job description",
                "Tell a compelling story about why you're interested",
                "Keep it concise - no more than one page",
                "Mention specific achievements and results",
                "Proofread carefully for spelling and grammar"
              ].map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-sm text-slate-300">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoverLetter;