import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useJobs } from '@/hooks/useJobs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SEOHead } from '@/components/SEOHead';
import { Search, MapPin, Wifi, Briefcase, Clock, ArrowRight, Building2, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatSalary } from '@/lib/countries';

const JOBS_PER_PAGE = 12;

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [jobType, setJobType] = useState<string | undefined>(searchParams.get('type') || undefined);
  const [experienceLevel, setExperienceLevel] = useState<string | undefined>(searchParams.get('level') || undefined);
  const [isRemote, setIsRemote] = useState(searchParams.get('remote') === 'true');
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 200000]);
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Fetch SA jobs + remote jobs that South Africans can apply for
  const { jobs, loading, totalCount } = useJobs({
    country: 'ZA',
    search,
    jobType: jobType === 'all' ? undefined : jobType,
    experienceLevel: experienceLevel === 'all' ? undefined : experienceLevel,
    isRemote: isRemote ? true : undefined,
    salaryMin: salaryRange[0] > 0 ? salaryRange[0] : undefined,
    salaryMax: salaryRange[1] < 200000 ? salaryRange[1] : undefined,
    limit: JOBS_PER_PAGE,
    offset: (currentPage - 1) * JOBS_PER_PAGE,
  });

  const totalPages = Math.ceil(totalCount / JOBS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (jobType && jobType !== 'all') params.set('type', jobType);
    if (experienceLevel && experienceLevel !== 'all') params.set('level', experienceLevel);
    if (isRemote) params.set('remote', 'true');
    params.set('page', '1'); // Reset to page 1 on new search
    setSearchParams(params);
  };

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `?${params.toString()}`;
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Jobs in South Africa${currentPage > 1 ? ` - Page ${currentPage}` : ''} | Find SA Job Opportunities | Jobbyist`}
        description={`Browse ${totalCount}+ verified job opportunities in South Africa. Find full-time, part-time, remote & contract jobs in Johannesburg, Cape Town, Durban & more.`}
        canonicalUrl={`https://jobbyist.co.za/jobs${currentPage > 1 ? `?page=${currentPage}` : ''}`}
        keywords={['jobs South Africa', 'SA jobs', 'Johannesburg jobs', 'Cape Town jobs', 'Durban jobs', 'remote jobs SA', 'IT jobs South Africa', 'finance jobs SA']}
      />
      {hasPrevPage && (
        <link rel="prev" href={`https://jobbyist.co.za/jobs${getPageUrl(currentPage - 1)}`} />
      )}
      {hasNextPage && (
        <link rel="next" href={`https://jobbyist.co.za/jobs${getPageUrl(currentPage + 1)}`} />
      )}
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Jobs in <span className="gradient-brand-text">South Africa</span>
            </h1>
            <p className="text-muted-foreground">
              Explore {totalCount}+ curated job opportunities across South Africa
              {currentPage > 1 && ` - Page ${currentPage} of ${totalPages}`}
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-card rounded-xl p-6 border mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="Job title, skills, or company"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button type="submit">Search Jobs</Button>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <Select value={jobType || 'all'} onValueChange={(v) => setJobType(v === 'all' ? undefined : v)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={experienceLevel || 'all'} onValueChange={(v) => setExperienceLevel(v === 'all' ? undefined : v)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Entry Level">Entry Level</SelectItem>
                    <SelectItem value="Mid Level">Mid Level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <Slider
                      value={salaryRange}
                      onValueChange={(value) => setSalaryRange(value as [number, number])}
                      min={0}
                      max={200000}
                      step={5000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{salaryRange[0] > 0 ? `R${salaryRange[0].toLocaleString()}` : 'Any'}</span>
                      <span>{salaryRange[1] < 200000 ? `R${salaryRange[1].toLocaleString()}` : 'Any'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remote"
                    checked={isRemote}
                    onCheckedChange={(checked) => setIsRemote(!!checked)}
                  />
                  <label htmlFor="remote" className="text-sm font-medium cursor-pointer flex items-center gap-1">
                    <Wifi className="h-4 w-4" />
                    Remote Only
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Job Listings */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-xl p-6 border animate-pulse">
                  <div className="flex gap-4 mb-4">
                    <div className="w-12 h-12 bg-muted rounded-lg" />
                    <div className="flex-1">
                      <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search filters or check back later for new opportunities.
              </p>
              <Button variant="outline" onClick={() => {
                setSearch('');
                setJobType(undefined);
                setExperienceLevel(undefined);
                setIsRemote(false);
                setSalaryRange([0, 200000]);
                setSearchParams({});
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/job/${job.id}`}
                  className="group bg-card rounded-xl p-6 border hover:border-primary/20 hover:shadow-xl transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {job.company?.logo_url ? (
                        <img src={job.company.logo_url} alt={job.company.name} className="w-8 h-8 object-contain" />
                      ) : (
                        <Building2 className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{job.company?.name}</p>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{job.location}</span>
                    </div>
                    {job.is_remote && (
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Wifi className="h-3 w-3" />
                        <span>Remote OK</span>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="text-xs">{job.job_type}</Badge>
                    {job.experience_level && (
                      <Badge variant="outline" className="text-xs">{job.experience_level}</Badge>
                    )}
                  </div>

                  {/* Salary */}
                  {job.salary_min && job.salary_max && (
                    <p className="text-sm font-semibold gradient-brand-text mb-3">
                      {formatSalary(job.salary_min, job.country)} - {formatSalary(job.salary_max, job.country)}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  {/* Skills */}
                  {job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="text-xs px-2 py-1 bg-muted rounded-md">
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{job.skills.length - 3} more</span>
                      )}
                    </div>
                  )}

                  {/* Posted time */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Posted {new Date(job.posted_at).toLocaleDateString()}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && jobs.length > 0 && (
            <div className="mt-12 flex flex-col items-center gap-6">
              {/* Page Navigation */}
              <div className="flex items-center gap-2">
                {hasPrevPage && (
                  <>
                    <Link to={getPageUrl(1)} className="inline-flex">
                      <Button variant="outline" size="sm">
                        First
                      </Button>
                    </Link>
                    <Link to={getPageUrl(currentPage - 1)} className="inline-flex">
                      <Button variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                    </Link>
                  </>
                )}
                
                <div className="flex items-center gap-2 mx-2">
                  {/* Show page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Link key={pageNum} to={getPageUrl(pageNum)} className="inline-flex">
                        <Button
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          className="min-w-[40px]"
                        >
                          {pageNum}
                        </Button>
                      </Link>
                    );
                  })}
                </div>

                {hasNextPage && (
                  <>
                    <Link to={getPageUrl(currentPage + 1)} className="inline-flex">
                      <Button variant="outline" size="sm">
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                    <Link to={getPageUrl(totalPages)} className="inline-flex">
                      <Button variant="outline" size="sm">
                        Last
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Load More Button (Alternative approach for infinite scroll) */}
              {hasNextPage && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Showing {(currentPage - 1) * JOBS_PER_PAGE + 1} - {Math.min(currentPage * JOBS_PER_PAGE, totalCount)} of {totalCount} jobs
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => goToPage(currentPage + 1)}
                    className="min-w-[200px]"
                  >
                    Load More Jobs
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
