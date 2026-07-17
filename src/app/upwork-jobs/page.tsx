import { getJobs } from '@/lib/getJobs';
import JobCard from '@/components/JobCard';

/**
 * Server Component that pre-fetches Upwork job listings
 * and renders them in a responsive grid layout.
 */
export default async function UpworkJobsPage() {
  // Pre-fetch jobs on the server with an initial query
  const jobs = await getJobs('React Developer');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Upwork Job Listings</h1>
      <p className="text-muted-foreground mb-8">Find your next React Developer opportunity</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      
      {jobs.length === 0 && <p className="text-center text-muted-foreground">No jobs found. Please try again later.</p>}
    </div>
  );
}
