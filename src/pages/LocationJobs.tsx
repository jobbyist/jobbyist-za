import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useJobs } from '@/hooks/useJobs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SEOHead, generateJobListSchema } from '@/components/SEOHead';
import { Search, MapPin, Wifi, Briefcase, Clock, ArrowRight, Building2, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatSalary } from '@/lib/countries';

const JOBS_PER_PAGE = 12;

const locations = {
  'johannesburg': {
    name: 'Johannesburg',
    description: 'Discover exciting career opportunities in Johannesburg, South Africa\'s financial hub',
    keywords: 'jobs in Johannesburg, Johannesburg careers, Joburg jobs, employment Johannesburg',
  },
  'pretoria': {
    name: 'Pretoria',
    description: 'Find your next role in Pretoria, the administrative capital of South Africa',
    keywords: 'jobs in Pretoria, Pretoria careers, Tshwane jobs, employment Pretoria',
  },
  'cape-town': {
    name: 'Cape Town',
    description: 'Explore job opportunities in Cape Town, South Africa\'s Mother City',
    keywords: 'jobs in Cape Town, Cape Town careers, Mother City jobs, employment Cape Town',
  },
  'durban': {
    name: 'Durban',
    description: 'Browse career opportunities in Durban, South Africa\'s busiest port city',
    keywords: 'jobs in Durban, Durban careers, KZN jobs, employment Durban',
  },
  'remote': {
    name: 'Remote',
    description: 'Find remote work opportunities you can do from anywhere in South Africa',
    keywords: 'remote jobs South Africa, work from home SA, remote careers, online jobs SA',
  },
};

type LocationKey = keyof typeof locations;

const LocationJobs = () => {
  const { location } = useParams<{ location: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [jobType, setJobType] = useState<string | undefined>(searchParams.get('type') || undefined);
  const [experienceLevel, setExperienceLevel] = useState<string | undefined>(searchParams.get('level') || undefined);
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Validate location
  const locationData = location && location in locations ? locations[location as LocationKey] : null;

  // For remote jobs, set isRemote filter, otherwise filter by location
  const isRemoteLocation = location === 'remote';
  
  const { jobs, loading, totalCount } = useJobs({
    country: 'ZA',
    search,
    location: isRemoteLocation ? undefined : locationData?.name,
    jobType: jobType === 'all' ? undefined : jobType,
    experienceLevel: experienceLevel === 'all' ? undefined : experienceLevel,
    isRemote: isRemoteLocation ? true : undefined,
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

  // Add structured data for job listings
  useEffect(() => {
    if (jobs.length > 0) {
      const existingScript = document.querySelector('script[type="application/ld+json"][data-jobs-list="true"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-jobs-list', 'true');
      script.textContent = JSON.stringify(generateJobListSchema(jobs));
      document.head.appendChild(script);

      return () => {
        const scriptToRemove = document.querySelector('script[type="application/ld+json"][data-jobs-list="true"]');
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [jobs]);

  // If invalid location, redirect to main jobs page
  if (!locationData) {
    return <Navigate to="/jobs" replace />;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (jobType && jobType !== 'all') params.set('type', jobType);
    if (experienceLevel && experienceLevel !== 'all') params.set('level', experienceLevel);
    params.set('page', '1');
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
        title={`${locationData.name} Jobs | Find Employment in ${locationData.name} | Jobbyist ZA`}
        description={locationData.description}
        canonicalUrl={`https://za.jobbyist.africa/jobs/${location}`}
        keywords={[locationData.keywords]}
        ogType="website"
      />
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12 gradient-brand text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                {isRemoteLocation ? <Wifi className="h-6 w-6" /> : <MapPin className="h-6 w-6" />}
                <Badge className="bg-background/20 text-primary-foreground border-primary-foreground/20">
                  {locationData.name}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Jobs in {locationData.name}
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-6">
                {locationData.description}
              </p>
              <div className="text-primary-foreground/80">
                <span className="font-semibold">{totalCount}</span> opportunities available
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search jobs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead/Principal</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearch('');
                    setJobType(undefined);
                    setExperienceLevel(undefined);
                    setSearchParams(new URLSearchParams());
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* Jobs List */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <Link to="/jobs">
                  <Button variant="outline">Browse All Jobs</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {jobs.map((job) => (
                    <Link
                      key={job.id}
                      to={`/job/${job.id}`}
                      className="block group"
                    >
                      <div className="border rounded-lg p-6 h-full hover:shadow-lg transition-all bg-card">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Building2 className="h-4 w-4" />
                              <span className="line-clamp-1">{job.company?.name || 'Company'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location || 'Remote'}</span>
                          </div>
                          {job.salary_min && job.salary_max && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <DollarSign className="h-4 w-4" />
                              <span>{formatSalary(job.salary_min, job.salary_max, 'ZAR')}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{job.job_type || 'Full Time'}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.is_remote && (
                            <Badge variant="secondary">
                              <Wifi className="h-3 w-3 mr-1" />
                              Remote
                            </Badge>
                          )}
                          {job.experience_level && (
                            <Badge variant="outline">{job.experience_level}</Badge>
                          )}
                        </div>

                        <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                          View Details
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={!hasPrevPage}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
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
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={!hasNextPage}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LocationJobs;
