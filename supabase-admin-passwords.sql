-- Run this in Supabase SQL Editor
-- Creates table for manager passwords (multiple managers, each with own password)

create table if not exists public.admin_passwords (
  id uuid primary key default gen_random_uuid(),
  password text not null unique,
  label text,
  created_at timestamptz not null default now()
);

-- Only the check function can read this table. RLS blocks direct access.
alter table public.admin_passwords enable row level security;

-- No policies = no direct access. Only the function (SECURITY DEFINER) can read.

-- Function: check if password is valid (called from frontend)
create or replace function public.check_admin_password(pwd text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from admin_passwords where password = pwd);
$$;

-- Allow anyone to call the function (they only get true/false, not the passwords)
grant execute on function public.check_admin_password(text) to anon;
grant execute on function public.check_admin_password(text) to authenticated;

-- Function: add new manager (only if your_password is valid)
create or replace function public.add_admin_password(your_password text, new_password text, new_label text default null)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from admin_passwords where password = your_password) then
    return false;
  end if;
  insert into admin_passwords (password, label) values (new_password, coalesce(new_label, 'Manager'));
  return true;
end;
$$;

grant execute on function public.add_admin_password(text, text, text) to anon;
grant execute on function public.add_admin_password(text, text, text) to authenticated;

-- Add first manager (change 'manager1' to your real password before running!)
insert into public.admin_passwords (password, label) values ('manager1', 'First manager')
on conflict (password) do nothing;
