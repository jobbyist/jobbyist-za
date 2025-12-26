import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CountryCode } from '@/lib/countries';

export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  responsibilities: string | null;
  qualifications: string | null;
  job_type: string;
  employment_type: string | null;
  experience_level: string | null;
  location: string;
  country: CountryCode;
  is_remote: boolean;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  salary_period: string;
  skills: string[];
  benefits: string[];
  application_deadline: string | null;
  external_url: string | null;
  source_url: string | null;
  source_name: string | null;
  status: string;
  views_count: number;
  applications_count: number;
  created_at: string;
  posted_at: string;
  company?: {
    id: string;
    name: string;
    logo_url: string | null;
    location: string | null;
    industry: string | null;
  };
}

interface UseJobsOptions {
  country?: CountryCode;
  search?: string;
  jobType?: string;
  experienceLevel?: string;
  isRemote?: boolean;
  limit?: number;
}

export function useJobs(options: UseJobsOptions = {}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchJobs();
  }, [options.country, options.search, options.jobType, options.experienceLevel, options.isRemote]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('jobs')
        .select(`
          *,
          company:companies(id, name, logo_url, location, industry)
        `)
        .eq('status', 'active')
        .order('posted_at', { ascending: false });

      if (options.country) {
        query = query.eq('country', options.country);
      }

      if (options.search) {
        query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
      }

      if (options.jobType) {
        query = query.eq('job_type', options.jobType);
      }

      if (options.experienceLevel) {
        query = query.eq('experience_level', options.experienceLevel);
      }

      if (options.isRemote !== undefined) {
        query = query.eq('is_remote', options.isRemote);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setJobs(data || []);
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { jobs, loading, error, refetch: fetchJobs };
}

export function useJob(jobId: string | undefined) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    if (!jobId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies(*)
        `)
        .eq('id', jobId)
        .maybeSingle();

      if (error) throw error;
      setJob(data);

      // Increment views
      if (data) {
        await supabase
          .from('jobs')
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq('id', jobId);
      }
    } catch (err: any) {
      console.error('Error fetching job:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { job, loading, error, refetch: fetchJob };
}
