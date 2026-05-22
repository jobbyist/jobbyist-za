import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import { Megaphone, Target, BarChart3, Sparkles, Mail } from "lucide-react";

const Ads = () => {
  const placements = [
    { name: "Homepage Hero Banner", reach: "120k+ monthly impressions", price: "From R12,500/mo" },
    { name: "Jobs Search Sidebar", reach: "Targeted by category &amp; city", price: "From R6,500/mo" },
    { name: "Sponsored Job Listings", reach: "Top of relevant searches", price: "From R2,500/post" },
    { name: "Newsletter Sponsorship", reach: "30k+ SA subscribers", price: "From R8,000/issue" },
    { name: "Programmatic SEO Page Takeover", reach: "Category &amp; location landing pages", price: "Custom" },
    { name: "Push Notification Sponsorship", reach: "Opt-in PWA installs", price: "Custom" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Premium Advertising on Jobbyist | Reach South African Talent"
        description="Promote your brand to South Africa's most engaged audience of job seekers, graduates and working professionals. Sponsored listings, banner placements, newsletter takeovers and more."
        canonicalUrl="https://za.jobbyist.africa/ads"
        keywords={["advertise on jobbyist", "South Africa recruitment advertising", "employer branding SA", "sponsored jobs"]}
      />
      <Navbar />
      <main id="main-content" className="pt-24 pb-16">
        <section className="container mx-auto px-4 max-w-5xl">
          <Badge className="mb-4 gap-1"><Sparkles className="h-3 w-3" /> Premium ad solutions</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Reach South Africa's most engaged career audience
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            Jobbyist puts your brand in front of motivated South African job seekers, graduates,
            freelancers and working professionals — across web, PWA and email.
          </p>
          <div className="flex flex-wrap gap-3 mb-12">
            <a href="mailto:support@jobbyist.africa?cc=primelifer@gmail.com&subject=Premium%20Ads%20Enquiry">
              <Button variant="brand" size="lg" className="gap-2"><Mail className="h-4 w-4" /> Talk to our ads team</Button>
            </a>
            <a href="#placements"><Button variant="outline" size="lg">View placements</Button></a>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-16">
            {[
              { icon: Megaphone, h: "Brand reach", p: "Premium hero, sidebar &amp; in-feed placements across the full site." },
              { icon: Target, h: "Precise targeting", p: "Filter by city, category, experience level and remote intent." },
              { icon: BarChart3, h: "Transparent reporting", p: "Monthly performance reports with impressions, CTR and conversions." },
            ].map(({ icon: Icon, h, p }) => (
              <Card key={h}><CardHeader><Icon className="h-6 w-6 text-primary mb-2" /><CardTitle className="text-lg">{h}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: p }} /></Card>
            ))}
          </div>

          <h2 id="placements" className="text-2xl font-bold mb-6">Available placements</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-16">
            {placements.map(p => (
              <Card key={p.name}>
                <CardHeader>
                  <CardTitle className="text-base">{p.name}</CardTitle>
                  <CardDescription dangerouslySetInnerHTML={{ __html: p.reach }} />
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <span className="text-sm font-semibold gradient-brand-text">{p.price}</span>
                  <a href="mailto:support@jobbyist.africa?cc=primelifer@gmail.com&subject=Ads%20Enquiry%20-%20{encodeURIComponent(p.name)}">
                    <Button size="sm" variant="outline">Enquire</Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-bold mb-2">Ready to launch your campaign?</h3>
              <p className="text-muted-foreground mb-4">Email <strong>support@jobbyist.africa</strong> and our team will respond within one business day.</p>
              <a href="mailto:support@jobbyist.africa?cc=primelifer@gmail.com&subject=Premium%20Ads%20Enquiry">
                <Button variant="brand" size="lg">Get in touch</Button>
              </a>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Ads;
