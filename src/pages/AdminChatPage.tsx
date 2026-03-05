import React, { useState, useEffect, useRef } from 'react';
import { Send, UserPlus } from 'lucide-react';
import { supabase, type ChatMessage } from '../lib/supabase';

type SessionSummary = {
  session_id: string;
  user_name: string | null;
  last_message: string;
  last_at: string;
  count: number;
  last_from_user?: boolean;
};

export function AdminChatPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showAddManager, setShowAddManager] = useState(false);
  const [addMyPassword, setAddMyPassword] = useState('');
  const [addNewPassword, setAddNewPassword] = useState('');
  const [addLabel, setAddLabel] = useState('');
  const [addStatus, setAddStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const checkPassword = async () => {
    if (!password.trim() || !supabase) return;
    setChecking(true);
    setLoginError('');
    try {
      const { data, error } = await supabase.rpc('check_admin_password', { pwd: password.trim() });
      if (error) {
        console.error('Admin login error:', error);
        setLoginError(error.message || 'Error: ' + JSON.stringify(error));
        return;
      }
      if (data === true) setAuthenticated(true);
      else setLoginError('Invalid password');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid password';
      setLoginError(/fetch|network/i.test(msg) ? 'Connection error' : msg);
    } finally {
      setChecking(false);
    }
  };

  const loadSessions = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('chat_messages')
      .select('session_id, user_name, text, created_at, is_from_support')
      .order('created_at', { ascending: false });
    if (!data) return;
    const bySession = new Map<string, { user_name: string | null; last: string; last_at: string; count: number; last_from_user?: boolean }>();
    for (const m of data as (ChatMessage & { is_from_support?: boolean })[]) {
      if (!bySession.has(m.session_id)) {
        bySession.set(m.session_id, {
          user_name: !m.is_from_support ? (m.user_name ?? null) : null,
          last: m.text,
          last_at: m.created_at,
          count: 0,
          last_from_user: !m.is_from_support,
        });
      }
      const s = bySession.get(m.session_id)!;
      s.count++;
      if (!m.is_from_support && m.user_name) s.user_name = m.user_name;
    }
    setSessions(
      Array.from(bySession.entries())
        .map(([session_id, v]) => ({ session_id, ...v }))
        .sort((a, b) => new Date(b.last_at).getTime() - new Date(a.last_at).getTime())
    );
  };

  useEffect(() => {
    if (!authenticated || !supabase) return;
    loadSessions();
    const channel = supabase
      .channel('admin-sessions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, () => {
        loadSessions();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [authenticated]);

  useEffect(() => {
    if (!selectedSession || !supabase) return;
    const load = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', selectedSession)
        .order('created_at', { ascending: true });
      setMessages((data as ChatMessage[]) ?? []);
    };
    load();

    const channel = supabase
      .channel(`admin:${selectedSession}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${selectedSession}` }, () => {
        load();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addManager = async () => {
    if (!supabase || !addMyPassword.trim() || !addNewPassword.trim()) return;
    setAddStatus('idle');
    try {
      const { data, error } = await supabase.rpc('add_admin_password', {
        your_password: addMyPassword.trim(),
        new_password: addNewPassword.trim(),
        new_label: addLabel.trim() || null,
      });
      if (error) throw error;
      if (data) {
        setAddStatus('success');
        setAddMyPassword('');
        setAddNewPassword('');
        setAddLabel('');
        setShowAddManager(false);
      } else {
        setAddStatus('error');
      }
    } catch {
      setAddStatus('error');
    }
  };

  const sendReply = async () => {
    const text = replyText.trim();
    if (!text || !supabase || !selectedSession || sending) return;
    setSending(true);
    setReplyText('');
    try {
      await supabase.from('chat_messages').insert({
        session_id: selectedSession,
        user_name: null,
        text,
        is_from_support: true,
      });
    } catch (e) {
      console.error(e);
      setReplyText(text);
    } finally {
      setSending(false);
    }
  };

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Supabase not configured</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="w-full max-w-xs">
          <h1 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Manager login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-2"
          />
          {loginError && (
            <p className="text-sm text-red-500 mb-2">
              {loginError}
              <a href="/admin/diagnostic" className="block mt-1 text-[#B6FF2E] hover:underline">
                Test connection →
              </a>
            </p>
          )}
          <button
            onClick={checkPassword}
            disabled={!password.trim() || checking}
            className="w-full py-2 rounded-lg font-medium bg-[#B6FF2E] text-black disabled:opacity-50"
          >
            {checking ? 'Checking…' : 'Enter'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      <div className="w-72 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="font-semibold text-gray-900 dark:text-white">Chats</h1>
          <button
            onClick={() => setShowAddManager(!showAddManager)}
            className="mt-2 flex items-center gap-2 text-sm text-[#B6FF2E] hover:underline"
          >
            <UserPlus size={16} />
            Add manager
          </button>
          {showAddManager && (
            <div className="mt-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 space-y-2">
              <input
                type="password"
                value={addMyPassword}
                onChange={(e) => setAddMyPassword(e.target.value)}
                placeholder="Your password"
                className="w-full px-3 py-1.5 rounded text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
              <input
                type="password"
                value={addNewPassword}
                onChange={(e) => setAddNewPassword(e.target.value)}
                placeholder="New manager password"
                className="w-full px-3 py-1.5 rounded text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
              <input
                type="text"
                value={addLabel}
                onChange={(e) => setAddLabel(e.target.value)}
                placeholder="Name (optional)"
                className="w-full px-3 py-1.5 rounded text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
              <button
                onClick={addManager}
                className="w-full py-1.5 rounded text-sm font-medium bg-[#B6FF2E] text-black"
              >
                Add
              </button>
              {addStatus === 'success' && <p className="text-xs text-green-600">Manager added. Send them the password.</p>}
              {addStatus === 'error' && <p className="text-xs text-red-500">Wrong password or error.</p>}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.map((s) => (
            <button
              key={s.session_id}
              onClick={() => setSelectedSession(s.session_id)}
              className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedSession === s.session_id ? 'bg-[#B6FF2E]/20' : ''
              } ${s.last_from_user ? 'border-l-4 border-l-[#B6FF2E]' : ''}`}
            >
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {s.user_name || 'Anonymous'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{s.last_message}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {new Date(s.last_at).toLocaleString()}
                {s.last_from_user && ' • New'}
              </p>
            </button>
          ))}
          {sessions.length === 0 && (
            <p className="p-4 text-sm text-gray-500">No conversations yet</p>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.is_from_support ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                      m.is_from_support ? 'bg-[#B6FF2E] text-black' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {!m.is_from_support && m.user_name && (
                      <span className="text-xs font-medium opacity-80 block mb-1">{m.user_name}</span>
                    )}
                    <span className="whitespace-pre-wrap break-words">{m.text}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendReply()}
                placeholder="Reply…"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                onClick={sendReply}
                disabled={!replyText.trim() || sending}
                className="p-2 rounded-lg bg-[#B6FF2E] text-black disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
