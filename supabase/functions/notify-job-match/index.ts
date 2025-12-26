import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotifyRequest {
  jobId?: string;
  testEmail?: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { jobId, testEmail }: NotifyRequest = await req.json().catch(() => ({}));

    // Get the job details
    let job = null;
    if (jobId) {
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select(`*, company:companies(name, logo_url)`)
        .eq("id", jobId)
        .single();

      if (jobError) {
        console.error("Error fetching job:", jobError);
        throw new Error("Job not found");
      }
      job = jobData;
    }

    // If test email, send to that address only
    if (testEmail) {
      const emailResponse = await resend.emails.send({
        from: "Jobbyist Africa <onboarding@resend.dev>",
        to: [testEmail],
        subject: job ? `New Job: ${job.title} at ${job.company?.name}` : "Test Email from Jobbyist",
        html: job ? generateJobEmailHtml(job) : generateTestEmailHtml(),
      });

      console.log("Test email sent:", emailResponse);
      return new Response(
        JSON.stringify({ success: true, message: "Test email sent" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get verified users with matching skills
    if (!job) {
      return new Response(
        JSON.stringify({ error: "Job ID required for notifications" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const jobSkills = job.skills || [];
    const jobCountry = job.country;

    // Find users with matching skills or country preference
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("email, first_name, skills, country")
      .eq("verification_status", "verified");

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
    }

    const matchingProfiles = (profiles || []).filter((profile) => {
      // Match by country
      if (profile.country === jobCountry) return true;
      
      // Match by skills
      const userSkills = profile.skills || [];
      return jobSkills.some((skill: string) => 
        userSkills.some((userSkill: string) => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );
    });

    console.log(`Found ${matchingProfiles.length} matching profiles for job ${job.title}`);

    // Send emails to matching users
    const emailPromises = matchingProfiles.map(async (profile) => {
      try {
        await resend.emails.send({
          from: "Jobbyist Africa <onboarding@resend.dev>",
          to: [profile.email],
          subject: `New Job Match: ${job.title} at ${job.company?.name}`,
          html: generateJobEmailHtml(job, profile.first_name),
        });
        return { email: profile.email, success: true };
      } catch (err) {
        console.error(`Failed to send email to ${profile.email}:`, err);
        return { email: profile.email, success: false, error: err };
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter((r) => r.success).length;

    console.log(`Sent ${successCount}/${matchingProfiles.length} notification emails`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        notified: successCount, 
        total: matchingProfiles.length 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in notify-job-match:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});

function generateJobEmailHtml(job: any, userName?: string): string {
  const greeting = userName ? `Hi ${userName},` : "Hi there,";
  const salaryText = job.salary_min && job.salary_max 
    ? `${job.salary_currency || 'ZAR'} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} per ${job.salary_period || 'month'}`
    : "Competitive salary";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; background: #000; color: #fff; }
        .header h1 { margin: 0; font-size: 24px; }
        .job-card { background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .job-title { font-size: 20px; font-weight: bold; color: #000; margin-bottom: 5px; }
        .company { color: #666; font-size: 16px; margin-bottom: 15px; }
        .meta { color: #888; font-size: 14px; margin-bottom: 10px; }
        .salary { color: #000; font-weight: bold; font-size: 16px; margin: 15px 0; }
        .skills { margin: 15px 0; }
        .skill { display: inline-block; background: #e0e0e0; padding: 4px 12px; border-radius: 15px; font-size: 12px; margin: 2px; }
        .cta { text-align: center; margin: 30px 0; }
        .cta a { display: inline-block; background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Jobbyist Africa</h1>
        </div>
        <p>${greeting}</p>
        <p>We found a new job that matches your profile!</p>
        <div class="job-card">
          <div class="job-title">${job.title}</div>
          <div class="company">${job.company?.name || 'Company'}</div>
          <div class="meta">📍 ${job.location} ${job.is_remote ? '• 🌐 Remote OK' : ''}</div>
          <div class="meta">💼 ${job.job_type} ${job.experience_level ? `• ${job.experience_level}` : ''}</div>
          <div class="salary">💰 ${salaryText}</div>
          ${job.skills && job.skills.length > 0 ? `
            <div class="skills">
              ${job.skills.slice(0, 5).map((s: string) => `<span class="skill">${s}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        <div class="cta">
          <a href="https://jobbyist.africa/jobs/${job.id}">View Job</a>
        </div>
        <div class="footer">
          <p>You're receiving this because you're a verified Jobbyist user.</p>
          <p>© ${new Date().getFullYear()} Jobbyist Africa</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateTestEmailHtml(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
        .header { padding: 20px 0; background: #000; color: #fff; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 40px 20px; }
        h2 { color: #000; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Jobbyist Africa</h1>
        </div>
        <div class="content">
          <h2>✅ Email Notifications Working!</h2>
          <p>This is a test email from Jobbyist Africa.</p>
          <p>Job notification emails are configured correctly.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
