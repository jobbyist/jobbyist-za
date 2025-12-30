import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Target, 
  Bell, 
  Zap, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Lock,
  Sparkles
} from "lucide-react";
const features = [
  {
    icon: Target,
    title: "Smart Job Scanning",
    description: "Automatically scans multiple job sites including LinkedIn, Indeed, Careers24, and more to find opportunities matching your profile.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Matching",
    description: "Advanced algorithms analyze your resume and match it against job requirements, skills, and experience needed.",
  },
  {
    icon: Bell,
    title: "Real-Time Notifications",
    description: "Get instant alerts when new matching jobs are posted, so you never miss an opportunity.",
  },
  {
    icon: Zap,
    title: "Automated Applications",
    description: "Streamline your job search with automated application submissions to matched positions.",
  },
];

const benefits = [
  "Save hours of manual job searching",
  "Never miss a relevant opportunity",
  "Apply to more jobs in less time",
  "Increase your chances of landing interviews",
  "Track all your applications in one place",
];

const JobMatcher = () => {
  // Note: This page is accessible to all users to learn about the feature
  // Pro membership check would be implemented at the feature activation level
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 gradient-brand relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center text-primary-foreground">
              <Badge className="mb-4 bg-background/20 text-primary-foreground border-primary-foreground/20">
                <Lock className="h-3 w-3 mr-1" />
                Jobbyist Pro Exclusive
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                AI-Powered Job Matcher
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Let our intelligent system find and match the perfect job opportunities for you. 
                Automatic scanning, real-time notifications, and automated applications - all powered by AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/pro">
                  <Button size="lg" className="bg-background text-foreground hover:bg-background/90 group">
                    Upgrade to Pro
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-background/10">
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Job Matcher Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our AI-powered system continuously searches and matches jobs to your profile, 
                saving you time and helping you find the perfect opportunity.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {features.map((feature) => (
                <Card key={feature.title} className="border-border hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 gradient-brand rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <Badge variant="secondary" className="mb-4">
                    Benefits
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Why Use Job Matcher?
                  </h2>
                  <ul className="space-y-4">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-lg">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 gradient-brand rounded-2xl blur-2xl opacity-20" />
                  <Card className="relative border-border shadow-xl">
                    <CardHeader>
                      <div className="w-16 h-16 gradient-brand rounded-xl flex items-center justify-center mb-4">
                        <Target className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-2xl">Get Started Today</CardTitle>
                      <CardDescription className="text-base">
                        Upgrade to Jobbyist Pro and unlock the full power of AI-driven job matching.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 text-sm">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span>Upload your resume</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Target className="h-5 w-5 text-muted-foreground" />
                        <span>Set your job preferences</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Zap className="h-5 w-5 text-muted-foreground" />
                        <span>Let AI do the work</span>
                      </div>
                      <Link to="/pro" className="block">
                        <Button className="w-full gradient-brand" size="lg">
                          Upgrade to Pro
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto gradient-brand border-0 text-primary-foreground">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Find Your Perfect Job?
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg">
                  Join Jobbyist Pro and let our AI-powered Job Matcher work for you 24/7
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/pro">
                  <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                    Start Your Free Trial
                  </Button>
                </Link>
                <Link to="/">
                  <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-background/10">
                    Back to Home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JobMatcher;
