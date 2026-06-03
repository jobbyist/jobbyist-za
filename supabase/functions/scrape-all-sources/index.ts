// Orchestrator — invokes all scrapers in sequence, logs each run to scrape_runs,
// and ensures a daily minimum of 10 new jobs. Triggered by pg_cron at 07:00 UTC (09:00 SAST).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
  const db = createClient(supabaseUrl, serviceKey);

  const body = await req.json().catch(() => ({}));
  const triggeredBy = body.triggered_by || "manual";

  // Open a run log row
  const { data: runRow } = await db
    .from("scrape_runs")
    .insert({ triggered_by: triggeredBy, status: "running" })
    .select("id")
    .single();
  const runId = runRow?.id;

  const fns = ["scrape-remotive", "scrape-adzuna", "scrape-jooble", "scrape-sa-jobs"];
  const results: any[] = [];

  for (const fn of fns) {
    const startedAt = Date.now();
    try {
      const r = await fetch(`${supabaseUrl}/functions/v1/${fn}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
        body: "{}",
      });
      const data = await r.json().catch(() => ({}));
      results.push({ fn, status: r.status, durationMs: Date.now() - startedAt, ...data });
    } catch (e) {
      results.push({ fn, success: false, error: (e as Error).message, durationMs: Date.now() - startedAt });
    }
  }

  let totalCreated = results.reduce((acc, r) => acc + (r.created || r.jobsCreated || 0), 0);

  // Top up if under daily minimum of 10
  if (totalCreated < 10) {
    try {
      const topUp = await fetch(`${supabaseUrl}/functions/v1/auto-publish-jobs`, {
        method: "POST",
        headers: { Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ jobsPerCountry: Math.max(10 - totalCreated, 10) }),
      });
      const data = await topUp.json().catch(() => ({}));
      results.push({ fn: "auto-publish-jobs", status: topUp.status, ...data });
      const topped = Object.values(data?.jobsCreated || {}).reduce((a: number, n: any) => a + (n || 0), 0);
      totalCreated += topped as number;
    } catch (e) {
      results.push({ fn: "auto-publish-jobs", success: false, error: (e as Error).message });
    }
  }

  const finalStatus = totalCreated >= 10 ? "success" : "warning_low_yield";

  if (runId) {
    await db
      .from("scrape_runs")
      .update({
        status: finalStatus,
        total_created: totalCreated,
        results,
        finished_at: new Date().toISOString(),
      })
      .eq("id", runId);
  }

  // Alert support if yield is low
  if (totalCreated < 10) {
    const resend = Deno.env.get("RESEND_API_KEY");
    if (resend) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resend}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Jobbyist Alerts <noreply@jobbyist.africa>",
          to: ["support@jobbyist.africa"],
          subject: `⚠️ Daily scrape under minimum (${totalCreated} jobs)`,
          html: `<p>The daily scrape produced only <strong>${totalCreated}</strong> new jobs.</p><pre>${JSON.stringify(results, null, 2)}</pre>`,
        }),
      }).catch(() => {});
    }
  }

  return new Response(
    JSON.stringify({ success: true, totalCreated, status: finalStatus, runId, results }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
