import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  Briefcase, 
  FileText, 
  Shield, 
  Target, 
  TrendingUp, 
  MessageSquare, 
  Zap,
  Check,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Unlimited AI-powered career assistant",
    description: "Get personalized career guidance, resume feedback, and interview preparation with our advanced AI assistant available 24/7.",
  },
  {
    icon: Briefcase,
    title: "Priority access to exclusive jobs",
    description: "Access premium job listings before they're available to free users and get your applications fast-tracked.",
  },
  {
    icon: FileText,
    title: "Advanced resume/CV builder with templates",
    description: "Create professional resumes with our extensive library of industry-specific templates designed by career experts.",
  },
  {
    icon: Shield,
    title: "No advertisements",
    description: "Enjoy an ad-free experience and focus entirely on your job search without distractions.",
  },
  {
    icon: Target,
    title: "Personalized job recommendations",
    description: "Receive curated job matches based on your skills, experience, and career goals using our intelligent matching algorithm.",
  },
  {
    icon: TrendingUp,
    title: "Application tracking and analytics",
    description: "Monitor your job applications with detailed insights and analytics to optimize your job search strategy.",
  },
  {
    icon: MessageSquare,
    title: "Direct messaging with recruiters",
    description: "Connect directly with hiring managers and recruiters to stand out from the competition.",
  },
  {
    icon: Zap,
    title: "Early access to new features",
    description: "Be the first to try new platform features and tools before they're released to the general public.",
  },
];

const pricingPlans = [
  {
    name: "Pro Monthly",
    price: "R99",
    period: "/month",
    description: "Perfect for active job seekers",
    features: [
      "All Pro features included",
      "Cancel anytime",
      "7-day free trial",
      "No commitment required",
    ],
    highlighted: false,
  },
  {
    name: "Pro Annual",
    price: "R899",
    period: "/year",
    description: "Best value for serious career growth",
    savings: "Save R289 compared to monthly",
    features: [
      "All Pro features included",
      "2 months free",
      "Priority support",
      "Annual career review",
    ],
    highlighted: true,
  },
];

const Pro = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual");

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Jobbyist Pro - Premium Career Services | Unlimited AI Assistant & Exclusive Jobs"
        description="Accelerate your career with Jobbyist Pro. Get unlimited AI-powered career guidance, priority access to exclusive jobs, advanced resume builder, and personalized job recommendations. Start your 7-day free trial today!"
        canonicalUrl="https://za.jobbyist.africa/pro"
        keywords={['Jobbyist Pro', 'premium job search', 'AI career assistant', 'exclusive jobs South Africa', 'resume builder', 'job matching', 'career advancement SA']}
        ogType="website"
      />
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 gradient-brand relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center text-primary-foreground">
              <Badge className="mb-4 bg-background/20 text-primary-foreground border-primary-foreground/20">
                Premium Service
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Accelerate Your Career with Jobbyist Pro
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Get the competitive edge you need with unlimited AI assistance, exclusive job access, 
                and advanced career tools designed to help you land your dream job faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 group">
                  Start Your Free Trial
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white bg-transparent hover:bg-white/10">
                  Compare Plans
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Jobbyist Pro gives you access to premium features that will transform your job search experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {features.map((feature) => (
                <Card key={feature.title} className="border-border hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 gradient-brand rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Start with a 7-day free trial. No credit card required. Cancel anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pricingPlans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`relative ${plan.highlighted ? 'border-brand-pink shadow-xl scale-105' : 'border-border'}`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="gradient-brand text-primary-foreground px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                    {plan.savings && (
                      <Badge variant="secondary" className="mt-2">
                        {plan.savings}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-brand-pink shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.highlighted ? 'gradient-brand' : ''}`}
                      variant={plan.highlighted ? "default" : "outline"}
                      size="lg"
                    >
                      Start Free Trial
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-sm text-muted-foreground">
                All plans include a 7-day free trial • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto gradient-brand border-0 text-primary-foreground">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Transform Your Career?
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg">
                  Join thousands of job seekers who have accelerated their careers with Jobbyist Pro
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  Start Your Free Trial
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white bg-transparent hover:bg-white/10">
                  <Link to="/" className="flex items-center gap-2">
                    Back to Home
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pro;
