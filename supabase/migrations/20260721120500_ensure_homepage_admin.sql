-- Ensure the current site owner account remains an active homepage admin.
-- This is additive and does not remove or downgrade any existing admin rows.

insert into public.homepage_admins (email, is_active)
values ('tjdrhkde@gmail.com', true)
on conflict (email) do update
set
  is_active = true,
  updated_at = now();
