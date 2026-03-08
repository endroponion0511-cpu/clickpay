-- Run this in Supabase SQL Editor
-- Adds ability for managers to close chat sessions

-- Table for closed sessions
create table if not exists public.closed_chat_sessions (
  session_id uuid primary key,
  closed_at timestamptz not null default now()
);

alter table public.closed_chat_sessions enable row level security;

-- Anyone can read (to show closed badge in admin UI)
create policy "Allow read for all" on public.closed_chat_sessions
  for select using (true);

-- RPC: client closes their own chat (session must exist in chat_messages)
create or replace function public.close_chat_session_client(sid uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from chat_messages where session_id = sid limit 1) then
    return false;
  end if;
  insert into closed_chat_sessions (session_id) values (sid)
  on conflict (session_id) do nothing;
  return true;
end;
$$;

grant execute on function public.close_chat_session_client(uuid) to anon;
grant execute on function public.close_chat_session_client(uuid) to authenticated;

-- RPC: close a chat session (manager must provide valid password)
create or replace function public.close_chat_session(pwd text, sid uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from admin_passwords where password = pwd) then
    return false;
  end if;
  insert into closed_chat_sessions (session_id) values (sid)
  on conflict (session_id) do nothing;
  return true;
end;
$$;

-- RPC: reopen a chat session
create or replace function public.reopen_chat_session(pwd text, sid uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from admin_passwords where password = pwd) then
    return false;
  end if;
  delete from closed_chat_sessions where session_id = sid;
  return true;
end;
$$;

grant execute on function public.close_chat_session(text, uuid) to anon;
grant execute on function public.close_chat_session(text, uuid) to authenticated;
grant execute on function public.reopen_chat_session(text, uuid) to anon;
grant execute on function public.reopen_chat_session(text, uuid) to authenticated;

-- Enable Realtime so client sees when manager closes chat
alter publication supabase_realtime add table public.closed_chat_sessions;
