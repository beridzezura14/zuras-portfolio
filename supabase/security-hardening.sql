-- Run once in Supabase SQL Editor. Safe to rerun; preserves all existing content.
-- A database trigger also covers direct Data API inserts, so callers cannot
-- bypass the website's process-local limiter by submitting straight to Supabase.
begin;

create index if not exists portfolio_messages_email_time_idx
  on public.contact_messages (lower(email), created_at desc);
create index if not exists portfolio_messages_created_at_idx
  on public.contact_messages (created_at desc);

create or replace function portfolio_private.limit_contact_submissions()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  -- Serialize the short count/insert transaction to prevent concurrent requests
  -- from racing past the limits. No message data or IP addresses are logged.
  perform pg_catalog.pg_advisory_xact_lock(761924, 1);
  if (
    select count(*) from public.contact_messages
    where lower(email) = lower(new.email)
      and created_at > pg_catalog.clock_timestamp() - interval '1 minute'
  ) >= 3 or (
    select count(*) from public.contact_messages
    where created_at > pg_catalog.clock_timestamp() - interval '1 minute'
  ) >= 30 then
    raise exception using errcode = 'P0001', message = 'CONTACT_RATE_LIMIT';
  end if;
  return new;
end;
$$;

revoke all on function portfolio_private.limit_contact_submissions() from public, anon, authenticated;
drop trigger if exists portfolio_messages_submission_limit on public.contact_messages;
create trigger portfolio_messages_submission_limit
  before insert on public.contact_messages
  for each row execute function portfolio_private.limit_contact_submissions();

commit;
