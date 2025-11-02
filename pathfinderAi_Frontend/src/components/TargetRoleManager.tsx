import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Target, 
  DollarSign, 
  TrendingUp, 
  Briefcase,
  GripVertical,
  Trash2,
  Edit,
  Save,
  X
} from 'lucide-react';
import { TargetRole, systemTargetRoles, masterSkills, getSkillById } from '@/data/skillsData';

interface TargetRoleManagerProps {
  selectedRole: TargetRole | null;
  onRoleSelect: (role: TargetRole) => void;
  onRoleCreate: (role: TargetRole) => void;
  onRoleUpdate: (role: TargetRole) => void;
  customRoles: TargetRole[];
}

interface SkillRequirement {
  skillId: string;
  importance: 'critical' | 'high' | 'medium' | 'nice-to-have';
  minimumLevel: number;
  weight: number;
}

interface CustomRoleForm {
  name: string;
  category: string;
  description: string;
  requiredSkills: SkillRequirement[];
  averageSalary: { min: number; max: number; currency: string };
  jobMarketDemand: number;
  growthRate: string;
}

const TargetRoleManager: React.FC<TargetRoleManagerProps> = ({
  selectedRole,
  onRoleSelect,
  onRoleCreate,
  onRoleUpdate,
  customRoles
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRole, setEditingRole] = useState<TargetRole | null>(null);
  const [customRoleForm, setCustomRoleForm] = useState<CustomRoleForm>({
    name: '',
    category: '',
    description: '',
    requiredSkills: [],
    averageSalary: { min: 40000, max: 80000, currency: 'USD' },
    jobMarketDemand: 50,
    growthRate: '+10%'
  });

  const allRoles = [...systemTargetRoles, ...customRoles];
  const categories = [...new Set(allRoles.map(role => role.category))];

  const importanceColors = {
    critical: 'destructive',
    high: 'default',
    medium: 'secondary',
    'nice-to-have': 'outline'
  } as const;

  const resetForm = () => {
    setCustomRoleForm({
      name: '',
      category: '',
      description: '',
      requiredSkills: [],
      averageSalary: { min: 40000, max: 80000, currency: 'USD' },
      jobMarketDemand: 50,
      growthRate: '+10%'
    });
  };

  const handleCreateRole = () => {
    if (!customRoleForm.name || !customRoleForm.category || customRoleForm.requiredSkills.length === 0) {
      return;
    }

    const newRole: TargetRole = {
      id: `custom-${Date.now()}`,
      name: customRoleForm.name,
      category: customRoleForm.category,
      description: customRoleForm.description,
      isSystemDefined: false,
      requiredSkills: customRoleForm.requiredSkills,
      averageSalary: customRoleForm.averageSalary,
      jobMarketDemand: customRoleForm.jobMarketDemand,
      growthRate: customRoleForm.growthRate
    };

    onRoleCreate(newRole);
    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleEditRole = (role: TargetRole) => {
    if (role.isSystemDefined) return;
    
    setEditingRole(role);
    setCustomRoleForm({
      name: role.name,
      category: role.category,
      description: role.description,
      requiredSkills: [...role.requiredSkills],
      averageSalary: role.averageSalary || { min: 40000, max: 80000, currency: 'USD' },
      jobMarketDemand: role.jobMarketDemand,
      growthRate: role.growthRate
    });
    setIsEditMode(true);
  };

  const handleUpdateRole = () => {
    if (!editingRole) return;

    const updatedRole: TargetRole = {
      ...editingRole,
      name: customRoleForm.name,
      category: customRoleForm.category,
      description: customRoleForm.description,
      requiredSkills: customRoleForm.requiredSkills,
      averageSalary: customRoleForm.averageSalary,
      jobMarketDemand: customRoleForm.jobMarketDemand,
      growthRate: customRoleForm.growthRate
    };

    onRoleUpdate(updatedRole);
    setIsEditMode(false);
    setEditingRole(null);
    resetForm();
  };

  const handleSkillAdd = () => {
    setCustomRoleForm(prev => ({
      ...prev,
      requiredSkills: [...prev.requiredSkills, {
        skillId: '',
        importance: 'medium',
        minimumLevel: 70,
        weight: 10
      }]
    }));
  };

  const handleSkillRemove = (index: number) => {
    setCustomRoleForm(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((_, i) => i !== index)
    }));
  };

  const handleSkillChange = (index: number, field: keyof SkillRequirement, value: string | number) => {
    setCustomRoleForm(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const moveSkill = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= customRoleForm.requiredSkills.length) return;

    setCustomRoleForm(prev => {
      const newSkills = [...prev.requiredSkills];
      [newSkills[index], newSkills[newIndex]] = [newSkills[newIndex], newSkills[index]];
      return { ...prev, requiredSkills: newSkills };
    });
  };

  const RoleCard: React.FC<{ role: TargetRole }> = ({ role }) => (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        selectedRole?.id === role.id ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => onRoleSelect(role)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {role.name}
            </CardTitle>
            {!role.isSystemDefined && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditRole(role);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">{role.category}</Badge>
            {!role.isSystemDefined && (
              <Badge variant="outline">Custom</Badge>
            )}
          </div>
        </div>
        <CardDescription>{role.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Market Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>Growth: {role.growthRate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Demand: {role.jobMarketDemand}%</span>
            </div>
          </div>

          {role.averageSalary && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span>
                ${role.averageSalary.min.toLocaleString()} - ${role.averageSalary.max.toLocaleString()}
              </span>
            </div>
          )}

          {/* Top Skills */}
          <div>
            <div className="text-sm font-medium mb-2">Key Skills Required:</div>
            <div className="flex flex-wrap gap-1">
              {role.requiredSkills
                .filter(skill => skill.importance === 'critical')
                .slice(0, 3)
                .map((skill) => {
                  const skillData = getSkillById(skill.skillId);
                  return skillData ? (
                    <Badge key={skill.skillId} variant={importanceColors[skill.importance]}>
                      {skillData.name}
                    </Badge>
                  ) : null;
                })}
              {role.requiredSkills.filter(skill => skill.importance === 'critical').length > 3 && (
                <Badge variant="outline">+{role.requiredSkills.length - 3} more</Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CustomRoleDialog: React.FC<{ isEdit?: boolean }> = ({ isEdit = false }) => (
    <Dialog open={isEdit ? isEditMode : isCreateDialogOpen} onOpenChange={isEdit ? setIsEditMode : setIsCreateDialogOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Custom Role' : 'Create Custom Role'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update your custom role requirements' : 'Define a custom role with specific skill requirements'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role Name *</label>
              <Input
                placeholder="e.g., Senior Full Stack Developer"
                value={customRoleForm.name}
                onChange={(e) => setCustomRoleForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              <Input
                placeholder="e.g., Development, Marketing, Design"
                value={customRoleForm.category}
                onChange={(e) => setCustomRoleForm(prev => ({ ...prev, category: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Describe the role responsibilities and requirements..."
              value={customRoleForm.description}
              onChange={(e) => setCustomRoleForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Market Data */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Salary Range (USD)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={customRoleForm.averageSalary.min}
                  onChange={(e) => setCustomRoleForm(prev => ({
                    ...prev,
                    averageSalary: { ...prev.averageSalary, min: parseInt(e.target.value) || 0 }
                  }))}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={customRoleForm.averageSalary.max}
                  onChange={(e) => setCustomRoleForm(prev => ({
                    ...prev,
                    averageSalary: { ...prev.averageSalary, max: parseInt(e.target.value) || 0 }
                  }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Market Demand (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={customRoleForm.jobMarketDemand}
                onChange={(e) => setCustomRoleForm(prev => ({
                  ...prev,
                  jobMarketDemand: parseInt(e.target.value) || 0
                }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Growth Rate</label>
              <Input
                placeholder="e.g., +25%"
                value={customRoleForm.growthRate}
                onChange={(e) => setCustomRoleForm(prev => ({ ...prev, growthRate: e.target.value }))}
              />
            </div>
          </div>

          {/* Skills Requirements */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Required Skills</h3>
              <Button onClick={handleSkillAdd} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </div>

            {customRoleForm.requiredSkills.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No skills added yet. Click "Add Skill" to get started.
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {customRoleForm.requiredSkills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSkill(index, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSkill(index, 'down')}
                        disabled={index === customRoleForm.requiredSkills.length - 1}
                      >
                        ↓
                      </Button>
                    </div>

                    <div className="flex-1 grid grid-cols-4 gap-3">
                      <Select
                        value={skill.skillId}
                        onValueChange={(value) => handleSkillChange(index, 'skillId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select skill" />
                        </SelectTrigger>
                        <SelectContent>
                          {masterSkills.map((masterSkill) => (
                            <SelectItem key={masterSkill.id} value={masterSkill.id}>
                              {masterSkill.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={skill.importance}
                        onValueChange={(value) => handleSkillChange(index, 'importance', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="nice-to-have">Nice to Have</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        type="number"
                        placeholder="Min Level %"
                        min="0"
                        max="100"
                        value={skill.minimumLevel}
                        onChange={(e) => handleSkillChange(index, 'minimumLevel', parseInt(e.target.value) || 0)}
                      />

                      <Input
                        type="number"
                        placeholder="Weight %"
                        min="0"
                        max="100"
                        value={skill.weight}
                        onChange={(e) => handleSkillChange(index, 'weight', parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSkillRemove(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                if (isEdit) {
                  setIsEditMode(false);
                  setEditingRole(null);
                } else {
                  setIsCreateDialogOpen(false);
                }
                resetForm();
              }}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={isEdit ? handleUpdateRole : handleCreateRole}
              disabled={!customRoleForm.name || !customRoleForm.category || customRoleForm.requiredSkills.length === 0}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEdit ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Target Roles</h2>
          <p className="text-muted-foreground">Choose or create your target career role</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Custom Role
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Selected Role Summary */}
      {selectedRole && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary">Selected Target Role</CardTitle>
            <CardDescription>
              You are currently working towards: <strong>{selectedRole.name}</strong>
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Role Categories */}
      <div className="space-y-4">
        {categories.map((category) => {
          const categoryRoles = allRoles.filter(role => role.category === category);
          
          return (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {category}
                <Badge variant="outline">{categoryRoles.length}</Badge>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryRoles.map((role) => (
                  <RoleCard key={role.id} role={role} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialogs */}
      <CustomRoleDialog />
      <CustomRoleDialog isEdit={true} />
    </div>
  );
};

export default TargetRoleManager;