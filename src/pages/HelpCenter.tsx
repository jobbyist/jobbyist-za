import { FormEvent, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HelpCircle, LifeBuoy, Mail } from "lucide-react";
import { toast } from "sonner";
import { submitLeadForm, validateEmail } from "@/lib/forms";

const faqs = [
  {
    q: "What is Jobbyist?",
    a: "Jobbyist is South Africa's premier career management and job discovery platform. We aggregate premium job listings, provide AI-powered career tools, and support jobseekers with resources, coaching and interview preparation.",
  },
  {
    q: "Is Jobbyist free to use?",
    a: "You can browse Premium job listings on Jobbyist for free. To apply directly through Jobbyist you'll need a Jobbyist Pro subscription (R99/month). Free users can also apply to aggregated jobs at our Career Hub at careers.jobbyist.co.za.",
  },
  {
    q: "How do I create an account?",
    a: "Click 'Sign In' in the top right and choose email + password, magic link, or Google sign-in. New accounts are verified via a one-time email link before you can apply for jobs.",
  },
  {
    q: "What does Jobbyist Pro include?",
    a: "Unlimited job applications, AI Job Matcher, all Resource Center content (interview packs, CV templates, roadmaps, salary guides), ad-free browsing, personalised WhatsApp job alerts and the Application Tracker.",
  },
  {
    q: "How much does Jobbyist Pro cost?",
    a: "Jobbyist Pro is R99 per month, billed via Paystack. You can cancel any time from your dashboard.",
  },
  {
    q: "Can I apply for jobs without a Pro subscription?",
    a: "Direct applications on Jobbyist are reserved for Pro members. Free users can still visit our Career Hub at careers.jobbyist.co.za to apply for aggregated job listings at no cost.",
  },
  {
    q: "How do I set my job preferences?",
    a: "During onboarding you'll choose your preferred industries, job types and up to 5 job titles. You can update these anytime from your Profile page — your job feed and alerts update automatically.",
  },
  {
    q: "What is the 90-Day Job Sprint?",
    a: "A premium, hands-on placement service where a senior placement expert builds and executes a personalised job-search campaign to land you at least 4 verified interviews within 90 days. Visit /sprint for details.",
  },
  {
    q: "How do I save or report a job?",
    a: "On any job listing use the Save button to bookmark it to your dashboard, or the Report button to flag misleading or fraudulent postings for our trust & safety team.",
  },
  {
    q: "How do I enable Multi-Factor Authentication (MFA)?",
    a: "Go to your Profile → Account Security card and follow the TOTP setup. Once enabled, you'll be prompted for a code from your authenticator app on every sign-in.",
  },
  {
    q: "How do I delete my account?",
    a: "Open Profile → Account Security → Delete my account. This permanently removes your profile, applications, saved jobs and preferences.",
  },
  {
    q: "How do I receive personalised WhatsApp job alerts?",
    a: "Opt in during onboarding or from your Profile page and join our WhatsApp channel. Personalised alerts are available to Jobbyist Pro members.",
  },
  {
    q: "Where do employers post jobs?",
    a: "Employers can request access to our Recruitment Suite. Visit /recruitment-suite to learn more or contact us via the form below.",
  },
  {
    q: "How is my data protected?",
    a: "We follow POPIA and industry-standard security practices. Read our Privacy policy and Data Rights pages for full details.",
  },
  {
    q: "I still need help — how do I reach support?",
    a: "Fill in the contact form below and our support team will get back to you within 1 business day. You can also email support@jobbyist.co.za.",
  },
];

const HelpCenter = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    if (!form.name.trim() || !form.subject.trim() || !form.message.trim()) {
      toast.error("Please complete the required fields.");
      return;
    }
    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      await submitLeadForm({
        formType: "support_ticket",
        subject: `Help Center: ${form.subject}`,
        replyTo: form.email,
        sourcePage: window.location.pathname,
        honeypot: website,
        fields: {
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        },
      });
      toast.success("Ticket submitted. Our team will reply within 1 business day.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setWebsite("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="suite-page-shell">
      <SEOHead
        title="Help Center | Jobbyist Support & FAQ"
        description="Frequently asked questions and support for jobseekers and employers on Jobbyist. Create a support ticket and get help from our team."
        canonicalUrl="https://za.jobbyist.co.za/help-center"
        keywords={["jobbyist help", "jobbyist support", "jobbyist faq", "contact jobbyist"]}
      />
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full gradient-brand mx-auto flex items-center justify-center mb-4">
              <LifeBuoy className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Help Center</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Answers to the most common questions about Jobbyist — plus a direct line to our
              support team if you need more help.
            </p>
          </div>

          <Card className="mb-10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <CardTitle>Frequently Asked Questions</CardTitle>
              </div>
              <CardDescription>Browse the top {faqs.length} questions from our community.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left font-semibold">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle>Create a Support Ticket</CardTitle>
              </div>
              <CardDescription>
                Tickets are routed to support@jobbyist.co.za. Typical response time: 1 business day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Your name *</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="message">How can we help? *</Label>
                  <Textarea id="message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                </div>
                <Input
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  aria-hidden="true"
                />
                <Button type="submit" disabled={submitting} variant="brand" size="lg" className="w-full sm:w-auto">
                  {submitting ? "Submitting..." : "Submit ticket"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
