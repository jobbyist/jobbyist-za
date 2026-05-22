import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic2 } from "lucide-react";

const Podcast = () => {
  return (
    <div className="suite-page-shell">
      <SEOHead
        title="The Job Post Series | Jobbyist ZA"
        description="The Job Post Series by Jobbyist ZA is launching soon. Stay tuned for interviews, career stories, and hiring insights."
        canonicalUrl="https://za.jobbyist.africa/podcast"
      />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-border/60 bg-white/80 backdrop-blur-sm text-center">
            <CardHeader>
              <Badge className="w-fit mx-auto mb-3">Launching Soon</Badge>
              <div className="w-14 h-14 mx-auto rounded-full gradient-brand flex items-center justify-center mb-4">
                <Mic2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl suite-heading">The Job Post Series</CardTitle>
              <CardDescription className="text-base">
                We’re preparing episodes focused on job search strategy, hiring trends, and South African career growth.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Check back soon for episode updates.
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Podcast;
