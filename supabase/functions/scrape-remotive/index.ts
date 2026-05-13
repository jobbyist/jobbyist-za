// Remotive scraper — pulls active remote jobs from Remotive's free API and
// inserts them into the jobs table. Targets roles open to South African talent.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAdminOrService } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string;
  category: string;
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary?: string;
  description: string;
  tags?: string[];
}

const SA_FRIENDLY = (loc: string) => {
  const l = (loc || "").toLowerCase();
  return (
    l.includes("worldwide") ||
    l.includes("anywhere") ||
    l.includes("global") ||
    l.includes("emea") ||
    l.includes("africa") ||
    l.includes("south africa") ||
    l === "" || l === "remote"
  );
};

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function parseSalary(salary?: string): { min?: number; max?: number; currency?: string } {
  if (!salary) return {};
  const m = salary.match(/(\$|€|£|R)\s?(\d[\d,\.]*)\s*(?:[-–to]+\s*(\$|€|£|R)?\s?(\d[\d,\.]*))?/);
  if (!m) return {};
  const cur = m[1] === "R" ? "ZAR" : m[1] === "€" ? "EUR" : m[1] === "£" ? "GBP" : "USD";
  const min = Number(m[2].replace(/[,\.]/g, ""));
  const max = m[4] ? Number(m[4].replace(/[,\.]/g, "")) : undefined;
  return { min, max, currency: cur };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const authFail = await requireAdminOrService(req);
  if (authFail) return authFail;

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const res = await fetch("https://remotive.com/api/remote-jobs?limit=200");
    if (!res.ok) throw new Error(`Remotive API ${res.status}`);
    const data = await res.json();
    const jobs: RemotiveJob[] = (data.jobs || []).filter((j: RemotiveJob) =>
      SA_FRIENDLY(j.candidate_required_location)
    );

    let created = 0;
    let companies = 0;

    for (const j of jobs) {
      const cSlug = slug(j.company_name);
      let companyId: string | null = null;
      const { data: existing } = await supabase
        .from("companies").select("id").eq("slug", cSlug).maybeSingle();
      if (existing) companyId = existing.id;
      else {
        const { data: nc } = await supabase.from("companies").insert({
          name: j.company_name, slug: cSlug, country: "ZA", is_active: true,
          location: "Remote", logo_url: j.company_logo || null,
          description: `${j.company_name} — international employer hiring remote talent.`,
        }).select("id").single();
        if (nc) { companyId = nc.id; companies++; }
      }
      if (!companyId) continue;

      // Dedupe by external_url
      const { data: dup } = await supabase
        .from("jobs").select("id").eq("external_url", j.url).maybeSingle();
      if (dup) continue;

      const { min, max, currency } = parseSalary(j.salary);
      const description = (j.description || "").replace(/<[^>]+>/g, "").slice(0, 8000);

      const { error } = await supabase.from("jobs").insert({
        company_id: companyId,
        title: j.title,
        description,
        job_type: j.job_type || "Full-time",
        employment_type: "Remote",
        experience_level: null,
        location: j.candidate_required_location || "Remote — Worldwide",
        country: "ZA",
        is_remote: true,
        salary_min: min ?? null,
        salary_max: max ?? null,
        salary_currency: currency || "USD",
        salary_period: "month",
        skills: j.tags || [],
        benefits: ["Remote work", "Flexible hours"],
        external_url: j.url,
        source_url: j.url,
        source_name: "Remotive",
        source: "remotive",
        status: "active",
        posted_at: j.publication_date || new Date().toISOString(),
      });
      if (!error) created++;
    }

    return new Response(JSON.stringify({ success: true, source: "remotive", created, companies, considered: jobs.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
