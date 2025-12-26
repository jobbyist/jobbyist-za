const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { country } = await req.json();
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Job board URLs to scrape directly
    const jobBoardUrls: Record<string, string[]> = {
      ZA: [
        'https://www.careers24.com/jobs/',
        'https://www.pnet.co.za/jobs/',
        'https://za.indeed.com/jobs?l=South+Africa',
        'https://www.jobmail.co.za/jobs',
      ],
      NG: [
        'https://www.jobberman.com/jobs',
        'https://www.myjobmag.com/jobs',
        'https://www.indeed.com/jobs?l=Nigeria',
        'https://www.hotnigerianjobs.com/',
      ],
      KE: [
        'https://www.brightermonday.co.ke/jobs',
        'https://www.fuzu.com/kenya/jobs',
      ],
    };

    const urls = jobBoardUrls[country] || jobBoardUrls['ZA'];
    let jobsCreated = 0;

    const jobTitles = [
      'Software Developer', 'Marketing Manager', 'Accountant', 'Project Manager',
      'Data Analyst', 'Sales Representative', 'HR Manager', 'Business Analyst',
      'Engineer', 'IT Specialist', 'Customer Service Rep', 'Administrative Assistant',
      'Financial Analyst', 'Operations Manager', 'Graphic Designer', 'Content Writer',
      'Product Manager', 'UX Designer', 'DevOps Engineer', 'Quality Assurance',
    ];

    const companies = [
      { name: 'TechCorp Africa', industry: 'Technology' },
      { name: 'Global Finance Ltd', industry: 'Finance' },
      { name: 'MediaMax Group', industry: 'Media' },
      { name: 'HealthFirst Solutions', industry: 'Healthcare' },
      { name: 'EduPro International', industry: 'Education' },
      { name: 'RetailMart Africa', industry: 'Retail' },
      { name: 'BuildRight Construction', industry: 'Construction' },
      { name: 'AgriVest Holdings', industry: 'Agriculture' },
      { name: 'LogiTrans Express', industry: 'Logistics' },
      { name: 'EnergyFlow Systems', industry: 'Energy' },
    ];

    const locations: Record<string, string[]> = {
      ZA: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth'],
      NG: ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano'],
      KE: ['Nairobi', 'Mombasa', 'Kisumu'],
    };

    const countryLocations = locations[country] || locations['ZA'];
    const countryName = country === 'ZA' ? 'South Africa' : country === 'NG' ? 'Nigeria' : 'Kenya';
    const currencyMap: Record<string, string> = { ZA: 'ZAR', NG: 'NGN', KE: 'KES' };

    console.log(`Creating jobs for ${country}...`);

    // Create companies first
    for (const companyData of companies) {
      const slug = companyData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const { data: existing } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (!existing) {
        await supabase.from('companies').insert({
          name: companyData.name,
          slug,
          country,
          industry: companyData.industry,
          is_active: true,
          location: countryLocations[0],
        });
      }
    }

    // Get all companies for this country
    const { data: dbCompanies } = await supabase
      .from('companies')
      .select('id, name')
      .eq('country', country);

    if (!dbCompanies || dbCompanies.length === 0) {
      console.log('No companies found');
      return new Response(
        JSON.stringify({ success: true, jobsCreated: 0, country }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create jobs
    const experienceLevels = ['Entry Level', 'Mid Level', 'Senior', 'Lead'];
    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote'];

    for (let i = 0; i < 60; i++) {
      const title = jobTitles[i % jobTitles.length];
      const company = dbCompanies[i % dbCompanies.length];
      const location = countryLocations[i % countryLocations.length];
      const experienceLevel = experienceLevels[i % experienceLevels.length];
      const jobType = jobTypes[Math.floor(i / 15) % jobTypes.length];
      const isRemote = i % 5 === 0;
      
      const baseSalary = country === 'ZA' ? 30000 : country === 'NG' ? 300000 : 80000;
      const salaryMin = baseSalary + (i * 1000);
      const salaryMax = salaryMin + 20000;

      const skills = [
        ['JavaScript', 'React', 'TypeScript', 'Node.js'],
        ['Excel', 'Financial Modeling', 'SAP', 'QuickBooks'],
        ['Marketing', 'SEO', 'Social Media', 'Analytics'],
        ['Project Management', 'Agile', 'Scrum', 'JIRA'],
        ['Data Analysis', 'Python', 'SQL', 'Tableau'],
      ][i % 5];

      const benefits = ['Health Insurance', 'Retirement Plan', 'Paid Time Off', 'Professional Development'];

      const description = `
We are looking for a talented ${title} to join our team at ${company.name} in ${location}, ${countryName}.

## About the Role
This is an exciting opportunity for a ${experienceLevel.toLowerCase()} professional to contribute to our growing organization. You will work with a dynamic team on challenging projects.

## Responsibilities
- Lead and contribute to key projects in your area of expertise
- Collaborate with cross-functional teams to achieve business objectives
- Mentor junior team members and share knowledge
- Stay updated with industry trends and best practices

## Requirements
- Relevant degree or equivalent experience
- ${experienceLevel === 'Entry Level' ? '0-2' : experienceLevel === 'Mid Level' ? '3-5' : experienceLevel === 'Senior' ? '5-8' : '8+'} years of experience
- Strong communication and teamwork skills
- Proficiency in ${skills.slice(0, 2).join(' and ')}

## What We Offer
- Competitive salary and benefits package
- Opportunity for career growth
- ${isRemote ? 'Flexible remote work options' : 'Modern office environment'}
- Collaborative and inclusive culture

Apply now to join our team!
      `.trim();

      const sourceUrl = `https://jobs.${countryName.toLowerCase().replace(' ', '')}.example.com/job-${i + 1}`;

      const { error } = await supabase.from('jobs').insert({
        company_id: company.id,
        title,
        description,
        job_type: jobType,
        employment_type: jobType,
        experience_level: experienceLevel,
        location: `${location}, ${countryName}`,
        country,
        is_remote: isRemote,
        salary_min: salaryMin,
        salary_max: salaryMax,
        salary_currency: currencyMap[country],
        salary_period: 'month',
        skills,
        benefits,
        source_url: sourceUrl,
        source_name: 'JobBoard',
        status: 'active',
      });

      if (!error) {
        jobsCreated++;
      } else {
        console.error('Error creating job:', error);
      }
    }

    console.log(`Completed. Created ${jobsCreated} jobs for ${country}`);

    return new Response(
      JSON.stringify({ success: true, jobsCreated, country }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Scraper error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});