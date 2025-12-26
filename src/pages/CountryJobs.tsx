import { useState, useMemo } from 'react';
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
import { SEOHead, generateJobSearchSchema } from '@/components/SEOHead';
import { Search, MapPin, Wifi, Briefcase, Clock, ArrowRight, Building2, DollarSign, ChevronRight } from 'lucide-react';
import { countries, formatSalary, type CountryCode } from '@/lib/countries';

const CountryJobs = () => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Validate country code
  const country = useMemo(() => {
    if (!countryCode) return null;
    const code = countryCode.toUpperCase() as CountryCode;
    return countries.find(c => c.code === code);
  }, [countryCode]);

  // If invalid country, redirect to main jobs page
  if (!country) {
    return <Navigate to="/jobs" replace />;
  }

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [jobType, setJobType] = useState<string | undefined>(searchParams.get('type') || undefined);
  const [experienceLevel, setExperienceLevel] = useState<string | undefined>(searchParams.get('level') || undefined);
  const [isRemote, setIsRemote] = useState(searchParams.get('remote') === 'true');
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 200000]);

  const { jobs, loading } = useJobs({
    country: country.code,
    search,
    jobType: jobType === 'all' ? undefined : jobType,
    experienceLevel: experienceLevel === 'all' ? undefined : experienceLevel,
    isRemote: isRemote ? true : undefined,
    salaryMin: salaryRange[0] > 0 ? salaryRange[0] : undefined,
    salaryMax: salaryRange[1] < 200000 ? salaryRange[1] : undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (jobType && jobType !== 'all') params.set('type', jobType);
    if (experienceLevel && experienceLevel !== 'all') params.set('level', experienceLevel);
    if (isRemote) params.set('remote', 'true');
    setSearchParams(params);
  };

  // SEO metadata
  const pageTitle = `${country.name} Jobs - Find ${jobs.length}+ Opportunities | Jobbyist Africa`;
  const pageDescription = `Discover ${jobs.length}+ job vacancies in ${country.name}. Browse full-time, part-time, remote and contract positions from top ${country.name} employers. Apply today!`;
  const canonicalUrl = `https://jobbyist.co.za/jobs/${country.code.toLowerCase()}`;
  const keywords = [
    `jobs in ${country.name}`,
    `${country.name} vacancies`,
    `${country.name} careers`,
    `employment ${country.name}`,
    `work in ${country.name}`,
    `${country.name} job listings`,
    'African jobs',
    'Jobbyist Africa',
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={canonicalUrl}
        keywords={keywords}
        structuredData={generateJobSearchSchema(country, jobs.length)}
      />
      
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              </li>
              <ChevronRight className="h-4 w-4" />
              <li>
                <Link to="/jobs" className="hover:text-foreground transition-colors">Jobs</Link>
              </li>
              <ChevronRight className="h-4 w-4" />
              <li aria-current="page" className="text-foreground font-medium">
                {country.flag} {country.name}
              </li>
            </ol>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Jobs in <span className="gradient-brand-text">{country.flag} {country.name}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore {jobs.length}+ curated job opportunities in {country.name}
            </p>
          </header>

          {/* Search & Filters */}
          <section aria-label="Job search filters" className="bg-card rounded-xl p-6 border mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="Job title, skills, or company"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search jobs"
                  />
                </div>
                <Button type="submit">Search Jobs</Button>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <Select value={jobType || 'all'} onValueChange={(v) => setJobType(v === 'all' ? undefined : v)}>
                  <SelectTrigger className="w-40" aria-label="Filter by job type">
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
                  <SelectTrigger className="w-40" aria-label="Filter by experience level">
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
                      aria-label="Filter by salary range"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{salaryRange[0] > 0 ? `${country.currencySymbol}${salaryRange[0].toLocaleString()}` : 'Any'}</span>
                      <span>{salaryRange[1] < 200000 ? `${country.currencySymbol}${salaryRange[1].toLocaleString()}` : 'Any'}</span>
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
          </section>

          {/* Job Listings */}
          <section aria-label="Job listings">
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
                <h2 className="text-xl font-semibold mb-2">No jobs found in {country.name}</h2>
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
                  <article key={job.id} className="group">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="block bg-card rounded-xl p-6 border hover:border-primary/20 hover:shadow-xl transition-all duration-300"
                    >
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          {job.company?.logo_url ? (
                            <img 
                              src={job.company.logo_url} 
                              alt={`${job.company.name} logo`} 
                              className="w-8 h-8 object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <Building2 className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                            {job.title}
                          </h2>
                          <p className="text-sm text-muted-foreground">{job.company?.name}</p>
                        </div>
                      </div>

                      {/* Meta info */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" aria-hidden="true" />
                          <span>{job.location}</span>
                        </div>
                        {job.is_remote && (
                          <div className="flex items-center gap-1 text-xs text-primary">
                            <Wifi className="h-3 w-3" aria-hidden="true" />
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
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          <time dateTime={job.posted_at}>
                            Posted {new Date(job.posted_at).toLocaleDateString()}
                          </time>
                        </div>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Other Countries Section */}
          <section aria-label="Browse jobs in other countries" className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Explore Jobs in Other Countries</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {countries
                .filter(c => c.isActive && c.code !== country.code)
                .map((c) => (
                  <Link
                    key={c.code}
                    to={`/jobs/${c.code.toLowerCase()}`}
                    className="flex items-center gap-3 p-4 bg-card rounded-lg border hover:border-primary/20 hover:shadow-md transition-all"
                  >
                    <span className="text-2xl">{c.flag}</span>
                    <span className="font-medium">{c.name}</span>
                  </Link>
                ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CountryJobs;
