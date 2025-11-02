import { useState, useEffect, useRef } from "react";
import { TrendingUp, BarChart3, Zap, Target, Brain, Star, ArrowUp, ArrowDown, Minus, Eye, Bookmark, Share2, Filter, Search, ExternalLink, Download, RefreshCw, Play, Pause, Volume2, Maximize, CheckCircle2, Clock, Code2, BookOpen, Award, ChevronRight, X, Terminal, Briefcase, Sparkles, Activity, Calendar, Newspaper, Bell, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";
import geminiService from "@/services/geminiService";
import youtubeService from "@/services/youtubeService";
import CodeEditorNotebook from "@/components/CodeEditorNotebook";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  position: number;
}

const IndustryTrends = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [timeframe, setTimeframe] = useState<string>("2024");
  const [searchTerm, setSearchTerm] = useState<string>("");
 // DELETE THESE:

const [emergingTechInsights, setEmergingTechInsights] = useState<any>(null);

  
  

  // Learning Path State
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [watchedVideos, setWatchedVideos] = useState<Set<number>>(new Set());
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [playlistVideos, setPlaylistVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  // YouTube playlist mappings for popular learning resources
  const youtubePlaylists = {
    "Artificial Intelligence & Machine Learning": {
      url: "https://www.youtube.com/playlist?list=PLZoTAELRMXVPBTrWtJkn3wWQxZkmTXGwe",
      channel: "Krish Naik",
      title: "AI & ML Complete Playlist"
    },
    "Cloud Computing & DevOps": {
      url: "https://youtube.com/playlist?list=PLdpzxOOAlwvIKMhk8WhzN1pYoJ1YU8Csa&si=rTUgG0rKtgkrkXBa",
      channel: "Abhishek Veeramala",
      title: "DevOps Zero to Hero"
    },
    "Cybersecurity": {
      url: "https://youtube.com/playlist?list=PLLKT__MCUeixqHJ1TRqrHsEd6_EdEvo47&si=Rrhmw9Z11JI5GhND",
      channel: "The Cyber Mentor",
      title: "Practical Ethical Hacking"
    },
    "Data Science & Analytics": {
      url: "https://youtube.com/playlist?list=PLjVLYmrlmjGdRs1sGqRrTE-EMraLclJga&si=z4pGhE6RDi91Y-ND",
      channel: "WS Cube Tech",
      title: "Data Science Roadmap (Full Bootcamp Series)"
    },
    "Full-Stack Development": {
      url: "https://youtube.com/playlist?list=PLu71SKxNbfoC4nsN2NTFEHPCyvm_CnbDq&si=SKuJ2MnbnYNJ3HS-",
      channel: "Chai Aur Code by Hitesh sir",
      title: "Full Stack Developer Course"
    },
    "Blockchain & Web3": {
      url: "https://youtu.be/UKQ3el5zh18?si=1GaBKv2fj9w79YV9",
      channel: "web3Mantra",
      title: "Blockchain Developer Tutorials"
    },
    "Mobile Development": {
      url: "https://www.youtube.com/playlist?list=PLWz5rJ2EKKc9CBxr3BVjPTPoDPLdPIFCE",
      channel: "Android Developers (Google)",
      title: "Android Basics & Advanced"
    },
    "UI/UX Design": {
      url: "https://www.youtube.com/live/BU_afT-aIn0?si=4mgR2ViVvLgm6Mb5",
      channel: "Intellipat",
      title: "UX Design: How To Get Started!"
    },
    // Additional popular playlists for related skills
    "Python": {
      url: "https://www.youtube.com/playlist?list=PLZoTAELRMXVMhVyr3Ri9IQ-t5QPBtxzJO",
      channel: "Krish Naik",
      title: "Python Tutorials"
    },
    "React": {
      url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9",
      channel: "The Net Ninja",
      title: "React Tutorial"
    },
    "JavaScript": {
      url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9haFPT7J25Q9umz4bfeMCB",
      channel: "The Net Ninja",
      title: "JavaScript Tutorials"
    },
    "AWS": {
      url: "https://www.youtube.com/playlist?list=PLdpzxOOAlwvJ5PueBXmz5A4wE6L7W0TT",
      channel: "Abhishek Birmal",
      title: "AWS Tutorials"
    },
    "Docker": {
      url: "https://www.youtube.com/playlist?list=PLdpzxOOAlwvI2Jlc26fWdrQCEkgO8sUQj",
      channel: "Abhishek Birmal",
      title: "Docker Tutorials"
    },
    "Kubernetes": {
      url: "https://www.youtube.com/playlist?list=PLdpzxOOAlwvL7Z8PEHXt0q1i9Od-0eHj",
      channel: "Abhishek Birmal",
      title: "Kubernetes Tutorials"
    }
  };

  const handleStartLearning = async (skill: any) => {
    const playlist = youtubePlaylists[skill.skill as keyof typeof youtubePlaylists];

    if (playlist) {
      setSelectedSkill({
        ...skill,
        playlist: playlist
      });
      setIsLearningMode(true);
      setCurrentVideoIndex(0);
      setVideoProgress(0);
      setIsLoadingPlaylist(true);

      try {
        // Fetch real playlist data from YouTube
        const playlistData = await youtubeService.fetchPlaylistVideos(playlist.url);
        setPlaylistVideos(playlistData.videos);
      } catch (error) {
        console.error('Error loading playlist:', error);
        // Keep empty array, will show loading state
        setPlaylistVideos([]);
      } finally {
        setIsLoadingPlaylist(false);
      }
    } else {
      // Fallback to external link
      const searchQuery = encodeURIComponent(`${skill.skill} tutorial playlist`);
      window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleVideoComplete = () => {
    setWatchedVideos(prev => new Set([...prev, currentVideoIndex]));
    const totalVideos = playlistVideos.length || 10;
    const progress = ((watchedVideos.size + 1) / totalVideos) * 100;
    setVideoProgress(progress);
  };

  const handleNextVideo = () => {
    const maxIndex = playlistVideos.length > 0 ? playlistVideos.length - 1 : 9;
    if (currentVideoIndex < maxIndex) {
      setCurrentVideoIndex(prev => prev + 1);
    }
  };

  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
    }
  };

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
  };

  const closeLearningMode = () => {
    setIsLearningMode(false);
    setSelectedSkill(null);
  };

  const extractVideoId = (url: string) => {
    // Extract video ID from YouTube URL
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : '';
  };

  const trendingSkills = [
    {
      id: 1,
      skill: "Artificial Intelligence & Machine Learning",
      category: "Technology",
      demand: 97,
      growth: "+92%",
      salaryRange: "₹18-45L",
      jobOpenings: "35K+",
      trend: "up",
      description: "AI/ML continues to dominate with GPT-4, computer vision, and automation driving unprecedented demand",
      keyAreas: ["Large Language Models", "Computer Vision", "MLOps", "Generative AI", "AutoML"],
      topCompanies: ["Google", "Microsoft", "OpenAI", "Meta", "Amazon", "Tesla"],
      aiInsights: "AI-powered skill assessment shows 91% of learners in this track get job offers within 5 months",
      futureOutlook: "Expected to grow 180% by 2027 with quantum AI integration",
      difficulty: "Advanced",
      timeToLearn: "10-14 months",
      certificationDemand: "Very High",
      remoteWorkFriendly: true,
      industryAdoption: "95%"
    },
    {
      id: 2,
      skill: "Cloud Computing & DevOps",
      category: "Infrastructure",
      demand: 94,
      growth: "+67%",
      salaryRange: "₹10-32L",
      jobOpenings: "28K+",
      trend: "up",
      description: "Multi-cloud strategies and serverless computing dominate with Kubernetes orchestration",
      keyAreas: ["AWS/Azure/GCP", "Kubernetes", "Docker", "CI/CD", "Infrastructure as Code", "Serverless"],
      topCompanies: ["Amazon", "Microsoft", "Google", "Salesforce", "IBM", "Netflix"],
      aiInsights: "AI analysis shows DevOps professionals have 96% job security rating with 40% remote work",
      futureOutlook: "Steady growth expected with edge computing and AI/ML integration",
      difficulty: "Intermediate",
      timeToLearn: "7-10 months",
      certificationDemand: "High",
      remoteWorkFriendly: true,
      industryAdoption: "88%"
    },
    {
      id: 3,
      skill: "Cybersecurity",
      category: "Security",
      demand: 91,
      growth: "+58%",
      salaryRange: "₹12-38L",
      jobOpenings: "18K+",
      trend: "up",
      description: "Zero Trust architecture and AI-driven security solutions critical amid rising cyber threats",
      keyAreas: ["Ethical Hacking", "Cloud Security", "Zero Trust", "AI Security", "Blockchain Security"],
      topCompanies: ["Palo Alto", "CrowdStrike", "Fortinet", "Cisco", "IBM", "Walmart"],
      aiInsights: "AI predicts 250% increase in cybersecurity job demand by 2026 with focus on AI-driven defense",
      futureOutlook: "Explosive growth expected with quantum computing threats and IoT security",
      difficulty: "Advanced",
      timeToLearn: "10-16 months",
      certificationDemand: "Very High",
      remoteWorkFriendly: true,
      industryAdoption: "82%"
    },
    {
      id: 4,
      skill: "Data Science & Analytics",
      category: "Analytics",
      demand: 89,
      growth: "+45%",
      salaryRange: "₹12-28L",
      jobOpenings: "22K+",
      trend: "up",
      description: "AI-powered analytics and real-time data processing driving business intelligence revolution",
      keyAreas: ["Python", "R", "SQL", "Tableau", "Big Data", "Statistics", "Machine Learning"],
      topCompanies: ["Netflix", "Airbnb", "Uber", "LinkedIn", "Facebook", "Spotify"],
      aiInsights: "AI shows data scientists with domain expertise earn 45% more with 60% remote work opportunities",
      futureOutlook: "Integration with AI/ML creating hybrid roles and automated analytics",
      difficulty: "Intermediate",
      timeToLearn: "8-12 months",
      certificationDemand: "High",
      remoteWorkFriendly: true,
      industryAdoption: "78%"
    },
    {
      id: 5,
      skill: "Full-Stack Development",
      category: "Development",
      demand: 87,
      growth: "+38%",
      salaryRange: "₹8-24L",
      jobOpenings: "32K+",
      trend: "up",
      description: "Modern frameworks, microservices, and low-code platforms reshaping development landscape",
      keyAreas: ["React/Vue", "Node.js", "TypeScript", "GraphQL", "Microservices", "Serverless"],
      topCompanies: ["Stripe", "Shopify", "Vercel", "Netlify", "GitHub", "Airbnb"],
      aiInsights: "Full-stack developers with cloud skills see 65% faster career growth and 50% higher salaries",
      futureOutlook: "Shift towards specialized full-stack roles with AI-assisted development",
      difficulty: "Intermediate",
      timeToLearn: "9-13 months",
      certificationDemand: "Medium",
      remoteWorkFriendly: true,
      industryAdoption: "85%"
    },
    {
      id: 6,
      skill: "Blockchain & Web3",
      category: "Emerging Tech",
      demand: 76,
      growth: "+125%",
      salaryRange: "₹20-50L",
      jobOpenings: "5K+",
      trend: "up",
      description: "Enterprise blockchain adoption accelerating with DeFi, NFTs, and decentralized identity solutions",
      keyAreas: ["Smart Contracts", "DeFi", "NFTs", "Solidity", "Ethereum", "Web3.js"],
      topCompanies: ["Coinbase", "Binance", "ConsenSys", "Polygon", "Chainlink", "Aave"],
      aiInsights: "Web3 developers command highest salaries but market volatility requires continuous learning",
      futureOutlook: "Regulatory clarity will drive mainstream adoption with 300% growth potential",
      difficulty: "Advanced",
      timeToLearn: "8-14 months",
      certificationDemand: "Medium",
      remoteWorkFriendly: true,
      industryAdoption: "35%"
    },
    {
      id: 7,
      skill: "Mobile Development",
      category: "Development",
      demand: 81,
      growth: "+32%",
      salaryRange: "₹9-26L",
      jobOpenings: "19K+",
      trend: "stable",
      description: "Cross-platform development and AI integration driving mobile innovation with 5G acceleration",
      keyAreas: ["React Native", "Flutter", "iOS", "Android", "AR/VR", "AI Integration"],
      topCompanies: ["Apple", "Google", "Meta", "Spotify", "TikTok", "Uber"],
      aiInsights: "Mobile developers with AI/ML skills see 52% salary premium and 40% faster promotion rates",
      futureOutlook: "AR/VR integration and AI assistants creating new mobile development paradigms",
      difficulty: "Intermediate",
      timeToLearn: "6-10 months",
      certificationDemand: "Medium",
      remoteWorkFriendly: true,
      industryAdoption: "92%"
    },
    {
      id: 8,
      skill: "UI/UX Design",
      category: "Design",
      demand: 78,
      growth: "+35%",
      salaryRange: "₹7-18L",
      jobOpenings: "12K+",
      trend: "up",
      description: "AI-assisted design tools, accessibility focus, and user experience research reshaping design field",
      keyAreas: ["Design Systems", "Accessibility", "Prototyping", "User Research", "AI Design Tools"],
      topCompanies: ["Adobe", "Figma", "Airbnb", "Spotify", "Slack", "Google"],
      aiInsights: "Designers with technical skills bridge to development teams effectively with 35% higher retention",
      futureOutlook: "AI tools augmenting rather than replacing designers, focus on strategic design thinking",
      difficulty: "Beginner to Intermediate",
      timeToLearn: "5-9 months",
      certificationDemand: "Low",
      remoteWorkFriendly: true,
      industryAdoption: "88%"
    }
  ];

  
  const emergingTechnologies = [
    {
      technology: "Quantum Computing",
      maturityLevel: 18,
      timeToMainstream: "4-6 years",
      potentialImpact: "Revolutionary",
      learningDemand: "Early",
      description: "Quantum computing promises to solve complex optimization problems exponentially faster than classical computers",
      keyCompanies: ["IBM", "Google", "Rigetti", "IonQ"],
      investment: "$2.5B",
      jobOpenings: "500+",
      learningResources: [
        { title: "IBM Quantum Experience", url: "https://quantum-computing.ibm.com/" },
        { title: "Google Quantum AI", url: "https://quantumai.google/" }
      ],
      aiInsights: emergingTechInsights?.insights?.[0] || "Quantum computing expected to reach production readiness by 2027 with major breakthroughs in cryptography and drug discovery"
    },
    {
      technology: "Extended Reality (XR)",
      maturityLevel: 42,
      timeToMainstream: "2-3 years",
      potentialImpact: "High",
      learningDemand: "Growing",
      description: "AR/VR/MR technologies creating immersive digital experiences across gaming, education, and enterprise",
      keyCompanies: ["Meta", "Microsoft", "Apple", "Google"],
      investment: "$8.2B",
      jobOpenings: "2,500+",
      learningResources: [
        { title: "Unity Learn XR", url: "https://learn.unity.com/" },
        { title: "Unreal Engine VR", url: "https://www.unrealengine.com/en-US/" }
      ],
      aiInsights: emergingTechInsights?.insights?.[1] || "Extended Reality (XR) market projected to reach $57B by 2027 with enterprise adoption leading consumer applications"
    },
    {
      technology: "Edge Computing",
      maturityLevel: 58,
      timeToMainstream: "1-2 years",
      potentialImpact: "High",
      learningDemand: "High",
      description: "Processing data closer to source for reduced latency and improved performance in IoT and real-time applications",
      keyCompanies: ["AWS", "Azure", "Google Cloud", "IBM"],
      investment: "$4.1B",
      jobOpenings: "3,200+",
      learningResources: [
        { title: "AWS IoT & Edge Computing", url: "https://aws.amazon.com/iot/" },
        { title: "Azure IoT Edge", url: "https://azure.microsoft.com/en-us/products/iot-edge/" }
      ],
      aiInsights: emergingTechInsights?.insights?.[2] || "Edge computing adoption growing at 300% annually with 5G deployment accelerating implementation"
    },
    {
      technology: "Neuromorphic Computing",
      maturityLevel: 12,
      timeToMainstream: "6-8 years",
      potentialImpact: "Revolutionary",
      learningDemand: "Research",
      description: "Brain-inspired computing architectures for efficient AI processing and cognitive computing applications",
      keyCompanies: ["Intel", "IBM", "Qualcomm", "Samsung"],
      investment: "$1.8B",
      jobOpenings: "200+",
      learningResources: [
        { title: "Intel Neuromorphic Research", url: "https://www.intel.com/content/www/us/en/research/neuromorphic-computing.html" },
        { title: "IBM TrueNorth", url: "https://www.research.ibm.com/articles/true-north" }
      ],
      aiInsights: emergingTechInsights?.insights?.[3] || "Neuromorphic computing showing 400% R&D investment increase with applications in autonomous systems"
    },
    {
      technology: "Sustainable Technology",
      maturityLevel: 35,
      timeToMainstream: "2-4 years",
      potentialImpact: "High",
      learningDemand: "Growing",
      description: "Green computing, renewable energy tech, and carbon-neutral solutions driving the sustainability revolution",
      keyCompanies: ["Tesla", "Microsoft", "Google", "Amazon"],
      investment: "$12.5B",
      jobOpenings: "4,100+",
      learningResources: [
        { title: "Google Carbon Neutral", url: "https://sustainability.google/" },
        { title: "Microsoft Sustainability", url: "https://www.microsoft.com/en-us/sustainability" }
      ],
      aiInsights: emergingTechInsights?.insights?.[4] || "Sustainable tech investments up 250% globally with AI optimization driving efficiency improvements"
    },
    {
      technology: "Web3 & Blockchain 2.0",
      maturityLevel: 48,
      timeToMainstream: "3-5 years",
      potentialImpact: "High",
      learningDemand: "High",
      description: "Decentralized technologies evolving beyond cryptocurrencies to include DeFi, NFTs, and decentralized identity",
      keyCompanies: ["Ethereum", "Polkadot", "Solana", "Avalanche"],
      investment: "$6.8B",
      jobOpenings: "1,800+",
      learningResources: [
        { title: "Ethereum Developer Docs", url: "https://ethereum.org/en/developers/" },
        { title: "Web3 University", url: "https://www.web3.university/" }
      ],
      aiInsights: "Web3 developer demand stabilizing with focus on enterprise adoption and regulatory compliance"
    }
  ];

  
  const filteredSkills = trendingSkills.filter(skill => {
    const matchesCategory = selectedCategory === "all" || skill.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = skill.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.keyAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <ArrowUp className="w-4 h-4 text-green-500" />;
      case "down": return <ArrowDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Intermediate": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Advanced": return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-rose-500/20 text-rose-400 border-rose-500/50";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "low": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "high": return <TrendingUp className="w-3 h-3" />;
      case "medium": return <Minus className="w-3 h-3" />;
      case "low": return <TrendingDown className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  return (
    <DashboardLayout>
      {/* Premium Learning Mode */}
      {isLearningMode && selectedSkill && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-auto">
          <div className="min-h-screen p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeLearningMode}
                  className="text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-white">{selectedSkill.skill}</h1>
                  <p className="text-purple-200 text-sm">Learning Path by {selectedSkill.playlist.channel}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{selectedSkill.timeToLearn}</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span>{watchedVideos.size}/{playlistVideos.length || 10} Completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-200 text-sm font-medium">Overall Progress</span>
                <span className="text-white font-semibold">{Math.round(videoProgress)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
            </div>

            {/* Main Learning Interface - Improved Layout */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left Sidebar - Playlist */}
              <div className="col-span-3">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 sticky top-6">
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-400" />
                      Course Content
                    </CardTitle>
                    <p className="text-purple-300 text-xs mt-1">
                      {playlistVideos.length > 0 ? `${playlistVideos.length} videos` : 'Loading...'}
                    </p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                      {isLoadingPlaylist ? (
                        <div className="p-8 text-center">
                          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
                          <p className="text-purple-200 text-sm">Loading playlist...</p>
                        </div>
                      ) : playlistVideos.length > 0 ? (
                        playlistVideos.map((video, index) => (
                          <button
                            key={video.id}
                            onClick={() => handleVideoSelect(index)}
                            className={`w-full p-3 text-left border-b border-white/5 transition-all ${currentVideoIndex === index
                              ? 'bg-purple-500/20 border-l-4 border-l-purple-500'
                              : 'hover:bg-white/5'
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative flex-shrink-0">
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="w-20 h-12 object-cover rounded"
                                />
                                <div className="absolute bottom-0 right-0 bg-black/80 text-white text-[10px] px-1 rounded">
                                  {video.duration}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2">
                                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${watchedVideos.has(index)
                                    ? 'bg-green-500'
                                    : currentVideoIndex === index
                                      ? 'bg-purple-500'
                                      : 'bg-white/10'
                                    }`}>
                                    {watchedVideos.has(index) ? (
                                      <CheckCircle2 className="w-3 h-3 text-white" />
                                    ) : (
                                      <span className="text-white font-semibold">{index + 1}</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-medium line-clamp-2 ${currentVideoIndex === index ? 'text-white' : 'text-purple-200'
                                      }`}>
                                      {video.title}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-purple-200 text-sm">No videos available</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Side - Video & Code Editor Side by Side */}
              <div className="col-span-9 space-y-6">
                {/* Video Player */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
                      {playlistVideos.length > 0 && playlistVideos[currentVideoIndex] ? (
                        <iframe
                          ref={videoRef}
                          key={playlistVideos[currentVideoIndex].id}
                          className="w-full h-full"
                          src={youtubeService.getEmbedUrl(playlistVideos[currentVideoIndex].id)}
                          title={playlistVideos[currentVideoIndex].title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <RefreshCw className="w-12 h-12 text-purple-400 animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {playlistVideos[currentVideoIndex]?.title || 'Loading...'}
                        </h3>
                        <p className="text-purple-200 text-sm line-clamp-2">
                          {playlistVideos[currentVideoIndex]?.description || 'Master the fundamentals and advanced concepts of this topic'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={handlePreviousVideo}
                          disabled={currentVideoIndex === 0}
                          variant="outline"
                          size="sm"
                          className="bg-white/5 border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={handleVideoComplete}
                          variant="default"
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Mark Complete
                        </Button>
                        <Button
                          onClick={handleNextVideo}
                          disabled={currentVideoIndex >= (playlistVideos.length > 0 ? playlistVideos.length - 1 : 9)}
                          variant="outline"
                          size="sm"
                          className="bg-white/5 border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Code Editor & Notebook - Now directly below video */}
                <CodeEditorNotebook 
                  defaultLanguage={selectedSkill.skill.includes('AI') || selectedSkill.skill.includes('Data Science') ? 'python' : 'javascript'}
                  skillName={selectedSkill.skill}
                />

                {/* Learning Stats Card - Below Editor */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-purple-200">Videos Watched</span>
                          <span className="text-white font-semibold">{watchedVideos.size}/{playlistVideos.length || 10}</span>
                        </div>
                        <Progress value={((watchedVideos.size / (playlistVideos.length || 10)) * 100)} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-purple-200">Time Invested</span>
                          <span className="text-white font-semibold">{watchedVideos.size * 15}m</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-purple-500/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-200 text-xs">Progress</p>
                          <p className="text-white font-semibold">{Math.round(videoProgress)}%</p>
                        </div>
                        <Award className="w-8 h-8 text-yellow-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Premium Dark Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 p-8 shadow-2xl border border-purple-500/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 text-purple-300 hover:bg-purple-500/30">
                    <Brain className="w-3 h-3 mr-1" />
                    AI-Powered Analytics
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-2">Industry Trends</h1>
                <p className="text-slate-300 text-lg">AI-powered insights into emerging skills and market demands</p>

                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-700/50">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-200 text-sm font-medium">Live Market Data</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-700/50">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-slate-200 text-sm font-medium">Real-time Updates</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-700/50">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-200 text-sm font-medium">Premium Insights</span>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </div>

        {/* Premium Dark Search and Filters */}
        <Card className="border border-slate-700/50 shadow-xl bg-slate-900/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search skills, technologies, or companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[200px] h-12 bg-slate-800/50 border-slate-700 text-slate-200">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="emerging tech">Emerging Tech</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[140px] h-12 bg-slate-800/50 border-slate-700 text-slate-200">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="6months">Last 6M</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Dark Tabs */}
        <Tabs defaultValue="trending" className="w-full">
         <TabsList className="grid w-full grid-cols-2 h-14 bg-slate-900/50 border border-slate-700/50 p-1 rounded-xl">
  <TabsTrigger value="trending" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-slate-400 rounded-lg font-semibold transition-all">
    <TrendingUp className="w-4 h-4 mr-2" />
    Trending Skills
  </TabsTrigger>
  <TabsTrigger value="emerging" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white text-slate-400 rounded-lg font-semibold transition-all">
    <Zap className="w-4 h-4 mr-2" />
    Emerging Tech
  </TabsTrigger>
</TabsList>
          <TabsContent value="trending" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSkills.map((skill) => (
                <Card key={skill.id} className="group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 border border-slate-700/50 hover:border-purple-500/50 hover:-translate-y-1 bg-slate-900/50 backdrop-blur-sm">
                  <CardHeader className="pb-3 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-3 text-slate-100 group-hover:text-purple-400 transition-colors">{skill.skill}</CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="border border-slate-600 text-slate-300 bg-slate-800/50">{skill.category}</Badge>
                          <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-500/30">
                            {getTrendIcon(skill.trend)}
                            <span className="text-sm font-bold text-emerald-400">{skill.growth}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-sm leading-relaxed text-slate-400">{skill.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Premium Dark Demand Meter */}
                    <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-4 rounded-xl border border-purple-500/30">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="font-semibold text-slate-200 flex items-center gap-2">
                          <Target className="w-4 h-4 text-purple-400" />
                          Market Demand
                        </span>
                        <span className="font-bold text-purple-400 text-lg">{skill.demand}%</span>
                      </div>
                      <Progress value={skill.demand} className="h-3 bg-slate-800" />
                    </div>

                    {/* Premium Dark Key Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 p-3 rounded-xl border border-emerald-500/30">
                        <span className="text-xs text-slate-400 font-medium">Salary Range</span>
                        <p className="font-bold text-emerald-400 text-lg mt-1">{skill.salaryRange}</p>
                      </div>
                      <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 p-3 rounded-xl border border-cyan-500/30">
                        <span className="text-xs text-slate-400 font-medium">Job Openings</span>
                        <p className="font-bold text-cyan-400 text-lg mt-1">{skill.jobOpenings}</p>
                      </div>
                    </div>

                    {/* Premium Dark Additional Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-3 bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl border border-blue-500/30">
                        <div className="font-bold text-blue-400 text-sm">{skill.certificationDemand}</div>
                        <div className="text-blue-300 text-xs mt-1">Cert Demand</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 rounded-xl border border-emerald-500/30">
                        <div className="font-bold text-emerald-400 text-sm">{skill.remoteWorkFriendly ? 'Yes' : 'No'}</div>
                        <div className="text-emerald-300 text-xs mt-1">Remote Work</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-xl border border-purple-500/30">
                        <div className="font-bold text-purple-400 text-sm">{skill.industryAdoption}%</div>
                        <div className="text-purple-300 text-xs mt-1">Adoption</div>
                      </div>
                    </div>

                    {/* Premium Dark Difficulty and Time */}
                    <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                      <Badge className={`${getDifficultyColor(skill.difficulty)} text-sm px-3 py-1 border`}>
                        {skill.difficulty}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-300">{skill.timeToLearn}</span>
                      </div>
                    </div>

                    {/* Key Areas */}
                    <div>
                      <p className="text-sm font-medium mb-2 text-slate-300">Key Areas:</p>
                      <div className="flex flex-wrap gap-1">
                        {skill.keyAreas.slice(0, 3).map((area, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-slate-800/50 text-slate-300 border-slate-700">{area}</Badge>
                        ))}
                        {skill.keyAreas.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-slate-800/50 text-slate-300 border-slate-700">+{skill.keyAreas.length - 3}</Badge>
                        )}
                      </div>
                    </div>

                    {/* Premium Dark AI Insight */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 p-4 rounded-xl shadow-lg shadow-purple-500/20">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-bold text-white">AI Insight</span>
                          <Badge className="bg-white/20 backdrop-blur-sm border-white/30 text-white text-xs ml-auto">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        </div>
                        <p className="text-sm text-white/95 leading-relaxed">{skill.aiInsights}</p>
                      </div>
                    </div>

                    {/* Premium Dark Actions */}
                    {/* Premium Dark Actions */}
<div>
  <Button
    size="lg"
    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105 shadow-xl shadow-purple-500/25 font-semibold"
    onClick={() => handleStartLearning(skill)}
    title={youtubePlaylists[skill.skill as keyof typeof youtubePlaylists]
      ? `Learn ${skill.skill} from ${youtubePlaylists[skill.skill as keyof typeof youtubePlaylists].channel}`
      : `Search for ${skill.skill} tutorials`}
  >
    <Play className="w-5 h-5 mr-2" />
    Start Learning
  </Button>
  {youtubePlaylists[skill.skill as keyof typeof youtubePlaylists] && (
    <p className="text-xs text-slate-500 mt-2 text-center font-medium">
      via {youtubePlaylists[skill.skill as keyof typeof youtubePlaylists].channel}
    </p>
  )}
</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          

          
          <TabsContent value="emerging" className="mt-6">
            <div className="space-y-6">
              {/* Premium Dark Section Header */}
              <Card className="border border-slate-700/50 bg-gradient-to-br from-slate-900/50 via-orange-900/20 to-slate-900/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl shadow-xl shadow-orange-500/20">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-100">Emerging Technologies Landscape</h3>
                        <p className="text-slate-400 mt-1">AI-powered insights on cutting-edge technologies</p>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0 px-4 py-2 text-sm">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Live AI Analysis
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {emergingTechnologies.map((tech, index) => (
                  <Card key={index} className="group hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 border border-slate-700/50 hover:border-orange-500/50 hover:-translate-y-1 bg-slate-900/50 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-3 text-slate-100 group-hover:text-orange-400 transition-colors">{tech.technology}</CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={tech.potentialImpact === "Revolutionary"
                              ? "bg-gradient-to-r from-orange-600 to-red-600 text-white border-0"
                              : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-0"}>
                              {tech.potentialImpact} Impact
                            </Badge>
                            <Badge variant="outline" className="border border-orange-500/30 text-orange-400 bg-orange-500/10 font-semibold">
                              {tech.learningDemand} Demand
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right bg-gradient-to-br from-emerald-900/30 to-teal-900/30 p-3 rounded-xl border border-emerald-500/30">
                          <div className="text-base font-bold text-emerald-400">{tech.investment}</div>
                          <div className="text-xs text-emerald-300 font-medium">Investment</div>
                        </div>
                      </div>
                      <CardDescription className="text-sm leading-relaxed text-slate-400">{tech.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Premium Dark Market Maturity */}
                      <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 p-4 rounded-xl border border-orange-500/30">
                        <div className="flex justify-between text-sm mb-3">
                          <span className="font-semibold text-slate-200 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-orange-400" />
                            Market Maturity
                          </span>
                          <span className="font-bold text-orange-400 text-lg">{tech.maturityLevel}%</span>
                        </div>
                        <Progress value={tech.maturityLevel} className="h-3 bg-slate-800" />
                      </div>

                      {/* Premium Dark Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-3 rounded-xl border border-purple-500/30">
                          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Time to Mainstream
                          </span>
                          <p className="font-bold text-purple-400 text-base mt-1">{tech.timeToMainstream}</p>
                        </div>
                        <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 p-3 rounded-xl border border-cyan-500/30">
                          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            Job Openings
                          </span>
                          <p className="font-bold text-cyan-400 text-base mt-1">{tech.jobOpenings}</p>
                        </div>
                      </div>

                      {/* Premium Dark Key Companies */}
                      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                        <p className="text-sm font-semibold mb-2 flex items-center gap-2 text-slate-200">
                          <Star className="w-4 h-4 text-amber-400" />
                          Key Players
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {tech.keyCompanies?.slice(0, 3).map((company, idx) => (
                            <Badge key={idx} variant="outline" className="border border-slate-600 bg-slate-800/50 text-slate-300 font-semibold">{company}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Premium Dark AI Insights */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 rounded-xl shadow-lg shadow-purple-500/20">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg">
                              <Brain className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-bold text-white">AI Insight</span>
                          </div>
                          <p className="text-sm text-white/95 leading-relaxed">{tech.aiInsights}</p>
                        </div>
                      </div>

                      {/* Premium Dark Learning Resources */}
                      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                        <p className="text-sm font-semibold mb-2 flex items-center gap-2 text-slate-200">
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          Learning Resources
                        </p>
                        <div className="space-y-2">
                          {tech.learningResources?.slice(0, 2).map((resource, idx) => (
                            <a
                              key={idx}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 hover:underline font-medium p-2 bg-slate-900/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              {resource.title}
                            </a>
                          ))}
                        </div>
                      </div>

                      <Button size="lg" className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg shadow-orange-500/25 font-semibold">
                        <Zap className="w-5 h-5 mr-2" />
                        Track Progress
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

        
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default IndustryTrends;