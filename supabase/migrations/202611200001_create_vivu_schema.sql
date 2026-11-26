create extension if not exists pgcrypto;

create table if not exists public.operators (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  name text not null,
  hotline text,
  description text,
  logo_url text,
  rating numeric(2,1) default 0,
  review_count_label text,
  fleet_highlight text,
  status text not null default 'ACTIVE' check (status in ('ACTIVE','INACTIVE','PENDING_APPROVAL','SUSPENDED')),
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  phone text,
  avatar_url text,
  google_id text,
  role text not null default 'USER' check (role in ('USER','OPERATOR','ADMIN')),
  operator_id uuid references public.operators(id),
  created_at timestamptz not null default now()
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  province_name text not null,
  station_name text not null,
  address text,
  type text not null default 'BOTH' check (type in ('PICKUP','DROPOFF','BOTH')),
  created_at timestamptz not null default now()
);

create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid not null references public.operators(id),
  departure_province text not null,
  destination_province text not null,
  estimated_duration_minutes integer not null,
  base_price numeric(12,2) not null,
  highway_note text,
  coach_label text,
  badge_text text,
  is_hot boolean not null default false,
  description text,
  image_url text,
  amenities jsonb not null default '[]'::jsonb,
  daily_trips_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.route_stops (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.routes(id) on delete cascade,
  location_id uuid not null references public.locations(id),
  stop_type text not null check (stop_type in ('PICKUP','DROPOFF')),
  offset_minutes integer not null default 0,
  station_name text,
  address text,
  surcharge numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.coaches (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid not null references public.operators(id),
  license_plate text not null,
  coach_type text not null check (coach_type in ('LIMOUSINE_22','SLEEPER_36','SEATER_45')),
  seat_layout_json jsonb not null default '{}'::jsonb,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now()
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  trip_code text unique,
  route_id uuid not null references public.routes(id),
  coach_id uuid not null references public.coaches(id),
  departure_time timestamptz not null,
  arrival_time timestamptz not null,
  ticket_price numeric(12,2) not null,
  status text not null default 'SCHEDULED'
    check (status in ('SCHEDULED','BOARDING','ON_ROUTE','COMPLETED','CANCELLED')),
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text unique not null,
  trip_id uuid not null references public.trips(id),
  user_id uuid references public.users(id),
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  pickup_stop_id uuid references public.route_stops(id),
  dropoff_stop_id uuid references public.route_stops(id),
  total_amount numeric(12,2) not null,
  status text not null default 'PENDING'
    check (status in ('PENDING','PAID','EXPIRED','CHECKED_IN','CANCELLED_PENDING_REFUND','REFUNDED')),
  qr_token text,
  expired_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.booking_seats (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  trip_id uuid not null references public.trips(id),
  seat_code text not null,
  price numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  provider text not null check (provider in ('MOMO','SEPAY_VIETQR')),
  transaction_id text,
  amount numeric(12,2) not null,
  status text not null default 'PENDING',
  raw_webhook_payload jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.vouchers (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  badge text not null,
  icon text not null,
  title text not null,
  description text not null,
  is_vip_club boolean not null default false
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  initials text not null,
  route_info text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null
);

create table if not exists public.admin_payouts (
  id uuid primary key default gen_random_uuid(),
  settlement_code text unique not null,
  operator_id uuid references public.operators(id),
  bank_info text not null,
  cycle_label text not null,
  total_bookings integer not null,
  gross_amount numeric(14,2) not null,
  platform_fee numeric(14,2) not null,
  refund_deduction numeric(14,2) not null,
  net_payout numeric(14,2) not null,
  payment_gateway_match text not null check (payment_gateway_match in ('MATCHED_100','DISCREPANCY')),
  status text not null check (status in ('READY_TO_PAY','PAID','HOLD'))
);

create or replace function public.expire_pending_bookings()
returns void language sql security definer set search_path = public as $$
  update public.bookings
  set status = 'EXPIRED'
  where status = 'PENDING'
    and expired_at is not null
    and expired_at <= now();
$$;

create or replace function public.is_seat_occupied(p_trip_id uuid, p_seat_code text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.booking_seats bs
    join public.bookings b on b.id = bs.booking_id
    where bs.trip_id = p_trip_id
      and bs.seat_code = p_seat_code
      and (
        b.status in ('PAID','CHECKED_IN','CANCELLED_PENDING_REFUND')
        or (b.status = 'PENDING' and b.expired_at > now())
      )
  );
$$;

alter table public.operators enable row level security;
alter table public.locations enable row level security;
alter table public.routes enable row level security;
alter table public.route_stops enable row level security;
alter table public.coaches enable row level security;
alter table public.trips enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_seats enable row level security;
alter table public.payments enable row level security;
alter table public.vouchers enable row level security;
alter table public.testimonials enable row level security;
alter table public.admin_payouts enable row level security;

create policy "public read operators" on public.operators for select using (status in ('ACTIVE','PENDING_APPROVAL'));
create policy "public read locations" on public.locations for select using (true);
create policy "public read routes" on public.routes for select using (true);
create policy "public read route_stops" on public.route_stops for select using (true);
create policy "public read coaches" on public.coaches for select using (status = 'ACTIVE');
create policy "public read trips" on public.trips for select using (status <> 'CANCELLED');
create policy "public read vouchers" on public.vouchers for select using (true);
create policy "public read testimonials" on public.testimonials for select using (true);

create policy "customer read own bookings" on public.bookings for select using (
  auth.uid() = user_id
  or customer_email = (select email from auth.users where id = auth.uid())
);
create policy "customer read own seats" on public.booking_seats for select using (
  exists (
    select 1 from public.bookings b
    where b.id = booking_seats.booking_id
      and (b.user_id = auth.uid()
        or b.customer_email = (select email from auth.users where id = auth.uid()))
  )
);
