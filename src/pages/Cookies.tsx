import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Cookies = () => {
  return (
    <div className="suite-page-shell">
      <SEOHead
        title="Cookie Policy | Jobbyist ZA"
        description="How Jobbyist ZA uses cookies, local storage, and similar technologies — categories, purposes, third parties, and how to control them."
        canonicalUrl="https://za.jobbyist.co.za/cookies"
      />
      <Navbar />
      <main className="pt-16">
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Cookie Policy</h1>
            <p className="text-muted-foreground mb-10">Last updated: 1 July 2026</p>

            <div className="space-y-8">
              <Card>
                <CardHeader><CardTitle>1) About this policy</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    This Cookie Policy explains how Jobbyist ZA ("Jobbyist", "we", "us") uses cookies and
                    similar storage technologies (localStorage, sessionStorage, service worker caches)
                    across <a href="https://za.jobbyist.co.za" className="text-primary hover:underline">za.jobbyist.co.za</a>
                    and related surfaces. It should be read together with our
                    <a href="/privacy" className="text-primary hover:underline"> Privacy Notice</a>.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>2) What are cookies and similar technologies?</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    Cookies are small text files stored on your device by your browser. We also use browser
                    storage APIs such as <em>localStorage</em> and <em>sessionStorage</em> to remember
                    preferences, session state, quotas, and UI decisions on your device. These are not
                    transmitted to us with every request but are used by the application while you use it.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>3) Categories of cookies and storage we use</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="font-semibold">Strictly necessary</p>
                  <ul>
                    <li>Supabase authentication cookies/localStorage entries (sign-in session, MFA state).</li>
                    <li>CSRF and security tokens.</li>
                    <li>Preloader session flag (<code>jobbyist:preloader-shown</code>) so the intro animation only shows once per session.</li>
                    <li>Free-plan quota trackers (for example Concierge AI question count).</li>
                  </ul>

                  <p className="font-semibold mt-4">Functional</p>
                  <ul>
                    <li>Theme preference (light/dark), navbar collapse state, dismissed modals.</li>
                    <li>Podcast player state — episode plays, likes, and liked state stored locally on your device.</li>
                    <li>Onboarding progress and saved job identifiers.</li>
                  </ul>

                  <p className="font-semibold mt-4">Analytics and performance</p>
                  <ul>
                    <li>Aggregated usage analytics to understand which pages, jobs, and features are useful.</li>
                    <li>Error and performance monitoring (Core Web Vitals sampling).</li>
                  </ul>

                  <p className="font-semibold mt-4">Advertising and monetisation</p>
                  <ul>
                    <li>Google AdSense may set cookies to serve and measure ads on free-plan pages.</li>
                    <li>Pro subscribers receive an ad-free experience.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>4) Third parties that may set cookies</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <ul>
                    <li>Supabase (authentication and session).</li>
                    <li>Google (Sign-In, Search Console, Indexing API, AdSense).</li>
                    <li>Paystack / PayFast (subscription checkout).</li>
                    <li>Resend (transactional email tracking pixels).</li>
                  </ul>
                  <p>Each third party has its own privacy and cookie notices, which govern their processing.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>5) Managing your preferences</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>You can:</p>
                  <ul>
                    <li>Adjust or block cookies in your browser settings (see your browser's help documentation).</li>
                    <li>Clear localStorage/sessionStorage from your browser's developer tools or site data settings.</li>
                    <li>Opt out of personalised ads through Google Ad Settings.</li>
                    <li>Sign out to end the Supabase authentication session.</li>
                  </ul>
                  <p>
                    Blocking strictly necessary cookies may prevent core features (sign-in, subscriptions,
                    applications) from working.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>6) Do Not Track</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    We honour explicit opt-outs for marketing communications and provide account controls
                    for advertising preferences. Because there is no consistent industry standard for "Do
                    Not Track" signals, we do not currently respond to browser DNT headers.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>7) Changes to this policy</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    We may update this Cookie Policy to reflect changes in practice, providers, or
                    regulation. Material changes will be communicated on-platform or by email.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>8) Contact</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    Questions? Contact{" "}
                    <a href="mailto:privacy@jobbyist.co.za" className="text-primary hover:underline">
                      privacy@jobbyist.co.za
                    </a>
                    .
                  </p>
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
