import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bot, Play, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { activeCountries, type CountryCode } from '@/lib/countries';

const AdminScraper = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('ZA');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [jobsScraped, setJobsScraped] = useState(0);

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

  const getStatusBadge = () => {
    switch (status) {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Job Scraper</h2>
        <p className="text-muted-foreground">
          Automatically scrape job listings from various sources using Firecrawl
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Run Scraper
            </CardTitle>
            <CardDescription>
              Scrape job listings from multiple job boards
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
            <CardTitle>Scraper Status</CardTitle>
            <CardDescription>Current status and last run information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              {getStatusBadge()}
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
          <CardTitle>How It Works</CardTitle>
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
    </div>
  );
};

export default AdminScraper;
