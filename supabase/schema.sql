-- Source schema for scripts/generate-supabase-setup.mjs.
-- Run the generated supabase/setup.sql in the Supabase SQL Editor.

create schema if not exists portfolio_private;
revoke all on schema portfolio_private from public, anon, authenticated;
grant usage on schema portfolio_private to authenticated;

create table if not exists portfolio_private.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table portfolio_private.admin_users enable row level security;
revoke all on portfolio_private.admin_users from public, anon, authenticated;

-- Only the database owner can maintain the admin list. This helper reads it
-- with its owner's privileges, accepts no user ID, and checks the caller's JWT.
create or replace function portfolio_private.is_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from portfolio_private.admin_users
    where user_id = (select auth.uid())
  );
$$;
revoke all on function portfolio_private.is_admin() from public, anon, authenticated;
grant execute on function portfolio_private.is_admin() to authenticated;

-- Future admin routes can call this RPC to check their verified user's role.
create or replace function public.is_admin()
returns boolean
language sql stable security invoker
set search_path = ''
as $$ select portfolio_private.is_admin(); $$;
revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;

create or replace function portfolio_private.touch_updated_at()
returns trigger
language plpgsql security invoker
set search_path = ''
as $$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;
revoke all on function portfolio_private.touch_updated_at() from public, anon, authenticated;

create table if not exists public.site_content (
  key text primary key check (key in ('about', 'story', 'contact')),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 200),
  title text not null check (char_length(btrim(title)) between 1 and 200),
  category text not null default '' check (char_length(category) <= 120),
  year integer not null check (year between 1900 and 9999),
  short_description text not null default '' check (char_length(short_description) <= 1000),
  full_description text not null default '' check (char_length(full_description) <= 20000),
  cover_image text not null default '' check (char_length(cover_image) <= 2048),
  gallery text[] not null default '{}',
  technologies text[] not null default '{}',
  features text[] not null default '{}',
  live_url text not null default '' check (char_length(live_url) <= 2048),
  github_url text check (github_url is null or char_length(github_url) <= 2048),
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_project_has_cover check (not published or char_length(btrim(cover_image)) > 0)
);
create index if not exists portfolio_projects_listing_idx
  on public.projects (published, sort_order, created_at desc);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 100),
  email text not null check (
    char_length(email) <= 254
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  subject text not null default '' check (char_length(subject) <= 200),
  message text not null check (char_length(btrim(message)) between 10 and 3000),
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portfolio_messages_inbox_idx
  on public.contact_messages (is_read, created_at desc);

alter table public.site_content enable row level security;
alter table public.projects enable row level security;
alter table public.contact_messages enable row level security;

-- Reset only this application's grants, including Supabase's default grants.
revoke all on public.site_content, public.projects, public.contact_messages
  from public, anon, authenticated;
grant select on public.site_content, public.projects to anon, authenticated;
grant insert, update on public.site_content to authenticated;
grant insert, update, delete on public.projects to authenticated;
grant insert (name, email, subject, message) on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;
grant update (is_read) on public.contact_messages to authenticated;

drop policy if exists portfolio_content_read on public.site_content;
create policy portfolio_content_read on public.site_content
  for select to anon, authenticated using (true);
drop policy if exists portfolio_content_insert on public.site_content;
create policy portfolio_content_insert on public.site_content
  for insert to authenticated with check ((select portfolio_private.is_admin()));
drop policy if exists portfolio_content_update on public.site_content;
create policy portfolio_content_update on public.site_content
  for update to authenticated using ((select portfolio_private.is_admin()))
  with check ((select portfolio_private.is_admin()));

drop policy if exists portfolio_projects_published on public.projects;
create policy portfolio_projects_published on public.projects
  for select to anon, authenticated using (published);
drop policy if exists portfolio_projects_admin on public.projects;
create policy portfolio_projects_admin on public.projects
  for all to authenticated using ((select portfolio_private.is_admin()))
  with check ((select portfolio_private.is_admin()));

drop policy if exists portfolio_messages_submit on public.contact_messages;
create policy portfolio_messages_submit on public.contact_messages
  for insert to anon, authenticated with check (true);
drop policy if exists portfolio_messages_admin_read on public.contact_messages;
create policy portfolio_messages_admin_read on public.contact_messages
  for select to authenticated using ((select portfolio_private.is_admin()));
drop policy if exists portfolio_messages_admin_update on public.contact_messages;
create policy portfolio_messages_admin_update on public.contact_messages
  for update to authenticated using ((select portfolio_private.is_admin()))
  with check ((select portfolio_private.is_admin()));
drop policy if exists portfolio_messages_admin_delete on public.contact_messages;
create policy portfolio_messages_admin_delete on public.contact_messages
  for delete to authenticated using ((select portfolio_private.is_admin()));

drop trigger if exists portfolio_content_updated_at on public.site_content;
create trigger portfolio_content_updated_at before update on public.site_content
  for each row execute function portfolio_private.touch_updated_at();
drop trigger if exists portfolio_projects_updated_at on public.projects;
create trigger portfolio_projects_updated_at before update on public.projects
  for each row execute function portfolio_private.touch_updated_at();
drop trigger if exists portfolio_messages_updated_at on public.contact_messages;
create trigger portfolio_messages_updated_at before update on public.contact_messages
  for each row execute function portfolio_private.touch_updated_at();

-- Images are public website assets. Only designated admins can manage them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'])
on conflict (id) do nothing;

drop policy if exists portfolio_media_admin_select on storage.objects;
create policy portfolio_media_admin_select on storage.objects
  for select to authenticated
  using (bucket_id = 'portfolio-media' and (select portfolio_private.is_admin()));
drop policy if exists portfolio_media_admin_insert on storage.objects;
create policy portfolio_media_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio-media' and (select portfolio_private.is_admin()));
drop policy if exists portfolio_media_admin_update on storage.objects;
create policy portfolio_media_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio-media' and (select portfolio_private.is_admin()))
  with check (bucket_id = 'portfolio-media' and (select portfolio_private.is_admin()));
drop policy if exists portfolio_media_admin_delete on storage.objects;
create policy portfolio_media_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio-media' and (select portfolio_private.is_admin()));
