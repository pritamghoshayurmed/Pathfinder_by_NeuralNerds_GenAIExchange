import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Download, ExternalLink, ArrowLeft, RefreshCw, Search, Trash2, Calendar, FolderOpen, Upload, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { atsScanStorageService } from "@/services/atsScanStorageService";

const AvailableDocuments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scanRecords, setScanRecords] = useState<any[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoadingDocuments(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Authentication error:', authError);
        toast({
          title: "Authentication Error",
          description: "Please log in to view your documents",
          variant: "destructive",
        });
        return;
      }

      // Fetch ATS scan records from database
      const { data: scans, error: scanError } = await supabase
        .from('ats_scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (scanError) {
        console.error('Error fetching scans:', scanError);
        toast({
          title: "Error Loading Documents",
          description: scanError.message,
          variant: "destructive",
        });
      } else {
        setScanRecords(scans || []);
        
        if (scans && scans.length > 0) {
          toast({
            title: "Documents Loaded",
            description: `Found ${scans.length} document(s)`,
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error('Error in fetchDocuments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleDownloadResume = async (scan: any) => {
    if (!scan.resume_file_path) {
      toast({
        title: "No Resume File",
        description: "Original resume file not available.",
        variant: "destructive",
      });
      return;
    }

    try {
      const signedUrl = await atsScanStorageService.getPDFSignedUrl(scan.resume_file_path);
      
      if (signedUrl) {
        window.open(signedUrl, '_blank');
        toast({
          title: "Download Started",
          description: `Opening ${scan.file_name}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Download Error",
          description: "Failed to generate download link.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download resume",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDFReport = async (scan: any) => {
    if (!scan.pdf_path) {
      toast({
        title: "No PDF Report",
        description: "PDF report not available.",
        variant: "destructive",
      });
      return;
    }

    try {
      const signedUrl = await atsScanStorageService.getPDFSignedUrl(scan.pdf_path);
      
      if (signedUrl) {
        window.open(signedUrl, '_blank');
        toast({
          title: "Download Started",
          description: `Opening PDF Report`,
          variant: "default",
        });
      } else {
        toast({
          title: "Download Error",
          description: "Failed to generate download link.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error downloading PDF report:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download PDF report",
        variant: "destructive",
      });
    }
  };

  const handleDeleteScan = async (scanId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return;

    try {
      const result = await atsScanStorageService.deleteScan(scanId);

      if (result.success) {
        toast({
          title: "Document Deleted",
          description: `${fileName} has been removed`,
          variant: "default",
        });
        fetchDocuments();
      } else {
        toast({
          title: "Delete Error",
          description: result.error || "Failed to delete document.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredScans = () => {
    if (!searchQuery.trim()) return scanRecords;
    
    const query = searchQuery.toLowerCase();
    return scanRecords.filter(scan =>
      scan.file_name.toLowerCase().includes(query)
    );
  };

  const filteredScans = getFilteredScans();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/dashboard/skill-development/placement-kit')}
          variant="ghost"
          className="text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Placement Kit
        </Button>

        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-8 shadow-2xl border border-slate-700/50">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-600/5 to-transparent rounded-full -translate-x-32 -translate-y-32 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-600/5 to-transparent rounded-full translate-x-32 translate-y-32 blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500/30 to-purple-500/20 rounded-xl backdrop-blur-sm border border-blue-400/40 shadow-lg">
                  <FolderOpen className="w-8 h-8 text-blue-300" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-100 bg-clip-text text-transparent">
                    Available Documents
                  </h1>
                  <p className="text-slate-400 text-lg mt-1">Manage your resume files and analysis reports</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Total Documents</p>
                    <p className="text-3xl font-bold text-blue-300">{scanRecords.length}</p>
                  </div>
                  <File className="w-10 h-10 text-blue-400/50" />
                </div>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Resume Files</p>
                    <p className="text-3xl font-bold text-emerald-300">{scanRecords.length}</p>
                  </div>
                  <FileText className="w-10 h-10 text-emerald-400/50" />
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button
            onClick={fetchDocuments}
            variant="outline"
            className="border-slate-700 hover:bg-slate-800/50"
            disabled={loadingDocuments}
          >
            <RefreshCw className={`w-4 h-4 ${loadingDocuments ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Documents List */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 p-6">
          {loadingDocuments ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full mb-4"></div>
              <p className="text-slate-400">Loading documents...</p>
            </div>
          ) : filteredScans.length === 0 ? (
            <div className="text-center py-12">
              <File className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                {searchQuery 
                  ? "No documents match your search" 
                  : "No documents found"}
              </p>
              <p className="text-slate-500 text-sm mt-2">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Upload and scan a resume to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Resume Files Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  Resume Files ({filteredScans.length})
                </h3>
                {filteredScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-5 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-emerald-500/40 transition-all group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                        <FileText className="w-6 h-6 text-emerald-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate text-lg">{scan.file_name}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            <span className="text-sm text-slate-400">Original Resume</span>
                          </div>
                          <span className="text-xs text-slate-600">•</span>
                          <span className="text-sm text-slate-400">Score: {scan.overall_score}%</span>
                          <span className="text-xs text-slate-600">•</span>
                          <span className="text-sm text-slate-400">{formatDate(scan.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {scan.resume_file_path && (
                        <Button
                          onClick={() => handleDownloadResume(scan)}
                          size="sm"
                          className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 border border-emerald-500/40"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Resume
                        </Button>
                      )}
                      {scan.pdf_path && (
                        <Button
                          onClick={() => handleDownloadPDFReport(scan)}
                          size="sm"
                          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-300 border border-blue-500/40"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          PDF Report
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDeleteScan(scan.id, scan.file_name)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        {!loadingDocuments && filteredScans.length > 0 && (
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Showing {filteredScans.length} document(s)
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AvailableDocuments;