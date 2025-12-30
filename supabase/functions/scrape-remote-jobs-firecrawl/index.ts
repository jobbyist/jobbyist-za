import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Remote job boards that focus on international opportunities for SA talent
const REMOTE_JOB_SOURCES = [
  {
    url: 'https://remotive.com/remote-jobs/software-dev',
    name: 'Remotive',
    description: 'Remote tech jobs from companies worldwide',
  },
  {
    url: 'https://weworkremotely.com/categories/remote-programming-jobs',
    name: 'We Work Remotely',
    description: 'Remote programming and tech jobs',
  },
  {
    url: 'https://remote.co/remote-jobs/developer/',
    name: 'Remote.co',
    description: 'Remote developer positions',
  },
  {
    url: 'https://www.workingnomads.com/jobs?category=development',
    name: 'Working Nomads',
    description: 'Remote development jobs for digital nomads',
  },
];

interface JobListing {
  title: string;
  company: string;
  location: string;
  description: string;
  url?: string;
  salary?: string;
  type?: string;
}

async function scrapeJobsWithFirecrawl(url: string, apiKey: string): Promise<any> {
  console.log(`Scraping jobs from: ${url}`);
  
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        formats: ['markdown', 'html'],
        onlyMainContent: true,
        waitFor: 3000, // Wait for dynamic content
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Firecrawl error for ${url}:`, error);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
}

async function parseJobListingsWithAI(content: string, apiKey: string): Promise<JobListing[]> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `You are a job listing parser. Extract job listings from the following webpage content. 
Focus on remote jobs that would be suitable for South African talent.

For each job found, extract:
- title: Job title
- company: Company name
- location: Location (prefer "Remote" or "Remote - Worldwide")
- description: Brief job description (2-3 sentences)
- url: Job application URL if available
- salary: Salary information if mentioned
- type: Job type (Full-time, Contract, etc.)

Return ONLY valid JSON array of job objects. If no clear jobs found, return empty array [].

Content:
${content.substring(0, 15000)}

Return JSON array only:`,
        }],
      }),
    });

    if (!response.ok) {
      console.error('Anthropic API error:', await response.text());
      return [];
    }

    const data = await response.json();
    const responseText = data.content[0].text;
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.log('No JSON array found in AI response');
      return [];
    }

    const jobs = JSON.parse(jsonMatch[0]);
    return Array.isArray(jobs) ? jobs : [];
  } catch (error) {
    console.error('Error parsing jobs with AI:', error);
    return [];
  }
}

async function createOrGetCompany(
  supabase: any,
  companyName: string,
  website?: string
): Promise<string | null> {
  const slug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Check if company exists
  const { data: existing } = await supabase
    .from('companies')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (existing) {
    return existing.id;
  }

  // Extract domain from website or company name
  let domain = '';
  if (website) {
    try {
      const url = new URL(website.startsWith('http') ? website : `https://${website}`);
      domain = url.hostname.replace('www.', '');
    } catch (e) {
      domain = companyName.toLowerCase().replace(/\s+/g, '') + '.com';
    }
  } else {
    domain = companyName.toLowerCase().replace(/\s+/g, '') + '.com';
  }

  // Create new company
  const { data: newCompany, error } = await supabase
    .from('companies')
    .insert({
      name: companyName,
      slug,
      description: `${companyName} is an international company offering remote opportunities.`,
      logo_url: `https://logo.clearbit.com/${domain}`,
      website: website || `https://${domain}`,
      industry: 'Technology',
      size: '50-200',
      country: 'ZA', // Default to ZA but these are international companies
      location: 'Remote',
      is_active: true,
      is_verified: false,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating company:', error);
    return null;
  }

  return newCompany?.id || null;
}

async function createJobListing(
  supabase: any,
  job: JobListing,
  companyId: string,
  sourceName: string
): Promise<boolean> {
  try {
    // Parse salary if available
    let salaryMin = null;
    let salaryMax = null;
    let salaryCurrency = 'USD';
    
    if (job.salary) {
      // Simple salary parsing - can be enhanced
      const salaryMatch = job.salary.match(/\$?(\d+)k?\s*-?\s*\$?(\d+)k?/i);
      if (salaryMatch) {
        salaryMin = parseInt(salaryMatch[1]) * 1000;
        salaryMax = parseInt(salaryMatch[2]) * 1000;
      }
    }

    const { error } = await supabase.from('jobs').insert({
      company_id: companyId,
      title: job.title,
      description: job.description,
      job_type: job.type || 'Full-time',
      employment_type: job.type || 'Full-time',
      experience_level: 'Mid Level', // Default - can be parsed from description
      location: job.location || 'Remote',
      country: 'ZA',
      is_remote: true,
      salary_min: salaryMin,
      salary_max: salaryMax,
      salary_currency: salaryCurrency,
      salary_period: 'year',
      skills: [], // Can be extracted from description with AI
      benefits: ['Remote Work', 'Flexible Hours', 'International Team'],
      source_url: job.url || '',
      source_name: sourceName,
      status: 'active',
      posted_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error creating job:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in createJobListing:', error);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { targetCount = 250, sources = REMOTE_JOB_SOURCES } = await req.json();

    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    
    if (!firecrawlApiKey) {
      throw new Error('FIRECRAWL_API_KEY not configured');
    }
    
    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Starting remote job scraping with target of ${targetCount} jobs...`);

    let totalJobsCreated = 0;
    const sourcesToUse = Array.isArray(sources) ? sources : REMOTE_JOB_SOURCES;

    for (const source of sourcesToUse) {
      if (totalJobsCreated >= targetCount) {
        console.log(`Reached target of ${targetCount} jobs`);
        break;
      }

      console.log(`\nScraping ${source.name}...`);
      
      // Scrape the page with Firecrawl
      const scrapedData = await scrapeJobsWithFirecrawl(source.url, firecrawlApiKey);
      
      if (!scrapedData || !scrapedData.data) {
        console.log(`No data from ${source.name}`);
        continue;
      }

      // Extract markdown or HTML content
      const content = scrapedData.data.markdown || scrapedData.data.html || '';
      
      if (!content) {
        console.log(`No content from ${source.name}`);
        continue;
      }

      console.log(`Parsing job listings from ${source.name} with AI...`);
      
      // Parse jobs using AI
      const jobs = await parseJobListingsWithAI(content, anthropicApiKey);
      
      console.log(`Found ${jobs.length} jobs from ${source.name}`);

      // Create companies and job listings
      for (const job of jobs) {
        if (totalJobsCreated >= targetCount) break;

        const companyId = await createOrGetCompany(
          supabase,
          job.company,
          job.url ? new URL(job.url).origin : undefined
        );

        if (!companyId) {
          console.log(`Failed to create company for ${job.company}`);
          continue;
        }

        const success = await createJobListing(supabase, job, companyId, source.name);
        
        if (success) {
          totalJobsCreated++;
          console.log(`Created job ${totalJobsCreated}/${targetCount}: ${job.title} at ${job.company}`);
        }
      }

      // Add delay between sources to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`\nScraping complete. Created ${totalJobsCreated} remote jobs.`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully scraped ${totalJobsCreated} remote job listings`,
        jobsCreated: totalJobsCreated,
        targetCount,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Scraping error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
