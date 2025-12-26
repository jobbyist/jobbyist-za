import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Building2, ArrowRight, Wifi } from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  description: string;
  skills: string[];
  isRemote?: boolean;
  companyInitial: string;
  companyColor: string;
}

const jobs: Job[] = [
  {
    id: 1,
    title: "Business Development Manager",
    company: "TFG",
    location: "Sandton, Gauteng",
    type: "Contract",
    level: "Mid-Level",
    salary: "R 420K - R 690K",
    description: "Join us as a Business Development Manager to identify and pursue new business opportunities.",
    skills: ["Sales Strategy", "CRM", "Negotiation"],
    companyInitial: "T",
    companyColor: "bg-purple-500",
  },
  {
    id: 2,
    title: "Financial Analyst",
    company: "Absa",
    location: "Centurion, Gauteng",
    type: "Part-time",
    level: "Entry-Level",
    salary: "R 290K - R 387K",
    description: "We are seeking a Financial Analyst to support strategic decision-making through financial analysis.",
    skills: ["Excel", "Financial Modeling", "Power BI"],
    isRemote: true,
    companyInitial: "A",
    companyColor: "bg-red-500",
  },
  {
    id: 3,
    title: "Frontend Developer",
    company: "Discovery",
    location: "Stellenbosch, Western Cape",
    type: "Full-time",
    level: "Senior",
    salary: "R 833K - R 1M",
    description: "We are looking for a talented Frontend Developer to create exceptional user experiences.",
    skills: ["React", "TypeScript", "CSS"],
    companyInitial: "D",
    companyColor: "bg-teal-500",
  },
  {
    id: 4,
    title: "Product Marketing Manager",
    company: "Google South Africa",
    location: "Stellenbosch, Western Cape",
    type: "Full-time",
    level: "Executive",
    salary: "R 1.4M - R 2.1M",
    description: "Join our team as a Product Marketing Manager to drive product adoption and go-to-market strategies.",
    skills: ["Digital Marketing", "SEO", "Content Strategy"],
    companyInitial: "G",
    companyColor: "bg-blue-500",
  },
  {
    id: 5,
    title: "Full Stack Developer",
    company: "Takealot",
    location: "Stellenbosch, Western Cape",
    type: "Contract",
    level: "Mid-Level",
    salary: "R 446K - R 675K",
    description: "Join our team as a Full Stack Developer working on both frontend and backend technologies.",
    skills: ["JavaScript", "Python", "Node.js"],
    companyInitial: "T",
    companyColor: "bg-blue-600",
  },
  {
    id: 6,
    title: "Account Manager",
    company: "KPMG",
    location: "Johannesburg, Gauteng",
    type: "Full-time",
    level: "Entry-Level",
    salary: "R 326K - R 429K",
    description: "As an Account Manager, you will manage client relationships and ensure customer satisfaction.",
    skills: ["Sales Strategy", "CRM", "Relationship Building"],
    companyInitial: "K",
    companyColor: "bg-indigo-500",
  },
];

const FeaturedJobs = () => {
  return (
    <section id="jobs" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Jobs</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore curated opportunities from top companies across South Africa
          </p>
        </div>

        {/* Jobs grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="group bg-card rounded-xl p-6 border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 ${job.companyColor} rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0`}>
                  {job.companyInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                </div>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{job.location}</span>
                </div>
                {job.isRemote && (
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <Wifi className="h-3 w-3" />
                    <span>Remote OK</span>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-xs">{job.type}</Badge>
                <Badge variant="outline" className="text-xs">{job.level}</Badge>
              </div>

              {/* Salary */}
              <p className="text-sm font-semibold gradient-brand-text mb-3">{job.salary}</p>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {job.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {job.skills.map((skill) => (
                  <span key={skill} className="text-xs px-2 py-1 bg-muted rounded-md">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Apply button */}
              <Button variant="default" className="w-full group/btn">
                Apply Now
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="brand" size="lg" className="group">
            Browse All Jobs
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
