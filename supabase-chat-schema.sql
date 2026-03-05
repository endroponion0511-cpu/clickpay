-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- Creates the chat_messages table for live support chat

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  user_name text,
  text text not null,
  is_from_support boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_messages_session_id on public.chat_messages (session_id);
create index if not exists idx_chat_messages_created_at on public.chat_messages (created_at);

-- Enable Realtime for chat_messages
alter publication supabase_realtime add table public.chat_messages;

-- RLS: allow anyone to insert (users send messages) and read (admin + user see their session)
alter table public.chat_messages enable row level security;

create policy "Allow insert for all" on public.chat_messages
  for insert with check (true);

create policy "Allow read for all" on public.chat_messages
  for select using (true);
