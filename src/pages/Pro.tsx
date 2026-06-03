import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check, X, ArrowRight, Crown, Sparkles, Zap, Shield,
  Briefcase, FileText, Bell, Star, Target, BarChart3,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FREE_MONTHLY_LIMIT } from "@/hooks/useApplicationQuota";

interface PlanRow {
  feature: string;
  free: string | boolean;
  pro: string | boolean;
}

const COMPARISON: PlanRow[] = [
  { feature: "Browse all South African jobs", free: true, pro: true },
  { feature: "Save jobs to your dashboard", free: true, pro: true },
  { feature: "Personal profile & CV builder", free: true, pro: true },
  { feature: `Monthly job applications`, free: `${FREE_MONTHLY_LIMIT} / month`, pro: "Unlimited" },
  { feature: "AI-powered job matching", free: false, pro: true },
  { feature: "Priority profile visibility to employers", free: false, pro: true },
  { feature: "Early access to new listings", free: false, pro: true },
  { feature: "AI cover-letter generation", free: false, pro: true },
  { feature: "Resume audit & ATS optimisation", free: false, pro: true },
  { feature: "Application analytics dashboard", free: false, pro: true },
  { feature: "Ad-free browsing experience", free: false, pro: true },
  { feature: "Priority email support", free: false, pro: true },
];

const PRO_FEATURES = [
  { icon: Sparkles, title: "AI Job Matching", body: "Our AI learns your goals and surfaces only roles that fit your skills, salary, and location preferences." },
  { icon: Zap, title: "Unlimited Applications", body: "Apply to as many roles as you want. Free accounts are capped at 10 per month." },
  { icon: Bell, title: "Instant Alerts", body: "Be the first to hear about new jobs from Adzuna, Careers24, JobMail and 250+ remote sources." },
  { icon: BarChart3, title: "Application Analytics", body: "See which applications get viewed, shortlisted, or rejected so you can refine your approach." },
  { icon: Shield, title: "Ad-Free", body: "No AdSense, no sponsored banners — a clean professional dashboard." },
  { icon: Star, title: "Priority Profile", body: "Your profile is shown first to recruiters using the Recruitment Suite." },
];

const TESTIMONIALS = [
  { name: "Lerato M.", role: "Software Developer, Johannesburg", quote: "Jobbyist Pro's AI matching put me in front of three Sandton fintechs in a week. I had two offers within a month." },
  { name: "Sipho K.", role: "Data Analyst, Cape Town", quote: "Unlimited applications and the analytics dashboard helped me see what was actually working. Worth every Rand." },
  { name: "Anele B.", role: "Marketing Manager, Pretoria", quote: "The early access alone got me an interview before the listing was public. Landed the role in 3 weeks." },
];

const Cell = ({ value }: { value: string | boolean }) => {
  if (value === true) return <Check className="h-5 w-5 text-emerald-500 mx-auto" aria-label="Included" />;
  if (value === false) return <X className="h-5 w-5 text-muted-foreground/50 mx-auto" aria-label="Not included" />;
  return <span className="text-sm font-medium">{value}</span>;
};

const Pro = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const startCheckout = () => {
    if (!user) navigate("/auth?next=/pro");
    else navigate("/profile?upgrade=pro");
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Jobbyist Pro — Unlimited Applications, AI Matching & Ad-Free | South Africa"
        description={`Upgrade to Jobbyist Pro from R99/month. Get unlimited job applications, AI-powered matching, priority recruiter visibility, and an ad-free experience. Free plan also available (${FREE_MONTHLY_LIMIT} applications/month).`}
        canonicalUrl="https://za.jobbyist.africa/pro"
        keywords={["Jobbyist Pro", "premium job search South Africa", "unlimited applications", "AI job matching", "Pro membership"]}
      />
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-20 gradient-brand relative overflow-hidden">
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center text-primary-foreground">
              <Badge className="mb-4 bg-background/20 text-primary-foreground border-primary-foreground/20 gap-1">
                <Crown className="h-3 w-3" /> Jobbyist Pro
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Land your next role faster.
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Pro members apply more, match smarter, and get seen first. From <strong>R99/month</strong>.
                Try it risk-free with our 30-day money-back guarantee.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 group" onClick={startCheckout}>
                  Upgrade to Pro <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/20 text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
                  onClick={() => document.getElementById("compare-plans")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Compare Plans
                </Button>
              </div>
              <p className="mt-6 text-sm text-primary-foreground/75">
                💳 No credit card to start Free · ✅ Cancel anytime · 🔒 Secure Paystack checkout
              </p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="compare-plans" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose your plan</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Start free, upgrade when you're ready. Switch or cancel any time.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="relative">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" /> Free
                  </CardTitle>
                  <CardDescription>Browse jobs and apply on a budget</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">R0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5" /> Browse all SA job listings</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5" /> {FREE_MONTHLY_LIMIT} applications per month</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5" /> Save jobs & basic CV builder</li>
                    <li className="flex gap-2 text-muted-foreground"><X className="h-4 w-4 mt-0.5" /> AI job matching</li>
                    <li className="flex gap-2 text-muted-foreground"><X className="h-4 w-4 mt-0.5" /> Ad-free experience</li>
                  </ul>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to={user ? "/jobs" : "/auth"}>Get started free</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="relative border-primary shadow-lg">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Most popular
                </Badge>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-500" /> Pro
                  </CardTitle>
                  <CardDescription>Everything you need to land your next role</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">R99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5" /> <strong>Unlimited</strong> applications</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5" /> AI-powered job matching</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5" /> Priority recruiter visibility</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5" /> Early access to new listings</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5" /> AI cover letters & resume audit</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5" /> Ad-free experience</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-500 mt-0.5" /> Priority email support</li>
                  </ul>
                  <Button className="w-full mt-4" onClick={startCheckout}>
                    Upgrade to Pro <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">30-day money-back guarantee</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Detailed comparison */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-10">Free vs Pro — full comparison</h2>
            <div className="rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="p-4 font-semibold text-center w-32">Free</th>
                    <th className="p-4 font-semibold text-center w-32 text-primary">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={row.feature} className={i % 2 ? "bg-muted/20" : ""}>
                      <td className="p-4">{row.feature}</td>
                      <td className="p-4 text-center"><Cell value={row.free} /></td>
                      <td className="p-4 text-center"><Cell value={row.pro} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center mt-8">
              <Button size="lg" onClick={startCheckout}>
                <Crown className="h-4 w-4 mr-2" /> Start your Pro membership
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What you get with Pro</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {PRO_FEATURES.map((f) => (
                <Card key={f.title}>
                  <CardHeader>
                    <f.icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{f.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">South Africans are landing roles with Pro</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <Card key={t.name}>
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm mb-4 italic">"{t.quote}"</p>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 gradient-brand">
          <div className="container mx-auto px-4 text-center text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">Ready to get hired faster?</h2>
            <p className="mb-8 text-primary-foreground/90 max-w-xl mx-auto">
              Join thousands of South Africans growing their careers with Jobbyist Pro.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" onClick={startCheckout}>
              Upgrade to Pro — R99/mo <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pro;
