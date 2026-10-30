-- APK World database and storage setup. Run once in Supabase SQL Editor.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  media_type text not null check (media_type in ('app','video')),
  title text not null check (char_length(title) between 1 and 90),
  description text not null default '',
  version text,
  bucket text check (bucket in ('apks','videos') or bucket is null),
  storage_path text,
  external_url text,
  file_size bigint,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  constraint valid_media_source check (
    (media_type='app' and ((external_url is not null and bucket is null and storage_path is null) or (external_url is null and bucket='apks' and storage_path is not null)))
    or (media_type='video' and external_url is null and bucket='videos' and storage_path is not null)
  )
);
alter table public.admin_users enable row level security;
alter table public.media_items enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.media_items to anon, authenticated;
grant insert,update,delete on public.media_items to authenticated;
create or replace function public.is_apkworld_admin()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.admin_users where user_id=auth.uid()); $$;
grant execute on function public.is_apkworld_admin() to authenticated;
create policy "Public can read published items" on public.media_items for select to anon,authenticated using (is_published=true);
create policy "Admins can read all items" on public.media_items for select to authenticated using (public.is_apkworld_admin());
create policy "Admins can insert items" on public.media_items for insert to authenticated with check (public.is_apkworld_admin());
create policy "Admins can update items" on public.media_items for update to authenticated using (public.is_apkworld_admin()) with check (public.is_apkworld_admin());
create policy "Admins can delete items" on public.media_items for delete to authenticated using (public.is_apkworld_admin());
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
('apks','apks',true,52428800,array['application/vnd.android.package-archive','application/octet-stream']),
('videos','videos',true,52428800,array['video/mp4','video/webm'])
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy "Public can read APK World files" on storage.objects for select to public using(bucket_id in ('apks','videos'));
create policy "APK World admin can upload files" on storage.objects for insert to authenticated with check(bucket_id in ('apks','videos') and public.is_apkworld_admin());
create policy "APK World admin can update files" on storage.objects for update to authenticated using(bucket_id in ('apks','videos') and public.is_apkworld_admin()) with check(bucket_id in ('apks','videos') and public.is_apkworld_admin());
create policy "APK World admin can delete files" on storage.objects for delete to authenticated using(bucket_id in ('apks','videos') and public.is_apkworld_admin());