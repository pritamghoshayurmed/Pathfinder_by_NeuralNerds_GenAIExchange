import { BookOpen, Target, Clock, TrendingUp, Award, Code, Trophy, Lightbulb, Rocket, CheckCircle2, Star, Zap, AlertCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface LearningPathStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  duration: string;
  resources: {
    type: string;
    title: string;
    url?: string;
  }[];
  skills: string[];
  projects: string[];
  milestones: string[];
}

interface DetailedLearningPath {
  career: string;
  overview: string;
  totalDuration: string;
  difficulty: string;
  prerequisites: string[];
  outcomes: string[];
  phases: LearningPathStep[];
  certifications: string[];
  jobMarket: {
    averageSalary: string;
    demandLevel: string;
    topCompanies: string[];
    requiredSkills: string[];
  };
}

interface LearningPathProps {
  path: DetailedLearningPath;
  onStartNew?: () => void;
}

const getPhaseIcon = (index: number) => {
  const icons = [Target, Lightbulb, Code, BookOpen, Rocket, Trophy];
  return icons[index % icons.length];
};

const getResourceIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'course':
      return BookOpen;
    case 'book':
      return BookOpen;
    case 'video':
      return Star;
    case 'documentation':
      return Code;
    case 'practice':
      return Zap;
    case 'article':
      return Star;
    default:
      return ExternalLink;
  }
};

export const LearningPath = ({ path, onStartNew }: LearningPathProps) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-700/50 shadow-2xl">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{path.career}</h2>
                    <p className="text-base text-slate-300 mb-4 max-w-3xl">{path.overview}</p>
                  </div>
                  {onStartNew && (
                    <Button
                      onClick={onStartNew}
                      variant="outline"
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Start New
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 px-3 py-1">
                    <Clock className="w-4 h-4 mr-2" />
                    {path.totalDuration}
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 px-3 py-1">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {path.difficulty}
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 px-3 py-1">
                    <Award className="w-4 h-4 mr-2" />
                    {path.phases.length} Phases
                  </Badge>
                </div>
              </div>
            </div>

            {/* Prerequisites & Outcomes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    Prerequisites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {path.prerequisites.map((prereq, idx) => (
                      <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    Learning Outcomes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {path.outcomes.slice(0, 3).map((outcome, idx) => (
                      <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                        <Star className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Phases */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            Learning Phases
          </h3>
          <Badge variant="outline" className="border-slate-600 text-slate-400">
            {path.phases.length} Phases Total
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {path.phases.map((phase, index) => {
            const Icon = getPhaseIcon(index);
            const progress = ((index) / path.phases.length) * 100;

            return (
              <Card
                key={phase.id}
                className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Phase Header */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xl text-white shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Badge variant="outline" className="border-purple-500/50 text-purple-300 mb-2">
                              {phase.phase}
                            </Badge>
                            <h4 className="text-xl font-bold text-white flex items-center gap-2">
                              <Icon className="w-5 h-5 text-purple-400" />
                              {phase.title}
                            </h4>
                          </div>
                          <Badge className="bg-slate-700 text-slate-300 border-slate-600">
                            <Clock className="w-3 h-3 mr-1" />
                            {phase.duration}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">{phase.description}</p>
                        <Progress value={progress} className="h-1" />
                      </div>
                    </div>

                    {/* Phase Content Tabs */}
                    <Tabs defaultValue="skills" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 bg-slate-900/50">
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="milestones">Milestones</TabsTrigger>
                      </TabsList>

                      <TabsContent value="skills" className="space-y-3 mt-4">
                        <div className="flex flex-wrap gap-2">
                          {phase.skills.map((skill, idx) => (
                            <Badge
                              key={idx}
                              className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="resources" className="space-y-2 mt-4">
                        {phase.resources.map((resource, idx) => {
                          const ResourceIcon = getResourceIcon(resource.type);
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-purple-500/50 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <ResourceIcon className="w-4 h-4 text-purple-400" />
                                <div>
                                  <p className="text-sm font-medium text-slate-200">{resource.title}</p>
                                  <p className="text-xs text-slate-500">{resource.type}</p>
                                </div>
                              </div>
                              {resource.url && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-purple-400 hover:text-purple-300"
                                  onClick={() => window.open(resource.url, '_blank')}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </TabsContent>

                      <TabsContent value="projects" className="space-y-2 mt-4">
                        {phase.projects.map((project, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700"
                          >
                            <Code className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-300">{project}</p>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="milestones" className="space-y-2 mt-4">
                        {phase.milestones.map((milestone, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-300">{milestone}</p>
                          </div>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Job Market & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Market */}
        <Card className="bg-gradient-to-br from-emerald-900/20 to-green-900/20 border-emerald-700/40">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Job Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">Average Salary</p>
              <p className="text-2xl font-bold text-emerald-400">{path.jobMarket.averageSalary}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">Demand Level</p>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-sm px-3 py-1">
                <TrendingUp className="w-4 h-4 mr-2" />
                {path.jobMarket.demandLevel}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">Top Companies</p>
              <div className="flex flex-wrap gap-2">
                {path.jobMarket.topCompanies.slice(0, 5).map((company, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-slate-700 text-slate-300 text-xs"
                  >
                    {company}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {path.jobMarket.requiredSkills.slice(0, 5).map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-700/40">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              Recommended Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {path.certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700"
              >
                <Star className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">{cert}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Success Message */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-700/40">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Rocket className="w-10 h-10 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">Ready to Start Your Journey! 🚀</h3>
          <p className="text-base text-slate-300 max-w-2xl mx-auto">
            Follow this comprehensive roadmap step by step, and you'll be well on your way to becoming a successful {path.career}. 
            Each phase builds upon the previous one, ensuring you develop the skills and experience needed to excel in your career.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-4 py-2">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {path.phases.length} Phases Planned
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              {path.totalDuration} Journey
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              Career Ready
            </Badge>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};