import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CookieSettingsLink } from "@/components/CookieConsent";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Cookie Policy | Jobbyist ZA"
        description="Learn about how Jobbyist uses cookies and similar technologies to provide, improve, and protect our services."
        canonicalUrl="https://za.jobbyist.africa/cookies"
      />
      <Navbar />
      <main id="main-content" className="pt-16">
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Cookie Policy</h1>
            <p className="text-muted-foreground mb-4">Last updated: 22 May 2026</p>
            <CookieSettingsLink className="mb-8 inline-block text-sm text-primary underline hover:no-underline" />

            <div className="space-y-8">
              <Card>
                <CardHeader><CardTitle>Cookie categories we use</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p><strong>Strictly necessary</strong> cookies are always active and support authentication, session security, load balancing, and consent-state storage.</p>
                  <p><strong>Analytics</strong> cookies are optional and used to understand product usage patterns and performance trends.</p>
                  <p><strong>Advertising</strong> cookies are optional and are used to enable ad delivery, frequency capping, fraud detection, and measurement for ads shown on Jobbyist.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Providers and retention</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <ul>
                    <li><strong>Jobbyist ZA (first-party, strictly necessary):</strong> session/security and preference cookies. Typical retention: session to 12 months depending on function.</li>
                    <li><strong>Supabase (service provider, strictly necessary):</strong> authentication/session cookies or local tokens used for secure account access. Typical retention: session to 30 days (rotated by auth policy).</li>
                    <li><strong>Google AdSense (third-party, advertising):</strong> advertising and measurement cookies when advertising consent is enabled. Typical retention: up to 13 months, subject to Google controls and browser policies.</li>
                    <li><strong>Analytics provider(s) (third-party, analytics):</strong> usage/performance measurement identifiers when analytics consent is enabled. Typical retention: up to 13 months unless shorter periods apply.</li>
                  </ul>
                  <p>Retention may be shortened by browser settings, private browsing, manual deletion, or provider policy changes.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>How to grant or withdraw consent</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <ul>
                    <li>Use the cookie banner shown on first visit to accept all, reject optional, or save granular preferences.</li>
                    <li>Use the persistent <strong>Cookie Settings</strong> link in the footer or legal pages to update your consent at any time.</li>
                    <li>Withdrawing consent stops new optional cookies/scripts (including advertising and analytics) from loading going forward.</li>
                    <li>You can also clear existing cookies through browser settings.</li>
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

export default Cookies;
