// PayPal webhook receiver. Handles CHECKOUT.ORDER.APPROVED and
// PAYMENT.CAPTURE.COMPLETED to activate the user's Pro subscription.
//
// NOTE: For production, set PAYPAL_WEBHOOK_ID and verify the signature via
// /v1/notifications/verify-webhook-signature. For sandbox we log the event
// and process it based on resource.custom_id.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PAYPAL_LIVE = (Deno.env.get("PAYPAL_LIVE") || "false").toLowerCase() === "true";
const PAYPAL_BASE = PAYPAL_LIVE ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

async function verifySignature(headers: Headers, body: string): Promise<boolean> {
  const webhookId = Deno.env.get("PAYPAL_WEBHOOK_ID");
  if (!webhookId) return true; // skip in sandbox / when unconfigured
  const id = Deno.env.get("PAYPAL_CLIENT_ID")!;
  const secret = Deno.env.get("PAYPAL_CLIENT_SECRET")!;
  const tokenRes = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${id}:${secret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const { access_token } = await tokenRes.json();

  const verifyRes = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    }),
  });
  const data = await verifyRes.json();
  return data.verification_status === "SUCCESS";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const raw = await req.text();
    const ok = await verifySignature(req.headers, raw);
    if (!ok) {
      console.warn("paypal-webhook: signature verification failed");
      return new Response("Invalid signature", { status: 400 });
    }
    const event = JSON.parse(raw);
    console.log("paypal-webhook event", event.event_type);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED" || event.event_type === "CHECKOUT.ORDER.APPROVED") {
      const resource = event.resource || {};
      const customId: string = resource.custom_id
        || resource.purchase_units?.[0]?.custom_id
        || "";
      const [userId, plan] = customId.split("|");
      if (userId) {
        const expires = new Date();
        if (plan === "annual") expires.setFullYear(expires.getFullYear() + 1);
        else expires.setMonth(expires.getMonth() + 1);
        await supabase.from("subscriptions").upsert({
          user_id: userId,
          subscription_type: "jobseeker_pro",
          plan_tier: "premium",
          status: "active",
          price_paid: Number(resource.amount?.value || 0),
          currency: resource.amount?.currency_code || "USD",
          started_at: new Date().toISOString(),
          expires_at: expires.toISOString(),
        }, { onConflict: "user_id,subscription_type" } as never);
        console.log("paypal-webhook: subscription activated", userId);
      }
    }
    return new Response("OK", { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("paypal-webhook error", msg);
    return new Response("Error", { status: 500 });
  }
});
