// Creates a Payfast (South Africa) hosted checkout for a Jobbyist Pro subscription.
// Sandbox by default; set PAYFAST_LIVE=true env to use production.
//
// Response: { url } — redirect the browser to it.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const encode = (v: string) =>
  encodeURIComponent(v).replace(/%20/g, "+");

async function md5(input: string): Promise<string> {
  // Payfast requires MD5 signature. Deno std has md5 via std/hash but that's
  // deprecated; use a tiny inline implementation via crypto subtle is not
  // available for MD5. Fall back to npm: specifier.
  const { createHash } = await import("https://deno.land/std@0.224.0/hash/mod.ts").catch(() => ({ createHash: null as any }));
  if (createHash) return createHash("md5").update(input).toString();
  // Fallback: use npm blueimp-md5
  const { default: md5fn } = await import("https://esm.sh/blueimp-md5@2.19.0");
  return md5fn(input);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const merchantId = Deno.env.get("PAYFAST_MERCHANT_ID");
    const merchantKey = Deno.env.get("PAYFAST_MERCHANT_KEY");
    const passphrase = Deno.env.get("PAYFAST_PASSPHRASE") || "";
    const live = (Deno.env.get("PAYFAST_LIVE") || "false").toLowerCase() === "true";
    if (!merchantId || !merchantKey) {
      return new Response(JSON.stringify({ error: "Payfast not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    );
    const { data: userData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const user = userData.user;

    const body = await req.json().catch(() => ({}));
    const plan = body.plan === "annual" ? "annual" : "monthly";
    const amount = plan === "annual" ? "990.00" : "99.00";
    const origin = req.headers.get("origin") || "https://jobbyist.co.za";

    const fields: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${origin}/profile?payment=success`,
      cancel_url: `${origin}/pro?payment=cancelled`,
      notify_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/payfast-webhook`,
      name_first: (user.user_metadata?.first_name as string) || "",
      name_last: (user.user_metadata?.last_name as string) || "",
      email_address: user.email || "",
      m_payment_id: `pro_${user.id}_${Date.now()}`,
      amount,
      item_name: `Jobbyist Pro (${plan})`,
      custom_str1: user.id,
      custom_str2: plan,
      subscription_type: "1",
      billing_date: new Date().toISOString().slice(0, 10),
      recurring_amount: amount,
      frequency: plan === "annual" ? "6" : "3", // 3=monthly, 6=annually
      cycles: "0", // indefinite
    };

    // Signature: querystring in field order, urlencoded (spaces as +), + passphrase
    const keys = Object.keys(fields).filter((k) => fields[k] !== "");
    const qs = keys.map((k) => `${k}=${encode(fields[k])}`).join("&");
    const signatureInput = passphrase ? `${qs}&passphrase=${encode(passphrase)}` : qs;
    const signature = await md5(signatureInput);
    fields.signature = signature;

    const host = live ? "https://www.payfast.co.za" : "https://sandbox.payfast.co.za";
    const url = `${host}/eng/process?${Object.keys(fields)
      .map((k) => `${k}=${encode(fields[k])}`)
      .join("&")}`;

    return new Response(JSON.stringify({ url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("payfast-checkout error", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
