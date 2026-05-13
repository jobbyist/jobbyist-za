// Orchestrator — invokes all scrapers in sequence and returns combined results.
import { requireAdminOrService } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const authFail = await requireAdminOrService(req);
  if (authFail) return authFail;

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const fns = ["scrape-remotive", "scrape-adzuna", "scrape-jooble"];
  const results: any[] = [];

  for (const fn of fns) {
    try {
      const r = await fetch(`${supabaseUrl}/functions/v1/${fn}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${serviceKey}`, "Content-Type": "application/json" },
        body: "{}",
      });
      const data = await r.json();
      results.push({ fn, ...data });
    } catch (e) {
      results.push({ fn, success: false, error: (e as Error).message });
    }
  }

  const totalCreated = results.reduce((acc, r) => acc + (r.created || 0), 0);
  return new Response(JSON.stringify({ success: true, totalCreated, results }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
