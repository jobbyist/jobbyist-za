import { Button } from "@/components/ui/button";
import { Briefcase, Building2, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import digitalLabourMarketReportVideoUrl from "../../../reference/digital-job-market-report.mp4?url";

const Hero = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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
          <div className="announcement-gradient-border max-w-3xl mx-auto rounded-full px-6 py-4 md:px-8 md:py-5 mb-8 animate-slide-up">
            <p className="text-base md:text-lg font-semibold text-foreground">
              South Africa’s Digital Labour Market Report In 2026
            </p>
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="mt-1 text-sm md:text-base font-semibold text-[#4f46e5] hover:text-[#4338ca] underline underline-offset-4 transition-colors"
            >
              Watch Now
            </button>
          </div>

          {/* Main headline */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-slide-up"
            style={{
              background: "linear-gradient(135deg, #050816 0%, #0a1f5f 45%, #4562ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 14px 34px rgba(7, 10, 47, 0.28))",
            }}
          >
            South Africa’s Premier Job Discovery & Career Management Platform
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Discover expertly curated job opportunities from verified South African 
            companies. From Johannesburg to Cape Town, Durban to Pretoria — your next 
            career breakthrough awaits.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/jobs">
              <Button variant="hero" size="xl" className="group">
                Find Jobs in South Africa
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/recruitment-suite">
              <Button variant="hero-outline" size="xl" className="btn-gradient-border">
                For Employers &amp; Recruiters
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            {badges.map((badge) => (
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

      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>South Africa’s Digital Labour Market Report In 2026</DialogTitle>
          </DialogHeader>
          <video
            className="w-full rounded-lg"
            controls
            preload="metadata"
            src={digitalLabourMarketReportVideoUrl}
            title="South Africa’s Digital Labour Market Report In 2026"
            aria-label="Video player for South Africa’s Digital Labour Market Report in 2026"
          >
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Hero;
