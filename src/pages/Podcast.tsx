import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import PodcastPlayer from "@/components/PodcastPlayer";

const Podcast = () => {
  return (
    <div className="suite-page-shell">
      <SEOHead
        title="The Job Post Series | Jobbyist ZA"
        description="The Job Post Series by Jobbyist ZA — interviews, career stories, and hiring insights from the South African job market."
        canonicalUrl="https://za.jobbyist.co.za/podcast"
      />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">The Job Post Series</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Career stories, hiring insights, and practical strategy for the South African job market.
            New episodes every weekday.
          </p>
        </div>
        <PodcastPlayer showHeader={false} showAllEpisodesButton={false} />
      </main>
      <Footer />
    </div>
  );
};

export default Podcast;
