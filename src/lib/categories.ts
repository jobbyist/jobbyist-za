// Job categories used by programmatic SEO landing pages, navbar and sitemap.
export interface Category {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
}

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

export const locationSlugs = [
  { slug: "johannesburg", name: "Johannesburg" },
  { slug: "pretoria", name: "Pretoria" },
  { slug: "durban", name: "Durban" },
  { slug: "cape-town", name: "Cape Town" },
  { slug: "remote", name: "Remote" },
];

export function getCategory(slug?: string) {
  return categories.find((c) => c.slug === slug);
}
export function getLocation(slug?: string) {
  return locationSlugs.find((l) => l.slug === slug);
}
