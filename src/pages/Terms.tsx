import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="suite-page-shell">
      <SEOHead
        title="Terms of Service | Jobbyist ZA"
        description="Read Jobbyist ZA's terms of service, including platform usage rules, user responsibilities, and legal conditions."
        canonicalUrl="https://za.jobbyist.africa/terms"
        noindex={false}
      />
      <Navbar />
      <main className="pt-16">
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-muted-foreground mb-10">Effective date: 1 May 2026</p>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Business Identity</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    These Terms of Service apply to Jobbyist ZA ("Jobbyist", "we", "us", "our"), a job discovery and
                    career services platform for South Africa and surrounding markets.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acceptance of Terms</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    By accessing or using Jobbyist ZA, you agree to these Terms. If you do not agree, you should stop
                    using the platform.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Use and Conduct</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    You agree to provide accurate information, use the platform lawfully, and avoid misuse including
                    unauthorized scraping, fraud, harassment, or unlawful content uploads.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Limitation of Liability</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    Jobbyist ZA is provided on an "as is" basis. To the extent permitted by law, we are not liable for
                    indirect or consequential losses resulting from use of the platform.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    For terms-related questions, email us at{" "}
                    <a href="mailto:legal@jobbyist.africa" className="text-primary hover:underline">
                      legal@jobbyist.africa
                    </a>{" "}
                    or contact us through our Contact page.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revision History</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <ul>
                    <li>1 May 2026: Initial Terms of Service page published.</li>
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

export default Terms;
