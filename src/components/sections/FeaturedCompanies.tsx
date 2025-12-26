import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const companyColors = [
  "bg-black",
  "bg-neutral-700",
  "bg-neutral-600",
  "bg-neutral-800",
  "bg-neutral-500",
];

const FeaturedCompanies = () => {
  const { data: companies, isLoading } = useQuery({
    queryKey: ['featured-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('is_active', true)
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <section id="companies" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Companies</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover career opportunities with top employers across South Africa and beyond
          </p>
        </div>

        {/* Company grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {isLoading ? (
            Array(10).fill(0).map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-6 border border-border">
                <Skeleton className="w-12 h-12 rounded-lg mb-4" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))
          ) : companies && companies.length > 0 ? (
            companies.map((company, index) => (
              <div
                key={company.id}
                className="group bg-card rounded-xl p-6 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {company.logo_url ? (
                  <img 
                    src={company.logo_url} 
                    alt={company.name}
                    className="w-12 h-12 rounded-lg object-cover mb-4 group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className={`w-12 h-12 ${companyColors[index % companyColors.length]} rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4 group-hover:scale-110 transition-transform`}>
                    {company.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                  {company.name}
                </h3>
                <p className="text-xs text-muted-foreground">{company.location || company.country}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No companies available yet. Check back soon!
            </div>
          )}
        </div>

        <div className="text-center">
          <Link to="/jobs">
            <Button variant="outline" className="group">
              View All Companies
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompanies;
