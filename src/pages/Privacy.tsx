import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="suite-page-shell">
      <SEOHead
        title="Privacy Notice | Jobbyist ZA"
        description="Read the Jobbyist ZA privacy notice, including POPIA rights, legal grounds, security safeguards, retention, and regulator complaint routes."
        canonicalUrl="https://za.jobbyist.africa/privacy"
        noindex={false}
      />
      <Navbar />
      <main className="pt-16">
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Notice</h1>
            <p className="text-muted-foreground mb-10">Effective date: 22 May 2026</p>

            <div className="space-y-8">
              <Card>
                <CardHeader><CardTitle>1) Responsible party and contact details</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>Jobbyist ZA ("Jobbyist", "we", "us", "our") is the responsible party for personal information processed through our South African website and related services.</p>
                  <p>Privacy contact: <a href="mailto:privacy@jobbyist.africa" className="text-primary hover:underline">privacy@jobbyist.africa</a>.</p>
                  <p>General support: <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>2) Categories of personal information we process</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <ul>
                    <li><strong>Identity and account data:</strong> name, email, phone, authentication and profile identifiers.</li>
                    <li><strong>Professional data:</strong> role, skills, experience, CV/resume files, links, availability, and profile descriptions.</li>
                    <li><strong>Candidate communication data:</strong> uploads such as voice samples and interview/session responses where enabled.</li>
                    <li><strong>Employer/recruiter usage data:</strong> company and user metadata, access requests, shortlist/interactions with gated profiles.</li>
                    <li><strong>Technical and usage data:</strong> IP/device/browser logs, cookie preferences, session and security events.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>3) Lawful grounds for processing and consent</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>We process information under one or more lawful grounds, including:</p>
                  <ul>
                    <li>performance of a contract (providing job discovery, profile, and platform services);</li>
                    <li>legitimate interests (security, fraud prevention, service improvement, platform integrity);</li>
                    <li>compliance with legal obligations; and</li>
                    <li>consent, where required (for specific optional processing and direct marketing preferences).</li>
                  </ul>
                  <p>Where consent is used, you may withdraw consent at any time without affecting earlier lawful processing.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>4) Special personal information handling</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>We do not intentionally require special personal information unless it is strictly necessary and lawfully permitted. If special information is provided in CVs or supporting files, we process it only for recruitment-related purposes, apply role-based restrictions, and limit unnecessary exposure.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>5) Cross-border data transfers</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>Your information may be processed in jurisdictions outside South Africa through hosting and service providers. Where cross-border transfers occur, we apply safeguards such as contractual protections, access controls, and transfer-risk reviews appropriate to the type of data processed.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>6) Retention periods</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>We keep personal information only as long as reasonably required for platform operation, legal obligations, dispute handling, and security auditing. Retention periods vary by record type (for example account records, profile content, support records, and security logs), after which data is deleted, de-identified, or archived with restricted access where law requires.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>7) Security safeguards</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <ul>
                    <li>Logical access controls and role-based permissions for internal workflows.</li>
                    <li>Authentication and session controls for platform accounts.</li>
                    <li>Monitoring and logging for suspicious activity and abuse prevention.</li>
                    <li>Secure storage and transmission safeguards appropriate to service risk.</li>
                  </ul>
                  <p>No system is 100% secure, but we apply reasonable technical and organizational controls to reduce risk.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>8) Children and minors</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>Our services are intended for users aged 18 and older. We do not knowingly collect personal information from children. If you believe a minor has provided information, contact us at <a href="mailto:privacy@jobbyist.africa" className="text-primary hover:underline">privacy@jobbyist.africa</a> so we can investigate and take appropriate action.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>9) Your data subject rights under POPIA</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>Subject to applicable law, you may request access, correction, deletion, objection/restriction, and in appropriate cases portability or withdrawal of consent.</p>
                  <p>Submit requests via the <a href="/data-rights" className="text-primary hover:underline">Data Rights Request page</a> or by emailing <a href="mailto:privacy@jobbyist.africa" className="text-primary hover:underline">privacy@jobbyist.africa</a>.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>10) Complaints to the Information Regulator (South Africa)</CardTitle></CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>If you believe your information has been handled unlawfully, you may lodge a complaint with South Africa's Information Regulator. We encourage you to contact us first so we can try to resolve the issue promptly.</p>
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
