import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const companies = [
  { name: "Deloitte", location: "Global", initial: "D", color: "bg-green-500" },
  { name: "Vodacom Group", location: "South Africa", initial: "V", color: "bg-red-500" },
  { name: "Capitec Bank", location: "South Africa", initial: "C", color: "bg-blue-500" },
  { name: "Amazon", location: "Global", initial: "A", color: "bg-orange-500" },
  { name: "IBM", location: "Global", initial: "I", color: "bg-blue-600" },
  { name: "Woolworths", location: "South Africa", initial: "W", color: "bg-purple-500" },
  { name: "Shoprite", location: "South Africa", initial: "S", color: "bg-red-600" },
  { name: "Standard Bank", location: "South Africa", initial: "S", color: "bg-blue-700" },
  { name: "Discovery", location: "South Africa", initial: "D", color: "bg-teal-500" },
  { name: "Takealot", location: "South Africa", initial: "T", color: "bg-blue-500" },
];

const FeaturedCompanies = () => {
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
          {companies.map((company) => (
            <div
              key={company.name}
              className="group bg-card rounded-xl p-6 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className={`w-12 h-12 ${company.color} rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4 group-hover:scale-110 transition-transform`}>
                {company.initial}
              </div>
              <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                {company.name}
              </h3>
              <p className="text-xs text-muted-foreground">{company.location}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" className="group">
            View All Companies
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompanies;
