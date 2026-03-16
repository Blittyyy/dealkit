-- Create public avatars bucket for profile photos (5MB max, images only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
);

-- Allow authenticated users to upload to their own folder (avatars/{user_id}/*)
create policy "Users can upload own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars' and
  (storage.foldername(name))[1] = (auth.jwt()->>'sub')
);
