import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Contact = () => {
  return (
    <div className="suite-page-shell">
      <SEOHead
        title="Contact Jobbyist ZA | Support and Business Enquiries"
        description="Get in touch with Jobbyist ZA for support, business partnerships, legal requests, and privacy queries."
        canonicalUrl="https://za.jobbyist.co.za/contact"
        noindex={false}
      />
      <Navbar />
      <main className="pt-16">
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-muted-foreground mb-10">We typically respond within 1-2 business days.</p>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Business Identity</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    Jobbyist ZA is a career and employment platform focused on connecting professionals with quality
                    opportunities across South Africa.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <ul>
                    <li>General support: support@jobbyist.co.za</li>
                    <li>Privacy: privacy@jobbyist.co.za</li>
                    <li>Legal: legal@jobbyist.co.za</li>
                    <li>Business enquiries: partnerships@jobbyist.co.za</li>
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

export default Contact;
