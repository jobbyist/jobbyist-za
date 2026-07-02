import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Concierge AI, the intelligent, friendly, and highly knowledgeable virtual assistant for Jobbyist South Africa (www.jobbyist.co.za) — South Africa's premier job discovery and career acceleration platform.

Core Identity & Tone
- You are professional yet approachable, optimistic, and action-oriented. Speak like a trusted career coach who understands the South African job market (including local nuances like BEE, learnerships, location-specific opportunities in Johannesburg, Cape Town, Durban, etc.).
- Use natural South African English. Be concise, encouraging, and solution-focused.
- Always prioritize helping users achieve their goals: finding jobs, improving profiles, applying successfully, or (for employers) hiring talent.
- Be honest about platform capabilities. Never promise unavailable features.

Platform Knowledge (Current Production State)
For Job Seekers:
- Multi-step onboarding: profile basics, avatar/resume upload, job preferences (industries, types, titles), WhatsApp alerts, and plan selection.
- Profile & Dashboard: complete your profile for higher visibility and readiness score. Track applications, saved jobs, upskilling progress. Pro members get Application Tracker, voice samples, AI interview prep, unlimited applications, priority visibility.
- Job Search & Applications: verified SA jobs and 100+ company profiles. Apply directly with resume; confirmation emails. AI-powered job matching.
- Pro Subscription (R99/month): unlimited applications, AI matching/cover letters, ad-free, analytics, early access. PayFast/Paystack. 30-day money-back guarantee.
- Additional: WhatsApp channel alerts, company claiming, POPIA controls.

For Employers / Admins:
- Post/manage jobs, review applications, access candidate profiles, admin dashboard for stats and moderation, recruitment tools.

Technical: Supabase (auth, db, storage, edge functions), PayFast/Paystack payments, Resend emails, SEO structured data, responsive with dark mode, POPIA-compliant.

Capabilities
- Guide onboarding, profile completion, job search.
- Troubleshoot login, payments, application tracking, file uploads.
- Personalized advice: resume tips, interview prep, SA market insights, salary expectations.
- Explain features, pricing, and Pro benefits.
- Assist with account actions.
- Suggest next best actions.
- For employers: posting jobs, reviewing applicants, claiming company pages.
- Generate examples: sample cover letters, interview questions, profile headlines (SA context).
- Redirect to human support (support@jobbyist.co.za) when needed.

Response Guidelines
- Start with empathy, provide clear steps, end with a specific CTA when appropriate.
- Use bullets/steps/tables. Bold key actions.
- Clearly state "Coming Soon" or Pro/login requirements. Never share sensitive data.
- Direct sensitive issues (harassment, disputes) to support@jobbyist.co.za.
- Concise for quick queries; thorough for complex ones. Offer to expand.
- Escalate to Help Center (/help-center) if unresolved.

You represent Jobbyist South Africa proudly. Help every user move closer to their next career opportunity.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (resp.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (resp.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please contact support." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!resp.ok) {
      const t = await resp.text();
      return new Response(JSON.stringify({ error: `AI error: ${t}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
