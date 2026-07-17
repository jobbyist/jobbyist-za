import { UpworkJob } from '@/types/upwork';

/**
 * Server-side utility to fetch Upwork job listings using a data aggregator.
 * This function runs exclusively on the server and securely accesses the SCRAPER_API_KEY.
 * 
 * @param query - Search query for Upwork jobs (e.g., "React Developer")
 * @returns Array of UpworkJob objects
 */
export async function getJobs(query: string = 'React Developer'): Promise<UpworkJob[]> {
  // Ensure this only runs on the server
  if (typeof window !== 'undefined') {
    throw new Error('getJobs() can only be called on the server');
  }

  const scraperApiKey = process.env.SCRAPER_API_KEY;
  
  if (!scraperApiKey) {
    console.error('SCRAPER_API_KEY is not configured');
    return [];
  }

  try {
    const targetUrl = `https://upwork.com${query}`;
    const aggregatorUrl = `https://netrows.com?apikey=${scraperApiKey}&url=${encodeURIComponent(targetUrl)}`;
    
    // Use Next.js fetch with caching to optimize API credit consumption
    // Cache results for 30 minutes (1800 seconds)
    const response = await fetch(aggregatorUrl, {
      next: { revalidate: 1800 }
    });

    if (!response.ok) {
      console.error(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    
    // Parse and safely map results to UpworkJob interface with fallback values
    const jobs: UpworkJob[] = Array.isArray(data) ? data.map((item: any, index: number) => ({
      id: item.id?.toString() || `job-${index}-${Date.now()}`,
      title: item.title || item.name || 'Untitled Job',
      description: item.description || item.summary || 'No description available',
      budget: item.budget || item.price || item.rate || 'Budget not specified',
      jobUrl: item.url || item.link || item.jobUrl || targetUrl
    })) : [];

    return jobs;
  } catch (error) {
    console.error('Error fetching Upwork jobs:', error);
    return [];
  }
}

// Export type for convenience
export type { UpworkJob };
