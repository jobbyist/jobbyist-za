const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobListing {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  job_type?: string;
  is_remote: boolean;
  skills?: string[];
  experience_level?: string;
}

interface ScrapeResult {
  success: boolean;
  jobs: JobListing[];
  source: string;
  error?: string;
}

// Remote job boards that hire South African talent
const REMOTE_JOB_SOURCES = [
  {
    name: 'WeWorkRemotely',
    searchUrl: 'https://weworkremotely.com/remote-jobs/search?term=south+africa',
    baseUrl: 'https://weworkremotely.com',
  },
  {
    name: 'RemoteOK',
    searchUrl: 'https://remoteok.com/remote-jobs?location=south-africa',
    baseUrl: 'https://remoteok.com',
  },
  {
    name: 'FlexJobs Remote',
    searchUrl: 'https://www.flexjobs.com/remote-jobs/south-africa',
    baseUrl: 'https://www.flexjobs.com',
  },
  {
    name: 'Working Nomads',
    searchUrl: 'https://www.workingnomads.com/jobs?location=south-africa',
    baseUrl: 'https://www.workingnomads.com',
  },
  {
    name: 'Remote.co',
    searchUrl: 'https://remote.co/remote-jobs/',
    baseUrl: 'https://remote.co',
  },
  {
    name: 'Himalayas',
    searchUrl: 'https://himalayas.app/jobs?countries=ZA',
    baseUrl: 'https://himalayas.app',
  },
  {
    name: 'Turing',
    searchUrl: 'https://www.turing.com/remote-developer-jobs',
    baseUrl: 'https://www.turing.com',
  },
  {
    name: 'Arc.dev',
    searchUrl: 'https://arc.dev/remote-jobs',
    baseUrl: 'https://arc.dev',
  },
];

// Job categories to search for
const JOB_CATEGORIES = [
  'software developer',
  'frontend developer',
  'backend developer',
  'full stack developer',
  'data scientist',
  'data analyst',
  'product manager',
  'project manager',
  'ux designer',
  'ui designer',
  'devops engineer',
  'cloud engineer',
  'mobile developer',
  'qa engineer',
  'machine learning',
  'customer success',
  'sales representative',
  'marketing manager',
  'content writer',
  'virtual assistant',
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      throw new Error('FIRECRAWL_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json().catch(() => ({}));
    const limit = body.limit || 250;
    const categories = body.categories || JOB_CATEGORIES.slice(0, 5);

    console.log(`Starting remote job scraper. Target: ${limit} jobs`);
    
    const allJobs: JobListing[] = [];
    const scrapeResults: ScrapeResult[] = [];

    // Use Firecrawl search to find remote jobs
    for (const category of categories) {
      if (allJobs.length >= limit) break;

      const searchQueries = [
        `remote ${category} jobs south africa`,
        `${category} remote work africa hiring`,
        `international remote ${category} hiring south african`,
      ];

      for (const query of searchQueries) {
        if (allJobs.length >= limit) break;

        try {
          console.log(`Searching: ${query}`);
          
          const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${firecrawlApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query,
              limit: 20,
              lang: 'en',
              country: 'ZA',
              scrapeOptions: {
                formats: ['markdown'],
              },
            }),
          });

          if (!searchResponse.ok) {
            console.error(`Search failed for query: ${query}`);
            continue;
          }

          const searchData = await searchResponse.json();
          
          if (searchData.data && Array.isArray(searchData.data)) {
            for (const result of searchData.data) {
              if (allJobs.length >= limit) break;

              // Parse job from search result
              const jobData = parseJobFromSearchResult(result, category);
              if (jobData) {
                allJobs.push(jobData);
              }
            }
          }

          // Rate limiting - small delay between requests
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`Error searching for ${query}:`, error);
        }
      }
    }

    // Also scrape specific remote job boards
    for (const source of REMOTE_JOB_SOURCES.slice(0, 4)) {
      if (allJobs.length >= limit) break;

      try {
        console.log(`Scraping: ${source.name}`);
        
        const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: source.searchUrl,
            formats: ['markdown', 'links'],
            onlyMainContent: true,
          }),
        });

        if (!scrapeResponse.ok) {
          console.error(`Scrape failed for ${source.name}`);
          continue;
        }

        const scrapeData = await scrapeResponse.json();
        
        // Parse jobs from scraped content
        const jobs = parseJobsFromScrape(scrapeData.data || scrapeData, source.name, source.baseUrl);
        
        for (const job of jobs) {
          if (allJobs.length >= limit) break;
          allJobs.push(job);
        }

        scrapeResults.push({
          success: true,
          jobs: jobs.slice(0, 10),
          source: source.name,
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error scraping ${source.name}:`, error);
        scrapeResults.push({
          success: false,
          jobs: [],
          source: source.name,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log(`Found ${allJobs.length} jobs total`);

    // Save jobs to database
    let jobsCreated = 0;
    let companiesCreated = 0;

    for (const job of allJobs) {
      try {
        // Create or get company
        const companySlug = job.company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        let companyId: string;
        
        const { data: existingCompany } = await supabase
          .from('companies')
          .select('id')
          .eq('slug', companySlug)
          .maybeSingle();

        if (existingCompany) {
          companyId = existingCompany.id;
        } else {
          const { data: newCompany, error: companyError } = await supabase
            .from('companies')
            .insert({
              name: job.company,
              slug: companySlug,
              country: 'ZA',
              is_active: true,
              location: 'Remote',
              description: `${job.company} - International employer offering remote opportunities`,
            })
            .select('id')
            .single();

          if (companyError) {
            console.error(`Error creating company ${job.company}:`, companyError);
            continue;
          }
          
          companyId = newCompany.id;
          companiesCreated++;
        }

        // Check for duplicate job
        const { data: existingJob } = await supabase
          .from('jobs')
          .select('id')
          .eq('company_id', companyId)
          .eq('title', job.title)
          .maybeSingle();

        if (existingJob) {
          continue; // Skip duplicate
        }

        // Create job
        const { error: jobError } = await supabase
          .from('jobs')
          .insert({
            company_id: companyId,
            title: job.title,
            description: job.description,
            job_type: job.job_type || 'Full-time',
            employment_type: 'Remote',
            experience_level: job.experience_level || 'Mid Level',
            location: job.location || 'Remote - Worldwide',
            country: 'ZA',
            is_remote: true,
            salary_min: job.salary_min || null,
            salary_max: job.salary_max || null,
            salary_currency: job.salary_currency || 'USD',
            salary_period: 'month',
            skills: job.skills || [],
            benefits: ['Remote Work', 'Flexible Hours', 'International Team'],
            source_url: job.url,
            source_name: 'Remote Job Scraper',
            external_url: job.url,
            status: 'active',
          });

        if (!jobError) {
          jobsCreated++;
        } else {
          console.error(`Error creating job ${job.title}:`, jobError);
        }

      } catch (error) {
        console.error(`Error processing job:`, error);
      }
    }

    console.log(`Created ${jobsCreated} jobs and ${companiesCreated} companies`);

    return new Response(
      JSON.stringify({
        success: true,
        jobsFound: allJobs.length,
        jobsCreated,
        companiesCreated,
        sources: scrapeResults.map(r => ({ name: r.source, success: r.success, jobCount: r.jobs.length })),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Remote job scraper error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function parseJobFromSearchResult(result: any, category: string): JobListing | null {
  try {
    const title = result.title || extractTitleFromContent(result.markdown || result.description || '', category);
    const company = extractCompanyFromContent(result.markdown || result.description || '', result.url || '');
    
    if (!title || !company) return null;

    const content = result.markdown || result.description || '';
    
    return {
      title,
      company,
      location: extractLocation(content) || 'Remote - Worldwide',
      description: generateJobDescription(title, company, content, category),
      url: result.url || '',
      is_remote: true,
      job_type: 'Full-time',
      skills: extractSkills(content, category),
      experience_level: extractExperienceLevel(content),
      ...extractSalary(content),
    };
  } catch {
    return null;
  }
}

function parseJobsFromScrape(data: any, sourceName: string, baseUrl: string): JobListing[] {
  const jobs: JobListing[] = [];
  const content = data.markdown || '';
  const links = data.links || [];

  // Try to extract job listings from markdown content
  const lines = content.split('\n');
  let currentJob: Partial<JobListing> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for job title patterns
    if (line.startsWith('#') || line.startsWith('**') || /^[A-Z][a-zA-Z\s]+(Developer|Engineer|Designer|Manager|Analyst|Specialist)/i.test(line)) {
      if (currentJob?.title && currentJob?.company) {
        jobs.push({
          title: currentJob.title,
          company: currentJob.company,
          location: currentJob.location || 'Remote',
          description: currentJob.description || generateDefaultDescription(currentJob.title, currentJob.company),
          url: currentJob.url || baseUrl,
          is_remote: true,
          job_type: 'Full-time',
          skills: currentJob.skills || [],
        });
      }
      
      currentJob = {
        title: line.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim(),
        is_remote: true,
      };
    }
    
    // Look for company names
    if (currentJob && !currentJob.company && (line.includes('at ') || line.includes('Company:') || line.includes('@'))) {
      const companyMatch = line.match(/(?:at |@|Company:\s*)([A-Za-z0-9\s&.-]+)/i);
      if (companyMatch) {
        currentJob.company = companyMatch[1].trim();
      }
    }
  }

  // Add last job
  if (currentJob?.title && currentJob?.company) {
    jobs.push({
      title: currentJob.title,
      company: currentJob.company,
      location: 'Remote',
      description: generateDefaultDescription(currentJob.title, currentJob.company),
      url: baseUrl,
      is_remote: true,
      job_type: 'Full-time',
      skills: [],
    });
  }

  // Also try to use links to find job postings
  for (const link of links.slice(0, 20)) {
    if (link.includes('/job') || link.includes('/position') || link.includes('/career')) {
      const titleFromUrl = link.split('/').pop()?.replace(/-/g, ' ').replace(/\d+/g, '').trim();
      if (titleFromUrl && titleFromUrl.length > 5) {
        jobs.push({
          title: capitalizeWords(titleFromUrl),
          company: sourceName,
          location: 'Remote',
          description: `Remote opportunity from ${sourceName}. This position offers the flexibility to work from anywhere while being part of an international team.`,
          url: link.startsWith('http') ? link : `${baseUrl}${link}`,
          is_remote: true,
          job_type: 'Full-time',
          skills: [],
        });
      }
    }
  }

  return jobs.slice(0, 30);
}

function extractTitleFromContent(content: string, category: string): string {
  // Try to find job title in content
  const titlePatterns = [
    /(?:hiring|looking for|job title:?)\s*([A-Za-z\s]+(?:Developer|Engineer|Designer|Manager|Analyst|Lead|Specialist|Architect))/i,
    /^#+\s*([A-Za-z\s]+(?:Developer|Engineer|Designer|Manager|Analyst|Lead|Specialist|Architect))/m,
  ];

  for (const pattern of titlePatterns) {
    const match = content.match(pattern);
    if (match) return match[1].trim();
  }

  // Default to category-based title
  return capitalizeWords(category);
}

function extractCompanyFromContent(content: string, url: string): string {
  // Try to extract company from content
  const companyPatterns = [
    /(?:at|company:?|employer:?)\s+([A-Za-z0-9\s&.-]+?)(?:\s+is|\s+are|\s+hiring|,|\.|$)/i,
    /([A-Za-z0-9]+(?:\.(?:com|io|co|org|net)))/i,
  ];

  for (const pattern of companyPatterns) {
    const match = content.match(pattern);
    if (match && match[1].length > 2 && match[1].length < 50) {
      return match[1].trim();
    }
  }

  // Extract from URL
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    const companyName = hostname.split('.')[0];
    if (companyName.length > 2) {
      return capitalizeWords(companyName.replace(/-/g, ' '));
    }
  } catch {
    // Invalid URL
  }

  return 'Remote Company';
}

function extractLocation(content: string): string {
  const locationPatterns = [
    /(?:location|remote in|based in|open to):?\s*([A-Za-z\s,]+(?:worldwide|global|africa|south africa|anywhere))/i,
    /(Remote\s*-?\s*(?:Worldwide|Global|Africa|South Africa|Anywhere))/i,
  ];

  for (const pattern of locationPatterns) {
    const match = content.match(pattern);
    if (match) return match[1].trim();
  }

  return 'Remote - Worldwide';
}

function extractSkills(content: string, category: string): string[] {
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js', 'Vue', 'Angular',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'SQL', 'PostgreSQL', 'MongoDB',
    'GraphQL', 'REST', 'API', 'Git', 'Agile', 'Scrum', 'CI/CD', 'DevOps',
    'Machine Learning', 'Data Science', 'AI', 'TensorFlow', 'PyTorch',
    'Figma', 'Sketch', 'Adobe', 'UX', 'UI', 'Design Systems',
    'Project Management', 'Product Management', 'Jira', 'Confluence',
    'Communication', 'Leadership', 'Problem Solving', 'Teamwork',
  ];

  const foundSkills = skillKeywords.filter(skill => 
    content.toLowerCase().includes(skill.toLowerCase())
  );

  // Add default skills based on category
  const categorySkills: Record<string, string[]> = {
    'software developer': ['JavaScript', 'Python', 'Git', 'Problem Solving'],
    'frontend developer': ['JavaScript', 'React', 'CSS', 'HTML'],
    'backend developer': ['Node.js', 'Python', 'SQL', 'API'],
    'full stack developer': ['JavaScript', 'React', 'Node.js', 'SQL'],
    'data scientist': ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    'devops engineer': ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    'ux designer': ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    'product manager': ['Product Strategy', 'Agile', 'Data Analysis', 'Communication'],
  };

  const defaultSkills = categorySkills[category.toLowerCase()] || [];
  
  return [...new Set([...foundSkills, ...defaultSkills])].slice(0, 8);
}

function extractExperienceLevel(content: string): string {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('senior') || lowerContent.includes('lead') || lowerContent.includes('5+ years') || lowerContent.includes('5-7 years')) {
    return 'Senior';
  }
  if (lowerContent.includes('mid') || lowerContent.includes('3+ years') || lowerContent.includes('3-5 years')) {
    return 'Mid Level';
  }
  if (lowerContent.includes('junior') || lowerContent.includes('entry') || lowerContent.includes('0-2 years') || lowerContent.includes('graduate')) {
    return 'Entry Level';
  }
  if (lowerContent.includes('principal') || lowerContent.includes('staff') || lowerContent.includes('architect') || lowerContent.includes('10+ years')) {
    return 'Lead';
  }
  
  return 'Mid Level';
}

function extractSalary(content: string): { salary_min?: number; salary_max?: number; salary_currency?: string } {
  // Try to find USD salary
  const usdPattern = /\$\s*([\d,]+)\s*(?:-|to)\s*\$?\s*([\d,]+)\s*(?:per\s*(?:year|month|annum)|\/\s*(?:yr|mo|year|month))?/i;
  const match = content.match(usdPattern);
  
  if (match) {
    const min = parseInt(match[1].replace(/,/g, ''));
    const max = parseInt(match[2].replace(/,/g, ''));
    
    // Convert annual to monthly if needed (assume monthly if < 20000)
    if (min > 20000) {
      return {
        salary_min: Math.round(min / 12),
        salary_max: Math.round(max / 12),
        salary_currency: 'USD',
      };
    }
    
    return {
      salary_min: min,
      salary_max: max,
      salary_currency: 'USD',
    };
  }
  
  return {};
}

function generateJobDescription(title: string, company: string, content: string, category: string): string {
  const cleanContent = content
    .replace(/#+\s*/g, '')
    .replace(/\*\*/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .substring(0, 500);

  return `
${company} is looking for a talented ${title} to join our remote team.

## About This Role
This is a fully remote position open to candidates based in South Africa or anywhere in Africa. We offer competitive compensation and the flexibility to work from anywhere.

## Overview
${cleanContent || `As a ${title}, you will be part of an international team working on challenging and impactful projects.`}

## What We Offer
- Fully remote work environment
- Competitive salary in USD
- Flexible working hours
- International team collaboration
- Professional development opportunities
- Work-life balance focus

## Requirements
- Strong ${category} skills and experience
- Excellent communication in English
- Reliable internet connection
- Self-motivated and able to work independently
- Team player with collaborative mindset

Join our growing team and work on exciting projects from anywhere in South Africa!
  `.trim();
}

function generateDefaultDescription(title: string, company: string): string {
  return `
${company} is hiring a ${title} to work remotely.

## About the Role
This is a remote position open to candidates in South Africa and worldwide. We're looking for skilled professionals who can contribute to our team while working from anywhere.

## What We Offer
- 100% Remote work
- Competitive compensation
- Flexible schedule
- International exposure
- Growth opportunities

## Requirements
- Relevant experience in the field
- Strong communication skills
- Self-motivated and organized
- Reliable internet connection

Apply now to join our distributed team!
  `.trim();
}

function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
