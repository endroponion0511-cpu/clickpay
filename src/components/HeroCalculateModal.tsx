import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useLocale } from '../contexts/LocaleContext';
import { submitTelegramApplication } from '../lib/submitTelegramApplication';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function HeroCalculateModal({ open, onClose }: Props) {
  const { t } = useLocale();
  const m = t.hero.calculateModal;
  const c = t.ctaSection;
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!open) return;
    setName('');
    setContact('');
    setMessage('');
    setStatus('idle');
    setErrorMsg('');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    const result = await submitTelegramApplication(
      { name, contact, message, source: 'Hero calculate modal' },
      c.error
    );
    if (!result.ok) {
      setStatus('error');
      setErrorMsg(result.error);
      return;
    }
    setStatus('success');
    setName('');
    setContact('');
    setMessage('');
  }

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 backdrop-blur-[3px] ps-[max(0.75rem,env(safe-area-inset-left,0px))] pe-[max(0.75rem,env(safe-area-inset-right,0px))] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 sm:items-center sm:p-4 sm:pt-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-lg overflow-hidden rounded-t-2xl rounded-b-none border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl shadow-black/40 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          ref={closeRef}
          className="absolute end-3 top-3 z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] active:bg-[var(--bg-tertiary)] transition-colors sm:end-3 sm:top-3 sm:h-10 sm:w-10 sm:min-h-[40px] sm:min-w-[40px]"
          aria-label={m.close}
          onClick={onClose}
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <div className="touch-scroll-ios max-h-[min(90dvh,720px)] overflow-y-auto overscroll-y-contain px-5 pb-[max(1.25rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] pt-14 sm:max-h-[min(88dvh,720px)] sm:px-6 sm:pb-6">
          <h2 id={titleId} className="font-sora text-balance pr-11 text-lg font-bold text-[var(--text-primary)] sm:pr-10 sm:text-xl">
            {m.title}
          </h2>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-[var(--text-muted)]">{m.lead}</p>
          <p className="mt-3 rounded-lg border border-[var(--badge-border)] bg-[var(--badge-bg)] px-3 py-2 text-xs leading-relaxed text-[var(--text-primary)] sm:text-sm">
            <span className="font-medium text-[var(--badge-text)]">Telegram: </span>
            {m.telegramNote}
          </p>

          <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
            <Input
              name="name"
              placeholder={c.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={status === 'loading' || status === 'success'}
              autoComplete="name"
            />
            <Input
              name="contact"
              placeholder={c.contactPlaceholder}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              disabled={status === 'loading' || status === 'success'}
              autoComplete="tel"
            />
            <textarea
              name="message"
              className="w-full min-h-[7rem] resize-none rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[#B6FF2E] focus:ring-1 focus:ring-[#B6FF2E] focus:outline-none transition-colors disabled:opacity-60"
              placeholder={c.messagePlaceholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
            />
            {status === 'success' && (
              <p className="text-sm font-medium text-[#B6FF2E]">{c.success}</p>
            )}
            {status === 'error' && <p className="text-sm text-red-500">{errorMsg}</p>}
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="min-h-[44px] w-full sm:w-auto sm:min-w-[7rem]"
                onClick={onClose}
              >
                {m.close}
              </Button>
              <Button
                type="submit"
                className="min-h-[44px] w-full font-semibold sm:w-auto sm:min-w-[10rem]"
                disabled={status === 'loading' || status === 'success'}
              >
                {status === 'loading' ? c.submitting : c.submit}
              </Button>
            </div>
            <p className="text-center text-[0.65rem] leading-snug text-[var(--text-muted)] sm:text-xs">{c.privacy}</p>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
