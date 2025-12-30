import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, AlertCircle } from 'lucide-react';
import { JobMatcherProfile } from '@/hooks/useJobMatcher';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AutoApplySettingsProps {
  profile?: JobMatcherProfile | null;
  onSave: (data: Partial<JobMatcherProfile>) => Promise<void>;
  isSaving?: boolean;
}

export function AutoApplySettings({ profile, onSave, isSaving }: AutoApplySettingsProps) {
  const [autoApplyEnabled, setAutoApplyEnabled] = useState(profile?.auto_apply_enabled || false);
  const [minScore, setMinScore] = useState(profile?.auto_apply_min_score || 80);
  const [coverLetterTemplate, setCoverLetterTemplate] = useState(profile?.cover_letter_template || '');

  useEffect(() => {
    if (profile) {
      setAutoApplyEnabled(profile.auto_apply_enabled || false);
      setMinScore(profile.auto_apply_min_score || 80);
      setCoverLetterTemplate(profile.cover_letter_template || '');
    }
  }, [profile]);

  const handleSave = async () => {
    await onSave({
      auto_apply_enabled: autoApplyEnabled,
      auto_apply_min_score: minScore,
      cover_letter_template: coverLetterTemplate,
    });
  };

  const defaultTemplate = `Dear Hiring Manager,

I am writing to express my strong interest in the [JOB_TITLE] position at [COMPANY_NAME]. With my background in [YOUR_FIELD] and proven track record of [KEY_ACHIEVEMENT], I am confident I would be a valuable addition to your team.

[PARAGRAPH ABOUT RELEVANT EXPERIENCE AND SKILLS]

[PARAGRAPH ABOUT WHY YOU'RE INTERESTED IN THE COMPANY/ROLE]

Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experience align with your needs.

Best regards,
[YOUR_NAME]`;

  const handleUseDefaultTemplate = () => {
    setCoverLetterTemplate(defaultTemplate);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <CardTitle>Auto-Apply Settings</CardTitle>
          <Badge variant="secondary">Premium Feature</Badge>
        </div>
        <CardDescription>
          Automatically apply to jobs that match your criteria
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            Auto-apply will automatically submit applications to jobs that meet your minimum match score threshold.
            Make sure your profile and cover letter template are up to date.
          </AlertDescription>
        </Alert>

        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="auto-apply">Enable Auto-Apply</Label>
            <p className="text-sm text-muted-foreground">
              Automatically apply to jobs that match your preferences
            </p>
          </div>
          <Switch
            id="auto-apply"
            checked={autoApplyEnabled}
            onCheckedChange={setAutoApplyEnabled}
          />
        </div>

        {autoApplyEnabled && (
          <>
            {/* Minimum Score Threshold */}
            <div className="space-y-2">
              <Label>Minimum Match Score: {minScore}%</Label>
              <p className="text-sm text-muted-foreground">
                Only apply to jobs with a match score of {minScore}% or higher
              </p>
              <div className="flex items-center gap-4">
                <Input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value))}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min="50"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value) || 80)}
                  className="w-20"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>More jobs</span>
                <span>Better matches</span>
              </div>
            </div>

            {/* Cover Letter Template */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Cover Letter Template</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUseDefaultTemplate}
                >
                  Use Default Template
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Use placeholders: [JOB_TITLE], [COMPANY_NAME], [YOUR_NAME], [YOUR_FIELD], [KEY_ACHIEVEMENT]
              </p>
              <Textarea
                placeholder="Enter your cover letter template..."
                value={coverLetterTemplate}
                onChange={(e) => setCoverLetterTemplate(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            {/* AI Enhancement Notice */}
            <Alert>
              <AlertDescription>
                <strong>AI Enhancement:</strong> Our AI will customize this template for each job application,
                highlighting your most relevant skills and experience for that specific role.
              </AlertDescription>
            </Alert>
          </>
        )}

        {/* Save Button */}
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>

        {/* Application History */}
        {autoApplyEnabled && (
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Recent Auto-Applications</h4>
            <p className="text-sm text-muted-foreground">
              No auto-applications yet. Applications will appear here once you enable this feature.
            </p>
            {/* TODO: Fetch and display actual auto-application history */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
