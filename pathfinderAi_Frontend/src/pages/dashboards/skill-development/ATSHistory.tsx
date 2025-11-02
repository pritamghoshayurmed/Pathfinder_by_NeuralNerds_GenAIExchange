import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { atsScanStorageService, ATSScanRecord } from "@/services/atsScanStorageService";
import { 
  FileText, 
  Download, 
  Trash2, 
  Star, 
  Calendar,
  TrendingUp,
  Search,
  Filter,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ATSHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scans, setScans] = useState<ATSScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statistics, setStatistics] = useState({
    totalScans: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    favoriteCount: 0
  });

  useEffect(() => {
    loadScans();
    loadStatistics();
  }, []);

  const loadScans = async () => {
    setLoading(true);
    const { data, error } = await atsScanStorageService.getUserScans(50, 0);
    
    if (error) {
      toast({
        title: "Error Loading History",
        description: error,
        variant: "destructive",
      });
    } else if (data) {
      setScans(data);
    }
    setLoading(false);
  };

  const loadStatistics = async () => {
    const stats = await atsScanStorageService.getScanStatistics();
    setStatistics(stats);
  };

  const handleDownloadPDF = async (scan: ATSScanRecord) => {
    if (!scan.pdf_path) {
      toast({
        title: "No PDF Available",
        description: "This scan doesn't have a PDF report.",
        variant: "destructive",
      });
      return;
    }

    const signedUrl = await atsScanStorageService.getPDFSignedUrl(scan.pdf_path);
    
    if (signedUrl) {
      window.open(signedUrl, '_blank');
    } else {
      toast({
        title: "Download Error",
        description: "Failed to generate download link.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteScan = async (scanId: string) => {
    if (!confirm('Are you sure you want to delete this scan?')) return;

    const result = await atsScanStorageService.deleteScan(scanId);
    
    if (result.success) {
      toast({
        title: "Scan Deleted",
        description: "The scan has been removed from your history.",
        variant: "default",
      });
      loadScans();
      loadStatistics();
    } else {
      toast({
        title: "Delete Error",
        description: result.error || "Failed to delete scan.",
        variant: "destructive",
      });
    }
  };

  const handleToggleFavorite = async (scanId: string, currentStatus: boolean) => {
    const result = await atsScanStorageService.toggleFavorite(scanId, !currentStatus);
    
    if (result.success) {
      loadScans();
      loadStatistics();
    } else {
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadScans();
      return;
    }

    const { data, error } = await atsScanStorageService.searchScans(searchQuery);
    
    if (error) {
      toast({
        title: "Search Error",
        description: error,
        variant: "destructive",
      });
    } else if (data) {
      setScans(data);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-400";
    if (score >= 50) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/dashboard/skill-development/placement-kit')}
          variant="ghost"
          className="text-slate-400 hover:text-white hover:bg-slate-800/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Placement Kit
        </Button>

        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-2xl p-8 border border-slate-700/50">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-100 bg-clip-text text-transparent mb-4">
            ATS Scan History
          </h1>
          <p className="text-slate-400">View and manage your previous resume scans</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/30 p-6">
            <p className="text-sm text-slate-400 mb-2">Total Scans</p>
            <p className="text-3xl font-bold text-blue-300">{statistics.totalScans}</p>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/30 p-6">
            <p className="text-sm text-slate-400 mb-2">Average Score</p>
            <p className="text-3xl font-bold text-emerald-300">{statistics.averageScore}%</p>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/30 p-6">
            <p className="text-sm text-slate-400 mb-2">Highest Score</p>
            <p className="text-3xl font-bold text-purple-300">{statistics.highestScore}%</p>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/30 p-6">
            <p className="text-sm text-slate-400 mb-2">Lowest Score</p>
            <p className="text-3xl font-bold text-amber-300">{statistics.lowestScore}%</p>
          </Card>
          <Card className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-500/30 p-6">
            <p className="text-sm text-slate-400 mb-2">Favorites</p>
            <p className="text-3xl font-bold text-pink-300">{statistics.favoriteCount}</p>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search scans by filename or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Search
          </Button>
          <Button
            onClick={loadScans}
            variant="outline"
            className="border-slate-700 hover:bg-slate-800/50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        {/* Scans List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full"></div>
          </div>
        ) : scans.length === 0 ? (
          <Card className="bg-slate-800/30 border-slate-700/50 p-12 text-center">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No scans found</p>
            <p className="text-slate-500 text-sm mt-2">Upload a resume to get started</p>
            <Button
              onClick={() => navigate('/dashboard/skill-development/ats-scanner')}
              className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500"
            >
              Scan Resume
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {scans.map((scan) => (
              <Card
                key={scan.id}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 p-6 hover:border-blue-500/40 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-5 h-5 text-blue-300" />
                      <h3 className="font-semibold text-white text-lg">{scan.file_name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFavorite(scan.id, scan.is_favorite)}
                        className="p-1 h-auto"
                      >
                        <Star
                          className={`w-4 h-4 ${scan.is_favorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`}
                        />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(scan.created_at).toLocaleDateString()}
                      </div>
                      {scan.job_description && (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40">
                          Job Matched
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Overall</p>
                        <p className={`text-2xl font-bold ${getScoreColor(scan.overall_score)}`}>
                          {scan.overall_score}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Parseability</p>
                        <p className="text-lg font-semibold text-slate-300">{scan.parseability}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Keywords</p>
                        <p className="text-lg font-semibold text-slate-300">{scan.keyword_match}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Formatting</p>
                        <p className="text-lg font-semibold text-slate-300">{scan.formatting}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {scan.pdf_path && (
                      <Button
                        size="sm"
                        onClick={() => handleDownloadPDF(scan)}
                        className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteScan(scan.id)}
                      className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ATSHistory;