// AI interview — uses Lovable AI Gateway to ask adaptive questions and
// summarize the candidate's value, expectations, and fit.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an experienced South African talent recruiter conducting a brief
voice-style interview. Ask one short, engaging question at a time. Cover (in order):
1) career goals next 12-24 months
2) salary expectations in ZAR
3) preferred work style (remote/hybrid/in-office) and ideal location in SA
4) top 3 strengths with a one-line example
5) one thing employers should know about you
After 5 questions return a final JSON summary. Be warm, concise, and South-African friendly.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const { messages, finalize, userId } = await req.json();

    const payload: any = {
      model: "google/gemini-2.5-flash",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...(messages || [])],
    };

    if (finalize) {
      payload.messages.push({
        role: "user",
        content: "Return ONLY a JSON object (no markdown) with keys: career_goals, salary_expectation_zar, work_style, location, strengths (array), unique_value, ideal_role, summary (2-3 sentence elevator pitch).",
      });
      payload.response_format = { type: "json_object" };
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 429) return new Response(JSON.stringify({ error: "Rate limit. Try again shortly." }), { status: 429, headers: corsHeaders });
    if (res.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: corsHeaders });
    if (!res.ok) throw new Error(`AI ${res.status}: ${await res.text()}`);

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";

    if (finalize && userId) {
      try {
        const summary = JSON.parse(content);
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        );
        await supabase.from("profiles").update({
          interview_summary: summary,
          interview_completed_at: new Date().toISOString(),
          headline: summary.ideal_role || undefined,
          bio: summary.summary || undefined,
        }).eq("user_id", userId);
      } catch (e) {
        console.error("Failed to persist interview:", e);
      }
    }

    return new Response(JSON.stringify({ message: content, finalized: !!finalize }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
