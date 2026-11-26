create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (
    id,
    email,
    full_name,
    phone,
    avatar_url,
    role,
    operator_id
  )
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null),
    'USER',
    null
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = case
      when public.users.full_name is null or public.users.full_name = ''
      then excluded.full_name
      else public.users.full_name
    end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop policy if exists "users insert own profile" on public.users;
create policy "users insert own profile" on public.users
for insert with check (id = auth.uid());
