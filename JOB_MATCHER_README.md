# AI-Powered Job Matcher Feature

## Overview
The AI-Powered Job Matcher uses Claude 3 Sonnet to intelligently match users with job opportunities based on their resume, skills, and preferences.

## Features

### 1. Resume Parsing
- Upload PDF, DOC, or DOCX resumes
- AI-powered extraction of:
  - Personal information
  - Skills and competencies
  - Work experience
  - Education
  - Years of experience

### 2. Job Preferences
- Set preferred job titles
- Specify desired locations
- Choose remote/hybrid/on-site preferences
- Define salary expectations
- Select industries and job types
- Configure notification frequency (real-time, daily, weekly)

### 3. AI Job Matching
- Matches jobs using Claude 3 Sonnet
- Provides match scores (0-100%)
- Explains why each job matches:
  - Skills alignment
  - Experience fit
  - Location compatibility
  - Salary match

### 4. Auto-Apply (Premium)
- Automatically apply to high-scoring matches
- Set minimum match score threshold
- Customize cover letter templates
- AI-generated personalized cover letters
- Track application history

### 5. Smart Notifications
- Real-time, daily, or weekly digests
- Email notifications for new matches
- Respects user preferences

## Technical Architecture

### Database Schema
Three main tables:
1. `job_matcher_profiles` - User preferences and parsed resume data
2. `job_matches` - AI-scored job matches with reasoning
3. `auto_applications` - Auto-application history

### Edge Functions

#### match-jobs-ai
Located: `supabase/functions/match-jobs-ai/index.ts`

Actions:
- `parse_resume` - Parse resume text using Claude AI
- `match_jobs` - Match jobs against user profile
- `generate_cover_letter` - Create personalized cover letters

#### send-job-notifications
Located: `supabase/functions/send-job-notifications/index.ts`

Purpose: Send scheduled notifications to users based on their preferences

### Frontend Components

#### Pages
- `/src/pages/JobMatcher.tsx` - Main job matcher page

#### Components
- `/src/components/job-matcher/ResumeUploader.tsx` - Resume upload and parsing
- `/src/components/job-matcher/JobPreferencesForm.tsx` - Preferences configuration
- `/src/components/job-matcher/MatchedJobsList.tsx` - Display matched jobs with filters
- `/src/components/job-matcher/MatchedJobCard.tsx` - Individual job match card
- `/src/components/job-matcher/AutoApplySettings.tsx` - Auto-apply configuration
- `/src/components/job-matcher/MatchScoreBadge.tsx` - Visual match score indicator

#### Hooks
- `/src/hooks/useJobMatcher.tsx` - Job matcher functionality

## Setup Instructions

### 1. Environment Variables

Add to your Supabase Edge Functions secrets:

```bash
# In Supabase Dashboard > Project Settings > Edge Functions
ANTHROPIC_API_KEY=sk-ant-api03-...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Database Migration

Run the migration to create the necessary tables:

```bash
# The migration file is located at:
# supabase/migrations/20251230003521_add_job_matcher_tables.sql
```

### 3. Deploy Edge Functions

```bash
# Deploy match-jobs-ai function
supabase functions deploy match-jobs-ai

# Deploy send-job-notifications function
supabase functions deploy send-job-notifications
```

### 4. Schedule Notifications (Optional)

Set up a cron job to trigger notifications:

```sql
-- Example: Run daily at 9 AM
SELECT cron.schedule(
  'daily-job-notifications',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/send-job-notifications',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
    body:='{"frequency": "daily"}'::jsonb
  );
  $$
);
```

## Usage

### For Users

1. Navigate to `/job-matcher`
2. Upload and parse your resume
3. Set your job preferences
4. View matched jobs with AI-powered scores
5. Apply to jobs or enable auto-apply

### For Developers

#### Parsing a Resume
```typescript
import { useJobMatcher } from '@/hooks/useJobMatcher';

const { parseResume } = useJobMatcher();
const { data, error } = await parseResume(resumeText);
```

#### Matching Jobs
```typescript
const { matchJobs } = useJobMatcher();
await matchJobs(parsedResume, preferences);
```

#### Generating Cover Letters
```typescript
const { generateCoverLetter } = useJobMatcher();
const { data, error } = await generateCoverLetter(jobId);
```

## Match Score Algorithm

The AI considers multiple factors:
- **Skills Match (40%)** - Overlap between user skills and job requirements
- **Experience Level (30%)** - Years of experience vs. job requirements
- **Location Compatibility (15%)** - Remote preference, location match
- **Salary Alignment (15%)** - Salary expectations vs. job offering

Scores are categorized as:
- 90-100%: Excellent Match (Green)
- 70-89%: Good Match (Blue)
- 50-69%: Fair Match (Yellow)
- 0-49%: Low Match (Gray)

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Admins have full access for moderation
- Resume storage uses Supabase Storage with private buckets
- API keys secured in edge function environment variables

## Future Enhancements

- [ ] PDF parsing without manual text extraction
- [ ] Interview preparation tips based on matched jobs
- [ ] Salary negotiation insights
- [ ] Job market analytics
- [ ] Career path recommendations
- [ ] Skill gap analysis
- [ ] LinkedIn integration
- [ ] Email service integration for notifications
- [ ] Mobile app support

## API Reference

### Edge Function Endpoints

#### POST /match-jobs-ai
**Actions:**

1. Parse Resume
```json
{
  "action": "parse_resume",
  "resumeText": "Resume content..."
}
```

2. Match Jobs
```json
{
  "action": "match_jobs",
  "parsedResume": {...},
  "jobPreferences": {...}
}
```

3. Generate Cover Letter
```json
{
  "action": "generate_cover_letter",
  "jobId": "uuid",
  "parsedResume": {...}
}
```

#### POST /send-job-notifications
```json
{
  "frequency": "daily" | "weekly" | "realtime"
}
```

## Troubleshooting

### Common Issues

1. **Resume parsing fails**
   - Ensure resume text is provided
   - Check ANTHROPIC_API_KEY is set
   - Verify API rate limits

2. **No matches found**
   - Check if there are active jobs in the database
   - Verify job preferences aren't too restrictive
   - Ensure parsed resume has valid data

3. **Auto-apply not working**
   - Verify auto_apply_enabled is true
   - Check minimum score threshold
   - Ensure cover letter template is set

## Support

For issues or questions:
- Check the main README.md
- Review Supabase logs for edge function errors
- Contact support at support@jobbyist.co.za
