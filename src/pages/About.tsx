import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SEOHead } from '@/components/SEOHead';
import { Heart, Users, Target, ExternalLink, Mail, DollarSign, Handshake } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About Jobbyist | Fighting Unemployment in South Africa"
        description="Jobbyist is a social benefit startup built to address the unemployment crisis in South Africa. Developed by Gravitas Industries, a youth-owned startup incubator in Johannesburg."
        canonicalUrl="https://za.jobbyist.africa/about"
        keywords={['about jobbyist', 'gravitas industries', 'youth employment south africa', 'social benefit startup', 'johannesburg startup']}
      />
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="gradient-brand-text">Jobbyist</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A social benefit startup built to address the unemployment crisis in South Africa
            </p>
          </div>

          {/* Mission Section */}
          <div className="max-w-5xl mx-auto mb-16">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg leading-relaxed">
                  Jobbyist is an in-house social benefit startup dedicated to combating South Africa's unemployment crisis. 
                  We believe that every South African deserves access to meaningful employment opportunities, and we're 
                  committed to bridging the gap between job seekers and employers across the country.
                </p>
                <p className="text-lg leading-relaxed">
                  Our platform connects talented South Africans with verified job opportunities, providing tools and 
                  resources to help them succeed in their job search journey. From entry-level positions to senior roles, 
                  we curate opportunities across all industries and regions.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* About Gravitas Section */}
          <div className="max-w-5xl mx-auto mb-16">
            <Card className="border-2 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">Built by Gravitas Industries</CardTitle>
                </div>
                <CardDescription className="text-base">
                  A youth-owned and operated startup incubator and consulting agency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg leading-relaxed">
                  Jobbyist is developed, funded, and managed by a small team of passionate creatives, developers, 
                  and contributors at <strong>Gravitas Industries HQ</strong>, based in Johannesburg, South Africa.
                </p>
                <p className="text-lg leading-relaxed">
                  Gravitas Industries is a youth-owned startup incubator and consulting agency committed to building 
                  innovative solutions that create real social impact. We incubate ideas that matter, focusing on 
                  projects that address critical challenges facing South African communities.
                </p>
                <div className="pt-4">
                  <a 
                    href="https://gravitas.uno" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button variant="outline" size="lg" className="gap-2">
                      View Gravitas Industries Portfolio
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Values Section */}
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Heart className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>Social Impact First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every decision we make is guided by our commitment to reducing unemployment and creating 
                    opportunities for South Africans.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>Youth Empowerment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Built by young South Africans, for South Africans. We understand the challenges and we're 
                    building solutions that work.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Target className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>Innovation & Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We leverage cutting-edge technology and best practices to deliver a world-class job search 
                    experience for our users.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Support Section */}
          <div className="max-w-5xl mx-auto">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-background">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Handshake className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-3xl mb-2">Support Our Mission</CardTitle>
                <CardDescription className="text-base">
                  Help us fight unemployment in South Africa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-lg">
                  Jobbyist is a social benefit project that relies on the support of donors, sponsors, and partners 
                  who share our vision of a South Africa where everyone has access to meaningful employment.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-primary/20">
                    <CardHeader>
                      <DollarSign className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-xl">Become a Donor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Your donation helps us maintain and improve our platform, reach more job seekers, 
                        and create greater impact.
                      </p>
                      <a href="mailto:support@gravitas.uno?subject=Donation%20Inquiry%20-%20Jobbyist">
                        <Button className="w-full gap-2">
                          <Mail className="h-4 w-4" />
                          Donate Now
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-primary/20">
                    <CardHeader>
                      <Handshake className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-xl">Partner With Us</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Interested in corporate sponsorship or partnerships? Let's discuss how we can work 
                        together to create impact.
                      </p>
                      <a href="mailto:partnerships@gravitas.uno?subject=Partnership%20Inquiry%20-%20Jobbyist">
                        <Button variant="outline" className="w-full gap-2">
                          <Mail className="h-4 w-4" />
                          Contact Us
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    For general inquiries, reach out to us at{' '}
                    <a href="mailto:hello@gravitas.uno" className="text-primary hover:underline">
                      hello@gravitas.uno
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
