import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Privacy Policy | Jobbyist ZA"
        description="Review how Jobbyist ZA collects, uses, and safeguards personal data for job seekers, employers, and site visitors."
        canonicalUrl="https://za.jobbyist.africa/privacy"
        noindex={false}
      />
      <Navbar />
      <main className="pt-16">
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-10">Effective date: 1 May 2026</p>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Business Identity</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    This Privacy Policy describes data practices for Jobbyist ZA ("Jobbyist", "we", "us", "our") and
                    applies to our website, tools, and related services.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Information We Collect</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    We may collect account information, profile details, application activity, communication records,
                    and technical usage data to operate and improve the platform.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How We Use Your Information</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    We use data to provide services, personalize job recommendations, maintain platform security,
                    communicate updates, and comply with legal obligations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Security and Retention</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    We apply administrative, technical, and organizational safeguards designed to protect your data and
                    retain information only as long as needed for service and legal requirements.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    For privacy inquiries, email{" "}
                    <a href="mailto:privacy@jobbyist.africa" className="text-primary hover:underline">
                      privacy@jobbyist.africa
                    </a>{" "}
                    or use our Contact page.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revision History</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <ul>
                    <li>1 May 2026: Initial Privacy Policy page published.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
