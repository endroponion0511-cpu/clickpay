import React, { useState, useEffect, useRef } from 'react';
import { Send, UserPlus, CheckCircle, RotateCcw, ArrowLeft, Trash2 } from 'lucide-react';
import { supabase, type ChatMessage } from '../lib/supabase';

type SessionSummary = {
  session_id: string;
  user_name: string | null;
  last_message: string;
  last_at: string;
  count: number;
  last_from_user?: boolean;
  closed?: boolean;
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
  const [closedIds, setClosedIds] = useState<Set<string>>(new Set());
  const [closing, setClosing] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [cleanResult, setCleanResult] = useState<{ ok: boolean; deleted_messages?: number; deleted_closed_sessions?: number; deleted_abandoned_sessions?: number; error?: string } | null>(null);
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
    const messagesRes = await supabase
      .from('chat_messages')
      .select('session_id, user_name, text, created_at, is_from_support')
      .order('created_at', { ascending: false });
    const closedRes = await supabase.from('closed_chat_sessions').select('session_id');
    const closedSet = new Set(((closedRes.error ? [] : closedRes.data) ?? []).map((r: { session_id: string }) => r.session_id));
    setClosedIds(closedSet);
    const data = messagesRes.data;
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
        .map(([session_id, v]) => ({ session_id, ...v, closed: closedSet.has(session_id) }))
        .sort((a, b) => {
          const aClosed = closedSet.has(a.session_id) ? 1 : 0;
          const bClosed = closedSet.has(b.session_id) ? 1 : 0;
          if (aClosed !== bClosed) return aClosed - bClosed;
          return new Date(b.last_at).getTime() - new Date(a.last_at).getTime();
        })
    );
  };

  const closeChat = async () => {
    if (!supabase || !selectedSession || !password.trim() || closing) return;
    setClosing(true);
    try {
      const { data, error } = await supabase.rpc('close_chat_session', { pwd: password.trim(), sid: selectedSession });
      if (error) throw error;
      if (data) {
        setClosedIds((prev) => new Set([...prev, selectedSession]));
        setSelectedSession(null);
        loadSessions();
      }
    } finally {
      setClosing(false);
    }
  };

  const reopenChat = async () => {
    if (!supabase || !selectedSession || !password.trim() || closing) return;
    setClosing(true);
    try {
      const { data, error } = await supabase.rpc('reopen_chat_session', { pwd: password.trim(), sid: selectedSession });
      if (error) throw error;
      if (data) {
        setClosedIds((prev) => {
          const next = new Set(prev);
          next.delete(selectedSession);
          return next;
        });
        loadSessions();
      }
    } finally {
      setClosing(false);
    }
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

  const cleanupHistory = async () => {
    if (!supabase || !password.trim() || cleaning) return;
    setCleaning(true);
    setCleanResult(null);
    try {
      const { data, error } = await supabase.rpc('cleanup_chat_history', { pwd: password.trim() });
      if (error) throw error;
      setCleanResult(data as typeof cleanResult);
      if (data?.ok) loadSessions();
    } catch (e) {
      setCleanResult({ ok: false, error: e instanceof Error ? e.message : 'Error' });
    } finally {
      setCleaning(false);
    }
  };

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
      <div
        className="h-[100dvh] min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <p className="text-gray-600 dark:text-gray-400">Supabase not configured</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div
        className="h-[100dvh] min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4"
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
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
    <div
      className="h-[100dvh] min-h-screen flex flex-col md:flex-row overflow-hidden bg-gray-100 dark:bg-gray-900"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {/* Sidebar: hidden on mobile when chat selected */}
      <div
        className={`w-full md:w-72 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800 min-h-0 ${
          selectedSession ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="font-semibold text-gray-900 dark:text-white">Chats</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddManager(!showAddManager)}
              className="flex items-center gap-2 text-sm text-[#B6FF2E] hover:underline"
            >
              <UserPlus size={16} />
              Add manager
            </button>
            <button
              onClick={cleanupHistory}
              disabled={cleaning || !password.trim()}
              className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 hover:underline disabled:opacity-50"
            >
              <Trash2 size={16} />
              {cleaning ? 'Cleaning…' : 'Clean history'}
            </button>
          </div>
          {cleanResult && (
            <p className={`mt-2 text-xs ${cleanResult.ok ? 'text-green-600' : 'text-red-500'}`}>
              {cleanResult.ok
                ? `Cleaned: ${cleanResult.deleted_messages ?? 0} messages, ${(cleanResult.deleted_closed_sessions ?? 0) + (cleanResult.deleted_abandoned_sessions ?? 0)} sessions`
                : cleanResult.error}
            </p>
          )}
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
        <div className="flex-1 overflow-y-auto min-h-0">
          {sessions.map((s) => (
            <button
              key={s.session_id}
              onClick={() => setSelectedSession(s.session_id)}
              className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedSession === s.session_id ? 'bg-[#B6FF2E]/20' : ''
              } ${s.last_from_user && !s.closed ? 'border-l-4 border-l-[#B6FF2E]' : ''} ${s.closed ? 'opacity-75' : ''}`}
            >
              <p className="font-medium text-gray-900 dark:text-white truncate flex items-center gap-2">
                {s.user_name || 'Anonymous'}
                {s.closed && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400">
                    Closed
                  </span>
                )}
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
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        {selectedSession ? (
          <>
            <div
              className="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0"
              style={{ minHeight: 44 }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => setSelectedSession(null)}
                  className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0"
                  aria-label="Back to chats"
                >
                  <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {closedIds.has(selectedSession) ? 'Closed' : 'Open'}
                </span>
              </div>
              <div className="flex gap-2 shrink-0">
                {closedIds.has(selectedSession) ? (
                  <button
                    onClick={reopenChat}
                    disabled={closing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    <RotateCcw size={14} />
                    Reopen
                  </button>
                ) : (
                  <button
                    onClick={closeChat}
                    disabled={closing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 disabled:opacity-50"
                  >
                    <CheckCircle size={14} />
                    Close chat
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
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
            <div
              className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 shrink-0 bg-white dark:bg-gray-800"
              style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
            >
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendReply()}
                placeholder="Reply…"
                className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
          <div className="flex-1 hidden md:flex items-center justify-center text-gray-500">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
