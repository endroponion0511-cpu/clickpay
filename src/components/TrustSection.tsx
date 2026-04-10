import React from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { useLocale } from '../contexts/LocaleContext';

function MetricItem({ value, label, suffix = '', prefix = '' }: { value: number; label: string; suffix?: string; prefix?: string }) {
  const { ref, count } = useCountUp(value, 2000);
  return (
    <div className="trust-metric-card-wrap h-full min-h-0">
      <div
        ref={ref}
        className="trust-metric-card group relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[20px] sm:rounded-[22px] border border-[var(--border-color)]/70 bg-[var(--bg-secondary)]/55 px-3 py-7 sm:py-8 md:py-9 backdrop-blur-2xl transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--border-color)] hover:shadow-lg [box-shadow:0_8px_32px_rgba(0,0,0,0.18),0_1px_0_rgba(255,255,255,0.06)_inset,0_0_36px_rgba(182,255,46,0.035)_inset] [html[data-theme='light']_&]:bg-[var(--bg-secondary)]/85 [html[data-theme='light']_&]:shadow-[0_4px_24px_rgba(15,23,42,0.08),0_1px_0_rgba(255,255,255,0.9)_inset]"
      >
      <div className="pointer-events-none absolute inset-0 trust-metric-inner-base" aria-hidden />
      <div className="pointer-events-none absolute inset-0 trust-metric-breathe" aria-hidden />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="trust-metric-sweep" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-1.5 sm:gap-2">
        <div className="font-sora text-2xl font-semibold tracking-tight text-[#B6FF2E] tabular-nums sm:text-3xl md:text-4xl lg:text-[2.35rem]">
          {prefix}
          {count.toLocaleString()}
          {suffix}
        </div>
        <div className="max-w-[11rem] text-center text-[0.8125rem] font-medium leading-snug text-[var(--text-muted)] sm:max-w-none sm:text-sm">
          {label}
        </div>
      </div>
    </div>
    </div>
  );
}

export function TrustSection() {
  const { t } = useLocale();
  const m = t.trust.metrics;

  return (
    <section className="border-y border-[var(--border-color)] bg-[var(--bg-primary)] py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="mb-3 font-sora text-2xl font-bold text-[var(--text-primary)] sm:mb-4 sm:text-3xl md:text-4xl">
            {t.trust.title}{' '}
            <span className="trust-headline-breathe inline-block text-[#B6FF2E]">ClickPay</span>
          </h2>
          <p className="mx-auto max-w-2xl text-[var(--text-muted)]">{t.trust.subtitle}</p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <MetricItem value={12500} label={m.transfers} suffix="+" />
          <MetricItem value={50} label={m.countries} suffix="+" />
          <MetricItem value={99} label={m.success} suffix="%" />
          <MetricItem value={15} label={m.avgTime} />
        </div>
      </div>
    </section>
  );
}
