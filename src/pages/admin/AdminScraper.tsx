import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bot, Play, Clock, CheckCircle2, AlertCircle, RefreshCw, Globe } from 'lucide-react';
import { activeCountries, type CountryCode } from '@/lib/countries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminScraper = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('ZA');
  const [isRunning, setIsRunning] = useState(false);
  const [isRemoteRunning, setIsRemoteRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [remoteProgress, setRemoteProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [remoteStatus, setRemoteStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [lastRemoteRun, setLastRemoteRun] = useState<string | null>(null);
  const [jobsScraped, setJobsScraped] = useState(0);
  const [remoteJobsScraped, setRemoteJobsScraped] = useState(0);

  const runScraper = async () => {
    setIsRunning(true);
    setStatus('running');
    setProgress(0);
    setJobsScraped(0);

    try {
      const { data, error } = await supabase.functions.invoke('scrape-jobs', {
        body: { country: selectedCountry },
      });

      if (error) throw error;

      setProgress(100);
      setStatus('success');
      setJobsScraped(data?.jobsCreated || 0);
      setLastRun(new Date().toISOString());
      toast.success(`Successfully scraped ${data?.jobsCreated || 0} jobs from ${activeCountries.find(c => c.code === selectedCountry)?.name}`);
    } catch (error: any) {
      console.error('Scraper error:', error);
      setStatus('error');
      toast.error(`Scraper failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runRemoteScraper = async () => {
    setIsRemoteRunning(true);
    setRemoteStatus('running');
    setRemoteProgress(0);
    setRemoteJobsScraped(0);

    try {
      const { data, error } = await supabase.functions.invoke('scrape-remote-jobs-firecrawl', {
        body: { targetCount: 250 },
      });

      if (error) throw error;

      setRemoteProgress(100);
      setRemoteStatus('success');
      setRemoteJobsScraped(data?.jobsCreated || 0);
      setLastRemoteRun(new Date().toISOString());
      toast.success(`Successfully scraped ${data?.jobsCreated || 0} remote jobs from international job boards`);
    } catch (error: any) {
      console.error('Remote scraper error:', error);
      setRemoteStatus('error');
      toast.error(`Remote scraper failed: ${error.message}`);
    } finally {
      setIsRemoteRunning(false);
    }
  };

  const getStatusBadge = (statusType: 'local' | 'remote' = 'local') => {
    const currentStatus = statusType === 'remote' ? remoteStatus : status;
    switch (currentStatus) {
      case 'running':
        return <Badge className="bg-blue-500"><RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Running</Badge>;
      case 'success':
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Success</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Error</Badge>;
      default:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" /> Idle</Badge>;
    }
  };

  const jobSources = {
    ZA: ['Careers24', 'Indeed SA', 'LinkedIn', 'PNet', 'JobMail'],
    NG: ['Jobberman', 'MyJobMag', 'LinkedIn', 'Indeed Nigeria', 'HotNigerianJobs'],
    KE: ['BrighterMonday', 'CareerPoint', 'LinkedIn', 'Indeed Kenya', 'Fuzu'],
  };

  const remoteJobSources = [
    'Remotive.com',
    'We Work Remotely',
    'Remote.co',
    'Working Nomads',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Job Scraper</h2>
        <p className="text-muted-foreground">
          Automatically scrape job listings from various sources using Firecrawl
        </p>
      </div>

      <Tabs defaultValue="remote" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="remote" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Remote Jobs (International)
          </TabsTrigger>
          <TabsTrigger value="local" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Local Jobs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="remote" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Scrape Remote Jobs
                </CardTitle>
                <CardDescription>
                  Scrape remote jobs from international job boards for SA talent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Target Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {remoteJobSources.map((source) => (
                      <Badge key={source} variant="secondary">{source}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Focus: Remote positions from international employers looking for South African talent
                  </p>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium mb-1">Target: 250+ Jobs</p>
                  <p className="text-xs text-muted-foreground">
                    Real job listings scraped with Firecrawl and parsed with AI
                  </p>
                </div>

                {isRemoteRunning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{remoteProgress}%</span>
                    </div>
                    <Progress value={remoteProgress} />
                  </div>
                )}

                <Button onClick={runRemoteScraper} disabled={isRemoteRunning} className="w-full">
                  {isRemoteRunning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Scraping Remote Jobs...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Remote Job Scraper
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Remote Scraper Status</CardTitle>
                <CardDescription>Current status and last run information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge('remote')}
                </div>
                
                {lastRemoteRun && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last Run</span>
                    <span className="text-sm">{new Date(lastRemoteRun).toLocaleString()}</span>
                  </div>
                )}

                {remoteJobsScraped > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Jobs Scraped</span>
                    <span className="text-sm font-medium">{remoteJobsScraped}</span>
                  </div>
                )}

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Features</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✓ Real-time scraping with Firecrawl API</li>
                    <li>✓ AI-powered job parsing with Claude</li>
                    <li>✓ Automatic company creation</li>
                    <li>✓ Remote-first opportunities</li>
                    <li>✓ International employers</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>How Remote Scraping Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Firecrawl API scrapes job board pages for remote positions</li>
                <li>Claude AI extracts and structures job listing data from scraped content</li>
                <li>System filters for jobs suitable for South African talent</li>
                <li>Companies are automatically created or matched in the database</li>
                <li>Jobs are published as "active" and marked as remote opportunities</li>
                <li>All jobs include international company information and remote work benefits</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="local" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Run Local Scraper
                </CardTitle>
                <CardDescription>
                  Scrape job listings from local job boards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Country</label>
                  <Select value={selectedCountry} onValueChange={(v) => setSelectedCountry(v as CountryCode)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {activeCountries.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.flag} {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Sources to scrape:</p>
                  <div className="flex flex-wrap gap-2">
                    {jobSources[selectedCountry]?.map((source) => (
                      <Badge key={source} variant="secondary">{source}</Badge>
                    ))}
                  </div>
                </div>

                {isRunning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}

                <Button onClick={runScraper} disabled={isRunning} className="w-full">
                  {isRunning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Scraping...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Scraper
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Local Scraper Status</CardTitle>
                <CardDescription>Current status and last run information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge('local')}
                </div>
                
                {lastRun && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last Run</span>
                    <span className="text-sm">{new Date(lastRun).toLocaleString()}</span>
                  </div>
                )}

                {jobsScraped > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Jobs Scraped</span>
                    <span className="text-sm font-medium">{jobsScraped}</span>
                  </div>
                )}

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Scheduled Runs</p>
                  <p className="text-sm text-muted-foreground">
                    The scraper runs automatically every day at 6:00 AM (UTC) for all active countries.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>How Local Scraping Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>The scraper uses Firecrawl to fetch job listings from major job boards in each country</li>
                <li>Jobs are parsed and structured according to Google Jobs Schema guidelines</li>
                <li>Duplicate jobs are automatically detected and skipped</li>
                <li>New companies are created automatically if they don't exist</li>
                <li>All scraped jobs are set to "active" status and can be managed in the Jobs tab</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminScraper;
