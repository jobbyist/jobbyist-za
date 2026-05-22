import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, CreditCard, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

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
    <section className="py-20 relative overflow-hidden suite-page-shell">

      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
            Early Access Beta
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 suite-heading">
            Recruitment Suite for SMEs
          </h2>
          <p className="text-slate-700 max-w-2xl mx-auto mb-12">
            Get ready for our comprehensive HR management solution launching Q1 2026. 
            Designed specifically for small and medium enterprises looking for turnkey 
            staffing solutions at a fraction of the cost.
          </p>

          {/* Features grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 hover:bg-white transition-all duration-300"
              >
                <div className="w-12 h-12 gradient-brand rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          <Link to="/recruitment-suite">
            <Button 
              size="lg" 
              className="gradient-brand text-white hover:opacity-95"
            >
              Join Early Access Waiting List
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            Launching October 2026 • Free to join waiting list • Priority access for early adopters
          </p>
        </div>
      </div>
    </section>
  );
};

export default RecruitmentSuite;
