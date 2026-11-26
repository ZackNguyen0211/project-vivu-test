create extension if not exists pgcrypto;

-- Demo-only accounts
-- Admin:  admin@vivucoach.vn
-- Shop:   shop@vivucoach.vn
-- User:   user@vivucoach.vn
-- Password for all three: ViVuCoach@2026

-- Empty auth phone strings violate the Auth unique phone index.
update auth.users
set phone = null
where phone = '';

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change,
  email_change_token_new,
  phone,
  phone_change,
  phone_change_token,
  email_change_token_current,
  reauthentication_token,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  banned_until,
  deleted_at,
  is_sso_user,
  is_anonymous
)
values
  (
    'b0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@vivucoach.vn',
    crypt('ViVuCoach@2026', gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    null,
    null,
    null,
    null,
    null,
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"ViVuCoach Admin"}'::jsonb,
    false,
    now(),
    now(),
    null,
    null,
    false,
    false
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'shop@vivucoach.vn',
    crypt('ViVuCoach@2026', gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    null,
    null,
    null,
    null,
    null,
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Phuong Trang Shop Manager"}'::jsonb,
    false,
    now(),
    now(),
    null,
    null,
    false,
    false
  ),
  (
    'b0000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'user@vivucoach.vn',
    crypt('ViVuCoach@2026', gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    null,
    null,
    null,
    null,
    null,
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"ViVuCoach User"}'::jsonb,
    false,
    now(),
    now(),
    null,
    null,
    false,
    false
  )
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  confirmation_token = '',
  recovery_token = '',
  email_change = '',
  email_change_token_new = '',
  phone = null,
  phone_change = null,
  phone_change_token = '',
  email_change_token_current = '',
  reauthentication_token = '',
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  is_super_admin = false,
  updated_at = now(),
  banned_until = null,
  deleted_at = null;

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    '{"sub":"b0000000-0000-0000-0000-000000000001","email":"admin@vivucoach.vn"}'::jsonb,
    'email',
    now(),
    now(),
    now()
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000002',
    '{"sub":"b0000000-0000-0000-0000-000000000002","email":"shop@vivucoach.vn"}'::jsonb,
    'email',
    now(),
    now(),
    now()
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000003',
    '{"sub":"b0000000-0000-0000-0000-000000000003","email":"user@vivucoach.vn"}'::jsonb,
    'email',
    now(),
    now(),
    now()
  )
on conflict (provider, provider_id) do update
set
  identity_data = excluded.identity_data,
  last_sign_in_at = excluded.last_sign_in_at,
  updated_at = now();

insert into public.users (
  id,
  email,
  full_name,
  phone,
  role,
  operator_id
)
values
  (
    'b0000000-0000-0000-0000-000000000001',
    'admin@vivucoach.vn',
    'ViVuCoach Admin',
    '0900000001',
    'ADMIN',
    null
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'shop@vivucoach.vn',
    'Phuong Trang Shop Manager',
    '0900000002',
    'OPERATOR',
    '10000000-0000-0000-0000-000000000001'
  ),
  (
    'b0000000-0000-0000-0000-000000000003',
    'user@vivucoach.vn',
    'ViVuCoach User',
    '0900000003',
    'USER',
    null
  )
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  phone = excluded.phone,
  role = excluded.role,
  operator_id = excluded.operator_id;

alter table public.users enable row level security;

drop policy if exists "users read own profile" on public.users;
create policy "users read own profile" on public.users
for select using (id = auth.uid());
