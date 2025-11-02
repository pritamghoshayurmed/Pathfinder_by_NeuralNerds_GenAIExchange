import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Code2, 
  Clock, 
  Target, 
  CheckCircle2, 
  Upload, 
  Link, 
  FileText,
  Award,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { ProjectChallenge, projectChallenges } from '@/data/skillsData';

interface ProjectAssessmentProps {
  skillId: string;
  onComplete: (score: number, skillLevel: number) => void;
  onCancel: () => void;
}

interface ProjectSubmission {
  repositoryUrl: string;
  liveUrl?: string;
  description: string;
  challenges: string;
  learnings: string;
  files: File[];
}

const ProjectAssessment: React.FC<ProjectAssessmentProps> = ({
  skillId,
  onComplete,
  onCancel
}) => {
  const projects = projectChallenges.filter(p => p.skillId === skillId);
  const [selectedProject, setSelectedProject] = useState<ProjectChallenge | null>(null);
  const [currentStep, setCurrentStep] = useState<'selection' | 'details' | 'submission' | 'results'>('selection');
  const [submission, setSubmission] = useState<ProjectSubmission>({
    repositoryUrl: '',
    liveUrl: '',
    description: '',
    challenges: '',
    learnings: '',
    files: []
  });
  const [evaluationResults, setEvaluationResults] = useState<{
    criteria: { name: string; score: number; feedback: string }[];
    totalScore: number;
    skillLevel: number;
  } | null>(null);

  const handleProjectSelect = (project: ProjectChallenge) => {
    setSelectedProject(project);
    setCurrentStep('details');
  };

  const handleStartProject = () => {
    setCurrentStep('submission');
  };

  const handleSubmissionChange = (field: keyof ProjectSubmission, value: string) => {
    setSubmission(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSubmission(prev => ({ ...prev, files: [...prev.files, ...files] }));
  };

  const removeFile = (index: number) => {
    setSubmission(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const evaluateSubmission = () => {
    if (!selectedProject) return;

    // Simulated evaluation - in a real app, this would be more sophisticated
    const results = selectedProject.evaluationCriteria.map(criterion => {
      // Generate scores based on submission quality (simplified evaluation)
      let score = Math.random() * 40 + 60; // Base score 60-100

      // Adjust based on submission completeness
      if (criterion.criterion === 'Functionality') {
        if (submission.repositoryUrl && submission.liveUrl) score += 10;
        if (submission.description.length > 100) score += 5;
      } else if (criterion.criterion === 'Code Quality') {
        if (submission.repositoryUrl.includes('github')) score += 5;
        if (submission.description.toLowerCase().includes('clean')) score += 5;
      } else if (criterion.criterion === 'Documentation') {
        if (submission.description.length > 200) score += 10;
        if (submission.learnings.length > 100) score += 5;
      }

      score = Math.min(score, 100);

      const feedback = generateFeedback(criterion.criterion, Math.round(score));

      return {
        name: criterion.criterion,
        score: Math.round(score),
        feedback
      };
    });

    const totalScore = results.reduce((sum, result) => {
      const weight = selectedProject.evaluationCriteria.find(c => c.criterion === result.name)?.weight || 0;
      return sum + (result.score * weight / 100);
    }, 0);

    const skillLevel = calculateSkillLevel(Math.round(totalScore), selectedProject.difficulty);

    setEvaluationResults({
      criteria: results,
      totalScore: Math.round(totalScore),
      skillLevel
    });

    setCurrentStep('results');
    onComplete(Math.round(totalScore), skillLevel);
  };

  const generateFeedback = (criterion: string, score: number): string => {
    const feedbackMap: Record<string, Record<string, string>> = {
      'Functionality': {
        excellent: 'All features work perfectly with excellent user experience.',
        good: 'Most features work well with minor issues that don\'t affect core functionality.',
        average: 'Basic functionality is present but some features need improvement.',
        poor: 'Several core features are missing or not working properly.'
      },
      'Code Quality': {
        excellent: 'Code is well-structured, readable, and follows best practices.',
        good: 'Code is generally clean with good organization and naming conventions.',
        average: 'Code works but could benefit from better organization and consistency.',
        poor: 'Code needs significant improvement in structure and readability.'
      },
      'User Experience': {
        excellent: 'Intuitive and responsive design with excellent user flow.',
        good: 'Good design with minor usability improvements needed.',
        average: 'Functional design but could be more user-friendly.',
        poor: 'Design needs major improvements for better user experience.'
      },
      'Documentation': {
        excellent: 'Comprehensive documentation with clear setup instructions.',
        good: 'Good documentation covering most important aspects.',
        average: 'Basic documentation present but could be more detailed.',
        poor: 'Documentation is lacking or unclear.'
      }
    };

    let level = 'poor';
    if (score >= 90) level = 'excellent';
    else if (score >= 75) level = 'good';
    else if (score >= 60) level = 'average';

    return feedbackMap[criterion]?.[level] || 'No feedback available.';
  };

  const calculateSkillLevel = (score: number, difficulty: string): number => {
    let skillLevel = score;

    // Adjust based on project difficulty
    switch (difficulty) {
      case 'advanced':
        skillLevel += 10; // Bonus for completing advanced projects
        break;
      case 'intermediate':
        skillLevel += 5;
        break;
      case 'beginner':
        break; // No adjustment
    }

    return Math.min(Math.max(skillLevel, 0), 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Code2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No project challenges available for this skill.</p>
          <Button onClick={onCancel} className="mt-4">Go Back</Button>
        </CardContent>
      </Card>
    );
  }

  // Project Selection Step
  if (currentStep === 'selection') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Choose a Project Challenge</h2>
            <p className="text-muted-foreground">Select a project to demonstrate your skills</p>
          </div>
        </div>

        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    {project.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={
                      project.difficulty === 'advanced' ? 'destructive' :
                      project.difficulty === 'intermediate' ? 'default' : 'secondary'
                    }>
                      {project.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="w-4 h-4 mr-1" />
                      {project.timeEstimate}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Requirements:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {project.requirements.slice(0, 3).map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full" />
                          {req}
                        </li>
                      ))}
                      {project.requirements.length > 3 && (
                        <li className="text-xs">+{project.requirements.length - 3} more requirements</li>
                      )}
                    </ul>
                  </div>

                  <Button onClick={() => handleProjectSelect(project)} className="w-full">
                    Select This Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Project Details Step
  if (currentStep === 'details' && selectedProject) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => setCurrentStep('selection')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Badge variant={
              selectedProject.difficulty === 'advanced' ? 'destructive' :
              selectedProject.difficulty === 'intermediate' ? 'default' : 'secondary'
            }>
              {selectedProject.difficulty}
            </Badge>
            <Badge variant="outline">
              <Clock className="w-4 h-4 mr-1" />
              {selectedProject.timeEstimate}
            </Badge>
          </div>
          <CardTitle>{selectedProject.title}</CardTitle>
          <CardDescription>{selectedProject.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Requirements */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Requirements
            </h3>
            <div className="grid gap-2">
              {selectedProject.requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div>
            <h3 className="font-semibold mb-3">Deliverables</h3>
            <div className="grid gap-2">
              {selectedProject.deliverables.map((deliverable, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{deliverable}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation Criteria */}
          <div>
            <h3 className="font-semibold mb-3">How You'll Be Evaluated</h3>
            <div className="space-y-3">
              {selectedProject.evaluationCriteria.map((criteria, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{criteria.criterion}</div>
                    <div className="text-sm text-muted-foreground">{criteria.description}</div>
                  </div>
                  <Badge variant="outline">{criteria.weight}%</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setCurrentStep('selection')} className="flex-1">
              Choose Different Project
            </Button>
            <Button onClick={handleStartProject} className="flex-1">
              Start Project
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Submission Step
  if (currentStep === 'submission' && selectedProject) {
    const isSubmissionValid = submission.repositoryUrl.trim() !== '' && 
                             submission.description.trim() !== '';

    return (
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Project</CardTitle>
          <CardDescription>
            Submit your completed {selectedProject.title} project for evaluation
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Repository URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Repository URL *</label>
            <Input
              placeholder="https://github.com/username/project-name"
              value={submission.repositoryUrl}
              onChange={(e) => handleSubmissionChange('repositoryUrl', e.target.value)}
            />
          </div>

          {/* Live URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Live Application URL</label>
            <Input
              placeholder="https://your-project.vercel.app (optional)"
              value={submission.liveUrl}
              onChange={(e) => handleSubmissionChange('liveUrl', e.target.value)}
            />
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Description *</label>
            <Textarea
              placeholder="Describe your project, technologies used, and key features implemented..."
              value={submission.description}
              onChange={(e) => handleSubmissionChange('description', e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Challenges Faced */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Challenges & Solutions</label>
            <Textarea
              placeholder="What challenges did you face and how did you solve them?"
              value={submission.challenges}
              onChange={(e) => handleSubmissionChange('challenges', e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Key Learnings */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Key Learnings</label>
            <Textarea
              placeholder="What did you learn from this project?"
              value={submission.learnings}
              onChange={(e) => handleSubmissionChange('learnings', e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Files (Screenshots, Documentation)</label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files here, or click to browse
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept="image/*,.pdf,.doc,.docx,.txt,.md"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Choose Files
              </Button>
            </div>
            
            {submission.files.length > 0 && (
              <div className="space-y-2">
                {submission.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setCurrentStep('details')} className="flex-1">
              Back to Details
            </Button>
            <Button 
              onClick={evaluateSubmission}
              disabled={!isSubmissionValid}
              className="flex-1"
            >
              Submit for Evaluation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Results Step
  if (currentStep === 'results' && evaluationResults) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Award className="w-16 h-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">Project Evaluated!</CardTitle>
          <CardDescription>Here are your results for {selectedProject?.title}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Score */}
          <div className="text-center space-y-4">
            <div className={`text-6xl font-bold ${getScoreColor(evaluationResults.totalScore)}`}>
              {evaluationResults.totalScore}%
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Skill Level: {evaluationResults.skillLevel}%
            </Badge>
          </div>

          {/* Detailed Results */}
          <div className="space-y-4">
            <h3 className="font-semibold">Evaluation Breakdown</h3>
            {evaluationResults.criteria.map((result, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.name}</span>
                  <span className={`font-bold ${getScoreColor(result.score)}`}>
                    {result.score}%
                  </span>
                </div>
                <Progress value={result.score} className="h-2" />
                <p className="text-sm text-muted-foreground">{result.feedback}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setCurrentStep('selection')} className="flex-1">
              Try Another Project
            </Button>
            <Button onClick={onCancel} className="flex-1">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default ProjectAssessment;