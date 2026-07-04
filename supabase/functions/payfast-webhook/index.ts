// Payfast ITN (Instant Transaction Notification) webhook.
// Validates the signature and updates the user's subscription row.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const encode = (v: string) => encodeURIComponent(v).replace(/%20/g, "+");

async function md5(input: string): Promise<string> {
  const { default: md5fn } = await import("https://esm.sh/blueimp-md5@2.19.0");
  return md5fn(input);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const passphrase = Deno.env.get("PAYFAST_PASSPHRASE") || "";
    const formText = await req.text();
    const params = new URLSearchParams(formText);
    const data: Record<string, string> = {};
    for (const [k, v] of params.entries()) data[k] = v;

    const receivedSig = data.signature || "";
    delete data.signature;
    const keys = Object.keys(data);
    const qs = keys.map((k) => `${k}=${encode(data[k])}`).join("&");
    const signatureInput = passphrase ? `${qs}&passphrase=${encode(passphrase)}` : qs;
    const expected = await md5(signatureInput);

    if (expected !== receivedSig) {
      console.warn("payfast-webhook: signature mismatch");
      return new Response("Invalid signature", { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const userId = data.custom_str1;
    const plan = data.custom_str2 || "monthly";
    const status = data.payment_status; // COMPLETE / FAILED / CANCELLED

    if (userId && status === "COMPLETE") {
      const expires = new Date();
      if (plan === "annual") expires.setFullYear(expires.getFullYear() + 1);
      else expires.setMonth(expires.getMonth() + 1);

      await supabase.from("subscriptions").upsert({
        user_id: userId,
        subscription_type: "jobseeker_pro",
        plan_tier: "premium",
        status: "active",
        price_paid: Number(data.amount_gross || 0),
        currency: "ZAR",
        started_at: new Date().toISOString(),
        expires_at: expires.toISOString(),
      }, { onConflict: "user_id,subscription_type" } as never);
      console.log("payfast-webhook: subscription activated", userId);
    } else if (userId && (status === "CANCELLED" || status === "FAILED")) {
      await supabase.from("subscriptions").update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      } as never).eq("user_id", userId).eq("subscription_type", "jobseeker_pro");
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("payfast-webhook error", msg);
    return new Response("Error", { status: 500 });
  }
});
