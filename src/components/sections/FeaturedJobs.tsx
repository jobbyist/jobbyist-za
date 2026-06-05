import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowRight, Wifi, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "@/hooks/useJobs";
import { generateJobListSchema } from "@/components/SEOHead";
import { formatSalaryRange } from "@/lib/salary";
import { JobMetaBadges } from "@/components/JobBadges";
import { useEffect } from "react";

const FeaturedJobs = () => {
  const navigate = useNavigate();
  const { jobs, loading } = useJobs({ country: 'ZA', limit: 6 });

  // Add structured data for featured jobs
  useEffect(() => {
    if (jobs.length > 0) {
      const existingScript = document.querySelector('script[type="application/ld+json"][data-featured-jobs="true"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-featured-jobs', 'true');
      script.textContent = JSON.stringify(generateJobListSchema(jobs as any));
      document.head.appendChild(script);

      return () => {
        const scriptToRemove = document.querySelector('script[type="application/ld+json"][data-featured-jobs="true"]');
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [jobs]);

  const getCompanyColor = (name: string) => {
    const colors = [
      "bg-purple-500", "bg-red-500", "bg-teal-500", 
      "bg-blue-500", "bg-indigo-500", "bg-emerald-500"
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // (salary formatting moved to formatSalaryRange util)

  return (
    <section id="jobs" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover the latest jobs in South Africa</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our expertly curated job directory featuring the latest opportunities for South African jobseekers handpicked from our network of trusted job sites, global companies and recruiters across the globe
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No jobs available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="group bg-card rounded-xl p-6 border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 ${getCompanyColor(job.company?.name || 'C')} rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0`}>
                    {(job.company?.name || 'C')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{job.company?.name || 'Unknown Company'}</p>
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
                  <JobMetaBadges job={job} />
                </div>

                {/* Salary */}
                <p className="text-sm font-semibold gradient-brand-text mb-3">
                  {formatSalaryRange({
                    min: job.salary_min,
                    max: job.salary_max,
                    currency: job.salary_currency,
                    period: job.salary_period,
                    country: job.country,
                  })}
                </p>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {job.description}
                </p>

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="text-xs px-2 py-1 bg-muted rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Apply button */}
                <Button variant="default" className="w-full group/btn" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/jobs/${job.id}`);
                }}>
                  View Details
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button variant="brand" size="lg" className="group" onClick={() => navigate('/jobs')}>
            Browse All Jobs
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
