import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useJobs } from '@/hooks/useJobs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Search, MapPin, Wifi, Briefcase, Clock, ArrowRight, Building2 } from 'lucide-react';
import { activeCountries, formatSalary, type CountryCode } from '@/lib/countries';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [country, setCountry] = useState<CountryCode | undefined>(
    (searchParams.get('country') as CountryCode) || undefined
  );
  const [jobType, setJobType] = useState<string | undefined>(searchParams.get('type') || undefined);
  const [experienceLevel, setExperienceLevel] = useState<string | undefined>(searchParams.get('level') || undefined);
  const [isRemote, setIsRemote] = useState(searchParams.get('remote') === 'true');

  const { jobs, loading } = useJobs({
    country,
    search,
    jobType: jobType === 'all' ? undefined : jobType,
    experienceLevel: experienceLevel === 'all' ? undefined : experienceLevel,
    isRemote: isRemote ? true : undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (country) params.set('country', country);
    if (jobType && jobType !== 'all') params.set('type', jobType);
    if (experienceLevel && experienceLevel !== 'all') params.set('level', experienceLevel);
    if (isRemote) params.set('remote', 'true');
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Find Your Next <span className="gradient-brand-text">Opportunity</span>
            </h1>
            <p className="text-muted-foreground">
              Explore {jobs.length}+ curated job opportunities across Africa
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
                <Select value={country || 'all'} onValueChange={(v) => setCountry(v === 'all' ? undefined : v as CountryCode)}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {activeCountries.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    <SelectItem value="Entry">Entry Level</SelectItem>
                    <SelectItem value="Mid">Mid Level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>

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
                setCountry(undefined);
                setJobType(undefined);
                setExperienceLevel(undefined);
                setIsRemote(false);
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
                  to={`/jobs/${job.id}`}
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
