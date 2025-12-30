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
    useMap: true, // Use map to find job listing URLs
  },
  {
    url: 'https://weworkremotely.com/categories/remote-programming-jobs',
    name: 'We Work Remotely',
    description: 'Remote programming and tech jobs',
    useMap: true,
  },
  {
    url: 'https://remote.co/remote-jobs/developer/',
    name: 'Remote.co',
    description: 'Remote developer positions',
    useMap: false,
  },
  {
    url: 'https://www.workingnomads.com/jobs?category=development',
    name: 'Working Nomads',
    description: 'Remote development jobs for digital nomads',
    useMap: false,
  },
  {
    url: 'https://justremote.co/remote-jobs/software-development',
    name: 'Just Remote',
    description: 'Remote software development jobs',
    useMap: false,
  },
  {
    url: 'https://www.remotefrontendjobs.com/',
    name: 'Remote Frontend Jobs',
    description: 'Remote frontend developer positions',
    useMap: false,
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
  skills?: string[];
}

async function mapSiteWithFirecrawl(url: string, apiKey: string): Promise<string[]> {
  console.log(`Mapping site: ${url}`);
  
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/map', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        search: 'job listing, position, vacancy, career',
        ignoreSitemap: false,
        includeSubdomains: false,
        limit: 50, // Limit to 50 URLs
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Firecrawl map error for ${url}:`, error);
      return [];
    }

    const data = await response.json();
    return data.links || [];
  } catch (error) {
    console.error(`Error mapping ${url}:`, error);
    return [];
  }
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
        waitFor: 3000,
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

async function parseJobListingsWithAI(content: string, sourceName: string, apiKey: string): Promise<JobListing[]> {
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
          content: `You are a job listing parser extracting remote job opportunities from ${sourceName}.

CRITICAL: Focus ONLY on jobs that are:
- Remote/work-from-home positions
- Open to international candidates OR specifically mention South Africa
- In technology, software development, or related fields
- Currently open and active

For each qualifying job, extract:
- title: Job title (required)
- company: Company name (required)
- location: "Remote" or "Remote - Worldwide" or specific location if mentioned
- description: Brief 2-3 sentence description of the role and requirements
- url: Direct application URL if available
- salary: Salary range if mentioned (e.g., "$80k-$120k", "€60,000-€80,000")
- type: "Full-time", "Contract", "Part-time", etc.
- skills: Array of key technical skills mentioned (e.g., ["React", "Node.js", "Python"])

IMPORTANT RULES:
1. Only extract REAL job listings with clear titles and companies
2. Skip navigation links, headers, footers, ads
3. Skip jobs that are clearly location-restricted (e.g., "US only", "Must be in London")
4. If unsure if a job is remote, skip it
5. Return empty array [] if no valid jobs found
6. Return ONLY valid JSON array, no other text

Content to parse:
${content.substring(0, 15000)}

Return JSON array:`,
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
    
    // Validate and filter
    const validJobs = Array.isArray(jobs) 
      ? jobs.filter(job => 
          job.title && 
          job.company && 
          job.title.length > 3 &&
          job.company.length > 1 &&
          !job.title.toLowerCase().includes('load more') &&
          !job.title.toLowerCase().includes('sign up')
        )
      : [];
    
    return validJobs;
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
      description: `${companyName} is an international company offering remote opportunities for talented professionals worldwide.`,
      logo_url: `https://logo.clearbit.com/${domain}`,
      website: website || `https://${domain}`,
      industry: 'Technology',
      size: '50-200',
      country: 'ZA',
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
    // Check for duplicate by title and company
    const { data: existing } = await supabase
      .from('jobs')
      .select('id')
      .eq('company_id', companyId)
      .eq('title', job.title)
      .maybeSingle();

    if (existing) {
      console.log(`Duplicate job skipped: ${job.title} at ${job.company}`);
      return false;
    }

    // Parse salary if available
    let salaryMin = null;
    let salaryMax = null;
    let salaryCurrency = 'USD';
    
    if (job.salary) {
      // Enhanced salary parsing
      const salaryStr = job.salary.replace(/,/g, '');
      
      // Try to detect currency
      if (salaryStr.includes('€') || salaryStr.toLowerCase().includes('eur')) {
        salaryCurrency = 'EUR';
      } else if (salaryStr.includes('£') || salaryStr.toLowerCase().includes('gbp')) {
        salaryCurrency = 'GBP';
      }
      
      // Extract numbers
      const numbers = salaryStr.match(/(\d+)k?\s*-?\s*(\d+)k?/i);
      if (numbers) {
        salaryMin = parseInt(numbers[1]) * (salaryStr.includes('k') ? 1000 : 1);
        salaryMax = parseInt(numbers[2]) * (salaryStr.includes('k') ? 1000 : 1);
      }
    }

    const { error } = await supabase.from('jobs').insert({
      company_id: companyId,
      title: job.title,
      description: job.description || `Join ${job.company} as a ${job.title}. This is a remote position open to qualified candidates worldwide.`,
      job_type: job.type || 'Full-time',
      employment_type: job.type || 'Full-time',
      experience_level: 'Mid Level',
      location: job.location || 'Remote - Worldwide',
      country: 'ZA',
      is_remote: true,
      salary_min: salaryMin,
      salary_max: salaryMax,
      salary_currency: salaryCurrency,
      salary_period: 'year',
      skills: job.skills || [],
      benefits: ['Remote Work', 'Flexible Hours', 'International Team', 'Work From Anywhere'],
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
    const urlsToScrape: Array<{ url: string; source: string }> = [];

    // First, map sites to find job listing URLs
    for (const source of sourcesToUse) {
      if (totalJobsCreated >= targetCount) break;

      if (source.useMap) {
        console.log(`\nMapping ${source.name} to find job listings...`);
        const links = await mapSiteWithFirecrawl(source.url, firecrawlApiKey);
        console.log(`Found ${links.length} potential job URLs from ${source.name}`);
        
        // Add mapped URLs
        links.slice(0, 20).forEach(link => {
          urlsToScrape.push({ url: link, source: source.name });
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        // Add the main URL directly
        urlsToScrape.push({ url: source.url, source: source.name });
      }
    }

    // Scrape each URL
    console.log(`\nPreparing to scrape ${urlsToScrape.length} URLs...`);
    
    for (const { url, source } of urlsToScrape) {
      if (totalJobsCreated >= targetCount) {
        console.log(`Reached target of ${targetCount} jobs`);
        break;
      }

      console.log(`\nScraping: ${url}`);
      
      const scrapedData = await scrapeJobsWithFirecrawl(url, firecrawlApiKey);
      
      if (!scrapedData || !scrapedData.data) {
        console.log(`No data from ${url}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      const content = scrapedData.data.markdown || scrapedData.data.html || '';
      
      if (!content || content.length < 100) {
        console.log(`Insufficient content from ${url}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      console.log(`Parsing jobs from ${url} (${content.length} chars)...`);
      
      const jobs = await parseJobListingsWithAI(content, source, anthropicApiKey);
      
      console.log(`Extracted ${jobs.length} jobs from ${url}`);

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

        const success = await createJobListing(supabase, job, companyId, source);
        
        if (success) {
          totalJobsCreated++;
          console.log(`✓ Created job ${totalJobsCreated}/${targetCount}: ${job.title} at ${job.company}`);
        }
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`\n✅ Scraping complete. Created ${totalJobsCreated} remote jobs.`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully scraped ${totalJobsCreated} remote job listings`,
        jobsCreated: totalJobsCreated,
        targetCount,
        urlsScraped: urlsToScrape.length,
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
