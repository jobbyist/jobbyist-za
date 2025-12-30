import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  "Automatic job scanning across multiple sites",
  "AI-powered resume matching algorithm",
  "Real-time notifications for new matches",
  "Automated application submissions",
];

const Builder = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <div>
                  <Badge variant="secondary" className="mb-4">
                    Jobbyist Pro Exclusive
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    AI-Powered Job Matcher
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Our intelligent job matching tool automatically analyzes the latest job postings 
                    and matches them against your resume with real-time notifications and automated applications.
                  </p>

                  <ul className="space-y-3 mb-8">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/job-matcher">
                    <Button variant="brand" size="lg" className="group">
                      Get Started with Job Matcher
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                {/* Card */}
                <div className="relative">
                  <div className="absolute inset-0 gradient-brand rounded-2xl blur-2xl opacity-20" />
                  <div className="relative bg-card rounded-2xl p-8 border border-border shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 gradient-brand rounded-xl flex items-center justify-center">
                        <Target className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Job Matcher</h3>
                        <p className="text-sm text-muted-foreground">AI-Powered Matching</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6">
                      Let our AI automatically find and match the best job opportunities 
                      based on your resume and career goals.
                    </p>

                    <Link to="/job-matcher">
                      <Button variant="outline" className="w-full group">
                        <Sparkles className="h-4 w-4 mr-2 text-primary" />
                        How It Works
                        <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>

                    <p className="text-xs text-center text-muted-foreground mt-4">
                      Jobbyist Pro Members Only
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Builder;
