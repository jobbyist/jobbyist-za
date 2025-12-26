import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, CreditCard, Calendar } from "lucide-react";

const features = [
  {
    icon: Settings,
    title: "Tailored Solutions",
    description: "Custom HR workflows designed specifically for your business size and industry requirements.",
  },
  {
    icon: Users,
    title: "Complete Staffing",
    description: "End-to-end recruitment and staffing management from job posting to onboarding.",
  },
  {
    icon: CreditCard,
    title: "Cost Effective",
    description: "Enterprise-grade HR tools at SME-friendly prices. Get more value for your investment.",
  },
];

const RecruitmentSuite = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-brand-purple/20" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto text-center text-background">
          <Badge className="mb-4 bg-brand-orange/20 text-brand-orange border-brand-orange/30">
            Early Access
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Recruitment Suite for SMEs
          </h2>
          <p className="text-background/70 max-w-2xl mx-auto mb-12">
            Get ready for our comprehensive HR management solution launching January 2026. 
            Designed specifically for small and medium enterprises looking for turnkey 
            staffing solutions at a fraction of the cost.
          </p>

          {/* Features grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-background/5 backdrop-blur-sm rounded-xl p-6 border border-background/10 hover:bg-background/10 transition-all duration-300"
              >
                <div className="w-12 h-12 gradient-brand rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-background/60">{feature.description}</p>
              </div>
            ))}
          </div>

          <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
            Join Early Access Waiting List
          </Button>

          <p className="text-sm text-background/50 mt-6 flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            Launching January 2026 • Free to join waiting list • Priority access for early adopters
          </p>
        </div>
      </div>
    </section>
  );
};

export default RecruitmentSuite;
