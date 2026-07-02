import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="suite-page-shell">
      <SEOHead
        title="Terms of Service | Jobbyist ZA"
        description="Jobbyist ZA's terms of service — platform usage rules, subscriptions, refunds, user responsibilities, employer obligations, and legal conditions."
        canonicalUrl="https://za.jobbyist.co.za/terms"
        noindex={false}
      />
      <Navbar />
      <main className="pt-16">
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-muted-foreground mb-10">Effective date: 1 July 2026</p>

            <div className="space-y-8">
              <Card>
                <CardHeader><CardTitle>1) About Jobbyist</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    Jobbyist ZA ("Jobbyist", "we", "us", "our") is a job discovery, career management, and
                    recruitment-support platform operating primarily in South Africa via
                    <a href="https://za.jobbyist.co.za" className="text-primary hover:underline"> za.jobbyist.co.za</a>.
                    These Terms of Service ("Terms") govern your access to and use of our website, mobile
                    experiences, dashboards, edge functions, communications, subscriptions, and any related
                    services (collectively, the "Services").
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>2) Acceptance of these terms</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    By creating an account, submitting a job application, uploading a CV, posting a role,
                    subscribing to Jobbyist Pro, or otherwise using the Services, you agree to be bound by
                    these Terms and by our <a href="/privacy" className="text-primary hover:underline">Privacy Notice</a>,
                    <a href="/cookies" className="text-primary hover:underline"> Cookie Policy</a>, and any other
                    policies referenced here. If you do not agree, do not use the Services.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>3) Eligibility and accounts</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <ul>
                    <li>You must be at least 18 years old to use the Services.</li>
                    <li>You must provide accurate, current, and complete information at signup and keep it up to date.</li>
                    <li>You are responsible for all activity under your account and for keeping your credentials, MFA codes, and magic-link emails confidential.</li>
                    <li>Notify us immediately at <a href="mailto:support@jobbyist.co.za" className="text-primary hover:underline">support@jobbyist.co.za</a> of any unauthorised use.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>4) Acceptable use</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>You agree not to:</p>
                  <ul>
                    <li>Post false, misleading, discriminatory, or unlawful content, jobs, or profiles.</li>
                    <li>Scrape, harvest, resell, or systematically extract data from the Services without written consent.</li>
                    <li>Circumvent security controls, quotas, subscription gates, or rate limits.</li>
                    <li>Upload malicious code, execute injection attacks, or attempt unauthorised access to accounts or backend infrastructure.</li>
                    <li>Impersonate any person, company, or brand.</li>
                    <li>Use the Services to harass, defraud, or spam other users.</li>
                    <li>Charge job seekers to apply for a listed role.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>5) User content and licence</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    You retain ownership of content you upload (CVs, cover letters, profile text, company
                    descriptions, job posts, voice/video samples). By submitting content, you grant Jobbyist
                    a worldwide, non-exclusive, royalty-free licence to host, store, transmit, index,
                    display, and process that content to operate and improve the Services, including
                    matching, search, application delivery, and AI-assisted features.
                  </p>
                  <p>
                    You represent that you have all necessary rights to your content and that it does not
                    infringe third-party rights or violate applicable law.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>6) Job listings and employer obligations</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <ul>
                    <li>Employers must post real, active vacancies with accurate title, employer identity or a clear "confidential employer" label, location/remote status, employment type, and application method.</li>
                    <li>Salary claims must be truthful. If unknown, do not fabricate a range.</li>
                    <li>Discrimination that violates South African law (including the Employment Equity Act) is prohibited.</li>
                    <li>Jobbyist may edit, decline, remove, or expire listings that violate these Terms or degrade platform quality.</li>
                    <li>Expired, filled, or closed roles must not remain published as active.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>7) Subscriptions, billing, and refunds</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    Jobbyist Pro is a paid subscription billed at R99/month (or a promotional price where
                    explicitly offered). Payments are processed by third-party payment providers such as
                    Paystack and PayFast. By subscribing, you authorise recurring charges until you cancel.
                  </p>
                  <ul>
                    <li>Subscriptions renew automatically unless cancelled before the renewal date.</li>
                    <li>You can cancel any time from your dashboard; access continues until the end of the paid period.</li>
                    <li>A 30-day money-back guarantee applies to first-time Pro subscribers who request a refund within 30 days of initial purchase, subject to eligible participation and non-abuse.</li>
                    <li>Refunds for the 90-Day Sprint programme are governed by the Sprint service handbook and require documented completion of weekly tasks and application targets.</li>
                    <li>Free-plan quotas (for example the monthly application limit and Concierge AI question limit) are enforced by our systems.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>8) AI-assisted features</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    The Services include AI-assisted features (for example Concierge AI, resume analysis,
                    job matching, and interview prep). AI outputs may be inaccurate, incomplete, or
                    outdated. You are responsible for verifying outputs before relying on them for
                    applications, negotiations, or legal decisions. Do not upload information you are not
                    permitted to share with an AI provider.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>9) Third-party services</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    The Services rely on third-party providers including Supabase (auth, database, storage,
                    edge functions), Resend (transactional email), Paystack/PayFast (payments), Lovable AI
                    Gateway (AI features), Adzuna, Jooble, Remotive, and Firecrawl (job aggregation), and
                    Google (sign-in, indexing). Your use of features that rely on those providers is also
                    subject to their terms.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>10) Intellectual property</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    The Jobbyist name, logos, product design, code, aggregated data, and non-user content
                    are protected by intellectual-property laws and belong to Jobbyist or its licensors.
                    You receive a limited, revocable, non-transferable licence to use the Services in
                    accordance with these Terms.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>11) Termination and suspension</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    We may suspend or terminate your access at any time if you breach these Terms, abuse
                    the Services, or expose the platform or other users to risk. You may close your account
                    at any time from your profile settings. Certain records may be retained as required by
                    law or for security, fraud, and audit purposes as described in our Privacy Notice.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>12) Disclaimers</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    The Services are provided "as is" and "as available" without warranties of any kind,
                    express or implied. We do not guarantee employment outcomes, interview success, or
                    specific salary results. Job listings sourced from third parties may change or be
                    withdrawn without notice.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>13) Limitation of liability</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    To the maximum extent permitted by law, Jobbyist, its directors, employees, and
                    partners are not liable for indirect, incidental, special, consequential, or punitive
                    damages, or for lost profits, revenue, opportunities, or data, arising from your use
                    of the Services. Our aggregate liability for any claim will not exceed the amount you
                    paid Jobbyist in the 12 months preceding the claim.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>14) Indemnification</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    You agree to indemnify and hold Jobbyist harmless from any claim, loss, or expense
                    (including reasonable legal fees) arising from your content, your use of the Services,
                    or your breach of these Terms.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>15) Governing law and disputes</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    These Terms are governed by the laws of the Republic of South Africa. Disputes are
                    subject to the exclusive jurisdiction of South African courts. Consumer rights under
                    the Consumer Protection Act and POPIA are not diminished by these Terms.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>16) Changes to these terms</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    We may update these Terms from time to time. Material changes will be communicated via
                    the platform or by email. Continued use after changes take effect constitutes
                    acceptance of the updated Terms.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>17) Contact</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    Legal: <a href="mailto:legal@jobbyist.co.za" className="text-primary hover:underline">legal@jobbyist.co.za</a><br />
                    Support: <a href="mailto:support@jobbyist.co.za" className="text-primary hover:underline">support@jobbyist.co.za</a><br />
                    Privacy: <a href="mailto:privacy@jobbyist.co.za" className="text-primary hover:underline">privacy@jobbyist.co.za</a>
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

export default Terms;
