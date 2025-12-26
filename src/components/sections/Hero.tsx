import { Button } from "@/components/ui/button";
import { Briefcase, Building2, TrendingUp, ArrowRight } from "lucide-react";

const Hero = () => {
  const badges = [
    { icon: Briefcase, text: "New jobs added every day" },
    { icon: Building2, text: "Verified Companies Only" },
    { icon: TrendingUp, text: "Daily Updates" },
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
            Africa's Premier Job Discovery &{" "}
            <span className="gradient-brand-text">Career Management</span> Platform
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Discover the most highly sought after, expertly curated job opportunities 
            offered by world-class, verified companies, employers and recruiters 
            looking for talent across Africa.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button variant="hero" size="xl" className="group">
              Find Your Dream Job
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="hero-outline" size="xl">
              For Employers
            </Button>
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
    </section>
  );
};

export default Hero;
