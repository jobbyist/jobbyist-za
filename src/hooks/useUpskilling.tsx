import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface UpskillingProgram {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  level: string | null;
  duration_weeks: number | null;
  skills: string[];
  badge_icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpskillingEnrollment {
  id: string;
  user_id: string;
  program_id: string;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  enrolled_at: string;
  program?: UpskillingProgram;
}

export function useUpskilling() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<UpskillingProgram[]>([]);
  const [enrollments, setEnrollments] = useState<UpskillingEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('upskilling_programs')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setPrograms(data || []);
    } catch (error: any) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('upskilling_enrollments')
        .select(`
          *,
          program:upskilling_programs(*)
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error: any) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const enrollInProgram = async (programId: string) => {
    if (!user) {
      toast.error('Please sign in to enroll');
      return { error: new Error('Not authenticated') };
    }

    try {
      const { error } = await supabase
        .from('upskilling_enrollments')
        .insert({
          user_id: user.id,
          program_id: programId,
          progress: 0,
          completed: false,
        });

      if (error) throw error;

      await fetchEnrollments();
      toast.success('Successfully enrolled in program!');
      return { error: null };
    } catch (error: any) {
      console.error('Error enrolling in program:', error);
      toast.error('Failed to enroll in program');
      return { error };
    }
  };

  const updateProgress = async (enrollmentId: string, progress: number) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const updates: any = {
        progress,
      };

      if (progress >= 100) {
        updates.completed = true;
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('upskilling_enrollments')
        .update(updates)
        .eq('id', enrollmentId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchEnrollments();
      if (progress >= 100) {
        toast.success('Congratulations! Program completed! 🎉');
      } else {
        toast.success('Progress updated');
      }
      return { error: null };
    } catch (error: any) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
      return { error };
    }
  };

  return {
    programs,
    enrollments,
    loading,
    enrollInProgram,
    updateProgress,
    refetch: () => {
      fetchPrograms();
      if (user) fetchEnrollments();
    },
  };
}
