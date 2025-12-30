import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface JobMatcherProfile {
  id: string;
  user_id: string;
  parsed_resume: any;
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
  job?: any;
}

export function useJobMatcher() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<JobMatcherProfile | null>(null);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchingInProgress, setMatchingInProgress] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchMatches();
    } else {
      setProfile(null);
      setMatches([]);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('job_matcher_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching job matcher profile:', error);
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('job_matches')
        .select('*, jobs(*, companies(*))')
        .eq('user_id', user.id)
        .order('match_score', { ascending: false });

      if (error) throw error;

      setMatches(data?.map((m: any) => ({
        ...m,
        job: m.jobs
      })) || []);
    } catch (error: any) {
      console.error('Error fetching job matches:', error);
      toast.error('Failed to fetch job matches');
    }
  };

  const createOrUpdateProfile = async (profileData: Partial<JobMatcherProfile>) => {
    if (!user) {
      toast.error('Please sign in to continue');
      return { error: new Error('Not authenticated') };
    }

    try {
      const dataToSave = {
        ...profileData,
        user_id: user.id,
      };

      const { error } = await supabase
        .from('job_matcher_profiles')
        .upsert(dataToSave, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      await fetchProfile();
      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error: any) {
      console.error('Error updating job matcher profile:', error);
      toast.error('Failed to update profile');
      return { error };
    }
  };

  const parseResume = async (resumeText: string) => {
    if (!user) {
      toast.error('Please sign in to continue');
      return { error: new Error('Not authenticated'), data: null };
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('match-jobs-ai', {
        body: {
          action: 'parse_resume',
          resumeText,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.error) throw response.error;

      return { error: null, data: response.data.parsed_resume };
    } catch (error: any) {
      console.error('Error parsing resume:', error);
      toast.error('Failed to parse resume');
      return { error, data: null };
    }
  };

  const matchJobs = async (parsedResume?: any, jobPreferences?: any) => {
    if (!user) {
      toast.error('Please sign in to continue');
      return { error: new Error('Not authenticated') };
    }

    setMatchingInProgress(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('match-jobs-ai', {
        body: {
          action: 'match_jobs',
          parsedResume: parsedResume || profile?.parsed_resume,
          jobPreferences: jobPreferences || {
            job_titles: profile?.job_titles,
            locations: profile?.locations,
            remote_preference: profile?.remote_preference,
            salary_min: profile?.salary_min,
            salary_max: profile?.salary_max,
            industries: profile?.industries,
            job_types: profile?.job_types,
          },
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.error) throw response.error;

      await fetchMatches();
      toast.success(`Found ${response.data.matches.length} matching jobs!`);
      return { error: null };
    } catch (error: any) {
      console.error('Error matching jobs:', error);
      toast.error('Failed to match jobs');
      return { error };
    } finally {
      setMatchingInProgress(false);
    }
  };

  const generateCoverLetter = async (jobId: string) => {
    if (!user) {
      toast.error('Please sign in to continue');
      return { error: new Error('Not authenticated'), data: null };
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('match-jobs-ai', {
        body: {
          action: 'generate_cover_letter',
          jobId,
          parsedResume: profile?.parsed_resume,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.error) throw response.error;

      return { error: null, data: response.data.cover_letter };
    } catch (error: any) {
      console.error('Error generating cover letter:', error);
      toast.error('Failed to generate cover letter');
      return { error, data: null };
    }
  };

  const updateMatchStatus = async (matchId: string, status: JobMatch['status']) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('job_matches')
        .update({ 
          status,
          ...(status === 'applied' || status === 'auto_applied' ? { applied_at: new Date().toISOString() } : {})
        })
        .eq('id', matchId);

      if (error) throw error;

      await fetchMatches();
      toast.success('Match status updated');
      return { error: null };
    } catch (error: any) {
      console.error('Error updating match status:', error);
      toast.error('Failed to update match status');
      return { error };
    }
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
