-- Security hardening for the internal review admin app.
-- This migration preserves legacy review data while moving new review photos
-- to private storage paths with admin-only signed URL access.

alter table public.homepage_reviews
  add column if not exists image_paths text[] not null default '{}',
  add column if not exists image_hashes text[] not null default '{}';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'homepage_reviews_author_length_chk'
  ) then
    alter table public.homepage_reviews
      add constraint homepage_reviews_author_length_chk
      check (char_length(btrim(author)) between 1 and 40) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'homepage_reviews_text_length_chk'
  ) then
    alter table public.homepage_reviews
      add constraint homepage_reviews_text_length_chk
      check (char_length(btrim(text)) between 1 and 1200) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'homepage_reviews_source_type_chk'
  ) then
    alter table public.homepage_reviews
      add constraint homepage_reviews_source_type_chk
      check (source_type in ('naver', 'manual', 'customer')) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'homepage_reviews_source_url_chk'
  ) then
    alter table public.homepage_reviews
      add constraint homepage_reviews_source_url_chk
      check (
        source_url is null
        or (
          char_length(source_url) <= 500
          and source_url ~* '^https?://'
        )
      ) not valid;
  end if;
end $$;

create table if not exists public.homepage_review_audit_logs (
  id uuid primary key default gen_random_uuid(),
  review_id uuid,
  actor_user_id uuid not null,
  action text not null check (
    action in (
      'review_create',
      'review_publish_toggle',
      'review_delete',
      'review_photo_upload'
    )
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.homepage_review_audit_logs enable row level security;

drop policy if exists "Homepage admins can read audit logs" on public.homepage_review_audit_logs;
drop policy if exists "Homepage admins can write audit logs" on public.homepage_review_audit_logs;

create policy "Homepage admins can read audit logs"
  on public.homepage_review_audit_logs
  for select
  to authenticated
  using (public.is_homepage_admin());

create policy "Homepage admins can write audit logs"
  on public.homepage_review_audit_logs
  for insert
  to authenticated
  with check (public.is_homepage_admin() and actor_user_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'review-photos',
  'review-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Review photos are publicly readable" on storage.objects;
drop policy if exists "Homepage admins can read review photos" on storage.objects;
drop policy if exists "Homepage admins can upload review photos" on storage.objects;
drop policy if exists "Homepage admins can update review photos" on storage.objects;
drop policy if exists "Homepage admins can update own review photos" on storage.objects;
drop policy if exists "Homepage admins can delete review photos" on storage.objects;
drop policy if exists "Homepage admins can delete own review photos" on storage.objects;

create policy "Homepage admins can read review photos"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'review-photos' and public.is_homepage_admin());

create policy "Homepage admins can upload review photos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'review-photos'
    and public.is_homepage_admin()
    and name like (auth.uid()::text || '/%')
  );

create policy "Homepage admins can update own review photos"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'review-photos'
    and public.is_homepage_admin()
    and name like (auth.uid()::text || '/%')
  )
  with check (
    bucket_id = 'review-photos'
    and public.is_homepage_admin()
    and name like (auth.uid()::text || '/%')
  );

create policy "Homepage admins can delete own review photos"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'review-photos'
    and public.is_homepage_admin()
    and name like (auth.uid()::text || '/%')
  );
