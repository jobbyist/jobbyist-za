import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead, generateBreadcrumbSchema } from "@/components/SEOHead";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, CheckCircle2, FileCheck2, FileText, Globe, MessageSquareText, Sparkles, Upload, Wand2 } from "lucide-react";
import { toast } from "sonner";

type ResumeAuditResponse = {
  summary?: string;
  score?: number;
  reportUrl?: string;
};

type AccessGateKind = "login" | "verify" | "pro" | null;

const resumeServices = [
  {
    Icon: FileCheck2,
    title: "Free Resume/CV Audit",
    description:
      "Upload your current Resume/CV and receive practical recommendations to improve structure, clarity, keywords, achievements, and overall presentation.",
  },
  {
    Icon: Sparkles,
    title: "Resume/CV Templates",
    description:
      "Choose clean, professional templates designed to help your experience read clearly across recruiters, hiring managers, and screening systems.",
  },
  {
    Icon: Globe,
    title: "Resume/CV Website Builder",
    description:
      "Create a personal Resume/CV website with a free .cv domain included, giving employers a polished place to view your career profile online.",
  },
  {
    Icon: FileText,
    title: "Resume/CV Generator",
    description:
      "Generate polished Resume/CV files in PDF and Word document formats, ready for job portals, direct applications, and recruiter requests.",
  },
  {
    Icon: Wand2,
    title: "Job/Industry-Specific Cover Letters",
    description:
      "Create targeted cover letters that match the role, industry, and employer instead of sending the same tired paragraph everywhere.",
  },
  {
    Icon: MessageSquareText,
    title: "Interview Preparation Packs",
    description:
      "Prepare with role-specific interview questions, answer frameworks, talking points, and confidence-building guidance before the real conversation.",
  },
];

const processSteps = [
  {
    title: "Upload or start fresh",
    description: "Begin with your existing Resume/CV or build a new one from your career details.",
  },
  {
    title: "Get clear recommendations",
    description: "Receive practical guidance on what to improve, remove, rewrite, or strengthen.",
  },
  {
    title: "Build your application pack",
    description:
      "Create your Resume/CV, cover letter, website profile, and interview preparation materials.",
  },
  {
    title: "Apply with confidence",
    description:
      "Download polished files, share your online profile, and walk into interviews better prepared.",
  },
];

const RESUME_BUILDER_ONBOARDING_URL =
  "https://profiles.jobbyist.africa/onboarding/resume-builder?source=jobbyist-resume-assistance";
const PAGE_URL = "https://za.jobbyist.africa/resume-cv-assistance";
const PROFILE_COMPLETION_REQUIRED = 100;

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { hasActiveSubscription, loading: subscriptionLoading } = useSubscription();

  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [accessGate, setAccessGate] = useState<AccessGateKind>(null);
  const [submittingAudit, setSubmittingAudit] = useState(false);
  const [auditResponse, setAuditResponse] = useState<ResumeAuditResponse | null>(null);
  const [auditServerMessage, setAuditServerMessage] = useState<string>("");

  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [notes, setNotes] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const isAuthenticated = Boolean(user);
  const isProfileVerified = Boolean(
    profile?.verification_status === "approved" && profile?.profile_completion === PROFILE_COMPLETION_REQUIRED
  );
  const isPro = hasActiveSubscription("jobseeker_pro");
  const isProVerified = isProfileVerified && isPro;
  const loadingAccess = authLoading || (isAuthenticated && (profileLoading || subscriptionLoading));

  const currentUserFullName = useMemo(() => {
    const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim();
    return name || user?.user_metadata?.full_name || user?.user_metadata?.name || "";
  }, [profile?.first_name, profile?.last_name, user?.user_metadata]);

  const currentUserEmail = user?.email ?? "";

  const accessGateCopy = useMemo(() => {
    if (accessGate === "login") {
      return {
        title: "Sign in required",
        description: "Please sign in to continue with this action.",
        actionLabel: "Go to Sign In",
        action: () => navigate("/auth"),
      };
    }
    if (accessGate === "verify") {
      return {
        title: "Profile verification required",
        description:
          "Please complete and verify your profile before continuing. This helps us provide better quality support.",
        actionLabel: "Go to Profile Verification",
        action: () => navigate("/profile"),
      };
    }
    return {
      title: "Jobbyist Pro required",
      description:
        "This action is available to active verified Jobbyist Pro members. Upgrade to unlock the full assistance suite.",
      actionLabel: "View Jobbyist Pro",
      action: () => navigate("/pro"),
    };
  }, [accessGate, navigate]);

  const openAccessGate = (gate: AccessGateKind) => {
    setAccessGate(gate);
    setAccessModalOpen(true);
  };

  const openAuditModal = () => {
    setAuditResponse(null);
    setAuditServerMessage("");
    setFullName(currentUserFullName);
    setEmailAddress(currentUserEmail);
    setTargetRole("");
    setExperienceLevel("");
    setNotes("");
    setResumeFile(null);
    setAuditModalOpen(true);
  };

  const handleBuildResume = () => {
    if (loadingAccess) return;
    if (!isAuthenticated) {
      openAccessGate("login");
      return;
    }
    if (!isProfileVerified) {
      openAccessGate("verify");
      return;
    }
    if (!isProVerified) {
      openAccessGate("pro");
      return;
    }
    window.location.assign(RESUME_BUILDER_ONBOARDING_URL);
  };

  const handleStartAudit = () => {
    if (loadingAccess) return;
    if (!isAuthenticated) {
      openAccessGate("login");
      return;
    }
    if (!isProfileVerified) {
      openAccessGate("verify");
      return;
    }
    openAuditModal();
  };

  const handleAuditFileChange = (file: File | undefined) => {
    if (!file) return;
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const filename = file.name.toLowerCase();
    const hasAllowedExtension = allowedExtensions.some((ext) => filename.endsWith(ext));

    if (!hasAllowedExtension) {
      toast.error("Please upload a PDF or Word document.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be 5MB or less.");
      return;
    }
    setResumeFile(file);
  };

  const handleAuditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuditServerMessage("");
    setAuditResponse(null);

    if (!fullName.trim() || !emailAddress.trim() || !targetRole.trim() || !experienceLevel.trim()) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (!resumeFile) {
      toast.error("Please upload your Resume/CV.");
      return;
    }

    setSubmittingAudit(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("email", emailAddress.trim());
      formData.append("targetRole", targetRole.trim());
      formData.append("experienceLevel", experienceLevel.trim());
      formData.append("notes", notes.trim());
      formData.append("resume", resumeFile);
      formData.append("source", "jobbyist-resume-assistance");

      const response = await fetch("/api/resume-audit", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.status === 401) {
        setAuditServerMessage("Please sign in to request your free audit.");
        return;
      }

      if (response.status === 403) {
        setAuditServerMessage("Please verify your profile before requesting your free audit.");
        return;
      }

      if (!response.ok) {
        throw new Error(`We could not generate your audit right now. Please try again. (${response.status})`);
      }

      const data = (await response.json()) as ResumeAuditResponse;
      setAuditResponse(data || {});
      setAuditServerMessage("Your free audit is ready.");
      toast.success("Your free audit is ready.");
    } catch (error) {
      console.error("Resume audit submission failed:", error);
      const message =
        error instanceof Error ? error.message : "We could not generate your audit right now. Please try again.";
      setAuditServerMessage(message);
      toast.error(message);
    } finally {
      setSubmittingAudit(false);
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Jobbyist AI-Assisted, Human-Reviewed Resume/CV Assistance",
    description:
      "Get AI-assisted, human-reviewed resume/CV support from Jobbyist, including free audits, templates, resume websites, PDF/Word generation, cover letters, and interview preparation packs.",
    provider: {
      "@type": "Organization",
      name: "Jobbyist",
      url: "https://za.jobbyist.africa",
    },
    areaServed: {
      "@type": "Country",
      name: "South Africa",
    },
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Jobbyist South Africa", url: "https://za.jobbyist.africa" },
    { name: "Resume/CV Assistance", url: PAGE_URL },
  ]);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Resume/CV Assistance | Jobbyist"
        description="Get AI-assisted, human-reviewed resume/CV support from Jobbyist, including free audits, templates, resume websites, PDF/Word generation, cover letters, and interview preparation packs."
        canonicalUrl={PAGE_URL}
        ogType="website"
        keywords={[
          "resume cv assistance",
          "resume audit South Africa",
          "cv templates",
          "cv website",
          "cover letters",
          "interview preparation",
          "Jobbyist",
        ]}
        structuredData={[serviceSchema, breadcrumbSchema]}
      />

      <Navbar />

      <main className="pt-20">
        <section
          className="container mx-auto px-4 max-w-7xl py-14 md:py-20"
          aria-labelledby="resume-assistance-hero-title"
        >
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 md:gap-10 items-center">
            <div>
              <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
                AI-Assisted, Human-Reviewed Resume/CV Assistance
              </Badge>
              <h1
                id="resume-assistance-hero-title"
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-5"
              >
                Turn your experience into a job-winning Resume/CV.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-3xl">
                Get a cleaner, stronger, and more targeted application package with AI-assisted tools and
                human-reviewed guidance. Start with a free Resume/CV audit, then upgrade when you are ready
                for templates, PDF/Word resume generation, a personal .cv website, tailored cover letters, and
                interview preparation packs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="gradient-brand text-primary-foreground" onClick={handleBuildResume} disabled={loadingAccess}>
                  Build My Resume/CV
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={handleStartAudit} disabled={loadingAccess}>
                  Free Resume/CV Audit
                </Button>
              </div>
            </div>

            <aside className="rounded-[32px] border border-blue-100 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(59,130,246,0.12)] relative overflow-hidden">
              <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-cyan-100/70 blur-2xl" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Access snapshot</p>
              <h2 className="text-2xl font-black text-slate-900 mb-5">Start free. Upgrade when ready.</h2>
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-sm font-semibold text-slate-900">Free Resume/CV Audit</p>
                  <p className="text-sm text-slate-600">Available for logged-in, verified profiles.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-sm font-semibold text-slate-900">Full Resume/CV Builder Suite</p>
                  <p className="text-sm text-slate-600">Available for active verified Jobbyist Pro members.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-sm font-semibold text-slate-900">Status</p>
                  <p className="text-sm text-slate-600">
                    {loadingAccess
                      ? "Checking access..."
                      : isProVerified
                        ? "You have full access."
                        : isProfileVerified
                          ? "You can start with a free audit."
                          : "Sign in and verify your profile to begin."}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="py-14 md:py-20 bg-slate-50/70" aria-labelledby="access-section-title">
          <div className="container mx-auto px-4 max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-700 mb-2">Access</p>
            <h2 id="access-section-title" className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Start free, upgrade when you are ready to apply seriously.
            </h2>
            <p className="text-slate-600 max-w-4xl mb-8">
              Your free audit helps you see what needs work. Jobbyist Pro unlocks the full assistance suite
              for a polished Resume/CV, personal .cv website, tailored cover letters, and interview preparation support.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-blue-100 bg-white shadow-[0_14px_40px_rgba(59,130,246,0.08)]">
                <CardHeader>
                  <CardTitle className="text-xl">Free Resume/CV Audit</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600">
                    Upload your current Resume/CV and receive clear recommendations on structure, wording,
                    relevance, formatting, and missing career evidence.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="border-blue-100 bg-white shadow-[0_14px_40px_rgba(59,130,246,0.08)]">
                <CardHeader>
                  <CardTitle className="text-xl">Full Resume/CV Assistance Suite</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600">
                    Build a professional Resume/CV, choose templates, generate PDF and Word versions, launch a
                    personal .cv website, and get support for cover letters and interviews.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="border-blue-100 bg-white shadow-[0_14px_40px_rgba(59,130,246,0.08)]">
                <CardHeader>
                  <CardTitle className="text-xl">Guided career positioning</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600">
                    Shape your experience around the jobs you want, not just the duties you have done.
                    Stronger positioning means stronger applications.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 bg-white" aria-labelledby="services-section-title">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 id="services-section-title" className="text-3xl md:text-4xl font-black text-slate-900 mb-8">
              Services built to strengthen every part of your application.
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumeServices.map(({ Icon, title, description }) => (
                <Card key={title} className="border-blue-100 bg-white shadow-[0_16px_45px_rgba(6,95,212,0.10)]">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center mb-3">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600">{description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 bg-slate-50/70" aria-labelledby="how-it-works-title">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 id="how-it-works-title" className="text-3xl md:text-4xl font-black text-slate-900 mb-8">
              From career chaos to application-ready in four steps.
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <Card key={step.title} className="border-blue-100 bg-white shadow-[0_14px_40px_rgba(59,130,246,0.08)]">
                  <CardHeader>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold mb-3">
                      {index + 1}
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600">{step.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 bg-white" aria-labelledby="what-you-get-title">
          <div className="container mx-auto px-4 max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-700 mb-2">What you get</p>
            <h2 id="what-you-get-title" className="text-3xl md:text-4xl font-black text-slate-900 mb-8">
              A complete application upgrade, not just a prettier document.
            </h2>
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-blue-100 bg-white shadow-[0_16px_45px_rgba(6,95,212,0.10)]">
                <CardHeader>
                  <CardTitle className="text-2xl">Resume/CV Builder</CardTitle>
                  <CardDescription className="text-slate-600">
                    Create a stronger Resume/CV from your career details, then export clean versions for different application channels.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    {[
                      "Professional templates for different career levels",
                      "PDF and Word document generation",
                      "ATS-conscious content structure",
                      "Personal Resume/CV website with free .cv domain included",
                    ].map((item) => (
                      <li key={item} className="flex gap-2 items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-blue-100 bg-white shadow-[0_16px_45px_rgba(6,95,212,0.10)]">
                <CardHeader>
                  <CardTitle className="text-2xl">Application Support Packs</CardTitle>
                  <CardDescription className="text-slate-600">
                    Go beyond the Resume/CV with tailored cover letters and interview preparation packs built around your target job and industry.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700">
                    {[
                      "Job and industry-specific cover letters",
                      "Interview question packs and answer frameworks",
                      "Career positioning recommendations",
                      "Human-reviewed guidance for higher-quality applications",
                    ].map((item) => (
                      <li key={item} className="flex gap-2 items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 bg-slate-50/70" aria-labelledby="resume-assistance-final-cta-title">
          <div className="container mx-auto px-4 max-w-7xl">
            <Card className="border-0 rounded-[32px] bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_20px_65px_rgba(14,116,244,0.35)]">
              <CardHeader className="text-center pb-3">
                <CardTitle id="resume-assistance-final-cta-title" className="text-3xl md:text-4xl font-black">
                  Ready to stop sending weak applications?
                </CardTitle>
                <CardDescription className="text-white/90 text-base md:text-lg max-w-3xl mx-auto">
                  Start with a free Resume/CV audit, then upgrade to build a complete application pack that helps you show up sharper, clearer, and better prepared.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90" onClick={handleStartAudit} disabled={loadingAccess}>
                  Get My Free Resume/CV Audit
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />

      <Dialog open={auditModalOpen} onOpenChange={setAuditModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Free Resume/CV Audit</DialogTitle>
            <DialogDescription>
              Upload your current Resume/CV and tell us what role you are targeting. You will receive practical recommendations to help improve your application before you send it.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAuditSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="audit-full-name">Full name</Label>
              <Input
                id="audit-full-name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="audit-email">Email address</Label>
              <Input
                id="audit-email"
                type="email"
                value={emailAddress}
                onChange={(event) => setEmailAddress(event.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="audit-role">Target role</Label>
              <Input
                id="audit-role"
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                placeholder="e.g. Operations Coordinator"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="audit-experience-level">Experience level</Label>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger id="audit-experience-level">
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry-level">Entry level</SelectItem>
                  <SelectItem value="mid-level">Mid-level</SelectItem>
                  <SelectItem value="senior-level">Senior level</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                  <SelectItem value="career-switcher">Career switcher</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="audit-upload">Resume/CV upload</Label>
              <Input
                id="audit-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(event) => handleAuditFileChange(event.target.files?.[0])}
                required
              />
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Upload className="h-3.5 w-3.5" />
                Accepted file types: .pdf, .doc, .docx · Max file size: 5MB
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="audit-notes">Notes field</Label>
              <Textarea
                id="audit-notes"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Anything specific you want us to focus on?"
              />
            </div>

            {auditServerMessage && (
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                {auditServerMessage}
              </div>
            )}

            {auditResponse && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 space-y-2">
                <p className="font-semibold text-green-800">Your free audit is ready.</p>
                {typeof auditResponse.score === "number" && (
                  <p className="text-sm text-green-700">Current score: {auditResponse.score}/100</p>
                )}
                {auditResponse.summary && <p className="text-sm text-green-700">{auditResponse.summary}</p>}
                {auditResponse.reportUrl && (
                  <a
                    href={auditResponse.reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-blue-700 hover:underline"
                  >
                    View full report
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </a>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={submittingAudit}>
              {submittingAudit ? "Generating..." : "Generate Free Audit"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={accessModalOpen} onOpenChange={setAccessModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{accessGateCopy.title}</DialogTitle>
            <DialogDescription>{accessGateCopy.description}</DialogDescription>
          </DialogHeader>
          <div className="pt-2 flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setAccessModalOpen(false)}>
              Not now
            </Button>
            <Button
              onClick={() => {
                setAccessModalOpen(false);
                accessGateCopy.action();
              }}
            >
              {accessGateCopy.actionLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeBuilder;
