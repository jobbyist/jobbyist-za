import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import FormErrorSummary from '@/components/FormErrorSummary';
import { useJob } from '@/hooks/useJobs';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SEOHead, generateJobPostingSchema } from '@/components/SEOHead';
import ExpiredBadge from '@/components/ExpiredBadge';
import { isJobExpired } from '@/lib/jobUtils';
import { toast } from 'sonner';
import { 
  ArrowLeft, MapPin, Wifi, Building2, Clock, DollarSign,
  Briefcase, CheckCircle2, ExternalLink, Share2, Bookmark, BookmarkCheck, Lock, Crown, Flag
} from 'lucide-react';
import { formatSalary, getCountryByCode, type CountryCode } from '@/lib/countries';

const JobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, canApplyToJobs } = useProfile();
  const { hasActiveSubscription, loading: subLoading } = useSubscription();
  const { job, loading } = useJob(jobId);
  const isPro = hasActiveSubscription();
  const expired = isJobExpired(job?.posted_at);
  
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingJob, setSavingJob] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportEmail, setReportEmail] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const reportErrors = !reportReason ? ['Select a report reason before submitting.'] : [];

  // Load saved state
  useEffect(() => {
    if (!user || !job) return;
    (async () => {
      const { data } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('user_id', user.id)
        .eq('job_id', job.id)
        .maybeSingle();
      setIsSaved(!!data);
    })();
  }, [user, job]);

  const handleToggleSave = async () => {
    if (!user) {
      toast.error('Sign in to save jobs');
      navigate('/auth');
      return;
    }
    if (!job) return;
    setSavingJob(true);
    try {
      if (isSaved) {
        const { error } = await supabase.from('saved_jobs').delete().eq('user_id', user.id).eq('job_id', job.id);
        if (error) throw error;
        setIsSaved(false);
        toast.success('Removed from saved jobs');
      } else {
        const { error } = await supabase.from('saved_jobs').insert({ user_id: user.id, job_id: job.id });
        if (error && error.code !== '23505') throw error;
        setIsSaved(true);
        toast.success('Saved to your dashboard');
      }
    } catch (e: any) {
      console.error(e);
      toast.error('Could not update saved jobs');
    } finally {
      setSavingJob(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!job || !reportReason) {
      toast.error('Please select a reason');
      return;
    }
    setSubmittingReport(true);
    try {
      const { error } = await (supabase.from as any)('job_reports').insert({
        job_id: job.id,
        user_id: user?.id ?? null,
        reason: reportReason,
        details: reportDetails || null,
        reporter_email: reportEmail || user?.email || null,
      });
      if (error) throw error;
      toast.success('Report submitted. Thanks for helping keep Jobbyist clean.');
      setShowReportDialog(false);
      setReportReason('');
      setReportDetails('');
      setReportEmail('');
    } catch (e: any) {
      console.error(e);
      toast.error('Could not submit report');
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleApply = async () => {
    if (!user || !job) return;

    if (!canApplyToJobs) {
      toast.error('Complete your profile and get verified to apply');
      navigate('/profile');
      return;
    }

    setIsApplying(true);
    try {
      const { error } = await supabase.from('job_applications').insert({
        job_id: job.id,
        user_id: user.id,
        cover_letter: coverLetter || null,
        resume_url: profile?.resume_url || null,
      });

      if (error) {
        if (error.code === '23505') {
          toast.error('You have already applied to this job');
        } else {
          throw error;
        }
      } else {
        toast.success('Application submitted successfully!');
        setHasApplied(true);
        setShowApplyDialog(false);
      }
    } catch (error: any) {
      console.error('Error applying to job:', error);
      toast.error('Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: job?.title,
        text: `Check out this job: ${job?.title} at ${job?.company?.name}`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main id="main-content" className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/4 mb-4" />
              <div className="h-12 bg-muted rounded w-3/4 mb-4" />
              <div className="h-6 bg-muted rounded w-1/2 mb-8" />
              <div className="h-64 bg-muted rounded" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main id="main-content" className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
            <p className="text-muted-foreground mb-6">
              This job listing may have been removed or is no longer available.
            </p>
            <Link to="/jobs">
              <Button>Browse All Jobs</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const country = getCountryByCode(job.country as CountryCode);

  // Generate structured data for Google Jobs only if company exists
  const jobSchema = job.company ? generateJobPostingSchema({
    ...job,
    company: job.company,
    posted_at: job.posted_at || new Date().toISOString(),
  }) : undefined;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${job.title} at ${job.company?.name} | Jobbyist`}
        description={job.description?.substring(0, 160) + '...' || 'Job opportunity in South Africa'}
        canonicalUrl={`https://za.jobbyist.africa/job/${job.id}`}
        ogImage={job.company?.logo_url || undefined}
        structuredData={jobSchema}
        keywords={[
          job.title,
          job.company?.name || '',
          job.location,
          'jobs South Africa',
          ...(job.skills || [])
        ]}
      />
      <Navbar />
      <main id="main-content" className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/jobs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  {job.company?.logo_url ? (
                    <img src={job.company.logo_url} alt={job.company.name} className="w-10 h-10 object-contain" />
                  ) : (
                    <Building2 className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{job.title}</h1>
                  <p className="text-lg text-muted-foreground">{job.company?.name}</p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                  {country && <span>{country.flag}</span>}
                </div>
                {job.is_remote && (
                  <div className="flex items-center gap-2 text-primary">
                    <Wifi className="h-4 w-4" />
                    <span>Remote OK</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Posted {new Date(job.posted_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{job.job_type}</Badge>
                {job.experience_level && <Badge variant="outline">{job.experience_level}</Badge>}
                {job.salary_min && job.salary_max && (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {formatSalary(job.salary_min, job.country as CountryCode)} - {formatSalary(job.salary_max, job.country as CountryCode)}/{job.salary_period}
                  </Badge>
                )}
                {expired && <ExpiredBadge />}
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </CardContent>
              </Card>

              {/* Responsibilities */}
              {job.responsibilities && (
                <Card>
                  <CardHeader>
                    <CardTitle>Responsibilities</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap">{job.responsibilities}</p>
                  </CardContent>
                </Card>
              )}

              {/* Qualifications */}
              {job.qualifications && (
                <Card>
                  <CardHeader>
                    <CardTitle>Qualifications</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap">{job.qualifications}</p>
                  </CardContent>
                </Card>
              )}

              {/* Skills */}
              {job.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              {job.benefits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card className="sticky top-24">
                <CardContent className="pt-6 space-y-4">
                  {expired ? (
                    <div className="text-center py-4">
                      <ExpiredBadge className="mx-auto" />
                      <p className="font-semibold mt-3">This offer has expired</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Posted more than 30 days ago. Browse fresh listings instead.
                      </p>
                      <Link to="/jobs">
                        <Button className="w-full">Browse Active Jobs</Button>
                      </Link>
                    </div>
                  ) : hasApplied ? (
                    <div className="text-center py-4">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                      <p className="font-semibold">Application Submitted!</p>
                      <p className="text-sm text-muted-foreground">We'll notify you of any updates</p>
                    </div>
                  ) : !user ? (
                    <Link to="/auth">
                      <Button className="w-full" size="lg">
                        Sign in to Apply
                      </Button>
                    </Link>
                  ) : !isPro && !subLoading ? (
                    <div className="text-center space-y-3">
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Pro membership required</p>
                        <p className="text-sm text-muted-foreground">
                          Upgrade to Jobbyist Pro to apply directly to verified employers — from R99/month.
                        </p>
                      </div>
                      <Link to="/pro">
                        <Button className="w-full gradient-brand" size="lg">
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade to Pro to Apply
                        </Button>
                      </Link>
                    </div>
                  ) : canApplyToJobs ? (
                    <>
                    <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full" size="lg">
                          Apply Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Apply for {job.title}</DialogTitle>
                          <DialogDescription>
                            Your profile and resume will be shared with {job.company?.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cover-letter" className="text-sm font-medium">Cover Letter (Optional)</Label>
                            <Textarea
                              id="cover-letter"
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                              placeholder="Tell the employer why you're a great fit for this role..."
                              rows={5}
                              aria-invalid={false}
                              aria-describedby="cover-letter-hint"
                            />
                            <p id="cover-letter-hint" className="text-xs text-muted-foreground mt-1">Keep it concise and role-specific.</p>
                          </div>
                          <Button onClick={handleApply} disabled={isApplying} className="w-full">
                            {isApplying ? 'Submitting...' : 'Submit Application'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <p className="text-xs text-muted-foreground">
                      We verify listings continuously, but always review employer details before sharing sensitive information.
                      <Link to="/trust-safety" className="underline ml-1">Trust &amp; Safety</Link>.
                    </p>
                    </>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Complete your profile and get verified to apply
                      </p>
                      <Link to="/profile">
                        <Button className="w-full">Complete Profile</Button>
                      </Link>
                    </div>
                  )}

                  {job.external_url && (
                    <a href={job.external_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apply on Company Site
                      </Button>
                    </a>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={handleToggleSave} disabled={savingJob}>
                      {isSaved ? <BookmarkCheck className="h-4 w-4 mr-2" /> : <Bookmark className="h-4 w-4 mr-2" />}
                      {isSaved ? 'Saved' : 'Save'}
                    </Button>
                  </div>

                  <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                        <Flag className="h-4 w-4 mr-2" />
                        Report this listing
                      </Button>
                    </DialogTrigger>
                    <p className="text-xs text-muted-foreground">
                      Reports are reviewed by our team, with urgent fraud reports prioritized within 24 hours.
                    </p>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Report this job</DialogTitle>
                        <DialogDescription>
                          Flag inappropriate, inaccurate, fraudulent or misleading listings.
                          Reports go to our trust &amp; safety team at feedback@jobbyist.africa. See our
                          <Link to="/listing-policy" className="underline ml-1">listing policy and review timelines</Link>.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3">
                        <FormErrorSummary errors={reportErrors} />
                        <div className="space-y-2">
                          <Label htmlFor="report-reason">Reason for report</Label>
                          <Select value={reportReason} onValueChange={setReportReason}>
                          <SelectTrigger id="report-reason" aria-invalid={!reportReason} aria-describedby={!reportReason ? 'report-reason-error' : 'report-reason-hint'}><SelectValue placeholder="Select a reason" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fraudulent">Fraudulent or scam</SelectItem>
                            <SelectItem value="misleading">Misleading information</SelectItem>
                            <SelectItem value="inaccurate">Inaccurate details</SelectItem>
                            <SelectItem value="expired">Already filled / expired</SelectItem>
                            <SelectItem value="inappropriate">Inappropriate content</SelectItem>
                            <SelectItem value="duplicate">Duplicate listing</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <p id="report-reason-hint" className="text-xs text-muted-foreground">Choose the closest matching reason.</p>
                        {!reportReason && <p id="report-reason-error" role="alert" className="text-xs text-destructive">Reason is required.</p>}
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="report-details">Additional details (optional)</Label>
                        <Textarea
                          id="report-details"
                          placeholder="Add any details that will help us investigate (optional)"
                          value={reportDetails}
                          onChange={(e) => setReportDetails(e.target.value)}
                          rows={3}
                          aria-invalid={false}
                          aria-describedby="report-details-hint"
                        />
                        <p id="report-details-hint" className="text-xs text-muted-foreground">Include links, dates, or suspicious behavior.</p>
                        </div>
                        {!user && (
                          <div className="space-y-2">
                            <Label htmlFor="report-email">Your email (optional)</Label>
                            <Input
                            id="report-email"
                            type="email"
                            placeholder="Your email (optional)"
                            value={reportEmail}
                            onChange={(e) => setReportEmail(e.target.value)}
                            aria-invalid={false}
                            aria-describedby="report-email-hint"
                          />
                          <p id="report-email-hint" className="text-xs text-muted-foreground">Used only if we need follow-up.</p>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowReportDialog(false)}>Cancel</Button>
                        <Button onClick={handleSubmitReport} disabled={submittingReport || !reportReason}>
                          {submittingReport ? 'Submitting...' : 'Submit report'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Company Info */}
              {job.company && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About {job.company.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {job.company.industry && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Industry</span>
                        <span>{job.company.industry}</span>
                      </div>
                    )}
                    {job.company.location && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span>{job.company.location}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetail;
