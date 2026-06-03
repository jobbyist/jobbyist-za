// Tracks the current user's monthly application count and enforces
// Free vs Pro limits. Free users get 10 applications per calendar month.
// Pro members are unlimited.

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useSubscription } from "./useSubscription";

export const FREE_MONTHLY_LIMIT = 10;

export function useApplicationQuota() {
  const { user } = useAuth();
  const { hasActiveSubscription, loading: subLoading } = useSubscription();
  const isPro = hasActiveSubscription("jobseeker_pro");

  const [used, setUsed] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setUsed(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("job_applications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString());
    setUsed(count ?? 0);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const limit = isPro ? Infinity : FREE_MONTHLY_LIMIT;
  const remaining = isPro ? Infinity : Math.max(0, FREE_MONTHLY_LIMIT - used);
  const canApply = isPro || used < FREE_MONTHLY_LIMIT;

  return {
    loading: loading || subLoading,
    isPro,
    used,
    limit,
    remaining,
    canApply,
    refresh,
  };
}
