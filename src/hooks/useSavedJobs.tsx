import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface SavedJob {
  id: string;
  job_id: string;
  user_id: string;
  created_at: string;
}

export function useSavedJobs() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = useCallback(async () => {
    if (!user) {
      setSavedJobs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedJobs(data || []);
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  const isJobSaved = useCallback((jobId: string) => {
    return savedJobs.some(saved => saved.job_id === jobId);
  }, [savedJobs]);

  const saveJob = useCallback(async (jobId: string) => {
    if (!user) {
      toast.error('Please sign in to save jobs');
      return false;
    }

    try {
      const { error } = await supabase
        .from('saved_jobs')
        .insert({ job_id: jobId, user_id: user.id });

      if (error) {
        if (error.code === '23505') {
          toast.info('Job already saved');
          return false;
        }
        throw error;
      }

      await fetchSavedJobs();
      toast.success('Job saved!');
      return true;
    } catch (err) {
      console.error('Error saving job:', err);
      toast.error('Failed to save job');
      return false;
    }
  }, [user, fetchSavedJobs]);

  const unsaveJob = useCallback(async (jobId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('job_id', jobId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchSavedJobs();
      toast.success('Job removed from saved');
      return true;
    } catch (err) {
      console.error('Error removing saved job:', err);
      toast.error('Failed to remove job');
      return false;
    }
  }, [user, fetchSavedJobs]);

  const toggleSaveJob = useCallback(async (jobId: string) => {
    if (isJobSaved(jobId)) {
      return unsaveJob(jobId);
    } else {
      return saveJob(jobId);
    }
  }, [isJobSaved, saveJob, unsaveJob]);

  return {
    savedJobs,
    loading,
    isJobSaved,
    saveJob,
    unsaveJob,
    toggleSaveJob,
    refetch: fetchSavedJobs
  };
}
