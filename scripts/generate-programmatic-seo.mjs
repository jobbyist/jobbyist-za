import { createClient } from '@supabase/supabase-js';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const publicDir = path.join(repoRoot, 'public');
const configPath = path.join(repoRoot, 'src', 'config', 'programmatic-seo.json');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const normalize = (value = '') => String(value).toLowerCase().trim();
const xmlEscape = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const jobMatchesCity = (job, city) => {
  if (city.slug === 'remote') return Boolean(job.is_remote);
  const location = normalize(job.location);
  return city.aliases.some((alias) => location.includes(normalize(alias)));
};

const jobMatchesCategory = (job, category) => {
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

const calculateAverageSalary = (jobs) => {
  const salaries = jobs
    .map((job) => {
      if (typeof job.salary_min === 'number' && typeof job.salary_max === 'number') return (job.salary_min + job.salary_max) / 2;
      if (typeof job.salary_min === 'number') return job.salary_min;
      if (typeof job.salary_max === 'number') return job.salary_max;
      return null;
    })
    .filter((value) => typeof value === 'number' && Number.isFinite(value));

  if (!salaries.length) return null;
  return Math.round(salaries.reduce((sum, value) => sum + value, 0) / salaries.length);
};

const getTopCompanies = (jobs, limit = 3) => {
  const companies = new Map();

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

const cityOrFilter = (city) => city.aliases
  .filter(Boolean)
  .map((alias) => `location.ilike.%${alias.replace(/,/g, '')}%`)
  .join(',');

const fetchCandidateJobsForCity = async (supabase, city) => {
  let query = supabase
    .from('jobs')
    .select(`
      id,
      title,
      description,
      location,
      country,
      is_remote,
      job_type,
      employment_type,
      salary_min,
      salary_max,
      salary_currency,
      salary_period,
      posted_at,
      expires_at,
      application_deadline,
      skills,
      status,
      company:companies(id, name, logo_url, industry, website, is_verified)
    `)
    .eq('status', 'active')
    .eq('country', 'ZA')
    .order('posted_at', { ascending: false })
    .limit(1000);

  if (city.slug === 'remote') {
    query = query.eq('is_remote', true);
  } else {
    query = query.or(cityOrFilter(city));
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

const emptyIndex = (config) => ({
  generatedAt: new Date().toISOString(),
  minJobs: config.minJobsPerCombo || 3,
  combos: [],
});

const writeOutputs = async (config, combos) => {
  const generatedAt = new Date().toISOString();
  const today = generatedAt.slice(0, 10);
  const comboIndex = {
    generatedAt,
    minJobs: config.minJobsPerCombo || 3,
    combos,
  };

  await mkdir(publicDir, { recursive: true });
  await writeFile(
    path.join(publicDir, 'programmatic-seo-combos.json'),
    JSON.stringify(comboIndex, null, 2) + '\n',
    'utf8'
  );

  const urls = combos.map((combo) => `  <url>\n    <loc>${xmlEscape(combo.url)}</loc>\n    <lastmod>${xmlEscape(combo.lastmod || today)}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  await writeFile(path.join(publicDir, 'sitemap-programmatic-jobs.xml'), xml, 'utf8');

  console.log(`Generated ${combos.length} valid programmatic SEO combinations.`);
};

const main = async () => {
  const config = JSON.parse(await readFile(configPath, 'utf8'));

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Skipping programmatic SEO generation: missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY/VITE_SUPABASE_PUBLISHABLE_KEY.');
    await writeOutputs(config, emptyIndex(config).combos);
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const combos = [];
  const minJobs = config.minJobsPerCombo || 3;
  const baseUrl = (config.baseUrl || 'https://za.jobbyist.africa').replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);

  for (const city of config.cities) {
    const cityJobs = await fetchCandidateJobsForCity(supabase, city);

    for (const category of config.categories) {
      const matchedJobs = cityJobs.filter((job) => jobMatchesCity(job, city) && jobMatchesCategory(job, category));

      if (matchedJobs.length < minJobs) continue;

      combos.push({
        categorySlug: category.slug,
        categoryName: category.name,
        citySlug: city.slug,
        cityName: city.name,
        totalJobs: matchedJobs.length,
        averageSalary: calculateAverageSalary(matchedJobs),
        topCompanies: getTopCompanies(matchedJobs, 3),
        topJobIds: matchedJobs.slice(0, 10).map((job) => job.id),
        url: `${baseUrl}/jobs/${category.slug}/${city.slug}`,
        lastmod: today,
      });
    }
  }

  combos.sort((a, b) => a.categorySlug.localeCompare(b.categorySlug) || a.citySlug.localeCompare(b.citySlug));
  await writeOutputs(config, combos);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
