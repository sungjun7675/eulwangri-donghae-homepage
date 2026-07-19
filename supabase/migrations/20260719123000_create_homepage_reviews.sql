create table if not exists public.homepage_reviews (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  label text,
  text text not null,
  time text,
  rating integer not null default 5 check (rating between 1 and 5),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.homepage_reviews enable row level security;

drop policy if exists "Published homepage reviews are readable" on public.homepage_reviews;

create policy "Published homepage reviews are readable"
  on public.homepage_reviews
  for select
  using (is_published = true);
