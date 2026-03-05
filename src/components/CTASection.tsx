import React, { useState } from 'react';
import { Mail, MessageCircle, Send, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { useLocale } from '../contexts/LocaleContext';

const API_URL = '/api/send-to-telegram';

export function CTASection() {
  const { t } = useLocale();
  const c = t.ctaSection;
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, message, source: 'CTA form' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || c.error);
      }
      setStatus('success');
      setName('');
      setContact('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : c.error);
    }
  }

  return (
    <section id="cta" className="py-12 sm:py-16 md:py-20 bg-[var(--bg-primary)] relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#B6FF2E]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h2 className="font-sora text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 sm:mb-6">
              {c.title} <br />
              <span className="text-[#B6FF2E]">{c.titleHighlight}</span>
            </h2>
            <p className="text-[var(--text-muted)] mb-8">{c.subtitle}</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="name"
                  placeholder={c.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={status === 'loading'}
                />
                <Input
                  name="contact"
                  placeholder={c.contactPlaceholder}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  disabled={status === 'loading'}
                />
              </div>
              <textarea
                name="message"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[#B6FF2E] focus:ring-1 focus:ring-[#B6FF2E] focus:outline-none transition-colors h-32 resize-none disabled:opacity-60"
                placeholder={c.messagePlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === 'loading'}
              />
              {status === 'success' && (
                <p className="text-sm text-[#B6FF2E] font-medium">{c.success}</p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-500">{errorMsg}</p>
              )}
              <Button
                type="submit"
                size="lg"
                fullWidth
                className="font-bold text-lg"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? c.submitting : c.submit}
              </Button>
              <p className="text-xs text-[var(--text-muted)] text-center mt-4">{c.privacy}</p>
            </form>
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <Card className="bg-[var(--bg-secondary)] border-[var(--border-color)]">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">{c.contacts}</h3>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[#B6FF2E]">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-muted)]">Email</div>
                    <div className="text-[var(--text-primary)] font-medium">info@clickpay.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[#B6FF2E]">
                    <Send size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-muted)]">Telegram</div>
                    <div className="text-[var(--text-primary)] font-medium">@clickpay_support</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[#B6FF2E]">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-muted)]">WhatsApp</div>
                    <div className="text-[var(--text-primary)] font-medium">+66 XX XXX XXXX</div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[var(--border-color)]">
                  <div className="flex items-center gap-3 text-[var(--text-muted)]">
                    <Clock size={16} />
                    <span>{c.schedule}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
