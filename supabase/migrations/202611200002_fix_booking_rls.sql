-- auth.users is intentionally not exposed to anon/authenticated PostgREST roles.
-- Read account email from the signed Supabase JWT instead.

drop policy if exists "customer read own bookings" on public.bookings;
create policy "customer read own bookings" on public.bookings
for select using (
  auth.uid() = user_id
  or customer_email = coalesce(auth.jwt() ->> 'email', '')
);

drop policy if exists "customer read own seats" on public.booking_seats;
create policy "customer read own seats" on public.booking_seats
for select using (
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

-- Correct the provincial spelling created by an earlier seed row.
update public.routes
set destination_province = 'Vũng Tàu (BR-VT)'
where destination_province = 'Vũng Tau (BR-VT)';
