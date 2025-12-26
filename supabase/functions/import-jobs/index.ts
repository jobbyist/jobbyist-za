const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobListing {
  source_url: string;
  job_title: string;
  hiring_organization: { name: string };
  date_posted: string;
  employment_type: string;
  location: string;
  description_summary: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { job_listings } = await req.json();
    
    if (!job_listings || !Array.isArray(job_listings)) {
      return new Response(
        JSON.stringify({ success: false, error: 'job_listings array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseKey);

    let jobsCreated = 0;
    let companiesCreated = 0;

    console.log(`Processing ${job_listings.length} jobs...`);

    for (const listing of job_listings) {
      try {
        const companyName = listing.hiring_organization?.name || 'Unknown Company';
        const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // Determine country from location
        let country = 'ZA';
        const locationLower = (listing.location || '').toLowerCase();
        if (locationLower.includes('nigeria') || locationLower.includes('lagos') || locationLower.includes('abuja')) {
          country = 'NG';
        } else if (locationLower.includes('kenya') || locationLower.includes('nairobi')) {
          country = 'KE';
        }

        // Create or find company
        let { data: company } = await supabase
          .from('companies')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();
        
        if (!company) {
          const { data: newCompany } = await supabase
            .from('companies')
            .insert({
              name: companyName,
              slug,
              country,
              is_active: true,
              location: listing.location,
            })
            .select('id')
            .single();
          company = newCompany;
          if (newCompany) companiesCreated++;
        }

        if (!company) continue;

        // Check for duplicate by source_url
        const { data: existing } = await supabase
          .from('jobs')
          .select('id')
          .eq('source_url', listing.source_url)
          .maybeSingle();

        if (existing) continue;

        // Parse job type
        let jobType = 'Full-time';
        const empType = (listing.employment_type || '').toLowerCase();
        if (empType.includes('part')) jobType = 'Part-time';
        else if (empType.includes('contract')) jobType = 'Contract';
        else if (empType.includes('intern')) jobType = 'Internship';
        else if (empType.includes('hybrid')) jobType = 'Hybrid';

        // Parse title to extract experience level
        const titleLower = (listing.job_title || '').toLowerCase();
        let experienceLevel = 'Mid Level';
        if (titleLower.includes('junior') || titleLower.includes('intern') || titleLower.includes('graduate') || titleLower.includes('entry')) {
          experienceLevel = 'Entry Level';
        } else if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('principal')) {
          experienceLevel = 'Senior';
        } else if (titleLower.includes('executive') || titleLower.includes('director') || titleLower.includes('head of') || titleLower.includes('chief')) {
          experienceLevel = 'Lead';
        }

        // Clean up title
        let title = listing.job_title || 'Untitled Position';
        title = title.replace(/ at .+$/i, '').trim().slice(0, 200);

        // Generate salary based on experience level and country
        const salaryRanges: Record<string, Record<string, number[]>> = {
          ZA: { 'Entry Level': [15000, 30000], 'Mid Level': [30000, 60000], 'Senior': [60000, 100000], 'Lead': [100000, 180000] },
          NG: { 'Entry Level': [150000, 300000], 'Mid Level': [300000, 600000], 'Senior': [600000, 1000000], 'Lead': [1000000, 2000000] },
          KE: { 'Entry Level': [50000, 100000], 'Mid Level': [100000, 200000], 'Senior': [200000, 400000], 'Lead': [400000, 800000] },
        };
        const currencyMap: Record<string, string> = { ZA: 'ZAR', NG: 'NGN', KE: 'KES' };
        const range = salaryRanges[country]?.[experienceLevel] || [30000, 60000];

        const isRemote = empType.includes('remote') || (listing.description_summary || '').toLowerCase().includes('remote');

        const { error } = await supabase.from('jobs').insert({
          company_id: company.id,
          title,
          description: listing.description_summary || 'No description provided.',
          job_type: jobType,
          employment_type: listing.employment_type || 'Full Time',
          experience_level: experienceLevel,
          location: listing.location || 'South Africa',
          country,
          is_remote: isRemote,
          salary_min: range[0],
          salary_max: range[1],
          salary_currency: currencyMap[country],
          salary_period: 'month',
          source_url: listing.source_url,
          source_name: listing.source_domain || 'myjobmag.co.za',
          posted_at: listing.date_posted || new Date().toISOString().split('T')[0],
          status: 'active',
          skills: [],
          benefits: [],
        });

        if (!error) {
          jobsCreated++;
        } else {
          console.error('Error inserting job:', error);
        }
      } catch (err) {
        console.error('Error processing job:', err);
      }
    }

    console.log(`Import complete. Created ${jobsCreated} jobs and ${companiesCreated} companies`);

    return new Response(
      JSON.stringify({ success: true, jobsCreated, companiesCreated }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Import error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});