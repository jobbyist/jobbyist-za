import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TrustSafety = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Trust & Safety | Jobbyist"
        description="Learn how Jobbyist verifies listings, identifies fraud indicators, handles user reports, and responds with clear timelines."
        canonicalUrl="https://za.jobbyist.africa/trust-safety"
        keywords={['trust and safety', 'job fraud indicators', 'report a job listing', 'verification process']}
        ogType="website"
      />
      <Navbar />
      <main id="main-content" className="pt-24 pb-16">
        <section className="container mx-auto px-4 max-w-4xl space-y-8">
          <header className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">Trust &amp; Safety</h1>
            <p className="text-muted-foreground">
              We work to keep job discovery safe, transparent, and useful. This page explains our verification process,
              common fraud indicators, how to report concerns, and the timelines you can expect from our team.
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>1) Verification steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                <li>We check employer identity signals such as company name consistency, domain quality, and posting history.</li>
                <li>Listings are screened for missing or contradictory details (role title, location, salary, and employment type).</li>
                <li>Higher-risk listings may be manually reviewed before or after publication.</li>
                <li>Repeat publisher behavior is monitored to reduce abuse, spam, and impersonation attempts.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2) Fraud indicators to watch for</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                <li>Requests for upfront payments, gift cards, crypto, or "processing fees" to secure a role.</li>
                <li>Pressure tactics like "apply now or lose your chance" with little role detail.</li>
                <li>Recruiter messages from personal or unrelated email domains that do not match the employer brand.</li>
                <li>Requests for sensitive personal data too early (banking passwords, OTP codes, or ID scans without context).</li>
                <li>Pay, benefits, or visa promises that appear unrealistic compared with the role level.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3) User reporting process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Use <strong>Report this listing</strong> on any job detail page and select the closest reason.
                Add details like screenshots, dates, links, or message context to help investigation quality.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Step 1: Submit a report with reason and optional context.</li>
                <li>Step 2: Trust &amp; Safety triages risk and verifies available evidence.</li>
                <li>Step 3: We take action (keep, correct, unpublish, or remove) based on policy and risk.</li>
                <li>Step 4: Severe fraud patterns are escalated for urgent handling.</li>
              </ul>
              <p>
                You can review broader moderation standards in our{' '}
                <Link to="/listing-policy" className="underline">Listing Policy</Link>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4) Response timelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>High-risk fraud/safety reports:</strong> initial review target within 24 hours.</li>
                <li><strong>Standard reports:</strong> initial review target within 2 business days.</li>
                <li><strong>Complex cases:</strong> can take up to 5 business days when more evidence is required.</li>
              </ul>
              <p>
                Timelines are targets and may vary with report volume, but high-risk harm prevention is prioritized first.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TrustSafety;
