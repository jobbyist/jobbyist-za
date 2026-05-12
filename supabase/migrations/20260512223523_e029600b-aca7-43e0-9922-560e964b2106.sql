
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS username text UNIQUE,
  ADD COLUMN IF NOT EXISTS pro_interest boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS interview_summary jsonb,
  ADD COLUMN IF NOT EXISTS interview_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz;

ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS source text;

CREATE INDEX IF NOT EXISTS idx_jobs_source ON public.jobs(source);
CREATE INDEX IF NOT EXISTS idx_jobs_external_url ON public.jobs(external_url);
