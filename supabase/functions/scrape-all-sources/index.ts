// Orchestrator — invokes all scrapers in sequence and returns combined results.
// Public endpoint (called by pg_cron daily at 07:00 UTC = 09:00 SAST).
// Protected by a 5-minute in-memory cooldown to prevent abuse.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

let lastRunAt = 0;
const COOLDOWN_MS = 5 * 60 * 1000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const now = Date.now();
  if (now - lastRunAt < COOLDOWN_MS) {
    return new Response(
      JSON.stringify({ success: false, error: "cooldown_active", retryInMs: COOLDOWN_MS - (now - lastRunAt) }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  lastRunAt = now;

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const fns = ["scrape-remotive", "scrape-adzuna", "scrape-jooble", "scrape-sa-jobs"];
  const results: any[] = [];

  for (const fn of fns) {
    try {
      const r = await fetch(`${supabaseUrl}/functions/v1/${fn}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${serviceKey}`, "Content-Type": "application/json" },
        body: "{}",
      });
      const data = await r.json().catch(() => ({}));
      results.push({ fn, status: r.status, ...data });
    } catch (e) {
      results.push({ fn, success: false, error: (e as Error).message });
    }
  }

  const totalCreated = results.reduce((acc, r) => acc + (r.created || r.jobsCreated || 0), 0);

  // Ensure minimum of 10 new jobs per day — top up with auto-publish-jobs if scrapers under-deliver.
  if (totalCreated < 10) {
    try {
      const topUp = await fetch(`${supabaseUrl}/functions/v1/auto-publish-jobs`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${serviceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ count: Math.max(10 - totalCreated, 10) }),
      });
      const data = await topUp.json().catch(() => ({}));
      results.push({ fn: "auto-publish-jobs", status: topUp.status, ...data });
    } catch (e) {
      results.push({ fn: "auto-publish-jobs", success: false, error: (e as Error).message });
    }
  }

  return new Response(
    JSON.stringify({ success: true, totalCreated, results }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
