// OAuth callback handler. Google Cloud Console redirect URIs
// (https://jobbyist.co.za/auth/callback and /auth/callback/google) point here.
// Supabase / Lovable auth SDK sets the session automatically; this page waits
// for it, then routes the user to their intended destination.
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const finish = async () => {
      // Session may be set via URL fragment/hash — Supabase parses automatically.
      const { data } = await supabase.auth.getSession();
      let next = "/profile";
      try {
        const stored = sessionStorage.getItem("jobbyist:auth-redirect");
        if (stored && stored.startsWith("/")) next = stored;
        sessionStorage.removeItem("jobbyist:auth-redirect");
      } catch { /* ignore */ }
      navigate(data.session ? next : "/auth", { replace: true });
    };
    finish();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
        <p className="text-muted-foreground">Signing you in…</p>
      </div>
    </div>
  );
};

export default AuthCallback;
