import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const DataRights = () => {
  return (
    <div className="min-h-screen bg-background">
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
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input id="fullName" name="fullName" placeholder="Your full name" autoComplete="name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestType">Request type</Label>
                  <select
                    id="requestType"
                    name="requestType"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue=""
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="identityNote">Identity verification note (optional)</Label>
                  <Input id="identityNote" name="identityNote" placeholder="Reference number, profile email, or account identifier" />
                </div>

                <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                  We may contact you for identity verification before actioning your request. You can also send rights requests to
                  {" "}<a href="mailto:privacy@jobbyist.africa" className="text-primary hover:underline">privacy@jobbyist.africa</a>.
                </div>

                <Button type="button" className="w-full md:w-auto">Submit Request</Button>
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
