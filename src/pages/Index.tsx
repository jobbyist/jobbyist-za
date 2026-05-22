import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import Hero from "@/components/sections/Hero";
import FeaturedCompanies from "@/components/sections/FeaturedCompanies";
import FeaturedJobs from "@/components/sections/FeaturedJobs";
import UpskillingPrograms from "@/components/sections/UpskillingPrograms";
import RecruitmentSuite from "@/components/sections/RecruitmentSuite";
import ResumeBuilder from "@/components/sections/ResumeBuilder";
import Podcast from "@/components/sections/Podcast";
import PromoStrip from "@/components/sections/PromoStrip";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Jobbyist - South Africa: Premier Career Management and Job Discovery Platform"
        description="Find your dream job in South Africa. Browse 1000+ verified job opportunities in Johannesburg, Cape Town, Durban, Pretoria & across SA. Apply today!"
        canonicalUrl="https://za.jobbyist.africa/"
        keywords={['jobs in South Africa', 'SA jobs', 'Johannesburg jobs', 'Cape Town jobs', 'Durban jobs', 'Pretoria jobs', 'South African careers', 'employment SA', 'job vacancies South Africa', 'work in South Africa']}
        ogType="website"
      />
      <Navbar />
      <main>
        <Hero />
        <FeaturedCompanies />
        <FeaturedJobs />
        <UpskillingPrograms />
        <PromoStrip />
        <ResumeBuilder />
        <RecruitmentSuite />
        <Podcast />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
