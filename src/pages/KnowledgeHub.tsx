import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  FileText, 
  GraduationCap, 
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  Lock,
  CheckCircle2,
  ArrowRight,
  Download,
  Eye,
  Star,
  Target
} from "lucide-react";

const interviewPacks = [
  {
    role: "Software Engineer",
    questions: 50,
    industry: "Technology",
    level: "Mid to Senior",
    preview: true,
  },
  {
    role: "Data Analyst",
    questions: 50,
    industry: "Data & Analytics",
    level: "Junior to Mid",
    preview: true,
  },
  {
    role: "Marketing Manager",
    questions: 50,
    industry: "Marketing",
    level: "Mid to Senior",
    preview: true,
  },
  {
    role: "Financial Analyst",
    questions: 50,
    industry: "Finance",
    level: "Junior to Mid",
    preview: true,
  },
  {
    role: "Project Manager",
    questions: 50,
    industry: "Management",
    level: "Mid to Senior",
    preview: true,
  },
  {
    role: "Sales Executive",
    questions: 50,
    industry: "Sales",
    level: "All Levels",
    preview: true,
  },
  {
    role: "HR Manager",
    questions: 50,
    industry: "Human Resources",
    level: "Mid to Senior",
    preview: true,
  },
  {
    role: "Accountant",
    questions: 50,
    industry: "Finance",
    level: "Junior to Mid",
    preview: true,
  },
  {
    role: "Business Analyst",
    questions: 50,
    industry: "Business",
    level: "Mid Level",
    preview: true,
  },
  {
    role: "Customer Service Representative",
    questions: 50,
    industry: "Customer Service",
    level: "Entry to Mid",
    preview: true,
  },
];

const templates = [
  {
    category: "CV Templates",
    items: [
      { name: "Software Engineer CV", type: "ATS-Optimized", downloads: "2.5k+" },
      { name: "Marketing Manager CV", type: "ATS-Optimized", downloads: "1.8k+" },
      { name: "Financial Analyst CV", type: "ATS-Optimized", downloads: "1.2k+" },
      { name: "Data Analyst CV", type: "ATS-Optimized", downloads: "2.1k+" },
    ],
  },
  {
    category: "Cover Letter Templates",
    items: [
      { name: "Tech Industry Cover Letter", type: "Role-Specific", downloads: "1.5k+" },
      { name: "Finance Cover Letter", type: "Role-Specific", downloads: "1.1k+" },
      { name: "Management Cover Letter", type: "Role-Specific", downloads: "900+" },
      { name: "Sales Cover Letter", type: "Role-Specific", downloads: "800+" },
    ],
  },
  {
    category: "LinkedIn Profile Templates",
    items: [
      { name: "Executive LinkedIn Profile", type: "Optimized", downloads: "1.3k+" },
      { name: "Tech Professional Profile", type: "Optimized", downloads: "1.7k+" },
      { name: "Sales Professional Profile", type: "Optimized", downloads: "950+" },
      { name: "Graduate LinkedIn Profile", type: "Optimized", downloads: "1.9k+" },
    ],
  },
];

const employerResources = [
  {
    title: "Job Description Templates",
    description: "Comprehensive JD templates for 50+ roles across industries",
    items: ["Software Developer JD", "Marketing Manager JD", "Sales Executive JD", "View All →"],
  },
  {
    title: "Candidate Screening Questions",
    description: "Pre-vetted screening questions to identify top talent",
    items: ["Technical Screening", "Cultural Fit Assessment", "Skills Evaluation", "View All →"],
  },
  {
    title: "Reference Check Scripts",
    description: "Professional reference check templates and best practices",
    items: ["Reference Call Script", "Email Template", "Verification Checklist", "View All →"],
  },
  {
    title: "Interview Guides",
    description: "Structured interview frameworks for consistent hiring",
    items: ["Behavioral Questions", "Technical Assessment", "Panel Interview Guide", "View All →"],
  },
];

const certifications = [
  {
    title: "Best SAP Certifications for SA Market",
    description: "Master SAP with certifications valued by South African enterprises",
    popular: true,
  },
  {
    title: "CompTIA Certification Path",
    description: "Complete roadmap from A+ to advanced IT certifications",
    popular: true,
  },
  {
    title: "Data Analyst Roadmap",
    description: "Step-by-step guide to becoming a certified data analyst",
    popular: true,
  },
  {
    title: "Google Career Certificates",
    description: "Industry-recognized certifications in high-demand fields",
    popular: false,
  },
  {
    title: "AWS Cloud Practitioner",
    description: "Start your cloud career with AWS certification",
    popular: false,
  },
  {
    title: "Project Management Professional (PMP)",
    description: "Globally recognized project management certification",
    popular: false,
  },
];

const careerRoadmaps = [
  { role: "Software Developer", from: "Junior", to: "Senior Architect", duration: "5-7 years" },
  { role: "Data Analyst", from: "Analyst", to: "Chief Data Officer", duration: "7-10 years" },
  { role: "Marketing Professional", from: "Coordinator", to: "CMO", duration: "8-12 years" },
  { role: "Finance Professional", from: "Analyst", to: "CFO", duration: "10-15 years" },
  { role: "HR Professional", from: "Generalist", to: "CHRO", duration: "8-12 years" },
  { role: "Sales Professional", from: "Representative", to: "VP Sales", duration: "6-10 years" },
];

const salaryGuides = [
  { industry: "Technology & IT", avgSalary: "R450k - R850k", growth: "+12% YoY" },
  { industry: "Finance & Banking", avgSalary: "R380k - R720k", growth: "+8% YoY" },
  { industry: "Marketing & Advertising", avgSalary: "R320k - R620k", growth: "+10% YoY" },
  { industry: "Engineering", avgSalary: "R420k - R780k", growth: "+9% YoY" },
  { industry: "Healthcare", avgSalary: "R350k - R650k", growth: "+7% YoY" },
  { industry: "Sales & Business Development", avgSalary: "R300k - R600k", growth: "+11% YoY" },
];

const industryTrends = [
  {
    industry: "Technology",
    trend: "AI & Machine Learning Skills in High Demand",
    impact: "High",
    description: "Companies across SA are seeking AI/ML talent, with salaries increasing by 15-20%",
  },
  {
    industry: "Finance",
    trend: "Digital Banking Transformation",
    impact: "High",
    description: "Fintech skills becoming essential as traditional banks digitize operations",
  },
  {
    industry: "Healthcare",
    trend: "Telemedicine & Digital Health",
    impact: "Medium",
    description: "Remote healthcare services creating new roles and opportunities",
  },
  {
    industry: "Retail",
    trend: "E-commerce & Omnichannel",
    impact: "High",
    description: "Digital retail skills critical as online shopping continues to grow",
  },
  {
    industry: "Energy",
    trend: "Renewable Energy Transition",
    impact: "High",
    description: "Green energy sector expanding with government initiatives",
  },
  {
    industry: "Manufacturing",
    trend: "Industry 4.0 & Automation",
    impact: "Medium",
    description: "Smart manufacturing and automation skills increasingly valuable",
  },
];

const KnowledgeHub = () => {
  const [selectedTab, setSelectedTab] = useState("interview-packs");

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Knowledge Hub | Interview Guides, CV Templates & Career Resources | Jobbyist ZA"
        description="Access comprehensive interview packs, ATS-optimized CV templates, career roadmaps, salary guides, and industry trends for the South African job market. Free resources for job seekers and employers."
        canonicalUrl="https://za.jobbyist.africa/knowledge-hub"
        keywords={['interview questions', 'CV templates South Africa', 'career roadmap', 'salary guide SA', 'job market trends', 'employer resources', 'career certification']}
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
                <BookOpen className="h-3 w-3 mr-1" />
                Career Resources Hub
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Your Complete Career Success Toolkit
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Access interview packs, templates, certifications, career roadmaps, and industry insights 
                tailored for the South African job market
              </p>
            </div>
          </div>
        </section>

        {/* Main Content with Tabs */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 mb-12">
                <TabsTrigger value="interview-packs">Interview Packs</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="employer">Employer</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
                <TabsTrigger value="roadmaps">Career Paths</TabsTrigger>
                <TabsTrigger value="salary">Salary Guides</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>

              {/* Interview Packs Section */}
              <TabsContent value="interview-packs" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Top 50 Interview Questions by Role</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Comprehensive interview packs with questions, scorecards, and model answers for high-demand roles
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {interviewPacks.map((pack) => (
                    <Card key={pack.role} className="border-border hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="secondary">{pack.industry}</Badge>
                          <Badge variant="outline" className="text-xs">{pack.level}</Badge>
                        </div>
                        <CardTitle className="text-xl">Top {pack.questions} {pack.role} Interview Questions</CardTitle>
                        <CardDescription>Complete with scorecard & model answers</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span>Preview: First 10 questions free</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Link to="/pro" className="flex-1">
                            <Button size="sm" className="w-full gradient-brand">
                              <Lock className="h-4 w-4 mr-2" />
                              Get Full Pack
                            </Button>
                          </Link>
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                          Full access with Jobbyist Pro
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Card className="max-w-2xl mx-auto gradient-brand border-0 text-primary-foreground">
                    <CardHeader>
                      <CardTitle>Unlock All Interview Packs</CardTitle>
                      <CardDescription className="text-primary-foreground/80">
                        Get unlimited access to all interview packs with Jobbyist Pro
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to="/pro">
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                          Upgrade to Pro
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Templates Section */}
              <TabsContent value="templates" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Template Library</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Role-specific, ATS-focused CV, cover letter, and LinkedIn templates with real examples
                  </p>
                </div>

                <div className="space-y-8">
                  {templates.map((category) => (
                    <div key={category.category}>
                      <h3 className="text-2xl font-bold mb-4">{category.category}</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {category.items.map((item) => (
                          <Card key={item.name} className="border-border hover:shadow-md transition-all">
                            <CardHeader>
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                              </div>
                              <CardTitle className="text-base">{item.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Download className="h-3 w-3" />
                                  {item.downloads}
                                </span>
                                <Button size="sm" variant="outline">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Link to="/resume-builder">
                    <Button size="lg" variant="outline">
                      Build Your Custom CV
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              {/* Employer Resources Section */}
              <TabsContent value="employer" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Employer Resources</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Professional hiring tools and resources to help you find and onboard top talent
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {employerResources.map((resource) => (
                    <Card key={resource.title} className="border-border">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle>{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {resource.items.map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Card className="max-w-3xl mx-auto gradient-brand border-0 text-primary-foreground">
                    <CardHeader>
                      <CardTitle className="text-2xl">Join Our Early Access Waiting List</CardTitle>
                      <CardDescription className="text-primary-foreground/80 text-base">
                        Be the first to access our premium Recruitment Suite when it launches - 
                        advanced hiring tools, candidate management, and analytics
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid sm:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-3xl font-bold mb-1">500+</div>
                          <div className="text-sm text-primary-foreground/80">Companies Waiting</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold mb-1">50%</div>
                          <div className="text-sm text-primary-foreground/80">Early Bird Discount</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold mb-1">Q2 2026</div>
                          <div className="text-sm text-primary-foreground/80">Expected Launch</div>
                        </div>
                      </div>
                      <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                        Join Waiting List
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Certifications Section */}
              <TabsContent value="certifications" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Certification & Training Pathways</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Structured learning paths to advance your career with industry-recognized certifications
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certifications.map((cert) => (
                    <Card key={cert.title} className="border-border hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          {cert.popular && (
                            <Badge className="gradient-brand text-primary-foreground">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{cert.title}</CardTitle>
                        <CardDescription>{cert.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          View Pathway
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Link to="/upskilling">
                    <Button size="lg">
                      Explore All Programs
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              {/* Career Roadmaps Section */}
              <TabsContent value="roadmaps" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Career Roadmaps</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Visualize your career progression and understand the path to senior roles
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {careerRoadmaps.map((roadmap) => (
                    <Card key={roadmap.role} className="border-border hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{roadmap.role}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Starting Point:</span>
                            <span className="font-semibold">{roadmap.from}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">End Goal:</span>
                            <span className="font-semibold">{roadmap.to}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Timeline:</span>
                            <Badge variant="secondary">{roadmap.duration}</Badge>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          View Full Roadmap
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Salary Guides Section */}
              <TabsContent value="salary" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Salary Guides 2026</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Comprehensive salary data for the South African job market by industry and role
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {salaryGuides.map((guide) => (
                    <Card key={guide.industry} className="border-border hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{guide.industry}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Average Salary Range</div>
                          <div className="text-2xl font-bold">{guide.avgSalary}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {guide.growth}
                          </Badge>
                        </div>
                        <Button variant="outline" className="w-full">
                          View Full Guide
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Card className="max-w-2xl mx-auto border-border">
                    <CardHeader>
                      <CardTitle>Download Complete 2026 Salary Report</CardTitle>
                      <CardDescription>
                        Get the full salary guide with detailed breakdowns by role, experience, and location
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button size="lg">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Industry Trends Section */}
              <TabsContent value="trends" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Industry-Based Trends</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Stay ahead with the latest job market trends and insights for South Africa
                  </p>
                </div>

                <div className="space-y-4">
                  {industryTrends.map((trend) => (
                    <Card key={trend.trend} className="border-border hover:shadow-md transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{trend.industry}</Badge>
                              <Badge 
                                variant="outline" 
                                className={
                                  trend.impact === "High" 
                                    ? "border-red-500 text-red-500" 
                                    : "border-yellow-500 text-yellow-500"
                                }
                              >
                                {trend.impact} Impact
                              </Badge>
                            </div>
                            <CardTitle className="text-xl mb-2">{trend.trend}</CardTitle>
                            <CardDescription>{trend.description}</CardDescription>
                          </div>
                          <TrendingUp className="h-8 w-8 text-primary flex-shrink-0 ml-4" />
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Card className="max-w-3xl mx-auto border-border">
                    <CardHeader>
                      <CardTitle>Get Monthly Trend Reports</CardTitle>
                      <CardDescription>
                        Subscribe to receive monthly job market insights and industry trend analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 max-w-md mx-auto">
                        <input 
                          type="email" 
                          placeholder="Enter your email" 
                          className="flex-1 px-4 py-2 border rounded-lg"
                        />
                        <Button>Subscribe</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto gradient-brand border-0 text-primary-foreground">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Accelerate Your Career?
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg">
                  Get unlimited access to all resources, templates, and guides with Jobbyist Pro
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/pro">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    Upgrade to Pro
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/">
                  <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground bg-transparent hover:bg-primary-foreground/10">
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

export default KnowledgeHub;
