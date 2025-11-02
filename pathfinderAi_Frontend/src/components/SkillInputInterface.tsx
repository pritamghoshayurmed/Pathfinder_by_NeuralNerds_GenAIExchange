import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Brain, 
  Code, 
  Target, 
  TrendingUp, 
  Play, 
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Save,
  Briefcase
} from 'lucide-react';
import { UserSkill, Skill, SkillCategory, masterSkills } from '@/data/skillsData';
import QuizAssessment from './QuizAssessment';
import ProjectAssessment from './ProjectAssessment';

interface SkillInputInterfaceProps {
  userSkills: UserSkill[];
  onSkillUpdate: (skillId: string, currentLevel: number, targetLevel: number, assessmentMethod: 'self' | 'quiz' | 'project' | 'combined') => void;
  onSkillsUpdate: (skills: UserSkill[]) => void;
}

interface AssessmentState {
  type: 'quiz' | 'project' | null;
  skillId: string | null;
}

const SkillInputInterface: React.FC<SkillInputInterfaceProps> = ({
  userSkills,
  onSkillUpdate,
  onSkillsUpdate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('technical');
  const [assessmentState, setAssessmentState] = useState<AssessmentState>({
    type: null,
    skillId: null
  });
  const [editingSkills, setEditingSkills] = useState<Record<string, { current: number; target: number }>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const categories: { key: SkillCategory; label: string; icon: React.ComponentType<any> }[] = [
    { key: 'technical', label: 'Technical Skills', icon: Code },
    { key: 'soft-skills', label: 'Soft Skills', icon: User },
    { key: 'industry-specific', label: 'Industry Specific', icon: Briefcase },
    { key: 'tools-platforms', label: 'Tools & Platforms', icon: Briefcase },
    { key: 'languages', label: 'Languages', icon: Brain }
  ];

  // Get user skill data or create default
  const getUserSkill = useCallback((skillId: string): UserSkill => {
    const existingUserSkill = userSkills.find(us => us.id === skillId);
    if (existingUserSkill) return existingUserSkill;

    const masterSkill = masterSkills.find(s => s.id === skillId);
    if (!masterSkill) throw new Error(`Skill ${skillId} not found`);

    return {
      ...masterSkill,
      currentLevel: 0,
      targetLevel: 70,
      assessmentMethod: 'self',
      lastAssessed: new Date(),
      confidence: 50
    };
  }, [userSkills]);

  const handleSelfAssessment = (skillId: string, currentLevel: number, targetLevel: number) => {
    setEditingSkills(prev => ({
      ...prev,
      [skillId]: { current: currentLevel, target: targetLevel }
    }));
    setHasUnsavedChanges(true);
  };

  const handleAssessmentComplete = (skillId: string, score: number, skillLevel: number, method: 'quiz' | 'project') => {
    const existingSkill = getUserSkill(skillId);
    const updatedSkill: UserSkill = {
      ...existingSkill,
      currentLevel: skillLevel,
      assessmentMethod: method,
      lastAssessed: new Date(),
      confidence: score // Use assessment score as confidence
    };

    // Update the skills array
    const updatedSkills = userSkills.filter(s => s.id !== skillId);
    updatedSkills.push(updatedSkill);
    onSkillsUpdate(updatedSkills);

    // Call the individual update callback
    onSkillUpdate(skillId, skillLevel, existingSkill.targetLevel, method);

    // Close assessment
    setAssessmentState({ type: null, skillId: null });
  };

  const saveChanges = () => {
    Object.entries(editingSkills).forEach(([skillId, levels]) => {
      onSkillUpdate(skillId, levels.current, levels.target, 'self');
    });
    
    setEditingSkills({});
    setHasUnsavedChanges(false);
  };

  const discardChanges = () => {
    setEditingSkills({});
    setHasUnsavedChanges(false);
  };

  const getSkillLevel = (skillId: string): { current: number; target: number } => {
    if (editingSkills[skillId]) {
      return editingSkills[skillId];
    }
    const userSkill = getUserSkill(skillId);
    return { current: userSkill.currentLevel, target: userSkill.targetLevel };
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-blue-600';
    if (confidence >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSkillStatusColor = (current: number, target: number) => {
    if (current >= target) return 'text-green-600';
    if (current >= target * 0.7) return 'text-blue-600';
    if (current >= target * 0.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const categorySkills = masterSkills.filter(skill => skill.category === selectedCategory);

  // If assessment is active, show assessment component
  if (assessmentState.type && assessmentState.skillId) {
    const AssessmentComponent = assessmentState.type === 'quiz' ? QuizAssessment : ProjectAssessment;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={() => setAssessmentState({ type: null, skillId: null })}
          >
            ← Back to Skills
          </Button>
          <Badge variant="outline">
            {assessmentState.type === 'quiz' ? 'Quiz Assessment' : 'Project Assessment'}
          </Badge>
        </div>

        <AssessmentComponent
          skillId={assessmentState.skillId}
          onComplete={(score, skillLevel) => 
            handleAssessmentComplete(assessmentState.skillId!, score, skillLevel, assessmentState.type!)
          }
          onCancel={() => setAssessmentState({ type: null, skillId: null })}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6" />
            Skill Assessment
          </h2>
          <p className="text-muted-foreground">Update your skill levels and set learning targets</p>
        </div>
        
        {hasUnsavedChanges && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={discardChanges}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Discard
            </Button>
            <Button onClick={saveChanges}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as SkillCategory)}>
        <TabsList className="grid w-full grid-cols-5">
          {categories.map(category => {
            const IconComponent = category.icon;
            return (
              <TabsTrigger key={category.key} value={category.key} className="flex items-center gap-2">
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.key} value={category.key} className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">{category.label}</h3>
              <p className="text-muted-foreground">
                Assess your {category.label.toLowerCase()} and set learning goals
              </p>
            </div>

            <div className="grid gap-6">
              {categorySkills.map(skill => {
                const userSkill = getUserSkill(skill.id);
                const { current, target } = getSkillLevel(skill.id);
                const hasAssessment = userSkill.assessmentMethod !== 'self';

                return (
                  <Card key={skill.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {skill.name}
                            {hasAssessment && (
                              <Badge variant="secondary" className="text-xs">
                                {userSkill.assessmentMethod}
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{skill.description}</CardDescription>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getSkillStatusColor(current, target)}`}>
                            {current}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Target: {target}%
                          </div>
                          {hasAssessment && (
                            <div className={`text-xs ${getConfidenceColor(userSkill.confidence)}`}>
                              Confidence: {userSkill.confidence}%
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Progress Visualization */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Current Level</span>
                          <span>Target Level</span>
                        </div>
                        <div className="relative">
                          <Progress value={target} className="h-3 bg-muted" />
                          <Progress 
                            value={current} 
                            className="h-3 absolute top-0 bg-transparent" 
                          />
                        </div>
                      </div>

                      {/* Self Assessment Sliders */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Current Level: {current}%
                          </label>
                          <Slider
                            value={[current]}
                            onValueChange={(value) => 
                              handleSelfAssessment(skill.id, value[0], target)
                            }
                            max={100}
                            step={5}
                            className="py-4"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Target Level: {target}%
                          </label>
                          <Slider
                            value={[target]}
                            onValueChange={(value) => 
                              handleSelfAssessment(skill.id, current, value[0])
                            }
                            max={100}
                            step={5}
                            className="py-4"
                          />
                        </div>
                      </div>

                      {/* Assessment Actions */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setAssessmentState({ type: 'quiz', skillId: skill.id })}
                          className="flex-1"
                        >
                          <Brain className="w-4 h-4 mr-2" />
                          Take Quiz
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setAssessmentState({ type: 'project', skillId: skill.id })}
                          className="flex-1"
                        >
                          <Code className="w-4 h-4 mr-2" />
                          Project Challenge
                        </Button>
                      </div>

                      {/* Last Assessment Info */}
                      {hasAssessment && (
                        <div className="text-xs text-muted-foreground border-t pt-2">
                          Last assessed via {userSkill.assessmentMethod} on{' '}
                          {userSkill.lastAssessed.toLocaleDateString()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {categorySkills.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-muted-foreground">
                      No skills found in this category yet.
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Summary Stats */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Assessment Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {userSkills.length}
              </div>
              <div className="text-sm text-muted-foreground">Skills Tracked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {userSkills.filter(s => s.assessmentMethod !== 'self').length}
              </div>
              <div className="text-sm text-muted-foreground">Formally Assessed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(userSkills.reduce((sum, s) => sum + s.currentLevel, 0) / (userSkills.length || 1))}%
              </div>
              <div className="text-sm text-muted-foreground">Average Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {userSkills.filter(s => s.currentLevel < s.targetLevel).length}
              </div>
              <div className="text-sm text-muted-foreground">Skills to Improve</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillInputInterface;