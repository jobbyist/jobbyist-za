import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useJobMatcher } from '@/hooks/useJobMatcher';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/SEOHead';
import { ResumeUploader } from '@/components/job-matcher/ResumeUploader';
import { JobPreferencesForm } from '@/components/job-matcher/JobPreferencesForm';
import { MatchedJobsList } from '@/components/job-matcher/MatchedJobsList';
import { AutoApplySettings } from '@/components/job-matcher/AutoApplySettings';
import { Sparkles, Target, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const JobMatcher = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const {
    profile,
    matches,
    loading,
    matchingInProgress,
    createOrUpdateProfile,
    matchJobs,
    updateMatchStatus,
    refetchMatches,
  } = useJobMatcher();

  const [parsedResume, setParsedResume] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleResumeProcessed = (data: any) => {
    setParsedResume(data);
    toast.success('Resume parsed! Now set your job preferences.');
    setActiveTab('preferences');
  };

  const handleSavePreferences = async (data: any) => {
    setIsSaving(true);
    try {
      // Save preferences with parsed resume
      await createOrUpdateProfile({
        ...data,
        parsed_resume: parsedResume || profile?.parsed_resume,
      });
      
      // Automatically trigger job matching
      toast.info('Starting job matching...');
      await matchJobs(parsedResume || profile?.parsed_resume, data);
      
      setActiveTab('matches');
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunMatching = async () => {
    if (!profile?.parsed_resume && !parsedResume) {
      toast.error('Please upload and parse your resume first');
      setActiveTab('upload');
      return;
    }

    await matchJobs();
    setActiveTab('matches');
  };

  const handleSaveAutoApply = async (data: any) => {
    await createOrUpdateProfile(data);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="AI Job Matcher - Find Your Perfect Job with AI"
        description="Upload your resume and let AI match you with the perfect job opportunities. Get real-time notifications and automatic applications."
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Powered by AI</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold">
                  Find Your <span className="text-primary">Perfect Job</span>
                  <br />with AI Matching
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Upload your resume and let our AI-powered job matcher find opportunities that perfectly align
                  with your skills, experience, and career goals. Get automatic applications and real-time notifications.
                </p>
                <div className="flex flex-wrap gap-4 justify-center pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">AI-Powered Matching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Smart Notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Auto-Apply</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-7xl">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span className="hidden sm:inline">Upload Resume</span>
                    <span className="sm:hidden">Resume</span>
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Preferences</span>
                    <span className="sm:hidden">Prefs</span>
                  </TabsTrigger>
                  <TabsTrigger value="matches" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">Matches</span>
                    {matches.length > 0 && (
                      <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                        {matches.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="auto-apply" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="hidden sm:inline">Auto-Apply</span>
                    <span className="sm:hidden">Auto</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-6">
                  <ResumeUploader onResumeProcessed={handleResumeProcessed} />
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6">
                  <JobPreferencesForm
                    initialData={profile || undefined}
                    onSave={handleSavePreferences}
                    isSaving={isSaving || matchingInProgress}
                  />
                </TabsContent>

                <TabsContent value="matches" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold">Your Job Matches</h2>
                      <p className="text-muted-foreground">
                        AI-powered matches based on your resume and preferences
                      </p>
                    </div>
                    <Button
                      onClick={handleRunMatching}
                      disabled={matchingInProgress}
                    >
                      {matchingInProgress ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Matching...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Refresh Matches
                        </>
                      )}
                    </Button>
                  </div>
                  <MatchedJobsList
                    matches={matches}
                    onStatusChange={updateMatchStatus}
                    onApply={(jobId) => {
                      toast.success('Application submitted!');
                      refetchMatches();
                    }}
                  />
                </TabsContent>

                <TabsContent value="auto-apply" className="space-y-6">
                  <AutoApplySettings
                    profile={profile}
                    onSave={handleSaveAutoApply}
                    isSaving={isSaving}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default JobMatcher;
