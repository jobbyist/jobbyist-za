import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, CreditCard, Calendar } from "lucide-react";
import RecruitmentSuiteModal from "@/components/RecruitmentSuiteModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-20 relative overflow-hidden bg-black">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-brand-purple/10" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto text-center text-white">
          <Badge className="mb-4 bg-brand-orange/20 text-brand-orange border-brand-orange/30">
            Early Access Beta
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Recruitment Suite for SMEs
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-12">
            Get ready for our comprehensive HR management solution launching Q1 2026. 
            Designed specifically for small and medium enterprises looking for turnkey 
            staffing solutions at a fraction of the cost.
          </p>

          {/* Features grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 gradient-brand rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">{feature.title}</h3>
                <p className="text-sm text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>

          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-white/90"
            onClick={() => setIsModalOpen(true)}
          >
            Join Early Access Waiting List
          </Button>

          <p className="text-sm text-white/60 mt-6 flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            Launching Q1 2026 • Free to join waiting list • Priority access for early adopters
          </p>
        </div>
      </div>

      <RecruitmentSuiteModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
};

export default RecruitmentSuite;
