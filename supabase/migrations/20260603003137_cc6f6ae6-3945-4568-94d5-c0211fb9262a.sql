
-- 1. Update job expiry to 60 days (was 30) and create idempotent cleanup function
CREATE OR REPLACE FUNCTION public.delete_expired_jobs()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count integer;
BEGIN
  WITH deleted AS (
    DELETE FROM public.jobs
    WHERE posted_at < (now() - interval '60 days')
    RETURNING id
  )
  SELECT count(*) INTO deleted_count FROM deleted;
  RETURN deleted_count;
END;
$$;

-- 2. Scrape run log table for monitoring & alerting
CREATE TABLE IF NOT EXISTS public.scrape_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  triggered_by text NOT NULL DEFAULT 'cron',
  status text NOT NULL DEFAULT 'running',
  total_created integer NOT NULL DEFAULT 0,
  results jsonb NOT NULL DEFAULT '[]'::jsonb,
  error text,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz
);

GRANT SELECT ON public.scrape_runs TO authenticated;
GRANT ALL ON public.scrape_runs TO service_role;

ALTER TABLE public.scrape_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view scrape runs"
ON public.scrape_runs FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- 3. Helper to count user's applications this calendar month
CREATE OR REPLACE FUNCTION public.applications_this_month(_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::int FROM public.job_applications
  WHERE user_id = _user_id
    AND created_at >= date_trunc('month', now());
$$;

-- 4. Reschedule daily cron to 07:00 UTC (09:00 SAST) — invokes orchestrator
SELECT cron.unschedule(jobid)
FROM cron.job
WHERE command ILIKE '%scrape-all-sources%' OR command ILIKE '%auto-publish-jobs%' OR jobname IN ('daily-job-scrape','daily-scrape-09sast');

SELECT cron.schedule(
  'daily-scrape-09sast',
  '0 7 * * *',
  $$
  SELECT net.http_post(
    url := 'https://vkwnhhwacizjiwusbmcm.supabase.co/functions/v1/scrape-all-sources',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object('triggered_by','cron')
  ) AS request_id;
  $$
);

-- 5. Daily cleanup of 60+ day jobs at 02:00 UTC
SELECT cron.unschedule(jobid)
FROM cron.job
WHERE jobname = 'daily-cleanup-expired-jobs';

SELECT cron.schedule(
  'daily-cleanup-expired-jobs',
  '0 2 * * *',
  $$ SELECT public.delete_expired_jobs(); $$
);

-- 6. Reset profile completion threshold via existing trigger; ensure trigger present
DROP TRIGGER IF EXISTS profile_completion_trigger ON public.profiles;
CREATE TRIGGER profile_completion_trigger
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_profile_completion();
