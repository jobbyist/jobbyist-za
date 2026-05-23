// Adzuna scraper — pulls SA jobs from the Adzuna API and inserts them.
// Requires ADZUNA_APP_ID + ADZUNA_APP_KEY (free tier).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAdminOrService } from "../_shared/auth.ts";
import { indexInsertedJob } from "../_shared/google-indexing.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface AdzunaJob {
  id: string;
  title: string;
  description: string;
  redirect_url: string;
  company: { display_name: string };
  location: { display_name: string; area?: string[] };
  category: { label: string };
  contract_type?: string;
  contract_time?: string;
  salary_min?: number;
  salary_max?: number;
  created: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const authFail = await requireAdminOrService(req);
  if (authFail) return authFail;

  try {
    const appId = Deno.env.get("ADZUNA_APP_ID");
    const appKey = Deno.env.get("ADZUNA_APP_KEY");
    if (!appId || !appKey) throw new Error("Adzuna credentials missing");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = await req.json().catch(() => ({}));
    const pages = body.pages || 5; // 50 per page → up to 250
    const what = body.what || "";

    let created = 0, companies = 0, considered = 0;

    for (let page = 1; page <= pages; page++) {
      const url = new URL(`https://api.adzuna.com/v1/api/jobs/za/search/${page}`);
      url.searchParams.set("app_id", appId);
      url.searchParams.set("app_key", appKey);
      url.searchParams.set("results_per_page", "50");
      url.searchParams.set("content-type", "application/json");
      if (what) url.searchParams.set("what", what);

      const res = await fetch(url.toString());
      if (!res.ok) {
        console.error(`Adzuna page ${page} failed: ${res.status}`);
        continue;
      }
      const data = await res.json();
      const results: AdzunaJob[] = data.results || [];
      considered += results.length;

      for (const j of results) {
        const cName = j.company?.display_name || "Unknown Company";
        const cSlug = slug(cName);
        let companyId: string | null = null;
        const { data: existing } = await supabase
          .from("companies").select("id").eq("slug", cSlug).maybeSingle();
        if (existing) companyId = existing.id;
        else {
          const { data: nc } = await supabase.from("companies").insert({
            name: cName, slug: cSlug, country: "ZA", is_active: true,
            location: j.location?.display_name || "South Africa",
            description: `${cName} — hiring in South Africa.`,
          }).select("id").single();
          if (nc) { companyId = nc.id; companies++; }
        }
        if (!companyId) continue;

        const { data: dup } = await supabase
          .from("jobs").select("id").eq("external_url", j.redirect_url).maybeSingle();
        if (dup) continue;

        const loc = j.location?.display_name || "South Africa";
        const { data: insertedJob, error } = await supabase.from("jobs").insert({
          company_id: companyId,
          title: j.title,
          description: (j.description || "").slice(0, 8000),
          job_type: j.contract_time === "part_time" ? "Part-time" : "Full-time",
          employment_type: j.contract_type === "permanent" ? "Permanent" : "Contract",
          location: loc,
          country: "ZA",
          is_remote: /remote/i.test(loc) || /remote/i.test(j.title),
          salary_min: j.salary_min ? Math.round(j.salary_min) : null,
          salary_max: j.salary_max ? Math.round(j.salary_max) : null,
          salary_currency: "ZAR",
          salary_period: "year",
          skills: [],
          benefits: [],
          external_url: j.redirect_url,
          source_url: j.redirect_url,
          source_name: "Adzuna",
          source: "adzuna",
          status: "active",
          posted_at: j.created || new Date().toISOString(),
        }).select("id, slug").single();
        if (!error) {
          created++;
          void indexInsertedJob(insertedJob);
        }
      }
    }

    return new Response(JSON.stringify({ success: true, source: "adzuna", created, companies, considered }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
