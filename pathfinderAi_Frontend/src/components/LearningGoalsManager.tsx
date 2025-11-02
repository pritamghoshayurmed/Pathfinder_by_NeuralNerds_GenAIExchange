import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Target, Calendar as CalendarIcon, Plus, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  category: string;
}

interface LearningGoalsManagerProps {
  onClose: () => void;
}

const LearningGoalsManager: React.FC<LearningGoalsManagerProps> = ({ onClose }) => {
  const [goals, setGoals] = useState<LearningGoal[]>([
    {
      id: '1',
      title: 'Complete Data Science Fundamentals',
      description: 'Master Python, statistics, and basic ML concepts',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      priority: 'high',
      status: 'in-progress',
      category: 'Technical Skills'
    },
    {
      id: '2',
      title: 'Build Portfolio Project',
      description: 'Create a comprehensive data science project',
      targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      priority: 'medium',
      status: 'pending',
      category: 'Projects'
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: new Date(),
    priority: 'medium' as const,
    category: 'Technical Skills'
  });

  const [isAddingGoal, setIsAddingGoal] = useState(false);

  const addGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal: LearningGoal = {
      id: Date.now().toString(),
      ...newGoal,
      status: 'pending'
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({
      title: '',
      description: '',
      targetDate: new Date(),
      priority: 'medium',
      category: 'Technical Skills'
    });
    setIsAddingGoal(false);
  };

  const updateGoalStatus = (goalId: string, status: LearningGoal['status']) => {
    setGoals(prev => prev.map(goal =>
      goal.id === goalId ? { ...goal, status } : goal
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'pending': return 'text-gray-600';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Goals
              </CardTitle>
              <CardDescription>
                Set and track your learning objectives
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Learning Goal</DialogTitle>
                    <DialogDescription>
                      Create a new learning objective to track your progress
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Goal Title</label>
                      <Input
                        value={newGoal.title}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Master Machine Learning"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={newGoal.description}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what you want to achieve..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Priority</label>
                        <Select
                          value={newGoal.priority}
                          onValueChange={(value: any) => setNewGoal(prev => ({ ...prev, priority: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <Select
                          value={newGoal.category}
                          onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technical Skills">Technical Skills</SelectItem>
                            <SelectItem value="Projects">Projects</SelectItem>
                            <SelectItem value="Certifications">Certifications</SelectItem>
                            <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Target Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(newGoal.targetDate, 'PPP')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newGoal.targetDate}
                            onSelect={(date) => date && setNewGoal(prev => ({ ...prev, targetDate: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addGoal} className="flex-1">
                        Add Goal
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingGoal(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{goal.title}</h3>
                    <Badge variant={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                    <Badge variant="outline">{goal.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {format(goal.targetDate, 'MMM dd, yyyy')}
                    </span>
                    <span className={`flex items-center gap-1 ${getStatusColor(goal.status)}`}>
                      <Clock className="h-4 w-4" />
                      {goal.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {goal.status !== 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateGoalStatus(goal.id, goal.status === 'pending' ? 'in-progress' : 'completed')}
                    >
                      {goal.status === 'pending' ? 'Start' : 'Complete'}
                    </Button>
                  )}
                  {goal.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningGoalsManager;