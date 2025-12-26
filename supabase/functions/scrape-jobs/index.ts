const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobData {
  title: string;
  company: string;
  location: string;
  description: string;
  job_type: string;
  salary?: string;
  url: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { country } = await req.json();
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Import Supabase client
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Define job search URLs by country
    const searchQueries: Record<string, string[]> = {
      ZA: [
        'site:careers24.com jobs south africa',
        'site:pnet.co.za jobs',
        'site:indeed.co.za jobs',
      ],
      NG: [
        'site:jobberman.com jobs nigeria',
        'site:myjobmag.com jobs nigeria',
        'site:hotnigerianjobs.com jobs',
      ],
      KE: [
        'site:brightermonday.co.ke jobs kenya',
        'site:fuzu.com jobs kenya',
      ],
    };

    const queries = searchQueries[country] || searchQueries['ZA'];
    let jobsCreated = 0;

    for (const query of queries) {
      console.log(`Searching: ${query}`);
      
      // Use Firecrawl search API
      const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          limit: 30,
          scrapeOptions: { formats: ['markdown'] },
        }),
      });

      const searchData = await searchResponse.json();
      
      if (!searchData.success || !searchData.data) {
        console.log(`No results for query: ${query}`);
        continue;
      }

      // Process each result
      for (const result of searchData.data) {
        try {
          // Extract job info from the scraped content
          const title = result.title || 'Untitled Position';
          const description = result.markdown?.slice(0, 2000) || result.description || '';
          const sourceUrl = result.url;
          
          // Parse company name from title or URL
          const companyMatch = title.match(/at\s+(.+?)(?:\s*[-|]|$)/i);
          const companyName = companyMatch?.[1]?.trim() || 'Unknown Company';
          
          // Create or find company
          const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          
          let { data: company } = await supabase
            .from('companies')
            .select('id')
            .eq('slug', slug)
            .maybeSingle();
          
          if (!company) {
            const { data: newCompany } = await supabase
              .from('companies')
              .insert({
                name: companyName,
                slug,
                country,
                is_active: true,
              })
              .select('id')
              .single();
            company = newCompany;
          }

          if (!company) continue;

          // Check for duplicate
          const { data: existing } = await supabase
            .from('jobs')
            .select('id')
            .eq('source_url', sourceUrl)
            .maybeSingle();

          if (existing) continue;

          // Insert job
          const { error: jobError } = await supabase.from('jobs').insert({
            company_id: company.id,
            title: title.split(/[-|]/)[0].trim().slice(0, 200),
            description,
            job_type: 'Full-time',
            location: country === 'ZA' ? 'South Africa' : country === 'NG' ? 'Nigeria' : 'Kenya',
            country,
            source_url: sourceUrl,
            source_name: new URL(sourceUrl).hostname.replace('www.', ''),
            status: 'active',
            skills: [],
            benefits: [],
          });

          if (!jobError) {
            jobsCreated++;
          }
        } catch (err) {
          console.error('Error processing job:', err);
        }
      }
    }

    console.log(`Scraping complete. Created ${jobsCreated} jobs for ${country}`);

    return new Response(
      JSON.stringify({ success: true, jobsCreated, country }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Scraper error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
