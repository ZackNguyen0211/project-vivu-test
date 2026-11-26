create unique index if not exists booking_seats_trip_seat_unique
on public.booking_seats (trip_id, seat_code);

drop policy if exists "customer insert own bookings" on public.bookings;
create policy "customer insert own bookings" on public.bookings
for insert with check (
  auth.uid() is not null
  and (
    user_id = auth.uid()
    or customer_email = coalesce(auth.jwt() ->> 'email', '')
  )
);

drop policy if exists "customer insert own seats" on public.booking_seats;
create policy "customer insert own seats" on public.booking_seats
for insert with check (
  exists (
    select 1
    from public.bookings b
    where b.id = booking_seats.booking_id
      and (
        b.user_id = auth.uid()
        or b.customer_email = coalesce(auth.jwt() ->> 'email', '')
      )
  )
);

create or replace function public.create_pending_booking(
  p_trip_id uuid,
  p_seat_codes text[],
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_pickup_stop_id uuid default null,
  p_dropoff_stop_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_trip public.trips%rowtype;
  v_seat text;
  v_booking_id uuid;
  v_booking_code text;
  v_total numeric(12,2);
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_seat_codes is null or cardinality(p_seat_codes) = 0 then
    raise exception 'At least one seat is required';
  end if;

  if cardinality(p_seat_codes) > 5 then
    raise exception 'Maximum five seats per booking';
  end if;

  if length(trim(coalesce(p_customer_name, ''))) < 2 then
    raise exception 'Customer name is required';
  end if;

  if length(trim(coalesce(p_customer_phone, ''))) < 8 then
    raise exception 'Valid phone number is required';
  end if;

  if p_customer_email !~ '^[^@]+@[^@]+\.[^@]+$' then
    raise exception 'Valid email is required';
  end if;

  update public.bookings
  set status = 'EXPIRED'
  where status = 'PENDING'
    and expired_at is not null
    and expired_at <= now();

  delete from public.booking_seats bs
  where exists (
    select 1
    from public.bookings b
    where b.id = bs.booking_id
      and b.status = 'EXPIRED'
  );

  select *
  into v_trip
  from public.trips
  where id = p_trip_id
    and status in ('SCHEDULED', 'BOARDING')
  for update;

  if v_trip.id is null then
    raise exception 'Trip is unavailable';
  end if;

  foreach v_seat in array p_seat_codes loop
    if public.is_seat_occupied(p_trip_id, v_seat) then
      raise exception 'Seat % is no longer available', v_seat;
    end if;
  end loop;

  v_total := v_trip.ticket_price * cardinality(p_seat_codes);
  v_booking_code := 'VVC-' || to_char(now(), 'YYMMDD') || '-' ||
                    upper(substr(md5(random()::text), 1, 6));

  insert into public.bookings (
    booking_code,
    trip_id,
    user_id,
    customer_name,
    customer_phone,
    customer_email,
    pickup_stop_id,
    dropoff_stop_id,
    total_amount,
    status,
    expired_at
  )
  values (
    v_booking_code,
    p_trip_id,
    v_user_id,
    trim(p_customer_name),
    trim(p_customer_phone),
    lower(trim(p_customer_email)),
    p_pickup_stop_id,
    p_dropoff_stop_id,
    v_total,
    'PENDING',
    now() + interval '10 minutes'
  )
  returning id into v_booking_id;

  foreach v_seat in array p_seat_codes loop
    insert into public.booking_seats (
      booking_id,
      trip_id,
      seat_code,
      price
    )
    values (
      v_booking_id,
      p_trip_id,
      v_seat,
      v_trip.ticket_price
    );
  end loop;

  return jsonb_build_object(
    'booking_id', v_booking_id,
    'booking_code', v_booking_code,
    'total_amount', v_total,
    'expires_at', now() + interval '10 minutes'
  );
end;
$$;

grant execute on function public.create_pending_booking(
  uuid,
  text[],
  text,
  text,
  text,
  uuid,
  uuid
) to authenticated;
