import geminiSkillAssessmentService from './geminiSkillAssessmentService';
import geminiCareerService from './geminiCareerService';
import { 
  saveCareerProfile, 
  getOrCreateAssessment
} from '@/lib/SkillAssessmentService';
import type { SavedLearningPath } from '@/lib/supabase';

interface LearningPathPhase {
  id: string;
  phase: string;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  [key: string]: any;
}

export const autoGenerateAssessmentsFromLearningPath = async (
  userId: string,
  learningPath: SavedLearningPath
): Promise<{ success: boolean; generatedSkills: number; error?: string }> => {
  try {
    console.log(`🤖 Auto-generating assessments for: ${learningPath.target_role}`);

    // Extract all unique skills from phases
    const allSkills = new Set<string>();
    learningPath.phases.forEach((phase: LearningPathPhase) => {
      if (phase.skills && Array.isArray(phase.skills)) {
        phase.skills.forEach(skill => allSkills.add(skill));
      }
    });

    const skillsList = Array.from(allSkills);
    console.log(`📚 Found ${skillsList.length} skills to assess:`, skillsList);

    // Generate career profile if not exists
    const careerProfile = await geminiCareerService.getCachedOrGenerateProfile(
      learningPath.target_role
    );

    // Save career profile to database
    const careerResult = await saveCareerProfile(userId, {
      career_id: `lp-${learningPath.id}`,
      career_name: learningPath.target_role,
      level: learningPath.current_level || 'Beginner',
      demand: 'High',
      salary: 'Competitive',
      growth: '+20%',
      description: learningPath.career_overview || careerProfile.description,
      key_responsibilities: learningPath.outcomes || careerProfile.keyResponsibilities,
      skills: careerProfile.skills.map((skill: any) => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        currentLevel: 0,
        targetLevel: skill.targetLevel,
        importance: skill.importance,
        trend: 'stable',
        marketDemand: skill.marketDemand
      })),
      learning_resources: {
        courses: [],
        projects: [],
        certifications: learningPath.certifications || []
      },
      is_custom: true
    });

    if (!careerResult.success) {
      console.warn('⚠️ Career profile save failed:', careerResult.error);
    }

    // Generate assessments for each skill
    let generatedCount = 0;
    const assessmentPromises = careerProfile.skills.map(async (skill: any) => {
      try {
        // Determine difficulty based on current level
        let difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' = 'beginner';
        
        if (learningPath.current_level === 'Intermediate') difficulty = 'intermediate';
        else if (learningPath.current_level === 'Advanced') difficulty = 'advanced';
        else if (learningPath.current_level === 'Expert') difficulty = 'expert';

        // Generate questions
        const questions = await geminiSkillAssessmentService.getCachedOrGenerateQuestions(
          skill.name,
          skill.category,
          difficulty,
          5
        );

        // Save assessment to database
        const result = await getOrCreateAssessment(userId, {
          career_role_id: `lp-${learningPath.id}`,
          career_role_name: learningPath.target_role,
          skill_id: skill.id,
          skill_name: skill.name,
          skill_category: skill.category,
          questions: questions,
          target_level: skill.targetLevel,
          importance: skill.importance
        });

        if (result.success) {
          generatedCount++;
          console.log(`✅ Assessment generated for: ${skill.name}`);
        }
      } catch (error) {
        console.error(`❌ Failed to generate assessment for ${skill.name}:`, error);
      }
    });

    // Wait for all assessments to complete
    await Promise.all(assessmentPromises);

    console.log(`✅ Auto-generated ${generatedCount} assessments for ${learningPath.target_role}`);

    return {
      success: true,
      generatedSkills: generatedCount
    };
  } catch (error) {
    console.error('❌ Error in autoGenerateAssessmentsFromLearningPath:', error);
    return {
      success: false,
      generatedSkills: 0,
      error: 'Failed to auto-generate assessments'
    };
  }
};