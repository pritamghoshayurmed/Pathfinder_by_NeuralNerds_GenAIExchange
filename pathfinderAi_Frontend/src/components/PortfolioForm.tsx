import { useState } from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

interface PortfolioFormProps {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const PortfolioForm = ({ data, onChange, activeTab, setActiveTab }: PortfolioFormProps) => {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);

  const updateData = (updates: Partial<PortfolioData>) => {
    onChange({ ...data, ...updates });
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: 'New Project',
      description: 'Project description',
      technologies: ['Tech 1', 'Tech 2'],
      featured: false,
      liveUrl: '',
      githubUrl: ''
    };
    updateData({
      projects: [...data.projects, newProject]
    });
  };

  const updateProject = (id: string, updates: any) => {
    updateData({
      projects: data.projects.map(p => p.id === id ? { ...p, ...updates } : p)
    });
  };

  const deleteProject = (id: string) => {
    updateData({
      projects: data.projects.filter(p => p.id !== id)
    });
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: 'Job Title',
      company: 'Company',
      startDate: '2023',
      endDate: '2024',
      isCurrently: false,
      description: 'Job description',
      technologies: []
    };
    updateData({
      experience: [...data.experience, newExp]
    });
  };

  const updateExperience = (id: string, updates: any) => {
    updateData({
      experience: data.experience.map(e => e.id === id ? { ...e, ...updates } : e)
    });
  };

  const deleteExperience = (id: string) => {
    updateData({
      experience: data.experience.filter(e => e.id !== id)
    });
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      school: 'School Name',
      degree: 'Bachelor',
      field: 'Computer Science',
      graduationDate: '2024',
      details: ''
    };
    updateData({
      education: [...data.education, newEdu]
    });
  };

  const updateEducation = (id: string, updates: any) => {
    updateData({
      education: data.education.map(e => e.id === id ? { ...e, ...updates } : e)
    });
  };

  const deleteEducation = (id: string) => {
    updateData({
      education: data.education.filter(e => e.id !== id)
    });
  };

  const addSkillCategory = () => {
    updateData({
      skills: [...data.skills, { category: 'New Category', skills: ['Skill 1', 'Skill 2'] }]
    });
  };

  const updateSkillCategory = (index: number, category: string, skills: string[]) => {
    const newSkills = [...data.skills];
    newSkills[index] = { category, skills };
    updateData({ skills: newSkills });
  };

  const deleteSkillCategory = (index: number) => {
    updateData({
      skills: data.skills.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="w-full space-y-6 max-h-full overflow-y-auto">
      {/* Tabs Navigation */}
      <div className="flex gap-2 flex-wrap">
        {['personal', 'projects', 'skills', 'experience', 'education', 'design', 'social'].map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className="capitalize"
          >
            {tab === 'personal' ? '👤 Personal' : 
             tab === 'projects' ? '🎯 Projects' : 
             tab === 'skills' ? '🛠️ Skills' : 
             tab === 'experience' ? '📈 Experience' :
             tab === 'education' ? '🎓 Education' :
             tab === 'design' ? '🎨 Design' :
             '🔗 Social'}
          </Button>
        ))}
      </div>

      {/* Personal Information */}
      {activeTab === 'personal' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Personal Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <Input
              value={data.fullName}
              onChange={(e) => updateData({ fullName: e.target.value })}
              placeholder="Your Full Name"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Professional Headline</label>
            <Input
              value={data.headline}
              onChange={(e) => updateData({ headline: e.target.value })}
              placeholder="e.g., Full Stack Developer"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
            <Textarea
              value={data.bio}
              onChange={(e) => updateData({ bio: e.target.value })}
              placeholder="Short bio about yourself"
              rows={4}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">About</label>
            <Textarea
              value={data.about}
              onChange={(e) => updateData({ about: e.target.value })}
              placeholder="Detailed about section"
              rows={4}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <Input
              type="email"
              value={data.email}
              onChange={(e) => updateData({ email: e.target.value })}
              placeholder="your@email.com"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
            <Input
              value={data.phone || ''}
              onChange={(e) => updateData({ phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
            <Input
              value={data.location || ''}
              onChange={(e) => updateData({ location: e.target.value })}
              placeholder="City, Country"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Theme</label>
            <select
              value={data.theme}
              onChange={(e) => updateData({ theme: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
            >
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
              <option value="dark">Dark</option>
              <option value="professional">Professional</option>
              <option value="creative">Creative</option>
              <option value="vibrant">Vibrant</option>
              <option value="retro">Retro</option>
              <option value="glassmorphism">Glassmorphism</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Accent Color</label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={data.accentColor || '#6366f1'}
                onChange={(e) => updateData({ accentColor: e.target.value })}
                className="w-12 h-10 bg-slate-700 border-slate-600"
              />
              <Input
                value={data.accentColor || '#6366f1'}
                onChange={(e) => updateData({ accentColor: e.target.value })}
                className="flex-1 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Projects</h3>
            <Button size="sm" onClick={addProject} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </div>

          <div className="space-y-4">
            {data.projects.map((project) => (
              <Card key={project.id} className="p-4 bg-slate-800 border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium text-white">{project.title}</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteProject(project.id)}
                    className="text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <Input
                    value={project.title}
                    onChange={(e) => updateProject(project.id, { title: e.target.value })}
                    placeholder="Project Title"
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />

                  <Textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, { description: e.target.value })}
                    placeholder="Project Description"
                    rows={2}
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />

                  <Input
                    value={project.technologies.join(', ')}
                    onChange={(e) => updateProject(project.id, { technologies: e.target.value.split(',').map(t => t.trim()) })}
                    placeholder="Technologies (comma separated)"
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={project.liveUrl || ''}
                      onChange={(e) => updateProject(project.id, { liveUrl: e.target.value })}
                      placeholder="Live URL"
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                    />
                    <Input
                      value={project.githubUrl || ''}
                      onChange={(e) => updateProject(project.id, { githubUrl: e.target.value })}
                      placeholder="GitHub URL"
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={project.featured}
                      onChange={(e) => updateProject(project.id, { featured: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-300">Featured Project</span>
                  </label>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Skills</h3>
            <Button size="sm" onClick={addSkillCategory} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>

          <div className="space-y-4">
            {data.skills.map((skillGroup, index) => (
              <Card key={index} className="p-4 bg-slate-800 border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <Input
                    value={skillGroup.category}
                    onChange={(e) => updateSkillCategory(index, e.target.value, skillGroup.skills)}
                    placeholder="Category Name"
                    className="bg-slate-700 border-slate-600 text-white font-medium flex-1"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteSkillCategory(index)}
                    className="text-red-400 hover:bg-red-500/20 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <Textarea
                  value={skillGroup.skills.join(', ')}
                  onChange={(e) => updateSkillCategory(index, skillGroup.category, e.target.value.split(',').map(s => s.trim()))}
                  placeholder="Skills (comma separated)"
                  rows={2}
                  className="bg-slate-700 border-slate-600 text-white text-sm"
                />
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {activeTab === 'experience' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Experience</h3>
            <Button size="sm" onClick={addExperience} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Experience
            </Button>
          </div>

          <div className="space-y-4">
            {data.experience.map((exp) => (
              <Card key={exp.id} className="p-4 bg-slate-800 border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium text-white">{exp.title}</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteExperience(exp.id)}
                    className="text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                      placeholder="Job Title"
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                    />
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      placeholder="Company"
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      placeholder="Start Date"
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                    />
                    <Input
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                      placeholder="End Date"
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                      disabled={exp.isCurrently}
                    />
                  </div>

                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                    placeholder="Job Description"
                    rows={2}
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />

                  <Input
                    value={exp.technologies?.join(', ') || ''}
                    onChange={(e) => updateExperience(exp.id, { technologies: e.target.value.split(',').map(t => t.trim()) })}
                    placeholder="Technologies (comma separated)"
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.isCurrently}
                      onChange={(e) => updateExperience(exp.id, { isCurrently: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-300">Currently Working Here</span>
                  </label>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {activeTab === 'education' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Education</h3>
            <Button size="sm" onClick={addEducation} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Education
            </Button>
          </div>

          <div className="space-y-4">
            {data.education.map((edu) => (
              <Card key={edu.id} className="p-4 bg-slate-800 border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium text-white">{edu.school}</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteEducation(edu.id)}
                    className="text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                      placeholder="School/University"
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                    />
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      placeholder="Degree"
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                      placeholder="Field of Study"
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                    />
                    <Input
                      value={edu.graduationDate}
                      onChange={(e) => updateEducation(edu.id, { graduationDate: e.target.value })}
                      placeholder="Graduation Date"
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                    />
                  </div>

                  <Textarea
                    value={edu.details || ''}
                    onChange={(e) => updateEducation(edu.id, { details: e.target.value })}
                    placeholder="Additional Details"
                    rows={2}
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Design & Template */}
      {activeTab === 'design' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Portfolio Template</h3>
            <p className="text-sm text-gray-400 mb-4">Choose a professional template for your portfolio</p>
            
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'modern-tech', name: '🚀 Modern Tech', description: 'Sleek, contemporary design for tech professionals' },
                { id: 'creative', name: '🎨 Creative Professional', description: 'Artistic and modern for designers' },
                { id: 'corporate', name: '💼 Corporate Executive', description: 'Professional for business leaders' },
                { id: 'freelance', name: '✨ Freelance Creator', description: 'Dynamic for independent creators' },
                { id: 'agency', name: '🎯 Agency Portfolio', description: 'Advanced case study showcase' }
              ].map((template) => (
                <div
                  key={template.id}
                  onClick={() => updateData({ templateId: template.id as any })}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    data.templateId === template.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                  }`}
                >
                  <p className="font-semibold text-white">{template.name}</p>
                  <p className="text-sm text-gray-400">{template.description}</p>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-700" />

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Additional Theme Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Color Theme</label>
                <select
                  value={data.theme}
                  onChange={(e) => updateData({ theme: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md text-sm"
                >
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                  <option value="dark">Dark</option>
                  <option value="professional">Professional</option>
                  <option value="creative">Creative</option>
                  <option value="vibrant">Vibrant</option>
                  <option value="retro">Retro</option>
                  <option value="glassmorphism">Glassmorphism</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Accent Color</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={data.accentColor || '#6366f1'}
                    onChange={(e) => updateData({ accentColor: e.target.value })}
                    className="w-16 h-10 bg-slate-700 border-slate-600"
                  />
                  <span className="text-sm text-gray-400">{data.accentColor || '#6366f1'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Links */}
      {activeTab === 'social' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Social Links</h3>
          
          <div className="space-y-3">
            {data.socialLinks.map((link, index) => (
              <div key={index} className="flex gap-2 items-start">
                <select
                  value={link.platform}
                  onChange={(e) => {
                    const newLinks = [...data.socialLinks];
                    newLinks[index].platform = e.target.value as any;
                    updateData({ socialLinks: newLinks });
                  }}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md text-sm"
                >
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                  <option value="behance">Behance</option>
                  <option value="dribbble">Dribbble</option>
                  <option value="instagram">Instagram</option>
                  <option value="website">Website</option>
                </select>

                <Input
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...data.socialLinks];
                    newLinks[index].url = e.target.value;
                    updateData({ socialLinks: newLinks });
                  }}
                  placeholder="URL"
                  className="flex-1 bg-slate-700 border-slate-600 text-white text-sm"
                />

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    updateData({
                      socialLinks: data.socialLinks.filter((_, i) => i !== index)
                    });
                  }}
                  className="text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              updateData({
                socialLinks: [...data.socialLinks, { platform: 'github', url: '' }]
              });
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Social Link
          </Button>
        </div>
      )}
    </div>
  );
};
