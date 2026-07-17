// Daily job scraper orchestrator — coordinates Adzuna and Firecrawl scrapers
// Ensures 10-20 jobs are populated daily
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAdminOrService } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScraperResult {
  success: boolean;
  source?: string;
  created?: number;
  companies?: number;
  considered?: number;
  error?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const authFail = await requireAdminOrService(req);
  if (authFail) return authFail;

  try {
    const body = await req.json().catch(() => ({}));
    const targetCount = body.targetCount || 15; // Default to 15 jobs (middle of 10-20 range)

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    let totalCreated = 0;
    let totalCompanies = 0;
    let totalConsidered = 0;
    const results: ScraperResult[] = [];

    console.log(`Daily job scraper starting - target: ${targetCount} jobs`);

    // 1. Run Adzuna scraper (primary source - more reliable)
    console.log("Running Adzuna scraper...");
    try {
      const adzunaResponse = await fetch(`${supabaseUrl}/functions/v1/scrape-adzuna`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pages: 2, // 2 pages = up to 100 jobs to consider
          what: "", // All jobs
        }),
      });

      const adzunaResult: ScraperResult = await adzunaResponse.json();
      results.push(adzunaResult);

      if (adzunaResult.success) {
        totalCreated += adzunaResult.created || 0;
        totalCompanies += adzunaResult.companies || 0;
        totalConsidered += adzunaResult.considered || 0;
        console.log(`Adzuna: ${adzunaResult.created} jobs created`);
      } else {
        console.error("Adzuna scraper failed:", adzunaResult.error);
      }
    } catch (error) {
      console.error("Error calling Adzuna scraper:", error);
      results.push({ success: false, source: "adzuna", error: (error as Error).message });
    }

    // 2. If we haven't reached target, run Firecrawl scraper
    if (totalCreated < targetCount) {
      const remaining = targetCount - totalCreated;
      console.log(`Running Firecrawl scraper for ${remaining} more jobs...`);

      try {
        const firecrawlResponse = await fetch(`${supabaseUrl}/functions/v1/scrape-firecrawl-jobs`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetCount: remaining,
          }),
        });

        const firecrawlResult: ScraperResult = await firecrawlResponse.json();
        results.push(firecrawlResult);

        if (firecrawlResult.success) {
          totalCreated += firecrawlResult.created || 0;
          totalCompanies += firecrawlResult.companies || 0;
          totalConsidered += firecrawlResult.considered || 0;
          console.log(`Firecrawl: ${firecrawlResult.created} jobs created`);
        } else {
          console.error("Firecrawl scraper failed:", firecrawlResult.error);
        }
      } catch (error) {
        console.error("Error calling Firecrawl scraper:", error);
        results.push({ success: false, source: "firecrawl", error: (error as Error).message });
      }
    }

    console.log(`Daily scraper complete: ${totalCreated} jobs, ${totalCompanies} companies, ${totalConsidered} considered`);

    return new Response(
      JSON.stringify({ success: true, totalCreated, totalCompanies, totalConsidered, targetCount, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Daily job scraper error:", error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
