-- Job Matcher Feature Migration
-- Creates tables for AI-powered resume job matching

-- User job matcher profiles
CREATE TABLE IF NOT EXISTS public.job_matcher_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  parsed_resume JSONB, -- Structured resume data from AI parsing
  job_titles TEXT[], -- Preferred job titles
  locations TEXT[], -- Preferred locations
  remote_preference TEXT CHECK (remote_preference IN ('remote', 'hybrid', 'onsite', 'any')) DEFAULT 'any',
  salary_min INTEGER,
  salary_max INTEGER,
  industries TEXT[],
  job_types TEXT[], -- full-time, part-time, contract
  notification_frequency TEXT CHECK (notification_frequency IN ('realtime', 'daily', 'weekly')) DEFAULT 'daily',
  auto_apply_enabled BOOLEAN DEFAULT false,
  auto_apply_min_score INTEGER DEFAULT 80,
  cover_letter_template TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job matches with AI scoring
CREATE TABLE IF NOT EXISTS public.job_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  match_reasons JSONB, -- { skills_matched: [], experience_fit: "", location_match: true, etc. }
  status TEXT CHECK (status IN ('new', 'viewed', 'saved', 'applied', 'auto_applied', 'dismissed')) DEFAULT 'new',
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Auto-application history
CREATE TABLE IF NOT EXISTS public.auto_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_match_id UUID REFERENCES public.job_matches(id) ON DELETE CASCADE,
  cover_letter TEXT,
  application_status TEXT CHECK (application_status IN ('pending', 'submitted', 'failed')) DEFAULT 'pending',
  error_message TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.job_matcher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_matcher_profiles
CREATE POLICY "Users can view their own job matcher profile" 
  ON public.job_matcher_profiles
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own job matcher profile" 
  ON public.job_matcher_profiles
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own job matcher profile" 
  ON public.job_matcher_profiles
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for job_matches
CREATE POLICY "Users can view their own job matches" 
  ON public.job_matches
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own job matches" 
  ON public.job_matches
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert job matches" 
  ON public.job_matches
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for auto_applications
CREATE POLICY "Users can view their own auto applications" 
  ON public.auto_applications
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert auto applications" 
  ON public.auto_applications
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins can manage all job matcher data
CREATE POLICY "Admins can manage job matcher profiles"
  ON public.job_matcher_profiles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage job matches"
  ON public.job_matches FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage auto applications"
  ON public.auto_applications FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Indexes for performance
CREATE INDEX idx_job_matcher_profiles_user ON public.job_matcher_profiles(user_id);
CREATE INDEX idx_job_matches_user ON public.job_matches(user_id);
CREATE INDEX idx_job_matches_job ON public.job_matches(job_id);
CREATE INDEX idx_job_matches_score ON public.job_matches(match_score DESC);
CREATE INDEX idx_job_matches_status ON public.job_matches(status);
CREATE INDEX idx_auto_applications_user ON public.auto_applications(user_id);

-- Trigger to update timestamps
CREATE TRIGGER update_job_matcher_profiles_updated_at
BEFORE UPDATE ON public.job_matcher_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Comment for documentation
COMMENT ON TABLE public.job_matcher_profiles IS 'User preferences and parsed resume data for AI job matching';
COMMENT ON TABLE public.job_matches IS 'AI-scored job matches with reasoning';
COMMENT ON TABLE public.auto_applications IS 'History of automatically submitted job applications';
