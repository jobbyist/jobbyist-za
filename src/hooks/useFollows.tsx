import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export function useFollows() {
  const { user } = useAuth();
  const [following, setFollowing] = useState<Follow[]>([]);
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFollows();
    } else {
      setFollowing([]);
      setFollowers([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFollows = async () => {
    if (!user) return;

    try {
      // Get users I'm following
      const { data: followingData, error: followingError } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', user.id);

      if (followingError) throw followingError;
      setFollowing(followingData || []);

      // Get my followers
      const { data: followersData, error: followersError } = await supabase
        .from('follows')
        .select('*')
        .eq('following_id', user.id);

      if (followersError) throw followersError;
      setFollowers(followersData || []);
    } catch (error: any) {
      console.error('Error fetching follows:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFollowing = (userId: string): boolean => {
    return following.some((f) => f.following_id === userId);
  };

  const isFollower = (userId: string): boolean => {
    return followers.some((f) => f.follower_id === userId);
  };

  const followUser = async (userId: string) => {
    if (!user) {
      toast.error('Please sign in to follow users');
      return { error: new Error('Not authenticated') };
    }

    if (userId === user.id) {
      toast.error('You cannot follow yourself');
      return { error: new Error('Cannot follow self') };
    }

    try {
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id: userId,
        });

      if (error) throw error;

      await fetchFollows();
      toast.success('Successfully followed user');
      return { error: null };
    } catch (error: any) {
      console.error('Error following user:', error);
      if (error.code === '23505') {
        toast.error('You are already following this user');
      } else {
        toast.error('Failed to follow user');
      }
      return { error };
    }
  };

  const unfollowUser = async (userId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      if (error) throw error;

      await fetchFollows();
      toast.success('Successfully unfollowed user');
      return { error: null };
    } catch (error: any) {
      console.error('Error unfollowing user:', error);
      toast.error('Failed to unfollow user');
      return { error };
    }
  };

  const getFollowersCount = (userId: string): number => {
    return followers.filter((f) => f.following_id === userId).length;
  };

  const getFollowingCount = (userId: string): number => {
    return following.filter((f) => f.follower_id === userId).length;
  };

  return {
    following,
    followers,
    loading,
    isFollowing,
    isFollower,
    followUser,
    unfollowUser,
    getFollowersCount,
    getFollowingCount,
    refetch: fetchFollows,
  };
}
