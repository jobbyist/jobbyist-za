import { indexJobUrl } from "../_shared/google-indexing.ts";
import { requireAdminOrService } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_ORIGIN = "https://za.jobbyist.africa";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const unauthorized = await requireAdminOrService(req);
  if (unauthorized) return unauthorized;
  try {
    const body = await req.json().catch(() => ({}));
    const dryRun = body.dryRun === true;
    const url = body.url || "https://za.jobbyist.africa/jobs/example";

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return new Response(JSON.stringify({ success: false, error: "invalid_url" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (parsedUrl.origin !== ALLOWED_ORIGIN) {
      return new Response(JSON.stringify({ success: false, error: "url_origin_not_allowed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (dryRun) {
      return new Response(
        JSON.stringify({
          success: true,
          dryRun: true,
          url: parsedUrl.toString(),
          type: "URL_UPDATED",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    await indexJobUrl(parsedUrl.toString());
    return new Response(
      JSON.stringify({ success: true, submitted: true, url: parsedUrl.toString(), type: "URL_UPDATED" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
