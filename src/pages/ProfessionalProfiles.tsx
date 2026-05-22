import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SEOHead, generateBreadcrumbSchema } from "@/components/SEOHead";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CandidateProfileCard } from "@/components/professional-profiles/CandidateProfileCard";
import { CandidateAccessModal } from "@/components/professional-profiles/CandidateAccessModal";
import { ProfilePagination } from "@/components/professional-profiles/ProfilePagination";
import { candidateProfiles, candidateCount } from "@/data/professionalProfiles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Crown, Building2, Shield, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PROFILES_PER_PAGE = 10;
const BASE_URL = "https://za.jobbyist.africa/professional-profiles";

const ProfessionalProfiles = () => {
  const { pageNum } = useParams<{ pageNum?: string }>();
  const navigate = useNavigate();
  const currentPage = pageNum ? parseInt(pageNum, 10) : 1;
  const totalPages = Math.ceil(candidateCount / PROFILES_PER_PAGE);

  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect if page number is invalid
  useEffect(() => {
    if (currentPage < 1 || currentPage > totalPages) {
      navigate("/professional-profiles", { replace: true });
    }
  }, [currentPage, totalPages, navigate]);

  // Get paginated profiles
  const paginatedProfiles = useMemo(() => {
    const startIndex = (currentPage - 1) * PROFILES_PER_PAGE;
    const endIndex = startIndex + PROFILES_PER_PAGE;
    return candidateProfiles.slice(startIndex, endIndex);
  }, [currentPage]);

  // Filter profiles based on search query (client-side for current page only)
  const filteredProfiles = useMemo(() => {
    if (!searchQuery.trim()) return paginatedProfiles;

    const query = searchQuery.toLowerCase();
    return paginatedProfiles.filter((profile) => {
      return (
        profile.name.toLowerCase().includes(query) ||
        profile.role.toLowerCase().includes(query) ||
        profile.location.toLowerCase().includes(query) ||
        profile.skills.some((skill) => skill.toLowerCase().includes(query)) ||
        profile.availability.toLowerCase().includes(query) ||
        profile.workPreference.toLowerCase().includes(query)
      );
    });
  }, [paginatedProfiles, searchQuery]);

  const handleUnlockClick = (profileId: string) => {
    setSelectedProfileId(profileId);
    setIsAccessModalOpen(true);
  };

  // Generate canonical and pagination URLs
  const canonicalUrl = currentPage === 1 ? BASE_URL : `${BASE_URL}/page/${currentPage}`;
  const prevUrl = currentPage > 1 ? (currentPage === 2 ? BASE_URL : `${BASE_URL}/page/${currentPage - 1}`) : undefined;
  const nextUrl = currentPage < totalPages ? `${BASE_URL}/page/${currentPage + 1}` : undefined;

  // Generate structured data for profiles
  const profileListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Professional Profiles for South Africa Candidate Previews - Page ${currentPage}`,
    numberOfItems: filteredProfiles.length,
    itemListElement: filteredProfiles.map((profile, index) => ({
      "@type": "ListItem",
      position: (currentPage - 1) * PROFILES_PER_PAGE + index + 1,
      item: {
        "@type": "Person",
        identifier: profile.id,
        name: profile.name,
        jobTitle: profile.role,
        address: profile.location,
        description: profile.publicSummary,
        knowsAbout: profile.skills
      }
    }))
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": canonicalUrl,
    name: `Professional Profiles for South Africa - Page ${currentPage}`,
    url: canonicalUrl,
    description: "Verified South African candidate profile previews on Jobbyist. Full candidate details are available to active Jobbyist Pro members and paid Recruitment Suite employers and recruiters.",
    isPartOf: {
      "@type": "WebSite",
      name: "Jobbyist South Africa",
      url: "https://za.jobbyist.africa"
    },
    breadcrumb: {
      "@id": `${canonicalUrl}#breadcrumb`
    }
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Jobbyist South Africa", url: "https://za.jobbyist.africa" },
    { name: "Professional Profiles for South Africa", url: BASE_URL },
    ...(currentPage > 1 ? [{ name: `Page ${currentPage}`, url: canonicalUrl }] : [])
  ]);

  const startProfileNum = (currentPage - 1) * PROFILES_PER_PAGE + 1;
  const endProfileNum = Math.min(currentPage * PROFILES_PER_PAGE, candidateCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <SEOHead
        title={`Professional Profiles for South Africa ${currentPage > 1 ? `- Page ${currentPage}` : ''} | Verified Candidate Database - Jobbyist`}
        description="Discover verified South African professionals across administration, support, marketing, HR, legal, operations, data and remote-ready roles. Full details available to Jobbyist Pro members and Recruitment Suite subscribers."
        canonicalUrl={canonicalUrl}
        prevUrl={prevUrl}
        nextUrl={nextUrl}
        keywords={[
          "candidate database South Africa",
          "verified candidates",
          "Jobbyist Pro",
          "Recruitment Suite",
          "South African job seekers",
          "recruiter database",
          "talent directory"
        ]}
        structuredData={[collectionPageSchema, breadcrumbSchema, profileListSchema]}
      />

      <Navbar />

      <main id="main-content" className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 max-w-7xl mb-12">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2 animate-pulse"></span>
                Verified candidate previews · South Africa
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-none mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent transform -skew-x-6">
                Professional Profiles for South Africa
              </h1>

              <p className="text-lg text-slate-700 font-semibold mb-4">
                Discover <strong className="text-slate-900">verified South African professionals</strong> across administration, support, marketing, data, HR, legal, operations and remote-ready roles.
              </p>

              <p className="text-base text-slate-600 mb-6">
                Professional Profiles for South Africa helps job seekers increase their visibility while giving employers and recruiters a trusted way to explore candidate previews before requesting full access. Candidate visibility can be controlled through account/profile settings, and recruiter/employer access to full records is restricted to approved paid plans with privacy compliance checks.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  onClick={() => document.getElementById('profiles')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Browse ZA Profiles
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsAccessModalOpen(true)}
                >
                  How Full Access Works
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  🇿🇦 South African talent
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  🛡️ Privacy protected
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  ✅ Verification badges
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  🔎 SEO-friendly
                </Badge>
              </div>
            </div>

            {/* Stats Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-slate-200 shadow-xl">
              <CardContent className="p-6">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Candidate Database
                </p>
                <div className="text-5xl font-black mb-2">
                  {candidateCount}
                  <span className="text-lg text-slate-500 font-normal ml-2">profiles</span>
                </div>
                <p className="text-sm text-slate-600 mb-6">
                  Public previews protect candidate privacy. Full candidate details are available only to eligible Jobbyist Pro members and employers or recruiters on paid Recruitment Suite plans.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase font-bold">Page</p>
                    <p className="text-2xl font-bold text-slate-900">{currentPage}/{totalPages}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase font-bold">Showing</p>
                    <p className="text-2xl font-bold text-slate-900">{startProfileNum}-{endProfileNum}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase font-bold">Access</p>
                    <p className="text-lg font-bold text-slate-900">Gated</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase font-bold">Market</p>
                    <p className="text-lg font-bold text-slate-900">ZA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Profiles Section */}
        <section id="profiles" className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                Candidate database
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                Verified candidate previews for employers, recruiters and opportunity-ready professionals
              </h2>
            </div>
          </div>

          <p className="text-sm text-slate-600 mb-6">
            Showing profiles {startProfileNum}-{endProfileNum} of {candidateCount}. Public pages show searchable previews only. Contact details, full CVs, references and screening notes are available only to active Jobbyist Pro members and paid Recruitment Suite subscribers. Profile visibility and recruiter access are governed by operational controls, consent checks, and gated entitlement verification.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Filter this page by role, city, skill, availability..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm"
                aria-label="Filter profiles on this page"
              />
            </div>
            <Button
              variant="default"
              onClick={() => setIsAccessModalOpen(true)}
              className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800"
            >
              Unlock Full Database
            </Button>
          </div>

          {/* Profile Grid */}
          {filteredProfiles.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredProfiles.map((profile) => (
                <CandidateProfileCard
                  key={profile.id}
                  profile={profile}
                  onUnlockClick={handleUnlockClick}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-slate-600">
                No profiles match your search criteria. Try adjusting your filters.
              </p>
            </Card>
          )}

          {/* Pagination */}
          {filteredProfiles.length > 0 && (
            <div className="flex justify-center mb-16">
              <ProfilePagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/professional-profiles"
              />
            </div>
          )}
        </section>

        {/* Jobseeker Upsell Section */}
        <section id="jobseekers" className="container mx-auto px-4 max-w-5xl mb-16">
          <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-2 border-primary/20">
            <CardContent className="p-8 sm:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">For Job Seekers: Upgrade to Jobbyist Pro</h3>
                  <p className="text-slate-600">
                    Upgrade to Jobbyist Pro to improve your profile visibility, strengthen your professional presentation and increase your chances of being discovered by relevant employers and recruiters.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Enhanced Visibility</p>
                    <p className="text-xs text-slate-600">Stand out to recruiters</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Priority Placement</p>
                    <p className="text-xs text-slate-600">Top search results</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Crown className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Verification Badge</p>
                    <p className="text-xs text-slate-600">Build trust & credibility</p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                onClick={() => navigate("/pro")}
              >
                Upgrade to Jobbyist Pro
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Employer/Recruiter Upsell Section */}
        <section id="employers" className="container mx-auto px-4 max-w-5xl mb-16">
          <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-2 border-blue-500/20">
            <CardContent className="p-8 sm:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">For Employers & Recruiters: Get Recruitment Suite Access</h3>
                  <p className="text-slate-600">
                    Recruitment Suite gives employers and recruiters full access to a growing database of verified candidates, shortlisting tools and HR-ready hiring workflows.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="flex items-start gap-2">
                  <div className="text-green-600 mt-0.5">✓</div>
                  <div>
                    <p className="font-semibold text-sm">Full Profile Access</p>
                    <p className="text-xs text-slate-600">View complete details</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-green-600 mt-0.5">✓</div>
                  <div>
                    <p className="font-semibold text-sm">Contact Information</p>
                    <p className="text-xs text-slate-600">Direct candidate reach</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-green-600 mt-0.5">✓</div>
                  <div>
                    <p className="font-semibold text-sm">Advanced Tools</p>
                    <p className="text-xs text-slate-600">ATS & hiring workflows</p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-600/90 hover:to-cyan-600/90"
                onClick={() => navigate("/pro")}
              >
                Get Recruitment Suite Access
              </Button>
            </CardContent>
          </Card>
        </section>
        <TrustCopyModules />
      </main>

      <Footer />

      {/* Access Modal */}
      <CandidateAccessModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        profileId={selectedProfileId}
      />
    </div>
  );
};

export default ProfessionalProfiles;
