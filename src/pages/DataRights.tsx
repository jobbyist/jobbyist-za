import { FormEvent, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitLeadForm, validateEmail } from "@/lib/forms";

const DataRights = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    requestType: "",
    details: "",
    identityNote: "",
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!form.fullName.trim() || !form.email.trim() || !form.requestType || !form.details.trim()) {
      toast.error("Please complete all required fields.");
      return;
    }
    if (!validateEmail(form.email)) {
      toast.error("Please provide a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLeadForm({
        formType: "data_rights",
        subject: `Data rights request: ${form.requestType}`,
        replyTo: form.email,
        sourcePage: window.location.pathname,
        honeypot: form.website,
        fields: {
          fullName: form.fullName,
          email: form.email,
          requestType: form.requestType,
          details: form.details,
          identityNote: form.identityNote,
        },
      });
      toast.success("Your request has been submitted. Our privacy team will contact you.");
      setForm({
        fullName: "",
        email: "",
        requestType: "",
        details: "",
        identityNote: "",
        website: "",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setField = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

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
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Your full name"
                        autoComplete="name"
                        required
                        value={form.fullName}
                        onChange={(e) => setField("fullName", e.target.value)}
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
                        required
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requestType">Request type</Label>
                    <select
                      id="requestType"
                      name="requestType"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                      value={form.requestType}
                      onChange={(e) => setField("requestType", e.target.value)}
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
                      required
                      value={form.details}
                      onChange={(e) => setField("details", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="identityNote">Identity verification note (optional)</Label>
                    <Input
                      id="identityNote"
                      name="identityNote"
                      placeholder="Reference number, profile email, or account identifier"
                      value={form.identityNote}
                      onChange={(e) => setField("identityNote", e.target.value)}
                    />
                  </div>
                  <div className="hidden" aria-hidden="true">
                    <Label htmlFor="dataRightsWebsite">Website</Label>
                    <Input
                      id="dataRightsWebsite"
                      value={form.website}
                      onChange={(e) => setField("website", e.target.value)}
                      autoComplete="off"
                      tabIndex={-1}
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
