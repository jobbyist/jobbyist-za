import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Star,
  Lock,
  Crown,
  User
} from 'lucide-react';

interface JobseekerProfile {
  id: string;
  user_id: string;
  profile_id: string;
  is_public: boolean;
  available_for_hire: boolean;
  expected_salary_min: number | null;
  expected_salary_max: number | null;
  views_count: number;
  profile: {
    first_name: string | null;
    last_name: string | null;
    headline: string | null;
    bio: string | null;
    location: string | null;
    country: string | null;
    avatar_url: string | null;
    skills: string[];
    years_of_experience: number;
    verification_status: string;
  };
}

const Jobseekers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const [jobseekers, setJobseekers] = useState<JobseekerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobseekers, setFilteredJobseekers] = useState<JobseekerProfile[]>([]);

  useEffect(() => {
    fetchJobseekers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = jobseekers.filter((js) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          js.profile.first_name?.toLowerCase().includes(searchLower) ||
          js.profile.last_name?.toLowerCase().includes(searchLower) ||
          js.profile.headline?.toLowerCase().includes(searchLower) ||
          js.profile.location?.toLowerCase().includes(searchLower) ||
          js.profile.skills?.some((skill) => skill.toLowerCase().includes(searchLower))
        );
      });
      setFilteredJobseekers(filtered);
    } else {
      setFilteredJobseekers(jobseekers);
    }
  }, [searchQuery, jobseekers]);

  const fetchJobseekers = async () => {
    try {
      const { data, error } = await supabase
        .from('jobseeker_profiles')
        .select(`
          *,
          profile:profiles(
            first_name,
            last_name,
            headline,
            bio,
            location,
            country,
            avatar_url,
            skills,
            years_of_experience,
            verification_status
          )
        `)
        .eq('is_public', true)
        .eq('is_searchable', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobseekers(data || []);
    } catch (error: any) {
      console.error('Error fetching jobseekers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName: string | null, lastName: string | null) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'JS';
  };

  const formatSalaryRange = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `R${(min / 1000).toFixed(0)}k - R${(max / 1000).toFixed(0)}k`;
    if (min) return `From R${(min / 1000).toFixed(0)}k`;
    if (max) return `Up to R${(max / 1000).toFixed(0)}k`;
    return null;
  };

  const canViewFullProfile = () => {
    return user && isPremium();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Jobseeker Profiles</h1>
            <p className="text-muted-foreground">
              Discover talented South African professionals ready for their next opportunity
            </p>
          </div>

          {/* Premium Access Banner */}
          {!canViewFullProfile() && (
            <Card className="mb-8 border-primary/50 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Crown className="h-6 w-6 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">
                      Upgrade to Recruitment Suite for Full Access
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get unlimited access to full profiles, contact information, resumes, and direct messaging with verified jobseekers.
                    </p>
                    <Button onClick={() => navigate('/pro')} size="sm">
                      View Plans
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search by name, skills, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredJobseekers.length} of {jobseekers.length} profiles
            </p>
          </div>

          {/* Jobseeker Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobseekers.map((jobseeker) => (
              <Card 
                key={jobseeker.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/jobseekers/${jobseeker.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={jobseeker.profile.avatar_url || undefined} />
                      <AvatarFallback>
                        {getInitials(jobseeker.profile.first_name, jobseeker.profile.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg truncate">
                          {canViewFullProfile() 
                            ? `${jobseeker.profile.first_name || ''} ${jobseeker.profile.last_name || ''}`
                            : `${jobseeker.profile.first_name || ''} ${jobseeker.profile.last_name?.[0] || ''}.`
                          }
                        </CardTitle>
                        {jobseeker.profile.verification_status === 'approved' && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      {jobseeker.profile.headline && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {jobseeker.profile.headline}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {jobseeker.profile.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{jobseeker.profile.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{jobseeker.profile.years_of_experience}+ years experience</span>
                  </div>

                  {jobseeker.available_for_hire && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Available for Hire
                    </Badge>
                  )}

                  {formatSalaryRange(jobseeker.expected_salary_min, jobseeker.expected_salary_max) && (
                    <p className="text-sm font-medium">
                      {canViewFullProfile() ? (
                        formatSalaryRange(jobseeker.expected_salary_min, jobseeker.expected_salary_max)
                      ) : (
                        <span className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Salary expectations hidden
                        </span>
                      )}
                    </p>
                  )}

                  {jobseeker.profile.skills && jobseeker.profile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {jobseeker.profile.skills.slice(0, canViewFullProfile() ? 6 : 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {jobseeker.profile.skills.length > (canViewFullProfile() ? 6 : 3) && (
                        <Badge variant="outline" className="text-xs">
                          +{jobseeker.profile.skills.length - (canViewFullProfile() ? 6 : 3)} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {!canViewFullProfile() && jobseeker.profile.bio && jobseeker.profile.bio.length > 0 && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {jobseeker.profile.bio.length > 100 
                        ? `${jobseeker.profile.bio.substring(0, 100)}...`
                        : jobseeker.profile.bio
                      }
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredJobseekers.length === 0 && (
            <Card className="p-12">
              <div className="text-center">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No jobseekers found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jobseekers;
