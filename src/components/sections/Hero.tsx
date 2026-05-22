import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, TrendingUp, ArrowRight, Users } from "lucide-react";
import { Link } from "react-router-dom";
import RecruitmentSuiteModal from "@/components/RecruitmentSuiteModal";

const Hero = () => {
  const [isRecruitmentModalOpen, setIsRecruitmentModalOpen] = useState(false);
  
  const badges = [
    { icon: Briefcase, text: "10,000+ Curated Job Listings" },
    { icon: Building2, text: "Verified SA Companies" },
    { icon: TrendingUp, text: "Updated Daily" },
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden gradient-hero-bg">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-slide-up text-foreground">
            South Africa's Trusted{" "}
            <span className="gradient-brand-text">Career Marketplace</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Find verified opportunities across Gauteng, Western Cape, KwaZulu-Natal and every province. Compare roles with realistic ZAR salary ranges and apply with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/jobs">
              <Button variant="hero" size="xl" className="group">
                Find Jobs in SA
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="hero-outline" size="xl" onClick={() => setIsRecruitmentModalOpen(true)}>Hire Verified SA Talent</Button>
            <Link to="/professional-profiles">
              <Button variant="hero-outline" size="xl" className="group">
                Candidate Profile Buyer: Browse Profiles
                <Users className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-3 mb-12 text-left animate-slide-up" style={{ animationDelay: "0.25s" }}>
            <Link to="/jobs" className="rounded-lg border border-border bg-background p-4 hover:border-primary/40">
              <p className="font-semibold">Job Seeker Journey</p><p className="text-sm text-muted-foreground">Search, match, and apply faster with AI-assisted tools.</p>
            </Link>
            <Link to="/pro" className="rounded-lg border border-border bg-background p-4 hover:border-primary/40">
              <p className="font-semibold">Employer / Recruiter Journey</p><p className="text-sm text-muted-foreground">Discover company tools and join the employer waitlist.</p>
            </Link>
            <Link to="/professional-profiles" className="rounded-lg border border-border bg-background p-4 hover:border-primary/40">
              <p className="font-semibold">Candidate Profile Buyer Journey</p><p className="text-sm text-muted-foreground">Access curated candidate profiles and request buyer access.</p>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            {badges.map((badge, index) => (
              <div
                key={badge.text}
                className="flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-border shadow-sm"
              >
                <badge.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <RecruitmentSuiteModal 
        open={isRecruitmentModalOpen}
        onOpenChange={setIsRecruitmentModalOpen}
      />
    </section>
  );
};

export default Hero;
