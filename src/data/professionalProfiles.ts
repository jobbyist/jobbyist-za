// Professional candidate profiles data
// NOTE: This contains seed data for the Professional Profiles feature.
// In production, this should be replaced with real verified candidate data
// fetched from a secure backend API after proper authentication and authorization.
// Real candidate data must only be displayed after:
// - Explicit candidate consent
// - POPIA compliance verification
// - Authentication and plan entitlement checks (Jobbyist Pro or Recruitment Suite)

export interface CandidateProfile {
  id: string;
  name: string;
  role: string;
  location: string;
  experience: string;
  availability: string;
  workPreference: string;
  skills: string[];
  verificationBadges: string[];
  publicSummary: string;
  slug: string;
}

// Seed data: 25 candidate profiles for initial implementation
// TODO: Replace with real database/API integration
export const candidateProfiles: CandidateProfile[] = [
  {
    id: "ZA-PP-0001",
    name: "Lerato Mokoena",
    role: "Virtual Assistant & Executive Admin",
    location: "Johannesburg, Gauteng",
    experience: "5 years",
    availability: "Immediate",
    workPreference: "Remote / Hybrid",
    skills: ["Calendar management", "Google Workspace", "Inbox support", "Travel coordination"],
    verificationBadges: ["ID verified", "CV reviewed", "Reference checked"],
    publicSummary: "Organised administrative professional with strong inbox, scheduling and client follow-up experience for busy teams.",
    slug: "lerato-mokoena-za-pp-0001"
  },
  {
    id: "ZA-PP-0002",
    name: "Thabo Nkosi",
    role: "Customer Success Representative",
    location: "Cape Town, Western Cape",
    experience: "4 years",
    availability: "2 weeks",
    workPreference: "Remote",
    skills: ["Zendesk", "HubSpot", "Live chat", "Customer onboarding"],
    verificationBadges: ["ID verified", "CV reviewed", "Skills screened"],
    publicSummary: "Customer support specialist with strong written communication, ticket handling and client retention experience.",
    slug: "thabo-nkosi-za-pp-0002"
  },
  {
    id: "ZA-PP-0003",
    name: "Ayesha Khan",
    role: "Junior Data Analyst",
    location: "Durban, KwaZulu-Natal",
    experience: "3 years",
    availability: "Immediate",
    workPreference: "Remote / Hybrid",
    skills: ["Excel", "Power BI", "SQL basics", "Data cleaning"],
    verificationBadges: ["ID verified", "CV reviewed", "Portfolio reviewed"],
    publicSummary: "Analytical junior data professional experienced in spreadsheet cleanup, dashboards and weekly performance reporting.",
    slug: "ayesha-khan-za-pp-0003"
  },
  {
    id: "ZA-PP-0004",
    name: "Sipho Dlamini",
    role: "Recruitment Coordinator",
    location: "Pretoria, Gauteng",
    experience: "6 years",
    availability: "30 days",
    workPreference: "Remote / On-site",
    skills: ["ATS updates", "Interview scheduling", "Candidate screening", "LinkedIn sourcing"],
    verificationBadges: ["ID verified", "CV reviewed", "Reference checked"],
    publicSummary: "Recruitment coordinator with strong scheduling, screening and candidate communication experience across high-volume roles.",
    slug: "sipho-dlamini-za-pp-0004"
  },
  {
    id: "ZA-PP-0005",
    name: "Naledi Radebe",
    role: "Social Media & Marketing Assistant",
    location: "Bloemfontein, Free State",
    experience: "4 years",
    availability: "Immediate",
    workPreference: "Remote / Hybrid",
    skills: ["Canva", "Meta Business Suite", "Content calendars", "Copywriting"],
    verificationBadges: ["ID verified", "CV reviewed", "Portfolio reviewed"],
    publicSummary: "Creative marketing assistant with practical content planning, community response and social media production experience.",
    slug: "naledi-radebe-za-pp-0005"
  },
  {
    id: "ZA-PP-0006",
    name: "Michael van der Merwe",
    role: "IT Support Technician",
    location: "Stellenbosch, Western Cape",
    experience: "5 years",
    availability: "2 weeks",
    workPreference: "Remote / Hybrid",
    skills: ["Microsoft 365", "Helpdesk", "Device support", "Ticketing"],
    verificationBadges: ["ID verified", "CV reviewed", "Certification reviewed"],
    publicSummary: "IT support technician with strong remote troubleshooting, Microsoft 365 and helpdesk ticket management experience.",
    slug: "michael-van-der-merwe-za-pp-0006"
  },
  {
    id: "ZA-PP-0007",
    name: "Zanele Khumalo",
    role: "Legal Administrative Assistant",
    location: "Johannesburg, Gauteng",
    experience: "4 years",
    availability: "Immediate",
    workPreference: "Remote / Hybrid",
    skills: ["Document preparation", "Legal admin", "Client emails", "Filing"],
    verificationBadges: ["ID verified", "CV reviewed", "Reference checked"],
    publicSummary: "Legal admin assistant with confidentiality, document handling and client communication experience.",
    slug: "zanele-khumalo-za-pp-0007"
  },
  {
    id: "ZA-PP-0008",
    name: "Devon Jacobs",
    role: "Sales Development Representative",
    location: "Cape Town, Western Cape",
    experience: "3 years",
    availability: "Immediate",
    workPreference: "Remote",
    skills: ["Cold outreach", "CRM updates", "Email sequences", "Discovery calls"],
    verificationBadges: ["ID verified", "CV reviewed", "Skills screened"],
    publicSummary: "SDR with experience qualifying leads, managing CRM pipelines and booking meetings for B2B teams.",
    slug: "devon-jacobs-za-pp-0008"
  },
  {
    id: "ZA-PP-0009",
    name: "Nomsa Ndlovu",
    role: "Bookkeeper & Payroll Administrator",
    location: "Gqeberha, Eastern Cape",
    experience: "7 years",
    availability: "30 days",
    workPreference: "Remote / Hybrid",
    skills: ["Xero", "Sage", "Payroll admin", "Bank reconciliations"],
    verificationBadges: ["ID verified", "CV reviewed", "Reference checked"],
    publicSummary: "Reliable finance administrator with bookkeeping, payroll data preparation and month-end reconciliation experience.",
    slug: "nomsa-ndlovu-za-pp-0009"
  },
  {
    id: "ZA-PP-0010",
    name: "Kabelo Molefe",
    role: "Operations Coordinator",
    location: "Midrand, Gauteng",
    experience: "6 years",
    availability: "2 weeks",
    workPreference: "Hybrid",
    skills: ["Operations admin", "Supplier follow-ups", "Reporting", "Process tracking"],
    verificationBadges: ["ID verified", "CV reviewed", "Reference checked"],
    publicSummary: "Operations coordinator with practical experience keeping teams, suppliers and internal workflows on track.",
    slug: "kabelo-molefe-za-pp-0010"
  },
  {
    id: "ZA-PP-0011",
    name: "Priya Naidoo",
    role: "HR Generalist",
    location: "Durban, KwaZulu-Natal",
    experience: "5 years",
    availability: "30 days",
    workPreference: "Hybrid / On-site",
    skills: ["Employee records", "Recruitment admin", "Onboarding", "IR support"],
    verificationBadges: ["ID verified", "CV reviewed", "Reference checked"],
    publicSummary: "HR generalist with practical employee lifecycle experience from recruitment administration to onboarding and HR reporting.",
    slug: "priya-naidoo-za-pp-0011"
  },
  {
    id: "ZA-PP-0012",
    name: "Andile Mthembu",
    role: "Customer Support Team Lead",
    location: "Pietermaritzburg, KwaZulu-Natal",
    experience: "6 years",
    availability: "2 weeks",
    workPreference: "Remote / Hybrid",
    skills: ["Team coaching", "SLA monitoring", "Zendesk", "Escalations"],
    verificationBadges: ["ID verified", "CV reviewed", "Reference checked"],
    publicSummary: "Support team lead experienced in coaching agents, managing escalations and improving support quality.",
    slug: "andile-mthembu-za-pp-0012"
  },
  {
    id: "ZA-PP-0013",
    name: "Chantelle Petersen",
    role: "Virtual Receptionist",
    location: "Cape Town, Western Cape",
    experience: "4 years",
    availability: "Immediate",
    workPreference: "Remote",
    skills: ["Call handling", "Appointment booking", "Email support", "CRM notes"],
    verificationBadges: ["ID verified", "CV reviewed", "Voice screened"],
    publicSummary: "Remote receptionist with clear communication, appointment scheduling and client intake experience.",
    slug: "chantelle-petersen-za-pp-0013"
  },
  {
    id: "ZA-PP-0014",
    name: "Musa Maseko",
    role: "Junior Web Developer",
    location: "Johannesburg, Gauteng",
    experience: "2 years",
    availability: "Immediate",
    workPreference: "Remote / Hybrid",
    skills: ["HTML", "CSS", "JavaScript", "React basics"],
    verificationBadges: ["ID verified", "CV reviewed", "Portfolio reviewed"],
    publicSummary: "Junior developer with practical website build, maintenance and front-end troubleshooting experience.",
    slug: "musa-maseko-za-pp-0014"
  },
  {
    id: "ZA-PP-0015",
    name: "Tebogo Sejake",
    role: "Project Administrator",
    location: "Pretoria, Gauteng",
    experience: "5 years",
    availability: "30 days",
    workPreference: "Remote / Hybrid",
    skills: ["Project tracking", "Minutes", "Status reports", "MS Project"],
    verificationBadges: ["ID verified", "CV reviewed", "Reference checked"],
    publicSummary: "Project administrator with strong documentation, status tracking and stakeholder coordination experience.",
    slug: "tebogo-sejake-za-pp-0015"
  },
  {
    id: "ZA-PP-0016",
    name: "Fatima Ismail",
    role: "E-commerce Support Specialist",
    location: "Johannesburg, Gauteng",
    experience: "4 years",
    availability: "2 weeks",
    workPreference: "Remote / Hybrid",
    skills: ["Shopify", "Order support", "Returns", "Product uploads"],
    verificationBadges: ["ID verified", "CV reviewed", "Skills screened"],
    publicSummary: "E-commerce support professional experienced in online orders, product updates, customer emails and return workflows.",
    slug: "fatima-ismail-za-pp-0016"
  },
  {
    id: "ZA-PP-0017",
    name: "Sibusiso Buthelezi",
    role: "Data Capturer & QA Clerk",
    location: "Durban, KwaZulu-Natal",
    experience: "5 years",
    availability: "Immediate",
    workPreference: "Remote / On-site",
    skills: ["Data entry", "Quality checks", "Excel", "Document capture"],
    verificationBadges: ["ID verified", "CV reviewed", "Skills screened"],
    publicSummary: "Careful data capturer with strong accuracy, document checking and structured record update experience.",
    slug: "sibusiso-buthelezi-za-pp-0017"
  },
  {
    id: "ZA-PP-0018",
    name: "Kayla Botha",
    role: "Content Coordinator",
    location: "Somerset West, Western Cape",
    experience: "3 years",
    availability: "Immediate",
    workPreference: "Remote / Hybrid",
    skills: ["Content calendars", "WordPress", "Canva", "Basic SEO"],
    verificationBadges: ["ID verified", "CV reviewed", "Portfolio reviewed"],
    publicSummary: "Content coordinator with hands-on experience preparing blog content, newsletters and simple SEO updates.",
    slug: "kayla-botha-za-pp-0018"
  },
  {
    id: "ZA-PP-0019",
    name: "Refilwe Matlala",
    role: "Compliance Assistant",
    location: "Polokwane, Limpopo",
    experience: "4 years",
    availability: "30 days",
    workPreference: "Remote / Hybrid",
    skills: ["Document audits", "KYC support", "Compliance registers", "Excel"],
    verificationBadges: ["ID verified", "CV reviewed", "Reference checked"],
    publicSummary: "Compliance assistant with experience maintaining registers, reviewing documents and supporting KYC/admin workflows.",
    slug: "refilwe-matlala-za-pp-0019"
  },
  {
    id: "ZA-PP-0020",
    name: "Ryan Adams",
    role: "Logistics Coordinator",
    location: "Cape Town, Western Cape",
    experience: "6 years",
    availability: "2 weeks",
    workPreference: "Hybrid / On-site",
    skills: ["Dispatch coordination", "Supplier updates", "Stock reports", "Delivery tracking"],
    verificationBadges: ["ID verified", "CV reviewed", "Reference checked"],
    publicSummary: "Logistics coordinator experienced in delivery tracking, stock coordination and supplier communication.",
    slug: "ryan-adams-za-pp-0020"
  },
  {
    id: "ZA-PP-0021",
    name: "Busisiwe Zungu",
    role: "Insurance Claims Administrator",
    location: "Richards Bay, KwaZulu-Natal",
    experience: "5 years",
    availability: "30 days",
    workPreference: "Remote / Hybrid",
    skills: ["Claims admin", "Document checks", "Customer updates", "Case tracking"],
    verificationBadges: ["ID verified", "CV reviewed", "Reference checked"],
    publicSummary: "Claims administrator experienced in case tracking, customer updates and document review for insurance workflows.",
    slug: "busisiwe-zungu-za-pp-0021"
  },
  {
    id: "ZA-PP-0022",
    name: "Ethan Govender",
    role: "Junior Business Analyst",
    location: "Durban, KwaZulu-Natal",
    experience: "2 years",
    availability: "Immediate",
    workPreference: "Remote / Hybrid",
    skills: ["Requirements notes", "Process mapping", "Excel", "User stories"],
    verificationBadges: ["ID verified", "CV reviewed", "Portfolio reviewed"],
    publicSummary: "Junior BA with experience documenting requirements, supporting UAT and mapping operational workflows.",
    slug: "ethan-govender-za-pp-0022"
  },
  {
    id: "ZA-PP-0023",
    name: "Palesa Modise",
    role: "Executive Personal Assistant",
    location: "Sandton, Gauteng",
    experience: "8 years",
    availability: "30 days",
    workPreference: "Hybrid / On-site",
    skills: ["Executive diary", "Board packs", "Travel planning", "Confidential admin"],
    verificationBadges: ["ID verified", "CV reviewed", "Reference checked"],
    publicSummary: "Senior PA with strong executive diary management, board support and confidential stakeholder communication experience.",
    slug: "palesa-modise-za-pp-0023"
  },
  {
    id: "ZA-PP-0024",
    name: "Mpho Tshabalala",
    role: "Technical Recruiter",
    location: "Johannesburg, Gauteng",
    experience: "5 years",
    availability: "2 weeks",
    workPreference: "Remote / Hybrid",
    skills: ["Tech sourcing", "Boolean search", "Interview coordination", "ATS"],
    verificationBadges: ["ID verified", "CV reviewed", "Reference checked"],
    publicSummary: "Technical recruiter experienced in sourcing developers, managing candidate pipelines and coordinating interviews.",
    slug: "mpho-tshabalala-za-pp-0024"
  },
  {
    id: "ZA-PP-0025",
    name: "Tamsyn Williams",
    role: "Learning & Development Coordinator",
    location: "Cape Town, Western Cape",
    experience: "4 years",
    availability: "Immediate",
    workPreference: "Remote / Hybrid",
    skills: ["Training admin", "LMS updates", "Workshop coordination", "Reporting"],
    verificationBadges: ["ID verified", "CV reviewed", "Portfolio reviewed"],
    publicSummary: "L&D coordinator with experience managing training schedules, LMS updates and employee learning records.",
    slug: "tamsyn-williams-za-pp-0025"
  }
];

export const candidateCount = candidateProfiles.length;
