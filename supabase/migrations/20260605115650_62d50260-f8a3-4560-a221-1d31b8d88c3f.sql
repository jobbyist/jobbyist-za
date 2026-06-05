
-- job_reports: allow user to view & delete own reports
CREATE POLICY "Users can view their own job reports"
ON public.job_reports FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job reports"
ON public.job_reports FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Storage: allow users to delete their own avatar/resume files
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own resumes"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'resumes' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Restrict broad listing on avatars bucket; public read still works via public URLs/CDN.
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND cmd='SELECT'
      AND qual LIKE '%avatars%'
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "Owners can list their avatar files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Revoke SECURITY DEFINER function execute from anon/authenticated where inappropriate.
REVOKE EXECUTE ON FUNCTION public.delete_expired_jobs() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_profile_completion() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.calculate_profile_completion(public.profiles) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.applications_this_month(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.delete_my_account() FROM anon, PUBLIC;
