import { useState, useMemo, useEffect } from "react";
import { Eye, Plus, Download, Trash2, Code, Share2, ArrowRight, Zap, ArrowLeft, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { PortfolioForm } from "@/components/PortfolioForm";
import { PortfolioPreview } from "@/components/PortfolioPreview";
import { PortfolioHTMLGenerator } from "@/services/portfolioService";
import { PortfolioData } from "@/types/portfolio";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface SavedPortfolio {
  id: string;
  name: string;
  data: PortfolioData;
  status: "published" | "draft";
  views: number;
  createdAt: string;
  html_url?: string;
  user_id?: string;
}

const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  fullName: "John Doe",
  headline: "Full Stack Developer | React & Node.js Specialist",
  bio: "Passionate about building amazing digital experiences",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  about: "I'm a full-stack developer with 5+ years of experience building web applications. I specialize in React, Node.js, and cloud technologies. Always learning new technologies and best practices.",
  projects: [
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "Full-stack MERN application with Stripe integration and real-time inventory management. Features include user authentication, product filtering, payment processing, and admin dashboard.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      featured: true,
      liveUrl: "https://example.com",
      githubUrl: "https://github.com"
    },
    {
      id: "2",
      title: "AI Chat Application",
      description: "Real-time messaging platform with machine learning features for sentiment analysis. Built with modern web technologies and deployed on cloud infrastructure.",
      technologies: ["React", "Firebase", "TensorFlow", "Socket.io"],
      featured: true,
      liveUrl: "https://example.com",
      githubUrl: "https://github.com"
    }
  ],
  skills: [
    { category: "Frontend", skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Redux"] },
    { category: "Backend", skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "GraphQL"] },
    { category: "Tools & Platforms", skills: ["Git", "Docker", "AWS", "CI/CD", "Figma"] }
  ],
  experience: [
    {
      id: "1",
      title: "Senior Developer",
      company: "Tech Company",
      startDate: "Jan 2023",
      endDate: "Present",
      isCurrently: true,
      description: "Leading development of core platform features. Mentoring junior developers and implementing best practices across the team.",
      technologies: ["React", "Node.js", "AWS"]
    },
    {
      id: "2",
      title: "Full Stack Developer",
      company: "Digital Agency",
      startDate: "Jun 2021",
      endDate: "Dec 2022",
      isCurrently: false,
      description: "Developed and maintained multiple client projects. Worked with cross-functional teams to deliver high-quality solutions.",
      technologies: ["React", "Express", "PostgreSQL"]
    }
  ],
  education: [
    {
      id: "1",
      school: "State University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      graduationDate: "2019",
      details: "GPA: 3.8/4.0. Focus on software engineering and algorithms."
    }
  ],
  socialLinks: [
    { platform: "github", url: "https://github.com" },
    { platform: "linkedin", url: "https://linkedin.com" },
    { platform: "twitter", url: "https://twitter.com" }
  ],
  templateId: 'modern-tech',
  theme: "modern",
  accentColor: "#6366f1"
};

const PortfolioBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [view, setView] = useState<"grid" | "editor">("grid");
  const [portfolios, setPortfolios] = useState<SavedPortfolio[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentData, setCurrentData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [activeTab, setActiveTab] = useState("personal");

  const generatedHTML = useMemo(() => {
    return PortfolioHTMLGenerator.generateHTML(currentData);
  }, [currentData]);

  // Get user and load portfolios on mount
  useEffect(() => {
    const getUserAndLoadPortfolios = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          await loadUserPortfolios(user.id);
        } else {
          toast({
            title: "Authentication Required",
            description: "Please log in to access your portfolios",
            variant: "destructive",
          });
          setIsLoadingPortfolios(false);
        }
      } catch (error) {
        console.error("Error getting user:", error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
        setIsLoadingPortfolios(false);
      }
    };

    getUserAndLoadPortfolios();
  }, []);

  // Load user's portfolios from Supabase
  const loadUserPortfolios = async (uid: string) => {
    setIsLoadingPortfolios(true);
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const loadedPortfolios: SavedPortfolio[] = data.map(record => ({
          id: record.id,
          name: record.name,
          data: record.portfolio_data as PortfolioData,
          status: record.status as "published" | "draft",
          views: record.views || 0,
          createdAt: record.created_at,
          html_url: record.html_url,
          user_id: record.user_id
        }));

        setPortfolios(loadedPortfolios);
        console.log(`✅ Loaded ${loadedPortfolios.length} portfolios`);
      }
    } catch (error: any) {
      console.error('Error loading portfolios:', error);
      toast({
        title: "Error",
        description: "Failed to load your portfolios. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPortfolios(false);
    }
  };

  const handleNewPortfolio = () => {
    const newPortfolio: SavedPortfolio = {
      id: Date.now().toString(),
      name: `Portfolio ${portfolios.length + 1}`,
      data: { ...DEFAULT_PORTFOLIO_DATA },
      status: "draft",
      views: 0,
      createdAt: new Date().toISOString()
    };
    setEditingId(newPortfolio.id);
    setCurrentData(newPortfolio.data);
    setView("editor");
    setActiveTab("personal");
  };

  const handleEditPortfolio = (portfolio: SavedPortfolio) => {
    setEditingId(portfolio.id);
    setCurrentData(portfolio.data);
    setView("editor");
  };

  const handleSavePortfolio = async () => {
    if (!editingId || !userId) {
      toast({
        title: "Error",
        description: "You must be logged in to save portfolios",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // 1. Generate HTML content
      const htmlContent = PortfolioHTMLGenerator.generateHTML(currentData);
      
      // 2. Upload HTML to Supabase Storage
      const fileName = `${userId}/${editingId}/index.html`;
      const { error: uploadError } = await supabase.storage
        .from('portfolios')
        .upload(fileName, new Blob([htmlContent], { type: 'text/html' }), {
          upsert: true,
          contentType: 'text/html'
        });

      if (uploadError) throw uploadError;

      // 3. Get public URL for the uploaded HTML
      const { data: urlData } = supabase.storage
        .from('portfolios')
        .getPublicUrl(fileName);

      const htmlUrl = urlData.publicUrl;

      // 4. Prepare portfolio record
      const portfolioRecord = {
        user_id: userId,
        name: currentData.fullName || "Untitled Portfolio",
        portfolio_data: currentData,
        html_url: htmlUrl,
        html_path: fileName,
        status: 'draft' as const,
        views: 0,
        updated_at: new Date().toISOString()
      };

      // 5. Check if portfolio exists in database
      const existingPortfolio = portfolios.find(p => p.id === editingId);

      if (existingPortfolio && existingPortfolio.createdAt) {
        // Update existing portfolio
        const { error } = await supabase
          .from('portfolios')
          .update(portfolioRecord)
          .eq('id', editingId)
          .eq('user_id', userId);

        if (error) throw error;

        toast({
          title: "Portfolio Updated",
          description: "Your portfolio has been saved successfully!",
        });
      } else {
        // Insert new portfolio
        const { error } = await supabase
          .from('portfolios')
          .insert({
            id: editingId,
            ...portfolioRecord
          });

        if (error) throw error;

        toast({
          title: "Portfolio Saved",
          description: "Your portfolio has been created successfully!",
        });
      }

      // 6. Reload portfolios from database
      if (userId) {
        await loadUserPortfolios(userId);
      }

      // 7. Update local state
      setPortfolios(prevPortfolios => {
        const index = prevPortfolios.findIndex(p => p.id === editingId);
        const updatedPortfolio: SavedPortfolio = {
          id: editingId,
          name: currentData.fullName || "Untitled Portfolio",
          data: currentData,
          status: 'draft',
          views: existingPortfolio?.views || 0,
          createdAt: existingPortfolio?.createdAt || new Date().toISOString(),
          html_url: htmlUrl,
          user_id: userId
        };

        if (index >= 0) {
          const newPortfolios = [...prevPortfolios];
          newPortfolios[index] = updatedPortfolio;
          return newPortfolios;
        } else {
          return [updatedPortfolio, ...prevPortfolios];
        }
      });

    } catch (error: any) {
      console.error('Error saving portfolio:', error);
      toast({
        title: "Save Failed",
        description: `Failed to save portfolio: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to delete portfolios",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find the portfolio to get the HTML path
      const portfolio = portfolios.find(p => p.id === id);
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (dbError) throw dbError;

      // Delete HTML from storage (if exists)
      if (portfolio?.html_url) {
        const fileName = `${userId}/${id}/index.html`;
        await supabase.storage
          .from('portfolios')
          .remove([fileName]);
      }

      // Update local state
      setPortfolios(portfolios.filter(p => p.id !== id));
      
      if (editingId === id) {
        setView("grid");
        setEditingId(null);
      }

      toast({
        title: "Portfolio Deleted",
        description: "Your portfolio has been deleted successfully!",
      });

    } catch (error: any) {
      console.error('Error deleting portfolio:', error);
      toast({
        title: "Delete Failed",
        description: `Failed to delete portfolio: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDownloadHTML = () => {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/html;charset=utf-8," + encodeURIComponent(generatedHTML));
    element.setAttribute("download", `${currentData.fullName.replace(/\s+/g, '-').toLowerCase()}-portfolio.html`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Download Started",
      description: "Your portfolio HTML is being downloaded",
    });
  };

  const handleDownloadAsZip = async () => {
    const zip = `
// Portfolio Project Files

// To use this portfolio, save the HTML file and open it in a browser.
// All styles are embedded in the HTML file for easy deployment.

// Deployment Options:
// 1. Netlify: Drag and drop the HTML file
// 2. GitHub Pages: Push to a repository
// 3. Traditional Hosting: Upload to any web server
// 4. Vercel: Connect your Git repository

// Customize Further:
// - Edit the HTML directly to add more sections
// - Modify CSS variables for colors and fonts
// - Add images and media files
// - Implement contact forms with backend services
`;
    
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(zip));
    element.setAttribute("download", `${currentData.fullName.replace(/\s+/g, '-').toLowerCase()}-portfolio-setup.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Setup Guide Downloaded",
      description: "Deployment instructions downloaded",
    });
  };

  // Grid View - Portfolio List
  if (view === "grid") {
    return (
      <DashboardLayout
        title="Portfolio Builder"
        description="Create and showcase your professional portfolio"
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

          {/* Header Section */}
          <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl border border-transparent">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-purple-600/5 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-3xl"></div>
            <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-600/5 to-transparent rounded-full -translate-x-32 -translate-y-32 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-600/5 to-transparent rounded-full translate-x-32 translate-y-32 blur-3xl"></div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500/30 to-pink-500/20 rounded-xl backdrop-blur-sm border border-purple-400/40 shadow-lg">
                      <Eye className="w-8 h-8 text-purple-300" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-100 bg-clip-text text-transparent">
                        Portfolio Builder
                      </h1>
                      <p className="text-purple-300 text-lg font-medium">Create your professional online presence</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleNewPortfolio}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 h-12"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Portfolio
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {[
                  { icon: "⚡", title: "Instant Preview", desc: "See changes in real-time" },
                  { icon: "🎨", title: "Premium Themes", desc: "5 professionally designed themes" },
                  { icon: "📥", title: "Easy Export", desc: "Download as HTML or source code" }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <p className="font-semibold text-white">{feature.title}</p>
                      <p className="text-sm text-slate-300">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Your Portfolios */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Your Portfolios {!isLoadingPortfolios && `(${portfolios.length})`}
            </h2>
            
            {isLoadingPortfolios ? (
              <div className="text-center py-12 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50">
                <Loader className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
                <p className="text-slate-400">Loading your portfolios...</p>
              </div>
            ) : portfolios.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-slate-300 mb-4">No portfolios yet. Create your first one!</p>
                <Button 
                  onClick={handleNewPortfolio}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Portfolio
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolios.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] border border-slate-700/50 hover:border-purple-500/40"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300"></div>

                    <div className="relative z-10 p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                            {portfolio.name}
                          </h3>
                          <p className="text-sm text-slate-400 mt-1">
                            {new Date(portfolio.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={portfolio.status === "published" ? "bg-gradient-to-r from-emerald-500/40 to-emerald-600/30 border-emerald-400/60 text-emerald-100" : "bg-gradient-to-r from-amber-500/40 to-amber-600/30 border-amber-400/60 text-amber-100"}>
                          {portfolio.status === "published" ? "Published" : "Draft"}
                        </Badge>
                      </div>

                      <p className="text-sm text-slate-300 line-clamp-2">
                        {portfolio.data.headline}
                      </p>

                      {portfolio.html_url && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Eye className="w-3 h-3" />
                          <span>{portfolio.views} views</span>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditPortfolio(portfolio)}
                          className="flex-1 bg-purple-500/20 border-purple-500/40 text-purple-300 hover:bg-purple-500/30 text-xs"
                          variant="outline"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        {portfolio.html_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(portfolio.html_url, '_blank')}
                            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700/50 text-xs"
                          >
                            <Share2 className="w-3 h-3 mr-1" />
                            View Live
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeletePortfolio(portfolio.id)}
                          className="text-red-400 hover:bg-red-500/20 px-2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Templates Info */}
          <div className="relative overflow-hidden rounded-2xl p-8 border border-purple-500/40 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"></div>

            <div className="relative z-10 space-y-4">
              <h3 className="text-xl font-bold text-white">Why Build Your Portfolio With Us?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "✨ 5 Premium Professional Themes",
                  "🎨 Full Customization with Live Preview",
                  "📱 Fully Responsive Design",
                  "⚡ SEO Optimized",
                  "📥 Export as HTML",
                  "☁️ Cloud Storage",
                  "🔗 Public Portfolio URLs",
                  "💯 100% Owned by You"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-purple-400">→</span>
                    <span className="text-sm text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Editor View - Split Screen Editor + Preview
  return (
    <DashboardLayout
      title="Portfolio Builder"
      description="Edit and preview your portfolio"
    >
      <div className="p-6 bg-slate-950 h-[calc(100vh-200px)]">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setView("grid");
                setEditingId(null);
              }}
              className="border-slate-600 text-slate-300"
            >
              ← Back
            </Button>
            <h2 className="text-xl font-bold text-white">
              Editing: {portfolios.find(p => p.id === editingId)?.name || "New Portfolio"}
            </h2>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              onClick={handleSavePortfolio}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader className="w-4 h-4 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-1" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadHTML}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-1" />
              Download HTML
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadAsZip}
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              <Code className="w-4 h-4 mr-1" />
              Setup Guide
            </Button>
          </div>
        </div>

        {/* Template Selection */}
        <div className="mb-4 p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg border border-slate-700">
          <p className="text-sm font-semibold text-purple-300 mb-3">Select Template</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {[
              { id: 'modern-tech', name: '🚀 Modern Tech', color: 'from-indigo-500' },
              { id: 'creative', name: '🎨 Creative', color: 'from-pink-500' },
              { id: 'corporate', name: '💼 Corporate', color: 'from-blue-500' },
              { id: 'freelance', name: '✨ Freelance', color: 'from-purple-500' },
              { id: 'agency', name: '🎯 Agency', color: 'from-cyan-500' }
            ].map((template) => (
              <Button
                key={template.id}
                size="sm"
                variant={currentData.templateId === template.id ? 'default' : 'outline'}
                onClick={() => setCurrentData({ ...currentData, templateId: template.id as any })}
                className={currentData.templateId === template.id
                  ? `bg-gradient-to-r ${template.color} to-purple-600 text-white border-0`
                  : 'border-slate-600 text-slate-300 hover:bg-slate-800'
                }
              >
                {template.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Split View - Form on Left, Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Form Section */}
          <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden flex flex-col">
            <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
              <p className="text-sm font-semibold text-purple-300">Edit Portfolio Details</p>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              <PortfolioForm
                data={currentData}
                onChange={setCurrentData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden flex flex-col">
            <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <p className="text-sm font-semibold text-purple-300">Live Preview</p>
              <Badge className="bg-purple-500/30 text-purple-200 border-purple-500/50">
                <Zap className="w-3 h-3 mr-1" />
                Real-time
              </Badge>
            </div>
            <div className="overflow-auto flex-1">
              <PortfolioPreview data={currentData} html={generatedHTML} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PortfolioBuilder;