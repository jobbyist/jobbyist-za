import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import CompanyLogo from '@/components/ui/company-logo';
import { toast } from 'sonner';
import { Building2, MapPin, Users, Globe, CheckCircle, AlertCircle, Briefcase } from 'lucide-react';
import { useState } from 'react';

const CompanyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [claimNotes, setClaimNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: company, isLoading } = useQuery({
    queryKey: ['company', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['company-jobs', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', company.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!company?.id,
  });

  const handleClaimCompany = async () => {
    if (!user) {
      toast.error('Please sign in to claim this company');
      return;
    }

    if (!claimNotes.trim()) {
      toast.error('Please provide information about your claim');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          claimed_by: user.id,
          claimed_at: new Date().toISOString(),
          claim_status: 'pending',
          claim_notes: claimNotes,
        })
        .eq('id', company?.id);

      if (error) throw error;

      toast.success('Claim submitted successfully! We will review your request.');
      setShowClaimDialog(false);
      setClaimNotes('');
    } catch (error) {
      console.error('Error claiming company:', error);
      toast.error('Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-48 w-full mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Company Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The company you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/jobs">
            <Button>Browse Jobs</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Company Header */}
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              <CompanyLogo 
                logoUrl={company.logo_url}
                companyName={company.name}
                size="xl"
                className="border-2 border-border shadow-lg"
              />
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
                  <div className="flex flex-wrap gap-3 text-muted-foreground">
                    {company.industry && (
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span>{company.industry}</span>
                      </div>
                    )}
                    {company.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{company.location}</span>
                      </div>
                    )}
                    {company.size && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{company.size} employees</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {company.is_verified && (
                    <Badge className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {company.claim_status === 'approved' && (
                    <Badge variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Claimed
                    </Badge>
                  )}
                </div>
              </div>

              {company.description && (
                <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
                  {company.description}
                </p>
              )}

              <div className="flex gap-3">
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  </a>
                )}
                
                {(!company.claim_status || company.claim_status === 'unclaimed') && (
                  <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Building2 className="h-4 w-4 mr-2" />
                        Claim This Page
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Claim Company Page</DialogTitle>
                        <DialogDescription>
                          Verify your association with {company.name} to manage this company page.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Why should you be able to manage this page?
                          </label>
                          <Textarea
                            placeholder="Please provide details about your role at the company and why you should be able to manage this page..."
                            value={claimNotes}
                            onChange={(e) => setClaimNotes(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <Button
                          onClick={handleClaimCompany}
                          disabled={isSubmitting}
                          className="w-full"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Claim Request'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {company.claim_status === 'pending' && (
                  <Badge variant="outline" className="px-4 py-2">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Claim Pending Review
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Open Positions
            </CardTitle>
            <CardDescription>
              Current job openings at {company.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {jobsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : jobs && jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Link key={job.id} to={`/job/${job.id}`}>
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          <Badge>{job.job_type}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                            {job.is_remote && <Badge variant="outline" className="ml-1">Remote</Badge>}
                          </div>
                          {job.salary_min && job.salary_max && (
                            <span>
                              {job.salary_currency} {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} / {job.salary_period}
                            </span>
                          )}
                        </div>
                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.skills.slice(0, 5).map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No open positions at the moment.</p>
                <p className="text-sm mt-2">Check back later for new opportunities!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default CompanyDetail;
