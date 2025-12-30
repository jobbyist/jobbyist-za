-- Migration: Add job expiry system to automatically delete jobs 30 days after posting
-- This ensures all job listings are removed from the site/database 30 days after being published

-- Function to delete expired jobs (30 days after posted_at)
CREATE OR REPLACE FUNCTION public.delete_expired_jobs()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete jobs that are older than 30 days from posted_at
  WITH deleted AS (
    DELETE FROM public.jobs
    WHERE posted_at < NOW() - INTERVAL '30 days'
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted;
  
  RETURN deleted_count;
END;
$$;

-- Create a scheduled job cleanup edge function trigger
-- Note: This function should be called periodically (e.g., daily via pg_cron or edge function)
COMMENT ON FUNCTION public.delete_expired_jobs() IS 
'Deletes all jobs that are older than 30 days from their posted_at timestamp. 
Returns the count of deleted jobs. Should be called daily via scheduled task.';

-- Create a function to check if a job is expired (for queries/views)
CREATE OR REPLACE FUNCTION public.is_job_expired(job_posted_at TIMESTAMP WITH TIME ZONE)
RETURNS BOOLEAN
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT job_posted_at < NOW() - INTERVAL '30 days';
$$;

-- Add an index to optimize the expiry check
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at_expiry ON public.jobs(posted_at) 
WHERE status = 'active';

COMMENT ON INDEX idx_jobs_posted_at_expiry IS 
'Optimizes queries for finding expired jobs based on posted_at timestamp';

-- Update RLS policy to exclude expired jobs from active job listings
-- First, drop the existing policy
DROP POLICY IF EXISTS "Active jobs are viewable by everyone" ON public.jobs;

-- Create new policy that excludes expired jobs
CREATE POLICY "Active jobs are viewable by everyone"
ON public.jobs FOR SELECT
USING (
  status = 'active' 
  AND posted_at >= NOW() - INTERVAL '30 days'
);

-- Add expires_at field calculation for display purposes (optional)
-- This updates existing jobs to have an expires_at value
UPDATE public.jobs 
SET expires_at = posted_at + INTERVAL '30 days'
WHERE expires_at IS NULL;

-- Create a trigger to automatically set expires_at on new jobs
CREATE OR REPLACE FUNCTION public.set_job_expiry()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Automatically set expires_at to 30 days from posted_at
  IF NEW.expires_at IS NULL THEN
    NEW.expires_at := NEW.posted_at + INTERVAL '30 days';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_job_expiry_trigger
BEFORE INSERT OR UPDATE OF posted_at ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.set_job_expiry();

COMMENT ON TRIGGER set_job_expiry_trigger ON public.jobs IS 
'Automatically sets the expires_at timestamp to 30 days after posted_at';
