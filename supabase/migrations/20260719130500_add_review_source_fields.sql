alter table public.homepage_reviews
  add column if not exists source_type text not null default 'naver',
  add column if not exists source_url text;

create index if not exists homepage_reviews_published_created_at_idx
  on public.homepage_reviews (is_published, created_at desc);
