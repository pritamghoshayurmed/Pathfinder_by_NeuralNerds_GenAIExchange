import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  Target,
  GraduationCap,
  TrendingUp,
  BarChart3,
  Users,
  Settings,
  LogOut,
  User,
  Home,
  Brain,
  Award,
  Calendar,
  MessageSquare,
  GamepadIcon,
  Heart,
  Calculator,
  FileText,
  Briefcase,
  Code,
  Lightbulb,
  Trophy,
  Clock,
  Globe,
  DollarSign,
  Building,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  full_name: string;
  class_level: string;
}

const AppSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, class_level')
          .eq('user_id', session.user.id)
          .single();
        
        if (data) setProfile(data);
      }
    };
    getProfile();
  }, []);

  // Dynamic navigation based on current dashboard
  const getNavigationItems = () => {
    if (currentPath.includes('/dashboard/early-stage')) {
      return [
        { title: "Overview", url: "/dashboard/early-stage", icon: Home },
        { title: "Aptitude Tests", url: "/dashboard/early-stage/aptitude", icon: Brain },
        { title: "Career Explorer", url: "/dashboard/early-stage/careers", icon: BookOpen },
        { title: "Skill Games", url: "/dashboard/early-stage/games", icon: GamepadIcon },
        { title: "Study Smart", url: "/dashboard/early-stage/study", icon: Target },
        { title: "Stress Relief", url: "/dashboard/early-stage/wellness", icon: Heart },
        { title: "Progress", url: "/dashboard/early-stage/progress", icon: BarChart3 },
      ];
    } else if (currentPath.includes('/dashboard/decision-making')) {
      return [
        { title: "Overview", url: "/dashboard/decision-making", icon: Home },
        { title: "Career Pathways", url: "/dashboard/decision-making/pathways", icon: Target },
        { title: "Exam Preparation", url: "/dashboard/decision-making/exams", icon: BookOpen },
        { title: "College Insights", url: "/dashboard/decision-making/college-insights", icon: GraduationCap },
        { title: "Alternative Careers", url: "/dashboard/decision-making/alternative-careers", icon: Lightbulb },
        { title: "Mentor Network", url: "/dashboard/decision-making/mentors", icon: Users },
        { title: "Mock Tests", url: "/dashboard/decision-making/mock-tests", icon: Trophy },
        // { title: "Progress Analytics", url: "/dashboard/decision-making/analytics", icon: BarChart3 },
      ];
    } else if (currentPath.includes('/dashboard/college-admission')) {
      return [
        { title: "Overview", url: "/dashboard/college-admission", icon: Home },
        { title: "College Comparison", url: "/dashboard/college-admission/compare", icon: Building },
        { title: "Course Matcher", url: "/dashboard/college-admission/matcher", icon: Target },
        { title: "ROI Calculator", url: "/dashboard/college-admission/roi", icon: Calculator },
        { title: "What-If Simulator", url: "/dashboard/college-admission/simulator", icon: Lightbulb },
        { title: "Scholarships", url: "/dashboard/college-admission/scholarships", icon: DollarSign },
        // { title: "Application Tracker", url: "/dashboard/college-admission/applications", icon: FileText },
      ];
    } else if (currentPath.includes('/dashboard/skill-development')) {
      return [
        { title: "Overview", url: "/dashboard/skill-development", icon: Home },
        { title: "Career Advisor", url: "/dashboard/skill-development/career-advisor", icon: Target },
        { title: "Skill Gap Analysis", url: "/dashboard/skill-development/gap-analysis", icon: BarChart3 },
        { title: "Industry Ready skills", url: "/dashboard/skill-development/industry-trends", icon: TrendingUp },
        { title: "Projects & Internships", url: "/dashboard/skill-development/projects-internships", icon: Briefcase },
        { title: "Interview Prep", url: "/dashboard/skill-development/interview-prep", icon: Users },
        { title: "Placement Kit", url: "/dashboard/skill-development/placement-kit", icon: Award },
      ];
    }
    
    // Default navigation for other pages
    return [
      { title: "Dashboard", url: "/dashboard/early-stage", icon: Home },
      { title: "Assessments", url: "/assessments", icon: Brain },
      { title: "Progress", url: "/progress", icon: BarChart3 },
      { title: "Calendar", url: "/calendar", icon: Calendar },
    ];
  };

  const navigationItems = getNavigationItems();

  const getDashboardTitle = () => {
    if (currentPath.includes('/dashboard/early-stage')) return "Awareness Hub";
    if (currentPath.includes('/dashboard/decision-making')) return "Decision Center";
    if (currentPath.includes('/dashboard/college-admission')) return "Admission Portal";
    if (currentPath.includes('/dashboard/skill-development')) return "Skill Academy";
    return "SkillAdvisor";
  };

  const getDashboardSubtitle = () => {
    if (currentPath.includes('/dashboard/early-stage')) return "Explore & Discover";
    if (currentPath.includes('/dashboard/decision-making')) return "Plan & Prepare";
    if (currentPath.includes('/dashboard/college-admission')) return "Choose & Apply";
    if (currentPath.includes('/dashboard/skill-development')) return "Learn & Grow";
    return "AI Career Guidance";
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate('/auth');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    }
  };

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/15 text-primary font-medium border-r-2 border-primary shadow-sm" : "hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors";

  return (
    <Sidebar className={`${isCollapsed ? "w-16" : "w-64"} bg-background border-r border-border/50`} collapsible="icon">
      <SidebarHeader className="border-b border-border/50 p-4 bg-card/30">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-foreground">{getDashboardTitle()}</h2>
              <p className="text-xs text-muted-foreground">{getDashboardSubtitle()}</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 bg-background">
        <SidebarGroup>
          <SidebarGroupLabel className={`${isCollapsed ? "hidden" : ""} text-muted-foreground font-medium`}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4 bg-card/30">
        {!isCollapsed && profile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 hover:bg-muted/50">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {profile.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">{profile.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {profile.class_level.toUpperCase()}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;