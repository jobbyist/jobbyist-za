import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // This function can be triggered by:
    // 1. Cron job for scheduled notifications
    // 2. Manual trigger after new job matches
    const body = await req.json().catch(() => ({}));
    const frequency = body.frequency || 'daily'; // realtime, daily, weekly

    console.log(`Sending ${frequency} job notifications`);

    // Get users with active job matcher profiles
    const { data: profiles, error: profileError } = await supabase
      .from('job_matcher_profiles')
      .select('user_id, notification_frequency')
      .eq('is_active', true)
      .eq('notification_frequency', frequency);

    if (profileError) {
      throw new Error(`Failed to fetch profiles: ${profileError.message}`);
    }

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No users to notify' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let notificationsSent = 0;

    for (const profile of profiles) {
      try {
        // Get user's email
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profile.user_id);
        
        if (userError || !userData?.user?.email) {
          console.error(`Failed to get user ${profile.user_id}:`, userError);
          continue;
        }

        // Get new job matches for this user
        const timeFilter = getTimeFilter(frequency);
        const { data: matches, error: matchError } = await supabase
          .from('job_matches')
          .select('*, jobs(title, company_id, companies(name))')
          .eq('user_id', profile.user_id)
          .eq('status', 'new')
          .gte('created_at', timeFilter)
          .order('match_score', { ascending: false })
          .limit(10);

        if (matchError) {
          console.error(`Failed to get matches for user ${profile.user_id}:`, matchError);
          continue;
        }

        if (!matches || matches.length === 0) {
          continue; // No new matches to notify about
        }

        // Send notification email
        // TODO: Integrate with email service provider (SendGrid, Resend, or Supabase Auth)
        // For production, replace this with actual email service integration
        console.log(`Would send email to ${userData.user.email} with ${matches.length} new matches`);
        
        // Here you would call your email service API
        // await sendEmail({
        //   to: userData.user.email,
        //   subject: `${matches.length} New Job Matches for You!`,
        //   html: generateEmailHTML(matches),
        // });

        notificationsSent++;
      } catch (error) {
        console.error(`Error processing user ${profile.user_id}:`, error);
        continue;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        notifications_sent: notificationsSent,
        users_processed: profiles.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getTimeFilter(frequency: string): string {
  const now = new Date();
  
  switch (frequency) {
    case 'realtime':
      // Last hour
      now.setHours(now.getHours() - 1);
      break;
    case 'daily':
      // Last 24 hours
      now.setDate(now.getDate() - 1);
      break;
    case 'weekly':
      // Last 7 days
      now.setDate(now.getDate() - 7);
      break;
    default:
      now.setDate(now.getDate() - 1);
  }
  
  return now.toISOString();
}

function generateEmailHTML(matches: any[]): string {
  // Simple HTML email template
  let html = `
    <h2>You have ${matches.length} new job matches!</h2>
    <p>Check out these opportunities that match your profile:</p>
    <ul>
  `;
  
  for (const match of matches) {
    html += `
      <li>
        <strong>${match.jobs.title}</strong> at ${match.jobs.companies?.name}
        <br/>
        Match Score: ${match.match_score}%
      </li>
    `;
  }
  
  html += `
    </ul>
    <p><a href="${Deno.env.get('SITE_URL')}/job-matcher">View all matches</a></p>
  `;
  
  return html;
}
