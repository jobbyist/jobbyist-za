// Jooble scraper — POSTs queries to Jooble for SA jobs.
// Requires JOOBLE_API_KEY (free).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAdminOrService } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface JoobleJob {
  title: string;
  location: string;
  snippet: string;
  salary: string;
  source: string;
  type: string;
  link: string;
  company: string;
  updated: string;
}

const KEYWORDS = [
  "developer", "engineer", "designer", "manager", "analyst",
  "marketing", "sales", "finance", "data", "product",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const authFail = await requireAdminOrService(req);
  if (authFail) return authFail;

  try {
    const apiKey = Deno.env.get("JOOBLE_API_KEY");
    if (!apiKey) throw new Error("JOOBLE_API_KEY missing");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = await req.json().catch(() => ({}));
    const keywords: string[] = body.keywords || KEYWORDS;

    let created = 0, companies = 0, considered = 0;

    for (const kw of keywords) {
      const res = await fetch(`https://jooble.org/api/${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: kw, location: "South Africa", page: "1" }),
      });
      if (!res.ok) { console.error(`Jooble ${kw} failed: ${res.status}`); continue; }
      const data = await res.json();
      const jobs: JoobleJob[] = data.jobs || [];
      considered += jobs.length;

      for (const j of jobs) {
        const cName = j.company || j.source || "Unknown Company";
        const cSlug = slug(cName);
        let companyId: string | null = null;
        const { data: existing } = await supabase
          .from("companies").select("id").eq("slug", cSlug).maybeSingle();
        if (existing) companyId = existing.id;
        else {
          const { data: nc } = await supabase.from("companies").insert({
            name: cName, slug: cSlug, country: "ZA", is_active: true,
            location: j.location || "South Africa",
            description: `${cName} — hiring in South Africa.`,
          }).select("id").single();
          if (nc) { companyId = nc.id; companies++; }
        }
        if (!companyId) continue;

        const { data: dup } = await supabase
          .from("jobs").select("id").eq("external_url", j.link).maybeSingle();
        if (dup) continue;

        const description = (j.snippet || "").replace(/<[^>]+>/g, "").slice(0, 8000);
        const { error } = await supabase.from("jobs").insert({
          company_id: companyId,
          title: j.title,
          description,
          job_type: j.type || "Full-time",
          employment_type: j.type || null,
          location: j.location || "South Africa",
          country: "ZA",
          is_remote: /remote/i.test(j.location) || /remote/i.test(j.title),
          salary_currency: "ZAR",
          salary_period: "month",
          skills: [],
          benefits: [],
          external_url: j.link,
          source_url: j.link,
          source_name: `Jooble (${j.source || "various"})`,
          source: "jooble",
          status: "active",
          posted_at: j.updated || new Date().toISOString(),
        });
        if (!error) created++;
      }
    }

    return new Response(JSON.stringify({ success: true, source: "jooble", created, companies, considered }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
