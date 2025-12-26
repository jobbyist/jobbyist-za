import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "Top 5 In-Demand Skills in South Africa for 2025",
    excerpt: "Discover the most sought-after skills that employers in South Africa are looking for.",
    category: "Career Tips",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "How to Ace Your Virtual Interview",
    excerpt: "Master the art of virtual interviews with these proven strategies for job seekers.",
    category: "Interview Tips",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Remote Work Opportunities Growing Across Africa",
    excerpt: "Explore the rise of remote work and how it's transforming the African job market.",
    category: "Trends",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80",
  },
];

const BlogSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Community Forum</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Career insights, tips, and success stories for job seekers across Africa
          </p>
        </div>

        {/* Articles grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <Badge variant="secondary" className="mb-3">{article.category}</Badge>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <Button variant="link" className="p-0 h-auto group/btn">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" className="group">
            View All Articles
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
