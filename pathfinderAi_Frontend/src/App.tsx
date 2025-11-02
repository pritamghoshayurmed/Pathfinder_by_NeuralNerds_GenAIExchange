import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatbotIcon from "@/components/ChatbotIcon"; // Add this import
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import EarlyStageDashboard from "./pages/dashboards/EarlyStageDashboard";
import DecisionMakingDashboard from "./pages/dashboards/DecisionMakingDashboard";
import CollegeAdmissionDashboard from "./pages/dashboards/CollegeAdmissionDashboard";
import SkillDevelopmentDashboard from "./pages/dashboards/SkillDevelopmentDashboard";

// Early Stage Dashboard Components
import AptitudeTests from "./pages/dashboards/early-stage/AptitudeTests";
import CareerExplorer from "./pages/dashboards/early-stage/CareerExplorer";
import SkillGames from "./pages/dashboards/early-stage/SkillGames";
import StudySmart from "./pages/dashboards/early-stage/StudySmart";
import StressRelief from "./pages/dashboards/early-stage/StressRelief";
import ProgressTracking from "./pages/dashboards/early-stage/ProgressTracking";

// Decision Making Dashboard Components
import CareerPathways from "./pages/dashboards/decision-making/CareerPathways";
import ExamPreparation from "./pages/dashboards/decision-making/ExamPreparation";
import CollegeInsights from "./pages/dashboards/decision-making/CollegeInsights";
import AlternativeCareers from "./pages/dashboards/decision-making/AlternativeCareers";
import MentorNetwork from "./pages/dashboards/decision-making/MentorNetwork";
import MockTests from "./pages/dashboards/decision-making/MockTests";
import ProgressAnalytics from "./pages/dashboards/decision-making/ProgressAnalytics";

// College Admission Dashboard Components
import CollegeComparison from "./pages/dashboards/college-admission/CollegeComparison";
import CourseMatcher from "./pages/dashboards/college-admission/CourseMatcher";
import CourseDetailTree from "./pages/dashboards/college-admission/CourseDetailTree";
import ROICalculator from "./pages/dashboards/college-admission/ROICalculator";
import WhatIfSimulator from "./pages/dashboards/college-admission/WhatIfSimulator";
import Scholarships from "./pages/dashboards/college-admission/Scholarships";
import ApplicationTracker from "./pages/dashboards/college-admission/ApplicationTracker";

// Skill Development Dashboard Components
import SkillGapAnalysis from "./pages/dashboards/skill-development/SkillGapAnalysis";
import CareerAdvisor from "./pages/dashboards/skill-development/CareerAdvisor";
import IndustryTrends from "./pages/dashboards/skill-development/IndustryTrends";
import ProjectsInternships from "./pages/dashboards/skill-development/ProjectsInternships";
import ProjectDetail from "./pages/dashboards/skill-development/ProjectDetail";
import SkillTraining from "./pages/dashboards/skill-development/SkillTraining";
import InterviewPrep from "./pages/dashboards/skill-development/InterviewPrep";
import PlacementKit from "./pages/dashboards/skill-development/PlacementKit";

// Placement Kit Sub-sections
import ATSScanner from "./pages/dashboards/skill-development/ATSScanner";
import ResumeBuilder from "./pages/dashboards/skill-development/ResumeBuilder";
import CoverLetter from "./pages/dashboards/skill-development/CoverLetter";
import Portfolio from "./pages/dashboards/skill-development/Portfolio";
import InterviewQuestions from "./pages/dashboards/skill-development/InterviewQuestions";
import ATSHistory from './pages/dashboards/skill-development/ATSHistory';
import AvailableDocuments from './pages/dashboards/skill-development/AvailableDocuments';

// Interview Preparation Flow
import MachineCoding from "./pages/interview/rounds/MachineCoding";
import TechnicalDiscussion from "./pages/interview/rounds/TechnicalDiscussion";
import SystemDesign from "./pages/interview/rounds/SystemDesign";
import Behavioral from "./pages/interview/rounds/Behavioral";
import InterviewSummary from "./pages/interview/InterviewSummary";

import MockTestPage from "./Test/jeemain"; // Import jeemain.tsx
import NEETTestPage from './Test/neet';
import JEEAdvancedTestPage from './Test/jeeadvanced';
import CUETTestPage from './Test/cuet';
import CLATTestPage from './Test/clat';
import EmailConfirmed from "@/pages/EmailConfirmed";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Early Stage Dashboard Routes */}
          <Route path="/dashboard/early-stage" element={<EarlyStageDashboard />} />
          <Route path="/dashboard/early-stage/aptitude" element={<AptitudeTests />} />
          <Route path="/dashboard/early-stage/careers" element={<CareerExplorer />} />
          <Route path="/dashboard/early-stage/career-pathways/:fieldId" element={<CareerExplorer />} />
          <Route path="/dashboard/early-stage/games" element={<SkillGames />} />
          <Route path="/dashboard/early-stage/study" element={<StudySmart />} />
          <Route path="/dashboard/early-stage/wellness" element={<StressRelief />} />
          <Route path="/dashboard/early-stage/progress" element={<ProgressTracking />} />
          
          {/* Decision Making Dashboard Routes */}
          <Route path="/dashboard/decision-making" element={<DecisionMakingDashboard />} />
          <Route path="/dashboard/decision-making/pathways" element={<CareerPathways />} />
          <Route path="/dashboard/decision-making/exams" element={<ExamPreparation />} />
          <Route path="/dashboard/decision-making/college-insights" element={<CollegeInsights />} />
          <Route path="/dashboard/decision-making/alternative-careers" element={<AlternativeCareers />} />
          <Route path="/dashboard/decision-making/mentors" element={<MentorNetwork />} />
          <Route path="/dashboard/decision-making/mock-tests" element={<MockTests />} />
          <Route path="/dashboard/decision-making/analytics" element={<ProgressAnalytics />} />
          
          {/* College Admission Dashboard Routes */}
          <Route path="/dashboard/college-admission" element={<CollegeAdmissionDashboard />} />
          <Route path="/dashboard/college-admission/compare" element={<CollegeComparison />} />
          <Route path="/dashboard/college-admission/matcher" element={<CourseMatcher />} />
          <Route path="/dashboard/college-admission/course-tree/:courseId" element={<CourseDetailTree />} />
          <Route path="/dashboard/college-admission/roi" element={<ROICalculator />} />
          <Route path="/dashboard/college-admission/simulator" element={<WhatIfSimulator />} />
          <Route path="/dashboard/college-admission/scholarships" element={<Scholarships />} />
          <Route path="/dashboard/college-admission/applications" element={<ApplicationTracker />} />
          
          {/* Skill Development Dashboard Routes */}
          <Route path="/dashboard/skill-development" element={<SkillDevelopmentDashboard />} />
          <Route path="/dashboard/skill-development/gap-analysis" element={<SkillGapAnalysis />} />
          <Route path="/dashboard/skill-development/career-advisor" element={<CareerAdvisor />} />
          <Route path="/dashboard/skill-development/industry-trends" element={<IndustryTrends />} />
          <Route path="/dashboard/skill-development/projects-internships" element={<ProjectsInternships />} />
          <Route path="/dashboard/skill-development/projects-internships/:projectId" element={<ProjectDetail />} />
          <Route path="/dashboard/skill-development/skill-training" element={<SkillTraining />} />
          <Route path="/dashboard/skill-development/interview-prep" element={<InterviewPrep />} />
          <Route path="/dashboard/skill-development/placement-kit" element={<PlacementKit />} />
          
          {/* Placement Kit Sub-routes */}
          <Route path="/dashboard/skill-development/placement-kit/atsscanner" element={<ATSScanner />} />
          <Route path="/dashboard/skill-development/placement-kit/resumebuilder" element={<ResumeBuilder />} />
          <Route path="/dashboard/skill-development/placement-kit/coverletter" element={<CoverLetter />} />
          <Route path="/dashboard/skill-development/placement-kit/portfolio" element={<Portfolio />} />
          <Route path="/dashboard/skill-development/placement-kit/interviewquestion" element={<InterviewQuestions />} />
          <Route path="/dashboard/skill-development/ats-history" element={<ATSHistory />} />
          <Route path="/dashboard/skill-development/available-documents" element={<AvailableDocuments />} />
          
          {/* Interview Preparation Flow Routes */}
          <Route path="/interview/round/1" element={<MachineCoding />} />
          <Route path="/interview/round/2" element={<TechnicalDiscussion />} />
          <Route path="/interview/round/3" element={<SystemDesign />} />
          <Route path="/interview/round/4" element={<Behavioral />} />
          <Route path="/interview/summary" element={<InterviewSummary />} />
          
          {/* Mock Test Routes */}
          <Route path="/jeemain" element={<MockTestPage />} />
          <Route path="/neet" element={<NEETTestPage />} />
          <Route path="/jeeadvanced" element={<JEEAdvancedTestPage />} />
          <Route path="/cuet" element={<CUETTestPage />} />
          <Route path="/clat" element={<CLATTestPage />} />
          
          {/* Email Confirmation Route */}
          <Route path="/email-confirmed" element={<EmailConfirmed />} />
          
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Add Chatbot Icon - it will appear on all pages */}
        <ChatbotIcon />
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;