import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

const benefits = [
  "ATS compatibility check",
  "Keyword optimization suggestions",
  "Format and design recommendations",
  "Industry-specific feedback",
];

const ResumeBuilder = () => {
  return (
    <section id="resume" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <Badge variant="secondary" className="mb-4">
                100% Free Tool
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Your Resume Professionally Audited
              </h2>
              <p className="text-muted-foreground mb-8">
                Our AI-powered ResumeAudit tool analyzes your resume and provides 
                actionable feedback to help you land more interviews.
              </p>

              <ul className="space-y-3 mb-8">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button variant="brand" size="lg" className="group">
                Claim My Free Resume Audit
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Card */}
            <div className="relative">
              <div className="absolute inset-0 gradient-brand rounded-2xl blur-2xl opacity-20" />
              <div className="relative bg-card rounded-2xl p-8 border border-border shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 gradient-brand rounded-xl flex items-center justify-center">
                    <FileText className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Resume Builder</h3>
                    <p className="text-sm text-muted-foreground">AI-Powered</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">
                  Create a professional, ATS-friendly resume in minutes with our 
                  free AI-powered resume builder.
                </p>

                <Button variant="outline" className="w-full group">
                  <Sparkles className="h-4 w-4 mr-2 text-primary" />
                  How It Works
                  <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  100% Free • No Credit Card Required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeBuilder;
