import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award, Users, ArrowRight } from "lucide-react";
import ComingSoonModal from "@/components/ComingSoonModal";

const features = [
  {
    icon: BookOpen,
    title: "8 Learning Paths",
    description: "Structured courses in Frontend, Backend, Data Science, DevOps, and more",
  },
  {
    icon: Award,
    title: "Earn Badges",
    description: "Get recognized for your achievements and showcase your skills to employers",
  },
  {
    icon: Users,
    title: "Join Circles",
    description: "Connect with peers in study groups, mentorship circles, and project teams",
  },
];

const UpskillingPrograms = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <>
      <ComingSoonModal
        open={showComingSoon}
        onOpenChange={setShowComingSoon}
        title="Learning Paths Coming Soon!"
        description="We're building comprehensive learning paths to help you master in-demand skills. From frontend development to data science, our structured courses will give you the training you need to advance your career."
      />
    <section id="upskilling" className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-pink/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 gradient-brand text-primary-foreground">
              New Feature
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Upskilling Programs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Master in-demand skills with our comprehensive learning paths. From frontend 
              development to data science, get the training you need to advance your career 
              and stand out in the job market.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 gradient-brand rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="brand" 
              size="lg" 
              className="group"
              onClick={() => setShowComingSoon(true)}
            >
              Explore Learning Paths
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default UpskillingPrograms;
