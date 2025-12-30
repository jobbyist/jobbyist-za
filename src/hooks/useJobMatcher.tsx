import { useState } from 'react';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface JobMatcherProfile {
  id: string;
  user_id: string;
  parsed_resume: Record<string, unknown> | null;
  job_titles: string[];
  locations: string[];
  remote_preference: 'remote' | 'hybrid' | 'onsite' | 'any';
  salary_min: number | null;
  salary_max: number | null;
  industries: string[];
  job_types: string[];
  notification_frequency: 'realtime' | 'daily' | 'weekly';
  auto_apply_enabled: boolean;
  auto_apply_min_score: number;
  cover_letter_template: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobMatch {
  id: string;
  user_id: string;
  job_id: string;
  match_score: number;
  match_reasons: {
    skills_matched: string[];
    experience_fit: string;
    location_match: boolean;
    salary_match: boolean;
    overall_reasoning: string;
  };
  status: 'new' | 'viewed' | 'saved' | 'applied' | 'auto_applied' | 'dismissed';
  applied_at: string | null;
  created_at: string;
  job?: Record<string, unknown>;
}

// This hook provides a placeholder for job matching functionality
// The job_matcher_profiles and job_matches tables need to be created first
export function useJobMatcher() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<JobMatcherProfile | null>(null);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading] = useState(false);
  const [matchingInProgress, setMatchingInProgress] = useState(false);

  const fetchProfile = async () => {
    // Placeholder - table doesn't exist yet
    console.log('Job matcher profiles table not configured');
  };

  const fetchMatches = async () => {
    // Placeholder - table doesn't exist yet
    console.log('Job matches table not configured');
  };

  const createOrUpdateProfile = async (profileData: Partial<JobMatcherProfile>) => {
    if (!user) {
      toast.error('Please sign in to continue');
      return { error: new Error('Not authenticated') };
    }

    // Store in local state for now
    setProfile({
      id: crypto.randomUUID(),
      user_id: user.id,
      parsed_resume: null,
      job_titles: profileData.job_titles || [],
      locations: profileData.locations || [],
      remote_preference: profileData.remote_preference || 'any',
      salary_min: profileData.salary_min || null,
      salary_max: profileData.salary_max || null,
      industries: profileData.industries || [],
      job_types: profileData.job_types || [],
      notification_frequency: profileData.notification_frequency || 'daily',
      auto_apply_enabled: profileData.auto_apply_enabled || false,
      auto_apply_min_score: profileData.auto_apply_min_score || 80,
      cover_letter_template: profileData.cover_letter_template || null,
      is_active: profileData.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...profileData,
    });
    
    toast.success('Profile preferences saved locally');
    return { error: null };
  };

  const parseResume = async (resumeText: string) => {
    if (!user) {
      toast.error('Please sign in to continue');
      return { error: new Error('Not authenticated'), data: null };
    }

    toast.info('Resume parsing feature coming soon');
    return { error: null, data: { text: resumeText } };
  };

  const matchJobs = async () => {
    if (!user) {
      toast.error('Please sign in to continue');
      return { error: new Error('Not authenticated') };
    }

    setMatchingInProgress(true);
    try {
      toast.info('Job matching feature coming soon');
      return { error: null };
    } finally {
      setMatchingInProgress(false);
    }
  };

  const generateCoverLetter = async (jobId: string) => {
    if (!user) {
      toast.error('Please sign in to continue');
      return { error: new Error('Not authenticated'), data: null };
    }

    toast.info('Cover letter generation feature coming soon');
    return { error: null, data: `Cover letter for job ${jobId}` };
  };

  const updateMatchStatus = async (matchId: string, status: JobMatch['status']) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Update local state
    setMatches(prev => prev.map(m => 
      m.id === matchId ? { ...m, status } : m
    ));
    
    toast.success('Match status updated');
    return { error: null };
  };

  return {
    profile,
    matches,
    loading,
    matchingInProgress,
    createOrUpdateProfile,
    parseResume,
    matchJobs,
    generateCoverLetter,
    updateMatchStatus,
    refetchProfile: fetchProfile,
    refetchMatches: fetchMatches,
  };
}
