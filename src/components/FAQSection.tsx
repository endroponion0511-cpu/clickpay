import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useLocale();

  return (
    <section id="faq" className="py-12 sm:py-16 md:py-20 bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-sora text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3 sm:mb-4">
            {t.faq.title}
          </h2>
          <p className="text-[var(--text-muted)]">{t.faq.subtitle}</p>
        </div>

        <div className="space-y-4">
          {t.faq.items.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-xl transition-all duration-300 ${
                openIndex === index ? 'bg-[var(--bg-secondary)] border-[#B6FF2E]/30' : 'bg-transparent border-[var(--border-color)] hover:border-[var(--border-color)]/80'
              }`}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className={`font-medium text-lg ${openIndex === index ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`flex-shrink-0 ml-4 h-5 w-5 text-[var(--text-muted)] transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-[#B6FF2E]' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-5 pt-0 text-[var(--text-muted)] leading-relaxed">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
