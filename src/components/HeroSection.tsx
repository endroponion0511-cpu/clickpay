import React, { useState } from 'react';
import { ArrowUpRight, MessageCircle, Send, TrendingUp, TrendingDown, Activity, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { HeroCalculateModal } from './HeroCalculateModal';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { useLocale } from '../contexts/LocaleContext';

export function HeroSection() {
  const { rates, loading, error } = useExchangeRates();
  const { t } = useLocale();
  const [calculateModalOpen, setCalculateModalOpen] = useState(false);

  return (
    <section className="relative pt-24 sm:pt-28 md:pt-36 lg:pt-40 pb-12 sm:pb-16 md:pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] lg:w-[1000px] h-[300px] sm:h-[400px] lg:h-[500px] bg-[#B6FF2E]/5 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-16 xl:gap-20 items-center">
          <div className="order-2 lg:order-1 flex flex-col gap-7 sm:gap-9 lg:gap-10">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {t.hero.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border shadow-sm"
                  style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--badge-text)', borderColor: 'var(--badge-border)' }}
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:gap-6">
              <h1 className="font-sora text-2xl min-[375px]:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-[var(--text-primary)] leading-[1.12] sm:leading-[1.1] tracking-[-0.02em]">
                {t.hero.title}{' '}
                <span className="text-[var(--text-primary)]">Click</span>
                <span className="text-[#B6FF2E]">Pay</span>
                <span className="text-[var(--text-primary)]">!</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#B6FF2E] max-w-2xl leading-relaxed">
                {t.hero.lead}
              </p>
            </div>

            <p className="text-base sm:text-lg md:text-xl text-[var(--text-muted)] max-w-2xl leading-[1.65] sm:leading-[1.7]">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Button
                size="lg"
                className="font-semibold w-full sm:w-auto justify-center"
                onClick={() => setCalculateModalOpen(true)}
              >
                {t.hero.calculateBtn}
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="flex gap-3">
                <Button variant="secondary" size="lg" className="px-4" aria-label="WhatsApp">
                  <MessageCircle className="h-5 w-5 text-[#B6FF2E]" />
                </Button>
                <Button variant="secondary" size="lg" className="px-4" aria-label="Telegram">
                  <Send className="h-5 w-5 text-[#B6FF2E]" />
                </Button>
              </div>
            </div>
          </div>

          <div className="relative w-full min-w-0 order-1 lg:order-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#B6FF2E]/20 to-transparent rounded-2xl blur-lg opacity-50" />
            <Card className="relative bg-[var(--bg-primary)] border-[var(--border-color)] shadow-2xl w-full min-w-0 overflow-hidden" noPadding>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-[var(--border-color)]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="ml-2 sm:ml-4 px-2 sm:px-3 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[9px] sm:text-[10px] text-[var(--text-muted)] font-mono flex-1 min-w-0 truncate text-center">
                  dashboard.clickpay.io/live-rates
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {error && <p className="text-xs text-amber-500/80 mb-2">{t.hero.ratesError}</p>}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    Live Exchange Rates
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[#B6FF2E] hover:border-[#B6FF2E]/50 transition-colors"
                      aria-label="Rates update every 3s"
                      title="Updates every 3s"
                    >
                      <RefreshCw className="h-4 w-4 animate-spin-3s" />
                    </button>
                    <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                      <Activity className="h-3.5 w-3.5 text-[#B6FF2E]" />
                      <span className="text-xs text-[var(--text-muted)]">{t.hero.status}</span>
                      <span className="text-xs font-medium text-[#B6FF2E]">OK</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B6FF2E] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B6FF2E]" />
                      </span>
                      <span className="text-xs text-[#B6FF2E] font-mono">LIVE</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {(loading && rates.length === 0
                    ? [
                        { pair: 'USD / THB', symbol: '$', rate: '—', change: '—', up: true },
                        { pair: 'EUR / THB', symbol: '€', rate: '—', change: '—', up: true },
                        { pair: 'THB / RUB', symbol: '฿', rate: '—', change: '—', up: true },
                        { pair: 'USDT / THB', symbol: '₮', rate: '—', change: '—', up: true },
                      ]
                    : rates
                  ).map((item) => (
                    <div
                      key={item.pair}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[#B6FF2E]/30 transition-colors gap-2 min-w-0"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 rounded bg-[var(--bg-tertiary)] flex items-center justify-center text-sm sm:text-base font-bold text-[var(--text-primary)]" title={item.pair.split(' / ')[0]}>
                          {item.symbol}
                        </div>
                        <span className="font-medium text-[var(--text-primary)] text-sm sm:text-base truncate">{item.pair}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-mono text-base sm:text-lg text-[var(--text-primary)] font-bold">{item.rate}</div>
                        <div className={`text-xs font-mono flex items-center justify-end gap-1 ${item.up ? 'text-[#B6FF2E]' : 'text-red-400'}`}>
                          {item.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {item.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[var(--border-color)]">
                  <div>
                    <div className="text-xs text-[var(--text-muted)] mb-1">{t.hero.processedToday}</div>
                    <div className="font-mono text-xl text-[var(--text-primary)] font-bold">847</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-muted)] mb-1">{t.hero.avgRate}</div>
                    <div className="font-mono text-xl text-[#B6FF2E] font-bold">
                      +0.3%
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <HeroCalculateModal open={calculateModalOpen} onClose={() => setCalculateModalOpen(false)} />
    </section>
  );
}
