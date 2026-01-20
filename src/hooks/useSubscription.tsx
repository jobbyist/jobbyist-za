import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Subscription {
  id: string;
  user_id: string;
  subscription_type: 'jobseeker_pro' | 'recruitment_suite';
  plan_tier: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  features: any;
  price_paid: number | null;
  currency: string;
  started_at: string;
  expires_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      setSubscription(data);
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveSubscription = (type?: 'jobseeker_pro' | 'recruitment_suite'): boolean => {
    if (!subscription) return false;
    if (subscription.status !== 'active') return false;
    if (subscription.expires_at && new Date(subscription.expires_at) < new Date()) return false;
    if (type && subscription.subscription_type !== type) return false;
    return true;
  };

  const isPremium = (): boolean => {
    return hasActiveSubscription() && 
           (subscription?.plan_tier === 'premium' || subscription?.plan_tier === 'enterprise');
  };

  return {
    subscription,
    loading,
    hasActiveSubscription,
    isPremium,
    refetch: fetchSubscription,
  };
}
