import React, { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import { X, Send, MessageCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLocale } from '../contexts/LocaleContext';
import { supabase, type ChatMessage } from '../lib/supabase';

const SESSION_KEY = 'clickpay-chat-session';
const NAME_KEY = 'clickpay-chat-name';

function generateSessionId() {
  return crypto.randomUUID();
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [supabaseUnreachable, setSupabaseUnreachable] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { t } = useLocale();

  const whatsappLink = import.meta.env.VITE_WHATSAPP_LINK ?? 'https://wa.me/66XXXXXXXXX';
  const telegramLink = import.meta.env.VITE_TELEGRAM_LINK ?? 'https://t.me/clickpay_support';

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
    if (stored) setSessionId(stored);
    if (storedName) {
      setUserName(storedName);
      setNameInput(storedName);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const testConnection = async () => {
      try {
        const { error } = await supabase.from('chat_messages').select('id').limit(1);
        if (error) throw error;
        setSupabaseUnreachable(false);
      } catch {
        setSupabaseUnreachable(true);
      }
    };
    testConnection();
  }, []);

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
    load();

    const channel = supabase
      .channel(`chat:${sessionId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` }, () => {
        load();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, supabaseUnreachable]);

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

  const startChat = () => {
    const name = nameInput.trim();
    if (!name) return;
    setUserName(name);
    let sid = sessionId;
    if (!sid) {
      sid = generateSessionId();
      setSessionId(sid);
      localStorage.setItem(SESSION_KEY, sid);
    }
    localStorage.setItem(NAME_KEY, name);
  };

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || !supabase || !sessionId || sending) return;
    setSending(true);
    setInputText('');
    try {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        user_name: userName,
        text,
        is_from_support: false,
      });
    } catch (e) {
      console.error(e);
      setInputText(text);
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
            transform: 'scale(0.85)',
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
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pb-24 lg:pb-8">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="relative w-full max-w-sm h-[480px] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
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
              <div className="flex-1 p-6 flex flex-col">
                <p className="text-sm mb-5 text-center" style={{ color: 'var(--text-muted)' }}>
                  {t.chat.descFallback}
                </p>
                <div className="space-y-3">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-[#B6FF2E]/50 hover:shadow-[0_0_20px_rgba(182,255,46,0.1)]"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(37, 211, 102, 0.15)' }}>
                      <MessageCircle className="w-6 h-6" style={{ color: '#25D366' }} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold">WhatsApp</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.chat.whatsappHint}</p>
                    </div>
                    <span className="text-[#B6FF2E] text-sm font-medium">→</span>
                  </a>
                  <a
                    href={telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-[#B6FF2E]/50 hover:shadow-[0_0_20px_rgba(182,255,46,0.1)]"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0, 136, 204, 0.15)' }}>
                      <Send className="w-6 h-6" style={{ color: '#0088cc' }} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold">Telegram</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.chat.telegramHint}</p>
                    </div>
                    <span className="text-[#B6FF2E] text-sm font-medium">→</span>
                  </a>
                </div>
              </div>
            ) : !userName ? (
              <div className="flex-1 p-4 flex flex-col">
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  {t.chat.typeName}
                </p>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder={t.chat.namePlaceholder}
                  className="w-full px-4 py-3 rounded-lg border mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B6FF2E]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && startChat()}
                />
                <button
                  onClick={startChat}
                  disabled={!nameInput.trim()}
                  className="w-full py-3 px-4 rounded-lg font-medium transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: '#B6FF2E', color: '#000' }}
                >
                  {t.chat.start}
                </button>
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
                  className="p-3 border-t flex gap-2 shrink-0"
                  style={{ borderColor: 'var(--border-color)' }}
                >
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
