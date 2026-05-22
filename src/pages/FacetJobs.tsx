import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useJobs } from "@/hooks/useJobs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead, generateBreadcrumbSchema, generateJobListSchema } from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, MapPin, Wifi, Briefcase } from "lucide-react";
import {
  provinces,
  majorCities,
  categories as facetCategories,
  jobTypes as facetJobTypes,
  slugify,
  provinceFromSlug,
  cityFromSlug,
  jobTypeFromSlug,
  categoryFromSlug,
  provinceForCity,
  getFacetTitle,
  getFacetDescription,
  getFacetPath,
  getFacetIntro,
} from "@/lib/seoFacets";
import { generateCanonicalUrl } from "@/lib/utils";
import SponsoredBannerSlot from "@/components/SponsoredBannerSlot";

type FacetMode = "province" | "city" | "type" | "category" | "combo";

interface Props {
  mode: FacetMode;
}

const FacetJobs = ({ mode }: Props) => {
  const params = useParams<{
    province?: string;
    city?: string;
    type?: string;
    category?: string;
    location?: string;
    jobType?: string;
  }>();

  // Resolve facet values from slugs
  const province = params.province ? provinceFromSlug(params.province) : undefined;
  const city =
    mode === "combo" && params.location
      ? cityFromSlug(params.location)
      : params.city
      ? cityFromSlug(params.city)
      : undefined;
  const jobType =
    mode === "combo" && params.jobType
      ? jobTypeFromSlug(params.jobType)
      : params.type
      ? jobTypeFromSlug(params.type)
      : undefined;
  const category = params.category ? categoryFromSlug(params.category) : undefined;

  const isRemote = jobType === "Remote" || jobType === "Telecommute" ? true : undefined;
  const locationFilter = city || province;
  const searchFilter = category;

  const { jobs, totalCount, loading } = useJobs({
    country: "ZA",
    search: searchFilter,
    location: locationFilter && !isRemote ? locationFilter : undefined,
    isRemote,
    jobType: jobType && !["Remote", "Telecommute", "Hybrid"].includes(jobType) ? jobType : undefined,
    limit: 30,
  });

  const facetParams = { province, city, jobType, category };
  const path = getFacetPath(facetParams);
  const canonical = generateCanonicalUrl(path);
  const title = getFacetTitle(facetParams);
  const description = getFacetDescription(facetParams, totalCount);
  const intro = getFacetIntro(facetParams);
  const h1 = title.replace(" | Jobbyist ZA", "");

  const breadcrumbs = useMemo(() => {
    const crumbs = [
      { name: "Home", url: generateCanonicalUrl("/") },
      { name: "Jobs", url: generateCanonicalUrl("/jobs") },
    ];
    if (province) crumbs.push({ name: province, url: generateCanonicalUrl(`/jobs/provinces/${slugify(province)}`) });
    if (city) crumbs.push({ name: city, url: generateCanonicalUrl(`/jobs/cities/${slugify(city)}`) });
    if (jobType) crumbs.push({ name: jobType, url: generateCanonicalUrl(`/jobs/types/${slugify(jobType)}`) });
    if (category) crumbs.push({ name: category, url: generateCanonicalUrl(`/jobs/categories/${slugify(category)}`) });
    return crumbs;
  }, [province, city, jobType, category]);

  const structuredData = useMemo(() => {
    const list: object[] = [generateBreadcrumbSchema(breadcrumbs)];
    if (jobs.length) {
      list.push(generateJobListSchema(jobs as any));
    }
    return list;
  }, [breadcrumbs, jobs]);

  // Low-quality facet guard: no province/city + 0 jobs => noindex
  const lowQuality = totalCount === 0 && !category;

  // Related facets for internal linking
  const relatedFacets = useMemo(() => {
    const items: { name: string; href: string }[] = [];
    if (city) {
      const prov = province || provinceForCity(city);
      if (prov) {
        majorCities[prov]
          .filter((c) => c !== city)
          .slice(0, 5)
          .forEach((c) => items.push({ name: `Jobs in ${c}`, href: `/jobs/cities/${slugify(c)}` }));
      }
    } else if (province) {
      majorCities[province].slice(0, 5).forEach((c) =>
        items.push({ name: `Jobs in ${c}`, href: `/jobs/cities/${slugify(c)}` })
      );
    }
    if (category) {
      facetJobTypes.slice(0, 4).forEach((t) =>
        items.push({ name: `${t} ${category} jobs`, href: `/jobs/types/${slugify(t)}` })
      );
    } else {
      facetCategories.slice(0, 6).forEach((c) =>
        items.push({ name: `${c} jobs`, href: `/jobs/categories/${slugify(c)}` })
      );
    }
    return items;
  }, [province, city, category]);

  useEffect(() => { window.scrollTo(0, 0); }, [path]);

  return (
    <div className="suite-page-shell">
      <SEOHead
        title={title}
        description={description}
        canonicalUrl={canonical}
        keywords={[city, province, jobType, category, "South Africa", "Jobbyist ZA"].filter(Boolean) as string[]}
        structuredData={structuredData}
        noindex={lowQuality}
      />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <nav className="text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
            {breadcrumbs.map((c, i) => (
              <span key={c.url}>
                {i > 0 && " / "}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-foreground">{c.name}</span>
                ) : (
                  <Link to={c.url.replace(generateCanonicalUrl(""), "")} className="hover:text-foreground">
                    {c.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-3">
              {jobType && <Badge>{jobType}</Badge>}
              {category && <Badge variant="secondary">{category}</Badge>}
              {(city || province) && <Badge variant="outline">{city || province}</Badge>}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">{h1}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">{intro}</p>
            {totalCount > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {totalCount} active {totalCount === 1 ? "role" : "roles"} • Updated daily
              </p>
            )}
          </header>

          {/* Sponsored banner after header */}
          <SponsoredBannerSlot slotKey="category_top" />

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-40 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <Card className="p-10 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h2 className="text-xl font-semibold mb-2">No matching jobs right now</h2>
              <p className="text-muted-foreground mb-4">
                New South African listings are added every 24 hours. Try a broader filter or browse all jobs.
              </p>
              <Link to="/jobs"><Button>Browse all jobs</Button></Link>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <Link key={job.id} to={`/job/${job.id}`} className="group">
                  <Card className="p-5 h-full hover:border-primary/30 hover:shadow-md transition">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {job.company?.logo_url ? (
                          <img src={job.company.logo_url} alt={job.company.name} loading="lazy" decoding="async" className="w-7 h-7 object-contain" />
                        ) : (
                          <Building2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold line-clamp-2 group-hover:text-primary">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company?.name}</p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mb-2">
                      <MapPin className="h-3 w-3" /> {job.location}
                      {job.is_remote && (
                        <span className="text-primary flex items-center gap-1">
                          <Wifi className="h-3 w-3" /> Remote
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                    <div className="mt-3 text-sm text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      View role <ArrowRight className="h-3 w-3" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {relatedFacets.length > 0 && (
            <section className="mt-14">
              <h2 className="text-xl font-semibold mb-4">Related searches</h2>
              <div className="flex flex-wrap gap-2">
                {relatedFacets.map((f) => (
                  <Link key={f.href} to={f.href}>
                    <Badge variant="secondary" className="cursor-pointer">{f.name}</Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Browse by province</h2>
            <div className="flex flex-wrap gap-2">
              {provinces.map((p) => (
                <Link key={p} to={`/jobs/provinces/${slugify(p)}`}>
                  <Badge variant={p === province ? "default" : "outline"} className="cursor-pointer">{p}</Badge>
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

export default FacetJobs;
