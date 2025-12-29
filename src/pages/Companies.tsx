import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import CompanyLogo from '@/components/ui/company-logo';
import { Building2, MapPin, Users, Search, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const Companies = () => {
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('');

  const { data: companies, isLoading } = useQuery({
    queryKey: ['all-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('is_active', true)
        .eq('country', 'ZA')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const industries = companies
    ? Array.from(new Set(companies.map((c) => c.industry).filter(Boolean)))
    : [];

  const filteredCompanies = companies?.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = !industryFilter || company.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              South African Companies
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse 100+ leading employers in South Africa. Find your next opportunity with top companies across various industries.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            {/* Industry Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!industryFilter ? 'default' : 'outline'}
                onClick={() => setIndustryFilter('')}
                size="sm"
              >
                All Industries
              </Button>
              {industries.slice(0, 10).map((industry) => (
                <Button
                  key={industry}
                  variant={industryFilter === industry ? 'default' : 'outline'}
                  onClick={() => setIndustryFilter(industry as string)}
                  size="sm"
                >
                  {industry}
                </Button>
              ))}
            </div>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(12)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-16 w-16 rounded-lg mb-4" />
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </CardContent>
                  </Card>
                ))
            ) : filteredCompanies && filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <Link key={company.id} to={`/company/${company.slug}`}>
                  <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <CompanyLogo 
                          logoUrl={company.logo_url}
                          companyName={company.name}
                          size="lg"
                        />
                        {company.is_verified && (
                          <Badge className="bg-green-500 ml-2">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-bold text-lg mb-2 line-clamp-1">
                        {company.name}
                      </h3>

                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        {company.industry && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 flex-shrink-0" />
                            <span className="line-clamp-1">{company.industry}</span>
                          </div>
                        )}
                        {company.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="line-clamp-1">{company.location}</span>
                          </div>
                        )}
                        {company.size && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 flex-shrink-0" />
                            <span>{company.size} employees</span>
                          </div>
                        )}
                      </div>

                      {company.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {company.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-xl font-semibold mb-2">No companies found</p>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>

          {/* Stats */}
          {filteredCompanies && (
            <div className="mt-12 text-center text-muted-foreground">
              <p>
                Showing {filteredCompanies.length} of {companies?.length || 0} companies
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Companies;
