import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  const baseUrl = 'https://jobbyist.co.za';
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
  xml += 'xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" ';
  xml += 'xmlns:xhtml="http://www.w3.org/1999/xhtml" ';
  xml += 'xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" ';
  xml += 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" ';
  xml += 'xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';

  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/jobs', priority: '0.9', changefreq: 'daily' },
    { url: '/companies', priority: '0.8', changefreq: 'weekly' },
    { url: '/auth', priority: '0.5', changefreq: 'monthly' },
    { url: '/pro', priority: '0.7', changefreq: 'monthly' },
  ];

  staticPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  // Fetch all active jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, updated_at, posted_at')
    .eq('status', 'active')
    .order('posted_at', { ascending: false })
    .limit(5000);

  if (jobs) {
    jobs.forEach(job => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/job/${job.id}</loc>\n`;
      xml += `    <lastmod>${new Date(job.updated_at || job.posted_at).toISOString().split('T')[0]}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    });
  }

  // Fetch all companies
  const { data: companies } = await supabase
    .from('companies')
    .select('slug, updated_at')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (companies) {
    companies.forEach(company => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/company/${company.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(company.updated_at).toISOString().split('T')[0]}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    });
  }

  xml += '</urlset>';

  return xml;
}

// Run the generator
generateSitemap()
  .then(sitemap => {
    console.log(sitemap);
  })
  .catch(err => {
    console.error('Error generating sitemap:', err);
    process.exit(1);
  });
