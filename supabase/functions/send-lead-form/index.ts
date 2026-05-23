const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadFormRequest {
  formType: string;
  fields: Record<string, string>;
  honeypot?: string;
  destination?: string;
  replyTo?: string;
}

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const toSafeEmail = (value: string | undefined, fallback: string) => {
  const trimmed = value?.trim() ?? "";
  return EMAIL_REGEX.test(trimmed) ? trimmed : fallback;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Email service is not configured" }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const body = (await request.json()) as LeadFormRequest;
    const honeypot = body.honeypot?.trim() ?? "";
    if (honeypot.length > 0) {
      return new Response(JSON.stringify({ success: true, ignored: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!body.formType || !body.fields || Object.keys(body.fields).length === 0) {
      return new Response(JSON.stringify({ success: false, error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const defaultDestination = Deno.env.get("LEAD_FORMS_TO") ?? "support@jobbyist.africa";
    const destination = toSafeEmail(body.destination, defaultDestination);
    const from = Deno.env.get("LEAD_FORMS_FROM") ?? "Jobbyist Forms <noreply@jobbyist.africa>";
    const configuredCc = (Deno.env.get("LEAD_FORMS_CC") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter((item) => EMAIL_REGEX.test(item));

    const fields = Object.entries(body.fields).map(([key, value]) => [
      key,
      (value ?? "").toString().trim(),
    ]);

    const textBody = fields
      .map(([key, value]) => `${key}: ${value || "(empty)"}`)
      .join("\n");

    const htmlRows = fields
      .map(
        ([key, value]) =>
          `<tr><td style="padding:8px 12px;font-weight:600;border:1px solid #e2e8f0;">${escapeHtml(
            key,
          )}</td><td style="padding:8px 12px;border:1px solid #e2e8f0;">${escapeHtml(
            value || "(empty)",
          )}</td></tr>`,
      )
      .join("");

    const emailPayload = {
      from,
      to: [destination],
      cc: configuredCc.length > 0 ? configuredCc : undefined,
      reply_to: EMAIL_REGEX.test(body.replyTo?.trim() ?? "") ? body.replyTo?.trim() : undefined,
      subject: `[Jobbyist ZA] ${body.formType} submission`,
      text: `Form: ${body.formType}\n\n${textBody}`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#0f172a;">
          <h2 style="margin:0 0 12px;">${escapeHtml(body.formType)} submission</h2>
          <p style="margin:0 0 16px;color:#475569;">A new form submission was received on za.jobbyist.africa.</p>
          <table style="border-collapse:collapse;width:100%;max-width:680px;">${htmlRows}</table>
        </div>
      `,
    };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const result = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({ success: false, error: "Failed to send email", result }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, emailId: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
