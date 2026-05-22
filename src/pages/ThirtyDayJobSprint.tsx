import { useMemo, useState } from "react";
import { SEOHead, generateBreadcrumbSchema } from "@/components/SEOHead";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Sparkles,
} from "lucide-react";

type CheckoutKey = "lite" | "guided" | "premium";

interface PricingPackage {
  id: CheckoutKey;
  name: string;
  launchPrice: string;
  standardPrice: string;
  description: string;
  featured?: boolean;
  badge?: string;
  ctaLabel: string;
  features: string[];
}

interface BenefitItem {
  icon: string;
  text: string;
}

interface RoleLane {
  title: string;
  description: string;
}

interface ProcessStep {
  title: string;
  description: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

const PAGE_URL = "https://za.jobbyist.africa/30-day-job-sprint";

const BUSINESS_CONFIG = {
  whatsappNumber: (import.meta.env.VITE_BUSINESS_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
};

const CHECKOUT_LINKS: Record<CheckoutKey, string> = {
  lite: import.meta.env.VITE_JOB_SPRINT_CHECKOUT_LITE || "#",
  guided: import.meta.env.VITE_JOB_SPRINT_CHECKOUT_GUIDED || "#",
  premium: import.meta.env.VITE_JOB_SPRINT_CHECKOUT_PREMIUM || "#",
};

const pricingPackages: PricingPackage[] = [
  {
    id: "lite",
    name: "Sprint Lite",
    launchPrice: "R1,250",
    standardPrice: "R1,750",
    description:
      "Ideal for budget-conscious candidates who need stronger positioning and a clear application system.",
    ctaLabel: "Choose Sprint Lite",
    features: [
      "CV review and upgrade",
      "Role targeting worksheet",
      "Application tracker setup",
      "5 cover letter templates",
      "1 online check-in",
      "Remote job-board setup guide",
    ],
  },
  {
    id: "guided",
    name: "Guided Sprint",
    launchPrice: "R2,950",
    standardPrice: "R3,500",
    description:
      "Our best-value package for serious job seekers who want accountability, sharper positioning and guided execution.",
    featured: true,
    badge: "Best value",
    ctaLabel: "Start Guided Sprint",
    features: [
      "Everything in Sprint Lite",
      "30-day campaign plan",
      "CV/resume positioning",
      "Job-fit scoring support",
      "Application answer support",
      "Recruiter outreach scripts",
      "Voice note and Loom prep",
      "FlexJobs 14-day access budget",
      "One-page resume website template/setup",
    ],
  },
  {
    id: "premium",
    name: "Premium Sprint",
    launchPrice: "R6,500",
    standardPrice: "R7,500+",
    description:
      "High-touch support for candidates who want deeper interview preparation, portfolio proof and weekly strategic guidance.",
    ctaLabel: "Choose Premium",
    features: [
      "Everything in Guided Sprint",
      "Weekly online consultations",
      "Portfolio/writing sample support",
      "Mock interview preparation",
      "Practical task support",
      "Full interview story bank",
      "Personal website with custom domain guidance",
      "Custom email setup guidance",
    ],
  },
];

const whyItWorks = [
  {
    icon: "🎯",
    title: "Role targeting",
    description:
      "Focus on realistic remote opportunities where your background can be positioned credibly.",
  },
  {
    icon: "📄",
    title: "CV positioning",
    description:
      "Align your CV, cover letters and application responses to the exact roles you are targeting.",
  },
  {
    icon: "📊",
    title: "Application tracking",
    description:
      "Track submissions, follow-up dates, outcomes and next actions with a practical system.",
  },
  {
    icon: "💬",
    title: "Recruiter-style outreach",
    description:
      "Use polished follow-up and outreach scripts to improve response quality and consistency.",
  },
  {
    icon: "🎥",
    title: "Interview and Loom prep",
    description:
      "Prepare for video intros, practical tasks and interview questions with a structured story bank.",
  },
  {
    icon: "🤝",
    title: "Expert support",
    description:
      "Get guided support from job-search operators focused on execution quality and momentum.",
  },
];

const bundledBenefits: BenefitItem[] = [
  {
    icon: "✅",
    text: "CV/Resume review and upgrade focused on remote-role credibility.",
  },
  {
    icon: "✅",
    text: "Job-fit scoring to prioritise roles you can defend confidently in interviews.",
  },
  {
    icon: "✅",
    text: "Application tracker with targets, status, follow-up dates, sources and next actions.",
  },
  {
    icon: "✅",
    text: "Cover letter templates and application question answer support.",
  },
  {
    icon: "✅",
    text: "Recruiter outreach scripts, follow-up messages and voice-note frameworks.",
  },
  {
    icon: "✅",
    text: "Interview preparation, story bank and practical task workflow.",
  },
  {
    icon: "🌐",
    text: "Remote job board setup guidance for LinkedIn, Indeed, We Work Remotely, FlexJobs and Upwork.",
  },
  {
    icon: "🎁",
    text: "FlexJobs 14-day access budget included with Guided Sprint and Premium Sprint.",
  },
  {
    icon: "🧑🏾‍💻",
    text: "Personal resume website setup or template, depending on your selected package.",
  },
  {
    icon: "📧",
    text: "Custom email setup guidance, with deeper support on Premium Sprint.",
  },
  {
    icon: "🧠",
    text: "AI-assisted workflows for research, drafting, editing and organisation, with truthful human review.",
  },
  {
    icon: "🛡️",
    text: "Clear legal and ethical boundaries with no fabricated credentials or false claims.",
  },
];

const roleLanes: RoleLane[] = [
  {
    title: "Virtual Assistance",
    description:
      "Inbox, calendar, scheduling, research, admin, task follow-up and operations support.",
  },
  {
    title: "Customer Support",
    description:
      "Email, chat, CRM updates, customer success, support tickets and client communication.",
  },
  {
    title: "Legal / Executive Support",
    description:
      "Document handling, confidentiality, client communication, legal admin and assistant workflows.",
  },
  {
    title: "Marketing Support",
    description:
      "Content planning, social media, Canva, website updates, campaign support and reporting.",
  },
  {
    title: "Recruitment Support",
    description:
      "Job-board workflows, CV screening, candidate messages, interview scheduling and ATS-style tracking.",
  },
  {
    title: "Data Operations",
    description:
      "Spreadsheets, CRM updates, data entry, audit checks, data cleaning and structured reporting.",
  },
  {
    title: "Real Estate Admin",
    description:
      "Listing support, document workflows, client communication and remote transaction coordination.",
  },
  {
    title: "Remote Freelance Support",
    description:
      "Upwork proposals, client communication, work proof and portfolio-ready samples.",
  },
];

const processSteps: ProcessStep[] = [
  {
    title: "Days 1-3: Setup and positioning",
    description:
      "Confirm target roles, review your CV, prepare your tracker, set platform accounts and define application rules.",
  },
  {
    title: "Days 4-10: Application Sprint 1",
    description:
      "Build high-quality application volume, track responses and refine role-fit scoring.",
  },
  {
    title: "Days 8-18: Outreach layer",
    description:
      "Run targeted follow-ups and recruiter outreach that sounds professional and specific.",
  },
  {
    title: "Days 11-22: Application Sprint 2",
    description:
      "Improve targeting based on response data and prepare for voice notes, tests and practical tasks.",
  },
  {
    title: "Days 15-30: Interview conversion",
    description:
      "Prepare story answers, salary positioning, practical submissions and final-stage follow-ups.",
  },
];

const faqItems: FaqItem[] = [
  {
    question: "Do you guarantee a job or interview?",
    answer:
      "No. This is an employability and job-search execution service. We improve strategy, application quality, follow-up discipline and interview readiness, but hiring decisions remain with employers.",
  },
  {
    question: "Is this only CV writing?",
    answer:
      "No. CV positioning is included, but the core value is the full 30-day campaign system: role targeting, job-fit scoring, application tracking, outreach and interview preparation.",
  },
  {
    question: "Do you apply on my behalf?",
    answer:
      "In most cases, no. You remain in control of your applications and final submissions, while we help you prepare and execute at a higher standard.",
  },
  {
    question: "What does FlexJobs access budget mean?",
    answer:
      "Guided Sprint and Premium Sprint include a budget allocation for short FlexJobs access. Ongoing subscriptions and external platform upgrades are excluded unless stated in writing.",
  },
  {
    question: "Can I pay in instalments?",
    answer:
      "Where available, instalment options can be discussed directly before onboarding starts.",
  },
];

const executionMetrics = [
  { value: "8/day", label: "weekday application target for active candidates" },
  { value: "4/day", label: "weekend application target where practical" },
  { value: "5/day", label: "targeted weekday follow-ups" },
  { value: "30 days", label: "campaign window with reviewable outputs" },
];

const trustPills = [
  "🇿🇦 Rand pricing",
  "💬 WhatsApp-friendly support",
  "🧠 Ethical AI-assisted workflows",
  "🛡️ No false credentials",
];

const heroCardStats = [
  { label: "Timeline", value: "30 days" },
  { label: "Target", value: "Remote roles" },
  { label: "Support", value: "Guided" },
  { label: "Market", value: "South Africa" },
];

const glassCardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.82)",
  border: "1px solid rgba(15,18,54,0.08)",
  boxShadow: "0 18px 60px rgba(7,10,47,0.07)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const buildWhatsAppLink = (message: string) => {
  if (!BUSINESS_CONFIG.whatsappNumber) {
    return null;
  }

  return `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
};

const toStructuredPrice = (price: string) => {
  const normalized = price.replace(/,/g, "").replace(/[^\d.]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed.toString() : "";
};

const ThirtyDayJobSprint = () => {
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage>(pricingPackages[1]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);

  const bundledBenefitColumns = useMemo(() => {
    const midpoint = Math.ceil(bundledBenefits.length / 2);
    return [bundledBenefits.slice(0, midpoint), bundledBenefits.slice(midpoint)];
  }, []);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Jobbyist South Africa", url: "https://za.jobbyist.africa" },
    { name: "30-Day Job Sprint", url: PAGE_URL },
  ]);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "30-Day Remote Job Search Sprint - Powered by Jobbyist",
    description:
      "A 30-day remote job-search execution system for South African job seekers. CV positioning, job-fit scoring, application tracking, outreach scripts, interview prep, consultations and recruiter-led guidance.",
    provider: {
      "@type": "Organization",
      name: "Jobbyist",
      url: "https://za.jobbyist.africa",
    },
    areaServed: {
      "@type": "Country",
      name: "South Africa",
    },
    offers: pricingPackages.map((item) => ({
      "@type": "Offer",
      name: item.name,
      price: toStructuredPrice(item.launchPrice),
      priceCurrency: "ZAR",
      eligibleRegion: { "@type": "Country", name: "South Africa" },
    })),
  };

  const openPackageModal = (pkg: PricingPackage) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const defaultWhatsAppLink = buildWhatsAppLink(
    "Hello Jobbyist, I am interested in the 30-Day Remote Job Search Sprint. Please send me the package details.",
  );

  const packageWhatsAppLink = buildWhatsAppLink(
    `Hello Jobbyist, I am interested in the ${selectedPackage.name} package for the 30-Day Remote Job Search Sprint. Please send me the next steps.`,
  );

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
        title="30-Day Remote Job Search Sprint - Powered by Jobbyist"
        description="A 30-day remote job-search execution system for South African job seekers. CV positioning, job-fit scoring, application tracking, outreach scripts, interview prep, consultations and recruiter-led guidance."
        canonicalUrl={PAGE_URL}
        ogType="website"
        keywords={[
          "remote jobs South Africa",
          "CV review South Africa",
          "job search coaching",
          "virtual assistant jobs",
          "customer support jobs",
          "legal assistant jobs",
          "Jobbyist",
        ]}
        structuredData={[serviceSchema, breadcrumbSchema]}
      />

      <Navbar />

      <main className="pt-20 pb-28">
        <section className="container mx-auto px-4 max-w-7xl py-16 md:py-20" aria-labelledby="hero-title">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-9 items-center">
            <div>
              <Badge className="mb-5 bg-white/75 text-slate-800 border-blue-200 font-extrabold">
                <span
                  className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"
                  style={{ boxShadow: "0 0 0 6px rgba(22,163,74,0.14)" }}
                  aria-hidden="true"
                />
                Built for South African remote job seekers
              </Badge>

              <h1
                id="hero-title"
                className="text-[clamp(3rem,7.6vw,6rem)] font-black leading-[0.9] tracking-tight mb-5"
                style={{
                  transform: "skewX(-8deg)",
                  background: "linear-gradient(135deg, #070a2f 0%, #4562ee 60%, #7f5cff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                30-Day Remote Job Search Sprint
              </h1>

              <p className="text-lg sm:text-xl font-bold text-slate-800/85 leading-relaxed mb-3">
                Stop applying blindly. Build a <strong>30-day remote job-search campaign</strong> with sharper CV
                positioning, better-fit applications, recruiter-style follow-ups, interview preparation and expert
                support.
              </p>
              <p className="text-base sm:text-lg font-semibold text-slate-700/80 leading-relaxed mb-7">
                Powered by <strong>Jobbyist</strong> for candidates targeting admin, virtual assistance, customer
                support, legal support, marketing, recruitment support and data operations roles.
              </p>

              <div className="flex flex-wrap gap-3 mb-7">
                <Button
                  size="lg"
                  className="text-white font-bold"
                  style={{
                    background: "linear-gradient(135deg, #4562ee, #3250e7)",
                    boxShadow: "0 18px 38px rgba(69,98,238,0.28)",
                  }}
                  onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                  aria-label="View sprint pricing packages"
                >
                  Start from R1,250
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById("whats-included")?.scrollIntoView({ behavior: "smooth" })}
                  aria-label="See what is included in the sprint"
                >
                  See what is included
                </Button>
              </div>

              <div className="flex flex-wrap gap-2" aria-label="Key trust points">
                {trustPills.map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-bold border"
                    style={{
                      background: "rgba(255,255,255,0.66)",
                      borderColor: "rgba(15,18,54,0.08)",
                      color: "rgba(7,10,47,0.72)",
                    }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <aside className="rounded-[42px] p-7 relative overflow-hidden" style={glassCardStyle} aria-label="Recommended package">
              <div
                className="absolute pointer-events-none"
                style={{
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  right: -110,
                  top: -110,
                  background: "radial-gradient(circle, rgba(69,98,238,.2), transparent 62%)",
                }}
                aria-hidden="true"
              />
              <p className="text-xs font-black uppercase tracking-widest mb-3 text-slate-500">Recommended launch offer</p>
              <span className="inline-block text-slate-500/80 font-black line-through text-lg mb-1">Standard: R3,500</span>
              <p className="text-[clamp(3rem,6vw,4.5rem)] font-black leading-none tracking-tight text-slate-950 mb-2">
                R2,950 <span className="text-base font-semibold text-slate-500">once-off</span>
              </p>
              <p className="text-slate-700/80 font-semibold leading-relaxed">
                Guided Sprint gives serious job seekers the best balance of affordability, structure and hands-on support.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {heroCardStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl p-4 border"
                    style={{ background: "rgba(247,247,255,0.78)", borderColor: "rgba(15,18,54,0.08)" }}
                  >
                    <span className="block text-xs font-black uppercase text-slate-500">{item.label}</span>
                    <strong className="block mt-1 text-2xl font-black tracking-tight text-slate-950">{item.value}</strong>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section id="benefits" className="container mx-auto px-4 max-w-7xl py-14" aria-labelledby="benefits-title">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-6 mb-8">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3">Why this works</p>
              <h2 id="benefits-title" className="text-4xl md:text-5xl font-black leading-[0.95] tracking-tight text-slate-950 max-w-4xl">
                Most job seekers do not need more motivation. They need a better job-search system.
              </h2>
            </div>
            <p className="max-w-xl text-base font-semibold text-slate-700/80 leading-relaxed">
              This service turns scattered applications into a focused campaign with clear role lanes, stronger assets,
              tracked applications, smarter follow-ups and interview readiness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {whyItWorks.map((item) => (
              <article key={item.title} className="rounded-[28px] p-6" style={glassCardStyle}>
                <div className="w-12 h-12 rounded-2xl grid place-items-center text-2xl mb-4 bg-blue-100/80" aria-hidden="true">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black tracking-tight text-slate-950 mb-2">{item.title}</h3>
                <p className="text-slate-700/80 leading-relaxed font-semibold">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="whats-included" className="container mx-auto px-4 max-w-7xl py-14" aria-labelledby="included-title">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3">Bundle contents</p>
            <h2 id="included-title" className="text-4xl md:text-5xl font-black leading-[0.95] tracking-tight text-slate-950 max-w-4xl">
              Everything you need to run a disciplined 30-day campaign.
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {bundledBenefitColumns.map((column, colIndex) => (
              <div key={colIndex} className="rounded-[28px] p-6 space-y-3" style={glassCardStyle}>
                {column.map((item) => (
                  <div
                    key={item.text}
                    className="flex items-start gap-3 p-4 rounded-2xl border"
                    style={{ background: "rgba(247,247,255,0.78)", borderColor: "rgba(15,18,54,0.08)" }}
                  >
                    <span className="w-9 h-9 rounded-xl bg-white shadow-sm grid place-items-center flex-shrink-0" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="font-semibold text-slate-800/85 leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-7xl py-14" aria-labelledby="roles-title">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3">Best-fit role lanes</p>
            <h2 id="roles-title" className="text-4xl md:text-5xl font-black leading-[0.95] tracking-tight text-slate-950 max-w-4xl">
              Built for practical remote roles South Africans can realistically target.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {roleLanes.map((lane) => (
              <article key={lane.title} className="rounded-[28px] p-6" style={glassCardStyle}>
                <h3 className="text-lg font-black tracking-tight text-slate-950 mb-2">{lane.title}</h3>
                <p className="text-sm font-semibold text-slate-700/80 leading-relaxed">{lane.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="container mx-auto px-4 max-w-7xl py-14" aria-labelledby="pricing-title">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-6 mb-8">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3">South Africa-friendly pricing</p>
              <h2 id="pricing-title" className="text-4xl md:text-5xl font-black leading-[0.95] tracking-tight text-slate-950 max-w-4xl">
                Choose the level of support that matches your urgency and budget.
              </h2>
            </div>
            <p className="max-w-xl text-base font-semibold text-slate-700/80 leading-relaxed">
              A strong entry point is Sprint Lite. The best overall value for most candidates is Guided Sprint at the
              launch price of R2,950.
            </p>
          </div>

          <div className="grid xl:grid-cols-3 gap-5">
            {pricingPackages.map((pkg) => (
              <article
                key={pkg.id}
                className="rounded-[32px] p-6 flex flex-col gap-4 relative overflow-hidden"
                style={
                  pkg.featured
                    ? {
                        background:
                          "radial-gradient(circle at 20% 20%, rgba(255,255,255,.22), transparent 22%)," +
                          "linear-gradient(135deg, #0a0d37, #263be3 58%, #7f5cff)",
                        boxShadow: "0 28px 90px rgba(26,35,109,0.18)",
                        color: "#fff",
                      }
                    : glassCardStyle
                }
                aria-label={`${pkg.name} pricing package`}
              >
                {pkg.badge && (
                  <span
                    className="inline-flex w-fit px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                    style={{ background: pkg.featured ? "#cdfb73" : "rgba(205,251,115,0.22)", color: "#070a2f" }}
                  >
                    {pkg.badge}
                  </span>
                )}

                <h3 className="text-3xl font-black tracking-tight">{pkg.name}</h3>
                <p className="text-5xl font-black leading-none tracking-tight">
                  {pkg.launchPrice}
                </p>
                <p className={`text-sm font-bold ${pkg.featured ? "text-white/75" : "text-slate-500"}`}>
                  Launch price. Standard: {pkg.standardPrice}.
                </p>
                <p className={`font-semibold leading-relaxed ${pkg.featured ? "text-white/85" : "text-slate-700/80"}`}>
                  {pkg.description}
                </p>

                <ul className="space-y-2.5 flex-1" aria-label={`${pkg.name} features`}>
                  {pkg.features.map((feature) => (
                    <li key={feature} className={`flex items-start gap-2 text-sm font-semibold ${pkg.featured ? "text-white/85" : "text-slate-700/85"}`}>
                      <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${pkg.featured ? "text-lime-300" : "text-green-600"}`} aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => openPackageModal(pkg)}
                  className="w-full font-bold"
                  style={
                    pkg.featured
                      ? {
                          background: "#cdfb73",
                          color: "#070a2f",
                          boxShadow: "0 14px 30px rgba(205,251,115,0.24)",
                        }
                      : {
                          background: pkg.id === "premium" ? "linear-gradient(135deg, #070a2f, #1c2468)" : "rgba(255,255,255,0.74)",
                          color: pkg.id === "premium" ? "#fff" : "#070a2f",
                          border: pkg.id === "premium" ? "none" : "1px solid rgba(15,18,54,0.1)",
                        }
                  }
                  aria-label={`${pkg.ctaLabel} — ${pkg.name}`}
                >
                  {pkg.ctaLabel}
                </Button>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="container mx-auto px-4 max-w-7xl py-14" aria-labelledby="process-title">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3">30-day operating rhythm</p>
            <h2 id="process-title" className="text-4xl md:text-5xl font-black leading-[0.95] tracking-tight text-slate-950 max-w-4xl">
              Simple enough to follow. Structured enough to measure.
            </h2>
          </div>

          <div className="rounded-[28px] p-6 space-y-4" style={glassCardStyle}>
            {processSteps.map((step, index) => (
              <div key={step.title} className="grid grid-cols-[54px,1fr] gap-4 items-start">
                <div
                  className="w-[54px] h-[54px] rounded-2xl grid place-items-center text-white font-black"
                  style={{
                    background: "linear-gradient(135deg, #4562ee, #7f5cff)",
                    boxShadow: "0 16px 28px rgba(69,98,238,0.2)",
                  }}
                  aria-hidden="true"
                >
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-slate-950 mb-1">{step.title}</h3>
                  <p className="text-slate-700/80 font-semibold leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-7xl py-14" aria-labelledby="targets-title">
          <div className="rounded-[42px] p-8" style={glassCardStyle}>
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3">Execution targets</p>
              <h2 id="targets-title" className="text-4xl md:text-5xl font-black leading-[0.95] tracking-tight text-slate-950 max-w-4xl">
                This is not a passive course. It is a sprint.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {executionMetrics.map((metric) => (
                <div key={metric.value} className="rounded-3xl p-5 border" style={{ background: "rgba(247,247,255,0.82)", borderColor: "rgba(15,18,54,.08)" }}>
                  <strong className="block text-3xl font-black tracking-tight text-slate-950">{metric.value}</strong>
                  <span className="block mt-1 text-sm font-bold text-slate-600 leading-snug">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-4xl py-14" aria-labelledby="faq-title">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3">Questions people ask before buying</p>
            <h2 id="faq-title" className="text-4xl md:text-5xl font-black leading-[0.95] tracking-tight text-slate-950">
              Straight answers before anyone pays.
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div key={item.question} className="rounded-3xl border overflow-hidden bg-white/85" style={{ borderColor: "rgba(15,18,54,.08)" }}>
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-4 p-5 text-left font-black text-base text-slate-950 hover:bg-blue-50/20"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? -1 : index)}
                  aria-expanded={openFaqIndex === index}
                  aria-controls={`faq-content-${index}`}
                  id={`faq-button-${index}`}
                >
                  <span>{item.question}</span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-500 flex-shrink-0" aria-hidden="true" />
                  )}
                </button>
                <div
                  id={`faq-content-${index}`}
                  role="region"
                  aria-labelledby={`faq-button-${index}`}
                  className={`px-5 pb-5 text-slate-700/80 font-semibold leading-relaxed ${openFaqIndex === index ? "block" : "hidden"}`}
                >
                  {item.answer}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl p-5 mt-4 border bg-white/90" style={{ borderColor: "rgba(225,29,72,0.16)" }}>
            <p className="text-slate-800/90 font-semibold leading-relaxed">
              <strong className="text-rose-600">Important:</strong> AI may support research, drafting, editing and
              organisation, but AI must not be used to fabricate qualifications, work authorisation, degrees, software
              experience, references or employment results.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-7xl py-14" aria-label="Final call to action">
          <div
            className="rounded-[42px] p-8 md:p-12 text-white"
            style={{
              background:
                "radial-gradient(circle at 18% 22%, rgba(255,255,255,.24), transparent 26%)," +
                "linear-gradient(135deg, #070a2f, #263be3 56%, #7f5cff)",
              boxShadow: "0 28px 90px rgba(26,35,109,0.18)",
            }}
          >
            <h2 className="text-4xl md:text-5xl font-black leading-[0.95] tracking-tight text-white mb-3">
              Ready to stop applying randomly?
            </h2>
            <p className="text-white/80 text-lg font-semibold leading-relaxed max-w-4xl mb-6">
              Join the 30-Day Remote Job Search Sprint and build a structured campaign with recruiter-style
              positioning, stronger application assets and clearer daily execution.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="font-bold text-white"
                style={{ background: "linear-gradient(135deg, #4562ee, #3250e7)" }}
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              >
                Choose your package
              </Button>
              {defaultWhatsAppLink ? (
                <Button asChild size="lg" variant="outline">
                  <a href={defaultWhatsAppLink} target="_blank" rel="noreferrer" aria-label="Ask about packages on WhatsApp">
                    <MessageCircle className="h-4 w-4" />
                    Ask on WhatsApp
                  </a>
                </Button>
              ) : (
                <Button size="lg" variant="outline" disabled aria-label="WhatsApp contact currently unavailable">
                  <MessageCircle className="h-4 w-4" />
                  Ask on WhatsApp
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 max-w-7xl pb-28">
        <div className="text-sm font-semibold text-slate-700/75 leading-relaxed space-y-3">
          <p>
            <strong>30-Day Remote Job Search Sprint - Powered by Jobbyist.</strong> This is an employability and
            job-search execution service. It does not guarantee interviews, job offers, income, visas, sponsorship,
            freelance contracts or permanent remote work.
          </p>
          <p>
            Important disclaimer:
            <br />
            Past results do not guarantee future success. This service improves strategy, execution, and application
            quality, but employment outcomes depend on employer decisions, market conditions, role fit, candidate
            qualifications, interview performance, timing, and other factors outside the provider&apos;s control.
          </p>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-20 px-4 pb-4 pointer-events-none">
        <div className="container mx-auto max-w-7xl flex justify-center">
          <button
            type="button"
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            className="pointer-events-auto relative isolate w-full max-w-2xl rounded-3xl px-5 py-4 text-white font-black uppercase tracking-wide"
            style={{
              background: "linear-gradient(135deg, #4764f1, #3651e7)",
              boxShadow: "0 24px 56px rgba(69, 98, 238, 0.34)",
            }}
            aria-label="Compare sprint packages"
          >
            <span className="absolute -inset-[3px] -z-10 rounded-[26px] blur-lg opacity-70 bg-gradient-to-r from-cyan-300 via-purple-400 to-lime-300" aria-hidden="true" />
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Compare packages
            </span>
          </button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl rounded-[28px] p-6 sm:p-10" aria-label="Package checkout and enquiry dialog">
          <DialogHeader className="pr-8">
            <DialogTitle className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">Confirm your package</DialogTitle>
            <DialogDescription className="text-slate-700/80 font-semibold leading-relaxed">
              Review your selected package details, then continue to checkout or request support on WhatsApp.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-2xl border p-4 flex items-center justify-between gap-4 bg-slate-50">
              <span className="font-bold text-slate-700">Package</span>
              <span className="font-black text-blue-700">{selectedPackage.name}</span>
            </div>
            <div className="rounded-2xl border p-4 flex items-center justify-between gap-4 bg-slate-50">
              <span className="font-bold text-slate-700">Launch price</span>
              <span className="font-black text-blue-700">{selectedPackage.launchPrice}</span>
            </div>
            <div className="rounded-2xl border p-4 flex items-center justify-between gap-4 bg-slate-50">
              <span className="font-bold text-slate-700">Delivery window</span>
              <span className="font-black text-blue-700">30 days</span>
            </div>
          </div>

          <DialogFooter className="!flex-col gap-3">
            <Button asChild className="w-full text-white font-bold" style={{ background: "linear-gradient(135deg, #4562ee, #3250e7)" }}>
              <a
                href={CHECKOUT_LINKS[selectedPackage.id]}
                target="_blank"
                rel="noreferrer"
                aria-label={`Continue to checkout for ${selectedPackage.name}`}
              >
                Continue to checkout
              </a>
            </Button>
            {packageWhatsAppLink ? (
              <Button asChild variant="outline" className="w-full font-bold">
                <a
                  href={packageWhatsAppLink}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Enquire on WhatsApp about ${selectedPackage.name}`}
                >
                  Ask a question on WhatsApp
                </a>
              </Button>
            ) : (
              <Button variant="outline" className="w-full font-bold" disabled aria-label="WhatsApp contact currently unavailable">
                Ask a question on WhatsApp
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ThirtyDayJobSprint;
