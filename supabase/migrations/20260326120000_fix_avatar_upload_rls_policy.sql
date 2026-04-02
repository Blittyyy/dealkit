-- Avatar upload is being blocked by Storage RLS.
-- To guarantee a clean slate, drop all policies on storage.objects and then
-- recreate minimal policies for the `avatars` bucket only.

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects;', r.policyname);
  END LOOP;
END $$;

-- Allow writes into the avatars bucket.
CREATE POLICY "avatars insert" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'avatars'::text);

CREATE POLICY "avatars update" ON storage.objects
FOR UPDATE TO public
USING (bucket_id = 'avatars'::text)
WITH CHECK (bucket_id = 'avatars'::text);

-- Allow public reads (needed for displaying avatars via public URL).
CREATE POLICY "avatars select" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'avatars'::text);

