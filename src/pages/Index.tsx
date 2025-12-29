import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import FeaturedCompanies from "@/components/sections/FeaturedCompanies";
import FeaturedJobs from "@/components/sections/FeaturedJobs";
import UpskillingPrograms from "@/components/sections/UpskillingPrograms";
import RecruitmentSuite from "@/components/sections/RecruitmentSuite";
import ResumeBuilder from "@/components/sections/ResumeBuilder";
import Podcast from "@/components/sections/Podcast";
import BlogSection from "@/components/sections/BlogSection";
import PromoStrip from "@/components/sections/PromoStrip";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
