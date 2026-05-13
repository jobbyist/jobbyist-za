
CREATE TABLE IF NOT EXISTS public.job_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL,
  user_id uuid,
  reason text NOT NULL,
  details text,
  reporter_email text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit job reports"
  ON public.job_reports FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view all job reports"
  ON public.job_reports FOR SELECT TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage job reports"
  ON public.job_reports FOR UPDATE TO authenticated
  USING (is_admin(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_job_reports_job_id ON public.job_reports(job_id);
CREATE INDEX IF NOT EXISTS idx_job_reports_status ON public.job_reports(status);
