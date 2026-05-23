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

interface DestinationConfig {
  to: string[];
  cc?: string[];
}

const DESTINATIONS: Record<string, DestinationConfig> = {
  waiting_list: { to: ["support@jobbyist.africa"] },
  recruitment_suite_waitlist: { to: ["support@jobbyist.africa"] },
  recruitment_suite_early_access: { to: ["support@jobbyist.africa"] },
  resume_audit: { to: ["support@jobbyist.africa"] },
  coming_soon: { to: ["support@jobbyist.africa"] },
  advertiser_inquiry: { to: ["partnerships@jobbyist.africa"], cc: ["support@jobbyist.africa"] },
  data_rights: { to: ["privacy@jobbyist.africa"], cc: ["support@jobbyist.africa"] },
  resource_newsletter: { to: ["support@jobbyist.africa"] },
};

const escapeHtml = (value: string) =>
  value.replace(/&(?![a-zA-Z0-9#]{1,20};)|[<>"']/g, (char) => {
    if (char === "&") return "&amp;";
    if (char === "<") return "&lt;";
    if (char === ">") return "&gt;";
    if (char === '"') return "&quot;";
    return "&#039;";
  });

const buildEmailHtml = (payload: LeadFormRequest) => {
  const fieldRows = Object.entries(payload.fields)
    .filter(([, value]) => value.trim().length > 0)
    .map(
      ([key, value]) => `
        <tr>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;text-transform:capitalize;">
            ${escapeHtml(key.replace(/([A-Z])/g, " $1").replaceAll("_", " "))}
          </td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  const sourceBlock = payload.sourcePage
    ? `<p style="margin:0 0 16px;"><strong>Source page:</strong> ${escapeHtml(payload.sourcePage)}</p>`
    : "";

  return `<!DOCTYPE html>
  <html>
    <body style="font-family:Inter,Arial,sans-serif;color:#111827;">
      <div style="max-width:680px;margin:24px auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
        <h1 style="margin:0 0 8px;font-size:22px;">${escapeHtml(payload.subject)}</h1>
        <p style="margin:0 0 16px;color:#4b5563;">
          Form type: <strong>${escapeHtml(payload.formType)}</strong>
        </p>
        ${sourceBlock}
        <table style="width:100%;border-collapse:collapse;">
          <tbody>
            ${fieldRows || '<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;">No fields provided.</td></tr>'}
          </tbody>
        </table>
      </div>
    </body>
  </html>`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Email service is not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const payload = (await req.json()) as LeadFormRequest;
    if (!payload.formType || !payload.subject || !payload.fields) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request payload." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const destination = DESTINATIONS[payload.formType];
    if (!destination) {
      return new Response(
        JSON.stringify({ success: false, error: "Unsupported form type." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Jobbyist Forms <noreply@jobbyist.africa>",
        to: destination.to,
        cc: destination.cc,
        reply_to: payload.replyTo,
        subject: payload.subject,
        html: buildEmailHtml(payload),
      }),
    });

    const responseData = (await response.json()) as { id?: string; message?: string };
    if (!response.ok) {
      return new Response(
        JSON.stringify({ success: false, error: responseData.message || "Email dispatch failed." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, emailId: responseData.id || null }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
