import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { ResumeData } from "@/services/latexTemplates";

interface ResumeFormProps {
  initialData?: Partial<ResumeData>;
  onChange: (data: ResumeData) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({
  initialData,
  onChange,
}) => {
  const [data, setData] = useState<ResumeData>(
    initialData as ResumeData || {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      skills: [""],
      experience: [{ company: "", position: "", duration: "", description: "" }],
      education: [{ school: "", degree: "", field: "", graduation: "", gpa: "" }],
      certifications: [{ name: "", issuer: "", date: "" }],
      projects: [{ name: "", description: "", technologies: "" }],
    }
  );

  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    summary: true,
    experience: true,
    education: true,
    skills: true,
    certifications: false,
    projects: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleDataChange = (newData: ResumeData) => {
    setData(newData);
    onChange(newData);
  };

  // Personal Info Handlers
  const handlePersonalChange = (field: string, value: string) => {
    handleDataChange({
      ...data,
      [field]: value,
    });
  };

  // Skills Handlers
  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = value;
    handleDataChange({
      ...data,
      skills: newSkills.filter((s) => s.trim()),
    });
  };

  const addSkill = () => {
    handleDataChange({
      ...data,
      skills: [...data.skills, ""],
    });
  };

  const removeSkill = (index: number) => {
    handleDataChange({
      ...data,
      skills: data.skills.filter((_, i) => i !== index),
    });
  };

  // Experience Handlers
  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExperience = [...data.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    handleDataChange({
      ...data,
      experience: newExperience,
    });
  };

  const addExperience = () => {
    handleDataChange({
      ...data,
      experience: [
        ...data.experience,
        { company: "", position: "", duration: "", description: "" },
      ],
    });
  };

  const removeExperience = (index: number) => {
    handleDataChange({
      ...data,
      experience: data.experience.filter((_, i) => i !== index),
    });
  };

  // Education Handlers
  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEducation = [...data.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    handleDataChange({
      ...data,
      education: newEducation,
    });
  };

  const addEducation = () => {
    handleDataChange({
      ...data,
      education: [
        ...data.education,
        { school: "", degree: "", field: "", graduation: "", gpa: "" },
      ],
    });
  };

  const removeEducation = (index: number) => {
    handleDataChange({
      ...data,
      education: data.education.filter((_, i) => i !== index),
    });
  };

  // Certification Handlers
  const handleCertificationChange = (index: number, field: string, value: string) => {
    const newCerts = [...(data.certifications || [])];
    newCerts[index] = { ...newCerts[index], [field]: value };
    handleDataChange({
      ...data,
      certifications: newCerts,
    });
  };

  const addCertification = () => {
    handleDataChange({
      ...data,
      certifications: [...(data.certifications || []), { name: "", issuer: "", date: "" }],
    });
  };

  const removeCertification = (index: number) => {
    handleDataChange({
      ...data,
      certifications: (data.certifications || []).filter((_, i) => i !== index),
    });
  };

  // Project Handlers
  const handleProjectChange = (index: number, field: string, value: string) => {
    const newProjects = [...(data.projects || [])];
    newProjects[index] = { ...newProjects[index], [field]: value };
    handleDataChange({
      ...data,
      projects: newProjects,
    });
  };

  const addProject = () => {
    handleDataChange({
      ...data,
      projects: [...(data.projects || []), { name: "", description: "", technologies: "" }],
    });
  };

  const removeProject = (index: number) => {
    handleDataChange({
      ...data,
      projects: (data.projects || []).filter((_, i) => i !== index),
    });
  };

  const SectionHeader = ({
    title,
    section,
  }: {
    title: string;
    section: keyof typeof expandedSections;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 rounded-lg border border-emerald-500/30 transition-all mb-4"
    >
      <h3 className="text-lg font-bold text-white">{title}</h3>
      {expandedSections[section] ? (
        <ChevronUp className="w-4 h-4 text-emerald-400" />
      ) : (
        <ChevronDown className="w-4 h-4 text-emerald-400" />
      )}
    </button>
  );

  return (
    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
      {/* Personal Information */}
      <div>
        <SectionHeader title="Personal Information" section="personal" />
        {expandedSections.personal && (
          <div className="space-y-3 ml-2">
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Full Name"
                value={data.fullName}
                onChange={(e) => handlePersonalChange("fullName", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              />
              <Input
                placeholder="Email"
                type="email"
                value={data.email}
                onChange={(e) => handlePersonalChange("email", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Phone"
                value={data.phone}
                onChange={(e) => handlePersonalChange("phone", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              />
              <Input
                placeholder="Location"
                value={data.location}
                onChange={(e) => handlePersonalChange("location", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Professional Summary */}
      <div>
        <SectionHeader title="Professional Summary" section="summary" />
        {expandedSections.summary && (
          <div className="ml-2">
            <Textarea
              placeholder="Brief professional summary..."
              value={data.summary || ""}
              onChange={(e) => handlePersonalChange("summary", e.target.value)}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 min-h-24"
            />
          </div>
        )}
      </div>

      {/* Experience */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => toggleSection("experience")}
            className="flex-1 text-left p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 rounded-lg border border-emerald-500/30 transition-all flex items-center justify-between"
          >
            <h3 className="text-lg font-bold text-white">Experience</h3>
            {expandedSections.experience ? (
              <ChevronUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-emerald-400" />
            )}
          </button>
        </div>
        {expandedSections.experience && (
          <div className="space-y-4 ml-2">
            {data.experience.map((exp, index) => (
              <div
                key={index}
                className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-slate-300">Entry {index + 1}</h4>
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <Input
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
                <Input
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
                <Input
                  placeholder="Duration (e.g., 2022 - Present)"
                  value={exp.duration}
                  onChange={(e) => handleExperienceChange(index, "duration", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
                <Textarea
                  placeholder="Job description..."
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 min-h-16"
                />
              </div>
            ))}
            <Button
              onClick={addExperience}
              className="w-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/50 text-emerald-300 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Experience
            </Button>
          </div>
        )}
      </div>

      {/* Education */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => toggleSection("education")}
            className="flex-1 text-left p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 rounded-lg border border-emerald-500/30 transition-all flex items-center justify-between"
          >
            <h3 className="text-lg font-bold text-white">Education</h3>
            {expandedSections.education ? (
              <ChevronUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-emerald-400" />
            )}
          </button>
        </div>
        {expandedSections.education && (
          <div className="space-y-4 ml-2">
            {data.education.map((edu, index) => (
              <div
                key={index}
                className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-slate-300">Entry {index + 1}</h4>
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <Input
                  placeholder="School/University"
                  value={edu.school}
                  onChange={(e) => handleEducationChange(index, "school", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Degree (e.g., B.S.)"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                  />
                  <Input
                    placeholder="Field of Study"
                    value={edu.field}
                    onChange={(e) => handleEducationChange(index, "field", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Graduation Year"
                    value={edu.graduation}
                    onChange={(e) => handleEducationChange(index, "graduation", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                  />
                  <Input
                    placeholder="GPA (optional)"
                    value={edu.gpa || ""}
                    onChange={(e) => handleEducationChange(index, "gpa", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                  />
                </div>
              </div>
            ))}
            <Button
              onClick={addEducation}
              className="w-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/50 text-emerald-300 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Education
            </Button>
          </div>
        )}
      </div>

      {/* Skills */}
      <div>
        <SectionHeader title="Skills" section="skills" />
        {expandedSections.skills && (
          <div className="space-y-3 ml-2">
            {data.skills.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Skill ${index + 1}`}
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  className="flex-1 bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                />
                {data.skills.length > 1 && (
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-red-400 hover:text-red-300 px-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <Button
              onClick={addSkill}
              className="w-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/50 text-emerald-300 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Skill
            </Button>
          </div>
        )}
      </div>

      {/* Certifications */}
      <div>
        <SectionHeader title="Certifications" section="certifications" />
        {expandedSections.certifications && (
          <div className="space-y-4 ml-2">
            {(data.certifications || []).map((cert, index) => (
              <div
                key={index}
                className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-slate-300">Certification {index + 1}</h4>
                  <button
                    onClick={() => removeCertification(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <Input
                  placeholder="Certification Name"
                  value={cert.name}
                  onChange={(e) => handleCertificationChange(index, "name", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
                <Input
                  placeholder="Issuer"
                  value={cert.issuer}
                  onChange={(e) => handleCertificationChange(index, "issuer", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
                <Input
                  placeholder="Date"
                  value={cert.date}
                  onChange={(e) => handleCertificationChange(index, "date", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
              </div>
            ))}
            <Button
              onClick={addCertification}
              className="w-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/50 text-emerald-300 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Certification
            </Button>
          </div>
        )}
      </div>

      {/* Projects */}
      <div>
        <SectionHeader title="Projects" section="projects" />
        {expandedSections.projects && (
          <div className="space-y-4 ml-2">
            {(data.projects || []).map((proj, index) => (
              <div
                key={index}
                className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-slate-300">Project {index + 1}</h4>
                  <button
                    onClick={() => removeProject(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <Input
                  placeholder="Project Name"
                  value={proj.name}
                  onChange={(e) => handleProjectChange(index, "name", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
                <Textarea
                  placeholder="Project Description"
                  value={proj.description}
                  onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 min-h-16"
                />
                <Input
                  placeholder="Technologies Used"
                  value={proj.technologies}
                  onChange={(e) => handleProjectChange(index, "technologies", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
              </div>
            ))}
            <Button
              onClick={addProject}
              className="w-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/50 text-emerald-300 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;
