import { supabase } from '@/integrations/supabase/client';
import {
  getProgrammaticCategory,
  getProgrammaticCity,
  programmaticCities,
  programmaticJobCategories,
  type ProgrammaticCity,
  type ProgrammaticJobCategory,
} from '@/lib/categories';

export interface ProgrammaticCompanySummary {
  id?: string;
  name: string;
  logo_url?: string | null;
  industry?: string | null;
  website?: string | null;
  count: number;
}

export interface ProgrammaticSeoJob {
  id: string;
  title: string;
  description: string;
  location: string;
  country: string;
  is_remote: boolean;
  job_type: string;
  employment_type?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string | null;
  salary_period?: string | null;
  posted_at?: string | null;
  expires_at?: string | null;
  application_deadline?: string | null;
  skills?: string[] | null;
  status?: string;
  company?: {
    id?: string;
    name?: string | null;
    logo_url?: string | null;
    industry?: string | null;
    website?: string | null;
    is_verified?: boolean | null;
  } | null;
}

export interface ProgrammaticComboIndexItem {
  categorySlug: string;
  categoryName: string;
  citySlug: string;
  cityName: string;
  totalJobs: number;
  averageSalary: number | null;
  topCompanies: ProgrammaticCompanySummary[];
  url: string;
  lastmod: string;
}

export interface ProgrammaticComboIndex {
  generatedAt: string;
  minJobs: number;
  combos: ProgrammaticComboIndexItem[];
}

export interface ProgrammaticPageData {
  category: ProgrammaticJobCategory;
  city: ProgrammaticCity;
  totalJobs: number;
  topJobs: ProgrammaticSeoJob[];
  topCompanies: ProgrammaticCompanySummary[];
  averageSalary: number | null;
  relatedCategories: ProgrammaticComboIndexItem[];
  relatedCities: ProgrammaticComboIndexItem[];
}

const ACTIVE_JOB_FETCH_LIMIT = 800;
const VALID_PAGE_MIN_JOBS = 3;

const normalize = (value?: string | null) => (value || '').toLowerCase().trim();

export const formatProgrammaticSalary = (amount: number | null) => {
  if (!amount) return 'Salary varies by role and experience';
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const jobMatchesCity = (job: ProgrammaticSeoJob, city: ProgrammaticCity) => {
  if (city.slug === 'remote') return Boolean(job.is_remote);
  const location = normalize(job.location);
  return city.aliases.some((alias) => location.includes(normalize(alias)));
};

export const jobMatchesCategory = (job: ProgrammaticSeoJob, category: ProgrammaticJobCategory) => {
  const skills = Array.isArray(job.skills) ? job.skills.join(' ') : '';
  const haystack = normalize([
    job.title,
    job.description,
    job.job_type,
    job.employment_type,
    skills,
    job.company?.name,
    job.company?.industry,
  ].filter(Boolean).join(' '));

  return category.keywords.some((keyword) => haystack.includes(normalize(keyword)));
};

export const calculateAverageSalary = (jobs: ProgrammaticSeoJob[]) => {
  const salaries = jobs
    .map((job) => {
      if (typeof job.salary_min === 'number' && typeof job.salary_max === 'number') {
        return (job.salary_min + job.salary_max) / 2;
      }
      if (typeof job.salary_min === 'number') return job.salary_min;
      if (typeof job.salary_max === 'number') return job.salary_max;
      return null;
    })
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));

  if (!salaries.length) return null;
  return Math.round(salaries.reduce((sum, value) => sum + value, 0) / salaries.length);
};

export const getTopCompanies = (jobs: ProgrammaticSeoJob[], limit = 3): ProgrammaticCompanySummary[] => {
  const companies = new Map<string, ProgrammaticCompanySummary>();

  jobs.forEach((job) => {
    const companyName = job.company?.name || 'Confidential Company';
    const key = job.company?.id || companyName;
    const existing = companies.get(key);

    if (existing) {
      existing.count += 1;
      return;
    }

    companies.set(key, {
      id: job.company?.id,
      name: companyName,
      logo_url: job.company?.logo_url,
      industry: job.company?.industry,
      website: job.company?.website,
      count: 1,
    });
  });

  return Array.from(companies.values())
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
};

const cityFilter = (city: ProgrammaticCity) => {
  if (city.slug === 'remote') return null;
  return city.aliases
    .filter(Boolean)
    .map((alias) => `location.ilike.%${alias.replace(/,/g, '')}%`)
    .join(',');
};

export const fetchCandidateJobsForCity = async (city: ProgrammaticCity) => {
  let query = supabase
    .from('jobs')
    .select(`
      *,
      company:companies(id, name, logo_url, industry, website, is_verified)
    `)
    .eq('status', 'active')
    .eq('country', 'ZA')
    .order('posted_at', { ascending: false })
    .limit(ACTIVE_JOB_FETCH_LIMIT);

  if (city.slug === 'remote') {
    query = query.eq('is_remote', true);
  } else {
    const orFilter = cityFilter(city);
    if (orFilter) query = query.or(orFilter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as unknown as ProgrammaticSeoJob[];
};

export const fetchProgrammaticComboIndex = async (): Promise<ProgrammaticComboIndex | null> => {
  try {
    const response = await fetch('/programmatic-seo-combos.json', { cache: 'no-cache' });
    if (!response.ok) return null;
    return (await response.json()) as ProgrammaticComboIndex;
  } catch {
    return null;
  }
};

const fallbackRelatedCategories = (cityJobs: ProgrammaticSeoJob[], city: ProgrammaticCity, currentCategorySlug: string) =>
  programmaticJobCategories
    .filter((category) => category.slug !== currentCategorySlug)
    .map((category) => {
      const matched = cityJobs.filter((job) => jobMatchesCategory(job, category));
      return {
        categorySlug: category.slug,
        categoryName: category.name,
        citySlug: city.slug,
        cityName: city.name,
        totalJobs: matched.length,
        averageSalary: calculateAverageSalary(matched),
        topCompanies: getTopCompanies(matched),
        url: `https://za.jobbyist.africa/jobs/${category.slug}/${city.slug}`,
        lastmod: new Date().toISOString().slice(0, 10),
      } satisfies ProgrammaticComboIndexItem;
    })
    .filter((item) => item.totalJobs >= VALID_PAGE_MIN_JOBS)
    .sort((a, b) => b.totalJobs - a.totalJobs)
    .slice(0, 5);

const fallbackRelatedCities = async (category: ProgrammaticJobCategory, currentCitySlug: string) => {
  const cityStats = await Promise.all(
    programmaticCities
      .filter((city) => city.slug !== currentCitySlug)
      .map(async (city) => {
        const jobs = await fetchCandidateJobsForCity(city);
        const matched = jobs.filter((job) => jobMatchesCategory(job, category));
        return {
          categorySlug: category.slug,
          categoryName: category.name,
          citySlug: city.slug,
          cityName: city.name,
          totalJobs: matched.length,
          averageSalary: calculateAverageSalary(matched),
          topCompanies: getTopCompanies(matched),
          url: `https://za.jobbyist.africa/jobs/${category.slug}/${city.slug}`,
          lastmod: new Date().toISOString().slice(0, 10),
        } satisfies ProgrammaticComboIndexItem;
      })
  );

  return cityStats
    .filter((item) => item.totalJobs >= VALID_PAGE_MIN_JOBS)
    .sort((a, b) => b.totalJobs - a.totalJobs)
    .slice(0, 5);
};

export const fetchProgrammaticPageData = async (categorySlug?: string, citySlug?: string): Promise<ProgrammaticPageData | null> => {
  const category = getProgrammaticCategory(categorySlug);
  const city = getProgrammaticCity(citySlug);

  if (!category || !city) return null;

  const cityJobs = await fetchCandidateJobsForCity(city);
  const matchedJobs = cityJobs.filter((job) => jobMatchesCategory(job, category));
  const comboIndex = await fetchProgrammaticComboIndex();

  const relatedCategoriesFromIndex = comboIndex?.combos
    .filter((combo) => combo.citySlug === city.slug && combo.categorySlug !== category.slug)
    .sort((a, b) => b.totalJobs - a.totalJobs)
    .slice(0, 5) ?? [];

  const relatedCitiesFromIndex = comboIndex?.combos
    .filter((combo) => combo.categorySlug === category.slug && combo.citySlug !== city.slug)
    .sort((a, b) => b.totalJobs - a.totalJobs)
    .slice(0, 5) ?? [];

  const relatedCategories = relatedCategoriesFromIndex.length
    ? relatedCategoriesFromIndex
    : fallbackRelatedCategories(cityJobs, city, category.slug);

  const relatedCities = relatedCitiesFromIndex.length
    ? relatedCitiesFromIndex
    : await fallbackRelatedCities(category, city.slug);

  return {
    category,
    city,
    totalJobs: matchedJobs.length,
    topJobs: matchedJobs.slice(0, 10),
    topCompanies: getTopCompanies(matchedJobs, 3),
    averageSalary: calculateAverageSalary(matchedJobs),
    relatedCategories,
    relatedCities,
  };
};
