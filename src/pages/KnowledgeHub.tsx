import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComingSoonModal from "@/components/ComingSoonModal";
import ResumeAuditModal from "@/components/ResumeAuditModal";
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

// ... data arrays (interviewPacks, templates, etc.) kept from original

const KnowledgeHub = () => {
  const [selectedTab, setSelectedTab] = useState("interview-packs");
  const [modalOpen, setModalOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ title: string; description: string; ctaText?: string; showForm?: boolean }>({
    title: "Coming Soon!",
    description: "We're working hard to bring you this exciting new feature. Stay tuned for updates!",
  });

  const openComingSoon = (config: Partial<typeof modalConfig>) => {
    setModalConfig({
      title: config.title || "Coming Soon!",
      description: config.description || "We're working hard to bring you this exciting new feature. Stay tuned for updates!",
      ctaText: config.ctaText,
      showForm: config.showForm !== false,
    });
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Knowledge Hub | Career Resources | Jobbyist ZA"
        description="Interview packs, ATS CV templates, salary guides and career roadmaps for South African job seekers and employers. Free to use."
        canonicalUrl="https://za.jobbyist.africa/knowledge-hub"
        keywords={['interview questions', 'CV templates South Africa', 'career roadmap', 'salary guide SA', 'job market trends', 'employer resources', 'career certification']}
        ogType="website"
      />
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 gradient-brand relative overflow-hidden">
          {/* ... hero unchanged */}
        </section>

        {/* Main Content with Tabs - Updated mobile layout with spacing */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-12 gap-1 p-1 bg-muted/50 rounded-xl">
                <TabsTrigger value="interview-packs">Interview Packs</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="employer">Employer</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>

              {/* Interview Packs Section */}
              <TabsContent value="interview-packs" className="space-y-8">
                <div className="text-center mb-12 max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Job Interview Preparation Packs</h2>
                  <p className="text-muted-foreground mb-6">
                    Get a personalised Free Resume/CV Audit and an Interview Prep Starter Pack curated for your career goals.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button size="lg" variant="brand" className="gap-2" onClick={() => setAuditOpen(true)}>
                      <Eye className="h-4 w-4" /> Preview
                    </Button>
                    <Button size="lg" variant="outline" className="gap-2" onClick={() => openComingSoon({
                      title: "Full Interview Pack",
                      description: "Get notified when the full pack with role-specific question banks and STAR templates is ready.",
                      ctaText: "Notify me",
                    })}>
                      <Download className="h-4 w-4" /> Get Full Pack
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Templates Section - Download buttons trigger modal */}
              <TabsContent value="templates" className="space-y-8">
                {/* ... with updated buttons */}
              </TabsContent>

              {/* Certifications Section - View Pathway triggers Learning Paths modal */}
              <TabsContent value="certifications" className="space-y-8">
                {/* ... updated buttons */}
              </TabsContent>

              {/* Trends kept, Career Paths and Salary Guides tabs removed */}
              <TabsContent value="trends" className="space-y-8">
                {/* ... */}
              </TabsContent>
            </Tabs>

            <ComingSoonModal
              open={modalOpen}
              onOpenChange={setModalOpen}
              title={modalConfig.title}
              description={modalConfig.description}
              ctaText={modalConfig.ctaText}
              showForm={modalConfig.showForm}
            />
            <ResumeAuditModal open={auditOpen} onOpenChange={setAuditOpen} />
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default KnowledgeHub;