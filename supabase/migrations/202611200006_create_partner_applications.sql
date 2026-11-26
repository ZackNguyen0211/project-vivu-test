create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  brand_name text not null,
  phone text not null,
  email text not null,
  fleet_size text not null check (fleet_size in ('1-5','6-15','gt15')),
  status text not null default 'PENDING'
    check (status in ('PENDING','APPROVED','REJECTED')),
  created_at timestamptz not null default now()
);

alter table public.partner_applications enable row level security;

create or replace function public.submit_partner_application(
  p_brand_name text,
  p_phone text,
  p_email text,
  p_fleet_size text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_user_id uuid;
begin
  if length(trim(p_brand_name)) < 2 then
    raise exception 'Brand name is required';
  end if;

  if length(trim(p_phone)) < 8 then
    raise exception 'Valid phone number is required';
  end if;

  if p_email !~ '^[^@]+@[^@]+\.[^@]+$' then
    raise exception 'Valid email is required';
  end if;

  if p_fleet_size not in ('1-5','6-15','gt15') then
    raise exception 'Invalid fleet size';
  end if;

  v_user_id := auth.uid();

  insert into public.partner_applications (
    user_id,
    brand_name,
    phone,
    email,
    fleet_size
  )
  values (
    v_user_id,
    trim(p_brand_name),
    trim(p_phone),
    lower(trim(p_email)),
    p_fleet_size
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.submit_partner_application(text,text,text,text)
to anon, authenticated;
