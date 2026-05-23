import { FormEvent, useMemo, useState } from "react";
import { SEOHead, generateBreadcrumbSchema } from "@/components/SEOHead";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Download, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { submitLeadForm, validateEmail } from "@/lib/leadForms";

const WHITEPAPER_URL = "https://za.jobbyist.africa/whitepaper";
const WHITEPAPER_PDF_PATH = "/whitepaperassets/whitepaper2026-27.pdf";
const WHITEPAPER_VIDEO_PATH = "/whitepaperassets/whitepaper-explainer-video.mp4";
const WHITEPAPER_ACCESS_REQUEST_ENDPOINT =
  import.meta.env.VITE_WHITEPAPER_ACCESS_REQUEST_ENDPOINT ?? "";

type StakeholderType =
  | "Job seeker"
  | "Employer"
  | "Recruiter"
  | "Corporate partner"
  | "Government / public sector"
  | "NGO / development organisation"
  | "Media / research"
  | "Other";

type InterestArea =
  | "Full report access"
  | "Webinar series"
  | "Partnership opportunities"
  | "Recruitment Suite"
  | "Jobbyist Pro"
  | "Youth employment programmes"
  | "Sponsorship / funding"
  | "Media enquiry";

interface AccessRequestForm {
  fullName: string;
  email: string;
  organisation: string;
  roleTitle: string;
  stakeholderType: StakeholderType | "";
  interestArea: InterestArea | "";
  message: string;
}

const EMPTY_FORM: AccessRequestForm = {
  fullName: "",
  email: "",
  organisation: "",
  roleTitle: "",
  stakeholderType: "",
  interestArea: "",
  message: "",
};

const stakeholderOptions: StakeholderType[] = [
  "Job seeker",
  "Employer",
  "Recruiter",
  "Corporate partner",
  "Government / public sector",
  "NGO / development organisation",
  "Media / research",
  "Other",
];

const interestOptions: InterestArea[] = [
  "Full report access",
  "Webinar series",
  "Partnership opportunities",
  "Recruitment Suite",
  "Jobbyist Pro",
  "Youth employment programmes",
  "Sponsorship / funding",
  "Media enquiry",
];

const themeCards = [
  {
    title: "Labour Market at a Crossroads",
    copy: "South Africa’s labour market remains under pressure, particularly for youth and first-time entrants. The whitepaper frames this as a structural transition challenge that requires digital pathways, practical support and stronger matching between skills and demand.",
  },
  {
    title: "Platform Work and the Precariat",
    copy: "Platform work has expanded income pathways, but often without predictable protection, pay stability or visibility into algorithmic decisions. The report calls for balanced approaches that protect workers while supporting innovation and growth.",
  },
  {
    title: "Remote Work Maturity",
    copy: "Remote and hybrid work are now permanent features of professional life. The opportunity is real, but uneven access to power, broadband and digital tools still shapes who can participate.",
  },
  {
    title: "Digital Nomad and Global Talent Trends",
    copy: "Global demand for skills has increased cross-border work possibilities for South Africans. The report highlights the need for verified digital profiles and practical readiness signals that help candidates compete in distributed labour markets.",
  },
  {
    title: "Compliance in the Digital Workplace",
    copy: "As work decentralises, employers should revisit policies on data protection, workplace wellbeing, and remote-work governance. The whitepaper stresses careful compliance review rather than checkbox policy updates.",
  },
  {
    title: "PYEI and Pathways From Learning to Earning",
    copy: "The PYEI and National Pathway Management Network signal a pathway-led approach to youth inclusion. The report positions digital employment infrastructure as a bridge between programmes, employers and real opportunities.",
  },
  {
    title: "SME Growth and Industrial Deepening",
    copy: "SMEs remain central to job creation and economic depth. The whitepaper argues that hiring infrastructure, finance pathways and practical talent access should be treated as business enablers, not only social interventions.",
  },
  {
    title: "AI, Industry 5.0 and the 2027 Workforce",
    copy: "AI is reshaping task design, candidate screening and productivity expectations. The report encourages human-centred adoption that improves efficiency while keeping fairness, transparency and worker development in view.",
  },
];

const recommendationCards = [
  {
    title: "Job seekers",
    items: [
      "Build verifiable digital profiles with clear role readiness and portfolio signals.",
      "Combine job search with pathway planning, skills upgrades and interview discipline.",
      "Use free tools strategically and upgrade only when deeper support is needed.",
    ],
  },
  {
    title: "Employers and recruiters",
    items: [
      "Improve role clarity, salary transparency and response times in hiring workflows.",
      "Adopt structured digital screening with fairness checks and human oversight.",
      "Strengthen remote-work compliance reviews across OHS, tax and data practices.",
    ],
  },
  {
    title: "Corporate partners",
    items: [
      "Treat labour-market infrastructure as strategic value creation, not only CSR.",
      "Co-create pathways with credible operators and measurable youth inclusion outcomes.",
      "Blend ESD, co-funding and implementation support into practical delivery models.",
    ],
  },
  {
    title: "Policymakers",
    items: [
      "Support interoperable pathway infrastructure that reduces fragmentation.",
      "Enable data standards that improve matching quality and accountability.",
      "Align public initiatives with demand-led skilling and placement pipelines.",
    ],
  },
  {
    title: "Platform operators",
    items: [
      "Prioritise user trust, transparency and practical safety mechanisms.",
      "Design for affordability and inclusion without reducing service quality.",
      "Build clear routes from visibility to measurable opportunity outcomes.",
    ],
  },
  {
    title: "Education and skills providers",
    items: [
      "Map programme outcomes to real hiring demand and role requirements.",
      "Integrate career infrastructure, employer visibility and placement support.",
      "Track post-training progression, not only completion metrics.",
    ],
  },
];

const faqs = [
  {
    question: "What is the 2026/27 Jobbyist Whitepaper about?",
    answer:
      "It is Jobbyist’s strategic report on the democratisation of the African job market, with a South Africa-first lens on youth employment, digital labour-market transformation, platform work, remote work and inclusive growth pathways.",
  },
  {
    question: "Who should read the report?",
    answer:
      "The report is written for job seekers, employers, recruiters, corporate partners, public-sector stakeholders, development organisations, media and ecosystem builders shaping employment access.",
  },
  {
    question: "Is the full report free to download?",
    answer:
      "The report is available through an access-request process so Jobbyist can share the right supporting resources and webinar updates with relevant stakeholders.",
  },
  {
    question: "How can I request access to the webinar series?",
    answer:
      "Click “Request Webinar Access” or “Request Access To The Full Report” and complete the access form. The same request channel covers report and webinar updates.",
  },
  {
    question: "Is Jobbyist a recruitment agency?",
    answer:
      "No. Jobbyist is a digital employment and career infrastructure platform that supports visibility, matching, career tools and hiring access pathways for multiple stakeholder groups.",
  },
  {
    question: "Does Jobbyist guarantee jobs or interviews?",
    answer:
      "No. Jobbyist does not guarantee jobs, interviews, income, visas, sponsorships or hiring outcomes. Outcomes depend on multiple factors outside platform control.",
  },
  {
    question: "How can employers or partners work with Jobbyist?",
    answer:
      "Employers and partners can request access for full report briefings, webinar participation, partnership exploration, Recruitment Suite pathways and co-created youth employment initiatives.",
  },
];

const submitWhitepaperAccessRequest = async (payload: AccessRequestForm, honeypot = "") => {
  if (!WHITEPAPER_ACCESS_REQUEST_ENDPOINT) {
    const result = await submitLeadForm({
      formType: "Whitepaper access request",
      destination: "partnerships@jobbyist.africa",
      replyTo: payload.email,
      honeypot,
      fields: payload,
    });
    if (!result.ok) {
      throw new Error(result.error || "Unable to submit whitepaper request");
    }
    return { ok: true, placeholder: false };
  }

  const response = await fetch(WHITEPAPER_ACCESS_REQUEST_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status} ${response.statusText}`);
  }
  return { ok: true, placeholder: false };
};

const Whitepaper = () => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [videoUnavailable, setVideoUnavailable] = useState(false);
  const [form, setForm] = useState<AccessRequestForm>(EMPTY_FORM);
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const glassCard = useMemo<React.CSSProperties>(
    () => ({
      background: "rgba(255,255,255,0.84)",
      border: "1px solid rgba(15,18,54,0.08)",
      boxShadow: "0 18px 60px rgba(7,10,47,0.07)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
    }),
    [],
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Jobbyist South Africa", url: "https://za.jobbyist.africa" },
    { name: "Whitepaper", url: WHITEPAPER_URL },
  ]);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "2026/27 Jobbyist Whitepaper | The Democratisation of the African Job Market",
    url: WHITEPAPER_URL,
    description:
      "Download the 2026/27 Jobbyist Whitepaper on South Africa’s employment crossroads, platform work, remote work, youth employment, SME growth, AI and the future of African job-market infrastructure.",
    isPartOf: {
      "@type": "WebSite",
      name: "Jobbyist South Africa",
      url: "https://za.jobbyist.africa",
    },
  };

  const reportSchema = {
    "@context": "https://schema.org",
    "@type": "Report",
    name: "The 2026/27 Jobbyist Whitepaper: The Democratisation of the African Job Market",
    description:
      "A strategic whitepaper on South Africa’s labour-market transition, youth pathways, digital work, platform economy dynamics and inclusive employment infrastructure.",
    url: `https://za.jobbyist.africa${WHITEPAPER_PDF_PATH}`,
    inLanguage: "en-ZA",
    author: {
      "@type": "Organization",
      name: "Jobbyist",
      url: "https://za.jobbyist.africa",
    },
  };

  const setFormField = (field: keyof AccessRequestForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openAccessModal = () => setAccessModalOpen(true);

  const handleAccessSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = form.email.trim();
    const formElement = event.currentTarget;
    if (!formElement.checkValidity()) {
      formElement.reportValidity();
      return;
    }
    if (!form.stakeholderType || !form.interestArea) {
      toast.error("Please select stakeholder type and interest area.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitWhitepaperAccessRequest({ ...form, email }, honeypot);
      if (result.ok) {
        toast.success("Thanks. Your access request has been received.");
      }
      setForm(EMPTY_FORM);
      setHoneypot("");
      setAccessModalOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "We could not submit your request right now. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at 18% 24%, rgba(91,224,255,0.16) 0%, transparent 31%)," +
          "radial-gradient(circle at 76% 16%, rgba(127,92,255,0.12) 0%, transparent 27%)," +
          "radial-gradient(circle at 52% 68%, rgba(205,251,115,0.10) 0%, transparent 28%)," +
          "#f8f9ff",
      }}
    >
      <SEOHead
        title="2026/27 Jobbyist Whitepaper | The Democratisation of the African Job Market"
        description="Download the 2026/27 Jobbyist Whitepaper on South Africa’s employment crossroads, platform work, remote work, youth employment, SME growth, AI and the future of African job-market infrastructure."
        canonicalUrl={WHITEPAPER_URL}
        ogType="article"
        keywords={[
          "Jobbyist Whitepaper",
          "African job market",
          "South Africa unemployment",
          "youth employment",
          "remote work South Africa",
          "platform economy",
          "digital career infrastructure",
          "PYEI",
          "jobseeker-first platform",
          "Recruitment Suite",
          "Jobbyist Pro",
        ]}
        structuredData={[webPageSchema, reportSchema, breadcrumbSchema]}
      />

      <Navbar />

      <main className="pt-20 pb-16" aria-label="Whitepaper content">
        <section className="container mx-auto px-4 max-w-7xl py-14 md:py-20" aria-labelledby="whitepaper-hero-title">
          <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-10 items-center">
            <div>
              <Badge className="mb-5 bg-blue-50 text-blue-700 border-blue-200">
                2026/27 strategic outlook · South Africa to Africa
              </Badge>

              <h1
                id="whitepaper-hero-title"
                className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none mb-6 tracking-tight"
                style={{
                  transform: "skewX(-6deg)",
                  background: "linear-gradient(135deg, #070a2f 0%, #4562ee 60%, #7f5cff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Jobbyist Whitepaper 2026/27
              </h1>

              <p className="text-lg sm:text-xl font-bold mb-3 text-slate-800">
                The Democratisation of the African Job Market
              </p>
              <p className="text-base leading-relaxed text-slate-600 mb-8">
                The Democratisation of the African Job Market explores how South Africa can move from fragmented
                job search, youth unemployment and platform-work precarity toward a more inclusive, digital-first
                employment ecosystem. The report positions Jobbyist as a jobseeker-first career infrastructure
                platform built to improve access, visibility and opportunity across South Africa and the wider African
                job marketplace.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <div className="chatbot-gradient-border border border-transparent rounded-full p-[1px]">
                  <Button
                    size="lg"
                    className="rounded-full bg-white text-slate-900 hover:bg-white/95 font-bold"
                    onClick={() => setVideoModalOpen(true)}
                    aria-label="Watch the whitepaper explainer video"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Watch The Explainer Video
                  </Button>
                </div>

                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full"
                  onClick={openAccessModal}
                  aria-label="Request access to the full whitepaper report"
                >
                  Request Access To The Full Report
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "South Africa-focused",
                  "Jobseeker-first",
                  "Employer-ready",
                  "Digital labour-market infrastructure",
                  "2026/27 strategic outlook",
                ].map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border bg-white/70 text-slate-700 border-slate-200"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <aside className="rounded-[36px] p-7 relative overflow-hidden" style={glassCard}>
              <p className="text-xs font-black uppercase tracking-widest mb-3 text-slate-500">Focus areas</p>
              <p className="text-4xl font-black leading-none mb-2 text-slate-900">
                2026/27
                <span className="text-lg font-semibold ml-2 text-slate-500">whitepaper priorities</span>
              </p>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                Strategic pathways that connect job seekers, employers, recruiters, policymakers and ecosystem partners.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  "Youth employment",
                  "Remote work",
                  "Platform economy",
                  "SME growth",
                  "AI and digital infrastructure",
                  "Candidate visibility",
                ].map((item) => (
                  <div key={item} className="rounded-2xl p-3 bg-slate-50 border border-slate-200">
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-6xl py-12" aria-labelledby="executive-summary-title">
          <p className="text-xs font-black uppercase tracking-widest mb-3 text-blue-700">Executive summary</p>
          <h2 id="executive-summary-title" className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-6">
            South Africa’s labour market is at a structural crossroads.
          </h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              The whitepaper argues that persistent unemployment, especially among young people, cannot be solved by
              legacy recruitment models alone. South Africa’s labour-market challenge is increasingly about visibility,
              navigability and practical pathways from learning to earning.
            </p>
            <p>
              Remote work, platform labour and AI-enabled hiring systems are creating new routes into work while also
              creating new exclusions. Candidates without strong digital signals, stable connectivity or clear market
              positioning are often left behind in systems that reward discoverability and speed.
            </p>
            <p>
              The report highlights risks that now sit at the centre of employment strategy: algorithmic opacity,
              wage insecurity in platform contexts, privacy and data-management pressure, compliance blind spots and
              burnout in distributed work environments.
            </p>
            <p>
              In this environment, Jobbyist is positioned as practical employment infrastructure: accessible tools for
              job discovery, candidate visibility, career management and employer-recruiter access, with affordability
              designed for ordinary South Africans.
            </p>
            <p>
              The strategy is ecosystem-driven rather than platform-isolated. The report encourages stronger links
              between job seekers, employers, recruiters, youth pathways, skilling systems and private-sector partners
              so that digital participation can translate into real opportunity.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-7xl py-12" aria-labelledby="key-themes-title">
          <p className="text-xs font-black uppercase tracking-widest mb-3 text-blue-700">Key themes</p>
          <h2 id="key-themes-title" className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-8">
            Strategic insights from the 2026/27 whitepaper
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {themeCards.map((card) => (
              <Card key={card.title} className="rounded-[24px] border-slate-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-black text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{card.copy}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-6xl py-12" aria-labelledby="strategic-context-title">
          <h2 id="strategic-context-title" className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-5">
            Strategic context for 2026/27
          </h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              South Africa enters 2026/27 with continued labour-market strain, high youth exclusion and uneven growth.
              The policy direction around inclusive growth, public-private coordination and pathway-based youth inclusion
              creates a meaningful opening for better digital employment infrastructure.
            </p>
            <p>
              Programmes linked to PYEI and the National Pathway Management Network point to a systems approach:
              connecting youth with guidance, opportunities and progression support instead of one-off placement logic.
            </p>
            <p>
              Operation Vulindlela’s reform agenda reinforces why infrastructure matters beyond roads and ports. Digital
              infrastructure, execution capability and interoperable systems increasingly determine whether labour-market
              platforms can scale inclusion or reproduce exclusion.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-6xl py-12" aria-labelledby="platform-economy-title">
          <h2 id="platform-economy-title" className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-5">
            Platform economy: opportunity, risk and design choices
          </h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              Architects, technologists, cloud consultants, gig workers, micro-task contributors and content creators
              are participating in a platform-shaped economy where visibility and reputation signals are increasingly
              valuable. In many categories, platform creators and platform users experience very different power and
              reward dynamics.
            </p>
            <p>
              The report distinguishes clearly between digital ownership and digital participation: building the platform
              is not the same as depending on it for income. That distinction matters for policy, worker protection and
              practical market design.
            </p>
            <p>
              Algorithmic management can improve efficiency, but it can also reduce worker agency when ranking logic,
              de-prioritisation triggers or dispute pathways are unclear. The whitepaper supports worker-protection
              guardrails that preserve innovation rather than suppress it.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-6xl py-12" aria-labelledby="remote-work-title">
          <h2 id="remote-work-title" className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-5">
            Remote work and the digital workplace
          </h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              Remote work is now a sustained operating model across many sectors, not a temporary adjustment. South
              Africa remains relevant to global remote-work ecosystems because of talent depth, time-zone fit and
              increasing digital participation.
            </p>
            <p>
              The report also highlights constraints that still shape access: load-shedding exposure, broadband
              inequality, device limitations and rural connectivity gaps. Digital opportunity can scale quickly, but so
              can digital exclusion when infrastructure is uneven.
            </p>
            <p>
              Employers should consider practical compliance and wellbeing frameworks for distributed teams, including
              right-to-disconnect policy design, OHS and home-ergonomics considerations, SARS home-office treatment,
              POPIA-aligned data handling and proactive burnout check-ins. Compliance teams should review obligations in
              context with qualified legal, tax and labour specialists.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-6xl py-12" aria-labelledby="partnerships-title">
          <h2 id="partnerships-title" className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-5">
            PYEI, SME growth and partnership pathways
          </h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              The whitepaper aligns with pathway-centred thinking across PYEI and the National Pathway Management
              Network: demand-led skilling, local ecosystem enablement and practical transitions into earning activity.
              It frames National Youth Service and related initiatives as ecosystem levers when integrated with credible
              digital employment infrastructure.
            </p>
            <p>
              For SMEs, the report stresses practical enablement: easier access to discoverable talent, better hiring
              workflows, and partnership-led support models that include implementation readiness, not only funding.
            </p>
            <p>
              For corporates and development finance stakeholders, pathways may include ESD-linked collaboration,
              co-funding models, and partnerships aligned with institutions such as IDC, NYDA, Sefa and NEF where
              appropriate. The core message is strategic: labour-market infrastructure should be treated as growth
              architecture, not short-term charity.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-6xl py-12" aria-labelledby="jobbyist-solution-title">
          <h2 id="jobbyist-solution-title" className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-6">
            The Jobbyist solution in this ecosystem
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              "Job discovery pathways across South Africa and broader African opportunity channels",
              "Career management tools that support practical progression, not one-click applications only",
              "Candidate profiles and verified professional visibility to improve discoverability",
              "Remote-job readiness support for distributed and cross-border digital work contexts",
              "Employer and recruiter access pathways through Recruitment Suite",
              "Jobbyist Pro depth support for job seekers who need stronger market positioning",
              "Affordable access design with meaningful free-tier utility and premium upgrade options",
            ].map((item) => (
              <div key={item} className="rounded-2xl p-4 border border-slate-200 bg-white/80 backdrop-blur-sm">
                <p className="text-slate-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-5">
            Jobbyist does not guarantee jobs, interviews, income, visas, sponsorships or hiring outcomes.
          </p>
        </section>

        <section className="container mx-auto px-4 max-w-7xl py-12" aria-labelledby="recommendations-title">
          <h2 id="recommendations-title" className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-8">
            Strategic recommendations
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendationCards.map((card) => (
              <Card key={card.title} className="rounded-[24px] border-slate-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-black text-slate-900 mb-3 capitalize">{card.title}</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {card.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden="true">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-6xl py-12" aria-labelledby="webinar-title">
          <Card className="rounded-[30px] border-slate-200 bg-white/85 backdrop-blur-sm">
            <CardContent className="p-8 md:p-10">
              <p className="text-xs font-black uppercase tracking-widest mb-3 text-blue-700">Webinar series</p>
              <h2 id="webinar-title" className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-3">
                Join the 2026/27 Whitepaper Webinar Series
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Request access to upcoming sessions unpacking the report for employers, recruiters, job seekers,
                corporate partners, sponsors, public-sector stakeholders and development organisations.
              </p>
              <Button size="lg" className="rounded-full" onClick={openAccessModal}>
                Request Webinar Access
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto px-4 max-w-7xl py-12" aria-labelledby="final-cta-title">
          <div className="rounded-[36px] p-8 md:p-10 border border-slate-200 bg-gradient-to-r from-blue-50/80 via-cyan-50/80 to-lime-50/70">
            <h2 id="final-cta-title" className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-3">
              Download The Full Report
            </h2>
            <p className="text-slate-700 leading-relaxed mb-6 max-w-3xl">
              Access the 2026/27 Jobbyist Whitepaper and request the extended webinar and resource series. Jobbyist is
              a jobseeker-first platform helping democratise access to opportunity across South Africa and Africa.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <a href={WHITEPAPER_PDF_PATH} target="_blank" rel="noopener noreferrer" aria-label="Download the full whitepaper PDF">
                  <Download className="h-4 w-4" />
                  Download The Full Report
                </a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" onClick={openAccessModal}>
                Request Access To The Full Report &amp; Webinar Series
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-6xl py-12" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-6">
            Frequently asked questions
          </h2>
          <Card className="border-slate-200 bg-white/85 backdrop-blur-sm">
            <CardContent className="p-6">
              <Accordion type="single" collapsible>
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-semibold text-slate-900">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto px-4 max-w-6xl py-8" aria-labelledby="source-notes-title">
          <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <h2 id="source-notes-title" className="text-2xl font-black tracking-tight text-slate-900">
                Source notes
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                This page summarises the 2026/27 Jobbyist Whitepaper and draws on public labour-market, policy, digital-work,
                and development-finance references. Figures and policy interpretation should be read with the underlying
                official publications.
              </p>
              <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
                <li>
                  Statistics South Africa (Quarterly Labour Force Survey):
                  {" "}
                  <a className="underline hover:text-slate-900" href="https://www.statssa.gov.za" target="_blank" rel="noopener noreferrer">statssa.gov.za</a>
                </li>
                <li>
                  Presidential Youth Employment Intervention and SAYouth:
                  {" "}
                  <a className="underline hover:text-slate-900" href="https://www.thepresidency.gov.za/node/4891" target="_blank" rel="noopener noreferrer">The Presidency</a>
                  {" / "}
                  <a className="underline hover:text-slate-900" href="https://sayouth.mobi" target="_blank" rel="noopener noreferrer">SAYouth.mobi</a>
                </li>
                <li>
                  Operation Vulindlela:
                  {" "}
                  <a className="underline hover:text-slate-900" href="https://www.stateofthenation.gov.za/operation-vulindlela" target="_blank" rel="noopener noreferrer">stateofthenation.gov.za</a>
                </li>
                <li>
                  SARS home-office guidance:
                  {" "}
                  <a className="underline hover:text-slate-900" href="https://www.sars.gov.za/types-of-tax/personal-income-tax/filing-season/home-office-expenses/" target="_blank" rel="noopener noreferrer">sars.gov.za</a>
                </li>
                <li>
                  POPIA and Information Regulator resources:
                  {" "}
                  <a className="underline hover:text-slate-900" href="https://www.inforegulator.org.za" target="_blank" rel="noopener noreferrer">inforegulator.org.za</a>
                </li>
                <li>
                  Wider comparative references:
                  {" "}
                  <a className="underline hover:text-slate-900" href="https://www.ilo.org" target="_blank" rel="noopener noreferrer">ILO</a>
                  {" · "}
                  <a className="underline hover:text-slate-900" href="https://www.worldbank.org" target="_blank" rel="noopener noreferrer">World Bank</a>
                  {" · "}
                  <a className="underline hover:text-slate-900" href="https://www.oecd.org" target="_blank" rel="noopener noreferrer">OECD</a>
                  {" · "}
                  <a className="underline hover:text-slate-900" href="https://www.weforum.org" target="_blank" rel="noopener noreferrer">World Economic Forum</a>
                </li>
              </ul>
              <p className="text-xs text-slate-500 leading-relaxed">
                The whitepaper and this page are provided for information and strategic discussion only and do not
                constitute legal, labour-law, tax or financial advice. Employers and partners should seek qualified
                professional advice for compliance and implementation decisions.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />

      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Watch The Explainer</DialogTitle>
            <DialogDescription>
              2026/27 Jobbyist Whitepaper explainer video.
            </DialogDescription>
          </DialogHeader>
          {!videoUnavailable ? (
            <video
              controls
              playsInline
              className="w-full rounded-lg bg-black"
              onError={() => setVideoUnavailable(true)}
              aria-label="Whitepaper explainer video player"
            >
              <source src={WHITEPAPER_VIDEO_PATH} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p className="text-sm text-slate-600">
              The explainer video is currently unavailable. Please request access below and our team will share the latest viewing link.
            </p>
          )}
          <Button variant="outline" onClick={openAccessModal} className="w-full">
            Request Access To The Full Report
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={accessModalOpen} onOpenChange={setAccessModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Access To The Full Report &amp; Webinar Series</DialogTitle>
            <DialogDescription>
              Complete the form below and we’ll share access details and relevant updates.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAccessSubmit}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="wp-full-name">Full name *</Label>
                <Input
                  id="wp-full-name"
                  required
                  value={form.fullName}
                  onChange={(event) => setFormField("fullName")(event.target.value)}
                  maxLength={120}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wp-email">Email address *</Label>
                <Input
                  id="wp-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => setFormField("email")(event.target.value)}
                  maxLength={255}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="wp-org">Organisation / company *</Label>
                <Input
                  id="wp-org"
                  required
                  value={form.organisation}
                  onChange={(event) => setFormField("organisation")(event.target.value)}
                  maxLength={150}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wp-role">Role title</Label>
                <Input
                  id="wp-role"
                  value={form.roleTitle}
                  onChange={(event) => setFormField("roleTitle")(event.target.value)}
                  maxLength={100}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="wp-stakeholder">Stakeholder type *</Label>
                <Select value={form.stakeholderType} onValueChange={setFormField("stakeholderType")}>
                  <SelectTrigger id="wp-stakeholder" aria-label="Select stakeholder type" aria-required="true">
                    <SelectValue placeholder="Select stakeholder type" />
                  </SelectTrigger>
                  <SelectContent>
                    {stakeholderOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wp-interest">Interest area *</Label>
                <Select value={form.interestArea} onValueChange={setFormField("interestArea")}>
                  <SelectTrigger id="wp-interest" aria-label="Select interest area" aria-required="true">
                    <SelectValue placeholder="Select interest area" />
                  </SelectTrigger>
                  <SelectContent>
                    {interestOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wp-message">Optional message</Label>
              <Textarea
                id="wp-message"
                value={form.message}
                onChange={(event) => setFormField("message")(event.target.value)}
                rows={4}
                maxLength={1000}
              />
            </div>
            <div className="hidden" aria-hidden="true">
              <Label htmlFor="wp-website">Website</Label>
              <Input
                id="wp-website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !form.stakeholderType || !form.interestArea}
              className="w-full"
            >
              {isSubmitting ? "Submitting request..." : "Submit access request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Whitepaper;
