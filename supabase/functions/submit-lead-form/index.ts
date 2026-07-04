// Lead form submissions routed through the unified Resend email module.
import { sendEmail, escapeHtml } from "../_shared/email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadFormRequest {
  formType: string;
  subject: string;
  fields: Record<string, string>;
  replyTo?: string;
  sourcePage?: string;
}

interface DestinationConfig { to: string[]; cc?: string[]; }

const DESTINATIONS: Record<string, DestinationConfig> = {
  waiting_list: { to: ["support@jobbyist.co.za"] },
  recruitment_suite_waitlist: { to: ["support@jobbyist.co.za"] },
  recruitment_suite_early_access: { to: ["support@jobbyist.co.za"] },
  resume_audit: { to: ["support@jobbyist.co.za"] },
  coming_soon: { to: ["support@jobbyist.co.za"] },
  advertiser_inquiry: { to: ["partnerships@jobbyist.co.za"], cc: ["support@jobbyist.co.za"] },
  data_rights: { to: ["privacy@jobbyist.co.za"], cc: ["support@jobbyist.co.za"] },
  resource_newsletter: { to: ["support@jobbyist.co.za"] },
};

const buildEmailHtml = (payload: LeadFormRequest) => {
  const fieldRows = Object.entries(payload.fields)
    .filter(([, v]) => v.trim().length > 0)
    .map(([k, v]) => `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;text-transform:capitalize;">${escapeHtml(k.replace(/([A-Z])/g, " $1").replaceAll("_", " "))}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${escapeHtml(v)}</td></tr>`)
    .join("");
  const sourceBlock = payload.sourcePage
    ? `<p style="margin:0 0 16px;"><strong>Source page:</strong> ${escapeHtml(payload.sourcePage)}</p>` : "";
  return `<!DOCTYPE html><html><body style="font-family:Inter,Arial,sans-serif;color:#111827;">
    <div style="max-width:680px;margin:24px auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
      <h1 style="margin:0 0 8px;font-size:22px;">${escapeHtml(payload.subject)}</h1>
      <p style="margin:0 0 16px;color:#4b5563;">Form type: <strong>${escapeHtml(payload.formType)}</strong></p>
      ${sourceBlock}
      <table style="width:100%;border-collapse:collapse;"><tbody>${fieldRows || '<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;">No fields provided.</td></tr>'}</tbody></table>
    </div></body></html>`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const payload = (await req.json()) as LeadFormRequest;
    if (!payload.formType || !payload.subject || !payload.fields) {
      return new Response(JSON.stringify({ success: false, error: "Invalid payload." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const destination = DESTINATIONS[payload.formType];
    if (!destination) {
      return new Response(JSON.stringify({ success: false, error: "Unsupported form type." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const result = await sendEmail({
      to: destination.to,
      cc: destination.cc,
      replyTo: payload.replyTo,
      subject: payload.subject,
      html: buildEmailHtml(payload),
    });
    if (!result.success) {
      return new Response(JSON.stringify({ success: false, error: result.error || "Send failed" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ success: true, emailId: result.id || null }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
