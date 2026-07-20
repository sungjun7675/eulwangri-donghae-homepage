-- Final admin boundary hardening.
-- Run after 20260720223000_harden_admin_reviews_security.sql.
-- This keeps existing data and removes public table exposure for internal review records.

alter table public.homepage_admins
  add column if not exists is_active boolean not null default true,
  add column if not exists last_seen_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists homepage_admins_active_email_idx
  on public.homepage_admins (lower(email))
  where is_active is true;

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
      and is_active is true
  );
$$;

grant execute on function public.is_homepage_admin() to anon, authenticated;

drop policy if exists "Published homepage reviews are readable" on public.homepage_reviews;
drop policy if exists "Homepage admins can read reviews" on public.homepage_reviews;

create policy "Homepage admins can read reviews"
  on public.homepage_reviews
  for select
  to authenticated
  using (public.is_homepage_admin());

create table if not exists public.homepage_security_rate_limits (
  rate_key text primary key,
  window_start timestamptz not null,
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.homepage_security_rate_limits enable row level security;

revoke all on public.homepage_security_rate_limits from anon, authenticated;

create or replace function public.homepage_take_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns table (
  allowed boolean,
  remaining integer,
  reset_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_window timestamptz;
  next_count integer;
begin
  if p_key is null or btrim(p_key) = '' or char_length(p_key) > 180 then
    raise exception 'invalid rate limit key';
  end if;

  if p_limit < 1 or p_limit > 1000 then
    raise exception 'invalid rate limit limit';
  end if;

  if p_window_seconds < 10 or p_window_seconds > 86400 then
    raise exception 'invalid rate limit window';
  end if;

  current_window := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );

  insert into public.homepage_security_rate_limits (
    rate_key,
    window_start,
    request_count,
    updated_at
  )
  values (
    p_key,
    current_window,
    1,
    now()
  )
  on conflict (rate_key)
  do update set
    window_start = case
      when public.homepage_security_rate_limits.window_start = current_window
        then public.homepage_security_rate_limits.window_start
      else current_window
    end,
    request_count = case
      when public.homepage_security_rate_limits.window_start = current_window
        then public.homepage_security_rate_limits.request_count + 1
      else 1
    end,
    updated_at = now()
  returning request_count into next_count;

  return query
  select
    next_count <= p_limit,
    greatest(p_limit - next_count, 0),
    current_window + make_interval(secs => p_window_seconds);
end;
$$;

revoke all on function public.homepage_take_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.homepage_take_rate_limit(text, integer, integer) to service_role;
