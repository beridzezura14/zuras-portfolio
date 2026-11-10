-- First create your account in Supabase Dashboard -> Authentication -> Users.
-- Replace YOUR_ADMIN_EMAIL below. Run this separately in the SQL Editor.
-- Do not put a password in this file.
do $$
declare
  admin_email text := 'YOUR_ADMIN_EMAIL';
  admin_id uuid;
begin
  if admin_email = 'YOUR_ADMIN_EMAIL' or btrim(admin_email) = '' then
    raise exception 'Replace YOUR_ADMIN_EMAIL with your admin account email.';
  end if;
  select id into admin_id from auth.users
    where lower(email) = lower(btrim(admin_email));
  if admin_id is null then
    raise exception 'Create this email account under Authentication -> Users first.';
  end if;
  insert into portfolio_private.admin_users (user_id)
    values (admin_id) on conflict (user_id) do nothing;
end;
$$;
