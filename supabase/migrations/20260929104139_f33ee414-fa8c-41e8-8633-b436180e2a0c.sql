CREATE POLICY "users read own avatar" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'avatars' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "users upload own avatar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "users update own avatar" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
GRANT INSERT ON public.notifications TO authenticated;
CREATE POLICY "admins send notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));