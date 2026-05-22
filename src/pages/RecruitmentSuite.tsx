import { useState } from "react";
import { SEOHead, generateBreadcrumbSchema } from "@/components/SEOHead";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RecruitmentSuiteWaitlistModal from "@/components/RecruitmentSuiteWaitlistModal";
import {
  Briefcase,
  Users,
  Search,
  FileCheck,
  BookOpen,
  BarChart3,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Building2,
} from "lucide-react";

// ─────────────────────────── DATA ──────────────────────────────────────────

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  setupFee?: string;
  commitment?: string;
  moneyBack?: string;
  tagline: string;
  features: string[];
  highlighted: boolean;
  ctaLabel: string;
}

interface PlatformModule {
  Icon: React.ElementType;
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface WorkflowStep {
  step: number;
  title: string;
  description: string;
}

interface ComparisonRow {
  feature: string;
  freemium: string | boolean;
  growth: string | boolean;
  pro: string | boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    id: "freemium",
    name: "Freemium / Starter",
    price: "R0",
    period: "/ month",
    tagline: "Get started with the basics — no credit card required.",
    features: [
      "1 active job listing",
      "Basic applicant tracker",
      "Standard job description templates",
      "Basic company profile",
      "Candidate inbox for direct applicants",
      "Limited resource library access",
      "Community launch updates",
    ],
    highlighted: false,
    ctaLabel: "Start for free",
  },
  {
    id: "growth",
    name: "Growth Recruit",
    price: "R2,950",
    period: "/ month",
    setupFee: "Once-off R1,250 setup fee",
    commitment: "12-month commitment",
    moneyBack: "30-day money back guarantee",
    tagline: "Everything a growing team needs to hire confidently.",
    features: [
      "5 active job listings per month",
      "3 candidate background checks per month",
      "15 pre-screening summaries per month",
      "Verified candidate directory: 100 profile views / month",
      "Verified company directory listing",
      "Branded onboarding and training pack templates",
      "Payroll-ready employee records and exports",
      "Interview guides and candidate scorecards",
      "Email support and monthly hiring review",
    ],
    highlighted: true,
    ctaLabel: "Join the waitlist",
  },
  {
    id: "pro",
    name: "Pro HR Suite",
    price: "R6,950",
    period: "/ month",
    setupFee: "Once-off R1,250 setup fee",
    commitment: "12-month commitment",
    moneyBack: "30-day money back guarantee",
    tagline: "Full-stack HR tools for established teams and agencies.",
    features: [
      "15 active job listings per month",
      "10 candidate background checks per month",
      "40 pre-screening summaries per month",
      "Verified candidate directory: 500 profile views / month",
      "Featured verified company directory listing",
      "Custom branded onboarding and training packs",
      "Payroll dashboard, leave tracker and month-end exports",
      "Multi-user hiring team access",
      "Advanced interview scorecards and candidate comparisons",
      "Priority support and quarterly hiring optimisation session",
    ],
    highlighted: false,
    ctaLabel: "Join the waitlist",
  },
];

const platformModules: PlatformModule[] = [
  {
    Icon: Briefcase,
    title: "Job Listings & Applicant Tracking",
    description:
      "Post verified job listings and manage applicants with a structured pipeline built for SME hiring teams.",
  },
  {
    Icon: Search,
    title: "Verified Candidate Directory",
    description:
      "Access South Africa's growing pool of screened, privacy-protected candidate previews across admin, tech, marketing, ops and more.",
  },
  {
    Icon: FileCheck,
    title: "Pre-Screening Summaries",
    description:
      "Get AI-assisted candidate summaries before the interview stage, saving your team hours of manual screening time.",
  },
  {
    Icon: Shield,
    title: "Candidate Background Checks",
    description:
      "Request identity, criminal and reference checks through integrated third-party providers. Candidate consent required.",
  },
  {
    Icon: BookOpen,
    title: "Onboarding & Training Packs",
    description:
      "Issue branded onboarding packs, induction checklists and training templates from day one of every new hire.",
  },
  {
    Icon: BarChart3,
    title: "Payroll-Ready HR Tools",
    description:
      "Manage employee records, track leave and export month-end payroll data. Operational tools to complement your payroll provider.",
  },
  {
    Icon: Users,
    title: "Interview Guides & Scorecards",
    description:
      "Structure every interview with role-specific guides and shared scorecards so your hiring team evaluates consistently.",
  },
  {
    Icon: Building2,
    title: "Verified Company Directory",
    description:
      "Strengthen your employer brand with a verified listing in the Jobbyist company directory, visible to active job seekers.",
  },
];

const workflowSteps: WorkflowStep[] = [
  {
    step: 1,
    title: "Activate your account",
    description:
      "Select your plan, complete onboarding, and set up your company profile in minutes.",
  },
  {
    step: 2,
    title: "Post your first job",
    description:
      "Use templates or write your own listing. Publish live and start receiving applications immediately.",
  },
  {
    step: 3,
    title: "Screen and shortlist",
    description:
      "Review pre-screening summaries, access candidate previews, and build your shortlist — all in one place.",
  },
  {
    step: 4,
    title: "Interview and select",
    description:
      "Use structured guides and scorecards to evaluate consistently, then extend an offer with confidence.",
  },
  {
    step: 5,
    title: "Onboard and retain",
    description:
      "Issue onboarding packs, track employee records, and manage leave so every new hire starts strong.",
  },
];

const faqItems: FAQItem[] = [
  {
    question: "When does Recruitment Suite launch?",
    answer:
      "Recruitment Suite is launching in October 2026. Waitlist members will receive priority access and 25% off their first 3 paid months when their company activates during the launch window.",
  },
  {
    question: "Is there a free plan available?",
    answer:
      "Yes. The Freemium / Starter plan is permanently free and includes 1 active job listing, a basic applicant tracker, standard job description templates, a basic company profile, and a candidate inbox for direct applicants.",
  },
  {
    question: "What is the setup fee and what does it cover?",
    answer:
      "Paid plans include a once-off R1,250 setup fee. This covers account configuration, company profile setup, data migration support, and an onboarding session with our team.",
  },
  {
    question: "Is there a long-term commitment?",
    answer:
      "Paid plans (Growth Recruit and Pro HR Suite) are billed monthly on a 12-month commitment. A 30-day money back guarantee applies from activation. If you are not satisfied within the first 30 days, we will process a full refund — no questions asked.",
  },
  {
    question: "How do candidate background checks work?",
    answer:
      "Background checks are initiated through Recruitment Suite but fulfilled by integrated third-party verification providers. Candidate consent is required before any check is processed. Results are shared securely within your account. Availability and turnaround times may vary by provider.",
  },
  {
    question: "Are the payroll tools a replacement for a payroll provider?",
    answer:
      "No. Recruitment Suite payroll tools are operational management tools designed to simplify record-keeping and month-end data exports. They do not replace professional tax, legal, accounting or payroll advice. You should continue to use a registered payroll provider for statutory compliance.",
  },
  {
    question: "Does Recruitment Suite guarantee that I will find and hire candidates?",
    answer:
      "Recruitment Suite provides the tools and infrastructure to support your hiring process. It does not guarantee hires, candidate availability, candidate acceptance, salary alignment or employment outcomes. Hiring decisions remain entirely with your organisation.",
  },
  {
    question: "Is my company and candidate data secure?",
    answer:
      "Candidate data is protected under POPIA and access is restricted to authorised account users only. Full candidate details are never publicly visible. Background check data and screening notes are stored securely and are not shared outside your account without consent.",
  },
  {
    question: "Can multiple team members access the account?",
    answer:
      "Multi-user hiring team access is available on the Pro HR Suite plan. Growth Recruit accounts are single-user by default. Additional seat options will be available at launch.",
  },
];

const comparisonRows: ComparisonRow[] = [
  { feature: "Active job listings / month", freemium: "1", growth: "5", pro: "15" },
  { feature: "Candidate background checks / month", freemium: false, growth: "3", pro: "10" },
  { feature: "Pre-screening summaries / month", freemium: false, growth: "15", pro: "40" },
  { feature: "Verified candidate directory views / month", freemium: false, growth: "100", pro: "500" },
  { feature: "Verified company directory listing", freemium: false, growth: true, pro: "Featured" },
  { feature: "Onboarding & training pack templates", freemium: false, growth: "Branded templates", pro: "Custom branded" },
  { feature: "Payroll-ready HR tools", freemium: false, growth: "Records & exports", pro: "Dashboard + leave tracker" },
  { feature: "Interview guides & scorecards", freemium: false, growth: true, pro: "Advanced + comparisons" },
  { feature: "Multi-user team access", freemium: false, growth: false, pro: true },
  { feature: "Support", freemium: "Community", growth: "Email + monthly review", pro: "Priority + quarterly session" },
  { feature: "Once-off setup fee", freemium: false, growth: "R1,250", pro: "R1,250" },
  { feature: "Commitment", freemium: "None", growth: "12 months", pro: "12 months" },
  { feature: "Money back guarantee", freemium: false, growth: "30 days", pro: "30 days" },
];

// ────────────────────────── COMPONENT ──────────────────────────────────────

const PAGE_URL = "https://za.jobbyist.africa/recruitment-suite";

const RecruitmentSuitePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const openModal = (plan = "") => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Jobbyist South Africa", url: "https://za.jobbyist.africa" },
    { name: "Recruitment Suite", url: PAGE_URL },
  ]);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Recruitment Suite for Employers and Recruiters - Powered by Jobbyist",
    description:
      "Recruitment Suite for Employers and Recruiters is a South Africa-focused HR management platform for SMEs. Job listings, pre-screening, background checks, onboarding packs, verified directories and payroll-ready HR tools. Launching October 2026.",
    provider: {
      "@type": "Organization",
      name: "Jobbyist",
      url: "https://za.jobbyist.africa",
    },
    areaServed: {
      "@type": "Country",
      name: "South Africa",
    },
    serviceType: "HR Management Platform",
    offers: pricingPlans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: plan.price.replace(/[R,]/g, ""),
      priceCurrency: "ZAR",
      eligibleRegion: { "@type": "Country", name: "South Africa" },
    })),
  };

  // Glassmorphism card style used throughout
  const glassCard: React.CSSProperties = {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(15,18,54,0.08)",
    boxShadow: "0 18px 60px rgba(7,10,47,0.07)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at 18% 24%, rgba(91,224,255,0.18) 0%, transparent 30%)," +
          "radial-gradient(circle at 76% 16%, rgba(127,92,255,0.14) 0%, transparent 27%)," +
          "radial-gradient(circle at 52% 68%, rgba(205,251,115,0.10) 0%, transparent 28%)," +
          "#f8f9ff",
        overflowX: "hidden",
      }}
    >
      <SEOHead
        title="Recruitment Suite for Employers and Recruiters - Powered by Jobbyist"
        description="Recruitment Suite for Employers and Recruiters is a South Africa-focused HR management platform for SMEs. Job listings, pre-screening, background checks, onboarding packs, verified directories and payroll-ready HR tools. Launching October 2026."
        canonicalUrl={PAGE_URL}
        ogType="website"
        keywords={[
          "recruitment suite South Africa",
          "HR management platform SME",
          "employer hiring tools",
          "candidate background checks",
          "pre-screening South Africa",
          "onboarding packs",
          "payroll HR tools",
          "Jobbyist Recruitment Suite",
        ]}
        structuredData={[serviceSchema, breadcrumbSchema]}
      />

      <Navbar />

      <main className="pt-20">
        {/* ── HERO ────────────────────────────────────────────────────── */}
        <section
          className="container mx-auto px-4 max-w-7xl py-16 md:py-24"
          aria-labelledby="hero-title"
        >
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            {/* Left copy */}
            <div>
              <Badge className="mb-5 bg-blue-50 text-blue-700 border-blue-200">
                <span
                  className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"
                  style={{ boxShadow: "0 0 0 5px rgba(22,163,74,0.15)" }}
                  aria-hidden="true"
                />
                Launching October 2026 · Join the waitlist
              </Badge>

              <h1
                id="hero-title"
                className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none mb-6 tracking-tight"
                style={{
                  transform: "skewX(-6deg)",
                  background: "linear-gradient(135deg, #070a2f 0%, #4562ee 60%, #7f5cff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Recruitment Suite
              </h1>

              <p
                className="text-lg sm:text-xl font-bold mb-3"
                style={{ color: "rgba(7,10,47,0.82)" }}
              >
                South Africa's end-to-end HR hiring platform for{" "}
                <strong style={{ color: "#070a2f" }}>employers and recruiters</strong>.
              </p>
              <p className="text-base mb-8" style={{ color: "rgba(7,10,47,0.64)", lineHeight: 1.7 }}>
                Post jobs, screen candidates, run background checks, issue onboarding packs and
                manage HR records — all from one platform built for South African SMEs.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Button
                  size="lg"
                  onClick={() => openModal()}
                  className="text-white font-bold"
                  style={{
                    background: "linear-gradient(135deg, #4562ee, #3250e7)",
                    boxShadow: "0 18px 38px rgba(69,98,238,0.28)",
                  }}
                  aria-label="Join the Recruitment Suite waitlist"
                >
                  Join the Waitlist
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("rs-pricing")?.scrollIntoView({ behavior: "smooth" })
                  }
                  aria-label="View Recruitment Suite pricing"
                >
                  View Pricing
                </Button>
              </div>

              <div className="flex flex-wrap gap-2" aria-label="Key trust points">
                {[
                  "🇿🇦 Built for South Africa",
                  "🔒 POPIA-compliant",
                  "🚀 Launching October 2026",
                  "💰 30-day money back",
                ].map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border"
                    style={{
                      background: "rgba(255,255,255,0.72)",
                      borderColor: "rgba(15,18,54,0.08)",
                      color: "rgba(7,10,47,0.72)",
                    }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* Right hero card */}
            <aside
              className="rounded-[42px] p-7 relative overflow-hidden"
              style={glassCard}
              aria-label="Platform highlights"
            >
              {/* Decorative glow */}
              <div
                className="absolute pointer-events-none"
                style={{
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  right: -110,
                  top: -110,
                  background: "radial-gradient(circle, rgba(69,98,238,.18), transparent 62%)",
                }}
                aria-hidden="true"
              />

              <p
                className="text-xs font-black uppercase tracking-widest mb-3"
                style={{ color: "rgba(7,10,47,0.44)" }}
              >
                What's included
              </p>
              <p
                className="text-5xl font-black leading-none mb-1 tracking-tight"
                style={{ color: "#070a2f" }}
              >
                8
                <span
                  className="text-lg font-semibold ml-2"
                  style={{ color: "rgba(7,10,47,0.5)" }}
                >
                  platform modules
                </span>
              </p>
              <p className="text-sm mb-5" style={{ color: "rgba(7,10,47,0.6)", lineHeight: 1.6 }}>
                Everything from job posting to payroll-ready HR exports in one integrated platform
                designed for South African SMEs.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Plans", value: "3" },
                  { label: "Launch", value: "Oct '26" },
                  { label: "Market", value: "ZA" },
                  { label: "Guarantee", value: "30 days" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl p-4 border"
                    style={{
                      background: "rgba(247,247,255,0.82)",
                      borderColor: "rgba(15,18,54,0.08)",
                    }}
                  >
                    <span
                      className="block text-xs font-black uppercase tracking-wide mb-1"
                      style={{ color: "rgba(7,10,47,0.44)" }}
                    >
                      {stat.label}
                    </span>
                    <strong
                      className="block text-2xl font-black tracking-tight"
                      style={{ color: "#070a2f" }}
                    >
                      {stat.value}
                    </strong>
                  </div>
                ))}
              </div>

              <Button
                className="w-full mt-5 font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #4562ee, #7f5cff)",
                  boxShadow: "0 14px 30px rgba(69,98,238,0.22)",
                }}
                onClick={() => openModal()}
                aria-label="Request Recruitment Suite access"
              >
                Request Access
              </Button>
            </aside>
          </div>
        </section>

        {/* ── PLATFORM MODULES ──────────────────────────────────────── */}
        <section className="container mx-auto px-4 max-w-7xl py-14" aria-labelledby="modules-title">
          <div className="mb-10">
            <p
              className="text-xs font-black uppercase tracking-widest mb-3"
              style={{ color: "#4562ee" }}
            >
              Platform modules
            </p>
            <h2
              id="modules-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none mb-4"
              style={{ color: "#070a2f" }}
            >
              Everything your hiring team needs, in one place.
            </h2>
            <p className="text-base max-w-xl" style={{ color: "rgba(7,10,47,0.6)", lineHeight: 1.7 }}>
              Recruitment Suite is designed for South African SMEs that want enterprise-grade hiring
              tools without enterprise complexity or cost.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {platformModules.map(({ Icon, title, description }) => (
              <div
                key={title}
                className="rounded-3xl p-6 border transition-all duration-200 hover:-translate-y-1"
                style={glassCard}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    background: "linear-gradient(135deg, #4562ee, #7f5cff)",
                    boxShadow: "0 12px 24px rgba(69,98,238,0.22)",
                  }}
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3
                  className="text-base font-black mb-2 tracking-tight"
                  style={{ color: "#070a2f" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(7,10,47,0.6)" }}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
        <section className="container mx-auto px-4 max-w-7xl py-14" aria-labelledby="workflow-title">
          <div className="mb-10">
            <p
              className="text-xs font-black uppercase tracking-widest mb-3"
              style={{ color: "#4562ee" }}
            >
              How it works
            </p>
            <h2
              id="workflow-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none"
              style={{ color: "#070a2f" }}
            >
              From first listing to first day — in five steps.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {workflowSteps.map(({ step, title, description }) => (
              <div
                key={step}
                className="rounded-3xl p-6 border relative"
                style={glassCard}
              >
                <span
                  className="text-4xl font-black tracking-tight leading-none mb-3 block"
                  style={{
                    background: "linear-gradient(135deg, #4562ee, #7f5cff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {String(step).padStart(2, "0")}
                </span>
                <h3
                  className="text-base font-black mb-2 tracking-tight"
                  style={{ color: "#070a2f" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(7,10,47,0.6)" }}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRICING ───────────────────────────────────────────────── */}
        <section
          id="rs-pricing"
          className="container mx-auto px-4 max-w-7xl py-14"
          aria-labelledby="pricing-title"
        >
          <div className="mb-10">
            <p
              className="text-xs font-black uppercase tracking-widest mb-3"
              style={{ color: "#4562ee" }}
            >
              Pricing
            </p>
            <h2
              id="pricing-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none mb-4"
              style={{ color: "#070a2f" }}
            >
              Straightforward plans for South African SMEs.
            </h2>
            <p className="text-base max-w-lg" style={{ color: "rgba(7,10,47,0.6)", lineHeight: 1.7 }}>
              Start free. Upgrade when you're ready. Paid plans launch October 2026 — join the waitlist
              to lock in your launch discount.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <article
                key={plan.id}
                className="rounded-[42px] p-7 border flex flex-col relative overflow-hidden"
                style={
                  plan.highlighted
                    ? {
                        background:
                          "radial-gradient(circle at 18% 20%, rgba(255,255,255,.22), transparent 26%)," +
                          "linear-gradient(135deg, #070a2f, #263be3 60%, #7f5cff)",
                        border: "none",
                        boxShadow: "0 28px 90px rgba(26,35,109,0.22)",
                        color: "#fff",
                      }
                    : glassCard
                }
                aria-label={`${plan.name} pricing plan`}
              >
                {plan.highlighted && (
                  <div
                    className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
                    style={{ background: "rgba(205,251,115,0.22)", border: "1px solid rgba(205,251,115,0.3)", color: "#cdfb73" }}
                    aria-label="Most popular plan"
                  >
                    <Star className="h-3 w-3" fill="currentColor" aria-hidden="true" />
                    Most popular
                  </div>
                )}

                {/* Decorative glow on highlighted card */}
                {plan.highlighted && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: "50%",
                      right: -100,
                      top: -100,
                      background: "radial-gradient(circle, rgba(91,224,255,.18), transparent 62%)",
                    }}
                    aria-hidden="true"
                  />
                )}

                <p
                  className="text-xs font-black uppercase tracking-widest mb-3"
                  style={{ color: plan.highlighted ? "rgba(255,255,255,0.6)" : "rgba(7,10,47,0.44)" }}
                >
                  {plan.name}
                </p>

                <p
                  className="text-5xl font-black tracking-tight leading-none mb-1"
                  style={{ color: plan.highlighted ? "#fff" : "#070a2f" }}
                >
                  {plan.price}
                  <span
                    className="text-base font-semibold ml-1"
                    style={{ color: plan.highlighted ? "rgba(255,255,255,0.6)" : "rgba(7,10,47,0.44)" }}
                  >
                    {plan.period}
                  </span>
                </p>

                {plan.setupFee && (
                  <p
                    className="text-xs font-bold mb-1"
                    style={{ color: plan.highlighted ? "rgba(255,255,255,0.6)" : "rgba(7,10,47,0.5)" }}
                  >
                    {plan.setupFee}
                  </p>
                )}
                {plan.commitment && (
                  <p
                    className="text-xs font-bold mb-1"
                    style={{ color: plan.highlighted ? "rgba(255,255,255,0.6)" : "rgba(7,10,47,0.5)" }}
                  >
                    {plan.commitment}
                  </p>
                )}
                {plan.moneyBack && (
                  <div
                    className="flex items-center gap-1.5 mt-1 mb-4 text-xs font-bold"
                    style={{ color: plan.highlighted ? "#cdfb73" : "#16a34a" }}
                  >
                    <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    {plan.moneyBack}
                  </div>
                )}

                <p
                  className="text-sm mb-5 mt-2"
                  style={{ color: plan.highlighted ? "rgba(255,255,255,0.72)" : "rgba(7,10,47,0.6)", lineHeight: 1.6 }}
                >
                  {plan.tagline}
                </p>

                <ul className="space-y-2.5 flex-1 mb-7" aria-label={`${plan.name} features`}>
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: plan.highlighted ? "rgba(255,255,255,0.78)" : "rgba(7,10,47,0.7)" }}
                    >
                      <CheckCircle
                        className="h-4 w-4 mt-0.5 flex-shrink-0"
                        style={{ color: plan.highlighted ? "#cdfb73" : "#4562ee" }}
                        aria-hidden="true"
                      />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => openModal(plan.id === "freemium" ? "" : plan.name)}
                  className="w-full font-bold"
                  style={
                    plan.highlighted
                      ? {
                          background: "#cdfb73",
                          color: "#070a2f",
                          boxShadow: "0 14px 30px rgba(205,251,115,0.22)",
                        }
                      : {
                          background: "linear-gradient(135deg, #4562ee, #3250e7)",
                          color: "#fff",
                          boxShadow: "0 14px 30px rgba(69,98,238,0.22)",
                        }
                  }
                  aria-label={`${plan.ctaLabel} — ${plan.name}`}
                >
                  {plan.ctaLabel}
                </Button>
              </article>
            ))}
          </div>

          {/* Legal disclaimer */}
          <p
            className="mt-6 text-xs text-center max-w-3xl mx-auto"
            style={{ color: "rgba(7,10,47,0.48)", lineHeight: 1.7 }}
          >
            Paid plans require a once-off R1,250 setup fee and a 12-month commitment. A 30-day money
            back guarantee applies from activation. Background checks require candidate consent and
            may depend on third-party verification providers. Payroll tools are operational management
            tools and do not replace professional tax, legal, accounting or payroll advice. Recruitment
            Suite does not guarantee hires, candidate availability, candidate acceptance, salary
            alignment or employment outcomes.
          </p>
        </section>

        {/* ── COMPARISON TABLE ──────────────────────────────────────── */}
        <section
          className="container mx-auto px-4 max-w-7xl py-14"
          aria-labelledby="comparison-title"
        >
          <div className="mb-8">
            <p
              className="text-xs font-black uppercase tracking-widest mb-3"
              style={{ color: "#4562ee" }}
            >
              Plan comparison
            </p>
            <h2
              id="comparison-title"
              className="text-3xl sm:text-4xl font-black tracking-tight leading-none"
              style={{ color: "#070a2f" }}
            >
              Compare all three plans.
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table
              className="w-full text-sm"
              aria-label="Plan feature comparison table"
            >
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(15,18,54,0.08)" }}>
                  <th
                    className="text-left py-3 pr-4 font-black text-base"
                    style={{ color: "#070a2f", minWidth: 220 }}
                    scope="col"
                  >
                    Feature
                  </th>
                  {["Freemium", "Growth Recruit", "Pro HR Suite"].map((name) => (
                    <th
                      key={name}
                      className="text-center py-3 px-3 font-black text-base"
                      style={{ color: "#070a2f", minWidth: 130 }}
                      scope="col"
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className="border-b"
                    style={{
                      borderColor: "rgba(15,18,54,0.06)",
                      background: i % 2 === 0 ? "rgba(247,247,255,0.5)" : "transparent",
                    }}
                  >
                    <td
                      className="py-3 pr-4 font-semibold"
                      style={{ color: "rgba(7,10,47,0.72)" }}
                    >
                      {row.feature}
                    </td>
                    {([row.freemium, row.growth, row.pro] as (string | boolean)[]).map(
                      (val, colIdx) => (
                        <td
                          key={colIdx}
                          className="text-center py-3 px-3"
                          style={{ color: "rgba(7,10,47,0.72)" }}
                        >
                          {val === false ? (
                            <span
                              className="text-base font-black"
                              style={{ color: "rgba(7,10,47,0.2)" }}
                              aria-label="Not included"
                            >
                              —
                            </span>
                          ) : val === true ? (
                            <CheckCircle
                              className="h-5 w-5 mx-auto"
                              style={{ color: "#4562ee" }}
                              aria-label="Included"
                            />
                          ) : (
                            <span className="font-semibold">{val}</span>
                          )}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <section
          className="container mx-auto px-4 max-w-3xl py-14"
          aria-labelledby="faq-title"
        >
          <div className="mb-8 text-center">
            <p
              className="text-xs font-black uppercase tracking-widest mb-3"
              style={{ color: "#4562ee" }}
            >
              Common questions
            </p>
            <h2
              id="faq-title"
              className="text-3xl sm:text-4xl font-black tracking-tight leading-none"
              style={{ color: "#070a2f" }}
            >
              Frequently asked questions.
            </h2>
          </div>

          <div className="space-y-3" role="list">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-3xl border overflow-hidden"
                style={glassCard}
                role="listitem"
              >
                <button
                  className="w-full flex items-center justify-between gap-4 p-5 text-left font-black text-base transition-colors hover:bg-blue-50/30"
                  style={{ color: "#070a2f" }}
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                >
                  <span>{item.question}</span>
                  {openFaq === idx ? (
                    <ChevronUp
                      className="h-5 w-5 flex-shrink-0"
                      style={{ color: "#4562ee" }}
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronDown
                      className="h-5 w-5 flex-shrink-0"
                      style={{ color: "rgba(7,10,47,0.44)" }}
                      aria-hidden="true"
                    />
                  )}
                </button>

                {openFaq === idx && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    className="px-5 pb-5 text-sm leading-relaxed"
                    style={{ color: "rgba(7,10,47,0.68)" }}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BAND ──────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 max-w-7xl py-8 pb-28">
          <div
            className="rounded-[42px] p-10 md:p-16 text-white relative overflow-hidden"
            style={{
              background:
                "radial-gradient(circle at 18% 22%, rgba(255,255,255,.24), transparent 26%)," +
                "linear-gradient(135deg, #070a2f, #263be3 56%, #7f5cff)",
              boxShadow: "0 28px 90px rgba(26,35,109,0.22)",
            }}
          >
            {/* Decorative */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: 300,
                height: 300,
                borderRadius: "50%",
                right: -80,
                top: -80,
                background: "radial-gradient(circle, rgba(91,224,255,.14), transparent 60%)",
              }}
              aria-hidden="true"
            />

            <div className="relative max-w-2xl">
              <div
                className="flex items-center gap-2 mb-4 text-xs font-black uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                <Clock className="h-4 w-4" aria-hidden="true" />
                Launching October 2026
              </div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none mb-5"
                style={{ color: "#fff" }}
              >
                Be first. Get 25% off launch pricing.
              </h2>
              <p
                className="text-base mb-8"
                style={{ color: "rgba(255,255,255,0.76)", lineHeight: 1.7 }}
              >
                Join the Recruitment Suite waitlist today and receive 25% off your first 3 paid
                months when your company activates during the October 2026 launch window. Limited
                early adopter spots available.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => openModal()}
                  className="font-bold"
                  style={{
                    background: "#cdfb73",
                    color: "#070a2f",
                    boxShadow: "0 14px 30px rgba(205,251,115,0.22)",
                  }}
                  aria-label="Join the Recruitment Suite waitlist"
                >
                  Join the Waitlist
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("rs-pricing")?.scrollIntoView({ behavior: "smooth" })
                  }
                  style={{
                    borderColor: "rgba(255,255,255,0.3)",
                    color: "#fff",
                    background: "transparent",
                  }}
                  aria-label="View pricing plans"
                >
                  View Plans
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ── STICKY GLOWING CTA ──────────────────────────────────────── */}
      <div
        className="fixed left-0 right-0 bottom-0 z-20 flex justify-center pb-4 pointer-events-none"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 16px)",
          background:
            "linear-gradient(to top, rgba(248,249,255,0.98) 60%, rgba(248,249,255,0))",
        }}
        aria-label="Sticky call to action"
      >
        <button
          onClick={() => openModal()}
          className="pointer-events-auto relative font-black text-white uppercase tracking-wide transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
          style={{
            minWidth: "min(560px, calc(100vw - 32px))",
            borderRadius: 24,
            padding: "18px 28px",
            fontSize: "clamp(14px, 3vw, 18px)",
            border: 0,
            cursor: "pointer",
            background: "linear-gradient(135deg, #4764f1, #3651e7)",
            boxShadow: "0 24px 56px rgba(69,98,238,0.34), 0 0 0 3px rgba(91,224,255,0.18)",
          }}
          aria-label="Join the Recruitment Suite waitlist"
        >
          Join the Recruitment Suite Waitlist →
        </button>
      </div>

      {/* ── WAITLIST MODAL ──────────────────────────────────────────── */}
      <RecruitmentSuiteWaitlistModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        selectedPlan={selectedPlan}
      />
    </div>
  );
};

export default RecruitmentSuitePage;
