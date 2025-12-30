import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Loader2 } from 'lucide-react';
import { JobMatcherProfile } from '@/hooks/useJobMatcher';

interface JobPreferencesFormProps {
  initialData?: Partial<JobMatcherProfile>;
  onSave: (data: Partial<JobMatcherProfile>) => Promise<void>;
  isSaving?: boolean;
}

export function JobPreferencesForm({ initialData, onSave, isSaving }: JobPreferencesFormProps) {
  const [jobTitles, setJobTitles] = useState<string[]>(initialData?.job_titles || []);
  const [locations, setLocations] = useState<string[]>(initialData?.locations || []);
  const [industries, setIndustries] = useState<string[]>(initialData?.industries || []);
  const [jobTypes, setJobTypes] = useState<string[]>(initialData?.job_types || []);
  const [remotePreference, setRemotePreference] = useState<string>(initialData?.remote_preference || 'any');
  const [salaryMin, setSalaryMin] = useState<string>(initialData?.salary_min?.toString() || '');
  const [salaryMax, setSalaryMax] = useState<string>(initialData?.salary_max?.toString() || '');
  const [notificationFrequency, setNotificationFrequency] = useState<string>(initialData?.notification_frequency || 'daily');

  const [newJobTitle, setNewJobTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newIndustry, setNewIndustry] = useState('');

  useEffect(() => {
    if (initialData) {
      setJobTitles(initialData.job_titles || []);
      setLocations(initialData.locations || []);
      setIndustries(initialData.industries || []);
      setJobTypes(initialData.job_types || []);
      setRemotePreference(initialData.remote_preference || 'any');
      setSalaryMin(initialData.salary_min?.toString() || '');
      setSalaryMax(initialData.salary_max?.toString() || '');
      setNotificationFrequency(initialData.notification_frequency || 'daily');
    }
  }, [initialData]);

  const addJobTitle = () => {
    if (newJobTitle.trim() && !jobTitles.includes(newJobTitle.trim())) {
      setJobTitles([...jobTitles, newJobTitle.trim()]);
      setNewJobTitle('');
    }
  };

  const removeJobTitle = (title: string) => {
    setJobTitles(jobTitles.filter(t => t !== title));
  };

  const addLocation = () => {
    if (newLocation.trim() && !locations.includes(newLocation.trim())) {
      setLocations([...locations, newLocation.trim()]);
      setNewLocation('');
    }
  };

  const removeLocation = (location: string) => {
    setLocations(locations.filter(l => l !== location));
  };

  const addIndustry = () => {
    if (newIndustry.trim() && !industries.includes(newIndustry.trim())) {
      setIndustries([...industries, newIndustry.trim()]);
      setNewIndustry('');
    }
  };

  const removeIndustry = (industry: string) => {
    setIndustries(industries.filter(i => i !== industry));
  };

  const toggleJobType = (type: string) => {
    if (jobTypes.includes(type)) {
      setJobTypes(jobTypes.filter(t => t !== type));
    } else {
      setJobTypes([...jobTypes, type]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await onSave({
      job_titles: jobTitles,
      locations: locations,
      industries: industries,
      job_types: jobTypes,
      remote_preference: remotePreference as any,
      salary_min: salaryMin ? parseInt(salaryMin) : null,
      salary_max: salaryMax ? parseInt(salaryMax) : null,
      notification_frequency: notificationFrequency as any,
      is_active: true,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Preferences</CardTitle>
        <CardDescription>
          Set your job preferences to receive better matches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Titles */}
          <div className="space-y-2">
            <Label>Preferred Job Titles</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Software Engineer"
                value={newJobTitle}
                onChange={(e) => setNewJobTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addJobTitle())}
              />
              <Button type="button" onClick={addJobTitle} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {jobTitles.map(title => (
                <Badge key={title} variant="secondary" className="gap-1">
                  {title}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeJobTitle(title)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-2">
            <Label>Preferred Locations</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Cape Town"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
              />
              <Button type="button" onClick={addLocation} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {locations.map(location => (
                <Badge key={location} variant="secondary" className="gap-1">
                  {location}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeLocation(location)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Remote Preference */}
          <div className="space-y-2">
            <Label>Remote Preference</Label>
            <Select value={remotePreference} onValueChange={setRemotePreference}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="remote">Remote Only</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Minimum Salary (ZAR/month)</Label>
              <Input
                type="number"
                placeholder="e.g., 30000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Maximum Salary (ZAR/month)</Label>
              <Input
                type="number"
                placeholder="e.g., 80000"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
              />
            </div>
          </div>

          {/* Industries */}
          <div className="space-y-2">
            <Label>Preferred Industries</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Technology"
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIndustry())}
              />
              <Button type="button" onClick={addIndustry} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {industries.map(industry => (
                <Badge key={industry} variant="secondary" className="gap-1">
                  {industry}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeIndustry(industry)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Job Types */}
          <div className="space-y-2">
            <Label>Job Types</Label>
            <div className="flex flex-wrap gap-2">
              {['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'].map(type => (
                <Badge
                  key={type}
                  variant={jobTypes.includes(type) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleJobType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* Notification Frequency */}
          <div className="space-y-2">
            <Label>Notification Frequency</Label>
            <Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Preferences'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
