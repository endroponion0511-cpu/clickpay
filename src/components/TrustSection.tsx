import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { useCountUp } from '../hooks/useCountUp';
import { useLocale } from '../contexts/LocaleContext';

function MetricItem({ value, label, suffix = '', prefix = '' }: { value: number; label: string; suffix?: string; prefix?: string }) {
  const { ref, count } = useCountUp(value, 2000);
  return (
    <div ref={ref} className="text-center p-4 sm:p-6 border-r border-b sm:border-b-0 border-[var(--border-color)] last:border-r-0">
      <div className="font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#B6FF2E] mb-1 sm:mb-2 tabular-nums">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs sm:text-sm md:text-base text-[var(--text-muted)] font-medium leading-tight">{label}</div>
    </div>
  );
}

export function TrustSection() {
  const { t } = useLocale();
  const m = t.trust.metrics;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[var(--bg-primary)] border-y border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-sora text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3 sm:mb-4">
            {t.trust.title} <span className="text-[#B6FF2E]">ClickPay</span>
          </h2>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto">{t.trust.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-secondary)] overflow-hidden mb-12 sm:mb-16">
          <MetricItem value={12500} label={m.transfers} suffix="+" />
          <MetricItem value={50} label={m.countries} suffix="+" />
          <MetricItem value={99} label={m.success} suffix="%" />
          <MetricItem value={15} label={m.avgTime} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {t.trust.cards.map((item, index) => (
            <Card key={index} hoverEffect className="group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-6 w-6 text-[#B6FF2E] group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
