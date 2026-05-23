import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { submitLeadForm, validateEmail } from "@/lib/leadForms";

const DataRights = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    requestType: "",
    details: "",
    identityNote: "",
    honeypot: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.requestType || !form.details.trim()) {
      toast.error("Please complete all required fields.");
      return;
    }
    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    const result = await submitLeadForm({
      formType: "Data rights request",
      destination: "privacy@jobbyist.africa",
      replyTo: form.email,
      honeypot: form.honeypot,
      fields: {
        fullName: form.fullName,
        email: form.email,
        requestType: form.requestType,
        details: form.details,
        identityNote: form.identityNote,
      },
    });
    setIsSubmitting(false);

    if (!result.ok) {
      toast.error(result.error || "Unable to submit your request right now.");
      return;
    }

    setIsSubmitted(true);
    setForm({
      fullName: "",
      email: "",
      requestType: "",
      details: "",
      identityNote: "",
      honeypot: "",
    });
    toast.success("Your request was submitted successfully.");
  };

  return (
    <div className="suite-page-shell">
      <SEOHead
        title="Data Rights Request | Jobbyist ZA"
        description="Submit a POPIA data rights request for access, correction, deletion, portability, or objections on Jobbyist ZA."
        canonicalUrl="https://za.jobbyist.africa/data-rights"
      />
      <Navbar />
      <main className="pt-16">
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Data Rights Request</h1>
            <p className="text-muted-foreground mb-10">
              Use this form to request access, correction, deletion, restriction, portability, or to object to processing under POPIA.
            </p>

            <Card>
              <CardHeader>
                <CardTitle>Submit your request</CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted && (
                  <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                    Request submitted. Our privacy team will respond as soon as possible.
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Your full name"
                      autoComplete="name"
                      value={form.fullName}
                      onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestType">Request type</Label>
                  <select
                    id="requestType"
                    name="requestType"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.requestType}
                    onChange={(event) => setForm((prev) => ({ ...prev, requestType: event.target.value }))}
                    required
                  >
                    <option value="" disabled>Select a request type</option>
                    <option value="access">Access my personal information</option>
                    <option value="correction">Correct or update my information</option>
                    <option value="deletion">Delete my information</option>
                    <option value="objection">Object to processing</option>
                    <option value="portability">Data portability request</option>
                    <option value="marketing">Withdraw marketing consent</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Request details</Label>
                  <Textarea
                    id="details"
                    name="details"
                    rows={7}
                    placeholder="Please include enough detail for us to locate your records and process your request."
                    value={form.details}
                    onChange={(event) => setForm((prev) => ({ ...prev, details: event.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="identityNote">Identity verification note (optional)</Label>
                  <Input
                    id="identityNote"
                    name="identityNote"
                    placeholder="Reference number, profile email, or account identifier"
                    value={form.identityNote}
                    onChange={(event) => setForm((prev) => ({ ...prev, identityNote: event.target.value }))}
                  />
                </div>
                <div className="hidden" aria-hidden="true">
                  <Label htmlFor="data-rights-company">Company</Label>
                  <Input
                    id="data-rights-company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.honeypot}
                    onChange={(event) => setForm((prev) => ({ ...prev, honeypot: event.target.value }))}
                  />
                </div>

                <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                  We may contact you for identity verification before actioning your request. You can also send rights requests to
                  {" "}<a href="mailto:privacy@jobbyist.africa" className="text-primary hover:underline">privacy@jobbyist.africa</a>.
                </div>

                <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DataRights;
