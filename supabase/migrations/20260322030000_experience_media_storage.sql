-- Public bucket for experience images (viewers load without auth)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'experience-media',
  'experience-media',
  true,
  5242880,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Experience media public read"
on storage.objects for select
using (bucket_id = 'experience-media');

create policy "Users upload experience media to own folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'experience-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users update own experience media"
on storage.objects for update
to authenticated
using (
  bucket_id = 'experience-media'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'experience-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users delete own experience media"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'experience-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);
