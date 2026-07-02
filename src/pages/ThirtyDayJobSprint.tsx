import { SEOHead, generateBreadcrumbSchema } from "@/components/SEOHead";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Clock,
  Shield,
  Target,
  Users,
} from "lucide-react";

const PAGE_URL = "https://za.jobbyist.co.za/sprint";
const SPRINTER_URL = "https://sprinter.jobbyist.co.za";

const promoStats = [
  { icon: Clock, label: "Duration", value: "90 days" },
  { icon: Target, label: "Guarantee", value: "4 interviews in 60 days" },
  { icon: Zap, label: "Result lift", value: "+73% higher hire rate" },
  { icon: Users, label: "Support", value: "1-on-1 expert + AI" },
];

const included = [
  "1-on-1 expert career guidance for the full 90 days",
  "AI-powered strategy & application analysis (Claude, Gemini, OpenAI)",
  "Weekly check-in calls with your dedicated career consultant",
  "Professional CV optimisation (ATS-ready formatting)",
  "LinkedIn profile refresh and optimisation",
  "Role Radar — job matching across full-time, part-time, remote, hybrid & contract",
  "Resume Assistant & Cover Letter Generator",
  "Application tracking spreadsheet + daily task checklists",
  "Recruiter outreach templates & messaging scripts",
  "Mock interview coaching and offer preparation",
  "Access to Coursera, Google Skillshop, HubSpot, LinkedIn Learning, EdX",
  "Alumni community, networking, and post-sprint strategy session",
];

const phases = [
  { name: "Foundation", days: "1–7", focus: "Profile audit, goal setting, toolkit setup, upskilling plan, career strategy session" },
  { name: "Market Targeting", days: "8–21", focus: "Define target roles, salary benchmarks, daily application targets, recruiter list" },
  { name: "Application Sprint", days: "22–60", focus: "Daily applications, expert CV review, recruiter outreach, AI-powered analysis" },
  { name: "Visibility Boost", days: "45–75", focus: "LinkedIn optimisation, personal branding, content strategy, network expansion" },
  { name: "Interview Readiness", days: "60–85", focus: "Mock interviews, coaching sessions, confidence building, offer preparation" },
  { name: "Review & Placement", days: "85–90", focus: "Pipeline review, offer negotiation, post-sprint planning, final strategy session" },
];

const goToSprinter = () => {
  window.open(SPRINTER_URL, "_blank", "noopener,noreferrer");
};

const ThirtyDayJobSprint = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Jobbyist South Africa", url: "https://za.jobbyist.co.za" },
    { name: "90-Day Job Sprint", url: PAGE_URL },
  ]);

  const offerSchema = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: "Jobbyist Pro — 50% Off Launch Offer + Free 90-Day Job Sprint Access",
    description:
      "Limited-time launch promotion: get Jobbyist Pro at 50% off (R49.50/month for the first 3 months) and receive free access to the 90-Day Job Search Sprint programme.",
    price: "49.50",
    priceCurrency: "ZAR",
    availability: "https://schema.org/InStock",
    url: PAGE_URL,
    eligibleRegion: { "@type": "Country", name: "South Africa" },
    seller: { "@type": "Organization", name: "Jobbyist", url: "https://za.jobbyist.co.za" },
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at 18% 24%, rgba(91,224,255,0.24) 0%, transparent 30%)," +
          "radial-gradient(circle at 76% 16%, rgba(255,181,97,0.22) 0%, transparent 27%)," +
          "radial-gradient(circle at 52% 58%, rgba(205,251,115,0.14) 0%, transparent 28%)," +
          "#fbfcff",
        overflowX: "hidden",
      }}
    >
      <SEOHead
        title="50% Off Jobbyist Pro + Free 90-Day Job Sprint | Jobbyist SA"
        description="Limited-time launch offer: 50% off Jobbyist Pro plus free access to the 90-Day Job Search Sprint — 1-on-1 expert coaching, AI-powered tools, CV optimisation, and 4 verified interviews within 60 days."
        canonicalUrl={PAGE_URL}
        ogType="website"
        keywords={[
          "Jobbyist Pro promotion",
          "90-day job sprint",
          "job search coaching South Africa",
          "CV review",
          "career acceleration",
          "remote jobs South Africa",
        ]}
        structuredData={[offerSchema, breadcrumbSchema]}
      />

      <Navbar />

      <main className="pt-20 pb-24">
        {/* Hero */}
        <section className="container mx-auto px-4 max-w-6xl py-14 md:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-5 bg-white/80 text-slate-800 border-blue-200 font-extrabold">
              <Sparkles className="h-3 w-3 mr-1 text-amber-500" />
              Limited launch offer — ends soon
            </Badge>

            <h1
              className="text-[clamp(2.5rem,6.5vw,5rem)] font-black leading-[0.95] tracking-tight mb-5"
              style={{
                background: "linear-gradient(135deg, #070a2f 0%, #4562ee 55%, #7f5cff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              50% Off Jobbyist Pro
              <br />
              + Free 90-Day Sprint Access
            </h1>

            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed mb-4 max-w-2xl mx-auto">
              Get <strong>Jobbyist Pro at half price</strong> for your first 3 months (R49.50/month) and
              unlock <strong>free access to the 90-Day Job Search Sprint</strong> — our premium,
              AI-enhanced placement programme.
            </p>
            <p className="text-base text-slate-600 mb-8 max-w-2xl mx-auto">
              Built for South African candidates targeting full-time, part-time, remote, hybrid,
              contract, or freelance roles.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10">
              <Button size="lg" onClick={goToSprinter} className="text-base font-bold px-8">
                Claim 50% Off & Start Sprint
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={goToSprinter}>
                View Sprint Details
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {promoStats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-4 bg-white/85 border border-slate-200 backdrop-blur-md text-left"
                >
                  <s.icon className="h-5 w-5 text-blue-600 mb-2" />
                  <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                    {s.label}
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="container mx-auto px-4 max-w-6xl py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-3">What you get with the offer</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Every Sprint client receives 1-on-1 expert support, AI-powered tools, and a
              structured 90-day system — plus all Jobbyist Pro benefits during your subscription.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {included.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl p-4 bg-white/85 border border-slate-200"
              >
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-800 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* The 90-day methodology */}
        <section className="container mx-auto px-4 max-w-6xl py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-3">The 90-day methodology</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Six phases with weekly checkpoints, dedicated career consultants, and AI-powered
              analysis at every stage.
            </p>
          </div>

          <div className="space-y-3">
            {phases.map((p, i) => (
              <div
                key={p.name}
                className="rounded-2xl p-5 bg-white/85 border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex items-center gap-3 sm:w-64">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-black text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-500 font-semibold">Days {p.days}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-700 flex-1">{p.focus}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Guarantee */}
        <section className="container mx-auto px-4 max-w-4xl py-12">
          <div className="rounded-3xl p-8 md:p-10 bg-gradient-to-br from-blue-600 to-purple-700 text-white text-center shadow-2xl">
            <Shield className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl md:text-3xl font-black mb-3">
              4 verified interviews within 60 days — or your money back
            </h3>
            <p className="text-white/85 mb-6 max-w-2xl mx-auto">
              Complete the weekly tasks and application targets and if you don't receive at least
              4 verified interviews within 60 days, we'll refund your Sprint fee. Full terms in
              our service handbook.
            </p>
            <Button size="lg" variant="secondary" onClick={goToSprinter} className="font-bold">
              Start Now on sprinter.jobbyist.co.za
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 max-w-4xl py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Ready to accelerate your job search?
          </h2>
          <p className="text-slate-700 mb-8 max-w-2xl mx-auto">
            Continue to <strong>sprinter.jobbyist.co.za</strong> to claim your 50% off Jobbyist Pro
            subscription and activate free 90-Day Sprint access.
          </p>
          <Button size="lg" onClick={goToSprinter} className="text-base font-bold px-8">
            Continue to Sprinter
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-xs text-slate-500 mt-4">
            Opens sprinter.jobbyist.co.za in a new tab.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ThirtyDayJobSprint;
