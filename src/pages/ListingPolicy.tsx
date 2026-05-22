import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ListingPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Job Listing Content & Moderation Policy | Jobbyist"
        description="Read Jobbyist's policy on prohibited listing content, reporting and escalation, moderation timelines, and enforcement outcomes."
        canonicalUrl="https://za.jobbyist.africa/listing-policy"
        keywords={['job listing policy', 'content moderation', 'report job listing', 'job safety policy']}
        ogType="website"
      />
      <Navbar />
      <main id="main-content" className="pt-24 pb-16">
        <section className="container mx-auto px-4 max-w-4xl space-y-8">
          <header className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">Job Listing Content & Moderation Policy</h1>
            <p className="text-muted-foreground">
              This policy explains what employers can post, what is prohibited, and how Jobbyist handles reports.
              We use plain language so jobseekers and employers know what to expect.
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>1) Prohibited listing content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Listings may be removed if they include any of the following:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Scams, impersonation, fake recruiters, or requests for upfront payments.</li>
                <li>Misleading salary, role scope, company identity, or employment terms.</li>
                <li>Discriminatory or hateful language based on protected characteristics.</li>
                <li>Illegal activity, unsafe work requests, or instructions that violate local law.</li>
                <li>Spam, duplicate posts, or ads not related to a real hiring opportunity.</li>
                <li>Requests for sensitive personal data not required for lawful recruitment.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2) Reporting and escalation path</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                On every job detail page, users can select <strong>Report this listing</strong> and choose a reason.
                Reports are stored in our <code>job_reports</code> moderation workflow and reviewed by Trust &amp; Safety.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Step 1: Submit a report with reason and optional supporting details.</li>
                <li>Step 2: Trust &amp; Safety triages severity and credibility.</li>
                <li>Step 3: High-risk cases (fraud, impersonation, payment scams) are escalated for urgent action.</li>
                <li>Step 4: Where needed, we contact the reporter or employer for clarification.</li>
              </ul>
              <p>
                If you need to share urgent evidence, contact us via the <Link className="underline" to="/contact">Contact page</Link>
                {' '}and reference the job URL.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3) Review timelines (SLA)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Urgent safety/fraud reports:</strong> initial review within 24 hours.</li>
                <li><strong>Standard policy reports:</strong> initial review within 2 business days.</li>
                <li><strong>Complex investigations:</strong> may take up to 5 business days when we need more evidence.</li>
              </ul>
              <p>
                These are target timelines, not guarantees, but urgent harm-prevention cases are prioritized first.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4) Enforcement outcomes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Depending on severity and repeat behavior, we may:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Keep the listing live with no action (if no violation is found).</li>
                <li>Edit or request corrections before keeping the listing active.</li>
                <li>Temporarily unpublish or permanently remove the listing.</li>
                <li>Limit or suspend employer posting privileges.</li>
                <li>Escalate severe fraud or illegal behavior to relevant authorities when required.</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ListingPolicy;
