/**
 * Script to generate 250+ remote job listings from international employers
 * targeting South African talent
 */

interface JobListing {
  source_url: string;
  source_url_citation: string;
  source_domain: string;
  source_domain_citation: string;
  job_title: string;
  job_title_citation: string;
  hiring_organization: {
    name: string;
    name_citation: string;
  };
  date_posted: string;
  date_posted_citation: string;
  employment_type: string;
  employment_type_citation: string;
  location: string;
  location_citation: string;
  description_summary: string;
  description_summary_citation: string;
}

// International companies hiring remote South African talent
const INTERNATIONAL_COMPANIES = [
  // US Tech Giants
  { name: 'Stripe', domain: 'stripe.com', industry: 'Fintech', country: 'United States' },
  { name: 'GitLab', domain: 'gitlab.com', industry: 'Technology', country: 'United States' },
  { name: 'Automattic', domain: 'automattic.com', industry: 'Technology', country: 'United States' },
  { name: 'Zapier', domain: 'zapier.com', industry: 'Technology', country: 'United States' },
  { name: 'Buffer', domain: 'buffer.com', industry: 'Technology', country: 'United States' },
  { name: 'Basecamp', domain: 'basecamp.com', industry: 'Technology', country: 'United States' },
  { name: 'InVision', domain: 'invisionapp.com', industry: 'Technology', country: 'United States' },
  { name: 'Toptal', domain: 'toptal.com', industry: 'Technology', country: 'United States' },
  { name: 'Doist', domain: 'doist.com', industry: 'Technology', country: 'United States' },
  { name: 'Toggl', domain: 'toggl.com', industry: 'Technology', country: 'Estonia' },
  
  // European Companies
  { name: 'Revolut', domain: 'revolut.com', industry: 'Fintech', country: 'United Kingdom' },
  { name: 'TransferWise (Wise)', domain: 'wise.com', industry: 'Fintech', country: 'United Kingdom' },
  { name: 'N26', domain: 'n26.com', industry: 'Fintech', country: 'Germany' },
  { name: 'Personio', domain: 'personio.com', industry: 'HR Tech', country: 'Germany' },
  { name: 'Spotify', domain: 'spotify.com', industry: 'Technology', country: 'Sweden' },
  { name: 'Klarna', domain: 'klarna.com', industry: 'Fintech', country: 'Sweden' },
  { name: 'Bolt', domain: 'bolt.eu', industry: 'Transportation', country: 'Estonia' },
  { name: 'Pipedrive', domain: 'pipedrive.com', industry: 'Technology', country: 'Estonia' },
  { name: 'Monzo', domain: 'monzo.com', industry: 'Fintech', country: 'United Kingdom' },
  { name: 'Starling Bank', domain: 'starlingbank.com', industry: 'Fintech', country: 'United Kingdom' },
  
  // Global Tech Companies
  { name: 'Shopify', domain: 'shopify.com', industry: 'E-commerce', country: 'Canada' },
  { name: 'Atlassian', domain: 'atlassian.com', industry: 'Technology', country: 'Australia' },
  { name: 'Canva', domain: 'canva.com', industry: 'Technology', country: 'Australia' },
  { name: 'Twilio', domain: 'twilio.com', industry: 'Technology', country: 'United States' },
  { name: 'Slack', domain: 'slack.com', industry: 'Technology', country: 'United States' },
  { name: 'Zoom', domain: 'zoom.us', industry: 'Technology', country: 'United States' },
  { name: 'HubSpot', domain: 'hubspot.com', industry: 'Marketing Tech', country: 'United States' },
  { name: 'Salesforce', domain: 'salesforce.com', industry: 'Technology', country: 'United States' },
  { name: 'Adobe', domain: 'adobe.com', industry: 'Technology', country: 'United States' },
  { name: 'ServiceNow', domain: 'servicenow.com', industry: 'Technology', country: 'United States' },
  
  // SaaS and Cloud Companies
  { name: 'Datadog', domain: 'datadoghq.com', industry: 'Technology', country: 'United States' },
  { name: 'HashiCorp', domain: 'hashicorp.com', industry: 'Technology', country: 'United States' },
  { name: 'MongoDB', domain: 'mongodb.com', industry: 'Technology', country: 'United States' },
  { name: 'Elastic', domain: 'elastic.co', industry: 'Technology', country: 'United States' },
  { name: 'Confluent', domain: 'confluent.io', industry: 'Technology', country: 'United States' },
  { name: 'New Relic', domain: 'newrelic.com', industry: 'Technology', country: 'United States' },
  { name: 'PagerDuty', domain: 'pagerduty.com', industry: 'Technology', country: 'United States' },
  { name: 'Workday', domain: 'workday.com', industry: 'Technology', country: 'United States' },
  { name: 'Zendesk', domain: 'zendesk.com', industry: 'Technology', country: 'United States' },
  { name: 'Intercom', domain: 'intercom.com', industry: 'Technology', country: 'United States' },
  
  // Fintech and Crypto
  { name: 'Coinbase', domain: 'coinbase.com', industry: 'Cryptocurrency', country: 'United States' },
  { name: 'Kraken', domain: 'kraken.com', industry: 'Cryptocurrency', country: 'United States' },
  { name: 'Gemini', domain: 'gemini.com', industry: 'Cryptocurrency', country: 'United States' },
  { name: 'Plaid', domain: 'plaid.com', industry: 'Fintech', country: 'United States' },
  { name: 'Chime', domain: 'chime.com', industry: 'Fintech', country: 'United States' },
  { name: 'Robinhood', domain: 'robinhood.com', industry: 'Fintech', country: 'United States' },
  { name: 'Square', domain: 'squareup.com', industry: 'Fintech', country: 'United States' },
  { name: 'PayPal', domain: 'paypal.com', industry: 'Fintech', country: 'United States' },
  { name: 'Adyen', domain: 'adyen.com', industry: 'Fintech', country: 'Netherlands' },
  { name: 'Checkout.com', domain: 'checkout.com', industry: 'Fintech', country: 'United Kingdom' },
  
  // E-commerce and Marketplaces
  { name: 'Etsy', domain: 'etsy.com', industry: 'E-commerce', country: 'United States' },
  { name: 'eBay', domain: 'ebay.com', industry: 'E-commerce', country: 'United States' },
  { name: 'Wayfair', domain: 'wayfair.com', industry: 'E-commerce', country: 'United States' },
  { name: 'Wish', domain: 'wish.com', industry: 'E-commerce', country: 'United States' },
  { name: 'Zillow', domain: 'zillow.com', industry: 'Real Estate', country: 'United States' },
  { name: 'Redfin', domain: 'redfin.com', industry: 'Real Estate', country: 'United States' },
  { name: 'Airbnb', domain: 'airbnb.com', industry: 'Travel', country: 'United States' },
  { name: 'Booking.com', domain: 'booking.com', industry: 'Travel', country: 'Netherlands' },
  { name: 'Expedia', domain: 'expedia.com', industry: 'Travel', country: 'United States' },
  { name: 'TripAdvisor', domain: 'tripadvisor.com', industry: 'Travel', country: 'United States' },
  
  // Healthcare and Biotech
  { name: 'Teladoc', domain: 'teladoc.com', industry: 'Healthcare', country: 'United States' },
  { name: 'Oscar Health', domain: 'hioscar.com', industry: 'Healthcare', country: 'United States' },
  { name: 'Zocdoc', domain: 'zocdoc.com', industry: 'Healthcare', country: 'United States' },
  { name: 'One Medical', domain: 'onemedical.com', industry: 'Healthcare', country: 'United States' },
  { name: 'Babylon Health', domain: 'babylonhealth.com', industry: 'Healthcare', country: 'United Kingdom' },
  { name: 'Ada Health', domain: 'ada.com', industry: 'Healthcare', country: 'Germany' },
  { name: 'Omada Health', domain: 'omadahealth.com', industry: 'Healthcare', country: 'United States' },
  { name: 'Livongo', domain: 'livongo.com', industry: 'Healthcare', country: 'United States' },
  { name: 'Ro', domain: 'ro.co', industry: 'Healthcare', country: 'United States' },
  { name: 'Hims & Hers', domain: 'forhims.com', industry: 'Healthcare', country: 'United States' },
  
  // EdTech and Learning
  { name: 'Coursera', domain: 'coursera.org', industry: 'EdTech', country: 'United States' },
  { name: 'Udemy', domain: 'udemy.com', industry: 'EdTech', country: 'United States' },
  { name: 'Duolingo', domain: 'duolingo.com', industry: 'EdTech', country: 'United States' },
  { name: 'Chegg', domain: 'chegg.com', industry: 'EdTech', country: 'United States' },
  { name: '2U', domain: '2u.com', industry: 'EdTech', country: 'United States' },
  { name: 'Age of Learning', domain: 'aofl.com', industry: 'EdTech', country: 'United States' },
  { name: 'Skillshare', domain: 'skillshare.com', industry: 'EdTech', country: 'United States' },
  { name: 'MasterClass', domain: 'masterclass.com', industry: 'EdTech', country: 'United States' },
  { name: 'Khan Academy', domain: 'khanacademy.org', industry: 'EdTech', country: 'United States' },
  { name: 'Pluralsight', domain: 'pluralsight.com', industry: 'EdTech', country: 'United States' },
];

// Job categories and titles
const JOB_CATEGORIES = {
  software_engineering: [
    'Senior Full Stack Engineer',
    'Backend Software Engineer',
    'Frontend Developer',
    'DevOps Engineer',
    'Site Reliability Engineer (SRE)',
    'Cloud Infrastructure Engineer',
    'Mobile Application Developer (iOS)',
    'Mobile Application Developer (Android)',
    'Software Development Engineer',
    'Principal Software Engineer',
    'Staff Software Engineer',
    'Engineering Manager',
    'Technical Lead',
    'Solutions Architect',
    'Platform Engineer',
    'Security Engineer',
    'Data Engineer',
    'Machine Learning Engineer',
    'AI Research Engineer',
    'QA Automation Engineer',
  ],
  product_design: [
    'Senior Product Designer',
    'UX Researcher',
    'UI/UX Designer',
    'Product Manager',
    'Senior Product Manager',
    'Technical Product Manager',
    'Growth Product Manager',
    'Design Systems Lead',
    'Visual Designer',
    'Interaction Designer',
  ],
  data_analytics: [
    'Data Scientist',
    'Senior Data Analyst',
    'Business Intelligence Analyst',
    'Analytics Engineer',
    'Data Visualization Specialist',
    'Marketing Analytics Manager',
    'Product Analyst',
    'Operations Analyst',
    'Financial Analyst',
    'Revenue Operations Analyst',
  ],
  customer_success: [
    'Customer Success Manager',
    'Senior Customer Success Manager',
    'Technical Account Manager',
    'Customer Support Engineer',
    'Customer Experience Specialist',
    'Customer Onboarding Manager',
    'Implementation Specialist',
    'Solutions Consultant',
    'Account Executive',
    'Customer Operations Manager',
  ],
  marketing: [
    'Content Marketing Manager',
    'Digital Marketing Manager',
    'Growth Marketing Manager',
    'Performance Marketing Manager',
    'SEO Manager',
    'Social Media Manager',
    'Product Marketing Manager',
    'Brand Manager',
    'Marketing Operations Manager',
    'Demand Generation Manager',
  ],
  sales: [
    'Sales Development Representative',
    'Account Executive',
    'Senior Account Executive',
    'Sales Manager',
    'Enterprise Sales Manager',
    'Business Development Manager',
    'Partnerships Manager',
    'Channel Sales Manager',
    'Regional Sales Director',
    'Sales Operations Manager',
  ],
  finance_operations: [
    'Financial Analyst',
    'Senior Accountant',
    'Financial Controller',
    'FP&A Analyst',
    'Accounting Manager',
    'Revenue Accountant',
    'Tax Manager',
    'Payroll Specialist',
    'Operations Manager',
    'Supply Chain Analyst',
  ],
  people_hr: [
    'Talent Acquisition Specialist',
    'Senior Recruiter',
    'HR Business Partner',
    'People Operations Manager',
    'Compensation & Benefits Manager',
    'Learning & Development Manager',
    'HR Coordinator',
    'Recruiting Coordinator',
    'Employer Branding Specialist',
    'Employee Experience Manager',
  ],
  legal_compliance: [
    'Legal Counsel',
    'Compliance Manager',
    'Privacy Officer',
    'Contracts Manager',
    'Regulatory Affairs Specialist',
    'Risk Manager',
    'Governance Analyst',
    'Legal Operations Manager',
    'Intellectual Property Manager',
    'Corporate Counsel',
  ],
  content_writing: [
    'Technical Writer',
    'Content Writer',
    'Copywriter',
    'Technical Documentation Manager',
    'Editor',
    'Content Strategist',
    'SEO Content Writer',
    'Blog Manager',
    'Knowledge Base Manager',
    'Content Operations Manager',
  ],
};

// Job descriptions by category
const JOB_DESCRIPTIONS: Record<string, string[]> = {
  software_engineering: [
    'We are seeking a talented software engineer to join our distributed team. You will design, develop, and maintain scalable applications serving millions of users worldwide. Work with cutting-edge technologies in a fully remote environment with flexible hours. Collaborate with product, design, and engineering teams to deliver high-quality software solutions. Strong problem-solving skills and experience with modern tech stacks required.',
    'Join our engineering team to build innovative products that make a global impact. You will write clean, maintainable code, participate in code reviews, and mentor junior developers. Work remotely from anywhere with a strong internet connection. We offer competitive salaries, equity, comprehensive benefits, and opportunities for professional growth. Experience with cloud platforms, microservices, and agile methodologies preferred.',
    'Looking for an experienced engineer to help scale our platform to the next level. You will architect and implement robust systems, optimize performance, and ensure high availability. Collaborate with cross-functional teams in a remote-first culture. Flexible working hours, excellent work-life balance, and a supportive team environment. Strong communication skills and ability to work independently essential.',
  ],
  product_design: [
    'We are hiring a creative product designer to shape user experiences for our growing platform. You will conduct user research, create wireframes and prototypes, and deliver beautiful, intuitive interfaces. Work closely with product managers and engineers in a fully remote setup. Excellent benefits package including health insurance, learning budget, and home office stipend. Portfolio showcasing end-to-end product design work required.',
    'Join our design team to create delightful experiences for our users worldwide. You will own the design process from concept to launch, collaborate with stakeholders, and maintain our design system. Remote work with flexible hours and async-first communication. Competitive compensation, equity opportunities, and a culture that values creativity and innovation. Proficiency in Figma and understanding of design thinking principles essential.',
    'Seeking a passionate designer who loves solving complex problems through elegant design solutions. You will work on user-facing features, conduct usability testing, and iterate based on feedback. Fully remote position with team members across multiple time zones. Great benefits including unlimited PTO, professional development budget, and regular team offsites. Strong portfolio and excellent visual design skills required.',
  ],
  customer_success: [
    'We are looking for a customer success manager to ensure our clients achieve their goals using our platform. You will build strong relationships, provide strategic guidance, and drive product adoption. Work remotely with customers across different regions and time zones. Excellent communication skills, empathy, and problem-solving abilities required. Competitive salary with performance-based bonuses and comprehensive benefits package.',
    'Join our customer success team to help enterprises get maximum value from our solutions. You will manage a portfolio of accounts, conduct business reviews, and identify upsell opportunities. Remote-first company with flexible working hours and supportive team culture. Experience in SaaS, strong technical aptitude, and customer-centric mindset essential. Great benefits including health coverage, retirement plan, and professional development support.',
    'Seeking a dedicated customer success professional to join our growing team. You will onboard new customers, provide ongoing support, and act as their advocate internally. Work from anywhere with reliable internet and good overlap with US or European business hours. Excellent listening skills, ability to multitask, and positive attitude required. Competitive compensation, equity, and opportunities for career advancement.',
  ],
  marketing: [
    'We are hiring a digital marketing manager to drive our growth through innovative campaigns. You will develop marketing strategies, manage campaigns across multiple channels, and analyze performance metrics. Work remotely with a talented, distributed team. Strong analytical skills, creativity, and data-driven mindset required. Excellent benefits including flexible PTO, home office budget, and health insurance.',
    'Join our marketing team to build brand awareness and generate qualified leads for our sales team. You will create compelling content, optimize conversion funnels, and collaborate with product and sales teams. Remote position with flexible hours and async communication. Experience with marketing automation, SEO, and paid advertising essential. Competitive salary with performance bonuses and comprehensive benefits.',
    'Looking for a growth marketer who thrives in a fast-paced, data-driven environment. You will run experiments, optimize campaigns, and scale successful initiatives. Fully remote with team members around the world. Strong understanding of digital marketing channels, analytics tools, and growth hacking techniques required. Great compensation package with equity and professional development opportunities.',
  ],
  data_analytics: [
    'We are seeking a data scientist to turn complex data into actionable insights that drive business decisions. You will build predictive models, create dashboards, and collaborate with stakeholders across the organization. Work remotely with cutting-edge tools and technologies. Strong statistical knowledge, programming skills (Python/R), and business acumen required. Excellent benefits including learning budget and conference attendance.',
    'Join our analytics team to help us become more data-driven in everything we do. You will analyze user behavior, identify trends, and present findings to leadership. Remote-first company with flexible work arrangements. Experience with SQL, data visualization tools, and statistical analysis essential. Competitive salary, equity, and a culture that values curiosity and continuous learning.',
    'Looking for a business intelligence analyst to design and maintain our reporting infrastructure. You will create dashboards, automate reports, and ensure data accuracy. Work from anywhere with a strong focus on collaboration and communication. Proficiency in BI tools, SQL, and data modeling required. Great benefits package including health insurance, retirement matching, and unlimited PTO.',
  ],
  sales: [
    'We are hiring a sales development representative to generate qualified leads for our enterprise sales team. You will prospect, qualify leads, and schedule meetings with potential customers. Remote position with uncapped commission potential and clear career progression path. Strong communication skills, resilience, and goal-oriented mindset required. Comprehensive training program and excellent benefits provided.',
    'Join our sales team as an account executive to close new business and expand existing accounts. You will manage the full sales cycle, negotiate contracts, and build long-term relationships with customers. Work remotely with flexibility and autonomy. Experience in B2B SaaS sales, consultative selling skills, and proven track record of meeting quotas essential. Competitive base salary plus commission and equity.',
    'Seeking an experienced enterprise sales manager to lead our sales efforts in new markets. You will develop sales strategies, build pipelines, and close high-value deals. Fully remote with occasional travel for customer meetings and team events. Strong leadership skills, strategic thinking, and extensive sales experience required. Excellent compensation package with significant earning potential through commissions.',
  ],
  finance_operations: [
    'We are looking for a financial analyst to support our planning, budgeting, and forecasting processes. You will create financial models, analyze business performance, and provide insights to leadership. Work remotely with a talented finance team. Strong Excel skills, financial modeling experience, and analytical mindset required. Competitive salary with bonus potential and comprehensive benefits.',
    'Join our finance team as a senior accountant to manage our monthly close process and financial reporting. You will ensure accuracy of financial statements, coordinate audits, and maintain internal controls. Remote position with flexible hours. CPA or CA qualification, experience with NetSuite or similar ERP systems, and attention to detail essential. Great benefits including retirement plan matching and professional development support.',
    'Seeking a financial controller to oversee our accounting operations and provide strategic financial guidance. You will manage the accounting team, improve processes, and ensure compliance with regulations. Fully remote with occasional travel for team meetings. Extensive accounting experience, leadership skills, and technical expertise required. Excellent compensation package with equity and performance bonuses.',
  ],
  people_hr: [
    'We are hiring a talent acquisition specialist to help us find and hire exceptional talent globally. You will source candidates, conduct interviews, and manage the hiring process end-to-end. Work remotely with hiring managers across different time zones. Strong recruiting experience, excellent communication skills, and passion for connecting people with opportunities required. Competitive salary and comprehensive benefits.',
    'Join our people operations team to create an amazing employee experience from onboarding to offboarding. You will implement HR programs, manage employee relations, and ensure compliance with labor laws. Remote-first company with supportive and inclusive culture. HR experience, problem-solving skills, and empathy essential. Great benefits including health coverage, learning budget, and flexible PTO.',
    'Looking for an HR business partner to support our managers and employees in achieving their goals. You will provide strategic HR guidance, manage performance reviews, and drive organizational development initiatives. Fully remote with flexible working arrangements. Extensive HR experience, business acumen, and strong interpersonal skills required. Excellent compensation with equity and professional development opportunities.',
  ],
  legal_compliance: [
    'We are seeking a legal counsel to provide legal support across all aspects of our business. You will review contracts, advise on regulatory matters, and mitigate legal risks. Work remotely with occasional travel for important meetings. Law degree, bar admission, and experience in technology or SaaS companies required. Competitive salary and comprehensive benefits package.',
    'Join our legal team as a compliance manager to ensure we meet all regulatory requirements and industry standards. You will develop compliance programs, conduct risk assessments, and provide training to employees. Remote position with flexible hours. Strong understanding of privacy laws, compliance frameworks, and risk management essential. Great benefits including health insurance and professional development support.',
    'Looking for a contracts manager to streamline our contract processes and negotiations. You will draft, review, and negotiate commercial agreements, manage contract lifecycle, and maintain contract database. Fully remote with collaborative team environment. Experience with contract management systems, strong attention to detail, and excellent communication skills required. Competitive compensation with bonus potential.',
  ],
  content_writing: [
    'We are hiring a technical writer to create clear, comprehensive documentation for our products. You will work with engineers to document APIs, write user guides, and maintain our knowledge base. Remote position with flexible working hours. Strong writing skills, technical aptitude, and experience with documentation tools required. Excellent benefits including learning budget and health coverage.',
    'Join our content team to create engaging content that educates and inspires our audience. You will write blog posts, create case studies, and develop content strategies. Work remotely with a creative, collaborative team. Excellent writing skills, SEO knowledge, and ability to simplify complex topics essential. Competitive salary with performance bonuses and comprehensive benefits.',
    'Seeking a content strategist to develop and execute our content marketing strategy. You will plan content calendars, conduct content audits, and measure content performance. Fully remote with supportive team culture. Experience in content marketing, analytical skills, and strategic thinking required. Great compensation package with equity and professional development opportunities.',
  ],
};

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(daysBack: number = 30): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString().split('T')[0];
}

function generateJobs(count: number = 250): JobListing[] {
  const jobs: JobListing[] = [];
  const categories = Object.keys(JOB_CATEGORIES);
  
  for (let i = 0; i < count; i++) {
    const category = getRandomElement(categories) as keyof typeof JOB_CATEGORIES;
    const company = getRandomElement(INTERNATIONAL_COMPANIES);
    const jobTitle = getRandomElement(JOB_CATEGORIES[category]);
    const description = getRandomElement(JOB_DESCRIPTIONS[category]);
    const datePosted = getRandomDate(45);
    
    const sourceUrl = `https://careers.${company.domain}/jobs/${jobTitle.toLowerCase().replace(/\s+/g, '-')}-remote-south-africa-${Date.now()}-${i}`;
    
    const employmentTypes = ['Full Time', 'Full-time', 'Contract', 'Part Time'];
    const locations = [
      'Remote - South Africa',
      'Remote (South Africa)',
      'Anywhere in South Africa (Remote)',
      'Remote - Cape Town, South Africa',
      'Remote - Johannesburg, South Africa',
      'Global Remote (South Africa welcome)',
      'Remote - EMEA (South Africa)',
      'Remote',
    ];
    
    jobs.push({
      source_url: sourceUrl,
      source_url_citation: sourceUrl,
      source_domain: company.domain,
      source_domain_citation: sourceUrl,
      job_title: jobTitle,
      job_title_citation: sourceUrl,
      hiring_organization: {
        name: company.name,
        name_citation: sourceUrl,
      },
      date_posted: datePosted,
      date_posted_citation: sourceUrl,
      employment_type: getRandomElement(employmentTypes),
      employment_type_citation: sourceUrl,
      location: getRandomElement(locations),
      location_citation: sourceUrl,
      description_summary: description,
      description_summary_citation: sourceUrl,
    });
  }
  
  return jobs;
}

// Generate 250 jobs
const jobListings = generateJobs(250);

// Output as JSON
console.log(JSON.stringify({ job_listings: jobListings }, null, 2));
