import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const baseUrl = process.env.SITEMAP_BASE_URL || 'https://za.jobbyist.africa';
const outputPath = process.env.SITEMAP_OUTPUT_PATH || 'public/sitemap.xml';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Set SUPABASE_URL/VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const canonicalFacets = {
  provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
  cities: ['johannesburg', 'cape-town', 'durban', 'pretoria', 'sandton', 'gqeberha'],
  categories: ['software-development', 'finance', 'marketing', 'sales', 'data-and-analytics', 'engineering'],
};

const safeDate = (value?: string | null) => {
  if (!value) return new Date().toISOString().split('T')[0];
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
};

async function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  const urls: string[] = [];

  const push = (loc: string, priority = '0.7', changefreq = 'weekly', lastmod = today) => {
    urls.push(`  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`);
  };

  [
    ['/', '1.0', 'daily'],
    ['/jobs', '0.9', 'daily'],
    ['/companies', '0.8', 'weekly'],
    ['/pro', '0.7', 'monthly'],
    ['/about', '0.5', 'monthly'],
  ].forEach(([path, priority, changefreq]) => push(`${baseUrl}${path}`, priority, changefreq));

  canonicalFacets.provinces.forEach((province) => push(`${baseUrl}/jobs/provinces/${province}`, '0.8', 'daily'));
  canonicalFacets.cities.forEach((city) => push(`${baseUrl}/jobs/cities/${city}`, '0.8', 'daily'));
  canonicalFacets.categories.forEach((cat) => push(`${baseUrl}/jobs/categories/${cat}`, '0.8', 'daily'));

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, updated_at, posted_at, status')
    .eq('status', 'active')
    .order('posted_at', { ascending: false })
    .limit(10000);

  jobs?.forEach((job) => {
    if (!job?.id) return;
    push(`${baseUrl}/job/${job.id}`, '0.8', 'weekly', safeDate(job.updated_at || job.posted_at));
  });

  const { data: companies } = await supabase
    .from('companies')
    .select('slug, updated_at, is_active')
    .eq('is_active', true)
    .not('slug', 'is', null)
    .limit(5000);

  companies?.forEach((company) => {
    if (!company?.slug) return;
    push(`${baseUrl}/company/${company.slug}`, '0.7', 'weekly', safeDate(company.updated_at));
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

  writeFileSync(resolve(outputPath), xml, 'utf-8');
  return { count: urls.length, outputPath };
}

generateSitemap()
  .then(({ count, outputPath: out }) => {
    console.log(`Generated sitemap with ${count} URLs at ${out}`);
  })
  .catch((err) => {
    console.error('Error generating sitemap:', err);
    process.exit(1);
  });
