-- Run this in Supabase SQL Editor if client doesn't see manager replies in realtime
-- REPLICA IDENTITY FULL helps Realtime deliver filtered events correctly

alter table public.chat_messages replica identity full;
