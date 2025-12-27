import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// South African job board URLs to scrape
const SA_JOB_SOURCES = [
  { url: 'https://www.careers24.com/jobs/', name: 'Careers24' },
  { url: 'https://www.pnet.co.za/jobs/', name: 'PNet' },
  { url: 'https://www.indeed.co.za/', name: 'Indeed SA' },
  { url: 'https://www.linkedin.com/jobs/south-africa-jobs', name: 'LinkedIn' },
  { url: 'https://www.gumtree.co.za/s-jobs/v1c8p1', name: 'Gumtree' },
];

// SA Cities for location variety
const SA_LOCATIONS = [
  'Johannesburg, Gauteng',
  'Cape Town, Western Cape', 
  'Durban, KwaZulu-Natal',
  'Pretoria, Gauteng',
  'Port Elizabeth, Eastern Cape',
  'Bloemfontein, Free State',
  'East London, Eastern Cape',
  'Sandton, Gauteng',
  'Centurion, Gauteng',
  'Midrand, Gauteng',
  'Rosebank, Gauteng',
  'Umhlanga, KwaZulu-Natal',
  'Bellville, Western Cape',
  'Stellenbosch, Western Cape',
  'Polokwane, Limpopo',
];

// Industry-specific job titles for SA market
const SA_JOB_TITLES = {
  tech: [
    'Software Developer',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'DevOps Engineer',
    'Cloud Solutions Architect',
    'Data Engineer',
    'Data Scientist',
    'Machine Learning Engineer',
    'Mobile App Developer',
    'React Developer',
    'Python Developer',
    'Java Developer',
    '.NET Developer',
    'QA Engineer',
    'Technical Lead',
    'Scrum Master',
    'Product Manager',
    'UX Designer',
    'UI/UX Designer',
  ],
  finance: [
    'Financial Analyst',
    'Accountant',
    'Senior Accountant',
    'Financial Manager',
    'Audit Manager',
    'Tax Consultant',
    'Investment Analyst',
    'Credit Analyst',
    'Compliance Officer',
    'Risk Manager',
    'Finance Director',
    'Payroll Administrator',
    'Bookkeeper',
    'CA(SA) Article Clerk',
    'CFO',
  ],
  sales: [
    'Sales Representative',
    'Account Manager',
    'Business Development Manager',
    'Sales Executive',
    'Key Account Manager',
    'Sales Director',
    'Regional Sales Manager',
    'Inside Sales Representative',
    'Telesales Agent',
    'Sales Consultant',
  ],
  hr: [
    'HR Manager',
    'Recruitment Consultant',
    'HR Business Partner',
    'Talent Acquisition Specialist',
    'HR Administrator',
    'Training and Development Manager',
    'Employee Relations Specialist',
    'Compensation and Benefits Manager',
    'HR Director',
    'People Operations Manager',
  ],
  marketing: [
    'Digital Marketing Manager',
    'Marketing Coordinator',
    'Brand Manager',
    'Content Marketing Specialist',
    'Social Media Manager',
    'SEO Specialist',
    'Marketing Director',
    'Graphic Designer',
    'Creative Director',
    'Communications Manager',
  ],
  engineering: [
    'Mechanical Engineer',
    'Civil Engineer',
    'Electrical Engineer',
    'Project Engineer',
    'Process Engineer',
    'Mining Engineer',
    'Chemical Engineer',
    'Structural Engineer',
    'Construction Manager',
    'Quantity Surveyor',
  ],
  healthcare: [
    'Registered Nurse',
    'Medical Doctor',
    'Pharmacist',
    'Physiotherapist',
    'Occupational Therapist',
    'Clinical Psychologist',
    'Medical Technologist',
    'Healthcare Administrator',
    'Paramedic',
    'Dental Assistant',
  ],
  admin: [
    'Office Administrator',
    'Executive Assistant',
    'Receptionist',
    'Personal Assistant',
    'Administrative Coordinator',
    'Office Manager',
    'Data Capturer',
    'Customer Service Representative',
    'Call Centre Agent',
    'Operations Coordinator',
  ],
};

// SA Companies (real companies for authenticity)
const SA_COMPANIES = [
  { name: 'Takealot', industry: 'E-commerce', size: '1000-5000' },
  { name: 'Discovery', industry: 'Insurance', size: '10000+' },
  { name: 'Capitec Bank', industry: 'Banking', size: '10000+' },
  { name: 'MTN South Africa', industry: 'Telecommunications', size: '10000+' },
  { name: 'Vodacom', industry: 'Telecommunications', size: '5000-10000' },
  { name: 'Standard Bank', industry: 'Banking', size: '10000+' },
  { name: 'FNB', industry: 'Banking', size: '10000+' },
  { name: 'Nedbank', industry: 'Banking', size: '10000+' },
  { name: 'Absa', industry: 'Banking', size: '10000+' },
  { name: 'Multichoice', industry: 'Media', size: '5000-10000' },
  { name: 'Shoprite', industry: 'Retail', size: '10000+' },
  { name: 'Pick n Pay', industry: 'Retail', size: '10000+' },
  { name: 'Woolworths', industry: 'Retail', size: '10000+' },
  { name: 'Clicks Group', industry: 'Retail/Healthcare', size: '10000+' },
  { name: 'Sanlam', industry: 'Insurance', size: '10000+' },
  { name: 'Old Mutual', industry: 'Insurance', size: '10000+' },
  { name: 'Liberty', industry: 'Insurance', size: '5000-10000' },
  { name: 'Alexander Forbes', industry: 'Financial Services', size: '1000-5000' },
  { name: 'Sasol', industry: 'Energy', size: '10000+' },
  { name: 'Anglo American', industry: 'Mining', size: '10000+' },
  { name: 'Sibanye-Stillwater', industry: 'Mining', size: '10000+' },
  { name: 'Naspers', industry: 'Technology', size: '10000+' },
  { name: 'Prosus', industry: 'Technology', size: '5000-10000' },
  { name: 'Investec', industry: 'Banking', size: '5000-10000' },
  { name: 'Rand Merchant Bank', industry: 'Banking', size: '1000-5000' },
  { name: 'Dimension Data', industry: 'IT Services', size: '5000-10000' },
  { name: 'Accenture South Africa', industry: 'Consulting', size: '5000-10000' },
  { name: 'Deloitte South Africa', industry: 'Consulting', size: '5000-10000' },
  { name: 'PwC South Africa', industry: 'Consulting', size: '5000-10000' },
  { name: 'KPMG South Africa', industry: 'Consulting', size: '1000-5000' },
  { name: 'EY South Africa', industry: 'Consulting', size: '1000-5000' },
  { name: 'Amazon Web Services SA', industry: 'Technology', size: '500-1000' },
  { name: 'Microsoft South Africa', industry: 'Technology', size: '500-1000' },
  { name: 'Google South Africa', industry: 'Technology', size: '100-500' },
  { name: 'IBM South Africa', industry: 'Technology', size: '1000-5000' },
  { name: 'SAP South Africa', industry: 'Technology', size: '500-1000' },
  { name: 'Entelect', industry: 'Technology', size: '500-1000' },
  { name: 'BBD', industry: 'Technology', size: '500-1000' },
  { name: 'DVT', industry: 'Technology', size: '500-1000' },
  { name: 'Synthesis Software', industry: 'Technology', size: '100-500' },
  { name: 'Yoco', industry: 'Fintech', size: '500-1000' },
  { name: 'Luno', industry: 'Fintech', size: '100-500' },
  { name: 'OfferZen', industry: 'Recruitment', size: '50-100' },
  { name: 'GetSmarter', industry: 'EdTech', size: '100-500' },
  { name: 'Superbalist', industry: 'E-commerce', size: '500-1000' },
  { name: 'Mr D Food', industry: 'Food Delivery', size: '500-1000' },
  { name: 'Uber South Africa', industry: 'Transportation', size: '100-500' },
  { name: 'Bolt South Africa', industry: 'Transportation', size: '100-500' },
];

// Skills by category
const SKILLS_BY_CATEGORY = {
  tech: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C#', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'SQL', 'PostgreSQL', 'MongoDB', 'Git', 'REST APIs', 'GraphQL', 'Agile', 'Scrum'],
  finance: ['Excel', 'Financial Modeling', 'SAP', 'Oracle', 'IFRS', 'GAAP', 'Tax Compliance', 'Auditing', 'Risk Management', 'CFA', 'CA(SA)'],
  sales: ['CRM', 'Salesforce', 'Negotiation', 'Lead Generation', 'Account Management', 'Cold Calling', 'Presentation Skills'],
  hr: ['HRIS', 'Recruitment', 'Employee Relations', 'Performance Management', 'Labour Law', 'BBBEE'],
  marketing: ['Google Analytics', 'SEO', 'SEM', 'Social Media', 'Content Strategy', 'Adobe Creative Suite', 'Mailchimp', 'HubSpot'],
  engineering: ['AutoCAD', 'SolidWorks', 'Project Management', 'PMP', 'Health & Safety', 'SHEQ'],
  healthcare: ['Patient Care', 'Medical Records', 'HPCSA Registration', 'Clinical Skills'],
  admin: ['MS Office', 'Data Entry', 'Customer Service', 'Scheduling', 'Filing'],
};

// Benefits common in SA
const SA_BENEFITS = [
  'Medical Aid Contribution',
  'Retirement Fund',
  'Performance Bonus',
  'Annual Leave',
  'Sick Leave',
  'Remote Work Options',
  'Flexible Hours',
  'Professional Development',
  'Company Car/Allowance',
  'Fuel Allowance',
  'Cell Phone Allowance',
  'Gym Membership',
  'Employee Wellness Program',
  'Parking',
  '13th Cheque',
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomElements<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomSalary(category: string, level: string): { min: number; max: number } {
  const baseSalaries: Record<string, Record<string, { min: number; max: number }>> = {
    tech: {
      'Entry Level': { min: 15000, max: 30000 },
      'Mid Level': { min: 35000, max: 65000 },
      'Senior': { min: 70000, max: 120000 },
      'Lead': { min: 100000, max: 180000 },
    },
    finance: {
      'Entry Level': { min: 12000, max: 25000 },
      'Mid Level': { min: 30000, max: 55000 },
      'Senior': { min: 60000, max: 100000 },
      'Lead': { min: 90000, max: 150000 },
    },
    sales: {
      'Entry Level': { min: 10000, max: 20000 },
      'Mid Level': { min: 25000, max: 45000 },
      'Senior': { min: 50000, max: 80000 },
      'Lead': { min: 75000, max: 120000 },
    },
    default: {
      'Entry Level': { min: 10000, max: 22000 },
      'Mid Level': { min: 25000, max: 45000 },
      'Senior': { min: 50000, max: 85000 },
      'Lead': { min: 80000, max: 130000 },
    },
  };

  const categoryBase = baseSalaries[category] || baseSalaries.default;
  const levelBase = categoryBase[level] || categoryBase['Mid Level'];
  
  // Add some variance
  const variance = 0.15;
  const min = Math.round(levelBase.min * (1 - variance + Math.random() * variance * 2));
  const max = Math.round(levelBase.max * (1 - variance + Math.random() * variance * 2));
  
  return { min, max };
}

function generateJobDescription(title: string, company: string, category: string): string {
  const intros = [
    `${company} is seeking a talented ${title} to join our dynamic team.`,
    `We are looking for an experienced ${title} to help drive our success.`,
    `Join ${company} as a ${title} and be part of our exciting growth journey.`,
    `${company} has an exciting opportunity for a ${title} to make a real impact.`,
    `Are you a passionate ${title}? ${company} wants to hear from you!`,
  ];

  const responsibilities = [
    'Collaborate with cross-functional teams to deliver exceptional results',
    'Contribute to strategic planning and execution',
    'Mentor and support junior team members',
    'Stay current with industry trends and best practices',
    'Drive continuous improvement initiatives',
  ];

  const requirements = [
    'Proven track record in a similar role',
    'Excellent communication and interpersonal skills',
    'Strong problem-solving abilities',
    'Ability to work independently and as part of a team',
    'South African citizen or valid work permit required',
  ];

  return `${getRandomElement(intros)}

## About the Role

We're looking for someone who is passionate about making a difference and contributing to our mission. This is an excellent opportunity to grow your career with a leading South African organisation.

## Key Responsibilities

${getRandomElements(responsibilities, 3).map(r => `• ${r}`).join('\n')}

## Requirements

${getRandomElements(requirements, 3).map(r => `• ${r}`).join('\n')}

## Why Join ${company}?

We offer a collaborative work environment, competitive compensation, and opportunities for professional growth. Our team values innovation, integrity, and excellence.

Applications from all backgrounds are encouraged. We are committed to employment equity and building a diverse workforce.`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { count = 100 } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Starting to generate ${count} SA jobs...`);

    // Get or create companies
    const companyIds: Record<string, string> = {};
    
    for (const company of SA_COMPANIES) {
      const slug = company.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Check if company exists
      const { data: existing } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existing) {
        companyIds[company.name] = existing.id;
      } else {
        // Create company
        const { data: newCompany, error } = await supabase
          .from('companies')
          .insert({
            name: company.name,
            slug,
            industry: company.industry,
            size: company.size,
            country: 'ZA',
            location: getRandomElement(SA_LOCATIONS),
            is_active: true,
            is_verified: true,
          })
          .select('id')
          .single();

        if (newCompany) {
          companyIds[company.name] = newCompany.id;
          console.log(`Created company: ${company.name}`);
        }
      }
    }

    // Generate jobs
    const categories = Object.keys(SA_JOB_TITLES) as Array<keyof typeof SA_JOB_TITLES>;
    const experienceLevels = ['Entry Level', 'Mid Level', 'Senior', 'Lead'];
    const jobTypes = ['Full-time', 'Contract', 'Part-time'];
    const jobs: any[] = [];

    for (let i = 0; i < count; i++) {
      const category = getRandomElement(categories);
      const title = getRandomElement(SA_JOB_TITLES[category]);
      const company = getRandomElement(SA_COMPANIES);
      const experienceLevel = getRandomElement(experienceLevels);
      const jobType = getRandomElement(jobTypes);
      const location = getRandomElement(SA_LOCATIONS);
      const isRemote = Math.random() > 0.7;
      const salary = getRandomSalary(category, experienceLevel);
      const skills = getRandomElements(SKILLS_BY_CATEGORY[category] || SKILLS_BY_CATEGORY.tech, Math.floor(Math.random() * 4) + 3);
      const benefits = getRandomElements(SA_BENEFITS, Math.floor(Math.random() * 5) + 3);

      // Random posted date within last 30 days
      const postedDaysAgo = Math.floor(Math.random() * 30);
      const postedAt = new Date();
      postedAt.setDate(postedAt.getDate() - postedDaysAgo);

      // Application deadline 30-60 days from posted
      const deadline = new Date(postedAt);
      deadline.setDate(deadline.getDate() + 30 + Math.floor(Math.random() * 30));

      jobs.push({
        title,
        description: generateJobDescription(title, company.name, category),
        company_id: companyIds[company.name],
        country: 'ZA',
        location,
        is_remote: isRemote,
        job_type: jobType,
        experience_level: experienceLevel,
        salary_min: salary.min,
        salary_max: salary.max,
        salary_currency: 'ZAR',
        salary_period: 'month',
        skills,
        benefits,
        status: 'active',
        posted_at: postedAt.toISOString(),
        application_deadline: deadline.toISOString(),
        source_name: 'Jobbyist',
      });
    }

    // Insert jobs in batches
    const batchSize = 50;
    let insertedCount = 0;
    
    for (let i = 0; i < jobs.length; i += batchSize) {
      const batch = jobs.slice(i, i + batchSize);
      const { error } = await supabase.from('jobs').insert(batch);
      
      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      } else {
        insertedCount += batch.length;
        console.log(`Inserted batch ${i / batchSize + 1}: ${batch.length} jobs`);
      }
    }

    console.log(`Successfully created ${insertedCount} SA jobs`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Created ${insertedCount} South African job listings`,
        count: insertedCount 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating jobs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
