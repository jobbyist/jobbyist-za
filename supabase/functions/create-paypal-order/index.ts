// Creates a PayPal order for a Jobbyist Pro subscription (sandbox by default).
// Returns { id, approveUrl }. Front-end redirects the user to approveUrl.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PAYPAL_LIVE = (Deno.env.get("PAYPAL_LIVE") || "false").toLowerCase() === "true";
const PAYPAL_BASE = PAYPAL_LIVE ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const id = Deno.env.get("PAYPAL_CLIENT_ID")!;
  const secret = Deno.env.get("PAYPAL_CLIENT_SECRET")!;
  const auth = btoa(`${id}:${secret}`);
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`PayPal auth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!Deno.env.get("PAYPAL_CLIENT_ID") || !Deno.env.get("PAYPAL_CLIENT_SECRET")) {
      return new Response(JSON.stringify({ error: "PayPal not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    );
    const { data: userData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !userData?.user) return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    const user = userData.user;

    const body = await req.json().catch(() => ({}));
    const plan = body.plan === "annual" ? "annual" : "monthly";
    // USD equivalents for PayPal (Payfast covers ZAR).
    const value = plan === "annual" ? "54.00" : "5.50";
    const origin = req.headers.get("origin") || "https://jobbyist.co.za";

    const accessToken = await getAccessToken();
    const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          reference_id: `pro_${user.id}_${Date.now()}`,
          description: `Jobbyist Pro (${plan})`,
          custom_id: `${user.id}|${plan}`,
          amount: { currency_code: "USD", value },
        }],
        application_context: {
          brand_name: "Jobbyist",
          user_action: "PAY_NOW",
          return_url: `${origin}/profile?paypal=success`,
          cancel_url: `${origin}/pro?paypal=cancelled`,
        },
      }),
    });
    const orderData = await orderRes.json();
    if (!orderRes.ok) throw new Error(`PayPal order failed: ${JSON.stringify(orderData)}`);
    const approveUrl = (orderData.links || []).find((l: any) => l.rel === "approve")?.href;

    return new Response(JSON.stringify({ id: orderData.id, approveUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("create-paypal-order error", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
