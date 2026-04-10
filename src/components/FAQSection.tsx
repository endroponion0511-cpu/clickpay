import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useLocale();

  return (
    <section id="faq" className="border-t border-[var(--border-color)] bg-[var(--bg-primary)] py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="mb-3 font-sora text-2xl font-bold text-[var(--text-primary)] sm:text-3xl md:text-4xl">
            {t.faq.title}
          </h2>
          <p className="mx-auto max-w-2xl text-[var(--text-muted)]">{t.faq.subtitle}</p>
        </div>

        <div className="space-y-3">
          {t.faq.items.map((faqItem, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] transition-colors hover:border-[#B6FF2E]/25"
            >
              <button
                type="button"
                className="flex min-h-[48px] w-full touch-manipulation items-center justify-between gap-3 px-4 py-3.5 text-left active:bg-[var(--bg-tertiary)]/60 sm:min-h-[44px] sm:px-6 sm:py-4"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-sora text-balance text-base font-semibold leading-snug text-[var(--text-primary)] sm:text-lg">
                  {faqItem.q}
                </span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-[var(--text-muted)] transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-[#B6FF2E]' : ''
                  }`}
                  aria-hidden
                />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out motion-reduce:transition-none ${
                  openIndex === index
                    ? 'max-h-[min(12rem,48dvh)] overflow-y-auto overscroll-y-contain sm:max-h-52'
                    : 'max-h-0 overflow-hidden'
                } touch-scroll-ios`}
              >
                <p className="text-pretty px-4 pb-4 pt-0.5 text-sm leading-relaxed text-[var(--text-muted)] sm:px-6 sm:text-[0.9375rem]">
                  {faqItem.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
