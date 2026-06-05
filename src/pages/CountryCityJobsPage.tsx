import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SEOHead, generateBreadcrumbSchema } from '@/components/SEOHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Building2,
  ChevronRight,
  Clock,
  MapPin,
  Search,
  TrendingUp,
  Users,
  Wifi,
} from 'lucide-react';
import {
  fetchProgrammaticPageData,
  formatProgrammaticSalary,
  type ProgrammaticPageData,
  type ProgrammaticSeoJob,
} from '@/lib/programmaticSeoData';
import { getProgrammaticCategory, getProgrammaticCity } from '@/lib/categories';
import { formatDistanceToNow } from 'date-fns';

const MIN_INDEXABLE_JOBS = 3;

const formatPostedDate = (date?: string | null) => {
  if (!date) return 'Recently posted';
  try {
    return `${formatDistanceToNow(new Date(date), { addSuffix: true })}`;
  } catch {
    return 'Recently posted';
  }
};

const formatSalaryRange = (job: ProgrammaticSeoJob) => {
  if (typeof job.salary_min === 'number' && typeof job.salary_max === 'number') {
    return `${formatProgrammaticSalary(job.salary_min)} - ${formatProgrammaticSalary(job.salary_max)}`;
  }
  if (typeof job.salary_min === 'number') return `From ${formatProgrammaticSalary(job.salary_min)}`;
  if (typeof job.salary_max === 'number') return `Up to ${formatProgrammaticSalary(job.salary_max)}`;
  return null;
};

const ProgrammaticJobCard = ({ job }: { job: ProgrammaticSeoJob }) => {
  const salary = formatSalaryRange(job);

  return (
    <Link to={`/jobs/${job.id}`} className="group block h-full">
      <Card className="h-full p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            {job.company?.logo_url ? (
              <img
                src={job.company.logo_url}
                alt={`${job.company.name || 'Company'} logo`}
                className="h-8 w-8 object-contain"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <Building2 className="h-6 w-6 text-primary" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-lg font-semibold leading-snug group-hover:text-primary">
              {job.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{job.company?.name || 'Confidential Company'}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="gap-1">
            <MapPin className="h-3 w-3" />
            {job.location}
          </Badge>
          <Badge variant="secondary">{job.job_type}</Badge>
          {job.is_remote && (
            <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/20">
              <Wifi className="h-3 w-3" /> Remote
            </Badge>
          )}
        </div>

        {salary && <p className="mt-4 font-semibold text-primary">{salary}</p>}

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {job.description}
        </p>

        {Array.isArray(job.skills) && job.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.skills.slice(0, 4).map((skill) => (
              <span key={skill} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatPostedDate(job.posted_at)}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-primary">
            View job <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </div>
      </Card>
    </Link>
  );
};

const CountryCityJobsPage = () => {
  const { category, city } = useParams<{ category: string; city: string }>();
  const categoryConfig = getProgrammaticCategory(category);
  const cityConfig = getProgrammaticCity(city);
  const [data, setData] = useState<ProgrammaticPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchProgrammaticPageData(category, city)
      .then((result) => {
        if (!isMounted) return;
        setData(result);
      })
      .catch((err) => {
        console.error('Programmatic SEO page failed to load', err);
        if (isMounted) setError('Could not load matching jobs. Please try again shortly.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [category, city]);

  const pageTitle = useMemo(() => {
    const role = data?.category.name || categoryConfig?.name || 'Jobs';
    const place = data?.city.name || cityConfig?.name || 'South Africa';
    const count = data?.totalJobs ?? 0;
    return `${role} Jobs in ${place} (${count} open roles) | Jobbyist`;
  }, [data, categoryConfig, cityConfig]);

  const pageDescription = useMemo(() => {
    const role = data?.category.name || categoryConfig?.name || 'jobs';
    const place = data?.city.name || cityConfig?.name || 'South Africa';
    const count = data?.totalJobs ?? 0;
    const salary = data?.averageSalary ? ` Average salary is around ${formatProgrammaticSalary(data.averageSalary)}.` : '';
    return `Browse ${count} ${role.toLowerCase()} jobs in ${place}. See live roles, hiring companies, salary insights and related job categories on Jobbyist.${salary}`;
  }, [data, categoryConfig, cityConfig]);

  if (!categoryConfig || !cityConfig) {
    return <Navigate to="/jobs" replace />;
  }

  const canonicalUrl = `https://za.jobbyist.africa/jobs/${categoryConfig.slug}/${cityConfig.slug}`;
  const noindex = !loading && (!data || data.totalJobs < MIN_INDEXABLE_JOBS);
  const structuredData = data
    ? [
        generateBreadcrumbSchema([
          { name: 'Home', url: 'https://za.jobbyist.africa/' },
          { name: 'Jobs', url: 'https://za.jobbyist.africa/jobs' },
          { name: data.category.name, url: `https://za.jobbyist.africa/jobs/category/${data.category.slug}` },
          { name: `${data.category.name} jobs in ${data.city.name}`, url: canonicalUrl },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: pageTitle,
          description: pageDescription,
          url: canonicalUrl,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: data.totalJobs,
            itemListElement: data.topJobs.map((job, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `https://za.jobbyist.africa/job/${job.id}`,
              name: job.title,
            })),
          },
        },
      ]
    : undefined;

  return (
    <div className="suite-page-shell">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={canonicalUrl}
        keywords={[categoryConfig.name, cityConfig.name, `${categoryConfig.name} jobs ${cityConfig.name}`, 'South Africa jobs']}
        noindex={noindex}
        structuredData={structuredData}
      />
      <Navbar />

      <main className="pt-24 pb-16">
        <section className="border-b bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12">
          <div className="container mx-auto px-4">
            <nav className="mb-6 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link> /{' '}
              <Link to="/jobs" className="hover:text-foreground">Jobs</Link> /{' '}
              <span className="text-foreground">{categoryConfig.name} in {cityConfig.name}</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <Badge className="mb-4 gap-1">
                  <MapPin className="h-3 w-3" />
                  {cityConfig.name}{cityConfig.province ? `, ${cityConfig.province}` : ''}
                </Badge>
                <h1 className="max-w-4xl text-3xl font-bold tracking-tight md:text-5xl">
                  {categoryConfig.name} Jobs in {cityConfig.name}{' '}
                  <span className="gradient-brand-text">({data?.totalJobs ?? 0} open roles)</span>
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                  {categoryConfig.description} Browse live roles, hiring companies and salary insights for {cityConfig.name}.
                </p>
              </div>

              <Card className="p-5 shadow-lg">
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Page insights</p>
                <div className="mt-4 grid gap-3">
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                    <span className="inline-flex items-center gap-2 text-sm"><Search className="h-4 w-4" /> Jobs found</span>
                    <strong>{data?.totalJobs ?? 0}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                    <span className="inline-flex items-center gap-2 text-sm"><TrendingUp className="h-4 w-4" /> Avg salary</span>
                    <strong>{formatProgrammaticSalary(data?.averageSalary ?? null)}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                    <span className="inline-flex items-center gap-2 text-sm"><Building2 className="h-4 w-4" /> Hiring companies</span>
                    <strong>{data?.topCompanies.length ?? 0}</strong>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-64 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : error ? (
            <Card className="p-10 text-center">
              <h2 className="text-xl font-semibold">Unable to load this jobs page</h2>
              <p className="mt-2 text-muted-foreground">{error}</p>
              <Button asChild className="mt-6"><Link to="/jobs">Browse all jobs</Link></Button>
            </Card>
          ) : !data || data.totalJobs < MIN_INDEXABLE_JOBS ? (
            <Card className="p-10 text-center">
              <h2 className="text-xl font-semibold">Not enough active jobs for this page yet</h2>
              <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                We only publish category and city landing pages when there are at least {MIN_INDEXABLE_JOBS} active jobs to avoid thin content. Browse broader results while this market grows.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild><Link to="/jobs">Browse all jobs</Link></Button>
                <Button asChild variant="outline"><Link to={`/jobs/category/${categoryConfig.slug}`}>Browse {categoryConfig.name} jobs</Link></Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
              <section>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Latest matching jobs</h2>
                    <p className="text-muted-foreground">Top {data.topJobs.length} of {data.totalJobs} active roles for this search.</p>
                  </div>
                  <Button asChild variant="outline" className="hidden sm:inline-flex">
                    <Link to={`/jobs?search=${encodeURIComponent(categoryConfig.name)}&location=${encodeURIComponent(cityConfig.name)}`}>
                      View all filters
                    </Link>
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {data.topJobs.map((job) => (
                    <ProgrammaticJobCard key={job.id} job={job} />
                  ))}
                </div>
              </section>

              <aside className="space-y-6">
                <Card className="p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Users className="h-5 w-5 text-primary" /> Top hiring companies</h2>
                  {data.topCompanies.length ? (
                    <div className="space-y-3">
                      {data.topCompanies.map((company) => (
                        <div key={company.id || company.name} className="flex items-center gap-3 rounded-xl border p-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            {company.logo_url ? <img src={company.logo_url} alt="" className="h-7 w-7 object-contain" /> : <Building2 className="h-5 w-5 text-primary" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{company.name}</p>
                            <p className="text-sm text-muted-foreground">{company.count} open role{company.count === 1 ? '' : 's'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Hiring company data will appear as listings are added.</p>
                  )}
                </Card>

                <Card className="p-5">
                  <h2 className="text-lg font-semibold">Related categories in {data.city.name}</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {data.relatedCategories.map((item) => (
                      <Link key={`${item.categorySlug}-${item.citySlug}`} to={`/jobs/${item.categorySlug}/${item.citySlug}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                          {item.categoryName} ({item.totalJobs})
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </Card>

                <Card className="p-5">
                  <h2 className="text-lg font-semibold">Top cities for {data.category.name}</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {data.relatedCities.map((item) => (
                      <Link key={`${item.categorySlug}-${item.citySlug}`} to={`/jobs/${item.categorySlug}/${item.citySlug}`}>
                        <Badge variant="secondary" className="cursor-pointer">
                          {item.cityName} ({item.totalJobs})
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </Card>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CountryCityJobsPage;
