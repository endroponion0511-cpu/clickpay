-- Run this in Supabase SQL Editor
-- Cleans old chat history to prevent database overfilling
-- Removes: (1) old closed sessions + their messages, (2) abandoned sessions (opened, got auto-reply, never replied)

-- RPC: cleanup chat history (manager must provide valid password)
-- Returns: { deleted_messages: int, deleted_closed: int, deleted_abandoned: int }
create or replace function public.cleanup_chat_history(pwd text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_messages int := 0;
  deleted_closed int := 0;
  deleted_abandoned int := 0;
  deleted_rows int;
  old_closed_sessions uuid[];
  abandoned_sessions uuid[];
begin
  if not exists (select 1 from admin_passwords where password = pwd) then
    return jsonb_build_object('ok', false, 'error', 'Invalid password');
  end if;

  -- 1. Find closed sessions older than 30 days
  select array_agg(session_id) into old_closed_sessions
  from closed_chat_sessions
  where closed_at < now() - interval '30 days';

  if old_closed_sessions is not null then
    -- Delete messages from those sessions
    delete from chat_messages where session_id = any(old_closed_sessions);
    get diagnostics deleted_messages = row_count;
    -- Delete from closed_chat_sessions
    delete from closed_chat_sessions where session_id = any(old_closed_sessions);
    get diagnostics deleted_closed = row_count;
  end if;

  -- 2. Find abandoned sessions: no messages from support (except auto-reply), only 1 user msg + 1 auto-reply, last message > 14 days ago
  with session_stats as (
    select
      session_id,
      count(*) as msg_count,
      count(*) filter (where is_from_support) as support_count,
      max(created_at) as last_at
    from chat_messages
    where session_id not in (select session_id from closed_chat_sessions)
    group by session_id
  )
  select array_agg(session_id) into abandoned_sessions
  from session_stats
  where msg_count <= 2
    and support_count <= 1
    and last_at < now() - interval '14 days';

  if abandoned_sessions is not null then
    delete from chat_messages where session_id = any(abandoned_sessions);
    get diagnostics deleted_rows = row_count;
    deleted_messages := deleted_messages + deleted_rows;
    deleted_abandoned := array_length(abandoned_sessions, 1);
  end if;

  return jsonb_build_object(
    'ok', true,
    'deleted_messages', deleted_messages,
    'deleted_closed_sessions', deleted_closed,
    'deleted_abandoned_sessions', coalesce(deleted_abandoned, 0)
  );
end;
$$;

grant execute on function public.cleanup_chat_history(text) to anon;
grant execute on function public.cleanup_chat_history(text) to authenticated;
