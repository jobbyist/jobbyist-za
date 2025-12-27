import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  country: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  years_of_experience: number;
  skills: string[];
  education: any[];
  work_experience: any[];
  verification_status: 'pending' | 'under_review' | 'approved' | 'rejected';
  verification_notes: string | null;
  profile_completion: number;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const mapDbToProfile = (data: any): Profile => ({
    ...data,
    education: Array.isArray(data.education) ? data.education : [],
    work_experience: Array.isArray(data.work_experience) ? data.work_experience : [],
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data ? mapDbToProfile(data) : null);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const dbUpdates: any = { ...updates };
      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await fetchProfile();
      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return { error };
    }
  };

  const uploadResume = async (file: File) => {
    if (!user) return { error: new Error('Not authenticated'), url: null };

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/resume.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Use signed URL for private resumes instead of public URL
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('resumes')
        .createSignedUrl(fileName, 86400); // 24 hour expiry

      if (signedUrlError) throw signedUrlError;

      // Store the file path in profile (not the signed URL, as it expires)
      // The signed URL will be generated on-demand when viewing
      await updateProfile({ resume_url: fileName });
      
      return { error: null, url: signedUrlData.signedUrl };
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume');
      return { error, url: null };
    }
  };

  // Generate a signed URL for viewing a resume
  const getResumeUrl = async (filePath: string, expiresIn: number = 3600) => {
    const { data, error } = await supabase.storage
      .from('resumes')
      .createSignedUrl(filePath, expiresIn);
    
    if (error) {
      console.error('Error generating signed URL:', error);
      return null;
    }
    return data.signedUrl;
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { error: new Error('Not authenticated'), url: null };

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      await updateProfile({ avatar_url: publicUrl });
      
      return { error: null, url: publicUrl };
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
      return { error, url: null };
    }
  };

  const canApplyToJobs = profile?.verification_status === 'approved' && profile?.profile_completion === 100;

  return {
    profile,
    loading,
    updateProfile,
    uploadResume,
    uploadAvatar,
    getResumeUrl,
    refetch: fetchProfile,
    canApplyToJobs,
  };
}
