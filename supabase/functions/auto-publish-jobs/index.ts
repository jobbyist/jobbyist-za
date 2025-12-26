import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Job templates for realistic job generation
const jobTemplates = {
  ZA: {
    cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Sandton', 'Midrand', 'Centurion'],
    companies: [
      { name: 'Discovery Limited', industry: 'Insurance & Financial Services' },
      { name: 'Naspers', industry: 'Technology & Media' },
      { name: 'Standard Bank', industry: 'Banking' },
      { name: 'MTN South Africa', industry: 'Telecommunications' },
      { name: 'Shoprite Holdings', industry: 'Retail' },
      { name: 'Vodacom', industry: 'Telecommunications' },
      { name: 'FirstRand', industry: 'Financial Services' },
      { name: 'Sasol', industry: 'Energy & Chemicals' },
      { name: 'Investec', industry: 'Banking & Asset Management' },
      { name: 'Capitec Bank', industry: 'Banking' },
      { name: 'Takealot', industry: 'E-commerce' },
      { name: 'Woolworths Holdings', industry: 'Retail' },
    ],
    currency: 'ZAR',
    salaryMultiplier: 1,
  },
  NG: {
    cities: ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Victoria Island', 'Lekki', 'Ikeja'],
    companies: [
      { name: 'Dangote Group', industry: 'Conglomerate' },
      { name: 'GTBank', industry: 'Banking' },
      { name: 'MTN Nigeria', industry: 'Telecommunications' },
      { name: 'Access Bank', industry: 'Banking' },
      { name: 'Zenith Bank', industry: 'Banking' },
      { name: 'Flutterwave', industry: 'Fintech' },
      { name: 'Paystack', industry: 'Fintech' },
      { name: 'Andela', industry: 'Technology' },
      { name: 'Interswitch', industry: 'Fintech' },
      { name: 'First Bank', industry: 'Banking' },
      { name: 'Jumia Nigeria', industry: 'E-commerce' },
      { name: 'Kuda Bank', industry: 'Digital Banking' },
    ],
    currency: 'NGN',
    salaryMultiplier: 20,
  },
  KE: {
    cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Westlands', 'Karen', 'Kilimani', 'Upper Hill'],
    companies: [
      { name: 'Safaricom', industry: 'Telecommunications' },
      { name: 'Equity Bank', industry: 'Banking' },
      { name: 'KCB Group', industry: 'Banking' },
      { name: 'M-Pesa', industry: 'Fintech' },
      { name: 'Twiga Foods', industry: 'AgriTech' },
      { name: 'Cellulant', industry: 'Fintech' },
      { name: 'Sendy', industry: 'Logistics' },
      { name: 'Kenya Airways', industry: 'Aviation' },
      { name: 'NCBA Bank', industry: 'Banking' },
      { name: 'Jumia Kenya', industry: 'E-commerce' },
      { name: 'Africa Talking', industry: 'Technology' },
      { name: 'Cooperative Bank', industry: 'Banking' },
    ],
    currency: 'KES',
    salaryMultiplier: 5,
  },
};

const jobTitles = [
  { title: 'Software Engineer', type: 'Full-time', level: 'Mid Level', skills: ['JavaScript', 'React', 'Node.js', 'Git', 'Agile'], baseSalary: 45000 },
  { title: 'Senior Software Engineer', type: 'Full-time', level: 'Senior', skills: ['TypeScript', 'React', 'AWS', 'System Design', 'Leadership'], baseSalary: 75000 },
  { title: 'Data Scientist', type: 'Full-time', level: 'Mid Level', skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'], baseSalary: 55000 },
  { title: 'Product Manager', type: 'Full-time', level: 'Senior', skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Stakeholder Management', 'Roadmapping'], baseSalary: 65000 },
  { title: 'UX/UI Designer', type: 'Full-time', level: 'Mid Level', skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Adobe XD'], baseSalary: 40000 },
  { title: 'DevOps Engineer', type: 'Full-time', level: 'Senior', skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'], baseSalary: 70000 },
  { title: 'Marketing Manager', type: 'Full-time', level: 'Senior', skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Brand Management'], baseSalary: 50000 },
  { title: 'Financial Analyst', type: 'Full-time', level: 'Mid Level', skills: ['Financial Modeling', 'Excel', 'Data Analysis', 'Reporting', 'Forecasting'], baseSalary: 45000 },
  { title: 'Human Resources Manager', type: 'Full-time', level: 'Senior', skills: ['Recruitment', 'Employee Relations', 'HR Policies', 'Performance Management', 'HRIS'], baseSalary: 48000 },
  { title: 'Sales Executive', type: 'Full-time', level: 'Entry Level', skills: ['Sales', 'CRM', 'Negotiation', 'Communication', 'Client Management'], baseSalary: 30000 },
  { title: 'Business Analyst', type: 'Full-time', level: 'Mid Level', skills: ['Requirements Gathering', 'SQL', 'Process Mapping', 'Stakeholder Management', 'Documentation'], baseSalary: 42000 },
  { title: 'Cloud Architect', type: 'Full-time', level: 'Lead', skills: ['AWS', 'Azure', 'Cloud Security', 'Architecture Design', 'Cost Optimization'], baseSalary: 95000 },
  { title: 'Mobile Developer', type: 'Full-time', level: 'Mid Level', skills: ['React Native', 'iOS', 'Android', 'Flutter', 'REST APIs'], baseSalary: 48000 },
  { title: 'Cybersecurity Analyst', type: 'Full-time', level: 'Mid Level', skills: ['Security Monitoring', 'Incident Response', 'SIEM', 'Penetration Testing', 'Risk Assessment'], baseSalary: 52000 },
  { title: 'Customer Success Manager', type: 'Full-time', level: 'Mid Level', skills: ['Customer Retention', 'Account Management', 'Onboarding', 'SaaS', 'Communication'], baseSalary: 38000 },
  { title: 'Backend Developer', type: 'Full-time', level: 'Senior', skills: ['Python', 'Django', 'PostgreSQL', 'Microservices', 'API Design'], baseSalary: 60000 },
  { title: 'Frontend Developer', type: 'Full-time', level: 'Mid Level', skills: ['React', 'TypeScript', 'CSS', 'Performance Optimization', 'Testing'], baseSalary: 45000 },
  { title: 'QA Engineer', type: 'Full-time', level: 'Mid Level', skills: ['Test Automation', 'Selenium', 'API Testing', 'Agile', 'Bug Tracking'], baseSalary: 38000 },
  { title: 'Project Manager', type: 'Full-time', level: 'Senior', skills: ['Project Planning', 'Agile/Scrum', 'Risk Management', 'Stakeholder Communication', 'PMP'], baseSalary: 55000 },
  { title: 'Technical Writer', type: 'Full-time', level: 'Mid Level', skills: ['Documentation', 'API Docs', 'Technical Communication', 'Markdown', 'Content Management'], baseSalary: 35000 },
  { title: 'Data Engineer', type: 'Full-time', level: 'Senior', skills: ['Python', 'Spark', 'Airflow', 'Data Pipelines', 'Big Data'], baseSalary: 65000 },
  { title: 'AI/ML Engineer', type: 'Full-time', level: 'Senior', skills: ['Deep Learning', 'PyTorch', 'NLP', 'Computer Vision', 'Model Deployment'], baseSalary: 80000 },
  { title: 'Graphic Designer', type: 'Full-time', level: 'Entry Level', skills: ['Adobe Creative Suite', 'Branding', 'Typography', 'Visual Design', 'Illustration'], baseSalary: 28000 },
  { title: 'Operations Manager', type: 'Full-time', level: 'Senior', skills: ['Operations', 'Process Improvement', 'Team Leadership', 'Budget Management', 'KPIs'], baseSalary: 52000 },
  { title: 'Content Strategist', type: 'Full-time', level: 'Mid Level', skills: ['Content Creation', 'SEO', 'Social Media', 'Analytics', 'Copywriting'], baseSalary: 35000 },
];

function generateUniqueJobDescription(template: typeof jobTitles[0], company: { name: string; industry: string }, city: string, countryName: string): string {
  const intros = [
    `${company.name}, a leading player in the ${company.industry} sector, is seeking a talented ${template.title} to join our dynamic team in ${city}, ${countryName}.`,
    `We're looking for an exceptional ${template.title} to help drive innovation at ${company.name}. Based in ${city}, you'll be part of our growing ${company.industry} operations.`,
    `Join ${company.name} as a ${template.title} and be part of shaping the future of ${company.industry} in ${countryName}. This role is based in our ${city} office.`,
    `${company.name} invites applications for the position of ${template.title} at our ${city} location. We're a leading ${company.industry} company committed to excellence.`,
  ];

  const responsibilities = [
    `In this role, you will collaborate with cross-functional teams to deliver high-impact solutions.`,
    `You'll work closely with stakeholders to understand requirements and implement effective strategies.`,
    `Your responsibilities include driving key initiatives and mentoring junior team members.`,
    `This position involves analyzing complex problems and developing innovative solutions.`,
  ];

  const requirements = [
    `The ideal candidate brings strong technical skills and a passion for continuous learning.`,
    `We're looking for someone with excellent communication skills and the ability to work in a fast-paced environment.`,
    `You should have a proven track record of delivering results and working effectively in teams.`,
  ];

  const benefits = [
    `We offer competitive compensation, comprehensive benefits, and opportunities for career growth.`,
    `Join a team that values innovation, collaboration, and work-life balance.`,
    `Enjoy flexible working arrangements, professional development opportunities, and a supportive team culture.`,
  ];

  return `${intros[Math.floor(Math.random() * intros.length)]}

${responsibilities[Math.floor(Math.random() * responsibilities.length)]}

${requirements[Math.floor(Math.random() * requirements.length)]}

${benefits[Math.floor(Math.random() * benefits.length)]}`;
}

function generateSlug(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') 
    + '-' + Date.now().toString(36);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting automated job publishing...');

    const { jobsPerCountry = 30 } = await req.json().catch(() => ({}));
    const countries = ['ZA', 'NG', 'KE'];
    const totalJobsCreated: Record<string, number> = {};

    for (const countryCode of countries) {
      const countryData = jobTemplates[countryCode as keyof typeof jobTemplates];
      if (!countryData) continue;

      const countryNames: Record<string, string> = { ZA: 'South Africa', NG: 'Nigeria', KE: 'Kenya' };
      const countryName = countryNames[countryCode];

      console.log(`Generating ${jobsPerCountry} jobs for ${countryName}...`);

      let jobsCreated = 0;

      for (let i = 0; i < jobsPerCountry; i++) {
        // Select random job template and company
        const template = jobTitles[Math.floor(Math.random() * jobTitles.length)];
        const company = countryData.companies[Math.floor(Math.random() * countryData.companies.length)];
        const city = countryData.cities[Math.floor(Math.random() * countryData.cities.length)];

        // Check/create company
        const companySlug = generateSlug(company.name);
        let { data: existingCompany } = await supabase
          .from('companies')
          .select('id')
          .eq('name', company.name)
          .eq('country', countryCode)
          .single();

        if (!existingCompany) {
          const { data: newCompany, error: companyError } = await supabase
            .from('companies')
            .insert({
              name: company.name,
              slug: companySlug,
              industry: company.industry,
              location: city,
              country: countryCode,
              is_active: true,
              is_verified: true,
            })
            .select('id')
            .single();

          if (companyError) {
            console.error(`Failed to create company ${company.name}:`, companyError);
            continue;
          }
          existingCompany = newCompany;
        }

        // Calculate salary with variation
        const salaryVariation = 0.8 + Math.random() * 0.4; // 80% to 120%
        const baseSalary = template.baseSalary * countryData.salaryMultiplier * salaryVariation;
        const salaryMin = Math.round(baseSalary / 1000) * 1000;
        const salaryMax = Math.round(salaryMin * (1.2 + Math.random() * 0.3) / 1000) * 1000;

        // Generate unique description
        const description = generateUniqueJobDescription(template, company, city, countryName);

        // Create job with unique posted_at to avoid duplicate content
        const postedAt = new Date();
        postedAt.setMinutes(postedAt.getMinutes() - Math.floor(Math.random() * 60 * 24)); // Random time in last 24h

        const { error: jobError } = await supabase
          .from('jobs')
          .insert({
            title: template.title,
            description: description,
            company_id: existingCompany.id,
            location: city,
            country: countryCode,
            job_type: template.type,
            experience_level: template.level,
            salary_min: salaryMin,
            salary_max: salaryMax,
            salary_currency: countryData.currency,
            salary_period: 'month',
            skills: template.skills,
            benefits: ['Health Insurance', 'Pension', 'Remote Work Options', 'Professional Development'],
            is_remote: Math.random() > 0.6,
            status: 'active',
            posted_at: postedAt.toISOString(),
          });

        if (jobError) {
          console.error(`Failed to create job:`, jobError);
          continue;
        }

        jobsCreated++;
      }

      totalJobsCreated[countryCode] = jobsCreated;
      console.log(`Created ${jobsCreated} jobs for ${countryName}`);
    }

    // Log total jobs in database after publishing
    const { count: totalJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    console.log(`Auto-publish complete. Total active jobs in database: ${totalJobs}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Jobs published successfully',
        jobsCreated: totalJobsCreated,
        totalActiveJobs: totalJobs,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in auto-publish-jobs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
