import { supabase } from '@/lib/supabase';
import { AssessmentQuestion } from '@/services/geminiSkillAssessmentService';

export interface SavedSkillAssessment {
  id: string;
  user_id: string;
  career_role_id: string;
  career_role_name: string;
  skill_id: string;
  skill_name: string;
  skill_category: string;
  questions: AssessmentQuestion[];
  answers?: { [key: string]: number };
  score?: number;
  current_level: number;
  target_level: number;
  importance: string;
  status: 'pending' | 'in_progress' | 'completed';
  started_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SavedAssessmentResult {
  id: string;
  assessment_id: string;
  user_id: string;
  skill_id: string;
  skill_name: string;
  score: number;
  calculated_level: number;
  questions_answered: number;
  correct_answers: number;
  time_taken?: number;
  answers_detail: { [key: string]: number };
  completed_at: string;
}

export interface SavedCareerProfile {
  id: string;
  user_id: string;
  career_id: string;
  career_name: string;
  level: string;
  demand: string;
  salary: string;
  growth: string;
  description: string;
  key_responsibilities: string[];
  skills: any[];
  learning_resources?: any;
  is_custom: boolean;
  created_at: string;
  updated_at: string;
}

// ============ Career Profile Functions ============

export const saveCareerProfile = async (
  userId: string,
  careerData: {
    career_id: string;
    career_name: string;
    level: string;
    demand: string;
    salary: string;
    growth: string;
    description: string;
    key_responsibilities: string[];
    skills: any[];
    learning_resources?: any;
    is_custom: boolean;
  }
): Promise<{ success: boolean; data?: SavedCareerProfile; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('career_profiles')
      .insert({
        user_id: userId,
        ...careerData
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error saving career profile:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Career profile saved:', data.id);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error in saveCareerProfile:', error);
    return { success: false, error: 'Failed to save career profile' };
  }
};

export const getUserCareerProfiles = async (
  userId: string
): Promise<{ success: boolean; data?: SavedCareerProfile[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('career_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching career profiles:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Fetched ${data.length} career profiles`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error in getUserCareerProfiles:', error);
    return { success: false, error: 'Failed to fetch career profiles' };
  }
};

// ============ Skill Assessment Functions ============

export const saveSkillAssessment = async (
  userId: string,
  assessmentData: {
    career_role_id: string;
    career_role_name: string;
    skill_id: string;
    skill_name: string;
    skill_category: string;
    questions: AssessmentQuestion[];
    target_level: number;
    importance: string;
  }
): Promise<{ success: boolean; data?: SavedSkillAssessment; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('skill_assessments')
      .insert({
        user_id: userId,
        ...assessmentData,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error saving assessment:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Assessment saved:', data.id);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error in saveSkillAssessment:', error);
    return { success: false, error: 'Failed to save assessment' };
  }
};

export const startAssessment = async (
  assessmentId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('skill_assessments')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', assessmentId);

    if (error) {
      console.error('❌ Error starting assessment:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Assessment started');
    return { success: true };
  } catch (error) {
    console.error('❌ Error in startAssessment:', error);
    return { success: false, error: 'Failed to start assessment' };
  }
};

export const completeAssessment = async (
  assessmentId: string,
  userId: string,
  resultData: {
    answers: { [key: string]: number };
    score: number;
    calculated_level: number;
    questions_answered: number;
    correct_answers: number;
    time_taken?: number;
  }
): Promise<{ success: boolean; data?: SavedAssessmentResult; error?: string }> => {
  try {
    // Update assessment status
    const { data: assessment, error: assessmentError } = await supabase
      .from('skill_assessments')
      .update({
        answers: resultData.answers,
        score: resultData.score,
        current_level: resultData.calculated_level,
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', assessmentId)
      .select()
      .single();

    if (assessmentError) {
      console.error('❌ Error updating assessment:', assessmentError);
      return { success: false, error: assessmentError.message };
    }

    // Save result to history
    const { data: result, error: resultError } = await supabase
      .from('assessment_results')
      .insert({
        assessment_id: assessmentId,
        user_id: userId,
        skill_id: assessment.skill_id,
        skill_name: assessment.skill_name,
        score: resultData.score,
        calculated_level: resultData.calculated_level,
        questions_answered: resultData.questions_answered,
        correct_answers: resultData.correct_answers,
        time_taken: resultData.time_taken,
        answers_detail: resultData.answers
      })
      .select()
      .single();

    if (resultError) {
      console.error('❌ Error saving result:', resultError);
      return { success: false, error: resultError.message };
    }

    console.log('✅ Assessment completed and result saved');
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Error in completeAssessment:', error);
    return { success: false, error: 'Failed to complete assessment' };
  }
};

export const getSkillAssessmentsByCareer = async (
  userId: string,
  careerRoleId: string
): Promise<{ success: boolean; data?: SavedSkillAssessment[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('skill_assessments')
      .select('*')
      .eq('user_id', userId)
      .eq('career_role_id', careerRoleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching assessments:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Fetched ${data.length} assessments`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error in getSkillAssessmentsByCareer:', error);
    return { success: false, error: 'Failed to fetch assessments' };
  }
};

export const getAssessmentResults = async (
  userId: string,
  skillId?: string
): Promise<{ success: boolean; data?: SavedAssessmentResult[]; error?: string }> => {
  try {
    let query = supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', userId);

    if (skillId) {
      query = query.eq('skill_id', skillId);
    }

    const { data, error } = await query.order('completed_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching results:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Fetched ${data.length} results`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error in getAssessmentResults:', error);
    return { success: false, error: 'Failed to fetch results' };
  }
};

export const getOrCreateAssessment = async (
  userId: string,
  assessmentData: {
    career_role_id: string;
    career_role_name: string;
    skill_id: string;
    skill_name: string;
    skill_category: string;
    questions: AssessmentQuestion[];
    target_level: number;
    importance: string;
  }
): Promise<{ success: boolean; data?: SavedSkillAssessment; isNew: boolean; error?: string }> => {
  try {
    // Check if assessment already exists
    const { data: existing, error: fetchError } = await supabase
      .from('skill_assessments')
      .select('*')
      .eq('user_id', userId)
      .eq('career_role_id', assessmentData.career_role_id)
      .eq('skill_id', assessmentData.skill_id)
      .maybeSingle();

    if (fetchError) {
      console.error('❌ Error checking existing assessment:', fetchError);
      return { success: false, error: fetchError.message, isNew: false };
    }

    if (existing) {
      console.log('✅ Using existing assessment:', existing.id);
      return { success: true, data: existing, isNew: false };
    }

    // Create new assessment
    const { data: newAssessment, error: createError } = await supabase
      .from('skill_assessments')
      .insert({
        user_id: userId,
        ...assessmentData,
        status: 'pending'
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating assessment:', createError);
      return { success: false, error: createError.message, isNew: false };
    }

    console.log('✅ New assessment created:', newAssessment.id);
    return { success: true, data: newAssessment, isNew: true };
  } catch (error) {
    console.error('❌ Error in getOrCreateAssessment:', error);
    return { success: false, error: 'Failed to get or create assessment', isNew: false };
  }
};

export const deleteAssessment = async (
  assessmentId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('skill_assessments')
      .delete()
      .eq('id', assessmentId);

    if (error) {
      console.error('❌ Error deleting assessment:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Assessment deleted');
    return { success: true };
  } catch (error) {
    console.error('❌ Error in deleteAssessment:', error);
    return { success: false, error: 'Failed to delete assessment' };
  }
};