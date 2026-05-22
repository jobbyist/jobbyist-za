import { useEffect, useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useJobs } from "@/hooks/useJobs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Briefcase, MapPin, Wifi, Building2 } from "lucide-react";
import { categories, getCategory, getLocation, locationSlugs } from "@/lib/categories";

const CategoryJobs = () => {
  const { category, location } = useParams<{ category: string; location?: string }>();
  const cat = getCategory(category);
  const loc = location ? getLocation(location) : undefined;
  const isInvalidCategory = !cat;
  const isInvalidLocation = !!location && !loc;

  const search = useMemo(() => (cat ? cat.keywords.join(" ") : ""), [cat]);

  const { jobs, totalCount, loading } = useJobs({
    country: "ZA",
    search,
    location: loc && loc.slug !== "remote" ? loc.name : undefined,
    isRemote: loc?.slug === "remote" ? true : undefined,
    limit: 30,
  });


  useEffect(() => {
    if (!cat || !jobs.length) return;
    // FAQ-only schema; JobPosting schema lives only on /job/:id detail pages (Google Jobs guideline).
    const faq = document.createElement("script");
    faq.type = "application/ld+json";
    faq.setAttribute("data-faq", "true");
    faq.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: `How many ${cat!.name} jobs are available${loc ? ` in ${loc.name}` : " in South Africa"}?`,
          acceptedAnswer: { "@type": "Answer", text: `Jobbyist lists ${totalCount}+ ${cat!.name} positions${loc ? ` in ${loc.name}` : " across SA"}, updated daily.` } },
        { "@type": "Question", name: `What is the average ${cat!.name} salary${loc ? ` in ${loc.name}` : " in South Africa"}?`,
          acceptedAnswer: { "@type": "Answer", text: `Salaries vary by experience; mid-level ${cat!.name} roles in SA typically range R30,000–R80,000 per month.` } },
        { "@type": "Question", name: `How do I apply for a ${cat!.name} job${loc ? ` in ${loc.name}` : ""}?`,
          acceptedAnswer: { "@type": "Answer", text: "Create a free Jobbyist profile, upload your CV, and apply directly from any listing." } },
      ],
    });
    document.head.appendChild(faq);
    return () => { faq.remove(); };
  }, [jobs, totalCount, cat, loc]);

  if (isInvalidCategory) return <Navigate to="/jobs" replace />;
  if (isInvalidLocation) return <Navigate to={`/jobs/category/${category}`} replace />;

  const title = loc
    ? `${cat!.name} Jobs in ${loc.name} | Jobbyist`
    : `${cat!.name} Jobs in South Africa | Jobbyist`;
  const description = loc
    ? `Browse ${totalCount}+ ${cat!.name.toLowerCase()} jobs in ${loc.name}. ${cat!.description}`
    : `Find ${totalCount}+ ${cat!.name.toLowerCase()} jobs across South Africa. ${cat!.description}`;
  const canonical = loc
    ? `https://za.jobbyist.africa/jobs/category/${cat!.slug}/${loc.slug}`
    : `https://za.jobbyist.africa/jobs/category/${cat!.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={title} description={description} canonicalUrl={canonical}
        keywords={[cat!.name, ...cat!.keywords, "South Africa", loc?.name || "SA jobs"]} />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <nav className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground">Home</Link> /{" "}
            <Link to="/jobs" className="hover:text-foreground">Jobs</Link> /{" "}
            <span className="text-foreground">{cat!.name}{loc && ` in ${loc.name}`}</span>
          </nav>

          <header className="mb-8">
            <Badge className="mb-3">{loc ? loc.name : "South Africa"}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              {cat!.name} Jobs {loc ? `in ${loc.name}` : "in South Africa"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {cat!.description} {loc ? `Updated daily for ${loc.name}-based and remote-friendly opportunities.` : "Updated daily across all major SA cities and remote roles."}
            </p>
          </header>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-muted rounded-lg animate-pulse" />)}
            </div>
          ) : jobs.length === 0 ? (
            <Card className="p-10 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h2 className="text-xl font-semibold mb-2">No {cat!.name} jobs right now</h2>
              <p className="text-muted-foreground mb-4">New listings are posted daily — check back soon.</p>
              <Link to="/jobs"><Button>Browse all jobs</Button></Link>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map(job => (
                <Link key={job.id} to={`/job/${job.id}`} className="group">
                  <Card className="p-5 h-full hover:border-primary/30 hover:shadow-md transition">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {job.company?.logo_url
                          ? <img src={job.company.logo_url} alt={job.company.name} loading="lazy" decoding="async" className="w-7 h-7 object-contain" />
                          : <Building2 className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold line-clamp-2 group-hover:text-primary">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company?.name}</p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mb-2">
                      <MapPin className="h-3 w-3" /> {job.location}
                      {job.is_remote && <span className="text-primary flex items-center gap-1"><Wifi className="h-3 w-3" /> Remote</span>}
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

          {/* Cross-links for SEO */}
          <section className="mt-14">
            <h2 className="text-xl font-semibold mb-4">Explore {cat!.name} jobs by city</h2>
            <div className="flex flex-wrap gap-2">
              {locationSlugs.map(l => (
                <Link key={l.slug} to={`/jobs/category/${cat!.slug}/${l.slug}`}>
                  <Badge variant={l.slug === loc?.slug ? "default" : "outline"} className="cursor-pointer">
                    {cat!.name} in {l.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Browse other categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.filter(c => c.slug !== cat!.slug).map(c => (
                <Link key={c.slug} to={`/jobs/category/${c.slug}${loc ? "/" + loc.slug : ""}`}>
                  <Badge variant="secondary" className="cursor-pointer">{c.name}</Badge>
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

export default CategoryJobs;
