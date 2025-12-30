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
  source_domain: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Load the remote jobs JSON file
    const response = await fetch('https://raw.githubusercontent.com/jobbyist/jobbyist-za/main/public/data/remote-jobs-international.json');
    const { job_listings } = await response.json();
    
    if (!job_listings || !Array.isArray(job_listings)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to load job listings' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let jobsCreated = 0;
    let companiesCreated = 0;
    let errors = 0;

    console.log(`Processing ${job_listings.length} remote jobs from international employers...`);

    for (const listing of job_listings) {
      try {
        const companyName = listing.hiring_organization?.name || 'Unknown Company';
        const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // All these jobs are remote positions for South Africa
        const country = 'ZA';
        const isRemote = true;

        // Create or find company
        let { data: company } = await supabase
          .from('companies')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();
        
        if (!company) {
          // Extract domain and set website
          const domain = listing.source_domain || '';
          const website = domain ? `https://${domain}` : '';
          const logoUrl = domain ? `https://logo.clearbit.com/${domain}` : '';
          
          const { data: newCompany } = await supabase
            .from('companies')
            .insert({
              name: companyName,
              slug,
              country,
              is_active: true,
              is_verified: true,
              location: 'International',
              website,
              logo_url: logoUrl,
              industry: 'Technology',
              description: `${companyName} is an international company hiring remote talent in South Africa.`,
            })
            .select('id')
            .single();
          company = newCompany;
          if (newCompany) companiesCreated++;
        }

        if (!company) {
          errors++;
          continue;
        }

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

        // Parse title to extract experience level
        const titleLower = (listing.job_title || '').toLowerCase();
        let experienceLevel = 'Mid Level';
        if (titleLower.includes('junior') || titleLower.includes('intern') || titleLower.includes('graduate') || titleLower.includes('entry')) {
          experienceLevel = 'Entry Level';
        } else if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('principal') || titleLower.includes('staff')) {
          experienceLevel = 'Senior';
        } else if (titleLower.includes('executive') || titleLower.includes('director') || titleLower.includes('head of') || titleLower.includes('chief') || titleLower.includes('manager')) {
          experienceLevel = 'Lead';
        }

        // Clean up title
        let title = listing.job_title || 'Untitled Position';
        title = title.replace(/ at .+$/i, '').trim().slice(0, 200);

        // Generate salary based on experience level (in ZAR)
        const salaryRanges: Record<string, number[]> = {
          'Entry Level': [25000, 45000],
          'Mid Level': [45000, 80000],
          'Senior': [80000, 150000],
          'Lead': [150000, 250000],
        };
        const range = salaryRanges[experienceLevel] || [45000, 80000];

        // Extract skills from title and description
        const skills: string[] = [];
        const skillsKeywords = [
          'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C#', 'AWS', 'Azure', 
          'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'Git', 'REST', 'GraphQL', 'Agile', 'Scrum',
          'Figma', 'Sketch', 'Design', 'UX', 'UI', 'Product Management', 'Analytics', 'Data',
          'Marketing', 'Sales', 'Customer Success', 'Support', 'Finance', 'Accounting', 'HR',
        ];
        
        const combinedText = (title + ' ' + listing.description_summary).toLowerCase();
        skillsKeywords.forEach(skill => {
          if (combinedText.includes(skill.toLowerCase())) {
            skills.push(skill);
          }
        });

        // Common benefits for remote international jobs
        const benefits = [
          'Remote Work',
          'Flexible Hours',
          'Competitive Salary',
          'Health Insurance',
          'Professional Development',
          'Equity/Stock Options',
          'Unlimited PTO',
          'Home Office Stipend',
          'Learning Budget',
          'Conference Attendance',
        ];

        const { error } = await supabase.from('jobs').insert({
          company_id: company.id,
          title,
          description: listing.description_summary || 'No description provided.',
          job_type: jobType,
          employment_type: listing.employment_type || 'Full Time',
          experience_level: experienceLevel,
          location: listing.location || 'Remote - South Africa',
          country,
          is_remote: isRemote,
          salary_min: range[0],
          salary_max: range[1],
          salary_currency: 'ZAR',
          salary_period: 'month',
          source_url: listing.source_url,
          source_name: listing.source_domain || 'remote-jobs',
          posted_at: listing.date_posted || new Date().toISOString().split('T')[0],
          status: 'active',
          skills: skills.slice(0, 10), // Limit to 10 skills
          benefits,
        });

        if (!error) {
          jobsCreated++;
        } else {
          console.error('Error inserting job:', error);
          errors++;
        }
      } catch (err) {
        console.error('Error processing job:', err);
        errors++;
      }
    }

    console.log(`Import complete. Created ${jobsCreated} jobs and ${companiesCreated} companies. Errors: ${errors}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        jobsCreated, 
        companiesCreated, 
        errors,
        total: job_listings.length 
      }),
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
