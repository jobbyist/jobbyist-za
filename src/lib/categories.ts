// Job categories used by programmatic SEO landing pages, navbar and sitemap.
export interface Category {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
}

export interface ProgrammaticJobCategory extends Category {
  titleTerms: string[];
}

export interface ProgrammaticCity {
  slug: string;
  name: string;
  province?: string;
  aliases: string[];
}

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const categories: Category[] = [
  { slug: "software-engineering", name: "Software Engineering",
    description: "Software developer, engineer and architect roles across South Africa.",
    keywords: ["developer", "engineer", "programmer", "software"] },
  { slug: "data-science", name: "Data Science & Analytics",
    description: "Data scientist, analyst, ML and BI roles in South Africa.",
    keywords: ["data", "analytics", "machine learning", "scientist"] },
  { slug: "design", name: "Design & UX",
    description: "Product, UI, UX and graphic design jobs in South Africa.",
    keywords: ["design", "ux", "ui", "product designer"] },
  { slug: "marketing", name: "Marketing",
    description: "Digital, content, brand and growth marketing roles in SA.",
    keywords: ["marketing", "content", "seo", "growth"] },
  { slug: "sales", name: "Sales",
    description: "Sales executive, account manager and BDR jobs in South Africa.",
    keywords: ["sales", "account", "business development"] },
  { slug: "finance", name: "Finance & Accounting",
    description: "Accountant, finance manager, CA(SA) and analyst roles in SA.",
    keywords: ["finance", "accountant", "auditor", "CA"] },
  { slug: "customer-support", name: "Customer Support",
    description: "Customer success, support and CX roles in South Africa.",
    keywords: ["customer", "support", "success", "service"] },
  { slug: "human-resources", name: "Human Resources",
    description: "HR, talent and people operations jobs in South Africa.",
    keywords: ["hr", "human resources", "talent", "recruiter"] },
  { slug: "operations", name: "Operations",
    description: "Operations, logistics and supply chain jobs in South Africa.",
    keywords: ["operations", "logistics", "supply chain"] },
  { slug: "healthcare", name: "Healthcare",
    description: "Nursing, medical and allied health professional roles in SA.",
    keywords: ["nurse", "doctor", "medical", "health"] },
];

export const programmaticJobCategories: ProgrammaticJobCategory[] = [
  {
    slug: "software-developer",
    name: "Software Developer",
    description: "Frontend, backend, full-stack and application developer roles across South Africa.",
    keywords: ["software developer", "developer", "software engineer", "programmer", "frontend", "front-end", "backend", "back-end", "full stack", "full-stack", "react", "javascript", "typescript", "python", "java"],
    titleTerms: ["software developer", "developer", "software engineer", "programmer", "frontend", "backend", "full stack"],
  },
  {
    slug: "accountant",
    name: "Accountant",
    description: "Accountant, bookkeeper, auditor and finance operations roles for South African professionals.",
    keywords: ["accountant", "accounting", "bookkeeper", "auditor", "finance", "tax", "payroll", "creditors", "debtors", "ca(sa)", "cima"],
    titleTerms: ["accountant", "bookkeeper", "auditor", "finance officer", "financial accountant"],
  },
  {
    slug: "data-analyst",
    name: "Data Analyst",
    description: "BI, analytics, reporting, data science and insights roles in South Africa.",
    keywords: ["data analyst", "data", "analytics", "bi", "business intelligence", "sql", "power bi", "tableau", "reporting", "insights", "data scientist"],
    titleTerms: ["data analyst", "business intelligence", "bi analyst", "data scientist", "reporting analyst"],
  },
  {
    slug: "digital-marketer",
    name: "Digital Marketer",
    description: "SEO, PPC, growth, content, brand and social media marketing jobs.",
    keywords: ["digital marketing", "marketing", "seo", "ppc", "google ads", "paid media", "content", "brand", "social media", "growth"],
    titleTerms: ["digital marketer", "marketing", "seo", "ppc", "social media", "content marketer"],
  },
  {
    slug: "sales-representative",
    name: "Sales Representative",
    description: "Sales representative, account executive, business development and customer growth roles.",
    keywords: ["sales", "sales representative", "account executive", "business development", "bdr", "sdr", "key account", "commercial", "customer acquisition"],
    titleTerms: ["sales representative", "sales", "account executive", "business development", "bdr", "sdr"],
  },
  {
    slug: "customer-support",
    name: "Customer Support",
    description: "Customer service, customer success, helpdesk and contact centre jobs.",
    keywords: ["customer support", "customer service", "customer success", "support", "helpdesk", "call centre", "contact centre", "client service"],
    titleTerms: ["customer support", "customer service", "customer success", "support consultant", "helpdesk"],
  },
  {
    slug: "project-manager",
    name: "Project Manager",
    description: "Project manager, delivery lead, scrum master and programme coordination jobs.",
    keywords: ["project manager", "project management", "programme manager", "program manager", "scrum master", "delivery lead", "agile", "pmp", "prince2"],
    titleTerms: ["project manager", "programme manager", "scrum master", "delivery lead"],
  },
  {
    slug: "human-resources",
    name: "Human Resources",
    description: "HR, recruitment, talent acquisition and people operations roles.",
    keywords: ["human resources", "hr", "recruiter", "talent acquisition", "people operations", "payroll", "hr business partner"],
    titleTerms: ["human resources", "hr", "recruiter", "talent acquisition", "people operations"],
  },
  {
    slug: "graphic-designer",
    name: "Graphic Designer",
    description: "Graphic design, UI design, brand design and creative production roles.",
    keywords: ["graphic designer", "designer", "ui designer", "ux", "creative", "brand designer", "adobe", "figma", "illustrator", "photoshop"],
    titleTerms: ["graphic designer", "designer", "ui designer", "brand designer", "creative designer"],
  },
  {
    slug: "operations-manager",
    name: "Operations Manager",
    description: "Operations, logistics, supply chain, warehouse and process improvement jobs.",
    keywords: ["operations", "operations manager", "logistics", "supply chain", "warehouse", "process improvement", "procurement", "inventory"],
    titleTerms: ["operations manager", "operations", "logistics", "supply chain", "warehouse manager"],
  },
];

export const locationSlugs = [
  { slug: "johannesburg", name: "Johannesburg" },
  { slug: "pretoria", name: "Pretoria" },
  { slug: "durban", name: "Durban" },
  { slug: "cape-town", name: "Cape Town" },
  { slug: "remote", name: "Remote" },
];

export const programmaticCities: ProgrammaticCity[] = [
  { slug: "johannesburg", name: "Johannesburg", province: "Gauteng", aliases: ["johannesburg", "joburg", "jhb", "sandton", "rosebank", "midrand"] },
  { slug: "cape-town", name: "Cape Town", province: "Western Cape", aliases: ["cape town", "cpt", "stellenbosch", "bellville", "claremont"] },
  { slug: "durban", name: "Durban", province: "KwaZulu-Natal", aliases: ["durban", "umhlanga", "pinetown", "kloof", "ballito"] },
  { slug: "pretoria", name: "Pretoria", province: "Gauteng", aliases: ["pretoria", "tshwane", "centurion", "menlyn", "hatfield"] },
  { slug: "gqeberha", name: "Gqeberha", province: "Eastern Cape", aliases: ["gqeberha", "port elizabeth", "pe"] },
  { slug: "bloemfontein", name: "Bloemfontein", province: "Free State", aliases: ["bloemfontein", "mangaung"] },
  { slug: "east-london", name: "East London", province: "Eastern Cape", aliases: ["east london"] },
  { slug: "polokwane", name: "Polokwane", province: "Limpopo", aliases: ["polokwane", "pietersburg"] },
  { slug: "nelspruit", name: "Nelspruit", province: "Mpumalanga", aliases: ["nelspruit", "mbombela"] },
  { slug: "kimberley", name: "Kimberley", province: "Northern Cape", aliases: ["kimberley"] },
  { slug: "remote", name: "Remote", aliases: ["remote", "work from home", "hybrid"] },
];

export function getCategory(slug?: string) {
  return categories.find((c) => c.slug === slug);
}
export function getLocation(slug?: string) {
  return locationSlugs.find((l) => l.slug === slug);
}
export function getProgrammaticCategory(slug?: string): ProgrammaticJobCategory | undefined {
  const normalizedSlug = slugify(slug || "");
  const exactCategory = programmaticJobCategories.find((c) => c.slug === normalizedSlug);
  if (exactCategory) return exactCategory;

  const legacyCategory = categories.find((c) => c.slug === normalizedSlug);
  if (!legacyCategory) return undefined;

  return {
    ...legacyCategory,
    titleTerms: legacyCategory.keywords,
  };
}
export function getProgrammaticCity(slug?: string) {
  return programmaticCities.find((c) => c.slug === slugify(slug || ""));
}
