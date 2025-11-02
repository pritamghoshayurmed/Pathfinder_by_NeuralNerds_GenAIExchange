import { supabase } from '@/lib/supabase';
import { ATSAnalysisResult, JobDescriptionMatch, OptimizationSuggestion } from './atsService';

export interface ATSScanRecord {
  id: string;
  user_id: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  resume_text: string;
  overall_score: number;
  parseability: number;
  keyword_match: number;
  formatting: number;
  readability: number;
  sections: any;
  recommendations: any;
  missing_keywords: string[];
  strength_areas: string[];
  improvement_areas: string[];
  job_description?: string;
  job_match_data?: any;
  optimization_suggestions: any;
  pdf_url?: string;
  pdf_path?: string;
  resume_file_url?: string;  // ✅ NEW
  resume_file_path?: string; // ✅ NEW
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
}

class ATSScanStorageService {
  /**
   * Save ATS analysis to Supabase
   */
  async saveAnalysis(
    fileName: string,
    resumeText: string,
    analysis: ATSAnalysisResult,
    suggestions: OptimizationSuggestion[],
    jobDescription?: string,
    jobMatch?: JobDescriptionMatch,
    fileSize?: number,
    fileType?: string
  ): Promise<{ success: boolean; scanId?: string; error?: string }> {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Authentication error:', authError);
        return { success: false, error: 'User not authenticated' };
      }

      // Prepare data for insertion
      const scanData = {
        user_id: user.id,
        file_name: fileName,
        file_size: fileSize,
        file_type: fileType,
        resume_text: resumeText,
        overall_score: analysis.overallScore,
        parseability: analysis.parseability,
        keyword_match: analysis.keywordMatch,
        formatting: analysis.formatting,
        readability: analysis.readability,
        sections: analysis.sections,
        recommendations: analysis.recommendations,
        missing_keywords: analysis.missingKeywords,
        strength_areas: analysis.strengthAreas,
        improvement_areas: analysis.improvementAreas,
        job_description: jobDescription || null,
        job_match_data: jobMatch || null,
        optimization_suggestions: suggestions,
      };

      // Insert into database
      const { data, error } = await supabase
        .from('ats_scans')
        .insert(scanData)
        .select()
        .single();

      if (error) {
        console.error('Error saving analysis:', error);
        return { success: false, error: error.message };
      }

      return { success: true, scanId: data.id };
    } catch (error) {
      console.error('Error in saveAnalysis:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Upload PDF report to Supabase Storage
   */
  async uploadPDFReport(
    scanId: string,
    pdfBlob: Blob,
    fileName: string
  ): Promise<{ success: boolean; pdfUrl?: string; error?: string }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Create unique file path: userId/scanId/filename
      const timestamp = Date.now();
      const pdfPath = `${user.id}/${scanId}/${timestamp}_${fileName}`;

      // Upload PDF to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ats-reports')
        .upload(pdfPath, pdfBlob, {
          contentType: 'application/pdf',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading PDF:', uploadError);
        return { success: false, error: uploadError.message };
      }

      // Get public URL (even though bucket is private, we'll use signed URLs)
      const { data: urlData } = supabase.storage
        .from('ats-reports')
        .getPublicUrl(pdfPath);

      const pdfUrl = urlData.publicUrl;

      // Update scan record with PDF information
      const { error: updateError } = await supabase
        .from('ats_scans')
        .update({ 
          pdf_url: pdfUrl,
          pdf_path: pdfPath,
          updated_at: new Date().toISOString()
        })
        .eq('id', scanId);

      if (updateError) {
        console.error('Error updating scan with PDF info:', updateError);
        return { success: false, error: updateError.message };
      }

      return { success: true, pdfUrl };
    } catch (error) {
      console.error('Error in uploadPDFReport:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Upload original resume file to Supabase Storage
   */
  async uploadResumeFile(
    scanId: string,
    file: File
  ): Promise<{ success: boolean; fileUrl?: string; filePath?: string; error?: string }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Create unique file path: userId/scanId/original_filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${user.id}/${scanId}/resume_${timestamp}.${fileExtension}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ats-reports')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading resume file:', uploadError);
        return { success: false, error: uploadError.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('ats-reports')
        .getPublicUrl(filePath);

      const fileUrl = urlData.publicUrl;

      // Update scan record with file information
      const { error: updateError } = await supabase
        .from('ats_scans')
        .update({ 
          resume_file_url: fileUrl,
          resume_file_path: filePath,
          updated_at: new Date().toISOString()
        })
        .eq('id', scanId);

      if (updateError) {
        console.error('Error updating scan with file info:', updateError);
        return { success: false, error: updateError.message };
      }

      return { success: true, fileUrl, filePath };
    } catch (error) {
      console.error('Error in uploadResumeFile:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get signed URL for PDF download (valid for 1 hour)
   */
  async getPDFSignedUrl(pdfPath: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from('ats-reports')
        .createSignedUrl(pdfPath, 3600); // 1 hour expiry

      if (error) {
        console.error('Error creating signed URL:', error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error in getPDFSignedUrl:', error);
      return null;
    }
  }

  /**
   * Get all scans for current user
   */
  async getUserScans(
    limit: number = 50,
    offset: number = 0
  ): Promise<{ data: ATSScanRecord[] | null; error: string | null }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('ats_scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching scans:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in getUserScans:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get single scan by ID
   */
  async getScanById(scanId: string): Promise<{ data: ATSScanRecord | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('ats_scans')
        .select('*')
        .eq('id', scanId)
        .single();

      if (error) {
        console.error('Error fetching scan:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in getScanById:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Delete scan and associated files (PDF report + original resume)
   */
  async deleteScan(scanId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First get the scan to get file paths
      const { data: scan, error: fetchError } = await supabase
        .from('ats_scans')
        .select('pdf_path, resume_file_path')
        .eq('id', scanId)
        .single();

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      // Collect all files to delete
      const filesToDelete: string[] = [];
      
      if (scan?.pdf_path) {
        filesToDelete.push(scan.pdf_path);
      }
      
      if (scan?.resume_file_path) {
        filesToDelete.push(scan.resume_file_path);
      }

      // Delete all files from storage
      if (filesToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('ats-reports')
          .remove(filesToDelete);

        if (storageError) {
          console.error('Error deleting files:', storageError);
          // Continue with scan deletion even if file deletion fails
        }
      }

      // Delete scan record
      const { error: deleteError } = await supabase
        .from('ats_scans')
        .delete()
        .eq('id', scanId);

      if (deleteError) {
        return { success: false, error: deleteError.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteScan:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(scanId: string, isFavorite: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('ats_scans')
        .update({ 
          is_favorite: isFavorite,
          updated_at: new Date().toISOString()
        })
        .eq('id', scanId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Search scans by text
   */
  async searchScans(
    searchQuery: string,
    limit: number = 20
  ): Promise<{ data: ATSScanRecord[] | null; error: string | null }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('ats_scans')
        .select('*')
        .eq('user_id', user.id)
        .textSearch('search_vector', searchQuery, {
          type: 'websearch',
          config: 'english'
        })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error searching scans:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in searchScans:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get scan statistics
   */
  async getScanStatistics(): Promise<{
    totalScans: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    favoriteCount: number;
    error?: string;
  }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return {
          totalScans: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          favoriteCount: 0,
          error: 'User not authenticated'
        };
      }

      const { data, error } = await supabase
        .from('ats_scans')
        .select('overall_score, is_favorite')
        .eq('user_id', user.id);

      if (error || !data) {
        return {
          totalScans: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          favoriteCount: 0,
          error: error?.message
        };
      }

      const totalScans = data.length;
      const scores = data.map(scan => scan.overall_score);
      const favoriteCount = data.filter(scan => scan.is_favorite).length;

      return {
        totalScans,
        averageScore: totalScans > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / totalScans) : 0,
        highestScore: totalScans > 0 ? Math.max(...scores) : 0,
        lowestScore: totalScans > 0 ? Math.min(...scores) : 0,
        favoriteCount
      };
    } catch (error) {
      console.error('Error in getScanStatistics:', error);
      return {
        totalScans: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        favoriteCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const atsScanStorageService = new ATSScanStorageService();