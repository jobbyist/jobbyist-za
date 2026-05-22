import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Download,
  Palette,
  Layout,
  Target,
  Zap
} from "lucide-react";

const features = [
  {
    icon: Layout,
    title: "Professional Templates",
    description: "Choose from dozens of professionally designed templates tailored for the South African job market.",
  },
  {
    icon: Target,
    title: "ATS-Optimized",
    description: "All templates are optimized for Applicant Tracking Systems to ensure your resume gets through automated screenings.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Suggestions",
    description: "Get intelligent content recommendations and keyword optimization powered by AI.",
  },
  {
    icon: Palette,
    title: "Customizable Design",
    description: "Easily customize colors, fonts, and layouts to match your personal brand.",
  },
  {
    icon: Download,
    title: "Multiple Export Formats",
    description: "Download your resume in PDF, Word, or plain text format for maximum compatibility.",
  },
  {
    icon: Zap,
    title: "Quick & Easy",
    description: "Build a professional resume in minutes with our intuitive step-by-step builder.",
  },
];

const templateCategories = [
  {
    name: "Entry-Level & Graduate",
    description: "Perfect for recent graduates and those starting their careers",
    roles: ["Graduate Trainee", "Junior Developer", "Sales Associate", "Admin Assistant"]
  },
  {
    name: "Professional & Experienced",
    description: "Designed for mid to senior-level professionals",
    roles: ["Software Engineer", "Marketing Manager", "Financial Analyst", "Project Manager"]
  },
  {
    name: "Executive & Leadership",
    description: "Premium templates for C-suite and senior leadership roles",
    roles: ["CEO", "CFO", "Director", "VP of Operations"]
  },
  {
    name: "Creative & Design",
    description: "Visually striking templates for creative professionals",
    roles: ["Graphic Designer", "UX Designer", "Content Creator", "Photographer"]
  },
];

const ResumeBuilder = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Professional Resume Builder | ATS-Optimized CV Templates | Jobbyist ZA"
        description="Create a professional, ATS-optimized resume in minutes with our AI-powered resume builder. Choose from industry-specific templates designed for the South African job market. Start building your winning CV today!"
        canonicalUrl="https://za.jobbyist.africa/resume-builder"
        keywords={['resume builder', 'CV builder South Africa', 'ATS resume', 'professional CV templates', 'job application CV', 'resume templates SA']}
        ogType="website"
      />
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
                Professional Resume Builder
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Build Your Perfect Resume in Minutes
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Create a professional, ATS-optimized resume that gets you noticed by employers. 
                Choose from industry-specific templates designed for the South African job market.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://profiles.jobbyist.africa" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 group">
                    Start Building Your Resume
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform ml-2" />
                  </Button>
                </a>
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground bg-transparent hover:bg-primary-foreground/10">
                  View Sample Templates
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Create a Winning Resume</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our resume builder comes packed with features to help you stand out from the competition
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
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

        {/* Template Categories Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Resume Templates for Every Career Stage</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Industry-specific templates designed to highlight your unique skills and experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {templateCategories.map((category) => (
                <Card key={category.name} className="border-border">
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {category.roles.map((role) => (
                        <Badge key={role} variant="secondary">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <a href="https://profiles.jobbyist.africa" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline">
                  Browse All Templates
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Build your professional resume in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 gradient-brand rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-foreground">1</span>
                  </div>
                  <CardTitle>Choose a Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Select from our library of professional, ATS-optimized templates designed for your industry
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 gradient-brand rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-foreground">2</span>
                  </div>
                  <CardTitle>Add Your Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Fill in your details with AI-powered suggestions and keyword optimization to boost your chances
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 gradient-brand rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-foreground">3</span>
                  </div>
                  <CardTitle>Download & Apply</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Download your polished resume in your preferred format and start applying to jobs with confidence
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto gradient-brand border-0 text-primary-foreground">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Build Your Professional Resume?
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg">
                  Join thousands of job seekers who have landed their dream jobs with our resume builder
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://profiles.jobbyist.africa" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    Get Started for Free
                  </Button>
                </a>
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground bg-transparent hover:bg-primary-foreground/10">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ResumeBuilder;
