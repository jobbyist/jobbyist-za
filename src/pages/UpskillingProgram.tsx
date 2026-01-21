import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GraduationCap, 
  TrendingUp, 
  Award, 
  BookOpen,
  Target,
  Users,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: GraduationCap,
    title: "Industry-Recognized Certifications",
    description: "Earn certifications from leading providers that employers in South Africa actively seek.",
  },
  {
    icon: TrendingUp,
    title: "Career Advancement",
    description: "Boost your earning potential and unlock new career opportunities with in-demand skills.",
  },
  {
    icon: Award,
    title: "Expert-Led Training",
    description: "Learn from industry experts with real-world experience in South African companies.",
  },
  {
    icon: BookOpen,
    title: "Flexible Learning",
    description: "Study at your own pace with online courses that fit your schedule.",
  },
];

const programs = [
  {
    title: "Technology & IT",
    description: "Master the skills driving South Africa's digital transformation",
    courses: [
      { name: "CompTIA Certification Path", level: "Beginner to Advanced", duration: "6-12 months" },
      { name: "AWS Cloud Practitioner", level: "Beginner", duration: "3 months" },
      { name: "Cyber Security Fundamentals", level: "Intermediate", duration: "4 months" },
      { name: "Full Stack Web Development", level: "Beginner to Advanced", duration: "6 months" },
    ],
  },
  {
    title: "Data & Analytics",
    description: "Become a data-driven professional with high-demand skills",
    courses: [
      { name: "Data Analyst Roadmap", level: "Beginner to Advanced", duration: "6 months" },
      { name: "Google Data Analytics Certificate", level: "Beginner", duration: "6 months" },
      { name: "SQL for Data Analysis", level: "Beginner", duration: "2 months" },
      { name: "Power BI & Tableau Mastery", level: "Intermediate", duration: "3 months" },
    ],
  },
  {
    title: "Business & Finance",
    description: "Advance your career in business and financial services",
    courses: [
      { name: "SAP Certifications for SA Market", level: "Intermediate to Advanced", duration: "6-12 months" },
      { name: "Financial Modeling & Analysis", level: "Intermediate", duration: "4 months" },
      { name: "Project Management Professional (PMP)", level: "Advanced", duration: "6 months" },
      { name: "Digital Marketing Certification", level: "Beginner to Intermediate", duration: "3 months" },
    ],
  },
  {
    title: "Professional Skills",
    description: "Essential skills for career growth and leadership",
    courses: [
      { name: "Leadership & Management", level: "All levels", duration: "3 months" },
      { name: "Communication & Presentation Skills", level: "All levels", duration: "2 months" },
      { name: "Agile & Scrum Certification", level: "Beginner to Advanced", duration: "2 months" },
      { name: "Business English for Professionals", level: "Intermediate", duration: "3 months" },
    ],
  },
];

const partners = [
  "Google Career Certificates",
  "CompTIA",
  "AWS Training",
  "Microsoft Learn",
  "Coursera",
  "LinkedIn Learning",
];

const UpskillingProgram = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Upskilling Programs | Professional Training & Certifications | Jobbyist ZA"
        description="Advance your career with industry-recognized certifications and training programs. Learn in-demand skills from Google, CompTIA, AWS, and more. Flexible online courses designed for South African professionals."
        canonicalUrl="https://za.jobbyist.africa/upskilling"
        keywords={['upskilling programs', 'professional training South Africa', 'career certifications', 'online courses SA', 'CompTIA training', 'Google certificates', 'career development']}
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
                Professional Development
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Upskill Your Career with Industry-Recognized Certifications
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Master in-demand skills with flexible online courses from leading providers. 
                Advance your career and increase your earning potential in the South African job market.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/knowledge-hub">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 group">
                    Explore Programs
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground bg-transparent hover:bg-primary-foreground/10">
                  Download Course Catalog
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Upskill with Jobbyist?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We partner with leading training providers to offer certifications that South African employers value
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="border-border hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 gradient-brand rounded-lg flex items-center justify-center mb-4">
                      <benefit.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Training Programs</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose from a wide range of certification programs across multiple industries
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {programs.map((program) => (
                <Card key={program.title} className="border-border">
                  <CardHeader>
                    <CardTitle className="text-2xl">{program.title}</CardTitle>
                    <CardDescription>{program.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {program.courses.map((course) => (
                        <li key={course.name} className="border-l-2 border-primary pl-4">
                          <div className="font-semibold">{course.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            <span>{course.level}</span> • <span>{course.duration}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Training Partners</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Learn from the best with certifications from industry-leading providers
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
              {partners.map((partner) => (
                <Badge key={partner} variant="secondary" className="text-base px-6 py-3">
                  {partner}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Path to Success</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Start upskilling today with our simple four-step process
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { step: 1, title: "Choose Your Path", description: "Select a certification program that aligns with your career goals" },
                { step: 2, title: "Enroll & Learn", description: "Start learning at your own pace with expert instructors" },
                { step: 3, title: "Practice & Apply", description: "Apply your new skills with hands-on projects and exercises" },
                { step: 4, title: "Get Certified", description: "Earn your certification and showcase it on your profile" },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 gradient-brand rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto gradient-brand border-0 text-primary-foreground">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Advance Your Career?
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg">
                  Join thousands of South African professionals who have upskilled with Jobbyist
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/knowledge-hub">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    Browse All Programs
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground bg-transparent hover:bg-primary-foreground/10">
                  Talk to an Advisor
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

export default UpskillingProgram;
