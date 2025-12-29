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
  { name: 'Takealot', industry: 'E-commerce', size: '1000-5000', logo: 'https://logo.clearbit.com/takealot.com', website: 'https://www.takealot.com', description: 'South Africa\'s leading online retailer offering a wide range of products delivered to your door.' },
  { name: 'Discovery', industry: 'Insurance', size: '10000+', logo: 'https://logo.clearbit.com/discovery.co.za', website: 'https://www.discovery.co.za', description: 'An integrated financial services organization offering health, life, and short-term insurance, as well as investment and wellness products.' },
  { name: 'Capitec Bank', industry: 'Banking', size: '10000+', logo: 'https://logo.clearbit.com/capitecbank.co.za', website: 'https://www.capitecbank.co.za', description: 'South Africa\'s leading digital bank offering simple, affordable, and accessible banking products.' },
  { name: 'MTN South Africa', industry: 'Telecommunications', size: '10000+', logo: 'https://logo.clearbit.com/mtn.co.za', website: 'https://www.mtn.co.za', description: 'Leading telecommunications provider delivering innovative voice, data, and digital services.' },
  { name: 'Vodacom', industry: 'Telecommunications', size: '5000-10000', logo: 'https://logo.clearbit.com/vodacom.co.za', website: 'https://www.vodacom.co.za', description: 'Africa\'s leading mobile communications company with cutting-edge network technology.' },
  { name: 'Standard Bank', industry: 'Banking', size: '10000+', logo: 'https://logo.clearbit.com/standardbank.co.za', website: 'https://www.standardbank.co.za', description: 'Africa\'s largest banking group by assets, serving individuals and businesses with comprehensive financial solutions.' },
  { name: 'FNB', industry: 'Banking', size: '10000+', logo: 'https://logo.clearbit.com/fnb.co.za', website: 'https://www.fnb.co.za', description: 'Innovative banking solutions with a focus on digital transformation and customer experience.' },
  { name: 'Nedbank', industry: 'Banking', size: '10000+', logo: 'https://logo.clearbit.com/nedbank.co.za', website: 'https://www.nedbank.co.za', description: 'One of South Africa\'s largest banks offering a complete range of financial services.' },
  { name: 'Absa', industry: 'Banking', size: '10000+', logo: 'https://logo.clearbit.com/absa.co.za', website: 'https://www.absa.co.za', description: 'Leading African financial services group providing retail, business, and corporate banking solutions.' },
  { name: 'Multichoice', industry: 'Media', size: '5000-10000', logo: 'https://logo.clearbit.com/multichoice.com', website: 'https://www.multichoice.com', description: 'Africa\'s leading entertainment company delivering world-class content to millions of viewers.' },
  { name: 'Shoprite', industry: 'Retail', size: '10000+', logo: 'https://logo.clearbit.com/shoprite.co.za', website: 'https://www.shoprite.co.za', description: 'Africa\'s largest food retailer providing quality products at affordable prices.' },
  { name: 'Pick n Pay', industry: 'Retail', size: '10000+', logo: 'https://logo.clearbit.com/pnp.co.za', website: 'https://www.pnp.co.za', description: 'Leading South African retailer known for value, quality, and customer service.' },
  { name: 'Woolworths', industry: 'Retail', size: '10000+', logo: 'https://logo.clearbit.com/woolworths.co.za', website: 'https://www.woolworths.co.za', description: 'Premium retail chain offering quality food, fashion, and homeware products.' },
  { name: 'Clicks Group', industry: 'Retail/Healthcare', size: '10000+', logo: 'https://logo.clearbit.com/clicks.co.za', website: 'https://www.clicks.co.za', description: 'South Africa\'s leading health and beauty retailer with a focus on wellness and pharmaceutical services.' },
  { name: 'Sanlam', industry: 'Insurance', size: '10000+', logo: 'https://logo.clearbit.com/sanlam.com', website: 'https://www.sanlam.com', description: 'Leading pan-African financial services group providing insurance, investment, and wealth management solutions.' },
  { name: 'Old Mutual', industry: 'Insurance', size: '10000+', logo: 'https://logo.clearbit.com/oldmutual.co.za', website: 'https://www.oldmutual.co.za', description: 'Premium African financial services group offering life and savings, property and casualty, and asset management.' },
  { name: 'Liberty', industry: 'Insurance', size: '5000-10000', logo: 'https://logo.clearbit.com/liberty.co.za', website: 'https://www.liberty.co.za', description: 'Innovative financial services provider delivering smart insurance and investment solutions.' },
  { name: 'Alexander Forbes', industry: 'Financial Services', size: '1000-5000', logo: 'https://logo.clearbit.com/alexanderforbes.co.za', website: 'https://www.alexanderforbes.co.za', description: 'Leading provider of financial and risk services in retirement, investment, and insurance.' },
  { name: 'Sasol', industry: 'Energy', size: '10000+', logo: 'https://logo.clearbit.com/sasol.com', website: 'https://www.sasol.com', description: 'International integrated chemicals and energy company with world-class expertise.' },
  { name: 'Anglo American', industry: 'Mining', size: '10000+', logo: 'https://logo.clearbit.com/angloamerican.com', website: 'https://www.angloamerican.com', description: 'Global mining company with a portfolio of mining operations and undeveloped resources.' },
  { name: 'Sibanye-Stillwater', industry: 'Mining', size: '10000+', logo: 'https://logo.clearbit.com/sibanyestillwater.com', website: 'https://www.sibanyestillwater.com', description: 'Multinational mining and metals processing group with operations in South Africa and the Americas.' },
  { name: 'Naspers', industry: 'Technology', size: '10000+', logo: 'https://logo.clearbit.com/naspers.com', website: 'https://www.naspers.com', description: 'Global consumer internet group and technology investor operating in online classifieds, food delivery, payments, and more.' },
  { name: 'Prosus', industry: 'Technology', size: '5000-10000', logo: 'https://logo.clearbit.com/prosus.com', website: 'https://www.prosus.com', description: 'Global consumer internet group and one of the largest technology investors in the world.' },
  { name: 'Investec', industry: 'Banking', size: '5000-10000', logo: 'https://logo.clearbit.com/investec.com', website: 'https://www.investec.com', description: 'Distinctive specialist bank and wealth manager with a focus on high-net-worth individuals and businesses.' },
  { name: 'Rand Merchant Bank', industry: 'Banking', size: '1000-5000', logo: 'https://logo.clearbit.com/rmb.co.za', website: 'https://www.rmb.co.za', description: 'Leading corporate and investment bank providing innovative financial solutions.' },
  { name: 'Dimension Data', industry: 'IT Services', size: '5000-10000', logo: 'https://logo.clearbit.com/dimensiondata.com', website: 'https://www.dimensiondata.com', description: 'Global technology integrator and managed services provider accelerating digital transformation.' },
  { name: 'Accenture South Africa', industry: 'Consulting', size: '5000-10000', logo: 'https://logo.clearbit.com/accenture.com', website: 'https://www.accenture.com', description: 'Leading global professional services company providing strategy, consulting, digital, technology and operations services.' },
  { name: 'Deloitte South Africa', industry: 'Consulting', size: '5000-10000', logo: 'https://logo.clearbit.com/deloitte.com', website: 'https://www.deloitte.com', description: 'Multinational professional services network providing audit, consulting, financial advisory, risk advisory, and tax services.' },
  { name: 'PwC South Africa', industry: 'Consulting', size: '5000-10000', logo: 'https://logo.clearbit.com/pwc.com', website: 'https://www.pwc.com', description: 'World-class professional services organization helping to solve complex business challenges and identify opportunities.' },
  { name: 'KPMG South Africa', industry: 'Consulting', size: '1000-5000', logo: 'https://logo.clearbit.com/kpmg.com', website: 'https://www.kpmg.com', description: 'Global network of professional firms providing Audit, Tax and Advisory services.' },
  { name: 'EY South Africa', industry: 'Consulting', size: '1000-5000', logo: 'https://logo.clearbit.com/ey.com', website: 'https://www.ey.com', description: 'Global leader in assurance, consulting, strategy and transactions, and tax services.' },
  { name: 'Amazon Web Services SA', industry: 'Technology', size: '500-1000', logo: 'https://logo.clearbit.com/aws.amazon.com', website: 'https://aws.amazon.com', description: 'World\'s most comprehensive cloud platform offering compute, storage, database, and other IT services.' },
  { name: 'Microsoft South Africa', industry: 'Technology', size: '500-1000', logo: 'https://logo.clearbit.com/microsoft.com', website: 'https://www.microsoft.com', description: 'Global technology company developing innovative software, devices, and cloud solutions.' },
  { name: 'Google South Africa', industry: 'Technology', size: '100-500', logo: 'https://logo.clearbit.com/google.com', website: 'https://www.google.com', description: 'World\'s leading search and digital advertising platform building products that help create opportunities.' },
  { name: 'IBM South Africa', industry: 'Technology', size: '1000-5000', logo: 'https://logo.clearbit.com/ibm.com', website: 'https://www.ibm.com', description: 'Global technology and consulting company providing integrated solutions leveraging AI, cloud, and quantum computing.' },
  { name: 'SAP South Africa', industry: 'Technology', size: '500-1000', logo: 'https://logo.clearbit.com/sap.com', website: 'https://www.sap.com', description: 'World leader in enterprise application software helping companies run better with intelligent, cloud-based solutions.' },
  { name: 'Entelect', industry: 'Technology', size: '500-1000', logo: 'https://logo.clearbit.com/entelect.co.za', website: 'https://www.entelect.co.za', description: 'South African software engineering company specializing in custom software development and technology consulting.' },
  { name: 'BBD', industry: 'Technology', size: '500-1000', logo: 'https://logo.clearbit.com/bbd.co.za', website: 'https://www.bbd.co.za', description: 'Leading custom software development company delivering innovative technology solutions for businesses.' },
  { name: 'DVT', industry: 'Technology', size: '500-1000', logo: 'https://logo.clearbit.com/dvt.co.za', website: 'https://www.dvt.co.za', description: 'Technology solutions company specializing in software development, cloud solutions, and digital transformation.' },
  { name: 'Synthesis Software', industry: 'Technology', size: '100-500', logo: 'https://logo.clearbit.com/synthesis.co.za', website: 'https://www.synthesis.co.za', description: 'Software development and consulting company focusing on building enterprise-grade applications.' },
  { name: 'Yoco', industry: 'Fintech', size: '500-1000', logo: 'https://logo.clearbit.com/yoco.com', website: 'https://www.yoco.com', description: 'South African fintech company providing point-of-sale, business tools, and payments for small businesses.' },
  { name: 'Luno', industry: 'Fintech', size: '100-500', logo: 'https://logo.clearbit.com/luno.com', website: 'https://www.luno.com', description: 'Leading cryptocurrency platform making it safe and easy to buy, store, and learn about cryptocurrency.' },
  { name: 'OfferZen', industry: 'Recruitment', size: '50-100', logo: 'https://logo.clearbit.com/offerzen.com', website: 'https://www.offerzen.com', description: 'Developer job marketplace connecting skilled software developers with top tech companies.' },
  { name: 'GetSmarter', industry: 'EdTech', size: '100-500', logo: 'https://logo.clearbit.com/getsmarter.com', website: 'https://www.getsmarter.com', description: 'Premium online education provider partnering with top universities to deliver world-class online short courses.' },
  { name: 'Superbalist', industry: 'E-commerce', size: '500-1000', logo: 'https://logo.clearbit.com/superbalist.com', website: 'https://www.superbalist.com', description: 'South Africa\'s leading online fashion and lifestyle destination offering curated brands and exclusive collections.' },
  { name: 'Mr D Food', industry: 'Food Delivery', size: '500-1000', logo: 'https://logo.clearbit.com/mrdfood.com', website: 'https://www.mrdfood.com', description: 'Leading food delivery service connecting customers with their favorite restaurants for convenient delivery.' },
  { name: 'Uber South Africa', industry: 'Transportation', size: '100-500', logo: 'https://logo.clearbit.com/uber.com', website: 'https://www.uber.com', description: 'Technology platform connecting riders with drivers for convenient, safe, and reliable transportation.' },
  { name: 'Bolt South Africa', industry: 'Transportation', size: '100-500', logo: 'https://logo.clearbit.com/bolt.eu', website: 'https://bolt.eu', description: 'Ride-hailing and mobility platform offering fast, affordable, and convenient transportation services.' },
  { name: 'Momentum', industry: 'Insurance', size: '5000-10000', logo: 'https://logo.clearbit.com/momentum.co.za', website: 'https://www.momentum.co.za', description: 'Innovative financial services provider offering life insurance, investments, health, and short-term insurance.' },
  { name: 'Allan Gray', industry: 'Asset Management', size: '100-500', logo: 'https://logo.clearbit.com/allangray.co.za', website: 'https://www.allangray.co.za', description: 'South Africa\'s largest privately-owned investment management company.' },
  { name: 'Coronation Fund Managers', industry: 'Asset Management', size: '100-500', logo: 'https://logo.clearbit.com/coronation.com', website: 'https://www.coronation.com', description: 'Leading African asset management company with expertise in emerging markets.' },
  { name: 'Foschini Group', industry: 'Retail', size: '10000+', logo: 'https://logo.clearbit.com/tfglimited.co.za', website: 'https://www.tfglimited.co.za', description: 'Leading fashion, lifestyle, and cellular retail group in Africa.' },
  { name: 'Massmart', industry: 'Retail', size: '10000+', logo: 'https://logo.clearbit.com/massmart.co.za', website: 'https://www.massmart.co.za', description: 'Leading African retailer of general merchandise, home improvement, and food.' },
  { name: 'Tiger Brands', industry: 'Food Manufacturing', size: '10000+', logo: 'https://logo.clearbit.com/tigerbrands.com', website: 'https://www.tigerbrands.com', description: 'One of Africa\'s largest manufacturers and marketers of food, home, and personal care brands.' },
  { name: 'AVI', industry: 'Food & Beverage', size: '5000-10000', logo: 'https://logo.clearbit.com/avi.co.za', website: 'https://www.avi.co.za', description: 'Leading manufacturer and distributor of consumer brands in food, beverages, and footwear.' },
  { name: 'RCL Foods', industry: 'Food Manufacturing', size: '5000-10000', logo: 'https://logo.clearbit.com/rclfoods.com', website: 'https://www.rclfoods.com', description: 'Leading South African food producer with major brands in chicken, baking, and groceries.' },
  { name: 'Bid Corporation', industry: 'Foodservice', size: '10000+', logo: 'https://logo.clearbit.com/bidcorpgroup.com', website: 'https://www.bidcorpgroup.com', description: 'International foodservice group supplying food and related products to the food service industry.' },
  { name: 'Transnet', industry: 'Logistics', size: '10000+', logo: 'https://logo.clearbit.com/transnet.net', website: 'https://www.transnet.net', description: 'State-owned freight transport and logistics company operating rail, port, and pipeline infrastructure.' },
  { name: 'Eskom', industry: 'Energy', size: '10000+', logo: 'https://logo.clearbit.com/eskom.co.za', website: 'https://www.eskom.co.za', description: 'South African electricity public utility providing approximately 90% of the electricity used in South Africa.' },
  { name: 'Telkom', industry: 'Telecommunications', size: '10000+', logo: 'https://logo.clearbit.com/telkom.co.za', website: 'https://www.telkom.co.za', description: 'Leading telecommunications provider offering voice, data, and converged services.' },
  { name: 'Cell C', industry: 'Telecommunications', size: '1000-5000', logo: 'https://logo.clearbit.com/cellc.co.za', website: 'https://www.cellc.co.za', description: 'Mobile telecommunications company providing innovative voice, data, and value-added services.' },
  { name: 'Blue Label Telecoms', industry: 'Technology', size: '1000-5000', logo: 'https://logo.clearbit.com/bluelabeltelecoms.co.za', website: 'https://www.bluelabeltelecoms.co.za', description: 'Technology distributor and provider of prepaid products and transactional services.' },
  { name: 'Nashua', industry: 'Technology', size: '1000-5000', logo: 'https://logo.clearbit.com/nashua.co.za', website: 'https://www.nashua.co.za', description: 'Leading provider of technology and communication solutions for businesses.' },
  { name: 'Datacentrix', industry: 'IT Services', size: '500-1000', logo: 'https://logo.clearbit.com/datacentrix.co.za', website: 'https://www.datacentrix.co.za', description: 'ICT systems integrator and managed services provider delivering enterprise technology solutions.' },
  { name: 'BCX', industry: 'IT Services', size: '5000-10000', logo: 'https://logo.clearbit.com/bcx.co.za', website: 'https://www.bcx.co.za', description: 'Leading ICT services and solutions provider in the Telkom Group.' },
  { name: 'EOH', industry: 'IT Services', size: '5000-10000', logo: 'https://logo.clearbit.com/eoh.co.za', website: 'https://www.eoh.co.za', description: 'Technology and services company providing industry-specific business and ICT solutions.' },
  { name: 'Adapt IT', industry: 'Technology', size: '1000-5000', logo: 'https://logo.clearbit.com/adaptit.co.za', website: 'https://www.adaptit.co.za', description: 'Software and technology services company providing industry-specific solutions.' },
  { name: 'Murray & Roberts', industry: 'Construction', size: '5000-10000', logo: 'https://logo.clearbit.com/murrob.com', website: 'https://www.murrob.com', description: 'Leading engineering and construction company with operations in Africa, Middle East, and Australia.' },
  { name: 'WBHO', industry: 'Construction', size: '5000-10000', logo: 'https://logo.clearbit.com/wbho.co.za', website: 'https://www.wbho.co.za', description: 'Construction and infrastructure development company operating across Africa and beyond.' },
  { name: 'Aveng', industry: 'Construction', size: '5000-10000', logo: 'https://logo.clearbit.com/aveng.co.za', website: 'https://www.aveng.co.za', description: 'Infrastructure, resources, and manufacturing group with operations in Africa and Australasia.' },
  { name: 'Exxaro', industry: 'Mining', size: '5000-10000', logo: 'https://logo.clearbit.com/exxaro.com', website: 'https://www.exxaro.com', description: 'Leading South African diversified resources company focused on coal and minerals.' },
  { name: 'Gold Fields', industry: 'Mining', size: '10000+', logo: 'https://logo.clearbit.com/goldfields.com', website: 'https://www.goldfields.com', description: 'Globally diversified gold producer with operations spanning four continents.' },
  { name: 'Impala Platinum', industry: 'Mining', size: '10000+', logo: 'https://logo.clearbit.com/implats.co.za', website: 'https://www.implats.co.za', description: 'World\'s second-largest producer of platinum and associated platinum group metals.' },
  { name: 'Harmony Gold', industry: 'Mining', size: '10000+', logo: 'https://logo.clearbit.com/harmony.co.za', website: 'https://www.harmony.co.za', description: 'Global gold mining and exploration company with operations in South Africa and Papua New Guinea.' },
  { name: 'Kumba Iron Ore', industry: 'Mining', size: '5000-10000', logo: 'https://logo.clearbit.com/angloamericankumba.com', website: 'https://www.angloamericankumba.com', description: 'Leading producer and exporter of high-quality iron ore to global steel industry.' },
  { name: 'Mediclinic', industry: 'Healthcare', size: '10000+', logo: 'https://logo.clearbit.com/mediclinic.com', website: 'https://www.mediclinic.com', description: 'International private hospital group operating in South Africa, Switzerland, and UAE.' },
  { name: 'Netcare', industry: 'Healthcare', size: '10000+', logo: 'https://logo.clearbit.com/netcare.co.za', website: 'https://www.netcare.co.za', description: 'Leading South African private healthcare provider operating hospitals and emergency services.' },
  { name: 'Life Healthcare', industry: 'Healthcare', size: '10000+', logo: 'https://logo.clearbit.com/lifehealthcare.co.za', website: 'https://www.lifehealthcare.co.za', description: 'Private hospital group providing healthcare services through acute care hospitals and complementary services.' },
  { name: 'Distell', industry: 'Beverages', size: '5000-10000', logo: 'https://logo.clearbit.com/distell.co.za', website: 'https://www.distell.co.za', description: 'Leading producer and marketer of spirits, wines, ciders, and ready-to-drink beverages.' },
  { name: 'SABMiller', industry: 'Beverages', size: '10000+', logo: 'https://logo.clearbit.com/sabmiller.com', website: 'https://www.sabmiller.com', description: 'One of the world\'s leading brewers with operations across Africa and beyond.' },
  { name: 'Clover', industry: 'Food & Beverage', size: '5000-10000', logo: 'https://logo.clearbit.com/clover.co.za', website: 'https://www.clover.co.za', description: 'Leading dairy and beverage company producing milk, dairy products, and fruit juices.' },
  { name: 'Astral Foods', industry: 'Food Manufacturing', size: '5000-10000', logo: 'https://logo.clearbit.com/astralfoods.com', website: 'https://www.astralfoods.com', description: 'Integrated poultry producer providing quality chicken products to the South African market.' },
  { name: 'Famous Brands', industry: 'Restaurant', size: '5000-10000', logo: 'https://logo.clearbit.com/famousbrands.co.za', website: 'https://www.famousbrands.co.za', description: 'Leading restaurant franchising company with iconic brands like Steers, Wimpy, and Debonairs.' },
  { name: 'Spur Corporation', industry: 'Restaurant', size: '1000-5000', logo: 'https://logo.clearbit.com/spurcorporation.com', website: 'https://www.spurcorporation.com', description: 'Restaurant franchisor with popular brands including Spur Steak Ranches, Panarottis, and John Dory\'s.' },
  { name: 'Bidvest', industry: 'Services', size: '10000+', logo: 'https://logo.clearbit.com/bidvest.co.za', website: 'https://www.bidvest.co.za', description: 'Diversified services, trading, and distribution company operating across multiple sectors.' },
  { name: 'Barloworld', industry: 'Industrial', size: '10000+', logo: 'https://logo.clearbit.com/barloworld.com', website: 'https://www.barloworld.com', description: 'Industrial solutions provider distributing equipment and managing car rental and motor retail operations.' },
  { name: 'Reunert', industry: 'Industrial', size: '5000-10000', logo: 'https://logo.clearbit.com/reunert.co.za', website: 'https://www.reunert.co.za', description: 'Management company with interests in electrical engineering, ICT, and applied electronics.' },
  { name: 'Hudaco', industry: 'Industrial', size: '1000-5000', logo: 'https://logo.clearbit.com/hudaco.co.za', website: 'https://www.hudaco.co.za', description: 'Industrial products supplier and service provider to mining, electrical, and automotive industries.' },
  { name: 'Grindrod', industry: 'Logistics', size: '5000-10000', logo: 'https://logo.clearbit.com/grindrod.com', website: 'https://www.grindrod.com', description: 'Freight services and port operations company providing logistics solutions across Africa.' },
  { name: 'Imperial Logistics', industry: 'Logistics', size: '10000+', logo: 'https://logo.clearbit.com/imperiallogistics.com', website: 'https://www.imperiallogistics.com', description: 'International provider of integrated logistics and market access solutions.' },
  { name: 'Super Group', industry: 'Logistics', size: '5000-10000', logo: 'https://logo.clearbit.com/supergroup.co.za', website: 'https://www.supergroup.co.za', description: 'Supply chain and mobility solutions provider with operations across Africa and Europe.' },
  { name: 'Trencor', industry: 'Equipment Leasing', size: '100-500', logo: 'https://logo.clearbit.com/trencor.net', website: 'https://www.trencor.net', description: 'International container and equipment leasing company with global operations.' },
  { name: 'Raubex', industry: 'Construction', size: '5000-10000', logo: 'https://logo.clearbit.com/raubex.co.za', website: 'https://www.raubex.co.za', description: 'Construction and maintenance services company specializing in roads, earthworks, and materials.' },
  { name: 'Stefanutti Stocks', industry: 'Construction', size: '5000-10000', logo: 'https://logo.clearbit.com/stefanuttistocks.com', website: 'https://www.stefanuttistocks.com', description: 'Diversified construction and related services group operating in Africa and Middle East.' },
  { name: 'Group Five', industry: 'Construction', size: '5000-10000', logo: 'https://logo.clearbit.com/g5.co.za', website: 'https://www.g5.co.za', description: 'Construction and engineering services company with expertise in building and infrastructure.' },
  { name: 'Bytes Technology', industry: 'Technology', size: '1000-5000', logo: 'https://logo.clearbit.com/bytes.co.za', website: 'https://www.bytes.co.za', description: 'IT solutions and services provider offering software, infrastructure, and managed services.' },
  { name: 'Mustek', industry: 'Technology', size: '1000-5000', logo: 'https://logo.clearbit.com/mustek.co.za', website: 'https://www.mustek.co.za', description: 'Technology product assembly, distribution, and services company.' },
  { name: 'Altron', industry: 'Technology', size: '5000-10000', logo: 'https://logo.clearbit.com/altron.com', website: 'https://www.altron.com', description: 'Technology group providing ICT solutions, multimedia, and telecommunications products.' },
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
            description: company.description,
            logo_url: company.logo,
            website: company.website,
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
