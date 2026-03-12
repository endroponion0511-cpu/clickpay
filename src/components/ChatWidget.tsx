import React, { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import { X, Send, Archive, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLocale } from '../contexts/LocaleContext';
import { supabase, type ChatMessage } from '../lib/supabase';

const SESSION_KEY = 'clickpay-chat-session';
const NAME_KEY = 'clickpay-chat-name';
const EMAIL_KEY = 'clickpay-chat-email';

function generateSessionId() {
  return crypto.randomUUID();
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [supabaseUnreachable, setSupabaseUnreachable] = useState(false);
  const [chatClosed, setChatClosed] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { t } = useLocale();


  useEffect(() => {
    fetch('/chat-globe.json')
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => setAnimationData(null));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(SESSION_KEY);
    const storedName = localStorage.getItem(NAME_KEY);
    const storedEmail = localStorage.getItem(EMAIL_KEY);
    if (stored) setSessionId(stored);
    if (storedName) {
      setUserName(storedName);
      setNameInput(storedName);
    }
    if (storedEmail) {
      setUserEmail(storedEmail);
      setEmailInput(storedEmail);
    }
  }, []);

  const testConnection = React.useCallback(async () => {
    if (!supabase) return false;
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { error } = await supabase.from('chat_messages').select('id').limit(1);
        if (error) throw error;
        setSupabaseUnreachable(false);
        return true;
      } catch {
        if (i === maxRetries - 1) {
          setSupabaseUnreachable(true);
          return false;
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
    return false;
  }, []);

  useEffect(() => {
    testConnection();
  }, [testConnection]);

  useEffect(() => {
    if (!sessionId || !supabase || supabaseUnreachable) return;
    const load = async () => {
      try {
        const { data } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });
        setMessages((data as ChatMessage[]) ?? []);
      } catch {
        setSupabaseUnreachable(true);
      }
    };
    const checkClosed = async () => {
      const { data } = await supabase
        .from('closed_chat_sessions')
        .select('session_id')
        .eq('session_id', sessionId)
        .maybeSingle();
      setChatClosed(!!data);
    };
    load();
    checkClosed();

    const channel = supabase
      .channel(`chat:${sessionId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` }, () => {
        load();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'closed_chat_sessions', filter: `session_id=eq.${sessionId}` }, () => {
        setChatClosed(true);
      })
      .subscribe();

    const pollInterval = isOpen ? setInterval(load, 3000) : null;

    return () => {
      supabase.removeChannel(channel);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [sessionId, supabaseUnreachable, isOpen]);

  useEffect(() => {
    if (isOpen && sessionId && supabase) {
      supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .then(({ data }) => setMessages((data as ChatMessage[]) ?? []));
    }
  }, [isOpen, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  const startChat = async () => {
    const name = nameInput.trim();
    const email = emailInput.trim();
    if (!name || !email) return;

    const isGmail = /^[^@\s]+@gmail\.com$/i.test(email);
    if (!isGmail) {
      alert('Введите Gmail-адрес вида example@gmail.com');
      return;
    }

    setUserName(name);
    setUserEmail(email);
    let sid = sessionId;
    if (!sid) {
      sid = generateSessionId();
      setSessionId(sid);
      localStorage.setItem(SESSION_KEY, sid);
    }
    localStorage.setItem(NAME_KEY, name);
    localStorage.setItem(EMAIL_KEY, email);

    if (supabase && sid) {
      try {
        await supabase.from('chat_messages').insert({
          session_id: sid,
          user_name: name,
          text: `Email: ${email}`,
          is_from_support: false,
        });
      } catch {
        // ignore
      }
    }
  };

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || !supabase || !sessionId || sending) return;
    setSending(true);
    setInputText('');
    const optimisticMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      session_id: sessionId,
      user_name: userName,
      text,
      is_from_support: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    try {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        user_name: userName,
        text,
        is_from_support: false,
      });
      const hasSupportReply = messages.some((m) => m.is_from_support);
      if (!hasSupportReply) {
        const autoReplyText = t.chat.autoReply.replace('{name}', userName || '');
        await supabase.from('chat_messages').insert({
          session_id: sessionId,
          user_name: null,
          text: autoReplyText,
          is_from_support: true,
        });
      }
    } catch (e) {
      console.error(e);
      setInputText(text);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasSupabase = !!supabase;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 lg:bottom-8 z-40 w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#B6FF2E] focus:ring-offset-2 overflow-hidden isolate"
        style={{
          backgroundColor: theme === 'dark' ? '#1a1b24' : '#ffffff',
          border: '3px solid #B6FF2E',
          boxShadow: '0 4px 20px rgba(182, 255, 46, 0.4), 0 0 40px rgba(182, 255, 46, 0.15)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          contain: 'layout paint',
        }}
        aria-label="Open chat"
      >
        <div
          className="w-14 h-14 shrink-0 overflow-hidden rounded-full [clip-path:circle(50%)]"
          style={{
            filter: theme === 'dark' ? 'invert(1)' : 'none',
            transform: 'scale(1.25)',
            contain: 'paint',
          }}
        >
          {animationData && (
            <Lottie
              animationData={animationData}
              loop
              style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }}
            />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col sm:flex-row sm:items-end sm:justify-end sm:p-4 sm:pb-8">
          {/* Overlay: on mobile full-screen chat hides it; on desktop dims background */}
          <div
            className="hidden sm:block absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="relative w-full sm:max-w-sm h-full sm:h-[480px] sm:rounded-2xl sm:shadow-2xl overflow-hidden flex flex-col flex-1 sm:flex-initial"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between p-4 border-b shrink-0"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                {t.chat.title}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {!hasSupabase ? (
              <div className="flex-1 p-4 flex flex-col items-center justify-center text-center" style={{ color: 'var(--text-muted)' }}>
                <p className="text-sm mb-2">{t.chat.connecting}</p>
                <p className="text-xs opacity-80">Configure Supabase in .env</p>
              </div>
            ) : supabaseUnreachable ? (
              <div className="flex-1 p-6 flex flex-col items-center justify-center">
                <p className="text-sm mb-4 text-center" style={{ color: 'var(--text-muted)' }}>
                  {t.chat.retryHint}
                </p>
                <button
                  onClick={async () => {
                    setRetrying(true);
                    await testConnection();
                    setRetrying(false);
                  }}
                  disabled={retrying}
                  className="w-full max-w-xs py-3 px-4 rounded-lg font-medium transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: '#B6FF2E', color: '#000' }}
                >
                  {retrying ? t.chat.connecting : t.chat.retry}
                </button>
              </div>
            ) : !userName ? (
              <div className="flex-1 p-4 flex flex-col">
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  {t.chat.typeName}
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder={t.chat.namePlaceholder}
                    className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#B6FF2E]"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="your@gmail.com"
                    className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#B6FF2E]"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && startChat()}
                  />
                </div>
                <button
                  onClick={startChat}
                  disabled={!nameInput.trim() || !emailInput.trim()}
                  className="mt-4 w-full py-3 px-4 rounded-lg font-medium transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: '#B6FF2E', color: '#000' }}
                >
                  {t.chat.start}
                </button>
              </div>
            ) : (
              <>
                {chatClosed ? (
                  <div className="flex-1 flex flex-col p-4 overflow-hidden">
                    <button
                      onClick={() => setHistoryExpanded(!historyExpanded)}
                      className="p-4 rounded-xl flex items-center gap-3 w-full text-left transition-colors hover:opacity-90 shrink-0"
                      style={{
                        backgroundColor: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'rgba(182, 255, 46, 0.15)' }}
                      >
                        <Archive className="w-5 h-5" style={{ color: '#B6FF2E' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {t.chat.closedDialogue}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {t.chat.closedDialogueDesc}
                        </p>
                      </div>
                      {historyExpanded ? <ChevronUp size={18} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />}
                    </button>
                    {historyExpanded && (
                      <div className="flex-1 overflow-y-auto mt-3 space-y-2 min-h-0">
                        {messages.map((m) => (
                          <div
                            key={m.id}
                            className={`flex ${m.is_from_support ? 'justify-start' : 'justify-end'}`}
                          >
                            <div
                              className="max-w-[85%] px-3 py-2 rounded-xl text-sm"
                              style={{
                                backgroundColor: m.is_from_support ? 'var(--bg-secondary)' : 'rgba(182, 255, 46, 0.2)',
                                color: m.is_from_support ? 'var(--text-primary)' : 'var(--text-primary)',
                                border: '1px solid var(--border-color)',
                              }}
                            >
                              {m.is_from_support && (
                                <span className="text-xs font-medium opacity-80 block mb-1">Support</span>
                              )}
                              <span className="whitespace-pre-wrap break-words">{m.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 shrink-0">
                      <button
                        onClick={() => {
                          localStorage.removeItem(SESSION_KEY);
                          localStorage.removeItem(NAME_KEY);
                          localStorage.removeItem(EMAIL_KEY);
                          setSessionId(null);
                          setUserName('');
                          setNameInput('');
                          setUserEmail('');
                          setEmailInput('');
                          setMessages([]);
                          setChatClosed(false);
                          setHistoryExpanded(false);
                        }}
                        className="w-full py-3 px-4 rounded-xl font-medium transition-all hover:opacity-90"
                        style={{ backgroundColor: '#B6FF2E', color: '#000' }}
                      >
                        {t.chat.startNewChat}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {messages.length === 0 && (
                        <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                          {t.chat.desc}
                        </p>
                      )}
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className={`flex ${m.is_from_support ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className="max-w-[85%] px-4 py-2 rounded-2xl text-sm"
                            style={{
                              backgroundColor: m.is_from_support ? 'var(--bg-tertiary)' : '#B6FF2E',
                              color: m.is_from_support ? 'var(--text-primary)' : '#000',
                            }}
                          >
                            {m.is_from_support && (
                              <span className="text-xs font-medium opacity-80 block mb-1">Support</span>
                            )}
                            <span className="whitespace-pre-wrap break-words">{m.text}</span>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                    <div
                      className="p-3 border-t flex flex-col gap-2 shrink-0"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t.chat.messagePlaceholder}
                        className="flex-1 px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#B6FF2E]"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
                        }}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!inputText.trim() || sending}
                        className="p-2 rounded-lg shrink-0 transition-opacity disabled:opacity-50"
                        style={{ backgroundColor: '#B6FF2E', color: '#000' }}
                        aria-label={t.chat.send}
                      >
                        <Send size={20} />
                      </button>
                    </div>
                    <button
                      onClick={async () => {
                        if (!supabase || !sessionId) return;
                        const { data } = await supabase.rpc('close_chat_session_client', { sid: sessionId });
                        if (data) setChatClosed(true);
                      }}
                      className="text-xs py-1.5 rounded transition-opacity hover:opacity-80"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {t.chat.endConversation}
                    </button>
                  </div>
                </>
              )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
