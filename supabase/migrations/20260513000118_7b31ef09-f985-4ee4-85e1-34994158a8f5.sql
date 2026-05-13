-- Restrict profiles SELECT to owner only (admins still covered by separate ALL policy)
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow job creators (employers) to view applications for their jobs
CREATE POLICY "Job creators can view applications for their jobs"
ON public.job_applications FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = job_applications.job_id
      AND jobs.created_by = auth.uid()
  )
);

-- Allow job creators to update application status (review/shortlist/reject/hire)
CREATE POLICY "Job creators can update applications for their jobs"
ON public.job_applications FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = job_applications.job_id
      AND jobs.created_by = auth.uid()
  )
);
