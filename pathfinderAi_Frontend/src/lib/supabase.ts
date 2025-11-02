// filepath: c:\Users\ASUS\OneDrive\Desktop\GEN AI\pathfinder-ai-20\src\lib\supabase.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl // Only log in development
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window?.localStorage,
  },
  global: {
    headers: {
      'X-Client-Info': 'pathfinder-ai',
    },
  },
  db: {
    schema: 'public',
  },
});

// Add connection test
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.id);
});

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

interface CareerSummary {
  careerGoal: string;
  keyInterests: string[];
  currentLevel: string;
  targetRole: string;
  timeframe: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SavedLearningPath {
  id: string;
  user_id: string;
  career_goal: string;
  target_role: string;
  current_level: string;
  timeframe: string;
  key_interests: string[];
  career_overview: string;
  total_duration: string;
  difficulty: string;
  prerequisites: string[];
  outcomes: string[];
  phases: LearningPathStep[];
  certifications: string[];
  job_market: {
    averageSalary: string;
    demandLevel: string;
    topCompanies: string[];
    requiredSkills: string[];
  };
  conversation_messages: Message[];
  created_at: string;
  updated_at: string;
}

// Save learning path to database
export const saveLearningPath = async (
  userId: string,
  careerSummary: CareerSummary,
  detailedPath: DetailedLearningPath,
  conversationMessages: Message[]
): Promise<{ success: boolean; data?: SavedLearningPath; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('learning_paths')
      .insert({
        user_id: userId,
        career_goal: careerSummary.careerGoal,
        target_role: careerSummary.targetRole,
        current_level: careerSummary.currentLevel,
        timeframe: careerSummary.timeframe,
        key_interests: careerSummary.keyInterests,
        career_overview: detailedPath.overview,
        total_duration: detailedPath.totalDuration,
        difficulty: detailedPath.difficulty,
        prerequisites: detailedPath.prerequisites,
        outcomes: detailedPath.outcomes,
        phases: detailedPath.phases,
        certifications: detailedPath.certifications,
        job_market: detailedPath.jobMarket,
        conversation_messages: conversationMessages
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving learning path:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Learning path saved successfully:', data.id);
    return { success: true, data };
  } catch (error) {
    console.error('Error in saveLearningPath:', error);
    return { success: false, error: 'Failed to save learning path' };
  }
};

// Get latest learning path for user
export const getLatestLearningPath = async (
  userId: string
): Promise<{ success: boolean; data?: SavedLearningPath; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return { success: true, data: undefined };
      }
      console.error('Error fetching learning path:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Learning path fetched successfully');
    return { success: true, data };
  } catch (error) {
    console.error('Error in getLatestLearningPath:', error);
    return { success: false, error: 'Failed to fetch learning path' };
  }
};

// Get all learning paths for user
export const getAllLearningPaths = async (
  userId: string
): Promise<{ success: boolean; data?: SavedLearningPath[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching learning paths:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Fetched ${data.length} learning paths`);
    return { success: true, data };
  } catch (error) {
    console.error('Error in getAllLearningPaths:', error);
    return { success: false, error: 'Failed to fetch learning paths' };
  }
};

// Update learning path
export const updateLearningPath = async (
  pathId: string,
  updates: Partial<SavedLearningPath>
): Promise<{ success: boolean; data?: SavedLearningPath; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('learning_paths')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', pathId)
      .select()
      .single();

    if (error) {
      console.error('Error updating learning path:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Learning path updated successfully');
    return { success: true, data };
  } catch (error) {
    console.error('Error in updateLearningPath:', error);
    return { success: false, error: 'Failed to update learning path' };
  }
};

// Delete learning path
export const deleteLearningPath = async (
  pathId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('learning_paths')
      .delete()
      .eq('id', pathId);

    if (error) {
      console.error('Error deleting learning path:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Learning path deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Error in deleteLearningPath:', error);
    return { success: false, error: 'Failed to delete learning path' };
  }
};
// Add after existing functions

// Get all learning paths with their career targets
export const getAllUserLearningPaths = async (
  userId: string
): Promise<{ success: boolean; data?: SavedLearningPath[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching learning paths:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Fetched ${data.length} learning paths`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error in getAllUserLearningPaths:', error);
    return { success: false, error: 'Failed to fetch learning paths' };
  }
};