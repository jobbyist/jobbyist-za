import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Edge function to clean up expired jobs
 * Automatically deletes jobs that are 30+ days old from their posted_at date
 * Should be invoked daily via Supabase cron job or external scheduler
 */
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting cleanup of expired jobs...');

    // Call the database function to delete expired jobs
    const { data, error } = await supabase.rpc('delete_expired_jobs');

    if (error) {
      console.error('Error deleting expired jobs:', error);
      throw error;
    }

    const deletedCount = data || 0;
    console.log(`Successfully deleted ${deletedCount} expired job(s)`);

    // Get current active job count
    const { count: activeJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .gte('posted_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    console.log(`Current active jobs: ${activeJobs}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Job cleanup completed successfully',
        deletedCount,
        activeJobsRemaining: activeJobs,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in cleanup-expired-jobs function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
