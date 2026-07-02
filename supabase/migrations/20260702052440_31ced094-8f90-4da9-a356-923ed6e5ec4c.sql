
-- 1) job_reports: require authenticated + user_id = auth.uid()
DROP POLICY IF EXISTS "Anyone can submit job reports" ON public.job_reports;
CREATE POLICY "Authenticated users can submit their own job reports"
ON public.job_reports
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND user_id = auth.uid()
  AND (reporter_email IS NULL OR reporter_email = (auth.jwt() ->> 'email'))
);

-- 2) waiting_list: keep public insert but constrain payload
DROP POLICY IF EXISTS "Anyone can join waiting list" ON public.waiting_list;
CREATE POLICY "Public can join waiting list with valid email"
ON public.waiting_list
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(email) BETWEEN 5 AND 254
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);

-- 3) job_applications: allow users to delete their own applications
CREATE POLICY "Users can delete their own applications"
ON public.job_applications
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- 4) Server-side quota enforcement for free-tier users
CREATE OR REPLACE FUNCTION public.enforce_application_quota()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_pro boolean;
  used int;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = NEW.user_id
      AND subscription_type = 'jobseeker_pro'
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > now())
  ) INTO is_pro;

  IF is_pro THEN
    RETURN NEW;
  END IF;

  SELECT count(*) INTO used
  FROM public.job_applications
  WHERE user_id = NEW.user_id
    AND created_at >= date_trunc('month', now());

  IF used >= 10 THEN
    RAISE EXCEPTION 'Monthly application limit reached. Upgrade to Jobbyist Pro for unlimited applications.'
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_application_quota_trg ON public.job_applications;
CREATE TRIGGER enforce_application_quota_trg
BEFORE INSERT ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.enforce_application_quota();

REVOKE EXECUTE ON FUNCTION public.enforce_application_quota() FROM PUBLIC, anon, authenticated;

-- 5) Revoke EXECUTE on internal SECURITY DEFINER helpers from authenticated
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.applications_this_month(uuid) FROM PUBLIC, anon, authenticated;
-- delete_my_account must remain callable by authenticated users
