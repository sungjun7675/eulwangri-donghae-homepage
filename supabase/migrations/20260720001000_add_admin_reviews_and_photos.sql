-- Admin review app, photo storage, and protected write policies.
-- If the admin login email is different, change this value before running.

alter table public.homepage_reviews
  add column if not exists source_type text not null default 'naver',
  add column if not exists source_url text,
  add column if not exists image_urls text[] not null default '{}';

create index if not exists homepage_reviews_published_created_at_idx
  on public.homepage_reviews (is_published, created_at desc);

create or replace function public.set_homepage_reviews_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_homepage_reviews_updated_at on public.homepage_reviews;

create trigger set_homepage_reviews_updated_at
  before update on public.homepage_reviews
  for each row
  execute function public.set_homepage_reviews_updated_at();

create table if not exists public.homepage_admins (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.homepage_admins enable row level security;

insert into public.homepage_admins (email)
values ('tjdrhkde@gmail.com')
on conflict (email) do nothing;

create or replace function public.is_homepage_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.homepage_admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

grant execute on function public.is_homepage_admin() to anon, authenticated;

drop policy if exists "Homepage admins can read admin list" on public.homepage_admins;

create policy "Homepage admins can read admin list"
  on public.homepage_admins
  for select
  to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

drop policy if exists "Homepage admins can manage reviews" on public.homepage_reviews;

create policy "Homepage admins can manage reviews"
  on public.homepage_reviews
  for all
  to authenticated
  using (public.is_homepage_admin())
  with check (public.is_homepage_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'review-photos',
  'review-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Review photos are publicly readable" on storage.objects;
drop policy if exists "Homepage admins can upload review photos" on storage.objects;
drop policy if exists "Homepage admins can update review photos" on storage.objects;
drop policy if exists "Homepage admins can delete review photos" on storage.objects;

create policy "Review photos are publicly readable"
  on storage.objects
  for select
  using (bucket_id = 'review-photos');

create policy "Homepage admins can upload review photos"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'review-photos' and public.is_homepage_admin());

create policy "Homepage admins can update review photos"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'review-photos' and public.is_homepage_admin())
  with check (bucket_id = 'review-photos' and public.is_homepage_admin());

create policy "Homepage admins can delete review photos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'review-photos' and public.is_homepage_admin());
