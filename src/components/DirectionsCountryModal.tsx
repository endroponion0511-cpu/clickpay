import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X } from 'lucide-react';
import { Button } from './ui/Button';
import { useLocale } from '../contexts/LocaleContext';

type Props = {
  countryLabel: string;
  corridorsHeading: string;
  sortedCorridors: string[];
  onClose: () => void;
  onRequestQuote: () => void;
};

export function DirectionsCountryModal({
  countryLabel,
  corridorsHeading,
  sortedCorridors,
  onClose,
  onRequestQuote,
}: Props) {
  const { t } = useLocale();
  const d = t.directions;
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const title = d.countryModalTitle.replace(/\{country\}/g, countryLabel);

  useEffect(() => {
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
  }, [onClose]);

  const toggleRow = (index: number) => {
    setExpandedRow((prev) => (prev === index ? null : index));
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-black/55 backdrop-blur-[3px] ps-[max(0.75rem,env(safe-area-inset-left,0px))] pe-[max(0.75rem,env(safe-area-inset-right,0px))] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 sm:items-center sm:p-4 sm:pt-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[min(90dvh,36rem)] w-full max-w-md flex-col overflow-hidden rounded-t-2xl rounded-b-none border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl shadow-black/40 sm:max-h-[min(86dvh,40rem)] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          ref={closeRef}
          className="absolute end-3 top-3 z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] active:bg-[var(--bg-tertiary)] transition-colors sm:end-2.5 sm:top-2.5 sm:h-10 sm:w-10 sm:min-h-[40px] sm:min-w-[40px]"
          aria-label={d.countryModalClose}
          onClick={onClose}
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <div className="touch-scroll-ios min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-5 pb-4 pt-14 sm:px-6 sm:pb-5 sm:pt-[3.5rem]">
          <h2
            id={titleId}
            className="font-sora text-balance pr-11 text-base font-bold leading-snug text-[var(--text-primary)] sm:pr-10 sm:text-lg"
          >
            {title}
          </h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-[var(--text-muted)]">{d.countryModalBody}</p>

          {sortedCorridors.length > 0 && (
            <div className="mt-5">
              <p className="font-sora text-xs font-semibold uppercase tracking-wide text-[var(--text-primary)]">{corridorsHeading}</p>
              <p className="mt-1.5 text-pretty text-xs leading-snug text-[var(--text-muted)]">{d.countryModalCorridorsHint}</p>
              <div className="touch-scroll-ios mt-3 max-h-[min(12.5rem,32dvh)] overflow-y-auto overscroll-y-contain rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)]/40 sm:max-h-[min(13rem,34dvh)]">
                <ul className="divide-y divide-[var(--border-color)]">
                  {sortedCorridors.map((line, index) => {
                    const open = expandedRow === index;
                    return (
                      <li key={`${index}-${line.slice(0, 48)}`}>
                        <button
                          type="button"
                          className="flex min-h-[44px] w-full touch-manipulation items-start gap-2 px-3 py-3 text-left text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-tertiary)]/80 active:bg-[var(--bg-tertiary)]"
                          onClick={() => toggleRow(index)}
                          aria-expanded={open}
                        >
                          <span className="min-w-0 flex-1 leading-snug">{line}</span>
                          <ChevronDown
                            className={`mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${
                              open ? 'rotate-180 text-[#B6FF2E]' : ''
                            }`}
                            aria-hidden
                          />
                        </button>
                        {open && (
                          <div className="border-t border-[var(--border-color)] bg-[var(--bg-tertiary)]/35 px-3 py-3">
                            <p className="text-xs leading-relaxed text-[var(--text-muted)]">{d.countryModalRowNote}</p>
                            <Button
                              type="button"
                              className="mt-3 min-h-[40px] w-full font-semibold sm:w-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRequestQuote();
                                onClose();
                              }}
                            >
                              {d.countryModalCta}
                            </Button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] px-5 pb-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] pt-4 sm:px-6 sm:pb-4">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="min-h-[44px] w-full sm:w-auto"
              onClick={onClose}
            >
              {d.countryModalClose}
            </Button>
            <Button
              type="button"
              className="min-h-[44px] w-full font-semibold sm:w-auto"
              onClick={() => {
                onRequestQuote();
                onClose();
              }}
            >
              {d.countryModalCta}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
