-- Synchronize manually-created Supabase Auth users with ViVuCoach RBAC profiles.
-- Run this after creating or recreating users in Authentication -> Users.

insert into public.users (
  id,
  email,
  full_name,
  phone,
  role,
  operator_id
)
select
  au.id,
  au.email,
  'ViVuCoach Admin',
  '0900000001',
  'ADMIN',
  null
from auth.users au
where lower(au.email) = 'admin@vivucoach.vn'
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  phone = excluded.phone,
  role = 'ADMIN',
  operator_id = null;

insert into public.users (
  id,
  email,
  full_name,
  phone,
  role,
  operator_id
)
select
  au.id,
  au.email,
  'Phuong Trang Shop Manager',
  '0900000002',
  'OPERATOR',
  '10000000-0000-0000-0000-000000000001'
from auth.users au
where lower(au.email) = 'shop@vivucoach.vn'
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  phone = excluded.phone,
  role = 'OPERATOR',
  operator_id = '10000000-0000-0000-0000-000000000001';

insert into public.users (
  id,
  email,
  full_name,
  phone,
  role,
  operator_id
)
select
  au.id,
  au.email,
  'ViVuCoach User',
  '0900000003',
  'USER',
  null
from auth.users au
where lower(au.email) = 'user@vivucoach.vn'
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  phone = excluded.phone,
  role = 'USER',
  operator_id = null;

update auth.users
set raw_app_meta_data =
  coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"ADMIN","vivu_role":"ADMIN"}'::jsonb
where lower(email) = 'admin@vivucoach.vn';

update auth.users
set raw_app_meta_data =
  coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"OPERATOR","vivu_role":"OPERATOR"}'::jsonb
where lower(email) = 'shop@vivucoach.vn';

update auth.users
set raw_app_meta_data =
  coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"USER","vivu_role":"USER"}'::jsonb
where lower(email) = 'user@vivucoach.vn';
