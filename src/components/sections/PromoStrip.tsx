import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Briefcase, MessageSquare, ArrowRight } from "lucide-react";

const features = [
  { icon: Briefcase, text: "Exclusive Jobs", desc: "Access premium job listings not available to free users" },
  { icon: Star, text: "Priority Applications", desc: "Your applications are highlighted to employers" },
  { icon: MessageSquare, text: "Career Coaching", desc: "One-on-one sessions with career experts" },
];

const PromoStrip = () => {
  return (
    <section className="py-20 gradient-brand relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto text-center text-primary-foreground">
          <Badge className="mb-4 bg-background/20 text-primary-foreground border-primary-foreground/20">
            Premium Service
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Accelerate Your Career with Jobbyist Pro
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-12">
            Get priority access to exclusive jobs, personalized career coaching, 
            and advanced application tracking for just R99/month.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature) => (
              <div key={feature.text} className="bg-background/10 backdrop-blur-sm rounded-xl p-6">
                <feature.icon className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.text}</h3>
                <p className="text-sm text-primary-foreground/70">{feature.desc}</p>
              </div>
            ))}
          </div>

          <Button size="lg" className="bg-background text-foreground hover:bg-background/90 group">
            Find Out More
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-sm text-primary-foreground/60 mt-6">
            7-day free trial • Cancel anytime • R99/month
          </p>
        </div>
      </div>
    </section>
  );
};

export default PromoStrip;
