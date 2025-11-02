import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star, 
  ExternalLink, 
  Target,
  CheckCircle2,
  PlayCircle,
  DollarSign,
  Users
} from 'lucide-react';
import { 
  UserSkill, 
  TargetRole, 
  LearningResource, 
  learningResources, 
  getResourcesBySkill,
  getSkillById 
} from '@/data/skillsData';

interface DynamicLearningPathsProps {
  userSkills: UserSkill[];
  targetRole: TargetRole;
  onResourceStart: (resourceId: string) => void;
  completedResources: string[];
}

interface LearningPathItem {
  skill: string;
  skillId: string;
  currentLevel: number;
  targetLevel: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedTime: string;
  resources: LearningResource[];
  gap: number;
}

interface GeneratedPath {
  title: string;
  description: string;
  totalTime: string;
  totalCost: number;
  items: LearningPathItem[];
  milestones: {
    week: number;
    title: string;
    skills: string[];
    description: string;
  }[];
}

const DynamicLearningPaths: React.FC<DynamicLearningPathsProps> = ({
  userSkills,
  targetRole,
  onResourceStart,
  completedResources
}) => {
  
  const generateLearningPath = (): GeneratedPath => {
    const pathItems: LearningPathItem[] = [];
    
    // Calculate skill gaps and create learning path items
    targetRole.requiredSkills.forEach(requiredSkill => {
      const userSkill = userSkills.find(us => us.id === requiredSkill.skillId);
      const skill = getSkillById(requiredSkill.skillId);
      
      if (!skill) return;
      
      const currentLevel = userSkill?.currentLevel || 0;
      const targetLevel = requiredSkill.minimumLevel;
      const gap = Math.max(0, targetLevel - currentLevel);
      
      if (gap > 0) {
        const skillResources = getResourcesBySkill(requiredSkill.skillId);
        const filteredResources = filterAndSortResources(skillResources, gap, currentLevel);
        
        pathItems.push({
          skill: skill.name,
          skillId: requiredSkill.skillId,
          currentLevel,
          targetLevel,
          priority: requiredSkill.importance as 'critical' | 'high' | 'medium' | 'low',
          estimatedTime: estimateTimeForGap(gap),
          resources: filteredResources,
          gap
        });
      }
    });

    // Sort by priority and gap size
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3, 'nice-to-have': 4 };
    pathItems.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.gap - a.gap; // Higher gap first
    });

    const totalTime = calculateTotalTime(pathItems);
    const totalCost = calculateTotalCost(pathItems);
    const milestones = generateMilestones(pathItems);

    return {
      title: `${targetRole.name} Learning Path`,
      description: `Personalized learning path to become a ${targetRole.name}`,
      totalTime,
      totalCost,
      items: pathItems,
      milestones
    };
  };

  const filterAndSortResources = (resources: LearningResource[], gap: number, currentLevel: number): LearningResource[] => {
    // Filter resources based on difficulty and current level
    let filtered = resources.filter(resource => {
      if (currentLevel < 30 && resource.difficulty === 'advanced') return false;
      if (currentLevel < 60 && resource.difficulty === 'advanced') return false;
      if (currentLevel > 70 && resource.difficulty === 'beginner') return false;
      return true;
    });

    // Sort by relevance (rating, price, etc.)
    filtered.sort((a, b) => {
      // Prioritize free resources for beginners
      if (currentLevel < 40) {
        if (a.price === 0 && b.price > 0) return -1;
        if (a.price > 0 && b.price === 0) return 1;
      }
      
      // Then by rating
      return b.rating - a.rating;
    });

    // Limit resources based on gap size
    const maxResources = gap > 40 ? 4 : gap > 20 ? 3 : 2;
    return filtered.slice(0, maxResources);
  };

  const estimateTimeForGap = (gap: number): string => {
    if (gap <= 20) return '2-3 weeks';
    if (gap <= 40) return '4-6 weeks';
    if (gap <= 60) return '8-10 weeks';
    return '12+ weeks';
  };

  const calculateTotalTime = (items: LearningPathItem[]): string => {
    const totalWeeks = items.reduce((sum, item) => {
      const weeks = parseInt(item.estimatedTime.split('-')[0]) || 2;
      return sum + weeks;
    }, 0);
    
    return `${Math.ceil(totalWeeks / 4)} months`;
  };

  const calculateTotalCost = (items: LearningPathItem[]): number => {
    return items.reduce((sum, item) => {
      const itemCost = item.resources.reduce((resourceSum, resource) => resourceSum + resource.price, 0);
      return sum + itemCost;
    }, 0);
  };

  const generateMilestones = (items: LearningPathItem[]): GeneratedPath['milestones'] => {
    const milestones: GeneratedPath['milestones'] = [];
    let currentWeek = 0;
    
    const criticalItems = items.filter(item => item.priority === 'critical');
    const highItems = items.filter(item => item.priority === 'high');
    const mediumItems = items.filter(item => item.priority === 'medium');

    // Week 4: Complete critical skills foundation
    if (criticalItems.length > 0) {
      currentWeek = 4;
      milestones.push({
        week: currentWeek,
        title: 'Foundation Skills',
        skills: criticalItems.slice(0, 2).map(item => item.skill),
        description: 'Complete basic requirements for critical skills'
      });
    }

    // Week 8: Intermediate level in critical skills + high priority skills
    if (criticalItems.length > 0 || highItems.length > 0) {
      currentWeek = 8;
      milestones.push({
        week: currentWeek,
        title: 'Intermediate Proficiency',
        skills: [...criticalItems.slice(0, 2), ...highItems.slice(0, 1)].map(item => item.skill),
        description: 'Reach intermediate level in core skills'
      });
    }

    // Week 12: Advanced skills + projects
    if (items.length > 2) {
      currentWeek = 12;
      milestones.push({
        week: currentWeek,
        title: 'Advanced Skills & Projects',
        skills: items.slice(0, 4).map(item => item.skill),
        description: 'Complete advanced topics and practical projects'
      });
    }

    // Final milestone: Role readiness
    currentWeek = Math.max(16, currentWeek + 4);
    milestones.push({
      week: currentWeek,
      title: 'Role Readiness',
      skills: ['Portfolio', 'Interview Prep'],
      description: `Ready to apply for ${targetRole.name} positions`
    });

    return milestones;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getPlatformIcon = (platform: string) => {
    // You could use actual platform icons here
    return <BookOpen className="w-4 h-4" />;
  };

  const generatedPath = generateLearningPath();

  if (generatedPath.items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="w-12 h-12 mx-auto text-green-600 mb-4" />
          <h3 className="text-xl font-semibold text-green-600 mb-2">
            Congratulations! 🎉
          </h3>
          <p className="text-muted-foreground">
            You already meet all the requirements for <strong>{targetRole.name}</strong>!
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Consider exploring advanced topics or related skills to further enhance your profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Path Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6" />
            {generatedPath.title}
          </CardTitle>
          <CardDescription>{generatedPath.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{generatedPath.items.length}</div>
              <div className="text-sm text-muted-foreground">Skills to Learn</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{generatedPath.totalTime}</div>
              <div className="text-sm text-muted-foreground">Estimated Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${generatedPath.totalCost.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Investment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {generatedPath.items.reduce((sum, item) => sum + item.resources.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Learning Resources</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Milestones</CardTitle>
          <CardDescription>Key checkpoints in your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generatedPath.milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-primary">W{milestone.week}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{milestone.title}</h4>
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  <div className="flex gap-1 mt-2">
                    {milestone.skills.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Learning Path */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Detailed Learning Path</h3>
        
        {generatedPath.items.map((item, index) => (
          <Card key={item.skillId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    {item.skill}
                  </CardTitle>
                  <CardDescription>
                    Bridge the gap from {item.currentLevel}% to {item.targetLevel}%
                  </CardDescription>
                </div>
                <div className="text-right">
                  <Badge variant={getPriorityColor(item.priority)}>
                    {item.priority} priority
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {item.estimatedTime}
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {item.currentLevel}%</span>
                  <span>Target: {item.targetLevel}%</span>
                </div>
                <div className="relative">
                  <Progress value={item.targetLevel} className="h-2 bg-gray-200" />
                  <Progress 
                    value={item.currentLevel} 
                    className="h-2 absolute top-0 bg-transparent" 
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <h4 className="font-medium">Recommended Resources:</h4>
              
              <div className="grid gap-3">
                {item.resources.map((resource, resourceIndex) => {
                  const isCompleted = completedResources.includes(resource.id);
                  
                  return (
                    <div 
                      key={resource.id} 
                      className={`flex items-center justify-between p-3 border rounded-lg ${
                        isCompleted ? 'bg-green-50 border-green-200' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                        )}
                        
                        <div>
                          {getPlatformIcon(resource.platform)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="font-medium">{resource.title}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {resource.platform}
                            </Badge>
                            <span>{resource.type}</span>
                            <span>•</span>
                            <span>{resource.duration}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current text-yellow-500" />
                              <span>{resource.rating}</span>
                            </div>
                          </div>
                          {resource.author && (
                            <div className="text-xs text-muted-foreground">
                              by {resource.author}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-medium">
                            {resource.price === 0 ? 'Free' : `$${resource.price}`}
                          </div>
                          <Badge 
                            variant={
                              resource.difficulty === 'beginner' ? 'secondary' :
                              resource.difficulty === 'intermediate' ? 'default' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {resource.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(resource.url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => onResourceStart(resource.id)}
                            disabled={isCompleted}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <PlayCircle className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Ready to start your learning journey?</h4>
              <p className="text-sm text-muted-foreground">
                Begin with the first resource and track your progress
              </p>
            </div>
            <Button 
              onClick={() => {
                const firstResource = generatedPath.items[0]?.resources[0];
                if (firstResource) {
                  window.open(firstResource.url, '_blank');
                  onResourceStart(firstResource.id);
                }
              }}
            >
              Start Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicLearningPaths;